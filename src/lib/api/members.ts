import { WhereFilterOp, query, where, getDocs } from 'firebase/firestore';
import { BaseApiService } from './base';
import { authService } from '@/lib/firebase';
import { Member, MemberCreateRequest, MemberUpdateRequest, MemberFilters, ApiResponse, PaginatedResponse } from './types';

class MembersApiService extends BaseApiService {
  constructor() {
    super('members');
  }

  async createMember(memberData: MemberCreateRequest): Promise<ApiResponse<Member>> {
    try {
      const { packageId, ...memberDataWithoutPackageId } = memberData;

      // Create user document first (without Firebase Auth to avoid admin logout)
      const userResult = await authService.createUserDocument(memberData.email, {
        name: memberData.name,
        role: 'member',
        phone: memberData.phone,
      });

      if (userResult.error) {
        return {
          data: null,
          error: userResult.error,
          success: false,
        };
      }

      const memberId = userResult.uid;

      // Get package info to set remainingClasses
      let remainingClasses = 0;
      if (packageId) {
        try {
          const { packagesApi } = await import('./packages');
          const packageResult = await packagesApi.getPackage(packageId);
          if (packageResult.success && packageResult.data) {
            remainingClasses = packageResult.data.classLimit;
          }
        } catch (err) {
          console.error('Error getting package info:', err);
        }
      }

      // Create member document in 'members' collection
      const memberDoc = {
        ...memberDataWithoutPackageId,
        id: memberId,
        role: 'member' as const,
        membershipStatus: 'active' as const,
        remainingClasses,
        joinDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        ...(packageId && {
          currentPackage: packageId,
          packageStartDate: new Date().toISOString().split('T')[0], // Set package start date
        }),
      };

      // Remove undefined fields to prevent Firestore errors
      const cleanMemberDoc = Object.fromEntries(Object.entries(memberDoc).filter(([, value]) => value !== undefined)) as Omit<Member, 'createdAt' | 'updatedAt' | 'id'>;

      // Create member document with user document ID
      const memberResult = await this.createWithId<Member>(memberId, cleanMemberDoc);

      if (memberResult.success && memberResult.data) {
        return {
          ...memberResult,
          data: { ...memberResult.data, id: memberId },
        };
      } else {
        return {
          data: null,
          error: memberResult.error || 'Không thể tạo thông tin thành viên trong cơ sở dữ liệu',
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

  async updateMember(id: string, memberData: MemberUpdateRequest): Promise<ApiResponse<Member>> {
    // First, find the member document by field 'id' instead of document ID
    const memberResult = await this.findMemberByFieldId(id);
    if (!memberResult.success || !memberResult.data) {
      return {
        data: null,
        error: 'Không tìm thấy thành viên để cập nhật',
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
  private async findMemberByFieldId(fieldId: string): Promise<ApiResponse<{ documentId: string; member: Member }>> {
    try {
      const q = query(this.getCollection(), where('id', '==', fieldId));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          data: null,
          error: 'Không tìm thấy thành viên',
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
    try {
      console.log('Starting delete process for member ID:', id);

      // First, find the member document by field 'id' instead of document ID
      const memberResult = await this.findMemberByFieldId(id);
      if (!memberResult.success || !memberResult.data) {
        return {
          data: false,
          error: 'Không tìm thấy thành viên để xóa',
          success: false,
        };
      }

      const member = memberResult.data.member;
      const documentId = memberResult.data.documentId;
      console.log('Found member:', member.name, 'Document ID:', documentId);

      // Step 1: Delete user document from 'users' collection using member ID
      try {
        console.log('Attempting to delete from users collection with ID:', id);
        // Import base service to directly access 'users' collection
        const usersService = new (await import('./base')).BaseApiService('users');
        const usersDeleteResult = await usersService.delete(id);
        console.log('Users collection deletion result:', usersDeleteResult);
      } catch (userError) {
        console.warn('Could not delete user document:', userError);
      }

      // Step 2: Delete member document from 'members' collection using document ID
      console.log('Attempting to delete member document with document ID:', documentId);
      const memberDeleteResult = await this.delete(documentId);
      console.log('Member document deletion result:', memberDeleteResult);

      if (!memberDeleteResult.success) {
        return {
          data: false,
          error: memberDeleteResult.error || 'Không thể xóa thông tin thành viên',
          success: false,
        };
      }

      // Step 3: Delete Firebase Auth user
      try {
        console.log('Attempting to delete Firebase Auth user for UID:', id);
        // Call API endpoint to delete Firebase Auth user
        const response = await fetch('/api/auth/delete-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: id }),
        });

        if (response.ok) {
          console.log('Firebase Auth user deleted successfully');
        } else {
          console.warn('Failed to delete Firebase Auth user:', await response.text());
        }
      } catch (authError) {
        console.warn('Could not delete Firebase Auth user:', authError);
      }

      // Step 4: Cancel all active session registrations for this member
      try {
        console.log('Attempting to cancel active sessions for member:', id);
        const { sessionsApi } = await import('./sessions');
        const sessionsResult = await sessionsApi.getMemberActiveSessions(id);

        if (sessionsResult.success && sessionsResult.data) {
          console.log('Found active sessions:', sessionsResult.data.length);
          // Cancel all active registrations
          for (const session of sessionsResult.data) {
            await sessionsApi.cancelRegistration(session.id, id);
          }
        }
      } catch (sessionError) {
        console.warn('Could not cancel session registrations:', sessionError);
      }

      console.log('Member deletion completed successfully');
      return {
        data: true,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error('Error in deleteMember:', error);
      return {
        data: false,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getAllMembers(filters?: MemberFilters): Promise<ApiResponse<Member[]>> {
    const queryFilters: Array<{
      field: string;
      operator: WhereFilterOp;
      value: unknown;
    }> = [];

    if (filters?.status) {
      queryFilters.push({
        field: 'membershipStatus',
        operator: '==',
        value: filters.status,
      });
    }

    if (filters?.package) {
      queryFilters.push({
        field: 'currentPackage',
        operator: '==',
        value: filters.package,
      });
    }

    if (filters?.joinDateFrom) {
      queryFilters.push({
        field: 'joinDate',
        operator: '>=',
        value: filters.joinDateFrom,
      });
    }

    if (filters?.joinDateTo) {
      queryFilters.push({
        field: 'joinDate',
        operator: '<=',
        value: filters.joinDateTo,
      });
    }

    const result = await this.getAll<Member>({
      orderByField: 'createdAt',
      orderDirection: 'desc',
      filters: queryFilters,
    });

    // Apply search filter (client-side since Firestore doesn't support full-text search)
    if (result.success && result.data && filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      result.data = result.data.filter((member) => member.name.toLowerCase().includes(searchTerm) || member.email.toLowerCase().includes(searchTerm) || (member.phone && member.phone.includes(searchTerm)));
    }

    return result;
  }

  async getMembersPaginated(_page: number = 1, limit: number = 10, filters?: MemberFilters): Promise<PaginatedResponse<Member>> {
    const queryFilters: Array<{
      field: string;
      operator: WhereFilterOp;
      value: unknown;
    }> = [];

    if (filters?.status) {
      queryFilters.push({
        field: 'membershipStatus',
        operator: '==',
        value: filters.status,
      });
    }

    if (filters?.package) {
      queryFilters.push({
        field: 'currentPackage',
        operator: '==',
        value: filters.package,
      });
    }

    const result = await this.getPaginated<Member>(limit, undefined, {
      orderByField: 'createdAt',
      orderDirection: 'desc',
      filters: queryFilters,
    });

    // Apply search filter (client-side)
    if (result.success && result.data && filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      result.data = result.data.filter((member) => member.name.toLowerCase().includes(searchTerm) || member.email.toLowerCase().includes(searchTerm) || (member.phone && member.phone.includes(searchTerm)));
    }

    return result;
  }

  async getMembersByPackage(packageId: string): Promise<ApiResponse<Member[]>> {
    return this.getAll<Member>({
      orderByField: 'joinDate',
      orderDirection: 'desc',
      filters: [
        {
          field: 'currentPackage',
          operator: '==',
          value: packageId,
        },
      ],
    });
  }

  async getActiveMembers(): Promise<ApiResponse<Member[]>> {
    return this.getAll<Member>({
      orderByField: 'joinDate',
      orderDirection: 'desc',
      filters: [
        {
          field: 'membershipStatus',
          operator: '==',
          value: 'active',
        },
      ],
    });
  }

  async getMemberByEmail(email: string): Promise<ApiResponse<Member>> {
    const result = await this.getAll<Member>({
      filters: [
        {
          field: 'email',
          operator: '==',
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
      error: 'Không tìm thấy thành viên với email này',
      success: false,
    };
  }

  // GIAI ĐOẠN 1: Kiểm tra và xử lý package hết hạn
  async checkAndExpirePackage(memberId: string): Promise<ApiResponse<{ wasExpired: boolean; member: Member | null }>> {
    try {
      const memberResult = await this.getById<Member>(memberId);
      if (!memberResult.success || !memberResult.data) {
        return {
          data: { wasExpired: false, member: null },
          error: 'Không tìm thấy thành viên',
          success: false,
        };
      }

      const member = memberResult.data;

      // Nếu không có package hoặc không có ngày bắt đầu package
      if (!member.currentPackage || !member.packageStartDate) {
        return {
          data: { wasExpired: false, member },
          error: null,
          success: true,
        };
      }

      // Lấy thông tin package để kiểm tra duration
      const { packagesApi } = await import('./packages');
      const packageResult = await packagesApi.getPackage(member.currentPackage);

      if (!packageResult.success || !packageResult.data) {
        return {
          data: { wasExpired: false, member },
          error: null,
          success: true,
        };
      }

      const packageData = packageResult.data;
      const packageStartDate = new Date(member.packageStartDate);
      const currentDate = new Date();
      const daysDiff = Math.floor((currentDate.getTime() - packageStartDate.getTime()) / (1000 * 60 * 60 * 24));

      // Kiểm tra nếu package đã hết hạn
      if (daysDiff >= packageData.duration) {
        // Package hết hạn - set remainingClasses về 0
        const updateResult = await this.update<Member>(memberId, {
          remainingClasses: 0,
          membershipStatus: 'expired' as const,
        });

        if (updateResult.success && updateResult.data) {
          return {
            data: { wasExpired: true, member: updateResult.data },
            error: null,
            success: true,
          };
        }
      }

      return {
        data: { wasExpired: false, member },
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: { wasExpired: false, member: null },
        error: this.handleError(error),
        success: false,
      };
    }
  }

  // GIAI ĐOẠN 2: Gia hạn package với logic add/replace
  async updateMemberPackage(memberId: string, packageId: string, classLimit: number, mode: 'add' | 'replace' = 'replace'): Promise<ApiResponse<Member>> {
    try {
      // Bước 1: Kiểm tra và xử lý package hết hạn trước
      const expireCheckResult = await this.checkAndExpirePackage(memberId);
      if (!expireCheckResult.success) {
        return {
          data: null,
          error: expireCheckResult.error,
          success: false,
        };
      }

      const currentMember = expireCheckResult.data?.member;
      if (!currentMember) {
        return {
          data: null,
          error: 'Không tìm thấy thông tin thành viên',
          success: false,
        };
      }

      // Bước 2: Tính toán remainingClasses dựa trên mode
      let newRemainingClasses = classLimit;

      if (mode === 'add' && !expireCheckResult.data?.wasExpired) {
        // Nếu mode là 'add' và package chưa hết hạn, cộng thêm vào số buổi hiện có
        const currentRemaining = currentMember.remainingClasses || 0;

        // Xử lý gói unlimited (-1)
        if (classLimit === -1 || currentRemaining === -1) {
          newRemainingClasses = -1; // Unlimited
        } else {
          newRemainingClasses = currentRemaining + classLimit;
        }
      }

      // Bước 3: Cập nhật package với ngày bắt đầu mới
      const updateData = {
        currentPackage: packageId,
        packageStartDate: new Date().toISOString().split('T')[0], // Ngày gia hạn
        remainingClasses: newRemainingClasses,
        membershipStatus: 'active' as const,
      };

      return this.update<Member>(memberId, updateData);
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async updateMemberClasses(memberId: string, remainingClasses: number): Promise<ApiResponse<Member>> {
    return this.update<Member>(memberId, {
      remainingClasses,
    });
  }

  async suspendMember(memberId: string): Promise<ApiResponse<Member>> {
    return this.update<Member>(memberId, {
      membershipStatus: 'suspended',
    });
  }

  async reactivateMember(memberId: string): Promise<ApiResponse<Member>> {
    return this.update<Member>(memberId, {
      membershipStatus: 'active',
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
      const [totalResult, activeResult, inactiveResult, suspendedResult] = await Promise.all([this.count(), this.count([{ field: 'membershipStatus', operator: '==', value: 'active' }]), this.count([{ field: 'membershipStatus', operator: '==', value: 'inactive' }]), this.count([{ field: 'membershipStatus', operator: '==', value: 'suspended' }])]);

      // Get new members this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const newThisMonthResult = await this.count([
        {
          field: 'createdAt',
          operator: '>=',
          value: this.stringToTimestamp(startOfMonth.toISOString()),
        },
      ]);

      if (!totalResult.success || !activeResult.success || !inactiveResult.success || !suspendedResult.success || !newThisMonthResult.success) {
        return {
          data: null,
          error: 'Không thể lấy thống kê thành viên',
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
