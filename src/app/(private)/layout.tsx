'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Mock authentication - trong thực tế sẽ dùng auth service thật
const mockAuth = {
  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  },
  getUserRole: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userRole') || 'member';
    }
    return 'member';
  },
  login: (role: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', role);
    }
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
    }
  }
};

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = mockAuth.isAuthenticated();
      const userRole = mockAuth.getUserRole();
      
      if (!authenticated) {
        // Redirect to login page
        router.push('/login');
        return;
      }

      // Check role-based access
      if (pathname?.startsWith('/admin') && userRole !== 'admin') {
        // Redirect to member dashboard if not admin
        router.push('/member');
        return;
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
