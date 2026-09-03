import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
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

    // Direct Google Sheets Apps Script Webhook URL provided by user
    const googleSheetWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL || 
      "https://script.google.com/macros/s/AKfycbyVZzWE_e_Uc7FBTxCKc4tVi2PE9kiK_nI58pSMRZe350_URnAzXHgOwQkgAlqTbEjl2g/exec";

    if (googleSheetWebhookUrl) {
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
          // Google Apps Script redirects require follow mode
          redirect: 'follow'
        });
      } catch (err) {
        console.error('Error posting to Google Sheets Webhook:', err);
      }
    }

    // Optional Formspree fallback
    const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT || "https://formspree.io/f/xoqgyojy";
    if (formspreeEndpoint) {
      try {
        await fetch(formspreeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, phone, interest, message }),
        });
      } catch (e) {}
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Contact submit error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
