'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData, defaultBrands } from '@/context/DataContext';
import { Sparkles } from 'lucide-react';

export default function PartnersMarquee() {
  const { t, locale } = useLanguage();
  const { brands } = useData();

  const activeBrands = (brands && brands.length > 0) ? brands : defaultBrands;

  // Distribute brands across 3 marquee rows using round-robin (mod 3)
  // This guarantees all 3 rows always have equal items even if only some logos exist
  const row1 = activeBrands.filter((_, idx) => idx % 3 === 0);
  const row2 = activeBrands.filter((_, idx) => idx % 3 === 1);
  const row3 = activeBrands.filter((_, idx) => idx % 3 === 2);

  // Helper to multiply items for seamless infinite scrolling marquee
  const multiply = (arr) => {
    if (!arr || arr.length === 0) return [];
    return [...arr, ...arr, ...arr, ...arr];
  };

  const handleImageError = (e) => {
    const img = e.currentTarget;
    const currentSrc = img.getAttribute('src') || '';
    if (!img.dataset.fallbackTried && currentSrc.endsWith('.png')) {
      img.dataset.fallbackTried = 'true';
      img.setAttribute('src', currentSrc.replace(/\.png$/, '.gif'));
      return;
    }
    const container = e.currentTarget.closest('.logo-container');
    if (container) {
      container.style.display = 'none';
    }
  };

  return (
    <section className="bg-fb-teal overflow-hidden relative flex flex-col justify-center py-14 sm:py-20">
      {/* Subtle Ambient Radial Lighting Flares */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" 
        aria-hidden="true"
      />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 mb-8 sm:mb-12 text-center relative z-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-widest">
          <Sparkles size={13} className="text-emerald-400" />
          <span>{t('home.partners.eyebrow')}</span>
        </div>
        
        <h3 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
          {t('home.partners.title')}
        </h3>
        
        <p className="text-emerald-100/70 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
          {locale === 'ar'
            ? 'شراكات استراتيجية وعلامات تجارية عالمية ومحلية تتوسع عبر مجمعاتنا'
            : 'Strategic corporate brand partnerships thriving across our commercial developments'}
        </p>
      </div>

      {/* Force dir="ltr" so CSS translate keyframes operate identically in Arabic and English */}
      <div className="space-y-4 sm:space-y-5 relative overflow-hidden" dir="ltr">
        {/* Shadow side overlays for premium visual depth */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-fb-teal to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-fb-teal to-transparent z-10 pointer-events-none" />

        {/* Row 1 -> Left */}
        <div className="flex overflow-hidden w-full py-2">
          <div className="animate-marquee-left whitespace-nowrap flex items-center">
            {multiply(row1).map((item, idx) => (
              <div
                key={`row1-${item.id}-${idx}`}
                className="logo-container inline-flex items-center justify-center mx-2 sm:mx-3 shrink-0 group/logo cursor-pointer px-3 py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-emerald-400/40 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.18)] transition-all duration-300 h-14 sm:h-16 w-[150px] sm:w-[180px]"
              >
                <img
                  src={item.logoUrl || `/logos/${item.id}.png`}
                  alt={item.name || `Partner Logo ${item.id}`}
                  onError={handleImageError}
                  className="max-h-11 sm:max-h-12 max-w-[130px] sm:max-w-[155px] w-auto h-auto object-contain brightness-0 invert opacity-80 group-hover/logo:opacity-100 group-hover/logo:scale-105 transition-all duration-300 pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 -> Right */}
        {row2.length > 0 && (
          <div className="flex overflow-hidden w-full py-2">
            <div className="animate-marquee-right whitespace-nowrap flex items-center">
              {multiply(row2).map((item, idx) => (
                <div
                  key={`row2-${item.id}-${idx}`}
                  className="logo-container inline-flex items-center justify-center mx-2 sm:mx-3 shrink-0 group/logo cursor-pointer px-3 py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-emerald-400/40 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.18)] transition-all duration-300 h-14 sm:h-16 w-[150px] sm:w-[180px]"
                >
                  <img
                    src={item.logoUrl || `/logos/${item.id}.png`}
                    alt={item.name || `Partner Logo ${item.id}`}
                    onError={handleImageError}
                    className="max-h-11 sm:max-h-12 max-w-[130px] sm:max-w-[155px] w-auto h-auto object-contain brightness-0 invert opacity-80 group-hover/logo:opacity-100 group-hover/logo:scale-105 transition-all duration-300 pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Row 3 -> Left */}
        {row3.length > 0 && (
          <div className="flex overflow-hidden w-full py-2">
            <div className="animate-marquee-left whitespace-nowrap flex items-center">
              {multiply(row3).map((item, idx) => (
                <div
                  key={`row3-${item.id}-${idx}`}
                  className="logo-container inline-flex items-center justify-center mx-2 sm:mx-3 shrink-0 group/logo cursor-pointer px-3 py-1.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] hover:border-emerald-400/40 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.18)] transition-all duration-300 h-14 sm:h-16 w-[150px] sm:w-[180px]"
                >
                  <img
                    src={item.logoUrl || `/logos/${item.id}.png`}
                    alt={item.name || `Partner Logo ${item.id}`}
                    onError={handleImageError}
                    className="max-h-11 sm:max-h-12 max-w-[130px] sm:max-w-[155px] w-auto h-auto object-contain brightness-0 invert opacity-80 group-hover/logo:opacity-100 group-hover/logo:scale-105 transition-all duration-300 pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
