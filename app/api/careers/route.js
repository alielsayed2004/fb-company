import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// 5 applications per IP per 3 minutes.
const CAREERS_LIMIT = { limit: 5, windowMs: 3 * 60 * 1000 };

// Vercel rejects request bodies above 4.5 MB, so CVs are capped at 4 MB.
const MAX_CV_BYTES = 4 * 1024 * 1024;
const ALLOWED_CV_TYPES = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Errors carry a stable `code` so the page can show an Arabic or English message.
function fail(code, status, error) {
  return NextResponse.json({ success: false, code, error }, { status });
}

export async function POST(request) {
  const { limited, retryAfterSeconds } = rateLimit(`careers:${getClientIp(request)}`, CAREERS_LIMIT);
  if (limited) {
    return NextResponse.json(
      { success: false, code: 'rate_limited', error: 'Too many submissions. Please wait a few minutes before trying again.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  const webhookUrl = process.env.CAREERS_GOOGLE_SHEETS_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('Careers form: CAREERS_GOOGLE_SHEETS_WEBHOOK_URL / GOOGLE_SHEETS_WEBHOOK_URL is not set.');
    return fail('delivery_failed', 503, 'Applications cannot be received right now.');
  }

  let formData;
  try {
    formData = await request.formData();
  } catch (e) {
    return fail('invalid_request', 400, 'Invalid form submission.');
  }

  const field = (name, max = 200) => (formData.get(name) || '').toString().trim().slice(0, max);
  const fullName = field('fullName');
  const email = field('email');
  const phone = field('phone', 40);
  const department = field('department', 60);
  const experience = field('experience', 100);
  const startDate = field('startDate', 40);
  const expectedSalary = field('expectedSalary', 60);
  const consent = formData.get('consent');
  const cvFile = formData.get('cvFile');

  // Honeypot: real users never fill this hidden field.
  if (field('_gotcha')) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  if (!fullName || !email || !phone || !department) {
    return fail('missing_fields', 400, 'Missing required fields (Full Name, Email, Phone, Department).');
  }
  if (!EMAIL_RE.test(email)) {
    return fail('invalid_email', 400, 'Please enter a valid email address.');
  }
  if (!consent || consent === 'false') {
    return fail('consent_required', 400, 'Consent to use data for recruitment purposes is required.');
  }

  let cvFileName = '';
  let cvFileBase64 = '';
  let cvFileMimeType = '';

  if (cvFile && typeof cvFile === 'object' && typeof cvFile.arrayBuffer === 'function' && cvFile.size > 0) {
    if (cvFile.size > MAX_CV_BYTES) {
      return fail('file_too_large', 413, 'File size exceeds the 4 MB limit.');
    }
    const originalName = (cvFile.name || 'cv.pdf').slice(0, 150);
    const ext = (originalName.match(/\.[a-z0-9]+$/i) || [''])[0].toLowerCase();
    if (!ALLOWED_CV_TYPES[ext]) {
      return fail('file_type', 400, 'Only PDF, DOC or DOCX files are accepted.');
    }
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    cvFileName = originalName.replace(/[^\p{L}\p{N}._ -]/gu, '_');
    cvFileMimeType = ALLOWED_CV_TYPES[ext];
    cvFileBase64 = buffer.toString('base64');
  }

  // CVs are stored only in the private Google Drive folder via the Apps Script webhook.
  // Nothing is written to the website's filesystem.
  try {
    const payload = {
      type: 'hiring_application',
      timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
      fullName,
      email,
      phone,
      department,
      experience: experience || 'N/A',
      startDate: startDate || 'N/A',
      expectedSalary: expectedSalary || 'N/A',
      consent: 'Agreed / موافق',
      cvFileName,
      cvFileBase64,
      cvFileMimeType,
      ...(process.env.CAREERS_WEBHOOK_SECRET ? { secret: process.env.CAREERS_WEBHOOK_SECRET } : {}),
    };

    const sheetResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: AbortSignal.timeout(20000),
    });

    // Apps Script answers 200 even for script errors, so also check its JSON status.
    let scriptStatus = null;
    try {
      scriptStatus = (await sheetResponse.json())?.status || null;
    } catch {}

    if (!sheetResponse.ok || (scriptStatus && scriptStatus !== 'success')) {
      console.error(`Careers form delivery failed: HTTP ${sheetResponse.status}, script status ${scriptStatus}`);
      return fail('delivery_failed', 502, 'Your application could not be delivered. Please try again or email us.');
    }
  } catch (err) {
    console.error('Careers form delivery error:', err.message);
    return fail('delivery_failed', 502, 'Your application could not be delivered. Please try again or email us.');
  }

  return NextResponse.json({ success: true, message: 'Application submitted successfully' }, { status: 200 });
}
