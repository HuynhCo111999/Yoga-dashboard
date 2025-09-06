import { WhereFilterOp, query, where, getDocs } from "firebase/firestore";
import { authService } from "@/lib/firebase";
import { BaseApiService } from "./base";
import {
  Member,
  MemberCreateRequest,
  MemberUpdateRequest,
  MemberFilters,
  ApiResponse,
  PaginatedResponse,
} from "./types";

class MembersApiService extends BaseApiService {
  constructor() {
    super("members");
  }

  async createMember(
    memberData: MemberCreateRequest
  ): Promise<ApiResponse<Member>> {
    try {
      // Step 1: Use authService.signUp to create user (Firebase Auth + users collection)
      const { password, ...memberDataWithoutPassword } = memberData;
      const { packageId, ...memberDataWithoutPackageId } =
        memberDataWithoutPassword;

      const signUpResult = await authService.signUp(
        memberData.email,
        memberData.password,
        {
          name: memberData.name,
          role: "member",
        }
      );

      if (signUpResult.error || !signUpResult.user) {
        return {
          data: null,
          error: signUpResult.error || "Không thể tạo tài khoản người dùng",
          success: false,
        };
      }

      // Step 2: Create member document in 'members' collection
      const memberDoc = {
        ...memberDataWithoutPackageId,
        id: signUpResult.user.uid,
        role: "member" as const,
        membershipStatus: "active" as const,
        remainingClasses: 0,
        joinDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD format
        ...(packageId && { currentPackage: packageId }),
      };

      // Remove undefined fields to prevent Firestore errors
      const cleanMemberDoc = Object.fromEntries(
        Object.entries(memberDoc).filter(([_, value]) => value !== undefined)
      ) as Omit<Member, "createdAt" | "updatedAt" | "id">;

      try {
        // Use setDoc with specific ID instead of addDoc with auto-generated ID
        const memberResult = await this.createWithId<Member>(
          signUpResult.user.uid,
          cleanMemberDoc
        );

        if (memberResult.success && memberResult.data) {
          // Keep the auth user for member login
          // The member will be able to sign in with their credentials

          return {
            ...memberResult,
            data: { ...memberResult.data, id: signUpResult.user.uid },
          };
        } else {
          // If member document creation fails, delete the user (authService handles cleanup)
          try {
            await signUpResult.user.delete();
          } catch (deleteError) {
            // Silent fail for cleanup
          }
          return {
            data: null,
            error:
              memberResult.error ||
              "Không thể tạo thông tin thành viên trong cơ sở dữ liệu",
            success: false,
          };
        }
      } catch (firestoreError) {
        // If any Firestore operation fails, delete the user
        try {
          await signUpResult.user.delete();
        } catch (deleteError) {
          // Silent fail for cleanup
        }
        return {
          data: null,
          error: "Lỗi kết nối cơ sở dữ liệu. Vui lòng kiểm tra quyền truy cập.",
          success: false,
        };
      }
    } catch (error: unknown) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async updateMember(
    id: string,
    memberData: MemberUpdateRequest
  ): Promise<ApiResponse<Member>> {
    // First, find the member document by field 'id' instead of document ID
    const memberResult = await this.findMemberByFieldId(id);
    if (!memberResult.success || !memberResult.data) {
      return {
        data: null,
        error: "Không tìm thấy thành viên để cập nhật",
        success: false,
      };
    }

    // Update using the actual document ID
    return this.update<Member>(memberResult.data.documentId, memberData);
  }

  async getMember(id: string): Promise<ApiResponse<Member>> {
    return this.getById<Member>(id);
  }

  // Helper method to find member by field 'id' instead of document ID
  private async findMemberByFieldId(
    fieldId: string
  ): Promise<ApiResponse<{ documentId: string; member: Member }>> {
    try {
      const q = query(this.getCollection(), where("id", "==", fieldId));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          data: null,
          error: "Không tìm thấy thành viên",
          success: false,
        };
      }

      const doc = querySnapshot.docs[0];
      const memberData = doc.data() as Member;

      return {
        data: {
          documentId: doc.id,
          member: memberData,
        },
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async deleteMember(id: string): Promise<ApiResponse<boolean>> {
    // Note: This only deletes the Firestore document
    // Consider also deleting the Firebase Auth user if needed
    return this.delete(id);
  }

  async getAllMembers(filters?: MemberFilters): Promise<ApiResponse<Member[]>> {
    const queryFilters: Array<{
      field: string;
      operator: WhereFilterOp;
      value: unknown;
    }> = [];

    if (filters?.status) {
      queryFilters.push({
        field: "membershipStatus",
        operator: "==",
        value: filters.status,
      });
    }

    if (filters?.package) {
      queryFilters.push({
        field: "currentPackage",
        operator: "==",
        value: filters.package,
      });
    }

    if (filters?.joinDateFrom) {
      queryFilters.push({
        field: "joinDate",
        operator: ">=",
        value: filters.joinDateFrom,
      });
    }

    if (filters?.joinDateTo) {
      queryFilters.push({
        field: "joinDate",
        operator: "<=",
        value: filters.joinDateTo,
      });
    }

    const result = await this.getAll<Member>({
      orderByField: "createdAt",
      orderDirection: "desc",
      filters: queryFilters,
    });

    // Apply search filter (client-side since Firestore doesn't support full-text search)
    if (result.success && result.data && filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      result.data = result.data.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm) ||
          member.email.toLowerCase().includes(searchTerm) ||
          (member.phone && member.phone.includes(searchTerm))
      );
    }

    return result;
  }

  async getMembersPaginated(
    _page: number = 1,
    limit: number = 10,
    filters?: MemberFilters
  ): Promise<PaginatedResponse<Member>> {
    const queryFilters: Array<{
      field: string;
      operator: WhereFilterOp;
      value: unknown;
    }> = [];

    if (filters?.status) {
      queryFilters.push({
        field: "membershipStatus",
        operator: "==",
        value: filters.status,
      });
    }

    if (filters?.package) {
      queryFilters.push({
        field: "currentPackage",
        operator: "==",
        value: filters.package,
      });
    }

    const result = await this.getPaginated<Member>(limit, undefined, {
      orderByField: "createdAt",
      orderDirection: "desc",
      filters: queryFilters,
    });

    // Apply search filter (client-side)
    if (result.success && result.data && filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      result.data = result.data.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm) ||
          member.email.toLowerCase().includes(searchTerm) ||
          (member.phone && member.phone.includes(searchTerm))
      );
    }

    return result;
  }

  async getMembersByPackage(packageId: string): Promise<ApiResponse<Member[]>> {
    return this.getAll<Member>({
      orderByField: "joinDate",
      orderDirection: "desc",
      filters: [
        {
          field: "currentPackage",
          operator: "==",
          value: packageId,
        },
      ],
    });
  }

  async getActiveMembers(): Promise<ApiResponse<Member[]>> {
    return this.getAll<Member>({
      orderByField: "joinDate",
      orderDirection: "desc",
      filters: [
        {
          field: "membershipStatus",
          operator: "==",
          value: "active",
        },
      ],
    });
  }

  async getMemberByEmail(email: string): Promise<ApiResponse<Member>> {
    const result = await this.getAll<Member>({
      filters: [
        {
          field: "email",
          operator: "==",
          value: email,
        },
      ],
      limitCount: 1,
    });

    if (result.success && result.data && result.data.length > 0) {
      return {
        data: result.data[0],
        error: null,
        success: true,
      };
    }

    return {
      data: null,
      error: "Không tìm thấy thành viên với email này",
      success: false,
    };
  }

  async updateMemberPackage(
    memberId: string,
    packageId: string,
    classLimit: number
  ): Promise<ApiResponse<Member>> {
    return this.update<Member>(memberId, {
      currentPackage: packageId,
      remainingClasses: classLimit,
      membershipStatus: "active",
    });
  }

  async updateMemberClasses(
    memberId: string,
    remainingClasses: number
  ): Promise<ApiResponse<Member>> {
    return this.update<Member>(memberId, {
      remainingClasses,
    });
  }

  async suspendMember(memberId: string): Promise<ApiResponse<Member>> {
    return this.update<Member>(memberId, {
      membershipStatus: "suspended",
    });
  }

  async reactivateMember(memberId: string): Promise<ApiResponse<Member>> {
    return this.update<Member>(memberId, {
      membershipStatus: "active",
    });
  }

  async getMembersStats(): Promise<
    ApiResponse<{
      total: number;
      active: number;
      inactive: number;
      suspended: number;
      newThisMonth: number;
    }>
  > {
    try {
      const [totalResult, activeResult, inactiveResult, suspendedResult] =
        await Promise.all([
          this.count(),
          this.count([
            { field: "membershipStatus", operator: "==", value: "active" },
          ]),
          this.count([
            { field: "membershipStatus", operator: "==", value: "inactive" },
          ]),
          this.count([
            { field: "membershipStatus", operator: "==", value: "suspended" },
          ]),
        ]);

      // Get new members this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const newThisMonthResult = await this.count([
        {
          field: "createdAt",
          operator: ">=",
          value: this.stringToTimestamp(startOfMonth.toISOString()),
        },
      ]);

      if (
        !totalResult.success ||
        !activeResult.success ||
        !inactiveResult.success ||
        !suspendedResult.success ||
        !newThisMonthResult.success
      ) {
        return {
          data: null,
          error: "Không thể lấy thống kê thành viên",
          success: false,
        };
      }

      return {
        data: {
          total: totalResult.data || 0,
          active: activeResult.data || 0,
          inactive: inactiveResult.data || 0,
          suspended: suspendedResult.data || 0,
          newThisMonth: newThisMonthResult.data || 0,
        },
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }
}

export const membersApi = new MembersApiService();
