import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAdminToken, verifyAdminToken, COOKIE_NAME, TOKEN_EXPIRY_SECONDS } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { password } = body;

    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      return NextResponse.json(
        { success: false, error: 'Server auth misconfiguration: ADMIN_PASSWORD_HASH is not set' },
        { status: 500 }
      );
    }

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

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      adminSecret: process.env.ADMIN_API_SECRET || ''
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
    return NextResponse.json({
      authenticated: true,
      adminSecret: process.env.ADMIN_API_SECRET || ''
    });
  }

  return NextResponse.json({
    authenticated: false
  }, { status: 401 });
}
