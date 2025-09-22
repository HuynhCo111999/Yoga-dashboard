'use client';

interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  logo: string;
  image: string[];
  address: {
    '@type': string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: string;
  };
  contactPoint: {
    '@type': string;
    telephone: string;
    contactType: string;
    availableLanguage: string[];
  };
  sameAs: string[];
  hasOfferCatalog: {
    '@type': string;
    name: string;
    itemListElement: Array<{
      '@type': string;
      name: string;
      description: string;
    }>;
  };
}

interface LocalBusinessSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  telephone: string;
  address: {
    '@type': string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    '@type': string;
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: Array<{
    '@type': string;
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  priceRange: string;
  servedCuisine?: string;
  paymentAccepted: string[];
  image: string[];
  logo: string;
}

interface WebsiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  potentialAction: {
    '@type': string;
    target: {
      '@type': string;
      urlTemplate: string;
    };
    'query-input': string;
  };
}

interface BlogSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  publisher: {
    '@type': string;
    name: string;
    logo: {
      '@type': string;
      url: string;
    };
  };
}

interface StructuredDataProps {
  type: 'organization' | 'localBusiness' | 'website' | 'blog';
}

export default function StructuredData({ type }: StructuredDataProps) {
  const getSchema = () => {
    const baseUrl = 'https://yen-yoga.vercel.app';
    
    switch (type) {
      case 'organization':
        const organizationSchema: OrganizationSchema = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Yên Yoga Studio',
          description: 'Studio yoga chuyên nghiệp tại Việt Nam, cung cấp các lớp học yoga đa dạng cho mọi trình độ',
          url: baseUrl,
          logo: `${baseUrl}/logo.jpeg`,
          image: [
            `${baseUrl}/logo.jpeg`,
            `${baseUrl}/class-studio.jpeg`
          ],
          address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Đường Yoga',
            addressLocality: 'Quận 1',
            addressRegion: 'TP. Hồ Chí Minh',
            addressCountry: 'VN'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+84-xxx-xxx-xxx',
            contactType: 'customer service',
            availableLanguage: ['Vietnamese', 'English']
          },
          sameAs: [
            'https://facebook.com/yenyogastudio',
            'https://instagram.com/yenyogastudio',
            'https://youtube.com/yenyogastudio'
          ],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Yoga Classes',
            itemListElement: [
              {
                '@type': 'Offer',
                name: 'Hatha Yoga',
                description: 'Lớp yoga cơ bản phù hợp cho người mới bắt đầu'
              },
              {
                '@type': 'Offer',
                name: 'Vinyasa Flow',
                description: 'Lớp yoga năng động với sự chuyển động liên tục'
              },
              {
                '@type': 'Offer',
                name: 'Yin Yoga',
                description: 'Lớp yoga thư giãn với các tư thế giữ lâu'
              }
            ]
          }
        };
        return organizationSchema;

      case 'localBusiness':
        const localBusinessSchema: LocalBusinessSchema = {
          '@context': 'https://schema.org',
          '@type': 'SportsActivityLocation',
          name: 'Yên Yoga Studio',
          description: 'Studio yoga chuyên nghiệp với không gian thanh tịnh và đội ngũ giảng viên có kinh nghiệm',
          url: baseUrl,
          telephone: '+84-xxx-xxx-xxx',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Đường Yoga',
            addressLocality: 'Quận 1',
            addressRegion: 'TP. Hồ Chí Minh',
            postalCode: '700000',
            addressCountry: 'VN'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 10.762622,
            longitude: 106.660172
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '06:00',
              closes: '21:00'
            },
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Saturday', 'Sunday'],
              opens: '07:00',
              closes: '20:00'
            }
          ],
          priceRange: '$$',
          paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer'],
          image: [
            `${baseUrl}/logo.jpeg`,
            `${baseUrl}/class-studio.jpeg`
          ],
          logo: `${baseUrl}/logo.jpeg`
        };
        return localBusinessSchema;

      case 'website':
        const websiteSchema: WebsiteSchema = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Yên Yoga Studio',
          description: 'Website chính thức của Yên Yoga Studio',
          url: baseUrl,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${baseUrl}/blog?search={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        };
        return websiteSchema;

      case 'blog':
        const blogSchema: BlogSchema = {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Yên Yoga Blog',
          description: 'Blog về yoga, sức khỏe và lối sống cân bằng',
          url: `${baseUrl}/blog`,
          publisher: {
            '@type': 'Organization',
            name: 'Yên Yoga Studio',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.jpeg`
            }
          }
        };
        return blogSchema;

      default:
        return null;
    }
  };

  const schema = getSchema();
  
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
