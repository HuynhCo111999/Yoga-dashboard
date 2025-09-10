import Link from 'next/link';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4'>
      <div className='max-w-lg w-full text-center'>
        {/* Yoga meditation illustration */}
        <div className='mb-8'>
          <div className='relative mx-auto w-64 h-64 flex items-center justify-center'>
            {/* Lotus pose illustration using CSS */}
            <div className='absolute inset-0 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-20 animate-pulse'></div>
            <div className='relative z-10 text-primary-500'>
              <svg width='120' height='120' viewBox='0 0 120 120' fill='none' xmlns='http://www.w3.org/2000/svg' className='mx-auto'>
                {/* Lotus pose figure */}
                <circle cx='60' cy='35' r='12' fill='currentColor' opacity='0.8' />
                <path d='M60 47 C50 47, 45 55, 45 65 L45 75 C45 80, 48 83, 53 83 L67 83 C72 83, 75 80, 75 75 L75 65 C75 55, 70 47, 60 47' fill='currentColor' opacity='0.8' />
                <path d='M38 65 C30 65, 25 70, 25 78 C25 82, 28 85, 32 85 L45 75' stroke='currentColor' strokeWidth='3' fill='none' opacity='0.6' />
                <path d='M82 65 C90 65, 95 70, 95 78 C95 82, 92 85, 88 85 L75 75' stroke='currentColor' strokeWidth='3' fill='none' opacity='0.6' />
                <circle cx='45' cy='90' r='8' fill='currentColor' opacity='0.6' />
                <circle cx='75' cy='90' r='8' fill='currentColor' opacity='0.6' />
              </svg>
            </div>

            {/* Floating meditation elements */}
            <div className='absolute top-4 left-4 w-3 h-3 bg-primary-300 rounded-full opacity-60 animate-bounce' style={{ animationDelay: '0s' }}></div>
            <div className='absolute top-8 right-8 w-2 h-2 bg-primary-400 rounded-full opacity-60 animate-bounce' style={{ animationDelay: '1s' }}></div>
            <div className='absolute bottom-12 left-8 w-2.5 h-2.5 bg-primary-200 rounded-full opacity-60 animate-bounce' style={{ animationDelay: '2s' }}></div>
            <div className='absolute bottom-8 right-4 w-2 h-2 bg-primary-300 rounded-full opacity-60 animate-bounce' style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* Error message */}
        <div className='mb-8'>
          <h1 className='text-6xl font-bold text-primary-600 mb-4'>404</h1>
          <h2 className='text-2xl font-semibold text-gray-800 mb-3'>Trang không tồn tại</h2>
          <p className='text-gray-600 leading-relaxed'>
            Có vẻ như bạn đã đi lạc trong hành trình yoga của mình.
            <br />
            Hãy thở sâu và quay về trang chính để tiếp tục khám phá.
          </p>
        </div>

        {/* Meditation quote */}
        <div className='mb-8 p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-primary-100'>
          <blockquote className='text-gray-700 italic text-sm'>&ldquo;Trong yoga, ta không chỉ học cách chấp nhận hiện tại, mà còn học cách tìm thấy con đường đúng đắn.&rdquo;</blockquote>
        </div>

        {/* Action buttons */}
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link href='/' className='inline-flex items-center justify-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl'>
            <HomeIcon className='w-5 h-5 mr-2' />
            Về trang chủ
          </Link>

          <button onClick={() => window.history.back()} className='inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg border border-gray-200 transition-colors duration-200 shadow-md hover:shadow-lg'>
            <ArrowLeftIcon className='w-5 h-5 mr-2' />
            Quay lại
          </button>
        </div>

        {/* Helpful links */}
        <div className='mt-8 pt-6 border-t border-gray-200'>
          <p className='text-sm text-gray-500 mb-3'>Hoặc khám phá:</p>
          <div className='flex flex-wrap justify-center gap-4 text-sm'>
            <Link href='/calendar' className='text-primary-600 hover:text-primary-700 hover:underline transition-colors'>
              Lịch học
            </Link>
            <Link href='/packages' className='text-primary-600 hover:text-primary-700 hover:underline transition-colors'>
              Gói tập
            </Link>
            <Link href='/about' className='text-primary-600 hover:text-primary-700 hover:underline transition-colors'>
              Về chúng tôi
            </Link>
            <Link href='/contact' className='text-primary-600 hover:text-primary-700 hover:underline transition-colors'>
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
