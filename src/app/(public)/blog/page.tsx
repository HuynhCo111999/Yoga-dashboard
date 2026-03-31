import { Metadata } from 'next';
import { generateMetadata, pageConfigs, generateBreadcrumbStructuredData } from '@/utils/seo';
import StructuredData from '@/components/StructuredData';
import BlogClientPage from './BlogClientPage';

export const metadata: Metadata = generateMetadata(pageConfigs.blog);

export default function BlogPage() {
  return (
    <>
      <BlogClientPage />
      <StructuredData type="blog" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: 'Trang chủ', path: '/' },
              { name: 'Blog', path: '/blog' },
            ]),
          ),
        }}
      />
    </>
  );
}
