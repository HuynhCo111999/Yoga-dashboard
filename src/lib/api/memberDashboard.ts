import { BaseApiService } from "./base";
import { ApiResponse, Session, Member } from "./types";
import {
  query,
  where,
  orderBy,
  limit,
  getDocs,
  collection,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface MemberDashboardStats {
  currentPackage: string;
  remainingClasses: number;
  joinDate: string;
  membershipStatus: "active" | "inactive" | "suspended";
  totalClassesAttended: number;
  totalClassesRegistered: number;
}

export interface UpcomingSession extends Session {
  registrationStatus: "confirmed" | "cancelled" | "attended" | "no-show";
  registrationId: string;
}

export interface AttendedSession {
  id: string;
  sessionId: string;
  className: string;
  instructor: string;
  date: string;
  startTime: string;
  endTime: string;
  attendedAt: string;
  status: "attended" | "no-show";
}

class MemberDashboardApiService extends BaseApiService {
  constructor() {
    super("members");
  }

  async getMemberStats(
    memberId: string
  ): Promise<ApiResponse<MemberDashboardStats>> {
    try {
      // Get member data
      const memberResult = await this.getById<Member>(memberId);

      if (!memberResult.success || !memberResult.data) {
        return {
          data: null,
          error: "Không tìm thấy thông tin thành viên",
          success: false,
        };
      }

      const member = memberResult.data;

      // Get total classes attended
      const attendedCount = await this.getTotalClassesAttended(memberId);

      // Get total classes registered
      const registeredCount = await this.getTotalClassesRegistered(memberId);

      const stats: MemberDashboardStats = {
        currentPackage: member.currentPackage || "Chưa có gói",
        remainingClasses: member.remainingClasses || 0,
        joinDate: member.joinDate,
        membershipStatus: member.membershipStatus,
        totalClassesAttended: attendedCount,
        totalClassesRegistered: registeredCount,
      };

      return {
        data: stats,
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

  async getUpcomingSessions(
    memberId: string,
    limitCount: number = 10
  ): Promise<ApiResponse<UpcomingSession[]>> {
    try {
      const sessionsCollection = collection(db, "sessions");
      const today = new Date().toISOString().split("T")[0];

      // Query sessions where member is registered and date >= today
      const q = query(
        sessionsCollection,
        where("registrations", "array-contains-any", [memberId]),
        where("date", ">=", today),
        orderBy("date", "asc"),
        orderBy("startTime", "asc"),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const upcomingSessions: UpcomingSession[] = [];

      querySnapshot.docs.forEach((doc) => {
        const sessionData = { id: doc.id, ...doc.data() } as Session;

        // Find member's registration
        const memberRegistration = sessionData.registrations.find(
          (reg) => reg.memberId === memberId && reg.status !== "cancelled"
        );

        if (memberRegistration) {
          const upcomingSession: UpcomingSession = {
            ...sessionData,
            registrationStatus: memberRegistration.status,
            registrationId: memberRegistration.id,
          };
          upcomingSessions.push(upcomingSession);
        }
      });

      return {
        data: upcomingSessions,
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

  async getNextUpcomingSession(
    memberId: string
  ): Promise<ApiResponse<UpcomingSession | null>> {
    const result = await this.getUpcomingSessions(memberId, 1);

    if (!result.success) {
      return {
        data: null,
        error: result.error,
        success: false,
      };
    }

    return {
      data: result.data && result.data.length > 0 ? result.data[0] : null,
      error: null,
      success: true,
    };
  }

  async getAttendedSessions(
    memberId: string,
    limitCount: number = 10
  ): Promise<ApiResponse<AttendedSession[]>> {
    try {
      const sessionsCollection = collection(db, "sessions");

      // Query sessions where member attended
      const q = query(
        sessionsCollection,
        where("registrations", "array-contains-any", [memberId]),
        orderBy("date", "desc"),
        limit(limitCount * 2) // Get more to filter attended ones
      );

      const querySnapshot = await getDocs(q);
      const attendedSessions: AttendedSession[] = [];

      querySnapshot.docs.forEach((doc) => {
        const sessionData = { id: doc.id, ...doc.data() } as Session;

        // Find member's registration with attended status
        const memberRegistration = sessionData.registrations.find(
          (reg) =>
            reg.memberId === memberId &&
            (reg.status === "attended" || reg.status === "no-show")
        );

        if (memberRegistration) {
          const attendedSession: AttendedSession = {
            id: memberRegistration.id,
            sessionId: sessionData.id,
            className: sessionData.className,
            instructor: sessionData.instructor,
            date: sessionData.date,
            startTime: sessionData.startTime,
            endTime: sessionData.endTime,
            attendedAt: memberRegistration.attendedAt || sessionData.date,
            status: memberRegistration.status as "attended" | "no-show",
          };
          attendedSessions.push(attendedSession);
        }
      });

      // Sort by date descending and limit
      attendedSessions.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const limitedResults = attendedSessions.slice(0, limitCount);

      return {
        data: limitedResults,
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

  async cancelRegistration(
    sessionId: string,
    memberId: string
  ): Promise<ApiResponse<Session>> {
    try {
      // Get session
      const sessionResult = await this.getById<Session>(sessionId);

      if (!sessionResult.success || !sessionResult.data) {
        return {
          data: null,
          error: "Không tìm thấy ca tập",
          success: false,
        };
      }

      const session = sessionResult.data;

      // Find registration to cancel
      const registrationIndex = session.registrations.findIndex(
        (reg) => reg.memberId === memberId && reg.status === "confirmed"
      );

      if (registrationIndex === -1) {
        return {
          data: null,
          error: "Không tìm thấy đăng ký để hủy",
          success: false,
        };
      }

      // Update registration status to cancelled
      const updatedRegistrations = [...session.registrations];
      updatedRegistrations[registrationIndex] = {
        ...updatedRegistrations[registrationIndex],
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
      };

      // Update session
      const updateResult = await this.update<Session>(sessionId, {
        registrations: updatedRegistrations,
        registeredCount: session.registeredCount - 1,
      });

      return updateResult;
    } catch (error) {
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  private async getTotalClassesAttended(memberId: string): Promise<number> {
    try {
      const sessionsCollection = collection(db, "sessions");

      const q = query(
        sessionsCollection,
        where("registrations", "array-contains-any", [memberId])
      );

      const querySnapshot = await getDocs(q);
      let attendedCount = 0;

      querySnapshot.docs.forEach((doc) => {
        const sessionData = doc.data() as Session;
        const memberRegistration = sessionData.registrations.find(
          (reg) => reg.memberId === memberId && reg.status === "attended"
        );
        if (memberRegistration) {
          attendedCount++;
        }
      });

      return attendedCount;
    } catch (error) {
      console.error("Error getting attended classes count:", error);
      return 0;
    }
  }

  private async getTotalClassesRegistered(memberId: string): Promise<number> {
    try {
      const sessionsCollection = collection(db, "sessions");

      const q = query(
        sessionsCollection,
        where("registrations", "array-contains-any", [memberId])
      );

      const querySnapshot = await getDocs(q);
      let registeredCount = 0;

      querySnapshot.docs.forEach((doc) => {
        const sessionData = doc.data() as Session;
        const memberRegistration = sessionData.registrations.find(
          (reg) => reg.memberId === memberId && reg.status !== "cancelled"
        );
        if (memberRegistration) {
          registeredCount++;
        }
      });

      return registeredCount;
    } catch (error) {
      console.error("Error getting registered classes count:", error);
      return 0;
    }
  }
}

export const memberDashboardApi = new MemberDashboardApiService();
