import { Metadata } from "next";
import type { Package, Session } from "@/lib/api/types";

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://yogacungyen.com";
const siteName = "Yên Yoga";
const defaultDescription =
  "Khám phá hành trình yoga tại Yên Yoga với đội ngũ giảng viên chuyên nghiệp, lớp học đa dạng và không gian thanh tịnh.";

function buildImageUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return `${baseUrl}/logo.jpeg`;
  // If already absolute URL (e.g. Firebase), return as is
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  // Otherwise treat as relative path on this site
  return `${baseUrl}${pathOrUrl}`;
}

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
          url: buildImageUrl(ogImage),
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
      images: [buildImageUrl(ogImage)],
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
    title: "Yoga 1 kèm 1 tại TP.HCM (HCM) | Yên Yoga",
    description:
      "Yoga 1 kèm 1 tại HCM cùng huấn luyện viên riêng, lộ trình cá nhân hóa theo thể trạng. Phù hợp người mới, phục hồi và giảm stress.",
    keywords: [
      "yoga 1 kèm 1",
      "yoga 1-1",
      "yoga kèm riêng",
      "yoga cá nhân",
      "yoga PT",
      "yoga tại HCM",
      "yoga TP.HCM",
      "yoga Bình Thạnh",
      "yoga studio",
      "khóa học yoga",
      "lớp yoga",
      "khóa học yoga Yên Yoga",
      "Yên Yoga",
      "đăng ký khóa học yoga",
      "giảng viên yoga chuyên nghiệp",
    ],
    canonical: "/",
    ogImage: "/class-studio.jpeg",
  },

  about: {
    title: "Về chúng tôi - Câu chuyện Yên Yoga",
    description:
      "Tìm hiểu về sứ mệnh, tầm nhìn và đội ngũ giảng viên chuyên nghiệp tại Yên Yoga. Hành trình mang yoga đến với mọi người.",
    keywords: ["về yên yoga", "đội ngũ giảng viên", "triết lý yoga", "sứ mệnh"],
    canonical: "/about",
  },

  blog: {
    title: "Blog Yoga - Kiến thức & Chia sẻ",
    description:
      "Khám phá những bài viết hữu ích về yoga, thiền, sức khỏe và lối sống cân bằng từ các chuyên gia tại Yên Yoga.",
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
      "Xem lịch học yoga chi tiết và đặt lớp học trực tuyến tại Yên Yoga. Các lớp Hatha, Vinyasa, Yin Yoga và nhiều hơn nữa.",
    keywords: ["lịch học yoga", "đặt lớp yoga", "lịch yoga", "đăng ký lớp học"],
    canonical: "/calendar",
  },

  packages: {
    title: "Gói tập Yoga - Ưu đãi hấp dẫn",
    description:
      "Khám phá các gói tập yoga với mức giá ưu đãi tại Yên Yoga. Từ gói cơ bản đến gói không giới hạn, phù hợp với mọi nhu cầu.",
    keywords: ["gói yoga", "giá yoga", "ưu đãi yoga", "membership yoga"],
    canonical: "/packages",
  },

  contact: {
    title: "Liên hệ - Yên Yoga",
    description:
      "Liên hệ với Yên Yoga để được tư vấn về lớp học, gói tập và dịch vụ. Địa chỉ, số điện thoại và form liên hệ trực tuyến.",
    keywords: ["liên hệ yoga", "địa chỉ yoga studio", "tư vấn yoga"],
    canonical: "/contact",
  },
};

/** ISO-8601 datetime in Vietnam (UTC+7) from YYYY-MM-DD and HH:MM */
function toVietnamDateTimeIso(dateStr: string, timeStr: string): string {
  const [h, m] = timeStr.split(":").map((x) => parseInt(x, 10));
  const hh = String(Number.isFinite(h) ? h : 0).padStart(2, "0");
  const mm = String(Number.isFinite(m) ? m : 0).padStart(2, "0");
  return `${dateStr}T${hh}:${mm}:00+07:00`;
}

const studioPostalAddress = {
  "@type": "PostalAddress" as const,
  streetAddress: "Bình Thạnh",
  addressLocality: "Thành phố Hồ Chí Minh",
  addressRegion: "HCM",
  postalCode: "700000",
  addressCountry: "VN",
};

// Generate structured data for blog posts (BlogPosting + Article for richer coverage)
export function generateBlogPostStructuredData(post: {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  featuredImage?: string;
  slug: string;
}) {
  const pageUrl = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.featuredImage
    ? buildImageUrl(post.featuredImage)
    : `${baseUrl}/logo.jpeg`;

  return {
    "@context": "https://schema.org",
    "@type": ["BlogPosting", "Article"],
    headline: post.title,
    description: post.description,
    image: imageUrl,
    url: pageUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
    },
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
  };
}

/** ItemList of Product — gói tập / membership */
export function generatePackagesProductStructuredData(packages: Package[]) {
  const defaultImage = `${baseUrl}/logo.jpeg`;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Gói tập ${siteName}`,
    description: `Các gói tập yoga và membership tại ${siteName}.`,
    numberOfItems: packages.length,
    itemListElement: packages.map((pkg, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: pkg.name,
        description: pkg.description,
        sku: pkg.id,
        image: [defaultImage],
        brand: {
          "@type": "Brand",
          name: siteName,
        },
        category: "Yoga class package",
        offers: {
          "@type": "Offer",
          url: `${baseUrl}/packages`,
          priceCurrency: "VND",
          price: String(pkg.price),
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: siteName,
            url: baseUrl,
          },
        },
      },
    })),
  };
}

/** Upcoming yoga sessions as Event items (lịch học) */
export function generateYogaSessionsEventsStructuredData(
  sessions: Session[],
  options?: { maxItems?: number },
) {
  const maxItems = options?.maxItems ?? 48;
  const today = new Date().toISOString().split("T")[0];

  const upcoming = sessions
    .filter(
      (s) =>
        s.status === "scheduled" &&
        s.date >= today &&
        s.className &&
        s.startTime &&
        s.endTime,
    )
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    })
    .slice(0, maxItems);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Lịch học yoga — ${siteName}`,
    description: `Các buổi tập yoga sắp diễn ra tại ${siteName}.`,
    numberOfItems: upcoming.length,
    itemListElement: upcoming.map((session, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: session.className,
        description: `Buổi tập ${session.className} với ${session.instructor} tại ${siteName}.`,
        startDate: toVietnamDateTimeIso(session.date, session.startTime),
        endDate: toVietnamDateTimeIso(session.date, session.endTime),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "SportsActivityLocation",
          name: siteName,
          url: baseUrl,
          address: studioPostalAddress,
        },
        organizer: {
          "@type": "Organization",
          name: siteName,
          url: baseUrl,
        },
        performer: {
          "@type": "Person",
          name: session.instructor,
        },
        image: [`${baseUrl}/class-studio.jpeg`],
      },
    })),
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
  faqs: Array<{ question: string; answer: string }>,
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

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };
}
