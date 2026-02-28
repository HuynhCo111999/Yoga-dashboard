'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { BlogPost } from '@/lib/api/blog';
import { logger } from '@/lib/logger';
import './blog-detail-animations.css';

interface BlogDetailClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogDetailClient({ post, relatedPosts }: BlogDetailClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  // Extract TOC and modify HTML to include heading IDs
  const { tocItems, parsedContent } = useMemo(() => {
    if (!post?.content) return { tocItems: [], parsedContent: '' };
    
    const toc: { id: string, text: string, level: number }[] = [];
    let headingIndex = 0;
    
    // Regex to match <h1...>, <h2...>, <h3...>...</h3>
    const headingRegex = /<h([1-3])[^>]*>(.*?)<\/h\1>/gi;
    
    // Replace and collect headings
    const modifiedHtml = post.content.replace(headingRegex, (match, levelStr, innerHtml) => {
      const level = parseInt(levelStr, 10);
      
      // Strip any nested HTML tags within the heading to get clean text for TOC
      const cleanText = innerHtml.replace(/<[^>]+>/g, '').trim();
      
      if (!cleanText) return match; // Skip empty headings

      const id = `heading-${headingIndex++}`;
      toc.push({ id, text: cleanText, level });
      
      // Inject ID into the heading tag. Also add standard scroll-mt util.
      // E.g. <h2 becomes <h2 id="heading-0" class="scroll-mt-28"
      // We do a simple replace on the first opening bracket
      let injectedTag = match.replace(/<h[1-3]/i, `$& id="${id}" class="scroll-mt-28 font-extrabold"` );
      
      return injectedTag;
    });

    return { tocItems: toc, parsedContent: modifiedHtml };
  }, [post?.content]);

  // Track active heading for TOC
  useEffect(() => {
    const handleTocScroll = () => {
      if (tocItems.length === 0) return;
      
      const headingElements = tocItems.map(item => document.getElementById(item.id)).filter(Boolean);
      let currentActiveId = '';
      
      for (const el of headingElements) {
        if (el && el.getBoundingClientRect().top <= 150) { // Offset for navbar
          currentActiveId = el.id;
        }
      }
      
      if (currentActiveId) {
        setActiveHeadingId(currentActiveId);
      } else if (window.scrollY < 300) {
        setActiveHeadingId('');
      }
    };
    
    window.addEventListener('scroll', handleTocScroll);
    return () => window.removeEventListener('scroll', handleTocScroll);
  }, [tocItems]);

  // Log page view for blog post
  useEffect(() => {
    logger.info('Blog post viewed', {
      slug: post.slug,
      title: post.title,
      author: post.author,
      tags: post.tags,
      path: pathname,
    });
    logger.event('Blog Post Viewed', {
      slug: post.slug,
      title: post.title,
      author: post.author,
    });
    console.log(`[BLOG] User viewing post: ${post.title}`);
  }, [post.slug, post.title, post.author, post.tags, pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 500);

      // Log when user reaches certain milestones
      if (scrollPercent >= 25 && scrollPercent < 26) {
        console.log('[BLOG] User scrolled 25% of the post');
      } else if (scrollPercent >= 50 && scrollPercent < 51) {
        console.log('[BLOG] User scrolled 50% of the post');
      } else if (scrollPercent >= 75 && scrollPercent < 76) {
        console.log('[BLOG] User scrolled 75% of the post');
      } else if (scrollPercent >= 95) {
        logger.event('Blog Post Read Complete', {
          slug: post.slug,
          title: post.title,
        });
        console.log('[BLOG] User completed reading the post');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post.slug, post.title]);

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


  const handleRelatedPostClick = (relatedPost: BlogPost) => {
    logger.info('Related blog post clicked', {
      fromSlug: post.slug,
      toSlug: relatedPost.slug,
      toTitle: relatedPost.title,
    });
    logger.event('Related Post Clicked', {
      fromPost: post.title,
      toPost: relatedPost.title,
    });
    console.log(`[BLOG] User clicked related post: ${relatedPost.title}`);
    router.push(`/blog/${relatedPost.slug}`);
  };

  return (
    <div className='min-h-[100dvh] bg-gradient-to-br from-primary-50 via-white to-accent-50 relative overflow-hidden'>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-gray-100 z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-float-slow pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-secondary-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-float pointer-events-none"></div>

      {/* Enhanced Hero Section */}
      <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-8 animate-fadeInUp">
            <button
              onClick={() => router.push('/blog')}
              className="hover:text-primary-600 transition-colors duration-300 flex items-center gap-1 font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Góc Chia Sẻ
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
          </nav>

          {/* Article Header */}
          <header className="text-center">
            {/* Enhanced Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-6 animate-fadeInUp animate-delay-100">
              {post.tags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => router.push(`/blog?tag=${encodeURIComponent(tag)}`)}
                  className="z-10 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors border border-primary-100"
                >
                  {tag}
                </button>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-gray-900 tracking-tight animate-fadeInUp animate-delay-200">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto animate-fadeInUp animate-delay-300">
                {post.excerpt}
              </p>
            )}

            {/* Enhanced Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-gray-600 text-sm sm:text-base animate-fadeInUp animate-delay-400">
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-100 shadow-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold shadow-inner">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-bold text-gray-900">{post.author}</span>
                  <span className="text-xs text-gray-500">Tác giả</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2.5 border border-gray-100 shadow-sm">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{formatDate(post.publishedAt)}</span>
              </div>
              
               <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2.5 border border-gray-100 shadow-sm">
                  <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">~{Math.max(1, Math.ceil(post.content.length / 1000))} phút đọc</span>
                </div>
            </div>
          </header>
        </div>
      </div>

      {/* Enhanced Featured Image */}
      {post.featuredImage && (
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto -mt-8 mb-16">
          <div className="relative group animate-fadeInUp animate-delay-500">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="aspect-[2/1] md:aspect-[2.5/1] relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/80 backdrop-blur-sm">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Article Content & TOC Layout */}
      <article className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative z-10">
          
           {/* Sticky TOC Sidebar */}
           {tocItems.length > 0 && (
            <div className="w-full lg:w-80 shrink-0 lg:sticky top-28 order-1 lg:order-2 z-20 h-max">
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white p-6 sm:p-8 animate-fadeInUp animate-delay-600">
                <h4 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Nội dung chính
                </h4>
                <nav className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  {tocItems.map((item) => (
                    <a 
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm transition-all duration-300 border-l-2 pl-3 py-1.5 ${
                        activeHeadingId === item.id 
                          ? 'border-primary-500 text-primary-700 font-bold bg-primary-50 rounded-r-lg' 
                          : 'border-transparent text-gray-600 hover:text-primary-500 hover:border-primary-200'
                      } ${item.level === 3 ? 'ml-4 text-[13px]' : ''}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white p-6 sm:p-10 lg:p-14 relative overflow-hidden order-2 lg:order-1 min-w-0 animate-fadeInUp animate-delay-600">
            {/* Content decoration blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            {/* We apply prose classes directly to the innerHTML container to style the standard HTML elements */}
            <div 
              className="prose prose-lg md:prose-xl prose-orange max-w-none relative z-10 font-sans prose-headings:text-gray-900 prose-headings:font-extrabold prose-p:text-gray-700 prose-p:leading-loose prose-a:text-primary-600 hover:prose-a:text-primary-500 prose-img:rounded-2xl prose-img:shadow-lg prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-primary-50 prose-blockquote:to-transparent prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-2xl prose-blockquote:text-xl prose-blockquote:font-medium prose-blockquote:not-italic prose-li:marker:text-primary-500"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />

          {/* Article Footer & Actions */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition-colors bg-gray-50 hover:bg-primary-50 px-4 py-2 rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-semibold">Yêu thích</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition-colors bg-gray-50 hover:bg-primary-50 px-4 py-2 rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="font-semibold">Chia sẻ</span>
              </button>
            </div>
            
            <div className="flex space-x-4">
               {/* Social placeholders */}
               <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                 <span className="font-bold">f</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-colors cursor-pointer">
                 <span className="font-bold">t</span>
               </div>
            </div>
          </div>
        </div>
        </div>
      </article>

      {/* Enhanced Related Posts */}
      {/* Enhanced Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="relative py-20 border-t border-gray-100 bg-white/50">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Bài viết <span className="gradient-text">liên quan</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Khám phá thêm những góc nhìn và chia sẻ hữu ích khác từ chuyên gia Yên Yoga.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <article
                  key={relatedPost.id}
                  className="group bg-white/70 backdrop-blur-md rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white hover:-translate-y-2 cursor-pointer flex flex-col"
                  onClick={() => handleRelatedPostClick(relatedPost)}
                >
                  {relatedPost.featuredImage && (
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                      
                      {/* Tags floating on image */}
                      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                         {relatedPost.tags.slice(0, 2).map((tag, tagIndex) => (
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
                    <div className="flex items-center text-xs text-gray-500 mb-4 font-medium uppercase tracking-wide">
                      <span>{formatDate(relatedPost.publishedAt)}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-primary-600">{relatedPost.author}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors leading-snug">
                      {relatedPost.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                      {relatedPost.excerpt}
                    </p>

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
          </div>
        </section>
      )}

      {/* Enhanced Back to Blog */}
      <div className="text-center py-16 relative">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-10 lg:p-12 border border-white shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Cảm ơn bạn đã đọc! 🙏
            </h3>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Hãy tiếp tục khám phá thêm nhiều bài viết hay khác trong không gian chia sẻ của Yên Yoga.
            </p>
            <button
              onClick={() => router.push('/blog')}
              className="btn-shine inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl hover:from-primary-700 hover:to-accent-600 transition-all duration-300 font-bold shadow-lg hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại danh sách bài
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
