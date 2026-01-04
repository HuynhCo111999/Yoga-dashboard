import { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/Header';
import PageLogger from '@/components/PageLogger';
import { generateMetadata, pageConfigs } from '@/utils/seo';

export const metadata: Metadata = generateMetadata(pageConfigs.about);

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-secondary-50">
      <PageLogger pageName="About Page" pageData={{ section: 'about' }} />
      <Header />
      <div className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mx-auto max-w-2xl lg:mx-0 relative">
            <div className="relative aspect-[16/6] sm:aspect-[16/5] lg:aspect-[16/6] rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8">
              <Image
                src="/images/about-us.png"
                alt="Không gian studio của Yên Yoga"
                fill
                priority={false}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 960px"
                className="object-cover"
              />
            </div>
            
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl text-center lg:text-left">Về Yên Yoga</h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600 text-center lg:text-left">
              Yên Yoga là một không gian dành riêng cho những người yêu thích yoga và mong muốn 
              tìm thấy sự cân bằng trong cuộc sống. Chúng tôi tin rằng yoga không chỉ là một bài tập thể dục, 
              mà là một hành trình khám phá bản thân và kết nối với cộng đồng.
            </p>
          </div>
          
          <div className="mx-auto mt-12 sm:mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:gap-x-8 lg:gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12">
            <div className="relative lg:order-last lg:col-span-5">
              <svg
                className="absolute -top-[40rem] left-1 -z-10 h-[64rem] w-[175.5rem] -translate-x-1/2 stroke-gray-900/10 [mask-image:radial-gradient(64rem_64rem_at_111.5rem_0%,white,transparent)]"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="e87443c8-56e4-4c20-9111-55b82fa704e3"
                    width={200}
                    height={200}
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M0.5 0V200M200 0.5L0 0.499983" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" strokeWidth={0} fill="url(#e87443c8-56e4-4c20-9111-55b82fa704e3)" />
              </svg>
              <figure className="border-l border-primary-600 pl-8">
                <blockquote className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                  <p>
                    &ldquo;Yoga là ánh sáng, một khi thắp lên sẽ không bao giờ tắt. 
                    Thực hành càng tốt, ngọn lửa càng sáng hơn.&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-8 flex gap-x-4">
                  <div className="text-sm leading-6">
                    <div className="font-semibold text-gray-900">B.K.S. Iyengar</div>
                    <div className="text-gray-600">Guru Yoga nổi tiếng thế giới</div>
                  </div>
                </figcaption>
              </figure>
            </div>
            <div className="max-w-xl text-base leading-7 text-gray-700 lg:col-span-7">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Câu chuyện của chúng tôi</h3>
              <p>
                Được thành lập vào năm 2020, Yên Yoga ra đời từ niềm đam mê chia sẻ những lợi ích 
                tuyệt vời của yoga đến với cộng đồng. Chúng tôi bắt đầu với một studio nhỏ và giờ đây 
                đã phát triển thành một cộng đồng gồm hơn 500 thành viên.
              </p>
              <p className="mt-6">
                Đội ngũ giảng viên của chúng tôi đều được đào tạo chuyên nghiệp với các chứng chỉ 
                quốc tế từ Yoga Alliance, Iyengar Yoga và nhiều trường phái yoga khác. Mỗi giảng viên 
                đều mang đến phong cách riêng và kinh nghiệm phong phú.
              </p>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">Sứ mệnh của chúng tôi</h3>
              <ul role="list" className="mt-6 max-w-xl space-y-4 text-gray-600">
                <li className="flex gap-x-3">
                  <span className="text-primary-600 font-bold">•</span>
                  Tạo ra một không gian an toàn và hỗ trợ cho mọi người thực hành yoga
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary-600 font-bold">•</span>
                  Chia sẻ kiến thức và kỹ năng yoga một cách chân thành và chuyên nghiệp
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary-600 font-bold">•</span>
                  Xây dựng cộng đồng yoga kết nối và hỗ trợ lẫn nhau
                </li>
                <li className="flex gap-x-3">
                  <span className="text-primary-600 font-bold">•</span>
                  Giúp mọi người tìm thấy sự cân bằng và hạnh phúc trong cuộc sống
                </li>
              </ul>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">Các lớp học của chúng tôi</h3>
              <p>
                Chúng tôi cung cấp đa dạng các lớp học từ cơ bản đến nâng cao:
              </p>
              <ul role="list" className="mt-4 space-y-2 text-gray-600">
                <li>• Hatha Yoga - Phù hợp cho người mới bắt đầu</li>
                <li>• Vinyasa Flow - Yoga động với nhịp thở</li>
                <li>• Yin Yoga - Yoga tĩnh, thư giãn sâu</li>
                <li>• Power Yoga - Yoga mạnh mẽ, tăng cường sức khỏe</li>
                <li>• Meditation - Thiền và thở</li>
              </ul>
            </div>
          </div>
          
          {/* Classes Gallery */}
          <div className="mx-auto mt-24 max-w-7xl">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">Không gian luyện tập của chúng tôi</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Main Studio Wireframe */}
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/aboutUs/about-us-1.png"
                    alt="Studio chính tại Yên Yoga"
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-900">Studio chính</h4>
                  <p className="text-sm text-gray-600">Không gian rộng rãi cho các lớp học nhóm</p>
                </div>
              </div>

              {/* Private Room Wireframe */}
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/aboutUs/about-us-2.png"
                    alt="Phòng tập riêng yên tĩnh"
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-900">Phòng riêng</h4>
                  <p className="text-sm text-gray-600">Không gian yên tĩnh cho luyện tập cá nhân</p>
                </div>
              </div>

              {/* Meditation Room Wireframe */}
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/aboutUs/about-us-3.png"
                    alt="Khu vực thiền tại Yên Yoga"
                    fill
                    loading="lazy"
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-900">Khu vực thiền</h4>
                  <p className="text-sm text-gray-600">Không gian tĩnh lặng cho thiền định</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
    </div>
  );
}
