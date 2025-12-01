import { Metadata } from "next";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://yoga-dashboard-two.vercel.app";
const siteName = "Yên Yoga Studio";
const defaultDescription =
  "Khám phá hành trình yoga tại Yên Yoga Studio với đội ngũ giảng viên chuyên nghiệp, lớp học đa dạng và không gian thanh tịnh.";

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description = defaultDescription,
    keywords = [],
    canonical,
    ogImage = "/logo.jpeg",
    noIndex = false,
  } = config;

  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const url = canonical ? `${baseUrl}${canonical}` : baseUrl;

  return {
    title: fullTitle,
    description,
    keywords: [
      "yoga",
      "yoga studio",
      "hatha yoga",
      "vinyasa yoga",
      "meditation",
      "thiền",
      "tập yoga",
      "yoga việt nam",
      "yoga hcm",
      "yoga sài gòn",
      ...keywords,
    ],
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url,
      siteName,
      title: fullTitle,
      description,
      images: [
        {
          url: `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [`${baseUrl}${ogImage}`],
      creator: "@yenyogastudio",
      site: "@yenyogastudio",
    },
    alternates: {
      canonical: url,
      languages: {
        "vi-VN": url,
      },
    },
  };
}

// Page-specific SEO configurations
export const pageConfigs = {
  home: {
    title: "Yên Yoga Studio - Không gian yoga thanh tịnh",
    description:
      "Khám phá hành trình yoga tại Yên Yoga Studio với đội ngũ giảng viên chuyên nghiệp, lớp học đa dạng và không gian thanh tịnh. Đăng ký lớp học ngay hôm nay!",
    keywords: [
      "yoga studio",
      "lớp yoga",
      "đăng ký yoga",
      "giảng viên yoga chuyên nghiệp",
    ],
    canonical: "/",
    ogImage: "/class-studio.jpeg",
  },

  about: {
    title: "Về chúng tôi - Câu chuyện Yên Yoga Studio",
    description:
      "Tìm hiểu về sứ mệnh, tầm nhìn và đội ngũ giảng viên chuyên nghiệp tại Yên Yoga Studio. Hành trình mang yoga đến với mọi người.",
    keywords: ["về yên yoga", "đội ngũ giảng viên", "triết lý yoga", "sứ mệnh"],
    canonical: "/about",
  },

  blog: {
    title: "Blog Yoga - Kiến thức & Chia sẻ",
    description:
      "Khám phá những bài viết hữu ích về yoga, thiền, sức khỏe và lối sống cân bằng từ các chuyên gia tại Yên Yoga Studio.",
    keywords: [
      "blog yoga",
      "kiến thức yoga",
      "thiền định",
      "sức khỏe",
      "lối sống cân bằng",
    ],
    canonical: "/blog",
  },

  calendar: {
    title: "Lịch học Yoga - Đặt lớp trực tuyến",
    description:
      "Xem lịch học yoga chi tiết và đặt lớp học trực tuyến tại Yên Yoga Studio. Các lớp Hatha, Vinyasa, Yin Yoga và nhiều hơn nữa.",
    keywords: ["lịch học yoga", "đặt lớp yoga", "lịch yoga", "đăng ký lớp học"],
    canonical: "/calendar",
  },

  packages: {
    title: "Gói tập Yoga - Ưu đãi hấp dẫn",
    description:
      "Khám phá các gói tập yoga với mức giá ưu đãi tại Yên Yoga Studio. Từ gói cơ bản đến gói không giới hạn, phù hợp với mọi nhu cầu.",
    keywords: ["gói yoga", "giá yoga", "ưu đãi yoga", "membership yoga"],
    canonical: "/packages",
  },

  contact: {
    title: "Liên hệ - Yên Yoga Studio",
    description:
      "Liên hệ với Yên Yoga Studio để được tư vấn về lớp học, gói tập và dịch vụ. Địa chỉ, số điện thoại và form liên hệ trực tuyến.",
    keywords: ["liên hệ yoga", "địa chỉ yoga studio", "tư vấn yoga"],
    canonical: "/contact",
  },
};

// Generate structured data for blog posts
export function generateBlogPostStructuredData(post: {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  featuredImage?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.featuredImage
      ? `${baseUrl}${post.featuredImage}`
      : `${baseUrl}/logo.jpeg`,
    author: {
      "@type": "Person",
      name: post.author,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.jpeg`,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
  };
}

// Generate structured data for service pages
export function generateServiceStructuredData(service: {
  name: string;
  description: string;
  price?: string;
  duration?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: siteName,
      url: baseUrl,
    },
    areaServed: {
      "@type": "City",
      name: "Ho Chi Minh City",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Yoga Classes",
      itemListElement: {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
        },
        price: service.price,
        priceCurrency: "VND",
      },
    },
  };
}

// Generate FAQ structured data
export function generateFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
