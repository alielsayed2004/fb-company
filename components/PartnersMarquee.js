'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useData, defaultBrands } from '@/context/DataContext';
import { Sparkles } from 'lucide-react';

export default function PartnersMarquee() {
  const { t, locale } = useLanguage();
  const { brands } = useData();

  const activeBrands = (brands && brands.length > 0) ? brands : defaultBrands;

  // Filter to only brands with real verified logo files (1.png to 54.png)
  const validBrands = activeBrands.filter((b) => {
    const numId = typeof b.id === 'number' ? b.id : parseInt(b.id, 10);
    if (!isNaN(numId) && numId > 54) return false;
    if (b.logo && (b.logo.includes('placeholder') || b.logo.includes('default'))) return false;
    return true;
  });

  // Distribute brands across 3 marquee rows for desktop using round-robin (mod 3)
  const deskRow1 = validBrands.filter((_, idx) => idx % 3 === 0);
  const deskRow2 = validBrands.filter((_, idx) => idx % 3 === 1);
  const deskRow3 = validBrands.filter((_, idx) => idx % 3 === 2);

  // Distribute brands across 5 marquee rows for mobile (mod 5)
  const mobRow1 = validBrands.filter((_, idx) => idx % 5 === 0);
  const mobRow2 = validBrands.filter((_, idx) => idx % 5 === 1);
  const mobRow3 = validBrands.filter((_, idx) => idx % 5 === 2);
  const mobRow4 = validBrands.filter((_, idx) => idx % 5 === 3);
  const mobRow5 = validBrands.filter((_, idx) => idx % 5 === 4);

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
    <section id="partners" className="bg-fb-teal overflow-hidden relative flex flex-col justify-center py-12 sm:py-20 md:py-28 z-20">
      {/* Subtle Ambient Radial Lighting Flares */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true"
      />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 sm:mb-12 text-center relative z-10 space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-widest">
          <Sparkles size={13} className="text-emerald-400" />
          <span>{t('home.partners.eyebrow')}</span>
        </div>
        
        <h3 className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight text-balance">
          {t('home.partners.title')}
        </h3>
        
        <p className="text-emerald-100/70 text-xs sm:text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
          {locale === 'ar'
            ? 'شراكات استراتيجية وعلامات تجارية عالمية ومحلية تتوسع عبر مجمعاتنا'
            : 'Strategic corporate brand partnerships thriving across our commercial developments'}
        </p>
      </div>

      {/* Force dir="ltr" so CSS translate keyframes operate identically in Arabic and English */}
      <div className="relative overflow-hidden" dir="ltr">
        {/* Shadow side overlays for premium visual depth */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-48 bg-gradient-to-r from-fb-teal to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-48 bg-gradient-to-l from-fb-teal to-transparent z-10 pointer-events-none" />

        {/* ─── MOBILE ONLY: 5 BALANCED LOGO ROWS (< md) ─── */}
        <div className="block md:hidden space-y-2.5">
          {/* Row 1 -> Left (68s) */}
          <div className="flex overflow-hidden w-full py-1">
            <div className="animate-marquee-left whitespace-nowrap flex items-center transform-gpu will-change-transform" style={{ animationDuration: '68s' }}>
              {multiply(mobRow1).map((item, idx) => (
                <div
                  key={`m-row1-${item.id}-${idx}`}
                  className="logo-container inline-flex items-center justify-center mx-1.5 shrink-0 group/logo cursor-pointer px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.09] hover:border-emerald-400/50 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 h-12 w-[138px] transform-gpu"
                >
                  <img
                    src={item.logoUrl || `/logos/${item.id}.png`}
                    alt={item.name || `Partner Logo ${item.id}`}
                    onError={handleImageError}
                    className="max-h-8 max-w-[115px] w-auto h-auto object-contain brightness-0 invert opacity-80 group-hover/logo:opacity-100 group-hover/logo:scale-105 transition-all duration-300 pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 -> Right (78s) */}
          <div className="flex overflow-hidden w-full py-1">
            <div className="animate-marquee-right whitespace-nowrap flex items-center transform-gpu will-change-transform" style={{ animationDuration: '78s' }}>
              {multiply(mobRow2).map((item, idx) => (
                <div
                  key={`m-row2-${item.id}-${idx}`}
                  className="logo-container inline-flex items-center justify-center mx-1.5 shrink-0 group/logo cursor-pointer px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.09] hover:border-emerald-400/50 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 h-12 w-[138px] transform-gpu"
                >
                  <img
                    src={item.logoUrl || `/logos/${item.id}.png`}
                    alt={item.name || `Partner Logo ${item.id}`}
                    onError={handleImageError}
                    className="max-h-8 max-w-[115px] w-auto h-auto object-contain brightness-0 invert opacity-80 group-hover/logo:opacity-100 group-hover/logo:scale-105 transition-all duration-300 pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 -> Left (72s) */}
          <div className="flex overflow-hidden w-full py-1">
            <div className="animate-marquee-left whitespace-nowrap flex items-center transform-gpu will-change-transform" style={{ animationDuration: '72s' }}>
              {multiply(mobRow3).map((item, idx) => (
                <div
                  key={`m-row3-${item.id}-${idx}`}
                  className="logo-container inline-flex items-center justify-center mx-1.5 shrink-0 group/logo cursor-pointer px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.09] hover:border-emerald-400/50 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 h-12 w-[138px] transform-gpu"
                >
                  <img
                    src={item.logoUrl || `/logos/${item.id}.png`}
                    alt={item.name || `Partner Logo ${item.id}`}
                    onError={handleImageError}
                    className="max-h-8 max-w-[115px] w-auto h-auto object-contain brightness-0 invert opacity-80 group-hover/logo:opacity-100 group-hover/logo:scale-105 transition-all duration-300 pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 4 -> Right (82s) */}
          <div className="flex overflow-hidden w-full py-1">
            <div className="animate-marquee-right whitespace-nowrap flex items-center transform-gpu will-change-transform" style={{ animationDuration: '82s' }}>
              {multiply(mobRow4).map((item, idx) => (
                <div
                  key={`m-row4-${item.id}-${idx}`}
                  className="logo-container inline-flex items-center justify-center mx-1.5 shrink-0 group/logo cursor-pointer px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.09] hover:border-emerald-400/50 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 h-12 w-[138px] transform-gpu"
                >
                  <img
                    src={item.logoUrl || `/logos/${item.id}.png`}
                    alt={item.name || `Partner Logo ${item.id}`}
                    onError={handleImageError}
                    className="max-h-8 max-w-[115px] w-auto h-auto object-contain brightness-0 invert opacity-80 group-hover/logo:opacity-100 group-hover/logo:scale-105 transition-all duration-300 pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Row 5 -> Left (70s) */}
          <div className="flex overflow-hidden w-full py-1">
            <div className="animate-marquee-left whitespace-nowrap flex items-center transform-gpu will-change-transform" style={{ animationDuration: '70s' }}>
              {multiply(mobRow5).map((item, idx) => (
                <div
                  key={`m-row5-${item.id}-${idx}`}
                  className="logo-container inline-flex items-center justify-center mx-1.5 shrink-0 group/logo cursor-pointer px-2.5 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.09] hover:border-emerald-400/50 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 h-12 w-[138px] transform-gpu"
                >
                  <img
                    src={item.logoUrl || `/logos/${item.id}.png`}
                    alt={item.name || `Partner Logo ${item.id}`}
                    onError={handleImageError}
                    className="max-h-8 max-w-[115px] w-auto h-auto object-contain brightness-0 invert opacity-80 group-hover/logo:opacity-100 group-hover/logo:scale-105 transition-all duration-300 pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── DESKTOP ONLY: 3 ORIGINAL LOGO ROWS (>= md) ─── */}
        <div className="hidden md:block space-y-4 sm:space-y-5">
          {/* Row 1 -> Left */}
          <div className="flex overflow-hidden w-full py-2">
            <div className="animate-marquee-left whitespace-nowrap flex items-center transform-gpu will-change-transform">
              {multiply(deskRow1).map((item, idx) => (
                <div
                  key={`desk-row1-${item.id}-${idx}`}
                  className="logo-container inline-flex items-center justify-center mx-2 sm:mx-3 shrink-0 group/logo cursor-pointer px-3 py-1.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.09] hover:border-emerald-400/50 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 h-14 sm:h-16 w-[150px] sm:w-[180px] transform-gpu"
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
          {deskRow2.length > 0 && (
            <div className="flex overflow-hidden w-full py-2">
              <div className="animate-marquee-right whitespace-nowrap flex items-center transform-gpu will-change-transform">
                {multiply(deskRow2).map((item, idx) => (
                  <div
                    key={`desk-row2-${item.id}-${idx}`}
                    className="logo-container inline-flex items-center justify-center mx-2 sm:mx-3 shrink-0 group/logo cursor-pointer px-3 py-1.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.09] hover:border-emerald-400/50 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 h-14 sm:h-16 w-[150px] sm:w-[180px] transform-gpu"
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
          {deskRow3.length > 0 && (
            <div className="flex overflow-hidden w-full py-2">
              <div className="animate-marquee-left whitespace-nowrap flex items-center transform-gpu will-change-transform">
                {multiply(deskRow3).map((item, idx) => (
                  <div
                    key={`desk-row3-${item.id}-${idx}`}
                    className="logo-container inline-flex items-center justify-center mx-2 sm:mx-3 shrink-0 group/logo cursor-pointer px-3 py-1.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.09] hover:border-emerald-400/50 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300 h-14 sm:h-16 w-[150px] sm:w-[180px] transform-gpu"
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
      </div>
    </section>
  );
}
