'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthSetup from '@/components/AuthSetup';

export default function SetupAuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [completed, setCompleted] = useState(false);

  if (!email) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4'>
        <div className='max-w-md mx-auto bg-white shadow-lg rounded-lg p-6'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>Lỗi</h1>
            <p className='text-gray-600 mb-6'>Không tìm thấy thông tin email. Vui lòng liên hệ admin để được hỗ trợ.</p>
            <button onClick={() => router.push('/login')} className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700'>
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4'>
        <div className='max-w-md mx-auto bg-white shadow-lg rounded-lg p-6'>
          <div className='text-center'>
            <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4'>
              <svg className='h-6 w-6 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>Thành công!</h1>
            <p className='text-gray-600 mb-6'>Tài khoản của bạn đã được thiết lập thành công. Bạn có thể đăng nhập ngay bây giờ.</p>
            <button onClick={() => router.push('/login')} className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700'>
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4'>
      <AuthSetup userEmail={email} onSuccess={() => setCompleted(true)} onCancel={() => router.push('/login')} />
    </div>
  );
}
