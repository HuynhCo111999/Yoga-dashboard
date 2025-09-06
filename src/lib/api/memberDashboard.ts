import { BaseApiService } from "./base";
import { ApiResponse, Session, Member } from "./types";
import { packagesApi } from "./index";
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
  status: "attended" | "no-show" | "cancelled";
  // Enhanced information about actions
  registeredAt?: string;
  cancelledAt?: string;
  notes?: string;
  actionHistory: {
    action: "registered" | "cancelled" | "attended" | "no-show";
    timestamp: string;
    notes?: string;
  }[];
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
      console.log("📊 Member data:", {
        id: member.id,
        name: member.name,
        currentPackage: member.currentPackage,
        remainingClasses: member.remainingClasses,
      });

      // Get package name if member has a package
      let packageName = "Chưa có gói";
      let packageClassLimit = -1; // -1 means unlimited

      if (member.currentPackage) {
        const packageResult = await packagesApi.getById(member.currentPackage);
        if (packageResult.success && packageResult.data) {
          packageName = packageResult.data.name;
          packageClassLimit = packageResult.data.classLimit;
          console.log("📦 Package info:", {
            id: packageResult.data.id,
            name: packageResult.data.name,
            classLimit: packageResult.data.classLimit,
          });
        }
      }

      // Get total classes attended
      const attendedCount = await this.getTotalClassesAttended(memberId);

      // Get total classes registered
      const registeredCount = await this.getTotalClassesRegistered(memberId);

      // Calculate remaining classes based on package limit and registered classes
      let calculatedRemainingClasses = member.remainingClasses || 0;

      if (packageClassLimit !== -1 && packageClassLimit > 0) {
        // For limited packages, calculate remaining based on package limit and registered classes
        calculatedRemainingClasses = Math.max(
          0,
          packageClassLimit - registeredCount
        );
        console.log(
          `🧮 Calculated remaining classes: ${packageClassLimit} (package limit) - ${registeredCount} (registered) = ${calculatedRemainingClasses}`
        );
      } else if (packageClassLimit === -1) {
        // For unlimited packages
        calculatedRemainingClasses = -1;
        console.log(
          `♾️ Unlimited package - remaining classes: ${calculatedRemainingClasses}`
        );
      }

      const stats: MemberDashboardStats = {
        currentPackage: packageName,
        remainingClasses: calculatedRemainingClasses,
        joinDate: member.joinDate,
        membershipStatus: member.membershipStatus,
        totalClassesAttended: attendedCount,
        totalClassesRegistered: registeredCount,
      };

      console.log("📈 Final stats:", stats);

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
      console.log("🔍 Getting upcoming sessions for member:", memberId);
      const sessionsCollection = collection(db, "sessions");
      const today = new Date().toISOString().split("T")[0];

      // Get all sessions with date >= today, then filter by member registration
      const q = query(
        sessionsCollection,
        where("date", ">=", today),
        orderBy("date", "asc"),
        orderBy("startTime", "asc")
      );

      const querySnapshot = await getDocs(q);
      console.log("📅 Found sessions:", querySnapshot.docs.length);

      const upcomingSessions: UpcomingSession[] = [];

      querySnapshot.docs.forEach((doc) => {
        const sessionData = { id: doc.id, ...doc.data() } as Session;
        console.log(
          "📋 Session:",
          sessionData.className,
          "Date:",
          sessionData.date,
          "Time:",
          sessionData.startTime,
          "Registrations:",
          sessionData.registrations.length
        );

        // Find member's registration
        const memberRegistration = sessionData.registrations.find(
          (reg) => reg.memberId === memberId && reg.status !== "cancelled"
        );

        if (memberRegistration) {
          // Additional time check for upcoming sessions
          const now = new Date();
          const currentTime = now.toTimeString().split(" ")[0].substring(0, 5);

          // If session is today, check if time hasn't passed
          if (sessionData.date === today) {
            if (sessionData.startTime > currentTime) {
              console.log(
                "✅ Found upcoming session today:",
                sessionData.className,
                "at",
                sessionData.startTime
              );
              const upcomingSession: UpcomingSession = {
                ...sessionData,
                registrationStatus: memberRegistration.status,
                registrationId: memberRegistration.id,
              };
              upcomingSessions.push(upcomingSession);
            } else {
              console.log(
                "⏰ Session time has passed:",
                sessionData.className,
                "at",
                sessionData.startTime
              );
            }
          } else {
            // Session is in the future
            console.log(
              "✅ Found future session:",
              sessionData.className,
              "on",
              sessionData.date
            );
            const upcomingSession: UpcomingSession = {
              ...sessionData,
              registrationStatus: memberRegistration.status,
              registrationId: memberRegistration.id,
            };
            upcomingSessions.push(upcomingSession);
          }
        } else {
          console.log("❌ No registration found for member:", memberId);
        }
      });

      // Limit results
      const limitedResults = upcomingSessions.slice(0, limitCount);
      console.log("🎯 Final upcoming sessions:", limitedResults.length);

      return {
        data: limitedResults,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error("❌ Error getting upcoming sessions:", error);
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
    try {
      console.log("🔍 Getting next upcoming session for member:", memberId);
      const sessionsCollection = collection(db, "sessions");
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().split(" ")[0].substring(0, 5); // HH:MM format

      console.log("⏰ Current date:", today, "Current time:", currentTime);

      // Get all sessions from today onwards
      const q = query(
        sessionsCollection,
        where("date", ">=", today),
        orderBy("date", "asc"),
        orderBy("startTime", "asc")
      );

      const querySnapshot = await getDocs(q);
      console.log("📅 Found sessions:", querySnapshot.docs.length);

      const upcomingSessions: UpcomingSession[] = [];

      querySnapshot.docs.forEach((doc) => {
        const sessionData = { id: doc.id, ...doc.data() } as Session;
        console.log(
          "📋 Checking session:",
          sessionData.className,
          "Date:",
          sessionData.date,
          "Time:",
          sessionData.startTime
        );

        // Find member's registration
        const memberRegistration = sessionData.registrations.find(
          (reg) => reg.memberId === memberId && reg.status !== "cancelled"
        );

        if (memberRegistration) {
          // Check if this session is in the future
          const sessionDate = new Date(sessionData.date);
          const sessionTime = sessionData.startTime;

          // If session is today, check if time hasn't passed
          if (sessionData.date === today) {
            if (sessionTime > currentTime) {
              console.log(
                "✅ Found next session today:",
                sessionData.className,
                "at",
                sessionTime
              );
              const upcomingSession: UpcomingSession = {
                ...sessionData,
                registrationStatus: memberRegistration.status,
                registrationId: memberRegistration.id,
              };
              upcomingSessions.push(upcomingSession);
            } else {
              console.log(
                "⏰ Session time has passed:",
                sessionData.className,
                "at",
                sessionTime
              );
            }
          } else {
            // Session is in the future
            console.log(
              "✅ Found future session:",
              sessionData.className,
              "on",
              sessionData.date
            );
            const upcomingSession: UpcomingSession = {
              ...sessionData,
              registrationStatus: memberRegistration.status,
              registrationId: memberRegistration.id,
            };
            upcomingSessions.push(upcomingSession);
          }
        } else {
          console.log("❌ No registration found for member:", memberId);
        }
      });

      // Return the first (earliest) upcoming session
      const nextSession =
        upcomingSessions.length > 0 ? upcomingSessions[0] : null;
      console.log(
        "🎯 Next upcoming session:",
        nextSession ? nextSession.className : "None"
      );

      return {
        data: nextSession,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error("❌ Error getting next upcoming session:", error);
      return {
        data: null,
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getAttendedSessions(
    memberId: string,
    limitCount: number = 10
  ): Promise<ApiResponse<AttendedSession[]>> {
    try {
      const sessionsCollection = collection(db, "sessions");

      // Get all sessions, then filter by member registration
      const q = query(sessionsCollection, orderBy("date", "desc"));

      const querySnapshot = await getDocs(q);
      const attendedSessions: AttendedSession[] = [];

      console.log(`🔍 Looking for attended sessions for member: ${memberId}`);

      querySnapshot.docs.forEach((doc) => {
        const sessionData = { id: doc.id, ...doc.data() } as Session;

        // Find member's registration - include confirmed, attended, no-show, and cancelled
        const memberRegistration = sessionData.registrations.find(
          (reg) =>
            reg.memberId === memberId &&
            (reg.status === "confirmed" ||
              reg.status === "attended" ||
              reg.status === "no-show" ||
              reg.status === "cancelled")
        );

        if (memberRegistration) {
          console.log(
            `📅 Found session: ${sessionData.className} on ${sessionData.date}, status: ${memberRegistration.status}`
          );

          // Build action history
          const actionHistory: AttendedSession["actionHistory"] = [];

          // Add registration action
          if (memberRegistration.registeredAt) {
            actionHistory.push({
              action: "registered",
              timestamp: memberRegistration.registeredAt,
              notes: memberRegistration.notes,
            });
          }

          // Add cancellation action if cancelled
          if (
            memberRegistration.status === "cancelled" &&
            memberRegistration.cancelledAt
          ) {
            actionHistory.push({
              action: "cancelled",
              timestamp: memberRegistration.cancelledAt,
              notes: memberRegistration.notes,
            });
          }

          // Add attendance action if attended
          if (
            memberRegistration.status === "attended" &&
            memberRegistration.attendedAt
          ) {
            actionHistory.push({
              action: "attended",
              timestamp: memberRegistration.attendedAt,
            });
          }

          // Add no-show action if no-show
          if (memberRegistration.status === "no-show") {
            actionHistory.push({
              action: "no-show",
              timestamp: sessionData.date + " " + sessionData.endTime,
            });
          }

          // Sort action history by timestamp
          actionHistory.sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

          const attendedSession: AttendedSession = {
            id: memberRegistration.id,
            sessionId: sessionData.id,
            className: sessionData.className,
            instructor: sessionData.instructor,
            date: sessionData.date,
            startTime: sessionData.startTime,
            endTime: sessionData.endTime,
            attendedAt:
              memberRegistration.attendedAt ||
              memberRegistration.registeredAt ||
              sessionData.date,
            status:
              memberRegistration.status === "confirmed"
                ? "attended"
                : (memberRegistration.status as
                    | "attended"
                    | "no-show"
                    | "cancelled"),
            // Enhanced information
            registeredAt: memberRegistration.registeredAt,
            cancelledAt: memberRegistration.cancelledAt,
            notes: memberRegistration.notes,
            actionHistory: actionHistory,
          };
          attendedSessions.push(attendedSession);
        }
      });

      console.log(
        `📊 Total attended sessions found: ${attendedSessions.length}`
      );

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
      console.error("Error getting attended sessions:", error);
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
      console.log(
        `🚫 Cancelling registration for member ${memberId} in session ${sessionId}`
      );

      // Import sessions API to handle session operations
      const { sessionsApi } = await import("./sessions");

      // Use sessions API to cancel registration
      const result = await sessionsApi.cancelRegistration(sessionId, memberId);

      if (result.success) {
        console.log(
          `✅ Successfully cancelled registration for member ${memberId}`
        );
      } else {
        console.error(`❌ Failed to cancel registration:`, result.error);
      }

      return result;
    } catch (error) {
      console.error("Error cancelling registration:", error);
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

      const q = query(sessionsCollection);

      const querySnapshot = await getDocs(q);
      let attendedCount = 0;

      querySnapshot.docs.forEach((doc) => {
        const sessionData = doc.data() as Session;
        // Count both confirmed and attended registrations as "attended"
        const memberRegistration = sessionData.registrations.find(
          (reg) =>
            reg.memberId === memberId &&
            (reg.status === "confirmed" || reg.status === "attended")
        );
        if (memberRegistration) {
          attendedCount++;
        }
      });

      console.log(
        `📊 Total classes attended for member ${memberId}: ${attendedCount}`
      );
      return attendedCount;
    } catch (error) {
      console.error("Error getting attended classes count:", error);
      return 0;
    }
  }

  private async getTotalClassesRegistered(memberId: string): Promise<number> {
    try {
      const sessionsCollection = collection(db, "sessions");

      const q = query(sessionsCollection);

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

      console.log(
        `📊 Total classes registered for member ${memberId}: ${registeredCount}`
      );
      return registeredCount;
    } catch (error) {
      console.error("Error getting registered classes count:", error);
      return 0;
    }
  }
}

export const memberDashboardApi = new MemberDashboardApiService();
