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

      // Calculate monthly revenue (simplified - would need payment/subscription data)
      const packagesResult = await packagesApi.getActivePackages();
      let monthlyRevenue = 0;
      if (packagesResult.success && packagesResult.data) {
        // Simplified calculation: sum of active package prices
        monthlyRevenue = packagesResult.data.reduce(
          (sum, pkg) => sum + pkg.price,
          0
        );
      }

      // Calculate growth percentages (simplified - would need historical data)
      const memberGrowth = memberStats.data?.newThisMonth || 0;
      const classGrowth = Math.round(Math.random() * 10); // Mock data
      const sessionGrowth = Math.round(Math.random() * 15); // Mock data
      const revenueGrowth = Math.round(Math.random() * 20); // Mock data

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
      // This would typically come from an activities log
      // For now, we'll create mock recent activities based on recent data

      const [recentSessionsResult, recentMembersResult] = await Promise.all([
        sessionsApi.getUpcomingSessions(5),
        membersApi.getAllMembers({ status: "active" }),
      ]);

      const activities: RecentActivity[] = [];

      // Add session-based activities
      if (recentSessionsResult.success && recentSessionsResult.data) {
        recentSessionsResult.data.forEach((session, index) => {
          activities.push({
            id: `session_${session.id}_${index}`,
            type: "registration",
            userId: `member_${index + 1}`,
            userName: `Thành viên ${index + 1}`,
            action: "đã đăng ký",
            target: session.className,
            timestamp: new Date(Date.now() - index * 300000).toISOString(), // 5 minutes apart
            details: {
              sessionId: session.id,
              sessionDate: session.date,
              sessionTime: session.startTime,
            },
          });
        });
      }

      // Add member-based activities
      if (recentMembersResult.success && recentMembersResult.data) {
        const recentMembers = recentMembersResult.data.slice(0, 3);
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

      return {
        data: limitedActivities,
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
