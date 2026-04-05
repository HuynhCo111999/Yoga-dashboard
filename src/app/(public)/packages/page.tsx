import { Metadata } from 'next';
import {
  generateMetadata,
  pageConfigs,
  generateBreadcrumbStructuredData,
  generatePackagesProductStructuredData,
} from '@/utils/seo';
import type { Package } from '@/lib/api/types';
import { packagesApi } from '@/lib/api';
import PackagesClientPage from './PackagesClientPage';

export const metadata: Metadata = generateMetadata(pageConfigs.packages);

export default async function PackagesPage() {
  let packages: Package[] = [];

  try {
    const result = await packagesApi.getActivePackages();
    if (result.success && result.data) {
      packages = result.data;
    }
  } catch {
    packages = [];
  }

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generatePackagesProductStructuredData(packages)),
        }}
      />
    </>
  );
}
