'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if current route is private (admin, member) or login
  const isPrivateRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/member');
  const isLoginRoute = pathname === '/login';
  
  // Don't show Header/Footer for private routes and login page
  if (isPrivateRoute || isLoginRoute) {
    return <>{children}</>;
  }
  
  // Show Header/Footer for public routes
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
