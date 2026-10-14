'use client';

import { useMemo, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';
import { BRAND_LOGO_MAP } from '@/lib/brandLogos';

// Logo file → display name (first English key listed for that file in lib/brandLogos.js).
const LOGO_NAMES = Object.entries(BRAND_LOGO_MAP).reduce((acc, [name, file]) => {
  if (!acc[file] && /^[\x20-\x7E]+$/.test(name)) {
    acc[file] = name.replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return acc;
}, {});

const ROWS = 3;

export default function PartnersMarquee() {
  const { t, locale } = useLanguage();
  const { brands } = useData();
  const [paused, setPaused] = useState(false);
  const isAr = locale === 'ar';

  // One set of rows for every breakpoint; each row is duplicated once so the -50% loop is seamless.
  const rows = useMemo(() => {
    const logos = (brands || [])
      .map((b) => {
        const src = b.logoUrl || `/logos/${b.id}.png`;
        return { id: b.id, src, name: LOGO_NAMES[src] || '' };
      })
      .filter((b) => !b.src.includes('placeholder'));
    return Array.from({ length: ROWS }, (_, r) => logos.filter((_, i) => i % ROWS === r));
  }, [brands]);

  return (
    <section id="partners" aria-labelledby="partners-heading" className="bg-fb-teal overflow-hidden relative py-12 sm:py-20 md:py-24 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12 text-center relative z-10 space-y-3">
        <span className="text-fb-green text-xs font-bold uppercase tracking-widest">{t('home.partners.eyebrow')}</span>
        <h2 id="partners-heading" className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight text-balance">
          {t('home.partners.title')}
        </h2>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full border border-white/20 text-white/90 text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          <span>{paused ? (isAr ? 'تشغيل الحركة' : 'Play') : (isAr ? 'إيقاف الحركة' : 'Pause')}</span>
        </button>
      </div>

      {/* dir="ltr" so the translate keyframes behave the same in Arabic and English */}
      <div className={`marquee relative overflow-hidden space-y-3 ${paused ? 'is-paused' : ''}`} dir="ltr">
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-40 bg-gradient-to-r from-fb-teal to-transparent z-10 pointer-events-none" aria-hidden="true" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-40 bg-gradient-to-l from-fb-teal to-transparent z-10 pointer-events-none" aria-hidden="true" />

        {rows.map((row, r) => (
          <div key={r} className="flex overflow-hidden w-full py-1">
            <ul
              className={`${r % 2 === 0 ? 'animate-marquee-left' : 'animate-marquee-right'} flex items-center`}
              style={{ animationDuration: `${60 + r * 8}s` }}
            >
              {[...row, ...row].map((item, idx) => (
                <li
                  key={`${item.id}-${idx}`}
                  aria-hidden={idx >= row.length ? 'true' : undefined}
                  className="inline-flex items-center justify-center mx-2 shrink-0 px-3 rounded-xl bg-white/[0.05] border border-white/[0.09] h-14 sm:h-16 w-[150px] sm:w-[170px]"
                >
                  {/* Plain <img>: small pre-sized logos; next/image srcsets made the page HTML ~0.6 MB larger */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={idx >= row.length ? '' : (item.name || (isAr ? 'شعار علامة تجارية' : 'Brand logo'))}
                    width={130}
                    height={44}
                    loading="lazy"
                    decoding="async"
                    className="max-h-10 sm:max-h-11 max-w-[130px] w-auto h-auto object-contain brightness-0 invert opacity-85"
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
