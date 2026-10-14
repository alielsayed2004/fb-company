import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';

// All admin secrets come from environment variables only. There are no fallbacks:
// if a variable is missing, authentication fails closed (nobody gets in).
export const COOKIE_NAME = 'admin_token';
export const TOKEN_EXPIRY_SECONDS = 12 * 60 * 60; // 12 hours

const MIN_SECRET_LENGTH = 32;

function getJwtSecret() {
  const value = process.env.ADMIN_JWT_SECRET;
  if (!value || value.length < MIN_SECRET_LENGTH) return null;
  return new TextEncoder().encode(value);
}

const BCRYPT_HASH = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

// Next.js expands "$..." inside environment values, which corrupts a raw bcrypt hash ("$2b$10$...").
// Store the hash base64-encoded in ADMIN_PASSWORD_HASH_B64 (no "$" characters) to avoid that.
// A raw ADMIN_PASSWORD_HASH is still accepted when it survives intact.
export function getPasswordHash() {
  const b64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (b64) {
    try {
      const decoded = Buffer.from(b64.trim(), 'base64').toString('utf8').trim();
      if (BCRYPT_HASH.test(decoded)) return decoded;
    } catch {}
    console.error('ADMIN_PASSWORD_HASH_B64 is set but does not decode to a valid bcrypt hash.');
    return null;
  }
  const raw = (process.env.ADMIN_PASSWORD_HASH || '').trim();
  if (BCRYPT_HASH.test(raw)) return raw;
  if (raw) console.error('ADMIN_PASSWORD_HASH is not a valid bcrypt hash (likely corrupted by "$" expansion). Use ADMIN_PASSWORD_HASH_B64.');
  return null;
}

// True when every variable needed for admin login is present and valid.
export function isAdminAuthConfigured() {
  return Boolean(getJwtSecret() && getPasswordHash());
}

export async function signAdminToken(payload = {}) {
  const secret = getJwtSecret();
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is not configured');
  }
  return await new SignJWT({ admin: true, ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXPIRY_SECONDS}s`)
    .sign(secret);
}

export async function verifyAdminToken(token) {
  const secret = getJwtSecret();
  if (!token || !secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
    if (payload && payload.admin === true) {
      return payload;
    }
    return null;
  } catch (err) {
    return null;
  }
}

// Constant-time string comparison for the server-to-server secret.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Server-to-server access (scripts, CI). Never sent to or stored in a browser.
export function hasValidServerSecret(request) {
  const expected = process.env.ADMIN_API_SECRET;
  if (!expected || expected.length < MIN_SECRET_LENGTH) return false;
  return safeEqual(request.headers.get('x-admin-secret') || '', expected);
}

// Browsers may only change data from our own origin (CSRF protection on top of SameSite=Strict).
export function isSameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return true; // same-origin GET/HEAD requests and non-browser clients send no Origin
  try {
    return new URL(origin).host === request.headers.get('host');
  } catch {
    return false;
  }
}

// Admin request = valid session cookie from our own origin, or a valid server-to-server secret.
export async function isAdminRequest(request) {
  if (hasValidServerSecret(request)) return true;
  if (!isSameOrigin(request)) return false;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const verified = await verifyAdminToken(token);
  return Boolean(verified && verified.admin === true);
}

export function sessionCookieOptions(maxAge = TOKEN_EXPIRY_SECONDS) {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge,
  };
}
