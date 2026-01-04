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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Animated Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500">
        {/* Animated Background Elements */}
        {/* Subtle background overlay */}
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                Blog
              </span>{' '}
              <span className="relative">
                Yên Yoga
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transform scale-x-0 animate-scale-x"></div>
              </span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-300">
              Khám phá hành trình yoga đầy cảm hứng cùng Yên Yoga Studio.
            </p>
            <p className="mt-4 text-lg text-orange-200 max-w-2xl mx-auto animate-fade-in-up delay-500">
              Chia sẻ kiến thức, kinh nghiệm và những câu chuyện ý nghĩa về luyện tập, sức khỏe và lối sống cân bằng.
            </p>
          </div>
        </div>
        
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,112C1248,117,1344,107,1392,101.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="url(#gradient)" fillOpacity="0.8"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e0e7ff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Enhanced Search and Filter */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-accent-400/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search */}
              <div className="flex-1 w-full">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 text-lg bg-white/70 backdrop-blur-sm group-hover:shadow-lg"
                  />
                  <svg 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-primary-500 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Tag Filter */}
              <div className="lg:w-80 w-full">
                <select
                  value={selectedTag}
                  onChange={(e) => handleTagChange(e.target.value)}
                  className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 text-lg bg-white/70 backdrop-blur-sm hover:shadow-lg cursor-pointer"
                >
                  <option value="">Tất cả chủ đề</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>📌 {tag}</option>
                  ))}
                </select>
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
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                  <article className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-500 group-hover:shadow-3xl">
                    <div className="grid lg:grid-cols gap-0">
                      {/* Featured Image */}
                      {filteredPosts[0].featuredImage && (
                        <div className="relative h-64 lg:h-full min-h-[400px] overflow-hidden">
                          <Image
                            src={filteredPosts[0].featuredImage}
                            alt={filteredPosts[0].title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                          <div className="absolute top-6 left-6">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-accent-400 text-accent-900 shadow-lg">
                              ⭐ Bài viết nổi bật
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
                              onClick={() => setSelectedTag(tag)}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-primary-700 transition-colors">
                          {filteredPosts[0].title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                          {filteredPosts[0].excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center text-sm text-gray-500 mb-8">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                              {filteredPosts[0].author.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{filteredPosts[0].author}</span>
                          </div>
                          <span className="mx-4">•</span>
                          <span>📅 {formatDate(filteredPosts[0].publishedAt)}</span>
                        </div>

                        {/* Read More Button */}
                        <button 
                          onClick={() => handlePostClick(filteredPosts[0])}
                          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-2xl hover:from-primary-700 hover:to-accent-700 transition-all duration-300 text-lg font-semibold transform hover:scale-105 hover:shadow-xl group"
                        >
                          <span>📖 Đọc bài viết</span>
                          <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            )}

            {/* Other Posts Grid */}
            {filteredPosts.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPosts.slice(1).map((post, index) => (
                  <article 
                    key={post.id} 
                    className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Featured Image */}
                    {post.featuredImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 2).map((tag, tagIndex) => (
                          <button
                            key={tagIndex}
                            onClick={() => setSelectedTag(tag)}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-100 to-accent-100 text-primary-800 hover:from-primary-200 hover:to-accent-200 transition-colors"
                          >
                            #{tag}
                          </button>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{post.tags.length - 2} thêm
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors leading-tight">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                            {post.author.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{post.author}</span>
                        </div>
                        <span>📅 {formatDate(post.publishedAt)}</span>
                      </div>

                      {/* Read More Button */}
                      <button 
                        onClick={() => handlePostClick(post)}
                        className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-3 px-4 rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all duration-300 text-sm font-semibold hover:shadow-lg group flex items-center justify-center"
                      >
                        <span>📖 Đọc thêm</span>
                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
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
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl blur-xl opacity-25"></div>
            <div className="relative bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-12 text-center text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-4">
                Khám phá thêm nhiều bài viết từ Yên Yoga
              </h3>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Tham gia cộng đồng yoga của Yên Yoga Studio để không bỏ lỡ những chia sẻ hữu ích và nguồn cảm hứng mới mỗi ngày.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => router.push('/calendar')}
                  className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-2xl hover:bg-orange-50 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                >
                  <span>📅 Xem lịch lớp học</span>
                </button>
                <button 
                  onClick={() => router.push('/about')}
                  className="inline-flex items-center px-8 py-4 bg-primary-700/50 text-white rounded-2xl hover:bg-primary-700 transition-all duration-300 font-semibold border border-white/20"
                >
                  <span>🧘‍♀️ Tìm hiểu về chúng tôi</span>
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
