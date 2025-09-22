import Link from 'next/link';
import { Metadata } from 'next';
import Header from '@/components/Header';
import StructuredData from '@/components/StructuredData';
import { generateMetadata as generateSEOMetadata, pageConfigs } from '@/utils/seo';

export const metadata: Metadata = generateSEOMetadata(pageConfigs.home);

export default function Home() {
  return (
    <>
      <Header />
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-accent-50 to-primary-50 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none lg:grid lg:grid-cols-12 lg:gap-x-8 lg:items-center">
              <div className="lg:col-span-7">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-6xl text-center lg:text-left">
                  Chào mừng đến với{' '}
                  <span className="text-primary-600">Yên Yoga</span>
                </h1>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 text-center lg:text-left">
                  Khám phá hành trình yoga của bạn cùng với những giảng viên chuyên nghiệp 
                  và cộng đồng yoga yêu thương. Tìm sự cân bằng giữa cơ thể và tâm hồn trong không gian thanh tịnh và bình yên.
                </p>
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-x-6">
                  <Link
                    href="/calendar"
                    className="w-full sm:w-auto rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors duration-200 text-center"
                  >
                    Xem lịch học
                  </Link>
                  <Link href="/about" className="w-full sm:w-auto text-sm font-semibold leading-6 text-gray-900 hover:text-primary-600 transition-colors duration-200 text-center">
                    Tìm hiểu thêm <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 mt-8 sm:mt-12 lg:mt-0">
                {/* Hero Image Wireframe */}
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  <div className="aspect-[4/3] bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl shadow-xl overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-secondary-400 p-4">
                        <svg className="mx-auto h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 mb-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                        <p className="text-xs sm:text-sm font-medium">Hero Image Placeholder</p>
                        <p className="text-xs">Yoga studio hoặc người tập yoga</p>
                      </div>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-accent-200 rounded-full opacity-50"></div>
                  <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-primary-200 rounded-full opacity-50"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary-600">Dịch vụ của chúng tôi</h2>
              <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Tất cả những gì bạn cần cho hành trình yoga
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-20 lg:max-w-4xl">
              <dl className="grid max-w-xl grid-cols-1 gap-6 sm:gap-8 lg:max-w-none lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12">
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    Giảng viên chuyên nghiệp
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Đội ngũ giảng viên có chứng chỉ quốc tế với nhiều năm kinh nghiệm.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                      </svg>
                    </div>
                    Lịch học linh hoạt
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Đa dạng thời gian và cấp độ để phù hợp với lịch trình của bạn.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    </div>
                    Không gian thoải mái
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Studio được thiết kế hiện đại, thoáng mát và yên tĩnh.
                  </dd>
                </div>
                <div className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    Cộng đồng hỗ trợ
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    Tham gia cộng đồng yoga năng động và hỗ trợ lẫn nhau.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary-600">Gói tập yoga</h2>
              <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Chọn gói tập phù hợp với bạn
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Từ cơ bản đến nâng cao, chúng tôi có gói tập phù hợp cho mọi trình độ và nhu cầu.
              </p>
            </div>
            
            <div className="mt-12 text-center">
              <Link
                href="/packages"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Xem tất cả gói tập
              </Link>
            </div>
          </div>
        </section>

        {/* Gallery/Testimonials Section with Wireframes */}
        <section className="py-24 sm:py-32 bg-secondary-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary-600">Trải nghiệm thực tế</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Không gian yoga và cộng đồng của chúng tôi
              </p>
            </div>
            
            {/* Image Gallery Wireframes */}
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {/* Studio Image */}
              <div className="relative">
                <div className="aspect-[3/2] bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl overflow-hidden shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-secondary-400">
                      <svg className="mx-auto h-16 w-16 mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9V7a1 1 0 011-1h16a1 1 0 011 1v2M3 9v10a1 1 0 001 1h16a1 1 0 001-1V9M3 9l9 5 9-5"/>
                      </svg>
                      <p className="text-xs font-medium">Studio Space</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">Không gian luyện tập</h3>
                  <p className="text-sm text-gray-600">Studio hiện đại với ánh sáng tự nhiên</p>
                </div>
              </div>

              {/* Class Image */}
              <div className="relative">
                <div className="aspect-[3/2] bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl overflow-hidden shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-accent-500">
                      <svg className="mx-auto h-16 w-16 mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 6.5a9.77 9.77 0 00-8.82 5.5c1.64 2.84 5.19 5.5 8.82 5.5s7.18-2.66 8.82-5.5A9.77 9.77 0 0012 6.5zM12 16a4 4 0 110-8 4 4 0 010 8zm0-6a2 2 0 100 4 2 2 0 000-4z"/>
                      </svg>
                      <p className="text-xs font-medium">Yoga Class</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">Lớp học đa dạng</h3>
                  <p className="text-sm text-gray-600">Từ cơ bản đến nâng cao cho mọi trình độ</p>
                </div>
              </div>

              {/* Community Image */}
              <div className="relative">
                <div className="aspect-[3/2] bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl overflow-hidden shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-primary-500">
                      <svg className="mx-auto h-16 w-16 mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V18h2v-4h3v4h2V9.5C19 8.12 17.88 7 16.5 7S14 8.12 14 9.5V11h-4V9.5C10 8.12 8.88 7 7.5 7S5 8.12 5 9.5V18h-1z"/>
                      </svg>
                      <p className="text-xs font-medium">Community</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cộng đồng thân thiện</h3>
                  <p className="text-sm text-gray-600">Kết nối và hỗ trợ lẫn nhau</p>
                </div>
              </div>
            </div>

            {/* Testimonial Wireframe */}
            <div className="mx-auto mt-16 max-w-3xl">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-secondary-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="h-4 bg-secondary-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-secondary-100 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-4/5"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </div>
                <p className="text-center text-sm text-gray-400 mt-4">Customer Testimonial Placeholder</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600">
          <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Bắt đầu hành trình yoga của bạn ngay hôm nay
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
                Đăng ký thành viên để được trải nghiệm các lớp học yoga đa dạng 
                và nhận được sự hướng dẫn tận tình từ đội ngũ giảng viên.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/member"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm hover:bg-primary-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Đăng ký thành viên
                </Link>
                                  <Link href="/contact" className="text-sm font-semibold leading-6 text-white">
                    Liên hệ tư vấn <span aria-hidden="true">→</span>
                  </Link>
              </div>
        </div>
    </div>
        </section>
        
        {/* Structured Data for HomePage */}
        <StructuredData type="blog" />
    </>
  );
}
