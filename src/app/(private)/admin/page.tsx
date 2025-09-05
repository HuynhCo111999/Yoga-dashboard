'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { dashboardApi, DashboardStats, RecentActivity } from '@/lib/api';

interface DashboardSession {
  id: string;
  className: string;
  instructor: string;
  time: string;
  registered: number;
  capacity: number;
  availableSpots: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<DashboardSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all dashboard data in parallel
        const [statsResult, activitiesResult, sessionsResult] = await Promise.all([
          dashboardApi.getDashboardStats(),
          dashboardApi.getRecentActivities(6),
          dashboardApi.getUpcomingSessionsForDashboard(3)
        ]);

        // Handle stats
        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data);
        } else {
          console.error('Error loading stats:', statsResult.error);
        }

        // Handle activities
        if (activitiesResult.success && activitiesResult.data) {
          setRecentActivities(activitiesResult.data);
        } else {
          console.error('Error loading activities:', activitiesResult.error);
        }

        // Handle sessions
        if (sessionsResult.success && sessionsResult.data) {
          setUpcomingSessions(sessionsResult.data as DashboardSession[]);
        } else {
          console.error('Error loading sessions:', sessionsResult.error);
        }

      } catch (err) {
        console.error('Dashboard loading error:', err);
        setError('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Format stats for display
  const formatStats = () => {
    if (!stats) return [];

    const formatNumber = (num: number): string => {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
      }
      return num.toString();
    };

    const formatGrowth = (growth: number): { text: string; type: 'increase' | 'decrease' | 'unchanged' } => {
      if (growth > 0) return { text: `+${growth}`, type: 'increase' };
      if (growth < 0) return { text: `${growth}`, type: 'decrease' };
      return { text: '0', type: 'unchanged' };
    };

    return [
      {
        name: 'Tổng thành viên',
        stat: stats.totalMembers.toString(),
        change: formatGrowth(stats.memberGrowth).text,
        changeType: formatGrowth(stats.memberGrowth).type,
      },
      {
        name: 'Lớp học hoạt động',
        stat: stats.activeClasses.toString(),
        change: formatGrowth(stats.classGrowth).text,
        changeType: formatGrowth(stats.classGrowth).type,
      },
      {
        name: 'Ca tập hôm nay',
        stat: stats.todaySessions.toString(),
        change: formatGrowth(stats.sessionGrowth).text,
        changeType: formatGrowth(stats.sessionGrowth).type,
      },
      {
        name: 'Doanh thu tháng',
        stat: formatNumber(stats.monthlyRevenue),
        change: `+${stats.revenueGrowth}%`,
        changeType: stats.revenueGrowth > 0 ? 'increase' as const : 'unchanged' as const,
      },
    ];
  };

  // Format time for activities
  const formatActivityTime = (timestamp: string): string => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  // Show loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tổng quan Yên Yoga</h1>
            <p className="mt-3 text-lg text-gray-600">
              Thống kê tổng quan về hoạt động của studio yoga
            </p>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
          </div>
          
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <span className="text-gray-600">Đang tải dữ liệu...</span>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tổng quan Yên Yoga</h1>
            <p className="mt-3 text-lg text-gray-600">
              Thống kê tổng quan về hoạt động của studio yoga
            </p>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
          </div>
          
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-600 mb-2">⚠️</div>
              <p className="text-gray-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const formattedStats = formatStats();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tổng quan Yên Yoga</h1>
          <p className="mt-3 text-lg text-gray-600">
            Thống kê tổng quan về hoạt động của studio yoga
          </p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {formattedStats.map((item) => (
            <div key={item.name} className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-primary-100 px-6 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary-200">
              <dt>
                <p className="truncate text-sm font-semibold text-secondary-600 uppercase tracking-wide">{item.name}</p>
              </dt>
              <dd className="flex items-baseline mt-3">
                <p className="text-3xl font-bold text-gray-900">{item.stat}</p>
                <p
                  className={`ml-3 flex items-baseline text-sm font-semibold ${
                    item.changeType === 'increase'
                      ? 'text-primary-600'
                      : item.changeType === 'decrease'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {item.changeType === 'increase' && (
                    <svg
                      className="h-4 w-4 flex-shrink-0 self-center text-primary-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {item.changeType === 'decrease' && (
                    <svg
                      className="h-4 w-4 flex-shrink-0 self-center text-red-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <span className="sr-only">
                    {item.changeType === 'increase' ? 'Tăng' : 'Giảm'} so với tháng trước
                  </span>
                  {item.change}
                </p>
              </dd>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Activities */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Hoạt động gần đây</h3>
              </div>
              <div className="flow-root">
                {recentActivities.length > 0 ? (
                  <ul role="list" className="-my-6 divide-y divide-primary-100/50">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                              <span className="text-primary-700 font-semibold text-sm">
                                {activity.userName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                              <span className="font-semibold text-primary-700">{activity.userName}</span>{' '}
                            {activity.action}{' '}
                              <span className="font-semibold text-secondary-700">{activity.target}</span>
                          </p>
                            <p className="text-xs text-gray-500 mt-1">{formatActivityTime(activity.timestamp)}</p>
                          </div>
                      </div>
                    </li>
                  ))}
                </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Chưa có hoạt động nào</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Ca tập sắp tới</h3>
              </div>
              <div className="flow-root">
                {upcomingSessions.length > 0 ? (
                  <ul role="list" className="-my-6 divide-y divide-primary-100/50">
                  {upcomingSessions.map((session) => (
                    <li key={session.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                            {session.className}
                          </p>
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="text-primary-600 font-medium">{session.instructor}</span> • {session.time}
                          </p>
                        </div>
                          <div className="text-right ml-4">
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
                              {session.registered}/{session.capacity} người
                            </div>
                            <p className="text-xs text-gray-500 mt-1">đăng ký</p>
                          </div>
                      </div>
                    </li>
                  ))}
                </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Chưa có ca tập nào</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}