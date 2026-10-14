'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Closing call-to-action used by both service pages, so both business lines get identical weight.
export default function ServiceCta({ title, desc, btn, path, note }) {
  const { locale } = useLanguage();
  const href = locale === 'ar' ? `/ar${path}` : path;

  return (
    <section className="bg-fb-teal text-fb-white py-16 sm:py-20 px-4 sm:px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 grid-bg-overlay" aria-hidden="true" />
      <div className="max-w-3xl mx-auto relative z-10 space-y-6">
        <h2 className="text-fb-bg-light font-extrabold text-2xl sm:text-3xl text-balance">{title}</h2>
        <p className="text-fb-bg-light/85 text-base leading-relaxed">{desc}</p>
        <div className="pt-2">
          <Link
            href={href}
            className="inline-flex items-center gap-2 min-h-[44px] bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-8 py-4 rounded-xl transition-colors shadow-lg"
          >
            <span>{btn}</span>
            <ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
        {note && <p className="text-sm text-fb-bg-light/75 max-w-2xl mx-auto">{note}</p>}
      </div>
    </section>
  );
}

// Primary hero button for a service page.
export function HeroCta({ label, path }) {
  const { locale } = useLanguage();
  const href = locale === 'ar' ? `/ar${path}` : path;
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 min-h-[44px] bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-7 py-3.5 rounded-xl text-sm transition-colors shadow-lg"
    >
      <span>{label}</span>
      <ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true" />
    </Link>
  );
}
