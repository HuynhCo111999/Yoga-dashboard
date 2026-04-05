'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import parse, { domToReact, Element, type DOMNode } from 'html-react-parser';
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
      let injectedTag = match.replace(/<h[1-3]/i, `$& id="${id}" class="scroll-mt-24"` );
      
      return injectedTag;
    });

    return { tocItems: toc, parsedContent: modifiedHtml };
  }, [post?.content]);

  const contentNodes = useMemo(() => {
    if (!parsedContent) return null;

    return parse(parsedContent, {
      replace: (node) => {
        if (!(node instanceof Element)) return;

        if (node.name === 'img') {
          const src = node.attribs?.src || '';
          const alt = node.attribs?.alt || post.title || 'Ảnh minh họa';

          // Next/Image doesn't support data: URLs reliably; keep as native img for previews (shouldn't exist in published content)
          if (src.startsWith('data:image')) {
            // eslint-disable-next-line @next/next/no-img-element
            return (
              <img
                src={src}
                alt={alt}
                className="my-6 w-full h-auto rounded-lg shadow-md"
              />
            );
          }

          const widthAttr = node.attribs?.width ? Number(node.attribs.width) : undefined;
          const heightAttr = node.attribs?.height ? Number(node.attribs.height) : undefined;
          const width = Number.isFinite(widthAttr) && widthAttr! > 0 ? widthAttr! : 1200;
          const height = Number.isFinite(heightAttr) && heightAttr! > 0 ? heightAttr! : 675;

          return (
            <span className="block">
              <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes="(max-width: 768px) 100vw, 768px"
                className="w-full h-auto rounded-lg object-contain"
              />
            </span>
          );
        }

        // Ensure links inside content keep rel safety when opening new tab
        if (node.name === 'a') {
          const href = node.attribs?.href || '#';
          const target = node.attribs?.target;
          const rel = node.attribs?.rel;
          const safeRel =
            target === '_blank'
              ? Array.from(
                  new Set(
                    `${rel || ''} noopener noreferrer`.trim().split(/\s+/).filter(Boolean),
                  ),
                ).join(' ')
              : rel;

          return (
            <a href={href} target={target} rel={safeRel}>
              {domToReact(node.children as DOMNode[])}
            </a>
          );
        }
      },
    });
  }, [parsedContent, post.title]);

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
    <div className="min-h-[100dvh] bg-gradient-to-br from-primary-50 via-white to-accent-50 relative">
      {/* Reading Progress Bar - Viblo style thin bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 bg-gray-200 z-50">
        <div
          className="h-full bg-primary-500 transition-all duration-200 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Article header - Viblo style: compact, left-aligned in content width */}
      <header className="pt-20 pb-8 sm:pt-24 sm:pb-10 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button
              onClick={() => router.push('/blog')}
              className="hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Blog
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 truncate max-w-[180px] sm:max-w-md">{post.title}</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}

          {/* Meta row: author, date, read time - Viblo style one line */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-700">{post.author}</span>
            </div>
            <span className="text-gray-400">·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span className="text-gray-400">·</span>
            <span>~{Math.max(1, Math.ceil(post.content.length / 1000))} phút đọc</span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => router.push(`/blog?tag=${encodeURIComponent(tag)}`)}
                  className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Featured Image - Viblo style: full width, contained */}
      {post.featuredImage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="relative aspect-[2/1] rounded-lg overflow-hidden w-full">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* Article Content + Mục lục - Viblo style layout */}
      <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Mục lục - Viblo style: always show box, title "Mục lục" */}
          <aside className="w-full lg:w-72 shrink-0 order-1 lg:order-2 lg:sticky lg:top-24 self-start">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                Mục lục
              </h3>
              {tocItems.length > 0 ? (
                <nav className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm py-1 transition-colors ${
                        activeHeadingId === item.id
                          ? 'text-primary-600 font-semibold'
                          : 'text-gray-600 hover:text-gray-900'
                      } ${item.level === 3 ? 'pl-3 border-l border-gray-200 ml-1' : ''}`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              ) : (
                <p className="text-sm text-gray-400">Không có mục lục</p>
              )}
            </div>
          </aside>

          {/* Main Content - single column, readable width */}
          <div className="flex-1 min-w-0 order-2 lg:order-1">
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 sm:p-8 lg:p-10">
              {/* Viblo-style prose: neutral text, clear hierarchy, code blocks */}
              <div
                className="blog-content prose prose-gray max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-h1:text-2xl prose-h1:mt-8 prose-h1:mb-4
                  prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
                  prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
                  prose-p:text-gray-700 prose-p:leading-[1.75] prose-p:mb-4
                  prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
                  prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r prose-blockquote:not-italic prose-blockquote:text-gray-700
                  prose-ul:my-4 prose-ol:my-4 prose-li:my-1
                  prose-strong:font-semibold prose-strong:text-gray-900"
              >
                {contentNodes}
              </div>

            {/* Article Footer - Internal links Viblo-style */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                Khám phá thêm
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Link
                  href="/"
                  className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  <span className="text-primary-500">→</span>
                  Trang chủ
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  <span className="text-primary-500">→</span>
                  Về chúng tôi
                </Link>
                <Link
                  href="/packages"
                  className="flex items-center gap-2 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  <span className="text-primary-500">→</span>
                  Gói tập
                </Link>
              </div>
            </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 border-t border-gray-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Bài viết liên quan
              </h2>
              <p className="text-sm text-gray-500">
                Khám phá thêm bài viết từ Yên Yoga.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.id}
                  className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all cursor-pointer flex flex-col"
                  onClick={() => handleRelatedPostClick(relatedPost)}
                >
                  {relatedPost.featuredImage && (
                    <div className="relative h-44 overflow-hidden bg-gray-100">
                      <Image
                        src={relatedPost.featuredImage}
                        alt={relatedPost.title}
                        fill
                        className="object-cover group-hover:opacity-95 transition-opacity"
                      />
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <span>{formatDate(relatedPost.publishedAt)}</span>
                      <span className="mx-1.5">·</span>
                      <span>{relatedPost.author}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed flex-1">
                      {relatedPost.excerpt}
                    </p>
                    <span className="mt-3 text-sm font-medium text-primary-600 group-hover:underline">
                      Đọc tiếp →
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog - Viblo style simple CTA */}
      <div className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã đọc. Khám phá thêm bài viết khác từ Yên Yoga.
          </p>
          <button
            onClick={() => router.push('/blog')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại danh sách bài
          </button>
        </div>
      </div>

      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-white border border-gray-200 text-gray-600 p-3 rounded-full shadow-md hover:bg-gray-50 transition-colors z-50"
          aria-label="Về đầu trang"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
          </svg>
        </button>
      )}
    </div>
  );
}
