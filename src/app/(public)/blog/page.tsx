import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: '5 Tư thế Yoga cơ bản cho người mới bắt đầu',
    excerpt: 'Khám phá những tư thế yoga đơn giản và hiệu quả để bắt đầu hành trình yoga của bạn.',
    author: 'Nguyễn Thị Hương',
    publishedAt: '2024-01-15',
    tags: ['Người mới bắt đầu', 'Tư thế cơ bản'],
    readTime: '5 phút đọc'
  },
  {
    id: 2,
    title: 'Lợi ích của việc thực hành Yoga hàng ngày',
    excerpt: 'Tìm hiểu về những tác động tích cực của yoga đối với sức khỏe thể chất và tinh thần.',
    author: 'Trần Văn Nam',
    publishedAt: '2024-01-10',
    tags: ['Sức khỏe', 'Lợi ích'],
    readTime: '7 phút đọc'
  },
  {
    id: 3,
    title: 'Meditation và Yoga: Sự kết hợp hoàn hảo',
    excerpt: 'Khám phá cách kết hợp thiền định với thực hành yoga để đạt được sự cân bằng tối ưu.',
    author: 'Lê Thị Mai',
    publishedAt: '2024-01-05',
    tags: ['Thiền', 'Cân bằng'],
    readTime: '6 phút đọc'
  },
  {
    id: 4,
    title: 'Yoga cho dân văn phòng: Giảm đau lưng và căng thẳng',
    excerpt: 'Những bài tập yoga đơn giản có thể thực hiện ngay tại văn phòng để cải thiện sức khỏe.',
    author: 'Phạm Minh Đức',
    publishedAt: '2024-01-02',
    tags: ['Văn phòng', 'Đau lưng'],
    readTime: '8 phút đọc'
  },
  {
    id: 5,
    title: 'Hướng dẫn thở đúng cách trong Yoga',
    excerpt: 'Kỹ thuật thở (Pranayama) là nền tảng của yoga. Học cách thở đúng để nâng cao hiệu quả thực hành.',
    author: 'Nguyễn Thị Hương',
    publishedAt: '2023-12-28',
    tags: ['Pranayama', 'Hơi thở'],
    readTime: '4 phút đọc'
  },
  {
    id: 6,
    title: 'Yoga và dinh dưỡng: Chế độ ăn hỗ trợ thực hành',
    excerpt: 'Tìm hiểu về chế độ ăn uống phù hợp để hỗ trợ quá trình thực hành yoga hiệu quả.',
    author: 'Trần Văn Nam',
    publishedAt: '2023-12-25',
    tags: ['Dinh dưỡng', 'Chế độ ăn'],
    readTime: '9 phút đọc'
  }
];

export default function Blog() {
  return (
    <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Blog Yoga</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Khám phá kiến thức, mẹo vặt và câu chuyện trải nghiệm từ cộng đồng yoga của chúng tôi.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                
                <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                  <time dateTime={post.publishedAt} className="mr-8">
                    {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                  </time>
                  <div className="-ml-4 flex items-center gap-x-4">
                    <svg viewBox="0 0 2 2" className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50">
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <div className="flex gap-x-2.5">
                      <span>{post.author}</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className="text-emerald-400">{post.readTime}</span>
                  </div>
                </div>
                <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                  <Link href={`/blog/${post.id}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  {post.excerpt}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          
          {/* Newsletter Signup */}
          <div className="mx-auto mt-16 max-w-2xl rounded-3xl bg-emerald-50 px-6 py-16 sm:mt-20 sm:px-16">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Đăng ký nhận bản tin
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Nhận những bài viết mới nhất về yoga, mẹo thực hành và ưu đãi đặc biệt.
              </p>
              <div className="mt-6 flex max-w-md gap-x-4 mx-auto">
                <label htmlFor="email-address" className="sr-only">
                  Địa chỉ email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                  placeholder="Nhập email của bạn"
                />
                <button
                  type="submit"
                  className="flex-none rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
