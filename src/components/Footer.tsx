import Link from 'next/link';
import Image from 'next/image';

const quickLinks = [
  { name: 'Về chúng tôi', href: '/about' },
  { name: 'Lịch học', href: '/calendar' },
  { name: 'Gói tập', href: '/packages' },
  { name: 'Blog', href: '/blog' },
  { name: 'Liên hệ', href: '/contact' },
];

const services = [
  { name: 'Yoga cơ bản', href: '/packages' },
  { name: 'Yoga nâng cao', href: '/packages' },
  { name: 'Yoga thiền định', href: '/packages' },
  { name: 'Yoga trị liệu', href: '/packages' },
  { name: 'Lớp học cho người mới', href: '/packages' },
];

export default function Footer() {
  return (
    <footer className="bg-secondary-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer – Yên Yoga Studio
      </h2>

      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 group mb-5">
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-primary-500/30 flex-shrink-0">
                <Image src="/logo.jpeg" alt="Logo Yên Yoga Studio" width={44} height={44} className="rounded-full object-cover" />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                Yên Yoga Studio
              </span>
            </Link>
            <p className="text-sm text-secondary-300 leading-relaxed mb-6">
              Không gian yoga thanh tịnh tại TP.HCM — nơi bạn tìm thấy sự cân bằng giữa cơ thể và tâm hồn qua từng buổi tập.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Yên Yoga Studio"
                className="w-9 h-9 rounded-xl bg-secondary-700 hover:bg-primary-600 flex items-center justify-center text-secondary-300 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Yên Yoga Studio"
                className="w-9 h-9 rounded-xl bg-secondary-700 hover:bg-primary-600 flex items-center justify-center text-secondary-300 hover:text-white transition-all duration-300 hover:scale-110"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Điều hướng
            </h3>
            <ul className="space-y-3" role="list">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-secondary-300 hover:text-primary-400 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Dịch vụ
            </h3>
            <ul className="space-y-3" role="list">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-secondary-300 hover:text-primary-400 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Liên hệ
            </h3>
            <address className="not-italic space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <p className="text-sm text-secondary-300 leading-relaxed">
                  123 Đường Yoga, Quận 1<br />
                  TP. Hồ Chí Minh, Việt Nam
                </p>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-primary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <a href="tel:+84901234567" className="text-sm text-secondary-300 hover:text-primary-400 transition-colors">
                  0901 234 567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-primary-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <a href="mailto:yenyoga@gmail.com" className="text-sm text-secondary-300 hover:text-primary-400 transition-colors">
                  yenyoga@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-secondary-300">
                  Thứ 2 – Thứ 7: 6:00 – 21:00<br />
                  Chủ nhật: 7:00 – 18:00
                </p>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-secondary-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-secondary-400">
            &copy; {new Date().getFullYear()} Yên Yoga Studio. Bản quyền thuộc về chúng tôi.
          </p>
          <div className="flex items-center gap-5 text-sm text-secondary-400">
            <Link href="/about" className="hover:text-primary-400 transition-colors">Chính sách</Link>
            <Link href="/contact" className="hover:text-primary-400 transition-colors">Điều khoản</Link>
            <Link href="/blog" className="hover:text-primary-400 transition-colors">Blog</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
