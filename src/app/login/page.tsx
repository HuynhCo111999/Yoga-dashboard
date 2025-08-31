'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'member'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - trong thực tế sẽ gọi API
    setTimeout(() => {
      if (formData.email && formData.password) {
        // Store auth state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', formData.role);
        
        // Redirect based on role
        if (formData.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/member');
        }
      } else {
        alert('Vui lòng nhập email và mật khẩu');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Demo login functions
  const loginAsAdmin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'admin');
    router.push('/admin');
  };

  const loginAsMember = () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'member');
    router.push('/member');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Main login card */}
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 sm:p-10 border border-white/20">
          {/* Logo and header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-2xl">Y</span>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Yên Yoga
              </span>
            </Link>
            
            <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
              Chào mừng trở lại
            </h2>
            <p className="mt-2 text-gray-600">
              Đăng nhập để tiếp tục hành trình yoga của bạn
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Hoặc{' '}
              <Link href="/" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                quay lại trang chủ
              </Link>
            </p>
          </div>
        
          {/* Login form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Email input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 placeholder-gray-400"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Role selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                  Vai trò đăng nhập
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <select
                    id="role"
                    name="role"
                    className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 appearance-none"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="member">Thành viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Đang đăng nhập...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Đăng nhập</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Demo login buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <div className="text-center mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Đăng nhập nhanh (Demo)
              </h3>
              <p className="text-xs text-gray-500">
                Dành cho việc demo và test ứng dụng
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={loginAsAdmin}
                className="group flex items-center justify-center py-3 px-4 border border-primary-200 rounded-xl shadow-sm text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin
              </button>
              
              <button
                onClick={loginAsMember}
                className="group flex items-center justify-center py-3 px-4 border border-secondary-200 rounded-xl shadow-sm text-sm font-medium text-secondary-700 bg-secondary-50 hover:bg-secondary-100 hover:border-secondary-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-secondary-500 transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Member
              </button>
            </div>
          </div>

          {/* Decorative yoga quote */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
            </div>
            <p className="mt-2 text-xs text-gray-500 italic font-light">
              &ldquo;Yoga là hành trình của bản thân, đến bản thân, thông qua bản thân&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
