import { BaseApiService } from "./base";
import { authService } from "@/lib/firebase";
import {
  User,
  UserCreateRequest,
  UserUpdateRequest,
  ApiResponse,
} from "./types";

class UsersApiService extends BaseApiService {
  constructor() {
    super("users");
  }

  async createUser(
    userData: UserCreateRequest
  ): Promise<ApiResponse<User>> {
    try {
      // Create Firebase Auth user
      const authResult = await authService.signUp(
        userData.email,
        userData.password,
        {
          name: userData.name,
          role: userData.role,
          phone: userData.phone,
        }
      );

      if (!authResult.user || authResult.error) {
        return {
          data: null,
          error: authResult.error || "Không thể tạo tài khoản xác thực",
          success: false,
        };
      }

      // The user document is already created in authService.signUp
      // Just return the user data
      const userDoc = {
        id: authResult.user.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as User;

      return {
        data: userDoc,
        error: null,
        success: true,
      };
    } catch (error: unknown) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async updateUser(
    id: string,
    userData: UserUpdateRequest
  ): Promise<ApiResponse<User>> {
    return this.update<User>(id, userData);
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    return this.getById<User>(id);
  }

  async deleteUser(id: string): Promise<ApiResponse<boolean>> {
    // Note: This only deletes the Firestore document
    // Consider also deleting the Firebase Auth user if needed
    return this.delete(id);
  }

  async getUserByEmail(email: string): Promise<ApiResponse<User>> {
    const result = await this.getAll<User>({
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
      error: "Không tìm thấy người dùng với email này",
      success: false,
    };
  }

  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.getAll<User>({
      orderByField: "createdAt",
      orderDirection: "desc",
    });
  }

  async getUsersByRole(role: "admin" | "member"): Promise<ApiResponse<User[]>> {
    return this.getAll<User>({
      orderByField: "createdAt",
      orderDirection: "desc",
      filters: [
        {
          field: "role",
          operator: "==",
          value: role,
        },
      ],
    });
  }
}

export const usersApi = new UsersApiService();
