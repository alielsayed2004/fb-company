import { NextResponse } from 'next/server';
import { verifyAdminToken, COOKIE_NAME } from './lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Allow login API route unconditionally
  if (pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  // 2. Verify JWT token from HttpOnly cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const verified = await verifyAdminToken(token);
  const isAuthenticated = Boolean(verified && verified.admin === true);

  // 3. For API routes under /api/admin/*
  if (pathname.startsWith('/api/admin/')) {
    // Check if valid token OR valid x-admin-secret header
    const adminSecret = process.env.ADMIN_API_SECRET;
    const providedSecret = request.headers.get('x-admin-secret');
    const hasValidSecret = Boolean(adminSecret && providedSecret && providedSecret === adminSecret);

    if (isAuthenticated || hasValidSecret) {
      return NextResponse.next();
    }

    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required' },
      { status: 401 }
    );
  }

  // 4. For Admin Page routes (/admin and /admin/*)
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    // If user is accessing the login page:
    if (pathname === '/admin/login') {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // Unauthenticated requests to /admin are redirected to /admin/login
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
