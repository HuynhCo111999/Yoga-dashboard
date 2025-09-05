import { WhereFilterOp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
      console.log("Creating member with email:", memberData.email);

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        memberData.email,
        memberData.password
      );

      console.log("Firebase Auth user created:", userCredential.user.uid);

      const { password: _, ...memberDataWithoutPassword } = memberData;

      // Create member document in Firestore
      const { packageId, ...memberDataWithoutPackageId } =
        memberDataWithoutPassword;
      const memberDoc = {
        ...memberDataWithoutPackageId,
        id: userCredential.user.uid,
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

      console.log("Creating member document:", cleanMemberDoc);

      try {
        const result = await this.create<Member>(cleanMemberDoc);

        if (result.success && result.data) {
          console.log("Member document created successfully:", result.data);
          // Update the user document with the Firebase Auth UID
          await this.update(userCredential.user.uid, {
            id: userCredential.user.uid,
          });

          // Keep the auth user for member login
          // The member will be able to sign in with their credentials

          return {
            ...result,
            data: { ...result.data, id: userCredential.user.uid },
          };
        } else {
          console.error("Failed to create member document:", result.error);
          // If Firestore document creation fails, delete the Firebase Auth user
          try {
            await userCredential.user.delete();
            console.log("Firebase Auth user deleted after Firestore failure");
          } catch (deleteError) {
            console.error("Failed to delete auth user:", deleteError);
          }
          return {
            data: null,
            error:
              result.error ||
              "Không thể tạo thông tin thành viên trong cơ sở dữ liệu",
            success: false,
          };
        }
      } catch (firestoreError) {
        console.error(
          "Firestore error during member creation:",
          firestoreError
        );
        // If Firestore document creation fails, delete the Firebase Auth user
        try {
          await userCredential.user.delete();
          console.log("Firebase Auth user deleted after Firestore error");
        } catch (deleteError) {
          console.error("Failed to delete auth user:", deleteError);
        }
        return {
          data: null,
          error: "Lỗi kết nối cơ sở dữ liệu. Vui lòng kiểm tra quyền truy cập.",
          success: false,
        };
      }
    } catch (error: unknown) {
      console.error("Error creating member:", error);

      // Handle Firebase Auth errors
      if (error && typeof error === "object" && "code" in error) {
        switch ((error as { code: string }).code) {
          case "auth/email-already-in-use":
            return {
              data: null,
              error: "Email này đã được sử dụng",
              success: false,
            };
          case "auth/weak-password":
            return {
              data: null,
              error: "Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn",
              success: false,
            };
          case "auth/invalid-email":
            return {
              data: null,
              error: "Email không hợp lệ",
              success: false,
            };
          default:
            return {
              data: null,
              error: `Lỗi tạo tài khoản: ${
                (error as unknown as { message: string }).message
              }`,
              success: false,
            };
        }
      }

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
    return this.update<Member>(id, memberData);
  }

  async getMember(id: string): Promise<ApiResponse<Member>> {
    return this.getById<Member>(id);
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
