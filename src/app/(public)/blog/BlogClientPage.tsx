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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Log page view
  useEffect(() => {
    logger.info('Page viewed: Blog', { page: 'blog', path: pathname });
    logger.event('Page View', { page: 'Blog', path: pathname });
    console.log('[PAGE] User navigated to Blog page');
  }, [pathname]);

  useEffect(() => {
    loadPosts();
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

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      logger.debug('Loading blog posts', { page: 'blog' });

      const result = await blogApi.getPublishedPosts();
      if (result.success && result.data) {
        setPosts(result.data);
        logger.info('Blog posts loaded successfully', {
          count: result.data.length,
          page: 'blog',
        });
        console.log(`[BLOG] Loaded ${result.data.length} blog posts`);
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

  // Filter posts based on search and tag
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

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
    <div className='min-h-[100dvh] bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden'>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-float-slow pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-secondary-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-float pointer-events-none"></div>

      {/* Animated Hero Section */}
      <div className="relative overflow-hidden pt-28 pb-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/80 backdrop-blur-md border border-secondary-200 text-secondary-600 text-sm font-semibold tracking-wide mb-6 shadow-sm animate-fadeInUp">
              Góc Chia Sẻ
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 animate-fadeInUp animate-delay-100 tracking-tight">
              Blog <span className="gradient-text">Yên Yoga</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fadeInUp animate-delay-200">
              Khám phá hành trình yoga đầy cảm hứng cùng Yên Yoga Studio.
            </p>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto animate-fadeInUp animate-delay-300">
              Chia sẻ kiến thức, kinh nghiệm và những câu chuyện ý nghĩa về luyện tập, sức khỏe và lối sống cân bằng.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        {/* Enhanced Search and Filter */}
        <div className="relative mb-16 max-w-5xl mx-auto animate-fadeInUp animate-delay-400">
          <div className="relative bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/80 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Search */}
              <div className="flex-1 w-full">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/80 border-0 rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 text-lg shadow-sm placeholder-gray-400 group-hover:shadow-md"
                  />
                  <svg 
                    className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-primary-400 group-focus-within:text-primary-600 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Tag Filter */}
              <div className="md:w-72 w-full">
                <div className="relative group">
                  <select
                    value={selectedTag}
                    onChange={(e) => handleTagChange(e.target.value)}
                    className="w-full pl-12 pr-10 py-4 bg-white/80 border-0 rounded-2xl focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 text-lg shadow-sm cursor-pointer appearance-none group-hover:shadow-md text-gray-700"
                  >
                    <option value="">Tất cả chủ đề</option>
                    {allTags.map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                  </select>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Active filters */}
            {(searchTerm || selectedTag) && (
              <div className="mt-6 flex flex-wrap gap-3">
                {searchTerm && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                    Từ khóa: &quot;{searchTerm}&quot;
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ✕
                    </button>
                  </span>
                )}
                {selectedTag && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-accent-100 text-accent-800">
                    Chủ đề: {selectedTag}
                    <button
                      onClick={() => setSelectedTag('')}
                      className="ml-2 text-accent-600 hover:text-accent-800"
                    >
                      ✕
                    </button>
                  </span>
                )}
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

        {/* Loading State với animation đẹp */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-200 rounded-full animate-spin"></div>
              <div className="w-16 h-16 border-4 border-primary-600 rounded-full animate-spin absolute top-0 left-0" style={{clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)'}}></div>
            </div>
            <p className="mt-6 text-lg text-gray-600 animate-pulse">Đang tải bài viết, vui lòng chờ trong giây lát...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center text-4xl animate-bounce">
                📝
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent-400 rounded-full flex items-center justify-center text-lg animate-pulse">
                ✨
              </div>
            </div>
            <h3 className="mt-8 text-2xl font-bold text-gray-900">
              {searchTerm || selectedTag ? 'Không tìm thấy bài viết phù hợp' : 'Chưa có bài viết nào'}
            </h3>
            <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto">
              {searchTerm || selectedTag ? 
                'Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để khám phá thêm.' : 
                'Hãy quay lại sau để đọc những bài viết mới từ Yên Yoga Studio.'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Featured Post (first post) */}
            {filteredPosts.length > 0 && (
              <div className="mb-16">
                <div className="relative group cursor-pointer" onClick={() => handlePostClick(filteredPosts[0])}>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <article className="relative bg-white/80 backdrop-blur-lg rounded-[2.5rem] shadow-xl border border-white overflow-hidden transform group-hover:-translate-y-2 transition-all duration-500">
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Featured Image */}
                      {filteredPosts[0].featuredImage && (
                        <div className="relative h-72 lg:h-full min-h-[400px] overflow-hidden">
                          <Image
                            src={filteredPosts[0].featuredImage}
                            alt={filteredPosts[0].title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                          <div className="absolute top-6 left-6 flex gap-2">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-white/90 backdrop-blur-sm text-primary-700 shadow-lg">
                              Nổi bật
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {filteredPosts[0].tags.slice(0, 3).map((tag, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTag(tag);
                              }}
                              className="inline-flex z-10 items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors border border-primary-100"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 leading-tight group-hover:text-primary-600 transition-colors">
                          {filteredPosts[0].title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed line-clamp-3">
                          {filteredPosts[0].excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 shadow-sm">
                                {filteredPosts[0].author.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-gray-900">{filteredPosts[0].author}</span>
                                <span className="text-xs">Tác giả</span>
                              </div>
                            </div>
                            <span className="mx-4 text-gray-300">|</span>
                            <span className="font-medium">{formatDate(filteredPosts[0].publishedAt)}</span>
                          </div>

                          <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white text-primary-500 transition-colors shadow-sm">
                             <svg className="w-5 h-5 translate-x-px group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                             </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            )}

            {/* Other Posts Grid */}
            {filteredPosts.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.slice(1).map((post, index) => (
                  <article 
                    key={post.id} 
                    onClick={() => handlePostClick(post)}
                    className="group bg-white/70 backdrop-blur-md rounded-[2rem] shadow-lg border border-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Featured Image */}
                    {post.featuredImage && (
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                        
                        {/* Tags floating on image */}
                        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                           {post.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-primary-700 shadow-sm"
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      {/* Meta header */}
                      <div className="flex items-center text-xs text-gray-500 mb-4 font-medium uppercase tracking-wide">
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-primary-600">{post.author}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-extrabold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                        {post.excerpt}
                      </p>

                      {/* Read More Link (visual only, entire card is clickable) */}
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-sm font-bold text-primary-600 group-hover:text-primary-700">
                        Đọc tiếp
                        <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </article>
                ))}
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
              Đang hiển thị <span className="text-primary-600 font-bold">{filteredPosts.length}</span> trên tổng số <span className="text-accent-600 font-bold">{posts.length}</span> bài viết
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

              <h3 className="relative text-3xl sm:text-4xl font-extrabold mb-6 text-gray-900 tracking-tight">
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

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
