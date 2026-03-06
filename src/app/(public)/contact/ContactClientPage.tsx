'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import { logger } from '@/lib/logger';

export default function ContactClientPage() {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // Log page view
  useEffect(() => {
    logger.info('Page viewed: Contact', { page: 'contact', path: pathname });
    logger.event('Page View', { page: 'Contact', path: pathname });
    console.log('[PAGE] User navigated to Contact page');
  }, [pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Log form submission attempt
      logger.info('Contact form submitted', {
        name: formData.name,
        email: formData.email,
        hasPhone: !!formData.phone,
        messageLength: formData.message.length,
      });

      // Track as Sentry event
      logger.event('Contact Form Submitted', {
        email: formData.email,
        hasPhone: !!formData.phone,
        messageLength: formData.message.length,
      });

      // Handle form submission here
      console.log('[FORM] Contact form submitted:', {
        name: formData.name,
        email: formData.email,
      });

      alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
      
      // Log successful submission
      logger.info('Contact form submission successful', { email: formData.email });
      
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      // Log error
      logger.error('Contact form submission failed', error, {
        email: formData.email,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className='min-h-[100dvh] bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-float-slow pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-float pointer-events-none"></div>

      <Header />
      <div className="py-16 sm:py-20 lg:py-24 relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <div className="text-center mb-10 sm:mb-14">
              <span className="inline-block py-1.5 px-4 rounded-full bg-white/80 backdrop-blur-md border border-secondary-200 text-secondary-600 text-sm font-semibold tracking-wide mb-6 shadow-sm animate-fadeInUp">
                Hỗ Trợ & Tư Vấn
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight animate-fadeInUp animate-delay-100">
                Liên hệ với <span className="gradient-text">Yên Yoga</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0 animate-fadeInUp animate-delay-200">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với chúng tôi để được tư vấn về các lớp học hoặc bất kỳ câu hỏi nào khác.
              </p>
            </div>
            
            {/* Map Wireframe / Image */}
            <div className="relative aspect-[2/1] sm:aspect-[2.5/1] lg:aspect-[3/1] rounded-[2rem] shadow-2xl overflow-hidden mb-8 sm:mb-12 group animate-fadeInUp animate-delay-300">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-500 opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 backdrop-blur-sm">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold tracking-wide drop-shadow-md">Yên Yoga Studio</p>
                <p className="text-primary-100 mt-2 font-medium">Bản đồ tương tác sẽ hiển thị tại đây</p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 lg:grid-cols-3">
              <div className="animate-fadeInUp animate-delay-400">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Thông tin liên hệ</h2>
                <p className="mt-6 text-lg leading-relaxed text-gray-600">
                  Đến thăm trực tiếp studio của chúng tôi hoặc liên hệ qua các kênh trực tuyến để được hỗ trợ nhanh nhất. Đội ngũ Yên Yoga luôn sẵn sàng đồng hành cùng bạn trên chặng đường chăm sóc sức khỏe.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2">
                <div className="rounded-[2rem] bg-white/70 backdrop-blur-xl p-10 shadow-xl border border-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fadeInUp animate-delay-400">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-6 text-primary-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Studio chính</h3>
                  <dl className="space-y-4 text-gray-600">
                    <div className="flex gap-4">
                      <dt className="sr-only">Địa chỉ</dt>
                      <dd>
                        <p className="font-medium text-gray-900">Bình Thạnh</p>
                        <p>Thành phố Hồ Chí Minh</p>
                      </dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="sr-only">Số điện thoại</dt>
                      <dd className="flex items-center">
                        <svg className="h-5 w-5 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="ml-3 font-medium hover:text-primary-600 cursor-pointer transition-colors">+84 393636143</span>
                      </dd>
                    </div>
                    <div className="flex gap-4">
                      <dt className="sr-only">Email</dt>
                      <dd className="flex items-center">
                        <svg className="h-5 w-5 flex-shrink-0 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="ml-3 font-medium hover:text-primary-600 cursor-pointer transition-colors">yenyoga@gmail.com</span>
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div className="rounded-[2rem] bg-gradient-to-br from-primary-600 to-accent-600 p-10 shadow-xl border border-white/20 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 saturate-150 animate-fadeInUp animate-delay-500">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6 text-white">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4 drop-shadow-sm">Giờ hoạt động</h3>
                  <dl className="space-y-4 text-orange-50">
                    <div className="flex justify-between items-center border-b border-white/20 pb-2">
                      <dt className="font-medium">Thứ 2 - Thứ 6</dt>
                      <dd className="font-bold bg-white/20 px-3 py-1 rounded-lg">6:00 - 22:00</dd>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/20 pb-2">
                      <dt className="font-medium">Thứ 7</dt>
                      <dd className="font-bold bg-white/20 px-3 py-1 rounded-lg">7:00 - 20:00</dd>
                    </div>
                    <div className="flex justify-between items-center">
                      <dt className="font-medium">Chủ nhật</dt>
                      <dd className="font-bold bg-white/20 px-3 py-1 rounded-lg">8:00 - 18:00</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
            {/* Send Message Card Section */}
            <div className="mt-16 sm:mt-20 bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white p-8 sm:p-12 lg:p-16 relative overflow-hidden animate-fadeInUp animate-delay-600">
              {/* Card Decorative Backgrounds */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-100/50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
              
              <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-3 relative z-10">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Gửi tin nhắn</h2>
                  <p className="mt-6 text-lg leading-relaxed text-gray-600">
                    Điền thông tin vào biểu mẫu bên cạnh và chúng tôi sẽ liên hệ lại với bạn trong vòng 24 giờ.
                  </p>
                  
                  <div className="mt-8 hidden lg:block">
                    <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 backdrop-blur-sm">
                      <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                         <span className="text-xl">✨</span> Lợi ích khi nhắn tin:
                      </h4>
                      <ul className="space-y-3 mt-4 text-amber-700/80 font-medium">
                        <li className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Nhận lịch phân tích thể trạng hoàn toàn miễn phí
                        </li>
                        <li className="flex items-start gap-2">
                           <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Khám phá gói tập phù hợp riêng cho bạn
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-2">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-bold leading-6 text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                      Họ và tên <span className="text-primary-500">*</span>
                    </label>
                    <div className="mt-2 text-primary-500">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Nguyễn Văn A"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full rounded-xl border-0 bg-white/80 px-4 py-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6 transition-all duration-300 hover:ring-primary-300"
                      />
                    </div>
                  </div>
                  
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-bold leading-6 text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                      Email <span className="text-primary-500">*</span>
                    </label>
                    <div className="mt-2 text-primary-500">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="example@mail.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full rounded-xl border-0 bg-white/80 px-4 py-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6 transition-all duration-300 hover:ring-primary-300"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2 group">
                    <label htmlFor="phone" className="block text-sm font-bold leading-6 text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                      Số điện thoại
                    </label>
                    <div className="mt-2 text-primary-500">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        placeholder="0912 345 678"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full rounded-xl border-0 bg-white/80 px-4 py-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6 transition-all duration-300 hover:ring-primary-300"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2 group">
                    <label htmlFor="message" className="block text-sm font-bold leading-6 text-gray-700 mb-2 group-focus-within:text-primary-600 transition-colors">
                      Tin nhắn <span className="text-primary-500">*</span>
                    </label>
                    <div className="mt-2 text-primary-500">
                      <textarea
                        name="message"
                        id="message"
                        rows={4}
                        placeholder="Bạn có câu hỏi hoặc cần tư vấn gì thêm?"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="block w-full rounded-xl border-0 bg-white/80 px-4 py-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 sm:text-sm sm:leading-6 transition-all duration-300 hover:ring-primary-300 resize-y"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 relative z-10">
                  <button
                    type="submit"
                    className="btn-shine block w-full rounded-xl bg-gradient-to-r from-primary-600 to-accent-500 px-3.5 py-4 text-center text-lg font-bold text-white shadow-lg hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-all duration-300 hover:-translate-y-1"
                  >
                    🚀 Gửi ngay
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
