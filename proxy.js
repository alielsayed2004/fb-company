import { NextResponse } from 'next/server';
import { isAdminRequest, verifyAdminToken, COOKIE_NAME } from './lib/auth';

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Login endpoint handles its own checks (config, origin, rate limit).
  if (pathname === '/api/admin/login' || pathname === '/api/admin/logout') {
    return NextResponse.next();
  }

  // Admin API: session cookie (same origin) or server-to-server secret. Fails closed.
  if (pathname.startsWith('/api/admin/')) {
    if (await isAdminRequest(request)) {
      return NextResponse.next();
    }
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required' },
      { status: 401 }
    );
  }

  // Admin pages: browser session only.
  const verified = await verifyAdminToken(request.cookies.get(COOKIE_NAME)?.value);
  const isAuthenticated = Boolean(verified && verified.admin === true);

  if (pathname === '/admin/login') {
    return isAuthenticated
      ? NextResponse.redirect(new URL('/admin', request.url))
      : NextResponse.next();
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
