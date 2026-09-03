'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useData, defaultBrands } from '@/context/DataContext';
import { Sparkles, ShieldCheck, Globe2 } from 'lucide-react';

export default function PartnersGrid() {
  const { t, locale } = useLanguage();
  const { brands } = useData();
  const [failedImages, setFailedImages] = useState(() => new Set());
  const isAr = locale === 'ar';

  // Use dynamic brands from context or fallback to default
  const activeBrands = (brands && brands.length > 0) ? brands : defaultBrands;

  const handleImageError = (e, id) => {
    const img = e.currentTarget;
    const currentSrc = img.getAttribute('src') || '';
    if (currentSrc.endsWith('.png')) {
      img.setAttribute('src', currentSrc.replace(/\.png$/, '.gif'));
      return;
    }
    setFailedImages((prev) => new Set(prev).add(id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          PART 1: THE IMMERSIVE STATEMENT SECTION (Green Backdrop Stage)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full bg-gradient-to-b from-[#064e3b] via-[#022c22] to-[#021814] pt-28 pb-16 px-6 overflow-hidden">
        {/* Subtle Ambient Radial Lighting Flares */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" 
          aria-hidden="true"
        />
        <div 
          className="absolute -top-24 right-1/4 w-[400px] h-[300px] bg-emerald-400/5 rounded-full blur-[90px] pointer-events-none" 
          aria-hidden="true"
        />
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" 
          aria-hidden="true"
        />

        {/* Content Container */}
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          {/* Subtitle Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/25 backdrop-blur-md text-emerald-300 text-xs font-bold uppercase tracking-[0.2em]"
          >
            <Sparkles size={13} className="text-emerald-400 animate-pulse" />
            <span>
              {isAr ? 'شراكات استراتيجية عالمية • منظومة موثوقة' : 'GLOBAL ALLIANCES • TRUSTED ECOSYSTEM'}
            </span>
          </motion.div>

          {/* Main Statement Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight"
          >
            {isAr ? 'شريك التوسع الموثوق لكبرى العلامات التجارية' : 'Trusted By World-Class Brands'}
          </motion.h2>

          {/* Descriptive Body */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-emerald-100/75 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed"
          >
            {isAr
              ? 'شبكة متكاملة من الشركاء والعلامات التجارية الرائدة محلياً وإقليمياً تتوسع وتزدهر عبر كافة مشروعاتنا التجارية.'
              : 'Institutional brand alliances and premier retail partners thriving across our commercial developments.'}
          </motion.p>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          PART 2: THE BRAND MATRIX (Pure White Logos on Dark Canvas)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full bg-[#021814] pb-28 pt-4 px-6">
        {/* Subtle grid background accent */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.04)_0%,transparent_70%)] pointer-events-none" 
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Staggered Animated Bento-Mosaic Logo Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 sm:p-8 md:p-12"
          >
            {activeBrands.map((brand) => {
              const hasFailed = failedImages.has(brand.id);
              const logoSrc = brand.logoUrl || `/logos/${brand.id}.png`;
              const brandDisplayName = brand.name || `Partner ${brand.id}`;

              return (
                <motion.div
                  key={brand.id}
                  variants={cardVariants}
                  style={{
                    background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.2) 0%, rgba(2, 24, 20, 0.7) 100%)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(16, 185, 129, 0.15)',
                    borderRadius: '1rem',
                  }}
                  className="group relative flex items-center justify-center p-4 cursor-pointer hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300"
                >
                  {/* Fixed Uniform Bounding Box */}
                  <div className="h-10 md:h-12 w-full flex items-center justify-center overflow-hidden">
                    {!hasFailed ? (
                      <img
                        src={logoSrc}
                        alt={brandDisplayName}
                        loading="lazy"
                        onError={(e) => handleImageError(e, brand.id)}
                        className="max-h-8 max-w-[120px] w-auto h-auto object-contain brightness-0 invert opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                      />
                    ) : (
                      /* Zero Broken Boxes - Elegant Minimalist Text Badge Fallback */
                      <div className="flex items-center justify-center text-center px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/20 w-full group-hover:border-emerald-400/40 transition-all duration-300">
                        <span className="text-[11px] font-semibold tracking-wide text-emerald-200/90 group-hover:text-white truncate uppercase transition-colors">
                          {brandDisplayName}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
