import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';

const JWT_SECRET_STRING = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_API_SECRET || 'fb-admin-secure-jwt-secret-string-min32chars';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export const COOKIE_NAME = 'admin_token';
export const TOKEN_EXPIRY_SECONDS = 12 * 60 * 60; // 12 hours

export async function signAdminToken(payload = {}) {
  return await new SignJWT({ admin: true, ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXPIRY_SECONDS}s`)
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload && payload.admin === true) {
      return payload;
    }
    return null;
  } catch (err) {
    return null;
  }
}
