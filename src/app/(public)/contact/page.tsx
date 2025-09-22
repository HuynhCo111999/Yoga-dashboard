import { Metadata } from 'next';
import { generateMetadata, pageConfigs } from '@/utils/seo';
import ContactClientPage from './ContactClientPage';

export const metadata: Metadata = generateMetadata(pageConfigs.contact);

export default function ContactPage() {
  return <ContactClientPage />;
}
