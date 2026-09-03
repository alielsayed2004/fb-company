'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Layers, CheckCircle, ArrowUpRight, Camera, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

export default function PortfolioTimeline() {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const prefersReducedMotion = useReducedMotion();
  const { locale, t } = useLanguage();
  const { projects: projectsData } = useData();

  const getBusinessLineTag = (idx) => {
    return idx % 2 === 0 ? t('nav.assetManagement') : t('nav.franchiseSourcing');
  };

  const handleRowClick = (idx) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const getField = (obj, field) => {
    if (locale === 'ar') {
      return obj[`${field}_ar`] || obj[field];
    }
    return obj[field];
  };

  return (
    <section className="py-24 bg-fb-bg-light/50 text-fb-teal border-b border-fb-teal/5 relative overflow-hidden" id="portfolio">
      <div className="absolute inset-0 opacity-10 grid-bg-white pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="eyebrow text-fb-green font-bold">{t('home.timeline.eyebrow')}</span>
          <h2 className="text-fb-teal font-extrabold tracking-tight text-3xl md:text-4xl lg:text-5xl">{t('home.timeline.title')}</h2>
          <p className="text-fb-teal/65 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {t('home.timeline.desc')}
          </p>
        </div>

        {/* Timeline List Container */}
        <div className="space-y-0">
          {projectsData.map((project, idx) => {
            const isExpanded = expandedIndex === idx;
            const businessLine = getBusinessLineTag(idx);
            
            // Stagger & motion configs
            const rowDelay = prefersReducedMotion ? 0 : idx * 0.08;
            
            const namePart = getField(project, 'name');
            const cityPart = getField(project, 'city');
            const catchmentText = locale === 'ar' 
              ? `${project.metrics.numBrands} علامات تجارية مؤجرة، تخدم ${getField(project.mapInfo, 'catchment') || 'محيط استثماري مروري مرتفع'}`
              : `${project.metrics.numBrands} covenant brands active on site, serving ${getField(project.mapInfo, 'catchment') || 'high transit corridor catchment'}.`;

            return (
              <motion.div
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: rowDelay, 
                  ease: [0.4, 0, 0.2, 1] 
                }}
                key={project.id}
                className="border-b border-fb-teal/10 block group"
              >
                {/* Clickable Header Row */}
                <div
                  onClick={() => handleRowClick(idx)}
                  className="py-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
                >
                  {/* Left Block: Title, Location, Subtext, Description */}
                  <div className="space-y-2 flex-grow">
                    
                    {/* Title + Location Row */}
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="text-fb-green font-extrabold text-lg md:text-xl relative inline-block transition-colors duration-300 group-hover:text-fb-green-hover">
                        {namePart}
                        {/* Underline Animation on Hover */}
                        <span className="absolute bottom-0 left-0 rtl:left-auto rtl:right-0 w-0 h-0.5 bg-fb-green transition-all duration-300 group-hover:w-full" />
                      </span>
                      <span className="text-fb-teal/80 text-sm font-medium flex items-center">
                        <MapPin size={13} className="mr-1 ml-1 text-fb-green shrink-0" />
                        {cityPart}
                      </span>
                    </div>

                    {/* Subtext Row */}
                    <div className="text-xs font-semibold text-fb-teal/70 flex items-center space-x-2 rtl:space-x-reverse">
                      <span>{project.status === 'Operational' ? (locale === 'ar' ? 'تشغيل ممتاز' : 'Operational') : (locale === 'ar' ? 'قيد التطوير' : project.status)}</span>
                      <span>•</span>
                      <span>
                        {parseInt(project.metrics?.openingYear, 10) >= 2026 
                          ? (locale === 'ar' ? `تاريخ الإنجاز المتوقع: ` : `Expected Completion: `)
                          : (locale === 'ar' ? `سنة التأسيس: ` : `Established: `)}
                        <span className="font-mono font-bold text-fb-teal">{project.metrics?.openingYear || '2023'}</span>
                      </span>
                    </div>

                    {/* Description Sentence */}
                    <p className="text-xs md:text-sm text-fb-black/75 max-w-2xl leading-relaxed font-normal">
                      {catchmentText}
                    </p>

                  </div>

                  {/* Right Block: Interactive Photo Gallery Indicator (Icons Only) */}
                  <div className="flex items-center shrink-0 self-start md:self-center">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl border transition-all duration-300 shadow-xs ${
                        isExpanded
                          ? 'bg-fb-green text-fb-teal border-fb-green shadow-sm scale-105'
                          : 'bg-fb-bg-light/90 border-fb-teal/15 text-fb-teal group-hover:border-fb-green group-hover:bg-fb-green/15 group-hover:scale-105'
                      }`}
                    >
                      <Camera size={18} className={isExpanded ? 'text-fb-teal' : 'text-fb-green'} />
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center justify-center"
                      >
                        <ChevronDown size={15} className={isExpanded ? 'text-fb-teal' : 'text-fb-green'} />
                      </motion.div>
                    </div>
                  </div>

                </div>

                {/* Accordion Image Panel BELOW Row */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ 
                        height: "auto", 
                        opacity: 1,
                        transition: { height: { duration: prefersReducedMotion ? 0 : 0.4, ease: "easeOut" }, opacity: { duration: 0.35 } }
                      }}
                      exit={{ 
                        height: 0, 
                        opacity: 0,
                        transition: { height: { duration: prefersReducedMotion ? 0 : 0.35, ease: "easeIn" }, opacity: { duration: 0.25 } }
                      }}
                      className="overflow-hidden w-full"
                    >
                      {/* Image panel body wrapper */}
                      <div className="pb-8 pt-2">
                        <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden bg-fb-teal-light/5 border border-fb-teal/5 shadow-inner flex items-center justify-center group/panel">
                          
                          {project.coverImage ? (
                            <img
                              src={project.coverImage}
                              alt={getField(project, 'name')}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/panel:scale-105"
                            />
                          ) : (
                            <>
                              {/* Light gradient placeholder background */}
                              <div className="absolute inset-0 bg-gradient-to-br from-fb-bg-light/60 to-fb-teal/5" />
                              <div className="absolute inset-0 opacity-10 grid-bg-white pointer-events-none" />
                              
                              {/* Centered label */}
                              <motion.span
                                initial={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
                                className="text-fb-teal/35 font-mono text-sm tracking-widest relative z-10 select-none block"
                              >
                                {t('home.timeline.pending')}
                              </motion.span>
                            </>
                          )}

                          {/* Frosted Glass Stat Badges */}
                          <div className="absolute bottom-6 left-6 rtl:left-auto rtl:right-6 z-20 flex gap-2">
                            <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-fb-teal bg-fb-white/80 backdrop-blur-md border border-fb-teal/10 shadow-sm flex items-center space-x-1.5 rtl:space-x-reverse">
                              <CheckCircle size={13} className="text-fb-green shrink-0" />
                              <span>{project.metrics.occupancyRate || '100%'} {locale === 'ar' ? 'مؤجر بالكامل' : 'Occupied'}</span>
                            </span>
                          </div>

                          {/* Link Button */}
                          <div className="absolute bottom-6 right-6 rtl:right-auto rtl:left-6 z-20">
                            <Link
                              href={`/projects/${project.id}`}
                              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-lg uppercase tracking-wider"
                            >
                              <span>{t('common.openCaseStudy')}</span>
                              <ArrowUpRight size={14} className="shrink-0" />
                            </Link>
                          </div>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
