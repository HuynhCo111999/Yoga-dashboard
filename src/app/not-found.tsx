'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-gray-50 to-white flex items-center">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
          {/* Text block */}
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              Không tìm thấy trang
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-snug mb-3">
              Oops, bạn đã bước nhầm phòng tập rồi.
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Trang bạn đang cố truy cập không tồn tại, đã được đổi tên hoặc đã bị xóa. 
              Hãy quay lại không gian chính của Yên Yoga hoặc ghé thăm góc blog để tiếp tục hành trình.
            </p>
            {pathname && (
              <p className="mt-3 text-xs text-gray-400">
                Đường dẫn không hợp lệ:{' '}
                <span className="font-mono break-all">{pathname}</span>
              </p>
            )}

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Về trang chủ
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Xem blog Yên Yoga
              </Link>
            </div>
          </div>

          {/* Illustration block */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-primary-100 opacity-70 blur-2xl" />
              <div className="absolute -bottom-4 -right-8 h-28 w-28 rounded-full bg-accent-100 opacity-60 blur-2xl" />

              <div className="relative rounded-3xl border border-gray-100 bg-white shadow-sm px-6 py-7 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 text-sm font-semibold">
                    404
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Hơi thở lạc nhịp
                    </p>
                    <p className="text-xs text-gray-500">
                      Hãy quay lại nhịp chậm rãi ban đầu.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-left space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Gợi ý
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                    <li>Kiểm tra lại đường dẫn bạn đã nhập.</li>
                    <li>Dùng menu điều hướng để tìm nội dung bạn cần.</li>
                    <li>Khám phá các bài viết mới trong phần Blog.</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <span>Yên Yoga</span>
                  <span>Luôn ở đây khi bạn cần.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

