'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { packagesApi, Package } from '@/lib/api';
import Header from '@/components/Header';

export default function PackagesClientPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await packagesApi.getActivePackages();
      
      if (result.success && result.data) {
        setPackages(result.data);
      } else {
        setError('Không thể tải danh sách gói tập');
      }
    } catch (err) {
      console.error('Error loading packages:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN');
  };

  const getClassLimitText = (classLimit: number) => {
    if (classLimit === -1) {
      return 'Không giới hạn';
    }
    return `${classLimit} buổi`;
  };

  const getPackageIcon = (packageName: string) => {
    const name = packageName.toLowerCase();
    if (name.includes('basic') || name.includes('cơ bản')) {
      return (
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      );
    } else if (name.includes('premium') || name.includes('nâng cao')) {
      return (
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
      );
    } else if (name.includes('vip') || name.includes('đặc biệt')) {
      return (
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50">
        <Header />

        <div className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="text-gray-600">Đang tải gói tập...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-[100dvh] bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-float-slow pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-float pointer-events-none"></div>

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        {/* Page Header */}
        <div className='text-center mb-16'>
          <span className="inline-block py-1.5 px-4 rounded-full bg-white border border-secondary-200 text-secondary-600 text-sm font-semibold tracking-wide mb-4 shadow-sm animate-fadeInUp">
            Chi Phí Đầu Tư
          </span>
          <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight animate-fadeInUp animate-delay-100'>
            Gói tập <span className="gradient-text">Yoga</span>
          </h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto animate-fadeInUp animate-delay-200'>
            Khám phá các gói tập yoga phù hợp với nhu cầu và mục tiêu của bạn. Từ cơ bản đến nâng cao, chúng tôi có gói tập phù hợp cho mọi trình độ.
          </p>
        </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
              <button 
                onClick={loadPackages}
                className="ml-2 text-red-800 hover:text-red-900 underline"
              >
                Thử lại
              </button>
            </div>
          )}

          {/* Packages Grid */}
          {packages.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {packages.map((pkg, idx) => (
                <div
                  key={pkg.id}
                  className="group relative bg-white/70 backdrop-blur-xl shadow-xl rounded-[2rem] border border-white hover:shadow-[0_20px_40px_rgba(219,110,76,0.15)] transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {/* Subtle top gradient line */}
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 to-accent-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100"></div>
                  
                  <div className="p-8 lg:p-10 flex-1 flex flex-col">
                    {/* Package Icon */}
                    <div className="flex justify-center mb-8 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500">
                      {getPackageIcon(pkg.name)}
                    </div>

                    {/* Package Name */}
                    <h3 className="text-2xl font-extrabold text-gray-900 text-center mb-4 group-hover:text-primary-600 transition-colors">
                      {pkg.name}
                    </h3>

                    {/* Package Description */}
                    <p className="text-gray-600 text-center mb-8 min-h-[3rem] leading-relaxed">
                      {pkg.description || 'Gói tập yoga chất lượng cao với nhiều lợi ích cho sức khỏe và tinh thần.'}
                    </p>

                    {/* Package Features */}
                    <div className="space-y-4 mb-10 flex-1">
                      <div className="flex items-start space-x-3 group/feature">
                        <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5 group-hover/feature:bg-primary-100 transition-colors shadow-sm text-primary-600">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-[15px] font-medium text-gray-700">
                          {getClassLimitText(pkg.classLimit)} mỗi tháng
                        </span>
                      </div>
                      
                      <div className="flex items-start space-x-3 group/feature">
                        <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5 group-hover/feature:bg-primary-100 transition-colors shadow-sm text-primary-600">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-[15px] font-medium text-gray-700">
                          Giảng viên chuyên nghiệp
                        </span>
                      </div>

                      <div className="flex items-start space-x-3 group/feature">
                        <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5 group-hover/feature:bg-primary-100 transition-colors shadow-sm text-primary-600">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-[15px] font-medium text-gray-700">
                          Thiết bị tập luyện hiện đại
                        </span>
                      </div>

                      <div className="flex items-start space-x-3 group/feature">
                        <div className="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5 group-hover/feature:bg-primary-100 transition-colors shadow-sm text-primary-600">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-[15px] font-medium text-gray-700">
                          Không gian tập yên tĩnh
                        </span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

                    {/* Price */}
                    <div className="text-center mb-8">
                      <div className="text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-sm">
                        {formatPrice(pkg.price)}<span className="text-xl font-bold text-gray-500 ml-1">đ</span>
                      </div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Thời hạn {pkg.duration.toString() + ' ngày' || '1 tháng'}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mt-auto">
                      <Link
                        href="/contact"
                        className="btn-shine inline-flex items-center justify-center w-full px-6 py-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 transition-all duration-300 shadow-[0_4px_14px_0_rgba(234,88,12,0.39)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.23)]"
                      >
                        Liên hệ đăng ký ngay
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có gói tập nào
              </h3>
              <p className="text-gray-500">
                Hiện tại chưa có gói tập nào được cung cấp. Vui lòng quay lại sau.
              </p>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-20 relative lg:mt-28">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl blur-xl opacity-25"></div>
            <div className="relative bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-10 sm:p-14 text-center text-white shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
              
              <h3 className="relative text-3xl sm:text-4xl font-bold mb-6">
                Bạn cần tư vấn lộ trình riêng?
              </h3>
              <p className="relative text-lg sm:text-xl text-orange-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Đội ngũ chuyên gia của Yên Yoga sẽ cùng bạn xây dựng thời khóa biểu và cá nhân hóa lộ trình tùy theo thể trạng của riêng bạn.
              </p>
              <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-primary-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  Liên hệ nhận tư vấn
                </Link>
                <Link
                  href="/calendar"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-lg font-bold rounded-xl text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300 hover:-translate-y-1"
                >
                  Xem lịch khai giảng
                </Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
