import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogApi } from '@/lib/api/blog';
import { generateMetadata as generateSEOMetadata, generateBlogPostStructuredData } from '@/utils/seo';
import BlogDetailClient from './BlogDetailClient';

// Enable SSG
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for SSG
export async function generateStaticParams() {
  try {
    const slugs = await blogApi.getAllPublishedSlugs();
    return slugs.map((slug) => ({
      slug: slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const result = await blogApi.getPostBySlug(slug);
    
    if (!result.success || !result.data || !result.data.isPublished) {
      return {
        title: 'Bài viết không tồn tại',
        description: 'Bài viết này không tồn tại hoặc đã bị xóa.',
      };
    }

    const post = result.data;
    
    return generateSEOMetadata({
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      keywords: post.tags,
      canonical: `/blog/${post.slug}`,
      ogImage: post.featuredImage || '/logo.jpeg',
    });
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Lỗi tải bài viết',
      description: 'Có lỗi xảy ra khi tải bài viết.',
    };
  }
}

// Server component for SSG
export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  try {
    const { slug } = await params;
    const result = await blogApi.getPostBySlug(slug);
    
    if (!result.success || !result.data) {
      notFound();
    }

    const post = result.data;
    
    // Check if post is published (for public access)
    if (!post.isPublished) {
      notFound();
    }

    // Get related posts
    const relatedResult = await blogApi.getPublishedPosts();
    const relatedPosts = relatedResult.success && relatedResult.data
      ? relatedResult.data
          .filter(p => p.id !== post.id) // Exclude current post
          .filter(p => p.tags.some(tag => post.tags.includes(tag))) // Has common tags
          .slice(0, 3) // Limit to 3 posts
      : [];

    return (
      <>
        <BlogDetailClient post={post} relatedPosts={relatedPosts} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBlogPostStructuredData({
              title: post.title,
              description: post.excerpt || post.content.substring(0, 160),
              author: post.author,
              publishedAt: post.publishedAt,
              featuredImage: post.featuredImage,
              slug: post.slug,
            }))
          }}
        />
      </>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}
