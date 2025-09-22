import { Metadata } from 'next';
import { generateMetadata, pageConfigs } from '@/utils/seo';
import StructuredData from '@/components/StructuredData';
import BlogClientPage from './BlogClientPage';

export const metadata: Metadata = generateMetadata(pageConfigs.blog);

export default function BlogPage() {
  return (
    <>
      <BlogClientPage />
      <StructuredData type="blog" />
    </>
  );
}
