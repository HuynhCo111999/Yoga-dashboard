import type { MetadataRoute } from "next";
import { baseUrl } from "@/utils/seo";
import { blogApi } from "@/lib/api/blog";

const staticRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.9 },
  { path: "/calendar", changeFrequency: "weekly", priority: 0.9 },
  { path: "/packages", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/setup-auth", changeFrequency: "yearly", priority: 0.4 },
  { path: "/login", changeFrequency: "yearly", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${baseUrl}${path}`,
      lastModified,
      changeFrequency,
      priority,
    })
  );

  // Blog post detail pages
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const postsResult = await blogApi.getPublishedPosts();
    const posts =
      postsResult.success && postsResult.data ? postsResult.data : [];

    blogEntries = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.publishedAt || lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    blogEntries = [];
  }

  return [...staticEntries, ...blogEntries];
}
