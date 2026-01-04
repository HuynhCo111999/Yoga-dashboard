'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logger } from '@/lib/logger';

interface PageLoggerProps {
  pageName: string;
  pageData?: Record<string, any>;
}

/**
 * Client component to log page views and track user interactions
 * Use this in server components to add logging without converting them to client components
 */
export default function PageLogger({ pageName, pageData = {} }: PageLoggerProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Log page view
    logger.info(`Page viewed: ${pageName}`, {
      page: pageName,
      path: pathname,
      ...pageData,
    });

    // Track as Sentry event
    logger.event('Page View', {
      page: pageName,
      path: pathname,
      ...pageData,
    });

    // Log breadcrumb for navigation tracking
    console.log(`[PAGE] User navigated to ${pageName} (${pathname})`);
  }, [pageName, pathname, pageData]);

  return null; // This component doesn't render anything
}

