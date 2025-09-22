import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Không tìm thấy bài viết</h2>
        <p className="mt-2 text-gray-600">
          Bài viết này không tồn tại hoặc đã bị xóa.
        </p>
        <div className="mt-6 space-y-4">
          <Link
            href="/blog"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            ← Quay lại blog
          </Link>
          <div>
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
