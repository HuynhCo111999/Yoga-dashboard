'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { blogApi, type BlogPost } from '@/lib/api/blog';

export default function HomeBlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await blogApi.getPublishedPosts();
        if (result.success && result.data) {
          setPosts(result.data.slice(0, 3));
        } else {
          setError(result.error || 'Không tải được bài viết');
        }
      } catch {
        setError('Không tải được bài viết');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading && posts.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-24 flex items-center justify-center text-gray-500 text-sm">
            Đang tải các bài viết mới...
          </div>
        </div>
      </section>
    );
  }

  if (error || posts.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-3 border border-primary-100">
              Góc chia sẻ
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Bài viết mới từ <span className="gradient-text">blog</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-xl">
              Cập nhật kiến thức yoga, sức khỏe và lối sống cân bằng từ Yên Yoga.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-primary-700 border border-primary-200 bg-white hover:bg-primary-50 hover:border-primary-400 transition-all duration-200 self-start"
          >
            Xem tất cả bài viết
            <svg
              className="ml-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl bg-white/80 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {post.featuredImage && (
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                </div>
              )}

              <div className="flex-1 p-5 flex flex-col">
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="font-medium text-primary-600 truncate">
                    {post.author}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>

                {post.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary-50 text-primary-700"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="text-[11px] text-gray-400">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-3 flex items-center text-sm font-semibold text-primary-600">
                  Đọc tiếp
                  <svg
                    className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

