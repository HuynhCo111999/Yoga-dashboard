'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  UserGroupIcon, 
  CubeIcon, 
  AcademicCapIcon, 
  CalendarDaysIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Tổng quan', href: '/admin', icon: ChartBarIcon },
  { name: 'Thành viên', href: '/admin/members', icon: UserGroupIcon },
  { name: 'Gói tập', href: '/admin/packages', icon: CubeIcon },
  { name: 'Lớp học', href: '/admin/classes', icon: AcademicCapIcon },
  { name: 'Ca tập', href: '/admin/sessions', icon: CalendarDaysIcon },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (!loading && !user) {
      // No user at all - redirect to login
      router.push('/login');
    } else if (!loading && user && user.role && user.role !== 'admin') {
      // User has role but not admin - redirect to appropriate dashboard
      if (user.role === 'member') {
        router.push('/member');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showUserMenu && !target.closest('#user-menu-button') && !target.closest('[role="menu"]')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = async () => {
    const result = await signOut();
    if (!result.error) {
      router.push('/login');
    } else {
      console.error('Logout error:', result.error);
    }
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

  // Show nothing if not admin (will redirect)
  if (!user || !user.role || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="relative z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
          <div className="fixed inset-0 flex">
            <div className="relative mr-16 flex w-full max-w-xs flex-1">
              <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                <button
                  type="button"
                  className="-m-2.5 p-2.5 hover:bg-white/10 rounded-full transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sr-only">Đóng sidebar</span>
                  <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/95 backdrop-blur-lg border-r border-primary-200/50 px-6 pb-4 shadow-2xl">
                <div className="flex h-16 shrink-0 items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">Y</span>
                  </div>
                  <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Yên Yoga Admin
                  </Link>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => {
                          const isActive = pathname === item.href;
                          return (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={`${
                                  isActive
                                    ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-r-2 border-primary-500 shadow-sm'
                                    : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/50'
                                } group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-semibold transition-all duration-200`}
                                onClick={() => setSidebarOpen(false)}
                              >
                                <item.icon
                                  className={`${
                                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
                                  } h-6 w-6 shrink-0 transition-colors`}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-primary-200/50 bg-white/95 backdrop-blur-lg px-6 pb-4 shadow-xl">
          <div className="flex h-16 shrink-0 items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">Y</span>
            </div>
            <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Yên Yoga Admin
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`${
                            isActive
                              ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-r-2 border-primary-500 shadow-sm'
                              : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/50'
                          } group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-semibold transition-all duration-200`}
                        >
                          <item.icon
                            className={`${
                              isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-600'
                            } h-6 w-6 shrink-0 transition-colors`}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-primary-200/50 bg-white/95 backdrop-blur-lg px-4 shadow-lg sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Mở sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="h-6 w-px bg-primary-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1">
              <div className="flex items-center">
                <h1 className="text-lg font-semibold text-gray-900">Panel quản trị</h1>
              </div>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Link
                href="/"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors"
              >
                Về trang chủ
              </Link>
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-primary-200" aria-hidden="true" />
              <div className="relative">
                <button
                  type="button"
                  className="-m-1.5 flex items-center p-1.5 hover:bg-primary-50 rounded-lg transition-colors"
                  id="user-menu-button"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="sr-only">Mở menu người dùng</span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                    <span className="text-sm font-medium text-white">A</span>
                  </div>
                  <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                      {user?.name || user?.email || 'Admin'}
                    </span>
                    <svg className="ml-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div role="menu" className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white/95 backdrop-blur-lg py-1 shadow-xl ring-1 ring-primary-200 focus:outline-none border border-primary-100">
                    <Link
                      href="/admin/profile"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-primary-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="mr-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Cài đặt
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
        </div>

        {/* Main content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
