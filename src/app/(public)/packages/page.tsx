import { Metadata } from 'next';
import { generateMetadata, pageConfigs, generateBreadcrumbStructuredData } from '@/utils/seo';
import PackagesClientPage from './PackagesClientPage';

export const metadata: Metadata = generateMetadata(pageConfigs.packages);

export default function PackagesPage() {
  return (
    <>
      <PackagesClientPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: 'Trang chủ', path: '/' },
              { name: 'Gói tập', path: '/packages' },
            ]),
          ),
        }}
      />
    </>
  );
}
