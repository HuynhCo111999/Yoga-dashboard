import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import Header from '@/components/Header';
import StructuredData from '@/components/StructuredData';
import PageLogger from '@/components/PageLogger';
import TestimonialCarousel from '@/components/TestimonialCarousel';
import { generateMetadata as generateSEOMetadata, pageConfigs } from '@/utils/seo';

export const metadata: Metadata = generateSEOMetadata(pageConfigs.home);

export default function Home() {
  return (
    <>
      <PageLogger pageName="Landing Page" pageData={{ section: 'home' }} />
      <Header />

      {/* Hero Section */}
      <section className="relative flex items-center overflow-hidden bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50">
        {/* Background decorative blobs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary-200 rounded-full opacity-20 animate-float-slow" style={{filter: 'blur(60px)'}}></div>
          <div className="absolute top-20 right-0 w-96 h-96 bg-accent-200 rounded-full opacity-20 animate-float" style={{filter: 'blur(80px)', animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-secondary-200 rounded-full opacity-20 animate-float-slow" style={{filter: 'blur(50px)', animationDelay: '1s'}}></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="mx-auto lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-center">
            {/* Left: Text */}
            <div className="lg:col-span-6 animate-fade-in-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-primary-100 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                <span className="text-base">✨</span>
                <span className="text-sm font-medium text-primary-700">Trải nghiệm buổi học đầu tiên miễn phí</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl leading-tight text-center lg:text-left">
                Chào mừng đến với{' '}
                <span className="gradient-text block sm:inline">Yên Yoga</span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-gray-600 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
                Khám phá hành trình yoga cùng những giảng viên chuyên nghiệp và cộng đồng yêu thương.
                Tìm sự cân bằng giữa <strong className="text-gray-800">cơ thể và tâm hồn</strong> trong không gian thanh tịnh.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/calendar"
                  className="btn-shine w-full sm:w-auto rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all duration-300 text-center"
                >
                  Xem lịch học ngay →
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-200 bg-white/60 px-8 py-3.5 text-sm font-semibold text-primary-700 hover:bg-primary-50 hover:border-primary-400 transition-all duration-300 text-center"
                >
                  Tìm hiểu thêm
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 lg:gap-8">
                {[
                  { value: '500+', label: 'Học viên' },
                  { value: '10+', label: 'Giảng viên' },
                  { value: '5★', label: 'Đánh giá' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Image */}
            <div className="lg:col-span-6 mt-12 lg:mt-0 animate-slide-in-right animate-delay-200">
              <div className="relative max-w-lg mx-auto lg:max-w-none">
                {/* Main image */}
                <div className="relative aspect-[4/3] rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
                  <Image
                    src="/images/banner.png"
                    alt="Không gian tập yoga tại Yên Yoga"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 560px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIRAAAQMEAwEAAAAAAAAAAAAAAQIDBAURITFBUWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAABAgMRITH/2gAMAwEAAhEDEQA/AKzb7TPuMxMKBFdlSVjIaaSVKI9gBk1mNSXC46gtDltvFubjIZUD4W0lKVDHbIPNPdCbYNV3OO0+lXwyFNuKT2KSMg/FMdK6etWnWlGKl15xw5cfeyXFH5PoB6AAqAP/2Q=="
                  />
                  {/* Gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-5 -left-5 glass-card rounded-2xl px-5 py-3 shadow-xl border border-white/80 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <span className="text-white text-lg">🧘</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Triết lý của chúng tôi</p>
                      <p className="text-sm font-semibold text-gray-800">Yên tâm · Cân bằng · Khoẻ mạnh</p>
                    </div>
                  </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent-300 rounded-full opacity-60 animate-float-slow" style={{animationDelay: '1.5s'}}></div>
                <div className="absolute -bottom-3 right-10 w-12 h-12 bg-primary-300 rounded-full opacity-50 animate-float" style={{animationDelay: '0.5s'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L48 48C96 36 192 12 288 6C384 0 480 12 576 24C672 36 768 48 864 48C960 48 1056 36 1152 28.5C1248 21 1344 18 1392 16.5L1440 15V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4 border border-primary-100">
              Dịch vụ của chúng tôi
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Tất cả những gì bạn cần
              <span className="gradient-text"> cho hành trình yoga</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                ),
                title: 'Giảng viên chuyên nghiệp',
                desc: 'Đội ngũ giảng viên có chứng chỉ quốc tế với nhiều năm kinh nghiệm giảng dạy.',
                color: 'from-primary-400 to-primary-600',
                bg: 'bg-primary-50',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
                ),
                title: 'Lịch học linh hoạt',
                desc: 'Đa dạng thời gian và cấp độ để phù hợp với mọi lịch trình của bạn.',
                color: 'from-accent-400 to-accent-600',
                bg: 'bg-accent-50',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                ),
                title: 'Không gian thoải mái',
                desc: 'Studio được thiết kế hiện đại, tràn ngập ánh sáng tự nhiên và yên tĩnh.',
                color: 'from-secondary-400 to-secondary-600',
                bg: 'bg-secondary-50',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                ),
                title: 'Cộng đồng hỗ trợ',
                desc: 'Tham gia cộng đồng yoga năng động, hỗ trợ và truyền cảm hứng lẫn nhau.',
                color: 'from-primary-300 to-accent-500',
                bg: 'bg-gradient-to-br from-primary-50 to-accent-50',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`feature-card group relative rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-primary-100 bg-white overflow-hidden`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.bg}`} style={{opacity: 0.04}}></div>
                <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md`}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages CTA Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-secondary-50 to-primary-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-40 h-40 bg-primary-200 rounded-full opacity-20" style={{filter: 'blur(40px)'}}></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 bg-accent-200 rounded-full opacity-20" style={{filter: 'blur(30px)'}}></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/80 text-primary-600 text-sm font-semibold mb-4 border border-primary-100 shadow-sm">
              Gói tập yoga
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Chọn gói tập{' '}
              <span className="gradient-text">phù hợp với bạn</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Từ cơ bản đến nâng cao — chúng tôi có gói tập cho mọi trình độ và nhu cầu.
            </p>
          </div>

          {/* Package preview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            {[
              { name: 'Cơ bản', sessions: '8 buổi/tháng', badge: '', color: 'border-gray-200' },
              { name: 'Tiêu chuẩn', sessions: '12 buổi/tháng', badge: 'Phổ biến', color: 'border-primary-400' },
              { name: 'Nâng cao', sessions: 'Không giới hạn', badge: '', color: 'border-accent-400' },
            ].map((pkg) => (
              <div
                key={pkg.name}
                className={`relative bg-white rounded-2xl border-2 ${pkg.color} p-5 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
              >
                {pkg.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {pkg.badge}
                  </span>
                )}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🧘</span>
                </div>
                <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{pkg.sessions}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/packages"
              className="btn-shine inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Xem tất cả gói tập
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery & Testimonial Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-50 text-secondary-700 text-sm font-semibold mb-4 border border-secondary-200">
              Trải nghiệm thực tế
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Không gian yoga{' '}
              <span className="gradient-text">của chúng tôi</span>
            </h2>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {[
              {
                src: '/images/class/class-1.png',
                alt: 'Không gian studio Yên Yoga',
                title: 'Không gian luyện tập',
                desc: 'Studio rộng rãi, tràn ngập ánh sáng tự nhiên với thảm tập và dụng cụ luôn được vệ sinh sạch sẽ.',
              },
              {
                src: '/images/class/class-2.png',
                alt: 'Lớp học yoga tại Yên Yoga',
                title: 'Lớp học đa dạng',
                desc: 'Lịch học linh hoạt với nhiều khung giờ sáng – trưa – tối, phù hợp cho mọi đối tượng.',
              },
              {
                src: '/images/class/class-3.png',
                alt: 'Cộng đồng Yên Yoga',
                title: 'Cộng đồng thân thiện',
                desc: 'Mỗi buổi tập là dịp để kết nối, chia sẻ và truyền cảm hứng cho nhau trong hành trình sức khỏe.',
              },
            ].map((item) => (
              <div key={item.title} className="group">
                <div className="gallery-item rounded-2xl overflow-hidden shadow-lg aspect-[3/2] mb-4">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIRAAAQMEAwEAAAAAAAAAAAAAAQIDBAURITFBUWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABsRAAICAwEAAAAAAAAAAAAAAAABAgMRITH/2gAMAwEAAhEDEQA/AKzb7TPuMxMKBFdlSVjIaaSVKI9gBk1mNSXC46gtDltvFiUoD4W0kKSMg/FMdK6etWnWlOKl15xw5cfeyXFH5PoB6AAqAP/2Q=="
                  />
                  <div className="gallery-overlay">
                    <span className="text-white text-sm font-semibold">{item.title}</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Testimonial Carousel */}
          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900"></div>
        {/* Decorative shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-white rounded-full opacity-5"></div>
          <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-accent-400 rounded-full opacity-10"></div>
          <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-white rounded-full opacity-5 animate-float"></div>
        </div>

        <div className="relative px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
              <span className="text-3xl">🧘‍♀️</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              Bắt đầu hành trình yoga
              <span className="block text-accent-300">của bạn ngay hôm nay</span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
              Đăng ký thành viên để được trải nghiệm các lớp học yoga đa dạng
              và nhận được sự hướng dẫn tận tình từ đội ngũ giảng viên.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/member"
                className="btn-shine w-full sm:w-auto rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary-600 shadow-xl hover:bg-primary-50 hover:shadow-2xl transition-all duration-300 text-center"
              >
                Đăng ký thành viên
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto rounded-xl border-2 border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/60 transition-all duration-300 text-center"
              >
                Liên hệ tư vấn →
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
