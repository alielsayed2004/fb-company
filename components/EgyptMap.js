'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Building2, Store, Car, ExternalLink, ShieldCheck, ArrowRight, Layers, Sparkles, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function EgyptMap({ projects = [], onSelectProject }) {
  const [selectedCorridor, setSelectedCorridor] = useState('all');
  const { locale, t } = useLanguage();
  const isAr = locale === 'ar';

  const getField = (obj, field) => {
    if (!obj) return '';
    if (isAr) {
      return obj[`${field}_ar`] || obj[field];
    }
    return obj[field];
  };

  const corridors = [
    { id: 'all', nameEn: 'All Corridors', nameAr: 'كافة المحاور' },
    { id: 'cairo', nameEn: 'Greater Cairo', nameAr: 'القاهرة الكبرى والشرايين الرئيسية' },
    { id: 'industrial', nameEn: '10th of Ramadan Hub', nameAr: 'محور العاشر والمنطقة الصناعية' },
    { id: 'coast', nameEn: 'North Coast Gateway', nameAr: 'ممر الساحل الشمالي' },
  ];

  const filteredProjects = projects.filter((p) => {
    if (selectedCorridor === 'all') return true;
    if (selectedCorridor === 'coast') return p.city.includes('North Coast');
    if (selectedCorridor === 'industrial') return p.city.includes('10th of Ramadan');
    if (selectedCorridor === 'cairo') return !p.city.includes('North Coast') && !p.city.includes('10th of Ramadan');
    return true;
  });

  return (
    <section className="py-24 bg-fb-bg-light border-b border-fb-teal/5 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-fb-teal/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <span className="eyebrow flex items-center space-x-2 rtl:space-x-reverse">
              <Sparkles size={14} className="text-fb-green" />
              <span>{t('home.map.eyebrow')}</span>
            </span>
            <h2 className="text-fb-teal font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight">
              {t('home.map.title')}
            </h2>
            <p className="text-fb-black/75 text-sm md:text-base leading-relaxed">
              {t('home.map.p1')}
            </p>
          </div>

          {/* Corridor Selection Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-fb-bg-light/90 p-1.5 rounded-2xl border border-fb-teal/15 shadow-xs">
            {corridors.map((c) => {
              const isSelected = selectedCorridor === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCorridor(c.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-fb-teal text-fb-white shadow-md'
                      : 'text-fb-black/70 hover:text-fb-teal hover:bg-fb-bg-light'
                  }`}
                >
                  {isAr ? c.nameAr : c.nameEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Executive Highlights Summary Banner */}
        <div className="bg-[#002B2C] text-fb-white rounded-3xl p-6 md:p-8 border border-fb-green/20 shadow-2xl relative overflow-hidden grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(83,179,121,0.15)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="space-y-1 relative z-10">
            <span className="text-[10px] text-fb-green font-mono uppercase tracking-widest block font-bold">
              {isAr ? 'إجمالي المحافظ الاستثمارية' : 'PORTFOLIO ASSETS'}
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-fb-white block">
              8 {isAr ? 'مشاريع حيوية' : 'Core Hubs'}
            </span>
            <span className="text-[11px] text-fb-bg-light/65 block">
              {isAr ? 'مواقع استراتيجية عالية الكثافة' : 'Prime High-Traffic Sites'}
            </span>
          </div>

          <div className="space-y-1 relative z-10 border-r md:border-r border-fb-green/15 pr-4 rtl:border-r-0 rtl:border-l rtl:pl-4">
            <span className="text-[10px] text-fb-green font-mono uppercase tracking-widest block font-bold">
              {isAr ? 'حجم المرور المستهدف' : 'TRAFFIC EXPOSURE'}
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-fb-white block">
              1.2M+
            </span>
            <span className="text-[11px] text-fb-bg-light/65 block">
              {isAr ? 'مركبة يومياً عبر المحاور' : 'Daily vehicles across corridors'}
            </span>
          </div>

          <div className="space-y-1 relative z-10 border-r md:border-r border-fb-green/15 pr-4 rtl:border-r-0 rtl:border-l rtl:pl-4">
            <span className="text-[10px] text-fb-green font-mono uppercase tracking-widest block font-bold">
              {isAr ? 'العلامات التجارية' : 'ANCHOR BRANDS'}
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-fb-white block">
              60+ Brands
            </span>
            <span className="text-[11px] text-fb-bg-light/65 block">
              {isAr ? 'سلاسل عالمية ومحلية شهيرة' : 'Top International Operators'}
            </span>
          </div>

          <div className="space-y-1 relative z-10 border-r md:border-r border-fb-green/15 pr-4 rtl:border-r-0 rtl:border-l rtl:pl-4">
            <span className="text-[10px] text-fb-green font-mono uppercase tracking-widest block font-bold">
              {isAr ? 'نسبة الإشغال الكلية' : 'OCCUPANCY RATE'}
            </span>
            <span className="text-2xl md:text-3xl font-extrabold text-fb-green block">
              100%
            </span>
            <span className="text-[11px] text-fb-bg-light/65 block">
              {isAr ? 'إشغال كامل للمشاريع العاملة' : 'Full Leasing Efficiency'}
            </span>
          </div>
        </div>

        {/* Interactive Strategic Projects Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-fb-bg-light/90 border border-fb-teal/15 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_20px_45px_rgba(83,179,121,0.18)] hover:border-fb-green hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                onClick={() => onSelectProject && onSelectProject(proj)}
              >
                {/* Top Image / Visual Preview Card Header */}
                <div className="relative h-48 w-full bg-fb-teal overflow-hidden">
                  {proj.coverImage ? (
                    <img
                      src={proj.coverImage}
                      alt={getField(proj, 'name')}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-fb-teal to-[#002627] flex items-center justify-center p-6 text-center">
                      <Building2 size={40} className="text-fb-green opacity-40 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-fb-teal via-fb-teal/40 to-transparent" />

                  {/* City Badge & Status Chip */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="inline-flex items-center space-x-1.5 rtl:space-x-reverse text-[11px] font-bold text-fb-white bg-fb-teal/80 backdrop-blur-md px-3 py-1 rounded-full border border-fb-white/10 shadow-md">
                      <MapPin size={12} className="text-fb-green" />
                      <span>{getField(proj, 'city')}</span>
                    </span>

                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-sm ${
                      proj.status === 'Operational'
                        ? 'bg-fb-green text-fb-teal border-fb-green'
                        : 'bg-amber-400 text-slate-900 border-amber-300'
                    }`}>
                      {proj.status === 'Operational' ? (isAr ? 'تشغيل' : 'Operational') : (isAr ? 'قيد التطوير' : proj.status)}
                    </span>
                  </div>

                  {/* Title overlay at bottom of image */}
                  <div className="absolute bottom-3 left-4 right-4 z-10">
                    <h3 className="text-lg font-black text-fb-white leading-tight drop-shadow-md truncate">
                      {getField(proj, 'name')}
                    </h3>
                  </div>
                </div>

                {/* Card Content & Metrics */}
                <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                  
                  {/* Overview Text */}
                  <p className="text-xs md:text-sm text-fb-black/75 leading-relaxed line-clamp-2">
                    {getField(proj, 'overview')}
                  </p>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-fb-teal/5">
                    <div className="bg-fb-bg-light/80 p-2.5 rounded-xl border border-fb-teal/5 space-y-0.5">
                      <span className="text-[9.5px] text-fb-black/50 font-bold uppercase block">
                        {isAr ? 'مساحة المباني GLA' : 'GLA AREA'}
                      </span>
                      <span className="text-xs font-extrabold text-fb-teal block">
                        {proj.metrics?.gla}
                      </span>
                    </div>

                    <div className="bg-fb-bg-light/80 p-2.5 rounded-xl border border-fb-teal/5 space-y-0.5">
                      <span className="text-[9.5px] text-fb-black/50 font-bold uppercase block">
                        {isAr ? 'مرور يومي' : 'TRAFFIC CATCHMENT'}
                      </span>
                      <span className="text-xs font-extrabold text-fb-teal block truncate">
                        {getField(proj.mapInfo, 'catchment')?.split(' ')[0] || '100,000+'}
                      </span>
                    </div>
                  </div>

                  {/* Hosted Brand Chips */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-fb-teal/80 flex items-center space-x-1 rtl:space-x-reverse">
                      <Store size={12} className="text-fb-green" />
                      <span>{isAr ? 'أبرز العلامات التجارية:' : 'Featured Brands:'}</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {proj.brands?.slice(0, 4).map((brand, bIdx) => (
                        <span
                          key={bIdx}
                          className="text-[10px] font-semibold bg-fb-teal/5 text-fb-teal px-2 py-0.5 rounded border border-fb-teal/10"
                        >
                          {brand}
                        </span>
                      ))}
                      {proj.brands?.length > 4 && (
                        <span className="text-[10px] font-bold bg-fb-green/10 text-fb-green px-1.5 py-0.5 rounded">
                          +{proj.brands.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-3 border-t border-fb-teal/10 flex items-center justify-between text-xs font-bold text-fb-teal group-hover:text-fb-green transition-colors">
                    <span>{isAr ? 'استكشاف تفاصيل المحطة' : 'Explore Hub Details'}</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
