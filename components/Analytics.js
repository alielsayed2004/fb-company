'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useLanguage } from '@/context/LanguageContext';

// GA4 with consent. Inactive unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set ([ADD: GA4 measurement ID]).
// Events: generate_lead (contact / careers success), click_phone, click_email, click_whatsapp, download_profile.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CONSENT_KEY = 'fb_analytics_consent';

export function trackEvent(name, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params);
}

export default function Analytics() {
  const { locale } = useLanguage();
  const [consent, setConsent] = useState(null); // null = not asked yet, 'granted' | 'denied'

  useEffect(() => {
    if (!GA_ID) return;
    try { setConsent(localStorage.getItem(CONSENT_KEY)); } catch { setConsent(null); }
  }, []);

  useEffect(() => {
    if (!GA_ID || consent !== 'granted') return;
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href.startsWith('tel:')) trackEvent('click_phone');
      else if (href.startsWith('mailto:')) trackEvent('click_email');
      else if (href.includes('wa.me') || href.includes('whatsapp')) trackEvent('click_whatsapp');
      else if (href.endsWith('.pdf')) trackEvent('download_profile');
    };
    const onLead = (e) => trackEvent('generate_lead', { form: e.detail?.form || 'contact' });
    document.addEventListener('click', onClick);
    window.addEventListener('fb:lead', onLead);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('fb:lead', onLead);
    };
  }, [consent]);

  if (!GA_ID) return null;

  const choose = (value) => {
    try { localStorage.setItem(CONSENT_KEY, value); } catch {}
    setConsent(value);
  };
  const isAr = locale === 'ar';

  return (
    <>
      {consent === 'granted' && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {consent === null && (
        <div role="region" aria-label={isAr ? 'ملفات تعريف الارتباط' : 'Cookies'} className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:end-4 sm:max-w-md z-50 bg-white border border-fb-teal/20 shadow-2xl rounded-2xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
          <p className="text-sm text-fb-black/80 leading-relaxed">
            {isAr
              ? 'نستخدم ملفات تعريف ارتباط تحليلية لفهم كيفية استخدام الموقع، ولن تُستخدم إلا بموافقتك.'
              : 'We use analytics cookies to understand how the site is used. They are only set if you agree.'}{' '}
            <a href={isAr ? '/ar/privacy-policy' : '/privacy-policy'} className="underline">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</a>
          </p>
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={() => choose('granted')} className="min-h-[44px] px-5 rounded-xl bg-fb-teal text-white font-bold text-sm">{isAr ? 'موافق' : 'Accept'}</button>
            <button type="button" onClick={() => choose('denied')} className="min-h-[44px] px-5 rounded-xl border border-fb-teal/30 text-fb-teal font-bold text-sm">{isAr ? 'رفض' : 'Decline'}</button>
          </div>
        </div>
      )}
    </>
  );
}
