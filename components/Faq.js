'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { FAQ } from '@/data/faq';

// Accessible FAQ (native <details>, works without JavaScript) + FAQPage structured data.
export default function Faq({ topic }) {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const items = FAQ[topic]?.[isAr ? 'ar' : 'en'] || [];
  if (!items.length) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: isAr ? 'ar' : 'en',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };
  const headingId = `faq-${topic}`;

  return (
    <section aria-labelledby={headingId} className="bg-fb-bg-light py-12 sm:py-20 px-4 sm:px-6 border-t border-fb-teal/5">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="eyebrow">{isAr ? 'أسئلة شائعة' : 'FAQ'}</span>
          <h2 id={headingId} className="text-fb-teal font-extrabold text-2xl sm:text-3xl">
            {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h2>
        </div>
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.q}>
              <details className="group bg-white/70 border border-fb-teal/15 rounded-2xl">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none min-h-[56px] px-5 py-4 font-bold text-fb-teal text-base">
                  <span>{it.q}</span>
                  <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-5 pb-5 text-fb-black/80 text-base leading-relaxed">{it.a}</p>
              </details>
            </li>
          ))}
        </ul>
        <p className="text-center text-sm text-fb-black/70">
          <Link href={isAr ? '/ar/risk-disclaimer' : '/risk-disclaimer'} className="underline underline-offset-4">
            {isAr ? 'إخلاء المسؤولية عن المخاطر' : 'Risk Disclaimer'}
          </Link>
        </p>
      </div>
    </section>
  );
}
