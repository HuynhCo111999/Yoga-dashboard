import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { generateMetadata as generateSEOMetadata, generateFAQStructuredData, generateServiceStructuredData } from "@/utils/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Khóa học yoga ở HCM (HCM) | Yên Yoga",
  description:
    "Khóa học yoga ở HCM cho người mới và đã tập: các lớp nhóm, yoga 1 kèm 1, trị liệu, phục hồi, giảm cân. Yên Yoga cung cấp chương trình với hình thức tại studio hoặc tại nhà, ưu tiên chất lượng từ đội ngũ huấn luyện viên.",
  keywords: [
    "khóa học yoga",
    "các lớp yoga",
    "học yoga ở HCM",
    "học yoga Bình Thạnh",
    "yoga cho người mới",
    "yoga trị liệu",
    "yoga phục hồi",
    "yoga giảm cân",
    "yoga 1 kèm 1",
    "giáo viên dạy yoga",
    "hình thức tại nhà",
    "chương trình đào tạo",
  ],
  canonical: "/khoa-hoc-yoga",
  ogImage: "/class-studio.jpeg",
});

const faqs = [
  {
    question: "Yoga 1 kèm 1 ở HCM phù hợp với ai?",
    answer:
      "Phù hợp với người mới cần chỉnh tư thế kỹ, người bận rộn cần lịch phù hợp, người làm việc bận rộn hay đau mỏi vai gáy/lưng, và người có mục tiêu cụ thể như tăng độ dẻo dai, cải thiện sức bền hoặc giảm stress.",
  },
  {
    question: "Tập yoga 1–1 khác gì so với lớp đông?",
    answer:
      "Với yoga 1–1, HLV theo sát từng động tác, cá nhân hóa bài tập theo thể trạng và mục tiêu riêng. Bạn được sửa sai ngay tại chỗ, tập an toàn hơn và thường tiến bộ nhanh hơn.",
  },
  {
    question: "Một buổi yoga 1 kèm 1 kéo dài bao lâu?",
    answer:
      "Thông thường 60–75 phút/buổi (tuỳ mục tiêu và thể trạng). Khi tư vấn, Yên Yoga sẽ đề xuất thời lượng phù hợp để đảm bảo hiệu quả và an toàn.",
  },
  {
    question: "Tôi cần chuẩn bị gì khi học yoga 1 kèm 1?",
    answer:
      "Chỉ cần trang phục thoải mái, khăn nhỏ và nước uống. Thảm tập và dụng cụ hỗ trợ thường có sẵn tại studio.",
  },
  {
    question: "Lịch học yoga 1 kèm 1 ở HCM có phù hợp không?",
    answer:
      "Có. Nếu bạn có yêu cầu thời gian, bạn có thể chọn buổi theo thời gian làm việc (sáng/trưa/tối) và sắp xếp lại theo chương trình của gói tập. Hãy liên hệ để được gợi ý.",
  },
];

export default function YogaCoursesPage() {
  return (
    <>
      <Header />

      <main className="min-h-[100dvh] bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-float-slow pointer-events-none z-0"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-float pointer-events-none z-0"></div>

        {/* Cinematic Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-24 pb-20 overflow-hidden z-10 w-full">
          {/* Immersive Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner.png"
              alt="Không gian Yên Yoga"
              fill
              priority
              quality={100}
              className="object-cover animate-pulse-slow"
            />
            {/* Cinematic Gradients for readability and mood */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/70 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/90 pointer-events-none" />
            
            {/* Ambient glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-600/20 rounded-full blur-[150px] mix-blend-screen"></div>
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 xl:col-span-6 animate-fadeInUp">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-bold text-white tracking-widest uppercase shadow-2xl mb-8">
                <span className="flex h-2 w-2 rounded-full bg-accent-400 animate-ping"></span>
                Khóa học Premium
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
                Chữa lành cơ thể, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-300">tìm lại chính mình</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-xl mb-10 font-light">
                Chăm sóc sức khỏe vững vàng với lộ trình Yoga 1 kèm 1 được thiết kế chuyên biệt dựa trên thể trạng và mục tiêu của riêng bạn. Không ồn ào, không vội vã.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 mb-14">
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary-500 text-white text-lg font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
                  <span className="relative z-10 flex items-center">
                    Bắt đầu hành trình
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/packages"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/20 text-white text-lg font-bold hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Tìm hiểu học phí
                </Link>
              </div>

              {/* Dynamic Stats Row */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                {[
                  { value: "1:1", label: "Huấn luyện riêng" },
                  { value: "100%", label: "Cá nhân hóa" },
                  { value: "500+", label: "Học viên hài lòng" },
                ].map((stat, idx) => (
                  <div key={idx} className={`animate-fadeInUp animate-delay-${(idx + 2) * 100}`}>
                    <p className="text-2xl sm:text-3xl font-black text-white mb-1">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Decorative Column (Floating Cards) */}
            <div className="lg:col-span-5 xl:col-span-6 hidden lg:flex relative h-full items-center justify-center animate-fadeInRight animate-delay-300">
              {/* Main Premium Card */}
              <div className="relative w-80 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 z-20">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-3xl mb-6 shadow-inner text-white">
                  🧘‍♀️
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Trị Liệu Chuyên Sâu</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Giải phóng hoàn toàn các điểm gồng cứng cơ vai gáy, trả lại sự nhẹ nhàng cho cột sống chỉ sau 1 tháng.
                </p>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-transparent overflow-hidden">
                        <Image src={`/images/aboutUs/about-us-${i === 4 ? 1 : i}.png`} alt={`Student ${i}`} width={32} height={32} className="object-cover w-full h-full"/>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-accent-300">Lớp Đang Mở</span>
                </div>
              </div>

              {/* Secondary Floating Card */}
              <div className="absolute top-10 right-0 w-64 rounded-2xl bg-gray-900/60 backdrop-blur-md border border-white/10 p-5 shadow-2xl transform -translate-x-8 -rotate-6 hover:-rotate-3 transition-transform animate-float z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-bold">Thời gian tập phù hợp</span>
                  <span className="text-primary-400">⏱️</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500 to-accent-500 h-1.5 rounded-full w-[85%]"></div>
                </div>
                <p className="text-xs text-gray-400">85% học viên là người làm việc bận rộn</p>
              </div>
            </div>
            
          </div>
        </section>

        {/* Interest Section: Pain Points (Vấn đề bạn gặp phải) */}
        <section className="py-20 relative bg-white">
          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary-50 px-4 py-1.5 text-xs font-bold text-secondary-700 uppercase tracking-widest border border-secondary-100 mb-4 shadow-sm animate-fadeInUp">
                Có phải bạn đang...
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 tracking-tight animate-fadeInUp animate-delay-100">
                Cảm thấy việc tập luyện <br className="hidden sm:block"/> <span className="text-secondary-600">chưa mang lại hiệu quả?</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 animate-fadeInUp animate-delay-200">
                Nhiều học viên tìm đến Yên Yoga khi họ nhận ra việc tự tập hoặc tập lớp quá đông không thể giải quyết triệt để vấn đề cơ thể.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Mất động lực nhanh chóng", desc: "Xem video tự tập xong vài bữa lại bỏ vì không ai đốc thúc, sửa lỗi.", icon: "📉", color: "red" },
                { title: "Đau mỏi sau tập", desc: "Tập xong lại thấy đau lưng, mỏi cổ vai gáy do sai tư thế, lệch trọng tâm.", icon: "🤕", color: "orange" },
                { title: "Không rõ tiến bộ", desc: "Mãi lặp lại một bài tập, không biết khi nào mới được lên level tiếp theo.", icon: "🤷", color: "blue" },
                { title: "Áp lực, căng thẳng", desc: "Khó thở sâu, đầu óc liên tục suy nghĩ về công việc không thể thư giãn.", icon: "🤯", color: "purple" },
                { title: "Sợ đau & tổn thương", desc: "Khớp gối hay cổ tay yếu, ngại vào các tư thế vì sợ đau và tổn thương thêm.", icon: "⚠️", color: "amber" },
                { title: "Lịch trình quá bận", desc: "Muốn đi tập trung tâm nhưng giờ lớp cố định không khớp với giờ tan làm.", icon: "⏰", color: "teal" },
              ].map((item, idx) => (
                <div key={item.title} className={`group relative rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-gray-100 transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp animate-delay-${(idx % 3 + 1) * 100}`}>
                  <div className="relative mb-5 flex items-center gap-4">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-50 text-2xl group-hover:bg-${item.color}-50 group-hover:scale-110 transition-all duration-300 shadow-sm border border-gray-100 group-hover:border-${item.color}-100`}>
                      <span>{item.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed border-l-2 border-gray-100 pl-4 group-hover:border-primary-300 transition-colors">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-14 text-center">
              <p className="text-lg font-medium text-gray-800 bg-primary-50 inline-block px-6 py-3 rounded-xl border border-primary-100">
                <span className="text-xl mr-2">💡</span>Đừng lo lắng, Yên Yoga luôn có <strong>chương trình thiết kế riêng</strong> dành cho bạn!
              </p>
            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-20 bg-gradient-to-b from-white to-primary-50/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                  Khóa học tại Yên Yoga <br/> <span className="text-primary-600">thực sự dành cho ai?</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Chúng tôi không thiết kế một chương trình cho tất cả mọi người. Yên Yoga lắng nghe cơ thể bạn và thiết kế giáo án phù hợp với từng nhu cầu, trình độ.
                </p>
                
                <div className="space-y-6">
                  {[
                    { title: "Người mới tinh (Người chơi hệ 'Cứng')", desc: "Chưa từng tập, cơ thể cứng cáp. Cần học cách thở, định tuyến cơ bản từ con số 0.", icon: "🌱" },
                    { title: "Người làm việc bận rộn", desc: "Ngồi máy tính nhiều gây đau mỏi vai gáy. Cần thời gian phù hợp và bài tập xả stress.", icon: "💻" },
                    { title: "Người cần trị liệu & phục hồi", desc: "Gặp vấn đề về võng lưng, thoát vị nhẹ. Cần HLV chuyên môn cao kèm sát từng centimet.", icon: "🧘‍♀️" },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-5 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-primary-200 transition-colors">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-xl shadow-inner">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                  <Image 
                    src="/images/class-studio.jpeg" 
                    alt="Chương trình Yoga thư giãn tại Yên Yoga"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/80 to-transparent p-8 pt-20 text-white">
                    <p className="text-xl font-bold mb-2">Không gian thân thiện</p>
                    <p className="text-sm text-gray-200 opacity-90">Bất kể bạn ở độ tuổi nào, Yên Yoga luôn chào đón.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Desire Section: Premium Experience (Đặc quyền 1 kèm 1) */}
        <section className="py-20 relative bg-white overflow-hidden">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-primary-50/50 skew-x-12 translate-x-1/2"></div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-400 rounded-[2.5rem] blur-xl opacity-20 transform -rotate-3"></div>
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl border-8 border-white bg-gray-50">
                    <Image
                      src="/images/personal-yoga.png"
                      alt="Giáo viên hướng dẫn chi tiết tư thế Yoga"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent p-6 text-white pt-24">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex h-3 w-3 rounded-full bg-green-400 animate-pulse"></span>
                        <p className="text-sm font-medium">Private 1 kèm 1</p>
                      </div>
                      <p className="font-bold text-lg">Chỉnh sửa từng milimet tư thế</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-bold text-primary-700 uppercase tracking-widest border border-primary-100 mb-4 shadow-sm animate-fadeInUp">
                  Đặc quyền tại Yên Yoga
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight animate-fadeInUp animate-delay-100">
                  Phục hồi từ sâu bên trong <br className="hidden sm:block"/> <span className="gradient-text">với Yoga 1 Kèm 1</span>
                </h2>
                <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl animate-fadeInUp animate-delay-200">
                  Không chạy theo số lượng, không ép buộc cơ thể. Lớp 1 kèm 1 (Private) tại Yên Yoga là khoảng thời gian chúng tôi lùi lại, quan sát từng nhịp thở và biên độ khớp của bạn để đưa ra bài tập chuẩn xác nhất.
                </p>

                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
                  {[
                    { title: "Bắt đúng bệnh, kê đúng bài", desc: "Test thể trạng kỹ lưỡng trong buổi đầu. Tập trung phục hồi vùng cơ đang tổn thương.", icon: "🩺" },
                    { title: "Nắn chỉnh (Adjustment) chi tiết", desc: "HLV hỗ trợ dùng tay nắn chỉnh tư thế an toàn, giúp bạn vào thế sâu hơn mà không bị đau.", icon: "👐" },
                    { title: "Lịch học phù hợp theo bạn", desc: "Không sợ mất buổi tập vì bận việc đột xuất. Hỗ trợ dời lịch học theo tuần theo sắp xếp.", icon: "📅" },
                    { title: "Theo sát cả chế độ dinh dưỡng", desc: "Kết hợp tư vấn ăn uống, sinh hoạt để đẩy nhanh quá trình phục hồi, giảm mỡ thừa.", icon: "🥗" },
                  ].map((item, idx) => (
                    <div key={item.title} className={`animate-fadeInUp animate-delay-${(idx + 3) * 100}`}>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-xl shadow-sm border border-white">
                          {item.icon}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed pl-14">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transformation Journey (Lộ trình chuyển đổi) */}
        <section className="py-20 relative bg-gradient-to-b from-primary-50/50 to-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                Hành trình chuyển đổi <span className="text-primary-600">rõ ràng</span>
              </h2>
              <p className="text-lg text-gray-600">
                Sự thay đổi không đến trong ngày một ngày hai. Tại Yên Yoga, chúng tôi cam kết lộ trình rõ ràng để bạn cảm nhận cơ thể mình tốt lên từng ngày.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  time: "Tháng 1", 
                  title: "Làm quen & Giải mỏi", 
                  desc: "Chỉnh sửa tật gù lưng, rụt cổ. Học cách thở đúng, giải phóng các vùng cơ căng cứng như vai, cổ, thắt lưng. Sau khi tập đều đặn, bạn sẽ thấy ngủ ngon hơn rõ rệt.",
                  color: "bg-blue-50 text-blue-700 border-blue-200",
                  img: "1"
                },
                { 
                  time: "Tháng thứ 3", 
                  title: "Gia tăng độ dẻo",
                  desc: "Các khớp cơ mở dần ra. Bạn có thể thực hiện các tư thế khó hơn mà không thấy đau rát. Cơ thể nhẹ nhàng, vòng eo bắt đầu thon gọn.",
                  color: "bg-primary-50 text-primary-700 border-primary-200",
                  img: "2"
                },
                { 
                  time: "Tháng thứ 6", 
                  title: "Săn chắc & Làm chủ", 
                  desc: "Cốt lõi (core) vững vàng. Cột sống dẻo dai. Vóc dáng thay đổi rõ rệt. Quan trọng nhất, bạn học được cách tự kiểm soát hơi thở và cảm xúc.",
                  color: "bg-accent-50 text-accent-700 border-accent-200",
                  img: "3"
                },
              ].map((step, idx) => (
                <div key={idx} className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="absolute -top-4 -right-4 text-8xl font-black text-gray-50 opacity-50 z-0">0{step.img}</div>
                  <div className="relative z-10">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4 border ${step.color}`}>
                      {step.time}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-14 flex justify-center">
              <Link
                href="/packages"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-gray-900 to-gray-800 text-white text-base font-bold hover:shadow-xl hover:shadow-gray-900/20 transform hover:-translate-y-1 transition-all duration-300"
              >
                Khám phá lộ trình của bạn
                <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Action Section 1: Process (Quy trình học) */}
        <section className="py-20 bg-white border-y border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary-50 px-4 py-1.5 text-xs font-bold text-secondary-700 uppercase tracking-widest border border-secondary-100 mb-4 shadow-sm">
                Đơn giản & Dễ dàng
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                4 Bước bắt đầu cùng Yên Yoga
              </h2>
              <p className="text-lg text-gray-600">
                Chúng tôi thiết kế quy trình đơn giản nhất để bạn có thể bắt đầu hành trình chăm sóc sức khỏe ngay hôm nay.
              </p>
            </div>

            <div className="relative">
              {/* Desktop connecting line */}
              <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-primary-100 via-accent-200 to-primary-100 z-0"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
                {[
                  { step: "01", title: "Nhận Tư Vấn", desc: "Trao đổi mục tiêu, thời gian rảnh, tình trạng sức khỏe để chọn thời gian.", icon: "💬" },
                  { step: "02", title: "Test Thể Trạng", desc: "Đo độ dẻo, điểm gồng cứng cơ và thói quen vận động.", icon: "⚖️" },
                  { step: "03", title: "Lên Lộ Trình", desc: "Phân tích và thiết kế bài tập riêng: phục hồi, giảm cân hay nâng cao theo mục tiêu.", icon: "📝" },
                  { step: "04", title: "Bắt Đầu Tập", desc: "HLV theo sát từng nhịp thở, hướng dẫn tối ưu bài tập theo buổi.", icon: "✨" },
                ].map((item, idx) => (
                  <div key={item.step} className="relative group text-center animate-fadeInUp animate-delay-200">
                    <div className="mx-auto w-24 h-24 rounded-full bg-white border-4 border-gray-50 flex flex-col items-center justify-center shadow-xl group-hover:border-primary-200 group-hover:scale-110 transition-all duration-300 mb-6">
                      <span className="text-2xl mb-1">{item.icon}</span>
                      <span className="text-xs font-black text-gray-400 group-hover:text-primary-600">BƯỚC {item.step}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed px-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Information & Requirements (Action - giúp chuyển đổi) */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-semibold text-primary-700 border border-primary-100">
                  Thông tin trước khi tham gia
                </span>
                <h2 className="mt-4 text-3xl font-bold text-gray-900">
                  Nếu bạn đang tìm lựa chọn chất lượng cho các lớp yoga
                </h2>
                <p className="mt-4 text-gray-600 text-base leading-relaxed">
                  Sau khi bạn gửi <strong>yêu cầu</strong>, Yên Yoga sẽ <strong>cung cấp</strong> thông tin rõ ràng
                  và <strong>hướng dẫn</strong> bạn chọn <strong>hình thức</strong> phù hợp: tại trung tâm, tại nhà
                  hoặc online. Chúng tôi ưu tiên <strong>kết nối</strong> trực tiếp với <strong>đội ngũ</strong>,
                  để bạn tham gia đúng chương trình, đúng mục tiêu.
                </p>

                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Hỗ trợ nhanh
                    </p>
                    <p className="mt-2 text-sm text-gray-800">
                      điện thoại: <strong>0393636143</strong>
                    </p>
                    <p className="mt-1 text-sm text-gray-800">
                      địa chỉ: <strong>Bình Thạnh, Thành phố Hồ Chí Minh</strong>
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Giới thiệu & đào tạo
                    </p>
                    <p className="mt-2 text-sm text-gray-800">
                      Đào tạo dựa trên kinh nghiệm và bằng cấp của huấn luyện viên, với các giáo án rõ ràng.
                    </p>
                    <p className="mt-1 text-sm text-gray-800">
                      Giáo viên dạy yoga theo sát bạn để tối ưu lợi ích.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 p-5 shadow-sm">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Bạn cũng có thể xem thêm ở <Link href="/">trang chủ</Link> hoặc liên hệ để được giới thiệu đúng chương trình,
                    đúng lựa chọn cho mục tiêu (giảm đau lưng, giảm stress, tăng độ dẻo dai) — theo đúng yêu cầu của riêng bạn.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900">Đội ngũ & chất lượng</h3>
                  <ul className="mt-4 space-y-3 text-sm text-gray-600">
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                        ✓
                      </span>
                      Huấn luyện viên và giáo viên dạy yoga có bằng cấp, kinh nghiệm thực tế.
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                        ✓
                      </span>
                      Huấn luyện theo mục tiêu cá nhân, tập trung vào lợi ích lâu dài.
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                        ✓
                      </span>
                      Thông tin minh bạch, chương trình rõ ràng về lịch và yêu cầu tham gia.
                    </li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900">Bạn sẽ nhận được gì sau khi tham gia?</h3>
                  <ul className="mt-4 space-y-3 text-sm text-gray-600">
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-50 text-accent-700">
                        →
                      </span>
                      Lộ trình theo thể trạng, kết nối chặt chẽ giữa người dạy và người học.
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-50 text-accent-700">
                        →
                      </span>
                      Hướng dẫn kỹ thuật để bạn tự tập và duy trì ở tại nhà.
                    </li>
                    <li className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-50 text-accent-700">
                        →
                      </span>
                      Danh sách thông tin cần chuẩn bị trước mỗi buổi theo chương trình đào tạo.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Section 2: FAQ */}
        <section className="py-20 bg-gray-50/50">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Câu hỏi thường gặp
              </h2>
              <p className="text-lg text-gray-600">
                Những thắc mắc phổ biến trước khi đăng ký khóa học Yoga 1 kèm 1.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((item) => (
                <details key={item.question} className="group rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="cursor-pointer flex items-center justify-between gap-4 select-none">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors pr-8 relative">
                      {item.question}
                    </h3>
                    <span className="shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-primary-600 group-open:rotate-180 transition-transform duration-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed pt-4 border-t border-gray-50 animate-fadeInUp">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final Action: Bottom CTA */}
        <section className="py-20 relative">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-[3rem] bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 p-10 sm:p-16 text-center shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
              {/* Fancy Background shapes */}
              <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary-600/30 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-80 h-80 bg-accent-600/20 rounded-full blur-[60px]"></div>
              
              <div className="relative z-10">
                <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold tracking-widest uppercase mb-6 shadow-sm animate-pulse">
                  Chỉ còn vài slot trống trong tháng
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Sẵn sàng thay đổi <br/> <span className="text-accent-400">cùng Yên Yoga?</span>
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Đừng để những cơn đau mỏi làm phiền cuộc sống của bạn thêm nữa. Hãy bắt đầu chăm sóc bản thân đúng cách ngay hôm nay.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/contact"
                    className="group flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-primary-900 text-lg font-bold hover:bg-gray-50 transition-colors w-full sm:w-auto shadow-xl"
                  >
                    Nhận tư vấn miễn phí
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/packages"
                    className="flex items-center justify-center px-8 py-4 rounded-2xl border-2 border-white/20 bg-white/5 text-white backdrop-blur-sm text-lg font-bold hover:bg-white/10 hover:border-white/30 transition-colors w-full sm:w-auto"
                  >
                    Xem Chi Phí Đầu Tư
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Structured data */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(
                    generateServiceStructuredData({
                      name: "Yoga 1 kèm 1 ở HCM",
                      description:
                        "Dịch vụ yoga 1 kèm 1 ở HCM cùng huấn luyện viên kèm riêng theo thể trạng, chương trình cá nhân hóa, hướng dẫn tư thế kỹ, phù hợp người mới, người làm việc bận rộn và phục hồi.",
                    }),
                  ),
                }}
              />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQStructuredData(faqs)),
        }}
      />
    </>
  );
}

