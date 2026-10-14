'use client';

import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

// Floating WhatsApp button. Renders only when data/company.json → contactInfo.whatsapp is set
// ([ADD: WhatsApp business number], international format without "+", e.g. 2011…).
// Hidden on the contact and careers pages so it never covers form fields.
export default function WhatsAppButton() {
  const { locale } = useLanguage();
  const { contactInfo } = useData();
  const pathname = usePathname() || '';
  const number = (contactInfo?.whatsapp || '').replace(/\D/g, '');
  if (!number || /\/(contact|careers|admin)/.test(pathname)) return null;

  const isAr = locale === 'ar';
  const text = encodeURIComponent(isAr ? 'مرحباً، أود الاستفسار عن خدمات شركة إف بي.' : "Hello, I'd like to ask about F.B Company's services.");

  return (
    <a
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={isAr ? 'تواصل معنا عبر واتساب' : 'Chat with us on WhatsApp'}
      className="fixed z-40 end-4 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.47 9.47 0 0 1-4.83-1.32l-.35-.21-3.59.94.96-3.5-.23-.36a9.45 9.45 0 0 1-1.45-5.04c0-5.23 4.26-9.49 9.5-9.49a9.43 9.43 0 0 1 6.71 2.78 9.43 9.43 0 0 1 2.78 6.72c0 5.23-4.26 9.48-9.49 9.48zm8.08-17.56A11.36 11.36 0 0 0 12.04.6C5.74.6.62 5.72.62 12.02c0 2.01.53 3.98 1.53 5.71L.52 23.4l5.81-1.52a11.4 11.4 0 0 0 5.71 1.46h.01c6.3 0 11.42-5.12 11.42-11.42 0-3.05-1.19-5.92-3.35-8.08z" />
      </svg>
    </a>
  );
}
