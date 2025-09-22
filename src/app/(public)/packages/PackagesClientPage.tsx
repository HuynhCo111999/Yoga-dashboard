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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50">
      <Header />

      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Gói Tập Yoga
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá các gói tập yoga phù hợp với nhu cầu và mục tiêu của bạn. 
              Từ cơ bản đến nâng cao, chúng tôi có gói tập phù hợp cho mọi trình độ.
            </p>
            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto"></div>
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
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100 hover:shadow-2xl transition-all duration-300 hover:border-primary-200 transform hover:scale-105"
                >
                  <div className="p-8">
                    {/* Package Icon */}
                    <div className="flex justify-center mb-6">
                      {getPackageIcon(pkg.name)}
                    </div>

                    {/* Package Name */}
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                      {pkg.name}
                    </h3>

                    {/* Package Description */}
                    <p className="text-gray-600 text-center mb-6 min-h-[3rem]">
                      {pkg.description || 'Gói tập yoga chất lượng cao với nhiều lợi ích cho sức khỏe và tinh thần.'}
                    </p>

                    {/* Package Features */}
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">
                          {getClassLimitText(pkg.classLimit)} mỗi tháng
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">
                          Giảng viên chuyên nghiệp
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">
                          Thiết bị tập luyện hiện đại
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700">
                          Không gian tập luyện thoải mái
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-8">
                      <div className="text-4xl font-bold text-primary-600 mb-2">
                        {formatPrice(pkg.price)} VND
                      </div>
                      <div className="text-sm text-gray-500">
                        Thời hạn: {pkg.duration.toString() + ' ngày' || '1 tháng'} 
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center">
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Liên hệ đăng ký
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
          <div className="mt-16 bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 border border-primary-100">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Bạn cần tư vấn thêm?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Đội ngũ tư vấn chuyên nghiệp của chúng tôi sẽ giúp bạn chọn gói tập phù hợp nhất với nhu cầu và mục tiêu của bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Liên hệ tư vấn
                </Link>
                <Link
                  href="/calendar"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary-200 text-base font-medium rounded-xl text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Xem lịch học
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
