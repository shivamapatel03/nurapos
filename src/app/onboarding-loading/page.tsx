'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FullScreenBufferLoader from '@/components/FullScreenBufferLoader';

export default function OnboardingLoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 2200);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <FullScreenBufferLoader
      text="Loading your dashboard..."
      subtext="Setting up your store workspace..."
    />
  );
}
