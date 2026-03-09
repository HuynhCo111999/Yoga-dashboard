import { NextResponse } from 'next/server';
import { blogApi } from '@/lib/api/blog';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1 giờ

const SITE_URL = 'https://yenyoga.vn';

export async function GET() {
  const result = await blogApi.getPublishedPosts();

  const posts = result.success && result.data ? result.data : [];

  const itemsXml = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date(post.createdAt).toUTCString();

      const title = escapeXml(post.title);
      const description = escapeXml(post.metaDescription || post.excerpt || '');
      const author = escapeXml(post.author || 'Yên Yoga');

      return `
      <item>
        <title>${title}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <description>${description}</description>
        <author>${author}</author>
        <pubDate>${pubDate}</pubDate>
      </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>Yên Yoga Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Các bài viết từ Yên Yoga Studio</description>
    <language>vi-VN</language>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

