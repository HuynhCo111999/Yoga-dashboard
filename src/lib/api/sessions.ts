import { WhereFilterOp } from "firebase/firestore";
import { BaseApiService } from "./base";
import {
  Session,
  SessionRegistration,
  SessionCreateRequest,
  SessionUpdateRequest,
  SessionRegistrationRequest,
  SessionFilters,
  ApiResponse,
} from "./types";

class SessionsApiService extends BaseApiService {
  constructor() {
    super("sessions");
  }

  async createSession(
    sessionData: SessionCreateRequest
  ): Promise<ApiResponse<Session>> {
    // Get class information to populate session details
    const { classesApi } = await import("./classes");
    const classResult = await classesApi.getById(sessionData.classId);

    let className = "Unknown Class";
    let instructor = "Unknown Instructor";
    let defaultCapacity = 10;
    let difficulty: "beginner" | "intermediate" | "advanced" = "beginner";

    if (classResult.success && classResult.data) {
      className = classResult.data.name;
      instructor = classResult.data.instructor;
      defaultCapacity = classResult.data.maxCapacity;
      difficulty = classResult.data.difficulty;
    }

    const sessionDoc = {
      ...sessionData,
      className,
      instructor,
      difficulty,
      capacity: sessionData.capacity || defaultCapacity,
      registeredCount: 0,
      status: "scheduled" as const,
      registrations: [],
    };

    return this.create<Session>(sessionDoc);
  }

  async updateSession(
    id: string,
    sessionData: SessionUpdateRequest
  ): Promise<ApiResponse<Session>> {
    return this.update<Session>(id, sessionData);
  }

  async getSession(id: string): Promise<ApiResponse<Session>> {
    return this.getById<Session>(id);
  }

  async deleteSession(id: string): Promise<ApiResponse<boolean>> {
    return this.delete(id);
  }

  async getAllSessions(
    filters?: SessionFilters
  ): Promise<ApiResponse<Session[]>> {
    const queryFilters: Array<{
      field: string;
      operator: WhereFilterOp;
      value: unknown;
    }> = [];

    if (filters?.classId) {
      queryFilters.push({
        field: "classId",
        operator: "==",
        value: filters.classId,
      });
    }

    if (filters?.instructor) {
      queryFilters.push({
        field: "instructor",
        operator: "==",
        value: filters.instructor,
      });
    }

    if (filters?.status) {
      queryFilters.push({
        field: "status",
        operator: "==",
        value: filters.status,
      });
    }

    if (filters?.dateFrom) {
      queryFilters.push({
        field: "date",
        operator: ">=",
        value: filters.dateFrom,
      });
    }

    if (filters?.dateTo) {
      queryFilters.push({
        field: "date",
        operator: "<=",
        value: filters.dateTo,
      });
    }

    const result = await this.getAll<Session>({
      orderByField: "date",
      orderDirection: "desc",
      filters: queryFilters,
    });

    // Apply search filter (client-side)
    if (result.success && result.data && filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      result.data = result.data.filter(
        (session) =>
          session.className.toLowerCase().includes(searchTerm) ||
          session.instructor.toLowerCase().includes(searchTerm)
      );
    }

    return result;
  }

  async getUpcomingSessions(limit?: number): Promise<ApiResponse<Session[]>> {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    return this.getAll<Session>({
      orderByField: "date",
      orderDirection: "asc",
      filters: [
        {
          field: "date",
          operator: ">=",
          value: today,
        },
        {
          field: "status",
          operator: "==",
          value: "scheduled",
        },
      ],
      limitCount: limit,
    });
  }

  async getTodaySessions(): Promise<ApiResponse<Session[]>> {
    const today = new Date().toISOString().split("T")[0];

    return this.getAll<Session>({
      orderByField: "startTime",
      orderDirection: "asc",
      filters: [
        {
          field: "date",
          operator: "==",
          value: today,
        },
      ],
    });
  }

  async getSessionsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<Session[]>> {
    return this.getAll<Session>({
      orderByField: "date",
      orderDirection: "asc",
      filters: [
        {
          field: "date",
          operator: ">=",
          value: startDate,
        },
        {
          field: "date",
          operator: "<=",
          value: endDate,
        },
      ],
    });
  }

  async getSessionsByClass(classId: string): Promise<ApiResponse<Session[]>> {
    return this.getAll<Session>({
      orderByField: "date",
      orderDirection: "desc",
      filters: [
        {
          field: "classId",
          operator: "==",
          value: classId,
        },
      ],
    });
  }

  async getSessionsByInstructor(
    instructor: string
  ): Promise<ApiResponse<Session[]>> {
    return this.getAll<Session>({
      orderByField: "date",
      orderDirection: "desc",
      filters: [
        {
          field: "instructor",
          operator: "==",
          value: instructor,
        },
      ],
    });
  }

  async registerMemberForSession(
    registrationData: SessionRegistrationRequest
  ): Promise<ApiResponse<Session>> {
    try {
      const sessionResult = await this.getById<Session>(
        registrationData.sessionId
      );

      if (!sessionResult.success || !sessionResult.data) {
        return {
          data: null,
          error: sessionResult.error || "Không tìm thấy ca tập",
          success: false,
        };
      }

      const session = sessionResult.data;

      // Check if session is full
      if (session.registeredCount >= session.capacity) {
        return {
          data: null,
          error: "Ca tập đã đầy",
          success: false,
        };
      }

      // Check if member is already registered
      const existingRegistration = session.registrations.find(
        (reg) =>
          reg.memberId === registrationData.memberId &&
          reg.status !== "cancelled"
      );

      if (existingRegistration) {
        return {
          data: null,
          error: "Thành viên đã đăng ký ca tập này",
          success: false,
        };
      }

      // Get member information
      const { membersApi } = await import("./members");
      const memberResult = await membersApi.getById(registrationData.memberId);

      let memberName = "Unknown Member";
      let memberEmail = "unknown@email.com";

      if (memberResult.success && memberResult.data) {
        memberName = memberResult.data.name;
        memberEmail = memberResult.data.email;
      }

      // Create registration
      const registration: SessionRegistration = {
        id: `${registrationData.sessionId}_${
          registrationData.memberId
        }_${Date.now()}`,
        sessionId: registrationData.sessionId,
        memberId: registrationData.memberId,
        memberName,
        memberEmail,
        status: "confirmed",
        registeredAt: new Date().toISOString(),
        notes: registrationData.notes,
      };

      // Update session with new registration
      const updatedRegistrations = [...session.registrations, registration];
      const updatedRegisteredCount = session.registeredCount + 1;

      // Note: We don't update remaining classes on registration
      // Remaining classes are only updated when member actually attends the class
      // This is handled in the markAttendance method

      return this.update<Session>(registrationData.sessionId, {
        registrations: updatedRegistrations,
        registeredCount: updatedRegisteredCount,
      });
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async cancelRegistration(
    sessionId: string,
    memberId: string
  ): Promise<ApiResponse<Session>> {
    try {
      const sessionResult = await this.getById<Session>(sessionId);

      if (!sessionResult.success || !sessionResult.data) {
        return {
          data: null,
          error: sessionResult.error || "Không tìm thấy ca tập",
          success: false,
        };
      }

      const session = sessionResult.data;

      // Find and update registration status
      const updatedRegistrations = session.registrations.map((reg) => {
        if (reg.memberId === memberId && reg.status === "confirmed") {
          return { ...reg, status: "cancelled" as const };
        }
        return reg;
      });

      // Count active registrations
      const activeRegistrations = updatedRegistrations.filter(
        (reg) => reg.status === "confirmed"
      );

      // Note: We don't restore remaining classes on cancellation
      // Remaining classes are only consumed when member actually attends the class
      // Cancelling registration before attendance doesn't affect remaining classes

      return this.update<Session>(sessionId, {
        registrations: updatedRegistrations,
        registeredCount: activeRegistrations.length,
      });
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async markAttendance(
    sessionId: string,
    memberId: string,
    attended: boolean
  ): Promise<ApiResponse<Session>> {
    try {
      const sessionResult = await this.getById<Session>(sessionId);

      if (!sessionResult.success || !sessionResult.data) {
        return {
          data: null,
          error: sessionResult.error || "Không tìm thấy ca tập",
          success: false,
        };
      }

      const session = sessionResult.data;

      // Update registration attendance
      const updatedRegistrations = session.registrations.map((reg) => {
        if (reg.memberId === memberId) {
          return {
            ...reg,
            status: attended ? ("attended" as const) : ("no-show" as const),
            attendedAt: attended ? new Date().toISOString() : undefined,
          };
        }
        return reg;
      });

      // Note: We don't update remainingClasses in database anymore
      // Remaining classes are calculated real-time based on package limit - attended classes
      // This ensures accuracy and consistency across the system

      return this.update<Session>(sessionId, {
        registrations: updatedRegistrations,
      });
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async completeSession(sessionId: string): Promise<ApiResponse<Session>> {
    return this.update<Session>(sessionId, {
      status: "completed",
    });
  }

  async cancelSession(
    sessionId: string,
    reason?: string
  ): Promise<ApiResponse<Session>> {
    return this.update<Session>(sessionId, {
      status: "cancelled",
      notes: reason,
    });
  }

  async getSessionStats(): Promise<
    ApiResponse<{
      total: number;
      scheduled: number;
      completed: number;
      cancelled: number;
      todayTotal: number;
      todayCompleted: number;
      avgAttendance: number;
      totalRegistrations: number;
    }>
  > {
    try {
      const today = new Date().toISOString().split("T")[0];

      const [
        totalResult,
        scheduledResult,
        completedResult,
        cancelledResult,
        todayResult,
        allSessionsResult,
      ] = await Promise.all([
        this.count(),
        this.count([{ field: "status", operator: "==", value: "scheduled" }]),
        this.count([{ field: "status", operator: "==", value: "completed" }]),
        this.count([{ field: "status", operator: "==", value: "cancelled" }]),
        this.count([{ field: "date", operator: "==", value: today }]),
        this.getAll<Session>(),
      ]);

      if (!totalResult.success || !allSessionsResult.success) {
        return {
          data: null,
          error: "Không thể lấy thống kê ca tập",
          success: false,
        };
      }

      const sessions = allSessionsResult.data || [];
      const todaySessions = sessions.filter((s) => s.date === today);

      // Calculate average attendance
      let totalCapacity = 0;
      let totalAttended = 0;
      let totalRegistrations = 0;

      sessions.forEach((session) => {
        totalRegistrations += session.registeredCount;
        if (session.status === "completed") {
          totalCapacity += session.capacity;
          const attendedCount = session.registrations.filter(
            (reg) => reg.status === "attended"
          ).length;
          totalAttended += attendedCount;
        }
      });

      const avgAttendance =
        totalCapacity > 0
          ? Math.round((totalAttended / totalCapacity) * 100)
          : 0;

      return {
        data: {
          total: totalResult.data || 0,
          scheduled: scheduledResult.data || 0,
          completed: completedResult.data || 0,
          cancelled: cancelledResult.data || 0,
          todayTotal: todayResult.data || 0,
          todayCompleted: todaySessions.filter((s) => s.status === "completed")
            .length,
          avgAttendance,
          totalRegistrations,
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

  async duplicateSession(
    sessionId: string,
    newDate: string,
    newStartTime?: string
  ): Promise<ApiResponse<Session>> {
    try {
      const originalResult = await this.getById<Session>(sessionId);

      if (!originalResult.success || !originalResult.data) {
        return {
          data: null,
          error: originalResult.error || "Không tìm thấy ca tập để sao chép",
          success: false,
        };
      }

      const original = originalResult.data;
      const {
        id: _originalId,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        registrations: _registrations,
        registeredCount: _registeredCount,
        ...sessionData
      } = original;

      const duplicatedSession = {
        ...sessionData,
        date: newDate,
        startTime: newStartTime || original.startTime,
        registrations: [],
        registeredCount: 0,
        status: "scheduled" as const,
      };

      return this.create<Session>(duplicatedSession);
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getAvailableSlots(sessionId: string): Promise<ApiResponse<number>> {
    try {
      const sessionResult = await this.getById<Session>(sessionId);

      if (!sessionResult.success || !sessionResult.data) {
        return {
          data: 0,
          error: sessionResult.error || "Không tìm thấy ca tập",
          success: false,
        };
      }

      const session = sessionResult.data;
      const availableSlots = session.capacity - session.registeredCount;

      return {
        data: Math.max(0, availableSlots),
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: 0,
        error: this.handleError(error),
        success: false,
      };
    }
  }
}

export const sessionsApi = new SessionsApiService();
