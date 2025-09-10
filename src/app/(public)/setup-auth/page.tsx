import { Suspense } from 'react';
import SetupAuthContent from './SetupAuthContent';

export default function SetupAuthPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4'>
          <div className='max-w-md mx-auto bg-white shadow-lg rounded-lg p-6'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4'></div>
              <p className='text-gray-600'>Đang tải...</p>
            </div>
          </div>
        </div>
      }
    >
      <SetupAuthContent />
    </Suspense>
  );
}
