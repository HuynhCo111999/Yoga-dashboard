'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { memberDashboardApi, MemberDashboardStats, UpcomingSession, AttendedSession, membersApi } from '@/lib/api';
import { checkSessionCancellationTime } from '@/utils/sessionUtils';

// Remove mock data - will be replaced with Firebase data

function MemberHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    const result = await signOut();
    if (!result.error) {
      router.push('/login');
    } else {
      console.error('Logout error:', result.error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest('#member-user-menu') && !target.closest('[role="menu"]')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  return (
    <header className="bg-white/95 backdrop-blur-lg border-b border-primary-200 shadow-lg sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Yên Yoga
              </h1>
              <p className="text-xs text-gray-500">Không gian yoga thanh tịnh</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              id="member-user-menu"
              type="button"
              className="flex items-center space-x-3 p-2 hover:bg-primary-50 rounded-xl transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900">{user?.name || user?.email || 'Thành viên'}</p>
                <p className="text-xs text-gray-500">Thành viên</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div role="menu" className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-primary-100 py-1 z-10">
                <Link
                  href="/member/profile"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Hồ sơ cá nhân
                </Link>
                <Link
                  href="/member/settings"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Cài đặt
                </Link>
                <Link
                  href="/"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Về trang chủ
                </Link>
                <div className="border-t border-primary-100 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-3 text-sm text-red-700 hover:bg-red-50 transition-colors"
                >
                  <svg className="mr-3 h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function MemberDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // State for Firebase data
  const [memberStats, setMemberStats] = useState<MemberDashboardStats | null>(null);
  const [nextClass, setNextClass] = useState<UpcomingSession | null>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingSession[]>([]);
  const [recentClasses, setRecentClasses] = useState<AttendedSession[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelSessionData, setCancelSessionData] = useState<{sessionId: string, registrationId: string, className: string, date: string, startTime: string} | null>(null);

  // Load member data
  useEffect(() => {
    if (user && user.uid) {
      loadMemberData();
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    // Allow both members and admins to access this page
  }, [user, loading, router]);

  const loadMemberData = async () => {
    if (!user?.email) return;

    try {
      setDataLoading(true);
      setError(null);

      console.log('🔍 Loading member data for email:', user.email);

      // First, find member by email
      const memberResult = await membersApi.getMemberByEmail(user.email);
      if (!memberResult.success || !memberResult.data) {
        console.error('❌ Member not found:', memberResult.error);
        setError('Không tìm thấy thông tin thành viên');
        return;
      }

      const memberId = memberResult.data.id;
      console.log('✅ Member found:', memberId, memberResult.data.name);

      // Load all data concurrently using member ID
      const [statsResult, nextClassResult, upcomingResult, recentResult] = await Promise.all([
        memberDashboardApi.getMemberStats(memberId),
        memberDashboardApi.getNextUpcomingSession(memberId),
        memberDashboardApi.getUpcomingSessions(memberId, 10),
        memberDashboardApi.getAttendedSessions(memberId, 10),
      ]);

      // Handle stats
      if (statsResult.success && statsResult.data) {
        console.log('✅ Member stats loaded:', statsResult.data);
        setMemberStats(statsResult.data);
      } else {
        console.error('❌ Error loading member stats:', statsResult.error);
      }

      // Handle next class
      if (nextClassResult.success) {
        console.log('✅ Next class result:', nextClassResult.data);
        setNextClass(nextClassResult.data);
      } else {
        console.error('❌ Error loading next class:', nextClassResult.error);
      }

      // Handle upcoming classes
      if (upcomingResult.success && upcomingResult.data) {
        console.log('✅ Upcoming classes loaded:', upcomingResult.data.length, 'classes');
        setUpcomingClasses(upcomingResult.data);
      } else {
        console.error('❌ Error loading upcoming classes:', upcomingResult.error);
      }

      // Handle recent classes
      if (recentResult.success && recentResult.data) {
        console.log('✅ Recent classes loaded:', recentResult.data.length, 'classes');
        setRecentClasses(recentResult.data);
      } else {
        console.error('❌ Error loading recent classes:', recentResult.error);
      }
    } catch (err) {
      console.error('❌ Error loading member data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setDataLoading(false);
    }
  };

  const handleCancelRegistration = (sessionId: string, registrationId: string, className: string, date: string, startTime: string) => {
    setCancelSessionData({ sessionId, registrationId, className, date, startTime });
    setShowCancelModal(true);
  };

  const confirmCancelRegistration = async () => {
    if (!user?.email || !cancelSessionData) return;

    try {
      setCancelLoading(cancelSessionData.registrationId);
      
      // Find member by email first
      const memberResult = await membersApi.getMemberByEmail(user.email);
      if (!memberResult.success || !memberResult.data) {
        setError('Không tìm thấy thông tin thành viên');
        return;
      }

      const memberId = memberResult.data.id;
      const result = await memberDashboardApi.cancelRegistration(cancelSessionData.sessionId, memberId);
      
      if (result.success) {
        // Reload data to reflect changes
        await loadMemberData();
        setShowCancelModal(false);
        setCancelSessionData(null);
      } else {
        setError(result.error || 'Có lỗi xảy ra khi hủy đăng ký');
      }
    } catch (err) {
      console.error('Error cancelling registration:', err);
      setError('Có lỗi xảy ra khi hủy đăng ký');
    } finally {
      setCancelLoading(null);
    }
  };

  const cancelCancelRegistration = () => {
    setShowCancelModal(false);
    setCancelSessionData(null);
  };

  // Show loading if auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50">
      {/* Member Header */}
      <MemberHeader />
      
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-red-800 hover:text-red-900"
              >
                ✕
              </button>
            </div>
          )}

          {/* Welcome section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Chào mừng trở lại, {user?.name || user?.email || 'bạn'}!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúc bạn có những buổi tập yoga thật hiệu quả và tràn đầy năng lượng.
              Hãy bắt đầu hành trình khám phá sự cân bằng của cơ thể và tâm hồn.
            </p>
            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
          </div>

          {/* Stats cards */}
          {dataLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-primary-100 animate-pulse">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-primary-100 hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                    </svg>
                      </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-semibold text-secondary-600 uppercase tracking-wide truncate">
                        Gói hiện tại
                      </dt>
                        <dd className="text-xl font-bold text-gray-900 mt-1">
                          {memberStats?.currentPackage || 'Chưa có gói'}
                        </dd>
                        {memberStats?.currentPackage && memberStats?.remainingClasses !== undefined && (
                          <dd className="text-sm text-primary-600 mt-1">
                            {memberStats.remainingClasses === -1 
                              ? 'Không giới hạn' 
                              : `${memberStats.remainingClasses} buổi còn lại`
                            }
                      </dd>
                        )}
                    </dl>
                  </div>
                </div>
              </div>
            </div>

              <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-primary-100 hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                      </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-semibold text-secondary-600 uppercase tracking-wide truncate">
                        Lớp còn lại
                      </dt>
                        <dd className="text-xl font-bold text-gray-900 mt-1">
                          {memberStats?.remainingClasses === -1 
                            ? 'Không giới hạn' 
                            : `${memberStats?.remainingClasses || 0} buổi`
                          }
                        </dd>
                        {memberStats?.currentPackage && (
                          <dd className="text-sm text-accent-600 mt-1">
                            Trong gói {memberStats.currentPackage}
                      </dd>
                        )}
                    </dl>
                  </div>
                </div>
              </div>
            </div>

              <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-primary-100 hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-xl flex items-center justify-center">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                    </svg>
                      </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-semibold text-secondary-600 uppercase tracking-wide truncate">
                        Ngày tham gia
                      </dt>
                        <dd className="text-xl font-bold text-gray-900 mt-1">
                          {memberStats?.joinDate ? new Date(memberStats.joinDate).toLocaleDateString('vi-VN') : 'Chưa có'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

              <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-primary-100 hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                        <div className={`h-4 w-4 rounded-full ${
                          memberStats?.membershipStatus === 'active' ? 'bg-white' : 'bg-red-300'
                    }`}></div>
                      </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-semibold text-secondary-600 uppercase tracking-wide truncate">
                        Trạng thái
                      </dt>
                        <dd className="text-xl font-bold text-gray-900 mt-1">
                          {memberStats?.membershipStatus === 'active' ? 'Hoạt động' : memberStats?.membershipStatus === 'inactive' ? 'Tạm ngưng' : 'Bị khóa'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Next class */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100">
              <div className="px-6 py-6 sm:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Lớp học tiếp theo</h3>
                </div>
                {dataLoading ? (
                  <div className="border border-primary-200 rounded-2xl p-6 bg-gradient-to-r from-primary-50 to-accent-50 animate-pulse">
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                ) : nextClass ? (
                  <div className="border border-primary-200 rounded-2xl p-6 bg-gradient-to-r from-primary-50 to-accent-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-primary-900 mb-2">
                          {nextClass.className}
                        </h4>
                        <p className="text-sm text-primary-700 mb-1">
                          <span className="font-semibold">Giảng viên:</span> {nextClass.instructor}
                        </p>
                        <p className="text-sm text-primary-700">
                          <span className="font-semibold">Thời gian:</span> {new Date(nextClass.date).toLocaleDateString('vi-VN')} • {nextClass.startTime} - {nextClass.endTime}
                        </p>
                        <p className="text-xs text-primary-600 mt-2">
                          Trạng thái: {nextClass.registrationStatus === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                        </p>
                      </div>
                      <div className="text-primary-600">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>Bạn chưa đăng ký lớp nào</p>
                  </div>
                )}
                <div className="mt-6">
                  <a
                    href="/calendar"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Xem lịch học
                  </a>
                </div>
              </div>
            </div>

            {/* Upcoming classes */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100">
              <div className="px-6 py-6 sm:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m6 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-6 4h6m-6 4h6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Lớp đã đăng ký</h3>
                </div>
                {dataLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border border-primary-100 rounded-xl bg-gradient-to-r from-white to-primary-50/30 animate-pulse">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-300 rounded mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                        </div>
                        <div className="w-12 h-6 bg-gray-300 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : upcomingClasses.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingClasses.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border border-primary-100 rounded-xl bg-gradient-to-r from-white to-primary-50/30 hover:shadow-md transition-all duration-200">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{session.className}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            <span className="text-primary-600 font-medium">{session.instructor}</span> • {new Date(session.date).toLocaleDateString('vi-VN')} • {session.startTime} - {session.endTime}
                          </p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                            session.registrationStatus === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {session.registrationStatus === 'confirmed' ? '✓ Đã xác nhận' : '⏳ Chờ xác nhận'}
                          </span>
                        </div>
                        {(() => {
                          const timeInfo = checkSessionCancellationTime(session.date, session.startTime);
                          return (
                            <button 
                              onClick={() => handleCancelRegistration(session.id, session.registrationId, session.className, session.date, session.startTime)}
                              disabled={cancelLoading === session.registrationId || !timeInfo.canCancel}
                              className={`text-xs font-medium px-3 py-1 rounded-lg transition-colors disabled:opacity-50 ${
                                timeInfo.canCancel 
                                  ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                                  : 'text-gray-400 cursor-not-allowed'
                              }`}
                              title={timeInfo.canCancel ? 'Hủy đăng ký' : `Chỉ được hủy trước 1 tiếng. ${timeInfo.timeUntilSessionText}`}
                            >
                              {cancelLoading === session.registrationId 
                                ? 'Đang hủy...' 
                                : timeInfo.canCancel 
                                  ? 'Hủy' 
                                  : 'Không thể hủy'
                              }
                      </button>
                          );
                        })()}
                    </div>
                  ))}
                </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m6 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-6 4h6m-6 4h6" />
                    </svg>
                    <p>Chưa có lớp nào được đăng ký</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent classes */}
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100 lg:col-span-2">
              <div className="px-6 py-6 sm:p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Lịch sử tham gia</h3>
                </div>
                <div className="overflow-hidden">
                  {dataLoading ? (
                    <ul role="list" className="divide-y divide-primary-100/50">
                      {[...Array(3)].map((_, i) => (
                        <li key={i} className="py-5 animate-pulse">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                              <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="h-4 bg-gray-300 rounded mb-2"></div>
                              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                            </div>
                            <div className="w-20 h-6 bg-gray-300 rounded"></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : recentClasses.length > 0 ? (
                    <ul role="list" className="divide-y divide-primary-100/50">
                      {recentClasses.map((session) => (
                        <li key={session.id} className="py-5">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                                session.status === 'attended' 
                                  ? 'bg-gradient-to-br from-green-100 to-green-200' 
                                  : session.status === 'cancelled'
                                  ? 'bg-gradient-to-br from-gray-100 to-gray-200'
                                  : 'bg-gradient-to-br from-red-100 to-red-200'
                              }`}>
                                <svg className={`h-6 w-6 ${
                                  session.status === 'attended' 
                                    ? 'text-green-600' 
                                    : session.status === 'cancelled'
                                    ? 'text-gray-600'
                                    : 'text-red-600'
                                }`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                  {session.status === 'attended' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  ) : session.status === 'cancelled' ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  )}
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-base font-semibold text-gray-900 truncate">
                                  {session.className}
                                </p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                                  session.status === 'attended'
                                    ? 'bg-green-100 text-green-800 border-green-200'
                                    : session.status === 'cancelled'
                                    ? 'bg-gray-100 text-gray-800 border-gray-200'
                                    : 'bg-red-100 text-red-800 border-red-200'
                                }`}>
                                  {session.status === 'attended' 
                                    ? '✓ Đã tham gia' 
                                    : session.status === 'cancelled'
                                    ? '🚫 Đã hủy'
                                    : '✗ Vắng mặt'
                                  }
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 truncate mt-1">
                                <span className="text-primary-600 font-medium">{session.instructor}</span> • {new Date(session.date).toLocaleDateString('vi-VN')} • {session.startTime} - {session.endTime}
                              </p>
                              
                              {/* Action History */}
                              {session.actionHistory && session.actionHistory.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lịch sử hành động:</p>
                                  <div className="space-y-1">
                                    {session.actionHistory.map((action, index) => (
                                      <div key={index} className="flex items-center space-x-2 text-xs">
                                        <div className={`w-2 h-2 rounded-full ${
                                          action.action === 'registered' ? 'bg-blue-400' :
                                          action.action === 'cancelled' ? 'bg-red-400' :
                                          action.action === 'attended' ? 'bg-green-400' :
                                          'bg-gray-400'
                                        }`}></div>
                                        <span className="text-gray-600">
                                          {action.action === 'registered' ? '📝 Đăng ký' :
                                           action.action === 'cancelled' ? '🚫 Hủy đăng ký' :
                                           action.action === 'attended' ? '✅ Tham gia' :
                                           '❌ Vắng mặt'}
                                        </span>
                                        <span className="text-gray-400">
                                          {new Date(action.timestamp).toLocaleString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </span>
                                        {action.notes && (
                                          <span className="text-gray-500 italic">- {action.notes}</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                          </div>
                              )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>Chưa có lịch sử tham gia</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-12 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 border border-primary-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thao tác nhanh
            </h3>
              <p className="text-gray-600">Khám phá thêm những dịch vụ yoga tuyệt vời</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <a
                href="/calendar"
                className="group inline-flex items-center justify-center px-6 py-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Đăng ký lớp mới
              </a>
              <a
                href="/contact"
                className="group inline-flex items-center justify-center px-6 py-4 border border-primary-200 text-sm font-semibold rounded-xl text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Liên hệ hỗ trợ
              </a>
              <a
                href="/blog"
                className="group inline-flex items-center justify-center px-6 py-4 border border-secondary-200 text-sm font-semibold rounded-xl text-secondary-700 bg-white hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Đọc blog yoga
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Registration Modal */}
      {showCancelModal && cancelSessionData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Xác nhận hủy đăng ký
            </h3>
            
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">
                Bạn có chắc chắn muốn hủy đăng ký lớp học này không?
              </p>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-900">{cancelSessionData.className}</p>
                <p className="text-sm text-gray-600">{cancelSessionData.date}</p>
                {(() => {
                  const timeInfo = checkSessionCancellationTime(cancelSessionData.date, cancelSessionData.startTime);
                  return (
                    <p className={`text-xs mt-1 ${
                      timeInfo.canCancel ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {timeInfo.canCancel 
                        ? `✓ Có thể hủy (${timeInfo.timeUntilSessionText})` 
                        : `✗ Không thể hủy (${timeInfo.timeUntilSessionText})`
                      }
                    </p>
                  );
                })()}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelCancelRegistration}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmCancelRegistration}
                disabled={cancelLoading === cancelSessionData.registrationId}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cancelLoading === cancelSessionData.registrationId ? 'Đang hủy...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
