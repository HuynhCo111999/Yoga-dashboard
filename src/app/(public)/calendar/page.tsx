import { Metadata } from 'next';
import { generateMetadata, pageConfigs } from '@/utils/seo';
import CalendarClientPage from './CalendarClientPage';

export const metadata: Metadata = generateMetadata(pageConfigs.calendar);

export default function CalendarPage() {
  return <CalendarClientPage />;
}
