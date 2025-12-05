import { MetadataRoute } from "next";
import { baseUrl } from "@/utils/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/member/",
          "/login",
          "/setup-auth/",
          "/_next/",
          "/static/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/member/", "/login", "/setup-auth/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/member/", "/login", "/setup-auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
