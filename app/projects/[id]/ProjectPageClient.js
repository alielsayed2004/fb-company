'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Layout, Maximize2, Users, ArrowUpRight, TrendingUp, Camera, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

export default function ProjectPageClient({ project: initialProject }) {
  const { locale, t } = useLanguage();
  const { projects } = useData();

  const project = (projects && projects.find(p => p.id === initialProject?.id)) || initialProject;

  if (!project) {
    return (
      <div className="min-h-screen bg-fb-bg-light flex flex-col items-center justify-center p-6">
        <h2 className="text-fb-teal font-extrabold text-2xl mb-4">{t('common.projectNotFound')}</h2>
        <Link href="/" className="text-fb-green hover:underline flex items-center space-x-2">
          <ArrowLeft size={16} />
          <span>{t('common.backToHome')}</span>
        </Link>
      </div>
    );
  }

  const mockGalleryColors = [
    "from-slate-700 to-teal-900",
    "from-teal-900 to-emerald-950",
    "from-zinc-800 to-slate-950",
    "from-teal-800 to-cyan-950"
  ];

  const galleryItems = project.gallery && project.gallery.length > 0 ? project.gallery : [];

  // Smart dynamic grid layout helper based on image count
  const getGridClass = (count) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2";
    if (count === 3) return "grid-cols-1 sm:grid-cols-3";
    if (count === 4) return "grid-cols-1 sm:grid-cols-2";
    return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const getField = (obj, field) => {
    if (!obj) return '';
    if (locale === 'ar') {
      return obj[`${field}_ar`] || obj[field];
    }
    return obj[field];
  };

  const renderProjectTitle = (rawName) => {
    if (!rawName) return '';
    const match = rawName.match(/^(.*?)\s*(\(.*?\))\s*$/);
    if (match) {
      const mainTitle = match[1];
      const subtitle = match[2];
      return (
        <>
          <span className="block">{mainTitle}</span>
          <span className="block">{subtitle}</span>
        </>
      );
    }
    return rawName;
  };

  return (
    <div className="flex flex-col min-h-screen bg-fb-bg-light">
      
      {/* 1. FULLSCREEN HERO HEADER */}
      <section className={`relative min-h-screen flex flex-col justify-between pt-28 pb-8 md:pb-12 bg-gradient-to-br ${project.coverColor || 'from-teal-800 to-teal-950'} text-fb-white overflow-hidden border-b border-fb-teal/20`}>
        {/* Background Video */}
        <video
          key={project.id}
          autoPlay
          loop
          muted
          playsInline
          poster={project.coverImage || `/projects/${project.id}/cover.jpg`}
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none z-0 scale-105 transition-transform duration-1000"
        >
          {project.video && <source src={project.video} type="video/mp4" />}
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay to protect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-fb-teal/90 via-fb-teal/50 to-fb-teal/60 mix-blend-multiply z-0 pointer-events-none" />

        {/* Tech grid overlay */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px] z-0" />
        
        {/* Top bar inside hero: Back link */}
        <div className="max-w-6xl mx-auto px-6 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: locale === 'ar' ? 15 : -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/#portfolio" className="inline-flex items-center space-x-2 text-fb-green hover:text-white bg-fb-black/30 hover:bg-fb-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-wider transition-all">
              <ArrowLeft size={14} className="mr-1.5 ml-1.5" />
              <span>{t('projectDetails.backToDevelopments')}</span>
            </Link>
          </motion.div>
        </div>

        {/* Main Content inside hero */}
        <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-4 w-full text-start my-auto py-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center space-x-3 justify-start flex-wrap gap-y-2"
          >
            <span className="bg-fb-green text-fb-teal text-xs font-extrabold px-3.5 py-1 rounded-md tracking-wider uppercase shadow-md">
              {project.status === 'Operational' ? (locale === 'ar' ? 'تشغيل ممتاز' : 'Operational') : (locale === 'ar' ? 'تحت الإنشاء' : project.status)}
            </span>
            <span className="text-sm text-fb-bg-light/90 font-medium flex items-center bg-white/10 backdrop-blur-md px-3 py-1 rounded-md border border-white/10">
              <MapPin size={14} className="mr-1.5 ml-1.5 text-fb-green shrink-0" />
              {getField(project, 'city')}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            className="text-fb-white font-extrabold tracking-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] max-w-5xl drop-shadow-lg select-none [hyphens:none]"
          >
            {renderProjectTitle(getField(project, 'name'))}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-sm md:text-lg text-fb-bg-light/90 max-w-2xl font-medium leading-relaxed drop-shadow"
          >
            {getField(project, 'location')}
          </motion.p>
        </div>

        {/* Bottom Hero Anchor / Scroll Indicator */}
        <div className="max-w-6xl mx-auto px-6 relative z-10 w-full flex items-center justify-between pb-2">
          <div className="hidden sm:flex items-center space-x-4 rtl:space-x-reverse text-xs text-white/60 font-mono">
            <span>{project.metrics?.landArea}</span>
            <span>•</span>
            <span>{project.metrics?.numBrands || project.brands?.length} {locale === 'ar' ? 'علامات' : 'Brands'}</span>
          </div>

          {/* Centered Explore Details Indicator */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex justify-center">
            <motion.button
              type="button"
              onClick={() => {
                const el = document.getElementById('project-content');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center space-x-2 rtl:space-x-reverse text-fb-green hover:text-white bg-fb-black/35 hover:bg-fb-black/60 backdrop-blur-md px-5 py-2 rounded-full border border-fb-green/30 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              <span>{locale === 'ar' ? 'تفاصيل المشروع' : 'Explore Details'}</span>
              <ChevronDown size={15} className="text-fb-green" />
            </motion.button>
          </div>

          <div className="hidden sm:block w-28" />
        </div>
      </section>

      {/* 2. BODY CONTENT */}
      <section id="project-content" className="py-16 px-6 relative z-10 max-w-6xl mx-auto w-full text-fb-teal">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12"
        >
          
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Overview */}
            <motion.div 
              variants={itemVariants}
              className="space-y-4 bg-fb-bg-light/90 p-8 rounded-3xl border border-fb-teal/15 shadow-[0_8px_30px_rgba(0,59,60,0.05)]"
            >
              <h4 className="text-fb-teal font-extrabold uppercase tracking-wider text-xs border-b border-fb-teal/5 pb-3">{t('projectDetails.overview')}</h4>
              <p className="text-fb-black/85 text-base md:text-lg leading-relaxed">
                {getField(project, 'overview')}
              </p>
            </motion.div>

            {/* Key Metrics Grid */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="text-fb-teal font-extrabold uppercase tracking-wider text-xs">{t('projectDetails.metrics')}</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: t('projectDetails.landArea'), val: project.metrics?.landArea, icon: <Maximize2 className="text-fb-green" size={20} /> },
                  { label: t('projectDetails.brands'), val: `${project.metrics?.numBrands || project.brands?.length || 0} ${locale === 'ar' ? 'علامات' : 'Brands'}`, icon: <Users className="text-fb-green" size={20} /> },
                  { label: t('projectDetails.occupancy'), val: project.metrics?.occupancyRate === 'Pending' ? (locale === 'ar' ? 'قيد التخصيص' : 'Pending') : project.metrics?.occupancyRate, icon: <TrendingUp className="text-fb-green" size={20} /> },
                  { label: t('projectDetails.yearBuilt'), val: project.metrics?.openingYear, icon: <Calendar className="text-fb-green" size={20} /> }
                ].map((m, idx) => (
                  <div key={idx} className="bg-fb-bg-light/90 border border-fb-teal/15 p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[120px] hover:border-fb-green hover:shadow-md transition-all duration-300">
                    <div className="p-2.5 bg-fb-teal/5 rounded-lg inline-block self-start mb-2">{m.icon}</div>
                    <div>
                      <span className="text-[10px] text-fb-black/50 block font-bold uppercase tracking-wider">{m.label}</span>
                      <span className="text-base font-extrabold text-fb-teal font-mono">{m.val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Smart Project Gallery */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="text-fb-teal font-extrabold uppercase tracking-wider text-xs flex items-center gap-2">
                <Camera size={16} className="text-fb-green" />
                <span>{t('projectDetails.visualDoc')} ({galleryItems.length > 0 ? galleryItems.length : 4})</span>
              </h4>

              {galleryItems.length > 0 ? (
                /* Smart Dynamic Layout based on image count */
                <div className={`grid ${getGridClass(galleryItems.length)} gap-4`}>
                  {galleryItems.map((imgSrc, index) => (
                    <div
                      key={index}
                      className="h-56 sm:h-64 rounded-2xl overflow-hidden border border-fb-teal/10 shadow-sm hover:scale-[1.01] transition-all duration-300 relative group bg-fb-teal/5"
                    >
                      <img
                        src={imgSrc}
                        alt={`${getField(project, 'name')} Photo ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                /* Mockup fallback if no custom gallery photos added yet */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mockGalleryColors.map((colorClass, index) => (
                    <div
                      key={index}
                      className={`h-48 bg-gradient-to-br ${colorClass} rounded-2xl flex items-center justify-center text-fb-white/20 text-xs font-bold border border-fb-teal/5 shadow-sm hover:scale-[1.01] transition-transform duration-300`}
                    >
                      {locale === 'ar' ? `[كاميرا أصول المشروع ${index + 1}]` : `[Asset Camera View ${index + 1}]`}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

          </div>

          {/* Right Column: Sourcing Info & CTA */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sourcing Location Info */}
            <motion.div 
              variants={itemVariants}
              className="bg-fb-bg-light/90 border border-fb-teal/15 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,59,60,0.05)] space-y-5 text-start"
            >
              <h4 className="text-fb-teal font-extrabold uppercase tracking-wider text-xs border-b border-fb-teal/5 pb-3">{t('projectDetails.locIntel')}</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3.5 text-start">
                  <div className="w-9 h-9 rounded-xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center shrink-0 text-fb-green mt-0.5">
                    <MapPin size={18} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 text-start space-y-0.5">
                    <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">{t('projectDetails.trafficAxis')}</span>
                    <p className="text-sm font-semibold text-fb-teal leading-snug">{getField(project.mapInfo, 'road') || (locale === 'ar' ? 'ممر رئيسي' : 'Main Corridor')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-start">
                  <div className="w-9 h-9 rounded-xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center shrink-0 text-fb-green mt-0.5">
                    <TrendingUp size={18} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 text-start space-y-0.5">
                    <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">{t('projectDetails.catchment')}</span>
                    <p className="text-sm font-semibold text-fb-teal leading-snug">{getField(project.mapInfo, 'catchment') || (locale === 'ar' ? 'تدفق عالي' : 'High Volume Flows')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-start">
                  <div className="w-9 h-9 rounded-xl bg-fb-teal/5 border border-fb-teal/10 flex items-center justify-center shrink-0 text-fb-green mt-0.5">
                    <Calendar size={18} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 text-start space-y-0.5">
                    <span className="text-[10px] text-slate-500 block font-bold uppercase tracking-wider">{t('projectDetails.sourcingPeak')}</span>
                    <p className="text-sm font-semibold text-fb-teal leading-snug">{getField(project.mapInfo, 'peakHours') || (locale === 'ar' ? 'أوقات الذروة والنشاط' : 'Peak Sourcing Hours')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tenants strip */}
            {project.brands && project.brands.length > 0 && (
              <motion.div 
                variants={itemVariants}
                className="bg-fb-bg-light/90 border border-fb-teal/15 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,59,60,0.05)] space-y-4"
              >
                <h4 className="text-fb-teal font-extrabold uppercase tracking-wider text-xs border-b border-fb-teal/5 pb-3">{t('projectDetails.securedCovenants')} ({project.brands.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {project.brands.map((brand) => (
                    <span 
                      key={brand}
                      className="bg-fb-bg-light/50 text-fb-teal text-xs font-semibold px-3 py-1.5 rounded-lg border border-fb-teal/5 hover:border-fb-green/30 transition-colors"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Consultation panel */}
            <motion.div 
              variants={itemVariants}
              className="bg-fb-teal text-fb-white rounded-2xl p-6 shadow-lg space-y-4 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-5 grid-bg-overlay pointer-events-none" />
              <h5 className="font-extrabold text-fb-white text-lg tracking-tight z-10 relative">{t('projectDetails.sourcingOpp')}</h5>
              <p className="text-xs text-fb-bg-light/80 leading-relaxed z-10 relative">
                {t('projectDetails.sourcingOppDesc').replace('{name}', getField(project, 'name'))}
              </p>
              <Link
                href={`/contact?interest=sourcing&project=${project.id}`}
                className="w-full flex items-center justify-center space-x-2 bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold py-3.5 rounded-lg text-xs transition-colors shadow-md uppercase tracking-wider z-10 relative"
              >
                <span>{t('projectDetails.consultBtn')}</span>
                <ArrowUpRight size={14} className="ml-1 mr-1" />
              </Link>
            </motion.div>

          </div>
          
        </motion.div>
      </section>
    </div>
  );
}
