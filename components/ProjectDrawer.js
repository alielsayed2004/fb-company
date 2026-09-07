'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Layout, Maximize2, Users, ArrowUpRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

export default function ProjectDrawer({ project: initialProject, onClose }) {
  const { locale, t } = useLanguage();
  const { projects } = useData();

  const project = (projects && projects.find(p => p.id === initialProject?.id)) || initialProject;

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  // Support ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const mockGalleryColors = [
    "from-slate-700 to-teal-900",
    "from-teal-900 to-emerald-950",
    "from-zinc-800 to-slate-950",
    "from-teal-800 to-cyan-950"
  ];

  const getField = (obj, field) => {
    if (locale === 'ar') {
      return obj[`${field}_ar`] || obj[field];
    }
    return obj[field];
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-fb-black/60 backdrop-blur-sm transition-opacity"
        />

        {/* Drawer container */}
        <div className={`absolute inset-y-0 ${locale === 'ar' ? 'left-0 pr-10' : 'right-0 pl-10'} max-w-full flex`}>
          <motion.div
            initial={{ opacity: 0, x: locale === 'ar' ? -80 : 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: locale === 'ar' ? -80 : 80 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="w-screen max-w-2xl bg-fb-bg-light shadow-2xl flex flex-col h-full"
          >
            {/* Drawer Header & Actions */}
            <div className={`absolute top-4 ${locale === 'ar' ? 'left-4' : 'right-4'} z-30`}>
              <button
                onClick={onClose}
                className="bg-fb-black/40 hover:bg-fb-black/70 text-fb-white p-2.5 rounded-full backdrop-blur-md transition-colors"
                aria-label="Close panel"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              
              {/* Project Hero Block */}
              <div className={`relative h-80 md:h-96 bg-gradient-to-br ${project.coverColor || 'from-teal-800 to-teal-950'} flex flex-col justify-end p-8 text-fb-white overflow-hidden border-b border-fb-teal/20`}>
                {/* Background Video */}
                <video
                  key={project.video || '/videos/hero-bg.mp4'}
                  src={project.video || '/videos/hero-bg.mp4'}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={project.coverImage || `/projects/${project.id}/cover.jpg`}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none z-0"
                />
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-fb-teal/90 via-fb-teal/40 to-fb-teal/50 mix-blend-multiply z-0 pointer-events-none" />

                {/* Tech grid aesthetic overlay */}
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:16px_16px] z-0" />
                
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="bg-fb-green/20 text-fb-green border border-fb-green/30 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {project.status === 'Operational' ? (locale === 'ar' ? 'تشغيل ممتاذ' : 'Operational') : (locale === 'ar' ? 'قيد التطوير' : project.status)}
                    </span>
                    <span className="text-xs text-fb-bg-light/60 flex items-center">
                      <MapPin size={12} className="mr-1 ml-1 shrink-0" />
                      {getField(project, 'city')}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-fb-white tracking-tight">
                    {(() => {
                      const name = getField(project, 'name');
                      const match = name.match(/^(.*?)\s*(\(.*?\))\s*$/);
                      if (match) {
                        return (
                          <>
                            <span className="block">{match[1]}</span>
                            <span className="block">{match[2]}</span>
                          </>
                        );
                      }
                      return name;
                    })()}
                  </h2>
                  <p className="text-xs text-fb-bg-light/75 max-w-md">{getField(project, 'location')}</p>
                </div>
              </div>

              {/* Body Wrapper */}
              <div className="p-8 space-y-8">
                
                {/* Overview */}
                <div className="space-y-3">
                  <h4 className="text-fb-teal font-bold uppercase tracking-wider text-xs">{t('projectDetails.overview')}</h4>
                  <p className="text-fb-black/85 text-sm md:text-base leading-relaxed">
                    {getField(project, 'overview')}
                  </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="space-y-3">
                  <h4 className="text-fb-teal font-bold uppercase tracking-wider text-xs">{t('projectDetails.metrics')}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-fb-bg-light/90 border border-fb-teal/15 p-4 rounded-2xl shadow-xs hover:border-fb-green transition-all">
                      <Maximize2 size={18} className="text-fb-green mb-1.5" />
                      <span className="text-[10px] text-fb-black/50 block font-bold uppercase tracking-wider">{t('projectDetails.landArea')}</span>
                      <span className="text-sm font-extrabold text-fb-teal font-mono">{project.metrics.landArea}</span>
                    </div>
                    <div className="bg-fb-bg-light/90 border border-fb-teal/15 p-4 rounded-2xl shadow-xs hover:border-fb-green transition-all">
                      <Users size={18} className="text-fb-green mb-1.5" />
                      <span className="text-[10px] text-fb-black/50 block font-bold uppercase tracking-wider">{t('projectDetails.brands')}</span>
                      <span className="text-sm font-extrabold text-fb-teal font-mono">{project.metrics.numBrands} {locale === 'ar' ? 'علامات' : 'Brands'}</span>
                    </div>
                    <div className="bg-fb-bg-light/90 border border-fb-teal/15 p-4 rounded-2xl shadow-xs hover:border-fb-green transition-all">
                      <TrendingUp size={18} className="text-fb-green mb-1.5" />
                      <span className="text-[10px] text-fb-black/50 block font-bold uppercase tracking-wider">{t('projectDetails.occupancy')}</span>
                      <span className="text-sm font-extrabold text-fb-teal font-mono">{project.metrics.occupancyRate === 'Pending' ? (locale === 'ar' ? 'قيد التخصيص' : 'Pending') : project.metrics.occupancyRate}</span>
                    </div>
                    <div className="bg-fb-bg-light/90 border border-fb-teal/15 p-4 rounded-2xl shadow-xs hover:border-fb-green transition-all">
                      <Calendar size={18} className="text-fb-green mb-1.5" />
                      <span className="text-[10px] text-fb-black/50 block font-bold uppercase tracking-wider">{t('projectDetails.yearBuilt')}</span>
                      <span className="text-sm font-extrabold text-fb-teal font-mono">{project.metrics.openingYear}</span>
                    </div>
                  </div>
                </div>

                {/* Tenant Directory */}
                <div className="space-y-3">
                  <h4 className="text-fb-teal font-extrabold uppercase tracking-wider text-xs">{t('home.caseStudy.parameters')}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {project.brands.map((brand) => (
                      <div
                        key={brand}
                        className="bg-fb-bg-light/90 border border-fb-teal/15 rounded-2xl px-4 py-3 flex flex-col items-center justify-center text-center space-y-1.5 font-bold text-xs text-fb-teal shadow-xs hover:border-fb-green hover:shadow-sm transition-all min-h-20"
                      >
                        <BrandLogo name={brand} className="h-6 w-auto text-fb-teal/70 fill-current" />
                        <span className="text-[11px] text-fb-teal/80 font-bold">{brand}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Horizontal Project Gallery */}
                <div className="space-y-3">
                  <h4 className="text-fb-teal font-extrabold uppercase tracking-wider text-xs">{t('projectDetails.visualDoc')}</h4>
                  <div className={`flex space-x-4 ${locale === 'ar' ? 'space-x-reverse' : ''} overflow-x-auto pb-3 snap-x scrollbar-thin scrollbar-thumb-fb-teal`}>
                    {mockGalleryColors.map((colorClass, index) => (
                      <div
                        key={index}
                        className={`flex-none w-64 h-36 bg-gradient-to-br ${colorClass} rounded-2xl snap-start flex items-center justify-center text-fb-white/30 text-xs font-bold`}
                      >
                        {locale === 'ar' ? `[عرض المشروع ${index + 1}]` : `[Project View ${index + 1}]`}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Snapshot */}
                <div className="space-y-3 text-start">
                  <h4 className="text-fb-teal font-extrabold uppercase tracking-wider text-xs">{t('projectDetails.locIntel')}</h4>
                  <div className="bg-fb-bg-light/90 border border-fb-teal/15 rounded-3xl p-5 shadow-xs space-y-4 text-start">
                    <div className="flex items-start gap-3.5 text-start">
                      <div className="w-9 h-9 rounded-xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center shrink-0 text-fb-green mt-0.5">
                        <MapPin size={18} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 text-start space-y-0.5">
                        <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">{t('projectDetails.trafficAxis')}</span>
                        <p className="text-sm font-semibold text-fb-teal">{getField(project.mapInfo, 'road') || (locale === 'ar' ? 'الممر الرئيسي' : 'Main Corridor')}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-fb-teal/10 pt-4 text-start">
                      <div className="text-start space-y-0.5">
                        <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">{t('projectDetails.catchment')}</span>
                        <p className="text-xs font-semibold text-fb-teal">{getField(project.mapInfo, 'catchment') || (locale === 'ar' ? 'حجم تدفق عالي' : 'High Volume')}</p>
                      </div>
                      <div className="text-start space-y-0.5">
                        <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">{t('projectDetails.sourcingPeak')}</span>
                        <p className="text-xs font-semibold text-fb-teal">{getField(project.mapInfo, 'peakHours') || (locale === 'ar' ? 'أوقات العمل القياسية' : 'Standard Business Hours')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Callout */}
                <div className="bg-fb-teal text-fb-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
                  <div className="space-y-1">
                    <h5 className="font-bold text-fb-white text-sm md:text-base">{t('projectDetails.similarOpp')}</h5>
                    <p className="text-xs text-fb-bg-light/75">{t('projectDetails.similarOppDesc')}</p>
                  </div>
                  <Link
                    href={`/contact?interest=sourcing&project=${project.id}`}
                    onClick={onClose}
                    className="flex items-center space-x-1.5 rtl:space-x-reverse bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors shrink-0 shadow-md"
                  >
                    <span>{t('projectDetails.bookConsultation')}</span>
                    <ArrowUpRight size={14} className="shrink-0" />
                  </Link>
                </div>

              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
