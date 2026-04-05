import { Metadata } from 'next';
import {
  generateMetadata,
  pageConfigs,
  generateBreadcrumbStructuredData,
  generateYogaSessionsEventsStructuredData,
} from '@/utils/seo';
import type { Session } from '@/lib/api/types';
import { sessionsApi } from '@/lib/api';
import CalendarClientPage from './CalendarClientPage';

export const metadata: Metadata = generateMetadata(pageConfigs.calendar);

export default async function CalendarPage() {
  const today = new Date().toISOString().split('T')[0];
  const rangeEnd = new Date();
  rangeEnd.setMonth(rangeEnd.getMonth() + 3);
  const endStr = rangeEnd.toISOString().split('T')[0];

  let sessions: Session[] = [];

  try {
    const result = await sessionsApi.getSessionsByDateRange(today, endStr);
    if (result.success && result.data) {
      sessions = result.data;
    }
  } catch {
    sessions = [];
  }

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateYogaSessionsEventsStructuredData(sessions),
          ),
        }}
      />
    </>
  );
}
