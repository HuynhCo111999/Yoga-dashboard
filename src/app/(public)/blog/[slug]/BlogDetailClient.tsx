'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BlogPost } from '@/lib/api/blog';
import './blog-detail-animations.css';

interface BlogDetailClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((paragraph, index) => {
        if (paragraph.trim() === '') return null;
        
        // Headers
        if (paragraph.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{paragraph.substring(2)}</h1>;
        }
        if (paragraph.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{paragraph.substring(3)}</h2>;
        }
        if (paragraph.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold text-gray-900 mt-4 mb-2">{paragraph.substring(4)}</h3>;
        }
        
        // Bold text **text**
        let formattedText = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic text *text*
        formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        return (
          <p 
            key={index} 
            className="text-gray-700 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="hero-particles"></div>
          <div className="hero-waves"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-white/80 mb-8 fade-in-up">
            <button
              onClick={() => router.push('/blog')}
              className="hover:text-white transition-colors duration-300 hover:scale-105 transform"
            >
              🏠 Blog
            </button>
            <span className="text-white/60">›</span>
            <span className="text-white font-medium">{post.title}</span>
          </nav>

          {/* Article Header */}
          <header className="text-center text-white">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight fade-in-up animation-delay-200">
              <span className="bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                {post.title}
              </span>
            </h1>
            
            {post.excerpt && (
              <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto fade-in-up animation-delay-400">
                {post.excerpt}
              </p>
            )}

            {/* Enhanced Meta Info */}
            <div className="flex items-center justify-center space-x-8 text-white/80 mb-8 fade-in-up animation-delay-600">
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium">{formatDate(post.publishedAt)}</span>
              </div>
            </div>

            {/* Enhanced Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-12 fade-in-up animation-delay-800">
              {post.tags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => router.push(`/blog?tag=${encodeURIComponent(tag)}`)}
                  className="group relative overflow-hidden bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg border border-white/20"
                  style={{ animationDelay: `${0.9 + index * 0.1}s` }}
                >
                  <span className="relative z-10 flex items-center space-x-1">
                    <span className="text-accent-200">#</span>
                    <span>{tag}</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-400/20 to-primary-400/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                </button>
              ))}
            </div>
          </header>
        </div>
      </div>

      {/* Enhanced Featured Image */}
      {post.featuredImage && (
        <div className="relative -mt-16 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative group">
              <div className="aspect-video relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-sm floating-card">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              {/* Image overlay decorations */}
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Article Content */}
      <article className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20"></div>
          <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-orange-100/50 p-8 lg:p-16 floating-content">
            {/* Content decoration */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            <div className="prose prose-lg prose-orange max-w-none pt-8">
              <div className="content-animation">
                {formatContent(post.content)}
              </div>
            </div>

            {/* Reading time estimate */}
            <div className="mt-12 pt-8 border-t border-orange-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Thời gian đọc: ~{Math.max(1, Math.ceil(post.content.length / 1000))} phút</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 hover:text-primary-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Yêu thích</span>
                  </button>
                  <button className="flex items-center space-x-1 hover:text-primary-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span>Chia sẻ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Enhanced Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="relative py-20 bg-gradient-to-br from-orange-50 via-white to-amber-50">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent-200/30 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 fade-in-up">
              <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
                Bài viết liên quan
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Khám phá thêm những bài viết thú vị khác về yoga và sức khỏe
              </p>
              <div className="mt-6 w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <article
                  key={relatedPost.id}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-orange-100/50 hover:border-primary-200 floating-card hover:-translate-y-2 cursor-pointer"
                  onClick={() => router.push(`/blog/${relatedPost.slug}`)}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Card glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {relatedPost.featuredImage && (
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Floating read more indicator */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary-600 px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Đọc thêm →
                      </div>
                    </div>
                  )}

                  <div className="p-6 lg:p-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {relatedPost.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 border border-primary-200/50"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors duration-300">
                      {relatedPost.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {relatedPost.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(relatedPost.publishedAt)}</span>
                      </div>
                      
                      <div className="flex items-center text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors">
                        <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                          Xem chi tiết
                        </span>
                        <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Back to Blog */}
      <div className="text-center py-16 bg-gradient-to-r from-primary-50 to-accent-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-orange-100/50 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Cảm ơn bạn đã đọc! 🙏
            </h3>
            <p className="text-gray-600 mb-6">
              Khám phá thêm nhiều bài viết hay khác trong blog của chúng tôi
            </p>
            <button
              onClick={() => router.push('/blog')}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-2xl hover:from-primary-700 hover:to-accent-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại danh sách blog
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-primary-600 to-accent-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 floating-scroll"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </button>
      )}
    </div>
  );
}
