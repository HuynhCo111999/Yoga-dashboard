import { BaseApiService } from "./base";
import { DashboardStats, RecentActivity, ApiResponse } from "./types";
import { membersApi } from "./members";
import { classesApi } from "./classes";
import { sessionsApi } from "./sessions";
import { packagesApi } from "./packages";

class DashboardApiService extends BaseApiService {
  constructor() {
    super("dashboard_stats");
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      // const today = new Date().toISOString().split('T')[0];
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      // Get stats from all services
      const [memberStats, classStats, sessionStats, todaySessionsResult] =
        await Promise.all([
          membersApi.getMembersStats(),
          classesApi.getClassStats(),
          sessionsApi.getSessionStats(),
          sessionsApi.getTodaySessions(),
        ]);

      if (
        !memberStats.success ||
        !classStats.success ||
        !sessionStats.success
      ) {
        return {
          data: null,
          error: "Không thể lấy thống kê dashboard",
          success: false,
        };
      }

      // Calculate monthly revenue based on members who registered packages this month
      const packagesResult = await packagesApi.getActivePackages();
      let monthlyRevenue = 0;

      if (
        packagesResult.success &&
        packagesResult.data &&
        memberStats.success &&
        memberStats.data
      ) {
        // Get all members who joined this month (assuming they registered packages)
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);

        // Get all members
        const allMembersResult = await membersApi.getAllMembers();
        if (allMembersResult.success && allMembersResult.data) {
          // Filter members who joined this month and have packages
          const membersThisMonth = allMembersResult.data.filter((member) => {
            const joinDate = new Date(member.joinDate);
            return joinDate >= currentMonth && member.currentPackage;
          });

          // Calculate revenue from members who joined this month
          monthlyRevenue = membersThisMonth.reduce((sum, member) => {
            const pkg = packagesResult.data?.find(
              (p) => p.id === member.currentPackage
            );
            return sum + (pkg?.price || 0);
          }, 0);

          console.log(
            `💰 Monthly revenue calculation: ${
              membersThisMonth.length
            } members joined this month, total revenue: ${monthlyRevenue.toLocaleString()}đ`
          );
        }
      }

      // Calculate growth percentages
      const memberGrowth = memberStats.data?.newThisMonth || 0;
      const classGrowth = Math.round(Math.random() * 10); // Mock data
      const sessionGrowth = Math.round(Math.random() * 15); // Mock data

      // Calculate revenue growth based on new members this month
      let revenueGrowth = 0;
      if (memberStats.data?.newThisMonth && memberStats.data.newThisMonth > 0) {
        // Simple growth calculation: if we have new members, assume positive growth
        revenueGrowth = Math.min(
          25,
          Math.max(5, memberStats.data.newThisMonth * 3)
        ); // 5-25% growth
      }

      const dashboardStats: DashboardStats = {
        totalMembers: memberStats.data?.total || 0,
        activeClasses: classStats.data?.active || 0,
        todaySessions: todaySessionsResult.success
          ? todaySessionsResult.data?.length || 0
          : 0,
        monthlyRevenue,
        memberGrowth,
        classGrowth,
        sessionGrowth,
        revenueGrowth,
        lastUpdated: new Date().toISOString(),
      };

      return {
        data: dashboardStats,
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

  async getRecentActivities(
    limit: number = 10
  ): Promise<ApiResponse<RecentActivity[]>> {
    try {
      // Get real activities from sessions and members
      const [recentSessionsResult, recentMembersResult] = await Promise.all([
        sessionsApi.getUpcomingSessions(10),
        membersApi.getAllMembers({ status: "active" }),
      ]);

      const activities: RecentActivity[] = [];

      // Add real session registration activities
      if (recentSessionsResult.success && recentSessionsResult.data) {
        recentSessionsResult.data.forEach((session) => {
          // Get registrations for this session
          if (session.registrations && session.registrations.length > 0) {
            session.registrations.forEach((registration) => {
              // Find member name from members list
              const member = recentMembersResult.data?.find(
                (m) => m.id === registration.memberId
              );
              const memberName = member
                ? member.name
                : registration.memberName || "Thành viên";

              activities.push({
                id: `registration_${registration.id}`,
                type: "registration",
                userId: registration.memberId,
                userName: memberName,
                action: "đã đăng ký",
                target: session.className,
                timestamp:
                  registration.registeredAt || new Date().toISOString(),
                details: {
                  sessionId: session.id,
                  sessionDate: session.date,
                  sessionTime: session.startTime,
                },
              });
            });
          }
        });
      }

      // Add member join activities (recent members)
      if (recentMembersResult.success && recentMembersResult.data) {
        const recentMembers = recentMembersResult.data
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 3);

        recentMembers.forEach((member) => {
          activities.push({
            id: `member_${member.id}_join`,
            type: "member_join",
            userId: member.id,
            userName: member.name,
            action: "đã tham gia",
            target: "Yên Yoga",
            timestamp: member.createdAt,
            details: {
              membershipStatus: member.membershipStatus,
              joinDate: member.joinDate,
            },
          });
        });
      }

      // Sort by timestamp (newest first) and limit
      activities.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      const limitedActivities = activities.slice(0, limit);

      console.log("📊 Recent activities generated:", limitedActivities.length);
      limitedActivities.forEach((activity) => {
        console.log(
          `- ${activity.userName} ${activity.action} ${activity.target}`
        );
      });

      return {
        data: limitedActivities,
        error: null,
        success: true,
      };
    } catch (error) {
      console.error("Error getting recent activities:", error);
      return {
        data: [],
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getUpcomingSessionsForDashboard(
    limit: number = 6
  ): Promise<ApiResponse<unknown[]>> {
    try {
      const sessionsResult = await sessionsApi.getUpcomingSessions(limit);

      if (!sessionsResult.success || !sessionsResult.data) {
        return {
          data: [],
          error:
            sessionsResult.error || "Không thể lấy danh sách ca tập sắp tới",
          success: false,
        };
      }

      // Transform sessions for dashboard display
      const dashboardSessions = sessionsResult.data.map((session) => ({
        id: session.id,
        className: session.className,
        instructor: session.instructor,
        time: `${session.startTime} - ${session.endTime}`,
        date: session.date,
        registered: session.registeredCount,
        capacity: session.capacity,
        status: session.status,
        availableSpots: session.capacity - session.registeredCount,
      }));

      return {
        data: dashboardSessions,
        error: null,
        success: true,
      };
    } catch (error) {
      return {
        data: [],
        error: this.handleError(error),
        success: false,
      };
    }
  }

  async getQuickInsights(): Promise<
    ApiResponse<{
      membershipTrend: "up" | "down" | "stable";
      popularClass: string;
      peakHour: string;
      occupancyRate: number;
      revenue: {
        thisMonth: number;
        lastMonth: number;
        growth: number;
      };
    }>
  > {
    try {
      const [memberStats, sessionStats] = await Promise.all([
        membersApi.getMembersStats(),
        sessionsApi.getSessionStats(),
      ]);

      if (!memberStats.success || !sessionStats.success) {
        return {
          data: null,
          error: "Không thể lấy insights",
          success: false,
        };
      }

      // Calculate insights (simplified)
      const membershipTrend =
        memberStats.data?.newThisMonth || 0 > 5
          ? "up"
          : memberStats.data?.newThisMonth || 0 < 2
          ? "down"
          : "stable";

      // Find most popular class (mock data)
      const popularClass = "Hatha Yoga Cơ bản"; // Would need session registration data

      // Peak hour analysis (mock data)
      const peakHour = "18:00 - 19:30"; // Would need to analyze session times

      // Occupancy rate
      const occupancyRate = sessionStats.data?.avgAttendance || 0;

      // Revenue calculation (mock data)
      const thisMonth = Math.floor(Math.random() * 50000000) + 30000000; // 30-80M VND
      const lastMonth = Math.floor(thisMonth * (0.8 + Math.random() * 0.4)); // 80-120% of this month
      const growth = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);

      return {
        data: {
          membershipTrend,
          popularClass,
          peakHour,
          occupancyRate,
          revenue: {
            thisMonth,
            lastMonth,
            growth,
          },
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

  async getWeeklyScheduleOverview(): Promise<
    ApiResponse<{
      totalSessions: number;
      byDay: Record<string, number>;
      byInstructor: Record<string, number>;
      capacity: {
        total: number;
        booked: number;
        available: number;
        utilizationRate: number;
      };
    }>
  > {
    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Start of this week

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // End of this week

      const weekSessions = await sessionsApi.getSessionsByDateRange(
        startOfWeek.toISOString().split("T")[0],
        endOfWeek.toISOString().split("T")[0]
      );

      if (!weekSessions.success || !weekSessions.data) {
        return {
          data: null,
          error: "Không thể lấy thống kê tuần",
          success: false,
        };
      }

      const sessions = weekSessions.data;

      // Count by day
      const byDay: Record<string, number> = {
        "Chủ nhật": 0,
        "Thứ hai": 0,
        "Thứ ba": 0,
        "Thứ tư": 0,
        "Thứ năm": 0,
        "Thứ sáu": 0,
        "Thứ bảy": 0,
      };

      const dayNames = [
        "Chủ nhật",
        "Thứ hai",
        "Thứ ba",
        "Thứ tư",
        "Thứ năm",
        "Thứ sáu",
        "Thứ bảy",
      ];

      // Count by instructor
      const byInstructor: Record<string, number> = {};

      let totalCapacity = 0;
      let totalBooked = 0;

      sessions.forEach((session) => {
        // Count by day
        const sessionDate = new Date(session.date);
        const dayName = dayNames[sessionDate.getDay()];
        byDay[dayName] = (byDay[dayName] || 0) + 1;

        // Count by instructor
        byInstructor[session.instructor] =
          (byInstructor[session.instructor] || 0) + 1;

        // Calculate capacity
        totalCapacity += session.capacity;
        totalBooked += session.registeredCount;
      });

      const utilizationRate =
        totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

      return {
        data: {
          totalSessions: sessions.length,
          byDay,
          byInstructor,
          capacity: {
            total: totalCapacity,
            booked: totalBooked,
            available: totalCapacity - totalBooked,
            utilizationRate,
          },
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

export const dashboardApi = new DashboardApiService();
