import { MetadataRoute } from 'next'
import { blogApi } from '@/lib/api/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const postsResult = await blogApi.getPublishedPosts();
    const posts = postsResult.success && postsResult.data ? postsResult.data : [];
    
    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yoga-dashboard.vercel.app'}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yoga-dashboard.vercel.app'}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      ...blogRoutes,
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://yoga-dashboard.vercel.app'}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ];
  }
}
