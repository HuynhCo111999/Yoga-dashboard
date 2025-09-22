import { Metadata } from 'next';
import { generateMetadata, pageConfigs } from '@/utils/seo';
import PackagesClientPage from './PackagesClientPage';

export const metadata: Metadata = generateMetadata(pageConfigs.packages);

export default function PackagesPage() {
  return <PackagesClientPage />;
}
