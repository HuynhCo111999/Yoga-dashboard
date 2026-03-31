import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import PageLogger from '@/components/PageLogger';
import { generateMetadata, pageConfigs, generateBreadcrumbStructuredData } from '@/utils/seo';
import {
  HeartIcon,
  SparklesIcon,
  UserGroupIcon,
  SunIcon,
} from '@heroicons/react/24/outline';

export const metadata: Metadata = generateMetadata(pageConfigs.about);

const missions = [
  {
    name: 'Không gian an toàn',
    description: 'Tạo ra một không gian an toàn và hỗ trợ cho mọi người thực hành yoga không phán xét.',
    icon: HeartIcon,
  },
  {
    name: 'Chân thành & Chuyên nghiệp',
    description: 'Chia sẻ kiến thức và kỹ năng yoga một cách chân thành, bài bản và chuyên nghiệp nhất.',
    icon: SparklesIcon,
  },
  {
    name: 'Cộng đồng gắn kết',
    description: 'Xây dựng một cộng đồng yoga vững mạnh, nơi mọi người kết nối và hỗ trợ lẫn nhau.',
    icon: UserGroupIcon,
  },
  {
    name: 'Cân bằng & Hạnh phúc',
    description: 'Giúp mọi người tìm thấy sự bình yên nội tâm, cân bằng và hạnh phúc trong cuộc sống.',
    icon: SunIcon,
  },
];

const classes = [
  { name: 'Hatha Yoga', desc: 'Phù hợp cho người mới bắt đầu, chậm rãi và chắc chắn.' },
  { name: 'Vinyasa Flow', desc: 'Yoga động kết hợp nhịp nhàng giữa chuyển động và hơi thở.' },
  { name: 'Yin Yoga', desc: 'Tập trung vào các mô liên kết, giữ thế lâu để thư giãn sâu.' },
  { name: 'Power Yoga', desc: 'Mạnh mẽ, rèn luyện thể lực và sức bền vượt trội.' },
  { name: 'Meditation', desc: 'Thiền định và thực hành hơi thở giúp tịnh tâm.' },
];

export default function About() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <PageLogger pageName="About Page" pageData={{ section: 'about' }} />
        <Header />
        
        <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-float-slow"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-float"></div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-block py-1.5 px-4 rounded-full bg-primary-50 border border-primary-200 text-primary-600 text-sm font-semibold tracking-wide mb-6 shadow-sm">
                Về Chúng Tôi
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-8">
                Hành trình tìm lại <br className="hidden sm:block" />
                <span className="gradient-text">sự cân bằng đích thực</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-10">
                Yên Yoga là không gian dành riêng cho những ai mong muốn khám phá bản thân. Chúng tôi tin rằng yoga không chỉ là bài tập thể chất, mà là cánh cửa dẫn đến sự bình yên trong tâm hồn.
              </p>
            </div>

            {/* Featured Image */}
            <div className="mt-16 relative max-w-5xl mx-auto">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5">
                <Image
                  src="/images/about-us.png"
                  alt="Không gian studio của Yên Yoga"
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-1000"
                  sizes="(max-width: 1280px) 100vw, 1024px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
              </div>
              
              {/* Floating Quote Card */}
              <div className="absolute -bottom-6 sm:-bottom-10 left-4 sm:left-10 right-4 sm:right-auto bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border border-white/50 max-w-sm animate-fadeInUp">
                <blockquote className="text-gray-900 font-medium italic text-base sm:text-lg mb-4">
                  "Yoga là ánh sáng, một khi thắp lên sẽ không bao giờ tắt. Thực hành càng tốt, ngọn lửa càng sáng hơn."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                    B
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">B.K.S. Iyengar</div>
                    <div className="text-xs text-gray-500 text-transform uppercase tracking-wider">Guru Yoga Thế Giới</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Story & Mission Section */}
        <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[500px] h-[500px] rounded-full bg-primary-50/50 blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-40 left-0 -ml-40 w-[400px] h-[400px] rounded-full bg-secondary-50/80 blur-[80px] pointer-events-none"></div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Story */}
              <div className="relative">
                <div className="absolute -left-6 -top-6 w-20 h-20 border-t-4 border-l-4 border-primary-100 rounded-tl-3xl opacity-50"></div>
                <div className="absolute -right-6 -bottom-6 w-20 h-20 border-b-4 border-r-4 border-accent-100 rounded-br-3xl opacity-50"></div>
                
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                  Khởi nguồn từ <br/> <span className="text-primary-600">tình yêu Yoga</span>
                </h2>
                <div className="prose prose-lg text-gray-600 space-y-6">
                  <p className="text-xl font-medium text-gray-800 leading-relaxed border-l-4 border-primary-300 pl-6">
                    Được thành lập vào năm 2020, Yên Yoga ra đời từ niềm đam mê chia sẻ những lợi ích tuyệt vời của yoga đến với cộng đồng.
                  </p>
                  <p className="leading-relaxed">
                    Chúng tôi bắt đầu từ một studio nhỏ xinh trên căn gác xép, và giờ đây đã vươn mình trở thành một đại gia đình với hơn 500 thành viên gắn bó. Hành trình đó được dệt nên bởi sự tin tưởng và những giọt mồ hôi của các học viên.
                  </p>
                  <p className="leading-relaxed bg-primary-50 px-6 py-4 rounded-2xl italic">
                    Đội ngũ giảng viên của chúng tôi không chỉ sở hữu các chứng chỉ quốc tế danh giá từ Yoga Alliance, Iyengar Yoga, mà còn mang trong mình trái tim nhiệt huyết.
                  </p>
                </div>
              </div>

              {/* Missions Grid */}
              <div className="relative">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center lg:text-left">Sứ mệnh cốt lõi</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {missions.map((mission, i) => (
                    <div 
                      key={mission.name} 
                      className={`group relative bg-white rounded-[2rem] p-8 border border-primary-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(219,110,76,0.1)] transition-all duration-500 overflow-hidden ${i % 2 !== 0 ? 'sm:mt-12' : ''}`}
                    >
                      {/* Hover effect gradient blob */}
                      <div className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-primary-200 to-accent-200 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center mb-6 text-primary-600 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm">
                          <mission.icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors">{mission.name}</h3>
                        <p className="text-gray-600 leading-relaxed">{mission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Classes Section */}
        <section className="py-24 lg:py-32 bg-secondary-50 relative overflow-hidden">
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent opacity-50"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 lg:mb-24">
              <span className="inline-block py-1.5 px-4 rounded-full bg-white border border-secondary-200 text-secondary-600 text-sm font-semibold tracking-wide mb-4 shadow-sm">
                Danh Mục Đào Tạo
              </span>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">Các lớp học đa dạng</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Từ người mới bắt đầu đến những yogi lão luyện, Yên Yoga luôn có lớp học phù hợp với cấp độ và mục tiêu của bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {classes.map((cls, idx) => {
                // Different subtle background classes for vibrant styling
                const bgClasses = [
                  'bg-gradient-to-br from-primary-100/50 to-white',
                  'bg-gradient-to-bl from-accent-100/50 to-white',
                  'bg-gradient-to-tr from-secondary-100/50 to-white',
                  'bg-gradient-to-br from-white to-primary-100/40',
                  'bg-gradient-to-bl from-white to-accent-100/40',
                ];
                
                return (
                  <div 
                    key={cls.name} 
                    className={`group relative rounded-[2.5rem] p-1 border border-white/60 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden ${idx === 3 ? 'lg:col-start-1 lg:col-span-1 ml-auto lg:ml-0 lg:translate-x-1/2' : ''} ${idx === 4 ? 'lg:col-start-2 lg:col-span-1 mr-auto lg:mr-0 lg:translate-x-1/2' : ''}`}
                  >
                    <div className={`absolute inset-0 ${bgClasses[idx % bgClasses.length]} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    <div className="relative h-full bg-white/60 backdrop-blur-xl rounded-[2.3rem] p-8 lg:p-10 flex flex-col justify-between min-h-[320px] border border-white/50">
                      <div>
                        {/* Huge Number */}
                        <div className="text-[5rem] font-serif font-bold text-gray-900/5 leading-none absolute top-4 right-6 group-hover:text-primary-500/10 transition-colors duration-500 pointer-events-none">
                          0{idx + 1}
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">{cls.name}</h3>
                        <p className="text-gray-600 leading-relaxed relative z-10 text-lg">{cls.desc}</p>
                      </div>
                      
                      <div className="mt-8 flex items-center text-primary-600 font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Tìm hiểu thêm <span className="ml-2">→</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Không gian luyện tập</h2>
              <p className="text-lg text-gray-600">Trải nghiệm không gian tĩnh lặng, hòa mình vào thiên nhiên giữa lòng phố thị.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { src: '/images/aboutUs/about-us-1.png', title: 'Studio chính', desc: 'Rộng rãi, thoáng đãng cho lớp học nhóm' },
                { src: '/images/aboutUs/about-us-2.png', title: 'Phòng tập riêng', desc: 'Riêng tư tuyệt đối cho buổi 1-kèm-1' },
                { src: '/images/aboutUs/about-us-3.png', title: 'Khu vực thiền', desc: 'Tĩnh lặng, ngập tràn ánh sáng tự nhiên' },
              ].map((item, i) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden shadow-md aspect-[4/3] bg-gray-100">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-300">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-primary-600 to-secondary-900 rounded-3xl p-10 sm:p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
              <h2 className="relative text-3xl sm:text-4xl font-bold text-white mb-6">
                Sẵn sàng bắt đầu hành trình của bạn?
              </h2>
              <p className="relative text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
                Hãy đến Yên Yoga để tự mình trải nghiệm không gian và những lớp học tuyệt vời. Đội ngũ của chúng tôi luôn chào đón bạn.
              </p>
              <div className="relative flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/packages" className="btn-shine bg-white text-primary-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all text-center">
                  Xem gói tập ngay
                </Link>
                <Link href="/contact" className="border-2 border-white/30 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-center">
                  Liên hệ tư vấn
                </Link>
              </div>
            </div>
          </div>
        </section>
        </main>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: 'Trang chủ', path: '/' },
              { name: 'Về chúng tôi', path: '/about' },
            ]),
          ),
        }}
      />
    </>
  );
}
