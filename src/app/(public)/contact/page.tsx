import { Metadata } from 'next';
import { generateMetadata, pageConfigs, generateBreadcrumbStructuredData } from '@/utils/seo';
import ContactClientPage from './ContactClientPage';

export const metadata: Metadata = generateMetadata(pageConfigs.contact);

export default function ContactPage() {
  return (
    <>
      <ContactClientPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: 'Trang chủ', path: '/' },
              { name: 'Liên hệ', path: '/contact' },
            ]),
          ),
        }}
      />
    </>
  );
}
