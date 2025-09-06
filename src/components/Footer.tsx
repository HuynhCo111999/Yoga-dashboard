import Link from 'next/link';
import Image from 'next/image';

const navigation = {
  main: [
    { name: 'Về chúng tôi', href: '/about' },
    { name: 'Lịch học', href: '/calendar' },
    { name: 'Blog', href: '/blog' },
    { name: 'Liên hệ', href: '/contact' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.017 0C8.396 0 7.929.01 6.71.058 5.487.107 4.66.252 3.933.47a5.9 5.9 0 0 0-2.134 1.389 5.9 5.9 0 0 0-1.389 2.134C.252 4.66.107 5.487.058 6.71.01 7.929 0 8.396 0 12.017c0 3.624.01 4.09.058 5.31.048 1.223.194 2.049.412 2.775a5.9 5.9 0 0 0 1.389 2.134 5.9 5.9 0 0 0 2.134 1.389c.726.218 1.552.364 2.775.412 1.219.048 1.686.058 5.31.058 3.624 0 4.09-.01 5.31-.058 1.223-.048 2.049-.194 2.775-.412a5.9 5.9 0 0 0 2.134-1.389 5.9 5.9 0 0 0 1.389-2.134c.218-.726.364-1.552.412-2.775.048-1.219.058-1.686.058-5.31 0-3.624-.01-4.09-.058-5.31-.048-1.223-.194-2.049-.412-2.775a5.9 5.9 0 0 0-1.389-2.134A5.9 5.9 0 0 0 20.725.47c-.726-.218-1.552-.364-2.775-.412C16.731.01 16.264 0 12.017 0zm0 2.162c3.556 0 3.977.01 5.382.057 1.3.059 2.006.274 2.476.456.622.242 1.066.532 1.533.999s.757.911.999 1.533c.182.47.397 1.176.456 2.476.047 1.405.057 1.826.057 5.382 0 3.556-.01 3.977-.057 5.382-.059 1.3-.274 2.006-.456 2.476-.242.622-.532 1.066-.999 1.533s-.911.757-1.533.999c-.47.182-1.176.397-2.476.456-1.405.047-1.826.057-5.382.057-3.556 0-3.977-.01-5.382-.057-1.3-.059-2.006-.274-2.476-.456-.622-.242-1.066-.532-1.533-.999s-.757-.911-.999-1.533c-.182-.47-.397-1.176-.456-2.476-.047-1.405-.057-1.826-.057-5.382 0-3.556.01-3.977.057-5.382.059-1.3.274-2.006.456-2.476.242-.622.532-1.066.999-1.533s.911-.757 1.533-.999c.47-.182 1.176-.397 2.476-.456 1.405-.047 1.826-.057 5.382-.057z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-secondary-900">
      <div className="mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Logo and Company Info */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <Image src="/logo.jpeg" alt="Yên Yoga" width={60} height={60} className="rounded-full" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white">Yên Yoga Studio</span>
          </div>
          <p className="text-sm sm:text-base text-secondary-300 max-w-md mx-auto px-4 sm:px-0">
            Không gian yoga thanh tịnh, nơi bạn tìm thấy sự cân bằng giữa cơ thể và tâm hồn.
          </p>
        </div>

        <nav className="-mb-4 sm:-mb-6 grid grid-cols-2 gap-4 sm:flex sm:justify-center sm:space-x-8 lg:space-x-12" aria-label="Footer">
          {navigation.main.map((item) => (
            <div key={item.name} className="pb-4 sm:pb-6">
              <Link href={item.href} className="text-sm leading-6 text-secondary-300 hover:text-primary-400 transition-colors">
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        
        <div className="mt-6 sm:mt-10 flex justify-center space-x-6 sm:space-x-10">
          {navigation.social.map((item) => (
            <a key={item.name} href={item.href} className="text-secondary-400 hover:text-primary-400 transition-colors">
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        
        <div className="mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-secondary-700">
          <p className="text-center text-xs sm:text-sm leading-5 text-secondary-400 px-4 sm:px-0">
            &copy; 2024 Yên Yoga Studio. Bản quyền thuộc về chúng tôi.
          </p>
        </div>
      </div>
    </footer>
  );
}
