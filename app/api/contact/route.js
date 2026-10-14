import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// 3 messages per IP per minute.
const CONTACT_LIMIT = { limit: 3, windowMs: 60 * 1000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INTERESTS = new Set(['consultation', 'asset-management', 'franchise-sourcing', 'other']);

// Errors carry a stable `code` so the page can show an Arabic or English message.
function fail(code, status, error) {
  return NextResponse.json({ success: false, code, error }, { status });
}

// Sends one copy of the lead; resolves to { ok, detail } and never throws.
async function deliver(name, url, init) {
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(10000) });
    return { name, ok: res.ok, detail: `HTTP ${res.status}` };
  } catch (err) {
    return { name, ok: false, detail: err.message };
  }
}

export async function POST(request) {
  const { limited, retryAfterSeconds } = rateLimit(`contact:${getClientIp(request)}`, CONTACT_LIMIT);
  if (limited) {
    return NextResponse.json(
      { success: false, code: 'rate_limited', error: 'Too many requests. Please wait a minute before submitting again.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  let body = {};
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
      body = Object.fromEntries((await request.formData()).entries());
    }
  } catch (e) {
    return fail('invalid_request', 400, 'Invalid form submission.');
  }

  const field = (key, max) => (typeof body[key] === 'string' ? body[key].trim().slice(0, max) : '');
  const name = field('name', 120);
  const email = field('email', 200);
  const phone = field('phone', 40);
  const message = field('message', 5000);
  const interest = INTERESTS.has(field('interest', 40)) ? field('interest', 40) : 'other';

  // Honeypot: real users never fill this hidden field.
  if (field('_gotcha', 200)) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  if (!name || !email || !phone || !message) {
    return fail('missing_fields', 400, 'Please fill in all required fields.');
  }
  if (!EMAIL_RE.test(email)) {
    return fail('invalid_email', 400, 'Please enter a valid email address.');
  }

  const sheetsUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const formspreeUrl = process.env.FORMSPREE_ENDPOINT;
  const lead = { name, email, phone, interest, message };

  const deliveries = [];
  if (sheetsUrl) {
    deliveries.push(deliver('google_sheets', sheetsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }), ...lead }),
      redirect: 'follow',
    }));
  }
  if (formspreeUrl) {
    deliveries.push(deliver('formspree', formspreeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...lead, _replyto: email, _subject: `fbassets.com — ${interest}` }),
    }));
  }

  const results = await Promise.all(deliveries);
  const delivered = results.filter((r) => r.ok);

  for (const r of results.filter((x) => !x.ok)) {
    console.error(`Contact lead delivery failed via ${r.name}: ${r.detail}`);
  }

  // Report success only when at least one destination actually accepted the lead.
  if (delivered.length === 0) {
    console.error(
      `CONTACT LEAD NOT DELIVERED (${results.length ? results.map((r) => `${r.name}: ${r.detail}`).join('; ') : 'no destinations configured'}). ` +
      `Interest: ${interest}, submitted ${new Date().toISOString()}`
    );
    return fail('delivery_failed', 502, 'Your message could not be delivered. Please call or email us directly.');
  }

  return NextResponse.json({ success: true, message: 'Message sent successfully' }, { status: 200 });
}
