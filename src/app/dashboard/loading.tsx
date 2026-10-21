'use client';

import React from 'react';
import FullScreenBufferLoader from '@/components/FullScreenBufferLoader';

export default function DashboardLoading() {
  return (
    <FullScreenBufferLoader
      text="Loading your dashboard..."
      subtext="Setting up your store workspace..."
    />
  );
}
