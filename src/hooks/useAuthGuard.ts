'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, clearAuthSession } from '@/lib/auth';
import { logoutUser } from '@/lib/api-client';

export function useAuthGuard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const checkAuth = useCallback(() => {
    if (typeof window === 'undefined') return;

    const authed = isAuthenticated();
    if (!authed) {
      setIsAuthorized(false);
      clearAuthSession();
      // Use replace to prevent back-button loops into dashboard
      window.location.replace('/signin');
    } else {
      setIsAuthorized(true);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Catch Back/Forward cache (bfcache) restoration
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted || !isAuthenticated()) {
        checkAuth();
      }
    };

    // Catch browser back / forward navigation
    const handlePopState = () => {
      if (!isAuthenticated()) {
        checkAuth();
      }
    };

    // Cross-tab logout listener
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === 'nurapos_access_token' ||
        e.key === 'nurapos_auth_session' ||
        e.key === null
      ) {
        checkAuth();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuth]);

  // Robust logout handler
  const handleLogout = useCallback(async () => {
    setIsAuthorized(false);
    try {
      await logoutUser();
    } catch (err) {
      console.error('[AuthGuard] Logout API error:', err);
    } finally {
      clearAuthSession();
      if (typeof window !== 'undefined') {
        window.location.replace('/signin');
      }
    }
  }, []);

  return { isAuthorized, handleLogout };
}
