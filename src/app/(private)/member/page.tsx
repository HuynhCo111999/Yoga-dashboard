'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const memberData = {
  name: 'Nguyễn Thị Lan',
  email: 'lan.nguyen@email.com',
  membershipStatus: 'active',
  currentPackage: 'Gói Premium',
  remainingClasses: 8,
  joinDate: '2024-01-15',
  nextClass: {
    name: 'Hatha Yoga Cơ bản',
    instructor: 'Nguyễn Thị Hương',
    date: '2024-01-24',
    time: '18:00 - 19:30'
  }
};

const recentClasses = [
  {
    id: 1,
    name: 'Vinyasa Flow',
    instructor: 'Trần Văn Nam',
    date: '2024-01-20',
    status: 'attended'
  },
  {
    id: 2,
    name: 'Yin Yoga',
    instructor: 'Lê Thị Mai',
    date: '2024-01-18',
    status: 'attended'
  },
  {
    id: 3,
    name: 'Hatha Yoga Cơ bản',
    instructor: 'Nguyễn Thị Hương',
    date: '2024-01-16',
    status: 'attended'
  }
];

const upcomingClasses = [
  {
    id: 1,
    name: 'Hatha Yoga Cơ bản',
    instructor: 'Nguyễn Thị Hương',
    date: '2024-01-24',
    time: '18:00 - 19:30',
    status: 'registered'
  },
  {
    id: 2,
    name: 'Power Yoga',
    instructor: 'Phạm Minh Đức',
    date: '2024-01-26',
    time: '06:30 - 07:45',
    status: 'registered'
  }
];

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

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    // Allow both members and admins to access this page
  }, [user, loading, router]);

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
                        {memberData.currentPackage}
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
                        {memberData.remainingClasses} lớp
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
                        {new Date(memberData.joinDate).toLocaleDateString('vi-VN')}
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
                        memberData.membershipStatus === 'active' ? 'bg-white' : 'bg-red-300'
                      }`}></div>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-semibold text-secondary-600 uppercase tracking-wide truncate">
                        Trạng thái
                      </dt>
                      <dd className="text-xl font-bold text-gray-900 mt-1">
                        {memberData.membershipStatus === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                {memberData.nextClass ? (
                  <div className="border border-primary-200 rounded-2xl p-6 bg-gradient-to-r from-primary-50 to-accent-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-primary-900 mb-2">
                          {memberData.nextClass.name}
                        </h4>
                        <p className="text-sm text-primary-700 mb-1">
                          <span className="font-semibold">Giảng viên:</span> {memberData.nextClass.instructor}
                        </p>
                        <p className="text-sm text-primary-700">
                          <span className="font-semibold">Thời gian:</span> {new Date(memberData.nextClass.date).toLocaleDateString('vi-VN')} • {memberData.nextClass.time}
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
                <div className="space-y-4">
                  {upcomingClasses.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-4 border border-primary-100 rounded-xl bg-gradient-to-r from-white to-primary-50/30 hover:shadow-md transition-all duration-200">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{cls.name}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="text-primary-600 font-medium">{cls.instructor}</span> • {new Date(cls.date).toLocaleDateString('vi-VN')} • {cls.time}
                        </p>
                      </div>
                      <button className="text-red-600 hover:text-red-800 text-xs font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">
                        Hủy
                      </button>
                    </div>
                  ))}
                </div>
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
                  <ul role="list" className="divide-y divide-primary-100/50">
                    {recentClasses.map((cls) => (
                      <li key={cls.id} className="py-5">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-gray-900 truncate">
                              {cls.name}
                            </p>
                            <p className="text-sm text-gray-600 truncate mt-1">
                              <span className="text-primary-600 font-medium">{cls.instructor}</span> • {new Date(cls.date).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                              ✓ Đã tham gia
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
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
    </div>
  );
}
