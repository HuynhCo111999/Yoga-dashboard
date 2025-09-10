'use client';

import dynamic from 'next/dynamic';

const SetupAuthPageContent = dynamic(() => import('@/components/SetupAuthPageContent'), { ssr: false });

export default SetupAuthPageContent;
