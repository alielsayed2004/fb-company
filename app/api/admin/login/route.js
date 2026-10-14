import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {
  signAdminToken,
  verifyAdminToken,
  isAdminAuthConfigured,
  getPasswordHash,
  isSameOrigin,
  sessionCookieOptions,
  COOKIE_NAME,
} from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// 5 attempts per IP per 15 minutes; failed attempts also add a short delay.
const LOGIN_LIMIT = { limit: 5, windowMs: 15 * 60 * 1000 };

export async function POST(request) {
  // Fail closed: without the env configuration nobody can log in.
  if (!isAdminAuthConfigured()) {
    console.error('Admin login disabled: set ADMIN_PASSWORD_HASH_B64 (or a valid ADMIN_PASSWORD_HASH) and ADMIN_JWT_SECRET (min 32 chars).');
    return NextResponse.json(
      { success: false, error: 'Admin login is not configured.' },
      { status: 503 }
    );
  }

  if (!isSameOrigin(request)) {
    return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
  }

  const ip = getClientIp(request);
  const { limited, retryAfterSeconds } = rateLimit(`login:${ip}`, LOGIN_LIMIT);
  if (limited) {
    return NextResponse.json(
      { success: false, error: 'Too many login attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { password } = body;

    if (!password || typeof password !== 'string' || password.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(password, getPasswordHash());
    if (!isValid) {
      await new Promise((r) => setTimeout(r, 750));
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = await signAdminToken({ role: 'admin' });
    const response = NextResponse.json({ success: true, message: 'Authenticated successfully' });
    response.cookies.set({ ...sessionCookieOptions(), value: token });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// GET: Check active session status (never returns any secret)
export async function GET(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const verified = await verifyAdminToken(token);
  if (verified) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
