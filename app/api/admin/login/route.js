import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAdminToken, verifyAdminToken, COOKIE_NAME, TOKEN_EXPIRY_SECONDS } from '@/lib/auth';

// Default bcrypt hash for '186204' ensuring production/Vercel works seamlessly out of the box
const DEFAULT_HASH = '$2b$10$.YUHw2xK5DIL29Mnf4N4peOZy9vyzxjsKbvFbw8wOoNZlE4K.8Iqi';
const DEFAULT_ADMIN_SECRET = 'fb_sec_7a50c7449a1e79c94c4dc7ac5ed0f48208b805f9eaab249d';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password } = body;

    const hash = process.env.ADMIN_PASSWORD_HASH || DEFAULT_HASH;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(password, hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = await signAdminToken({ role: 'admin' });
    const adminSecret = process.env.ADMIN_API_SECRET || DEFAULT_ADMIN_SECRET;

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      adminSecret
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: TOKEN_EXPIRY_SECONDS,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// GET: Check active session status
export async function GET(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const verified = await verifyAdminToken(token);

  if (verified) {
    const adminSecret = process.env.ADMIN_API_SECRET || DEFAULT_ADMIN_SECRET;
    return NextResponse.json({
      authenticated: true,
      adminSecret
    });
  }

  return NextResponse.json({
    authenticated: false
  }, { status: 401 });
}
