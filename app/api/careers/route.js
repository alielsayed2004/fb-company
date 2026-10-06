import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// In-memory sliding window rate limiting (max 5 requests per IP per 3 minutes)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 3 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

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
    // 1. Rate Limiting Check
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = (forwarded ? forwarded.split(',')[0].trim() : null) ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many submissions. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    // 2. Parse Multipart Form Data
    const formData = await request.formData();
    const fullName = (formData.get('fullName') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const phone = (formData.get('phone') || '').toString().trim();
    const department = (formData.get('department') || '').toString().trim();
    const experience = (formData.get('experience') || '').toString().trim();
    const startDate = (formData.get('startDate') || '').toString().trim();
    const expectedSalary = (formData.get('expectedSalary') || '').toString().trim();
    const consent = formData.get('consent');
    const cvFile = formData.get('cvFile');

    // 3. Validation
    if (!fullName || !email || !phone || !department) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields (Full Name, Email, Phone, Department)' },
        { status: 400 }
      );
    }

    if (!consent || consent === 'false') {
      return NextResponse.json(
        { success: false, error: 'Consent to use data for recruitment purposes is required' },
        { status: 400 }
      );
    }

    // 4. Handle CV File (Save local backup & prepare Base64 payload for Google Sheets)
    let cvFileName = '';
    let cvFileBase64 = '';
    let cvFileMimeType = '';
    let localSavedPath = '';

    if (cvFile && typeof cvFile === 'object' && typeof cvFile.arrayBuffer === 'function') {
      const bytes = await cvFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      if (buffer.length > 0) {
        // Enforce 10MB limit
        if (buffer.length > 10 * 1024 * 1024) {
          return NextResponse.json(
            { success: false, error: 'File size exceeds maximum allowed 10MB limit.' },
            { status: 400 }
          );
        }

        const originalName = cvFile.name || 'cv_document.pdf';
        const safeOriginalName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}_${safeOriginalName}`;

        cvFileName = originalName;
        cvFileMimeType = cvFile.type || 'application/pdf';
        cvFileBase64 = buffer.toString('base64');

        // Save local backup copy into public/uploads/cv/
        try {
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'cv');
          await fs.promises.mkdir(uploadsDir, { recursive: true });
          const filePath = path.join(uploadsDir, uniqueFileName);
          await fs.promises.writeFile(filePath, buffer);
          localSavedPath = `/uploads/cv/${uniqueFileName}`;
        } catch (fileWriteError) {
          console.error('Warning: Failed to save local CV backup:', fileWriteError);
        }
      }
    }

    // 5. Send to Google Sheets Webhook
    // Check for dedicated CAREERS_GOOGLE_SHEETS_WEBHOOK_URL or fallback to GOOGLE_SHEETS_WEBHOOK_URL
    const webhookUrl = process.env.CAREERS_GOOGLE_SHEETS_WEBHOOK_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    let googleSheetStatus = 'skipped';

    if (webhookUrl) {
      try {
        const payload = {
          type: 'hiring_application',
          timestamp: new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
          fullName,
          email,
          phone,
          department,
          experience: experience || 'N/A',
          startDate: startDate || 'Immediately / N/A',
          expectedSalary: expectedSalary || 'N/A',
          consent: 'Agreed / موافق',
          cvFileName,
          cvFileBase64,
          cvFileMimeType,
          localBackupPath: localSavedPath
        };

        const sheetResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          redirect: 'follow',
          // 15 seconds timeout
          signal: AbortSignal.timeout(15000)
        });

        if (sheetResponse.ok) {
          googleSheetStatus = 'delivered';
        } else {
          googleSheetStatus = `failed_${sheetResponse.status}`;
          console.warn('Google Sheet webhook responded with status:', sheetResponse.status);
        }
      } catch (sheetError) {
        googleSheetStatus = 'error';
        console.error('Google Sheet webhook delivery error:', sheetError.message);
      }
    } else {
      console.warn('Neither CAREERS_GOOGLE_SHEETS_WEBHOOK_URL nor GOOGLE_SHEETS_WEBHOOK_URL is set in environment.');
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      sheetStatus: googleSheetStatus,
      savedLocally: Boolean(localSavedPath)
    }, { status: 200 });

  } catch (error) {
    console.error('Careers form submission error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
