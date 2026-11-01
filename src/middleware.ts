import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/admin',
  '/admin-dashboard',
  '/manager',
  '/manager-dashboard',
  '/pos',
  '/pos-main',
  '/pos-register',
  '/pos-terminal',
  '/onboarding',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('nurapos_token')?.value;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(`${prefix}-`)
  );

  if (isProtected) {
    if (!token) {
      const signinUrl = new URL('/signin', request.url);
      const redirectResponse = NextResponse.redirect(signinUrl);

      // Force no-store headers so browser history cannot restore cached protected pages
      redirectResponse.headers.set(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
      );
      redirectResponse.headers.set('Pragma', 'no-cache');
      redirectResponse.headers.set('Expires', '0');
      return redirectResponse;
    }

    // Set cache control headers on protected routes to forbid browser caching
    const response = NextResponse.next();
    response.headers.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0'
    );
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard',
    '/admin/:path*',
    '/admin',
    '/admin-dashboard/:path*',
    '/admin-dashboard',
    '/manager/:path*',
    '/manager',
    '/manager-dashboard/:path*',
    '/manager-dashboard',
    '/pos/:path*',
    '/pos',
    '/pos-main/:path*',
    '/pos-main',
    '/pos-register/:path*',
    '/pos-register',
    '/pos-terminal/:path*',
    '/pos-terminal',
    '/onboarding/:path*',
    '/onboarding',
    '/onboarding-1/:path*',
    '/onboarding-1',
    '/onboarding-2/:path*',
    '/onboarding-2',
    '/onboarding-3/:path*',
    '/onboarding-3',
    '/onboarding-4/:path*',
    '/onboarding-4',
    '/onboarding-5/:path*',
    '/onboarding-5',
    '/onboarding-6/:path*',
    '/onboarding-6',
    '/onboarding-complete/:path*',
    '/onboarding-complete',
    '/onboarding-loading/:path*',
    '/onboarding-loading',
  ],
};
