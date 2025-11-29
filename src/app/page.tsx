import Link from 'next/link';
import Image from 'next/image';
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
                {/* Hero Image */}
                <div className="relative max-w-md mx-auto lg:max-w-none">
                  <div className="relative aspect-[4/3] rounded-2xl shadow-xl overflow-hidden">
        < Image
                      src="/images/banner.png"
                      alt="Không gian tập yoga tại Yên Yoga"
                      fill
                priority={false}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 560px"
                      className="object-cover"
                      loading="lazy"
                    />
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

        {/* Gallery/Testimonials Section */}
        <section className="py-24 sm:py-32 bg-secondary-50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary-600">Trải nghiệm thực tế</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Không gian yoga và cộng đồng của chúng tôi
              </p>
            </div>
            
            {/* Image Gallery */}
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {/* Studio Image */}
              <div className="relative">
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/class/class-1.png"
                    alt="Không gian studio Yên Yoga"
                    fill
                    priority={false}
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">Không gian luyện tập</h3>
                  <p className="text-sm text-gray-600">
                    Studio rộng rãi, tràn ngập ánh sáng tự nhiên với thảm tập và dụng cụ luôn được
                    vệ sinh sạch sẽ sau mỗi buổi học.
                  </p>
                </div>
        </div>

              {/* Class Image */}
              <div className="relative">
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-lg">
          <Image
                    src="/images/class/class-2.png"
                    alt="Lớp học yoga tại Yên Yoga"
                    fill
                    priority={false}
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">Lớp học đa dạng</h3>
                  <p className="text-sm text-gray-600">
                    Lịch học linh hoạt với nhiều khung giờ sáng – trưa – tối, phù hợp cho người đi làm
                    và cả học sinh, sinh viên.
                  </p>
                </div>
              </div>

              {/* Community Image */}
              <div className="relative">
                <div className="relative aspect-[3/2] rounded-xl overflow-hidden shadow-lg">
          <Image
                    src="/images/class/class-3.png"
                    alt="Cộng đồng Yên Yoga"
                    fill
                    priority={false}
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cộng đồng thân thiện</h3>
                  <p className="text-sm text-gray-600">
                    Mỗi buổi tập không chỉ là luyện tập mà còn là dịp để kết nối, chia sẻ và truyền cảm
                    hứng cho nhau trong hành trình chăm sóc sức khỏe.
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mx-auto mt-16 max-w-3xl">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-full flex items-center justify-center">
                    <span className="text-secondary-700 font-bold text-2xl">L</span>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <p className="text-base font-semibold text-gray-900">Lan Anh • 32 tuổi</p>
                    <p className="text-sm text-gray-500">Thành viên gắn bó hơn 1 năm tại Yên Yoga</p>
                  </div>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p>
                    “Sau giờ làm việc căng thẳng, mỗi buổi tối đến Yên Yoga giống như được reset lại hoàn toàn.
                    Không gian yên tĩnh, giảng viên hướng dẫn rất kỹ và luôn để ý tới từng chuyển động của học viên.”
                  </p>
                  <p>
                    “Khoảng 3 tháng tập đều đặn, mình ngủ ngon hơn, ít đau mỏi vai gáy và tinh thần cũng nhẹ nhàng hơn rất nhiều.
                    Điều mình thích nhất là lớp không quá đông nên cảm giác rất an toàn và gần gũi.”
                  </p>
                </div>
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
