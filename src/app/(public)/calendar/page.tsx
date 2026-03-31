import { Metadata } from 'next';
import { generateMetadata, pageConfigs, generateBreadcrumbStructuredData } from '@/utils/seo';
import CalendarClientPage from './CalendarClientPage';

export const metadata: Metadata = generateMetadata(pageConfigs.calendar);

export default function CalendarPage() {
  return (
    <>
      <CalendarClientPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbStructuredData([
              { name: 'Trang chủ', path: '/' },
              { name: 'Lịch học', path: '/calendar' },
            ]),
          ),
        }}
      />
    </>
  );
}
