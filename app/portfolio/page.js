'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Building2, MapPin, ArrowRight, 
  Store, Fuel, TrendingUp
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

const corporateEase = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: corporateEase }
  }
};

export default function PortfolioPage() {
  const { locale, t } = useLanguage();
  const { projects, counters } = useData();
  const isAr = locale === 'ar';

  const getField = (obj, field) => {
    if (!obj) return '';
    if (isAr) {
      return obj[`${field}_ar`] || obj[field] || '';
    }
    return obj[field] || '';
  };

  return (
    <div className="flex flex-col min-h-screen bg-fb-bg-light">

      {/* 1. HERO SECTION */}
      <section className="bg-fb-teal text-fb-white py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-center min-h-[60dvh] md:min-h-[70dvh]">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none z-0 scale-105"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-fb-teal/70 mix-blend-multiply z-0 pointer-events-none" />
        <div className="absolute inset-0 hero-grid-overlay pointer-events-none z-0" />

        {/* Ambient glowing orbs */}
        <div className="absolute -top-12 left-1/4 w-96 h-96 bg-fb-green/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-fb-green/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto z-10 relative space-y-5 sm:space-y-6 w-full text-start">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-fb-green text-xs font-bold uppercase tracking-widest"
          >
            <Building2 size={14} className="text-fb-green" />
            <span>{isAr ? 'محفظة الأصول والمشاريع التجارية' : 'Commercial Asset Portfolio'}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, ease: corporateEase }}
            className="text-fb-bg-light max-w-4xl leading-tight font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-[3.25rem] tracking-tight text-balance"
          >
            {isAr
              ? 'مجمعات تجارية ومراكز خدمية رائدة على أهم محاور التنمية في مصر'
              : 'Institutional Commercial Plazas & Franchise Hubs Across Strategic Corridors'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, ease: corporateEase }}
            className="text-fb-bg-light/85 text-xs sm:text-base md:text-lg leading-relaxed max-w-2xl font-light"
          >
            {isAr
              ? 'نستعرض هنا محفظة الأصول العقارية التجارية المدارة والتي تم تسكين كبرى العلامات التجارية العالمية والوطنية بها بنسبة إشغال كاملة 100% وعوائد مؤسسية مستدامة.'
              : 'Explore our high-traffic commercial fuel plazas, urban retail perimeters, and specialized travel hubs engineered for 100% occupancy and top-tier retail covenants.'}
          </motion.p>
        </div>
      </section>

      {/* 2. LIVE PORTFOLIO STATS STRIP */}
      <section className="bg-white border-b border-fb-teal/10 py-6 sm:py-8 px-4 sm:px-6 relative z-20 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-fb-teal/10">
          <div className="pt-2 sm:pt-0 sm:px-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center text-fb-green shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <div className="font-mono font-extrabold text-xl sm:text-2xl text-fb-teal">{counters?.sqm || '500,000+'}</div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{t('home.counters.sqm')}</div>
            </div>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center text-fb-green shrink-0">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="font-mono font-extrabold text-xl sm:text-2xl text-fb-teal">{counters?.occupancy || '100%'}</div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{t('home.counters.occupancy')}</div>
            </div>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center text-fb-green shrink-0">
              <Store size={20} />
            </div>
            <div>
              <div className="font-mono font-extrabold text-xl sm:text-2xl text-fb-teal">{counters?.brands || '200+'}</div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{t('home.counters.brands')}</div>
            </div>
          </div>

          <div className="pt-2 sm:pt-0 sm:px-4 flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center text-fb-green shrink-0">
              <Fuel size={20} />
            </div>
            <div>
              <div className="font-mono font-extrabold text-xl sm:text-2xl text-fb-teal">{counters?.gas || '8+'}</div>
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">{t('home.counters.gas')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN PROJECT CARDS GRID */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          
          {(!projects || projects.length === 0) ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-fb-teal/15 space-y-4 max-w-lg mx-auto shadow-sm">
              <Building2 size={42} className="text-fb-teal/30 mx-auto" />
              <h3 className="font-extrabold text-fb-teal text-lg">
                {isAr ? 'لا توجد مشاريع متاحة حالياً' : 'No projects available currently'}
              </h3>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {projects.map((project, idx) => {
                const name = getField(project, 'name');
                const city = getField(project, 'city');
                const location = getField(project, 'location');
                const overview = getField(project, 'overview');
                const isOperational = project.status === 'Operational';

                // Cover Image fallback
                const cover = project.coverImage || (Array.isArray(project.gallery) && project.gallery[0]) || '/company/logo.png';

                return (
                  <motion.div
                    key={project.id || idx}
                    variants={itemVariants}
                    className="bg-white rounded-3xl border border-fb-teal/15 overflow-hidden flex flex-col justify-between shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_20px_40px_rgba(0,59,60,0.12)] hover:border-fb-green transition-all duration-400 group relative"
                  >
                    {/* Card Top / Visual */}
                    <div>
                      <div className="relative aspect-16/10 overflow-hidden bg-fb-teal/10">
                        <img
                          src={cover}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                        {/* Status Badge */}
                        <div className="absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 z-10">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs ${
                            isOperational
                              ? 'bg-emerald-500/90 text-white'
                              : 'bg-amber-500/90 text-white'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>
                              {isOperational
                                ? (isAr ? 'تشغيل ممتاز (100%)' : 'Operational (100%)')
                                : (isAr ? 'قيد التطوير / التسكين' : 'Allocating')}
                            </span>
                          </span>
                        </div>

                        {/* Quick City & Road Overlay */}
                        <div className="absolute bottom-3 left-3.5 right-3.5 z-10 text-white space-y-0.5">
                          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-fb-green drop-shadow-xs">
                            <MapPin size={12} className="shrink-0" />
                            <span>{city}</span>
                          </div>
                          <h3 className="font-extrabold text-base sm:text-lg text-white leading-snug drop-shadow-md line-clamp-1">
                            {name}
                          </h3>
                        </div>
                      </div>

                      {/* Card Middle: Description & Location */}
                      <div className="p-5 sm:p-6 space-y-4">
                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {overview}
                        </p>

                        <div className="text-[11px] text-fb-teal/80 font-medium flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <MapPin size={13} className="text-fb-green shrink-0" />
                          <span className="truncate">{location}</span>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                          <div className="bg-fb-bg-light/70 p-2.5 rounded-xl border border-fb-teal/10">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                              {isAr ? 'مساحة الأرض' : 'Land Area'}
                            </span>
                            <span className="font-mono font-extrabold text-fb-teal text-xs sm:text-sm">
                              {project.metrics?.landArea || 'N/A'}
                            </span>
                          </div>

                          <div className="bg-fb-bg-light/70 p-2.5 rounded-xl border border-fb-teal/10">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                              {isAr ? 'العلامات التجارية' : 'Brand Covenants'}
                            </span>
                            <span className="font-mono font-extrabold text-fb-teal text-xs sm:text-sm">
                              {project.metrics?.numBrands || (Array.isArray(project.brands) ? project.brands.length : 0)} {isAr ? 'براند' : 'Brands'}
                            </span>
                          </div>

                          <div className="bg-fb-bg-light/70 p-2.5 rounded-xl border border-fb-teal/10">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                              {isAr ? 'نسبة الإشغال' : 'Occupancy'}
                            </span>
                            <span className="font-mono font-extrabold text-emerald-700 text-xs sm:text-sm">
                              {project.metrics?.occupancyRate || '100%'}
                            </span>
                          </div>

                          <div className="bg-fb-bg-light/70 p-2.5 rounded-xl border border-fb-teal/10">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                              {isAr ? 'سنة الافتتاح' : 'Opening Year'}
                            </span>
                            <span className="font-mono font-extrabold text-fb-teal text-xs sm:text-sm">
                              {project.metrics?.openingYear || '2024'}
                            </span>
                          </div>
                        </div>

                        {/* Brand Badges Strip */}
                        {Array.isArray(project.brands) && project.brands.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                              {isAr ? 'نخبة المستأجرين والعلامات بالمشروع:' : 'Anchor Tenants & Brands:'}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {project.brands.slice(0, 5).map((brand, bIdx) => {
                                const bName = typeof brand === 'object' ? brand.name : String(brand);
                                return (
                                  <span
                                    key={bIdx}
                                    className="px-2.5 py-0.5 rounded-lg bg-fb-teal/5 text-fb-teal text-[11px] font-bold border border-fb-teal/10"
                                  >
                                    {bName}
                                  </span>
                                );
                              })}
                              {project.brands.length > 5 && (
                                <span className="px-2 py-0.5 rounded-lg bg-fb-green/10 text-emerald-800 text-[11px] font-bold">
                                  +{project.brands.length - 5}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer / CTA */}
                    <div className="p-5 sm:p-6 pt-0">
                      <Link
                        href={`/projects/${project.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-fb-teal hover:bg-fb-green text-white hover:text-fb-teal font-extrabold text-xs transition-all duration-300 shadow-md group-hover:shadow-lg cursor-pointer"
                      >
                        <span>{isAr ? 'استعراض تفاصيل المشروع والمعرض' : 'View Full Details & Gallery'}</span>
                        <ArrowRight size={14} className={isAr ? 'rotate-180' : ''} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

        </div>
      </section>

      {/* 5. STRATEGIC GEOGRAPHIC CORRIDOR HIGHLIGHT */}
      <section className="bg-fb-teal text-fb-white py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden border-t border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          <div className="space-y-4">
            <span className="text-fb-green text-xs font-bold uppercase tracking-widest block">
              {isAr ? 'الانتشار الجغرافي الذكي' : 'Strategic Transit Footprint'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
              {isAr
                ? 'أصول واقعة على شرايين الحركة الأكثر كثافة في مصر'
                : 'Positioned Along Egypt\'s Highest-Yielding Transit Arteries'}
            </h2>
            <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'تم اختيار مواقع مشاريعنا بعد دراسات تدفق مروري دقيقة على مدار 24 ساعة، تشمل محور طريق السويس، طريق الإسماعيلية، الطريق الدائري، ومحاور القاهرة الجديدة والساحل الشمالي.'
                : 'Every asset in our portfolio is acquired following 24-hour directional traffic counts, catchment density modeling, and strict highway zoning compliance.'}
            </p>
            <div className="pt-2">
              <Link
                href="/contact?interest=portfolio#consultation-form"
                className="inline-flex items-center gap-2 bg-fb-green text-fb-teal hover:bg-fb-green-hover font-extrabold px-6 py-3 rounded-xl text-xs transition-all shadow-md"
              >
                <span>{isAr ? 'طلب استشارة تسكين واستثمار' : 'Inquire for Sourcing Opportunities'}</span>
                <ArrowRight size={14} className={isAr ? 'rotate-180' : ''} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
              <div className="text-fb-green font-bold text-xs uppercase mb-1">{isAr ? 'العاشر من رمضان' : '10th of Ramadan'}</div>
              <div className="text-white font-extrabold text-sm sm:text-base">{isAr ? 'مجمع مركز البنوك ونادي الرواد' : 'Banks Core & Al-Rowad Plazas'}</div>
              <div className="text-[11px] text-white/60 mt-1">{isAr ? '120,000+ مركبة يومياً' : '120,000+ daily vehicles'}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
              <div className="text-fb-green font-bold text-xs uppercase mb-1">{isAr ? 'القاهرة الجديدة' : 'New Cairo'}</div>
              <div className="text-white font-extrabold text-sm sm:text-base">{isAr ? 'محور مصطفى كامل جنوب الأكاديمية' : 'Mostafa Kamel Axis Hub'}</div>
              <div className="text-[11px] text-white/60 mt-1">{isAr ? '85,000+ نسمة في محيط 1.5كم' : '85,000+ local catchment'}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
              <div className="text-fb-green font-bold text-xs uppercase mb-1">{isAr ? 'الساحل الشمالي' : 'North Coast'}</div>
              <div className="text-white font-extrabold text-sm sm:text-base">{isAr ? 'شيل أوت مارينا 5 أمام روتانا' : 'Marina 5 Gateway Plaza'}</div>
              <div className="text-[11px] text-white/60 mt-1">{isAr ? '300,000+ زائر أسبوعياً' : '300,000+ summer flow'}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10">
              <div className="text-fb-green font-bold text-xs uppercase mb-1">{isAr ? 'شيراتون والعبور والسلام' : 'Sheraton, Obour & Salam'}</div>
              <div className="text-white font-extrabold text-sm sm:text-base">{isAr ? 'أسوار النوادي ومول السلام' : 'Club Perimeters & Plazas'}</div>
              <div className="text-[11px] text-white/60 mt-1">{isAr ? 'تسكين وإشغال مؤسسي كامل' : '100% Institutional Leases'}</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
