'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { blogApi, BlogPost } from '@/lib/api/blog';
import { logger } from '@/lib/logger';
import './blog-animations.css';

export default function BlogClientPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Log page view
  useEffect(() => {
    logger.info('Page viewed: Blog', { page: 'blog', path: pathname });
    logger.event('Page View', { page: 'Blog', path: pathname });
    console.log('[PAGE] User navigated to Blog page');
  }, [pathname]);

  useEffect(() => {
    // Load featured post độc lập với phân trang
    const loadFeatured = async () => {
      const result = await blogApi.getFeaturedPost();
      if (result.success && result.data) {
        setFeaturedPost(result.data);
      } else {
        setFeaturedPost(null);
      }
    };

    loadFeatured();
    loadPosts(1, false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const PAGE_SIZE = 9;

  const loadPosts = async (targetPage: number, append: boolean) => {
    try {
      setLoading(true);
      setError(null);

      logger.debug('Loading blog posts', { page: targetPage, limit: PAGE_SIZE });

      const result = await blogApi.getPublishedPostsPaginated(targetPage, PAGE_SIZE);
      if (result.success && result.data) {
        setPosts(prev => (append ? [...prev, ...result.data] : result.data));
        setHasMore(result.hasMore);
        setPage(targetPage);
        setTotal(result.total ?? result.data.length);
        logger.info('Blog posts loaded successfully', {
          count: result.data.length,
          page: targetPage,
        });
        console.log(`[BLOG] Loaded ${result.data.length} blog posts (page=${targetPage}, append=${append})`);
      } else {
        setError(result.error || 'Có lỗi xảy ra khi tải bài viết');
        logger.warning('Failed to load blog posts', {
          error: result.error,
          page: 'blog',
        });
      }
    } catch (err) {
      const errorMessage = 'Có lỗi xảy ra khi tải bài viết';
      setError(errorMessage);
      logger.error('Blog posts loading error', err, { page: 'blog' });
    } finally {
      setLoading(false);
    }
  };

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  const hasFilter = !!searchTerm || !!selectedTag;

  // Nếu có filter, áp dụng lên cả featured + posts; nếu không, chỉ filter list thường
  const baseListForFilter = hasFilter
    ? [...(featuredPost ? [featuredPost] : []), ...posts]
    : posts;

  const filteredPosts = baseListForFilter.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Logging handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.length >= 3) {
      logger.debug('Blog search performed', {
        searchTerm: value,
        page: 'blog',
      });
      console.log(`[BLOG] User searching for: "${value}"`);
    }
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    logger.info('Blog tag filter applied', {
      tag: tag || 'all',
      page: 'blog',
    });
    logger.event('Blog Filter Changed', {
      filterType: 'tag',
      value: tag || 'all',
    });
    console.log(`[BLOG] Tag filter applied: ${tag || 'all'}`);
  };

  const handlePostClick = (post: BlogPost) => {
    logger.info('Blog post clicked', {
      slug: post.slug,
      title: post.title,
      page: 'blog',
    });
    logger.event('Blog Post Clicked', {
      slug: post.slug,
      title: post.title,
    });
    console.log(`[BLOG] User clicked post: ${post.title}`);
    router.push(`/blog/${post.slug}`);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <header className="pt-24 pb-10 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-3">
              Blog Yên Yoga
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Góc chia sẻ về yoga, sức khỏe và lối sống cân bằng
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Khám phá các bài viết được biên soạn để giúp bạn luyện tập tốt hơn, hiểu cơ thể hơn và sống chậm lại mỗi ngày.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Search and filter */}
        <div className="mb-10 bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
              />
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="relative">
              <select
                value={selectedTag}
                onChange={(e) => handleTagChange(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
              >
                <option value="">Tất cả chủ đề</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <svg className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              {loading && posts.length === 0
                ? 'Đang tải bài viết...'
                : `Hiển thị ${filteredPosts.length} / ${total || posts.length} bài viết`}
            </p>

            {(searchTerm || selectedTag) && (
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-primary-50 text-primary-700">
                    &quot;{searchTerm}&quot;
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {selectedTag && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-700">
                    {selectedTag}
                    <button
                      type="button"
                      onClick={() => setSelectedTag('')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag('');
                  }}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 rounded-full border-2 border-gray-200 border-t-primary-600 animate-spin" />
            <p className="mt-4 text-sm text-gray-500">Đang tải bài viết...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl text-center py-16 px-6">
            <h3 className="text-xl font-bold text-gray-900">
              {searchTerm || selectedTag ? 'Không tìm thấy bài viết phù hợp' : 'Chưa có bài viết nào'}
            </h3>
            <p className="mt-3 text-gray-600 max-w-md mx-auto">
              {searchTerm || selectedTag ? 
                'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để khám phá thêm.' : 
                'Hãy quay lại sau để đọc những bài viết mới từ Yên Yoga.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Nếu không có filter: hiển thị bài nổi bật cố định (không phụ thuộc paging) */}
            {!hasFilter && featuredPost && (
              <div className="mb-10">
                <article
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handlePostClick(featuredPost)}
                >
                  <div className="grid lg:grid-cols-[1.1fr_1fr] gap-0">
                      {/* Featured Image */}
                      {featuredPost.featuredImage && (
                        <div className="relative h-72 lg:h-full min-h-[340px] overflow-hidden bg-gray-100">
                          <Image
                            src={featuredPost.featuredImage}
                            alt={featuredPost.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-5 left-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-primary-600/95 text-white shadow-md">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white" />
                              Bài viết nổi bật
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {featuredPost.tags.slice(0, 3).map((tag, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTag(tag);
                              }}
                              className="inline-flex z-10 items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-primary-600 transition-colors">
                          {featuredPost.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-gray-600 text-base mb-6 leading-relaxed line-clamp-3">
                          {featuredPost.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-500 min-w-0">
                            <div className="flex items-center">
                              <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-sm font-bold mr-3">
                                {featuredPost.author.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-900">{featuredPost.author}</span>
                                <span className="text-xs">{formatDate(featuredPost.publishedAt)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-sm font-medium text-primary-600 group-hover:text-primary-700">
                            Đọc tiếp →
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
              </div>
            )}

            {/* Other Posts Grid (luôn lấy từ danh sách phân trang, không phụ thuộc featured) */}
            {filteredPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <article 
                    key={post.id} 
                    onClick={() => handlePostClick(post)}
                    className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden"
                  >
                    {/* Featured Image */}
                    {post.featuredImage && (
                      <div className="relative h-52 overflow-hidden bg-gray-100">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col">
                      {/* Meta header */}
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span>{post.author}</span>
                      </div>

                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-gray-100 text-gray-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed flex-1">
                        {post.excerpt}
                      </p>

                      <div className="mt-auto pt-4 border-t border-gray-100 text-sm font-medium text-primary-600 group-hover:text-primary-700">
                        Đọc tiếp →
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={loading || page === 1}
                  onClick={() => loadPosts(page - 1, false)}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                >
                  ← Trang trước
                </button>

                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const p = idx + 1;
                    const isActive = p === page;
                    return (
                      <button
                        key={p}
                        type="button"
                        disabled={loading && isActive}
                        onClick={() => loadPosts(p, false)}
                        className={`min-w-[32px] px-2 py-1 rounded-full text-xs font-medium border ${
                          isActive
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={loading || !hasMore || page === totalPages}
                  onClick={() => loadPosts(page + 1, false)}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                >
                  Trang sau →
                </button>
              </div>
            )}
          </>
        )}

        {/* Enhanced Results Count */}
        {!loading && filteredPosts.length > 0 && (
          <div className="text-center mt-16 p-8 bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl border border-primary-100">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xl">
                📊
              </div>
            </div>
            <p className="text-lg text-gray-700 font-medium">
              Đang hiển thị <span className="text-primary-600 font-bold">{filteredPosts.length}</span> trên tổng số <span className="text-accent-600 font-bold">{total}</span> bài viết
            </p>
            {(searchTerm || selectedTag) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('');
                }}
                className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-2xl hover:from-primary-700 hover:to-accent-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>🔄 Xóa bộ lọc</span>
              </button>
            )}
          </div>
        )}

        {/* Call to Action Section */}
        {!loading && posts.length > 0 && (
          <div className="mt-24 relative isolate">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-[2.5rem] blur-2xl opacity-20"></div>
            <div className="relative bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 sm:p-14 text-center shadow-2xl overflow-hidden">
               {/* inner blob */}
               <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50"></div>

              <h3 className="relative text-3xl sm:text-4xl font-bold mb-6 text-gray-900 tracking-tight">
                Không muốn bỏ lỡ <span className="gradient-text">bài viết mới</span>?
              </h3>
              <p className="relative text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Hãy trở thành một phần của cộng đồng Yên Yoga và cùng nhau xây dựng lối sống cân bằng, khỏe mạnh.
              </p>
              <div className="relative flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => router.push('/calendar')}
                  className="btn-shine inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl hover:from-primary-700 hover:to-accent-600 transition-all duration-300 font-bold shadow-lg hover:-translate-y-1"
                >
                  Tham gia ngay hôm nay
                </button>
                <button 
                  onClick={() => router.push('/about')}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-bold border-2 border-gray-100 hover:border-gray-200 hover:-translate-y-1"
                >
                  Tìm hiểu về chúng tôi
                </button>
              </div>
              </div>
          </div>
        )}
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 bg-white border border-gray-200 text-gray-600 rounded-full shadow-md hover:bg-gray-50 transition-colors flex items-center justify-center"
          aria-label="Về đầu trang"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
