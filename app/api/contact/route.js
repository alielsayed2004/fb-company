import { NextResponse } from 'next/server';

// In-memory sliding window rate limiting (max 3 requests per IP per minute)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = rateLimitMap.get(ip) || [];

  const recent = timestamps.filter((time) => time > windowStart);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);

  // Periodic cleanup
  if (rateLimitMap.size > 1000) {
    for (const [key, times] of rateLimitMap.entries()) {
      const active = times.filter((t) => t > windowStart);
      if (active.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, active);
      }
    }
  }

  return false;
}

export async function POST(request) {
  try {
    // 1. Rate limiting check
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = (forwarded ? forwarded.split(',')[0].trim() : null) ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a minute before submitting again.' },
        { status: 429 }
      );
    }

    // 2. Validate required environment variables (no hardcoded fallbacks allowed)
    const googleSheetWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;

    if (!googleSheetWebhookUrl) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error: GOOGLE_SHEETS_WEBHOOK_URL is not set' },
        { status: 500 }
      );
    }

    if (!formspreeEndpoint) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error: FORMSPREE_ENDPOINT is not set' },
        { status: 500 }
      );
    }

    // 3. Parse request payload
    let body;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    } else {
      body = {};
    }

    const { name, email, phone, interest, message } = body;

    // 4. Send to Google Sheets Webhook
    try {
      await fetch(googleSheetWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
          name: name || '',
          email: email || '',
          phone: phone || '',
          interest: interest || '',
          message: message || '',
        }),
        redirect: 'follow'
      });
    } catch (err) {
      console.error('Error posting to Google Sheets Webhook:', err);
    }

    // 5. Send to Formspree endpoint
    try {
      await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, phone, interest, message }),
      });
    } catch (e) {
      console.error('Error posting to Formspree:', e);
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Contact submit error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
