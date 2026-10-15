'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from '@/components/motion';
import { Shield, Compass, BookOpen, Layers, Users, Award, TrendingUp, Landmark, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import HeroVideo from '@/components/HeroVideo';
import { useData } from '@/context/DataContext';
import StatCounter from '@/components/StatCounter';
import { ENTITY } from '@/lib/schema';

const corporateEase = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: corporateEase }
  }
};

export default function About() {
  const { locale, t } = useLanguage();
  const { counters } = useData();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, []);

  const values = [
    {
      icon: <Shield strokeWidth={1.5} size={28} className="text-fb-green" />,
      watermark: <Shield size={110} />,
      title: t('about.values.0.title'),
      desc: t('about.values.0.desc'),
    },
    {
      icon: <Compass strokeWidth={1.5} size={28} className="text-fb-green" />,
      watermark: <Compass size={110} />,
      title: t('about.values.1.title'),
      desc: t('about.values.1.desc'),
    },
    {
      icon: <BookOpen strokeWidth={1.5} size={28} className="text-fb-green" />,
      watermark: <BookOpen size={110} />,
      title: t('about.values.2.title'),
      desc: t('about.values.2.desc'),
    },
    {
      icon: <Layers strokeWidth={1.5} size={28} className="text-fb-green" />,
      watermark: <Layers size={110} />,
      title: t('about.values.3.title'),
      desc: t('about.values.3.desc'),
    }
  ];

  // Years and events from the previous site copy — TO VERIFY with management (see audit report).
  const milestones = [
    {
      year: "2021",
      title: locale === 'ar' ? "التأسيس" : "Foundation",
      desc: locale === 'ar' ? "تأسيس شركة إف بي لتحديد مواقع تجارية غير مستغلة على طرق السفر والمحاور الرئيسية في مصر." : "F.B Company was founded to identify under-used commercial locations along Egypt's main roads and corridors."
    },
    {
      year: "2022",
      title: locale === 'ar' ? "الساحل الشمالي" : "North Coast",
      desc: locale === 'ar' ? "توفير موقع شيل أوت هب مارينا 5 وتأجيره لعلامات تجارية في قطاعَي الأغذية والتجزئة." : "Sourced Chillout Hub Marina 5 and leased it to food and retail brands."
    },
    {
      year: "2023",
      title: locale === 'ar' ? "العاشر من رمضان" : "10th of Ramadan",
      desc: locale === 'ar' ? "افتتاح موقع شيل أوت هب في مركز خدمات البنوك بمدينة العاشر من رمضان." : "Opened Chillout Hub at the Banks Service Center in 10th of Ramadan City."
    },
    {
      year: "2024",
      title: locale === 'ar' ? "القاهرة الكبرى" : "Greater Cairo",
      desc: locale === 'ar' ? "تطوير مواقع تجارية على أسوار أندية في مصر الجديدة (شيراتون) ومدينة العبور." : "Developed club-perimeter commercial locations in Heliopolis (Sheraton) and Obour City."
    },
    {
      year: "2026",
      title: locale === 'ar' ? "مشروعات قيد التنفيذ" : "Under Development",
      desc: locale === 'ar' ? "مول السلام بلازا قيد الإنشاء." : "El Salam Plaza Mall is under construction."
    }
  ];


  return (
    <div className="flex flex-col min-h-screen relative bg-fb-bg-light">
      
      {/* 1. HERO SECTION */}
      <section className="bg-fb-teal text-fb-white relative overflow-hidden flex flex-col justify-center min-h-[100dvh] h-[100dvh] min-h-screen h-screen shrink-0 px-4 sm:px-6">
        {/* Background Video */}
        <HeroVideo src="/videos/about.mp4" poster="/videos/about-poster.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none z-0 scale-105" />
        {/* Dark Overlay to protect text contrast */}
        <div className="absolute inset-0 bg-fb-teal/60 mix-blend-multiply z-0 pointer-events-none" />

        {/* Standardized Hero Grid Overlay */}
        <div className="absolute inset-0 hero-grid-overlay pointer-events-none z-0" />
        
        {/* Glowing floating blur objects */}
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-fb-green/10 rounded-full blur-3xl pointer-events-none" 
        />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.05 }
            }
          }}
          className="max-w-5xl mx-auto z-10 relative space-y-4 w-full text-start"
        >
          <motion.span 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: corporateEase } }
            }}
            className="eyebrow text-fb-green font-bold block text-xs tracking-wider"
          >
            {t('about.eyebrow')}
          </motion.span>
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: corporateEase } }
            }}
            className="!text-fb-bg-light max-w-2xl font-extrabold leading-snug tracking-tight text-xl sm:text-2xl md:text-[1.85rem] lg:text-[2.05rem] text-balance"
          >
            {t('about.title1')}
            <br className="hidden sm:inline" />{" "}
            {t('about.title2')}
          </motion.h1>
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: corporateEase } }
            }}
            className="text-fb-bg-light/85 text-xs sm:text-sm md:text-[15px] max-w-lg leading-relaxed font-normal"
          >
            {ENTITY[locale === 'ar' ? 'ar' : 'en']}
          </motion.p>
        </motion.div>
      </section>

      {/* 2. STATS SECTION (Large Numeric Statistics) */}
      <section className="py-12 sm:py-20 bg-fb-bg-light border-y border-fb-bg-light relative">
        <div className="absolute inset-0 opacity-20 grid-bg-white pointer-events-none" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10"
        >
          <div className="text-center mb-10 sm:mb-16 space-y-2.5 sm:space-y-3">
            <span className="eyebrow">{locale === 'ar' ? 'أرقام رئيسية' : 'Key Figures'}</span>
            <h2 className="text-fb-teal font-extrabold tracking-tight text-2xl sm:text-3xl md:text-4xl text-balance">{t('about.metricsTitle')}</h2>
          </div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8"
          >
            {[
              { label: t('about.metrics.locations'), value: counters?.locations, icon: <Landmark strokeWidth={1.5} className="text-fb-teal" size={24} aria-hidden="true" /> },
              { label: t('about.metrics.brands'), value: counters?.brands, icon: <Users strokeWidth={1.5} className="text-fb-teal" size={24} aria-hidden="true" /> },
              { label: t('about.metrics.area'), value: counters?.area, icon: <Layers strokeWidth={1.5} className="text-fb-teal" size={24} aria-hidden="true" /> }
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="min-w-0 bg-fb-bg-light/90 border border-fb-teal/15 p-5 lg:p-8 rounded-2xl sm:rounded-3xl text-center space-y-3 sm:space-y-4 shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:border-fb-green hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 start-0 w-1.5 h-full bg-fb-teal group-hover:bg-fb-green transition-colors" />
                <div className="p-2.5 sm:p-3 bg-fb-teal/5 border border-fb-teal/10 rounded-xl inline-block group-hover:bg-fb-green/10 transition-colors">{stat.icon}</div>
                <div className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-fb-teal tracking-tight block whitespace-nowrap">
                  <StatCounter value={stat.value} />
                </div>
                <p className="text-sm font-bold text-slate-700">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 3. CORE VALUES SECTION */}
      <section className="py-12 sm:py-20 md:py-24 bg-fb-bg-light/40 border-b border-fb-teal/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-16">
          <div className="text-center space-y-2.5 sm:space-y-3">
            <span className="eyebrow">{t('about.valuesSubtitle')}</span>
            <h2 className="text-fb-teal font-extrabold tracking-tight text-2xl sm:text-3xl md:text-4xl text-balance">{t('about.valuesTitle')}</h2>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
          >
            {values.map((val, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="bg-fb-bg-light/90 border border-fb-teal/15 rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col justify-start items-center text-center shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:border-fb-green hover:-translate-y-1.5 transition-all duration-300 group min-h-[230px] sm:min-h-[300px] space-y-4 sm:space-y-6 relative overflow-hidden"
              >
                {/* Large Background Overlay Watermark Icon */}
                <div className="absolute -bottom-5 -right-5 rtl:-left-5 rtl:right-auto text-fb-teal/[0.05] group-hover:text-fb-green/[0.12] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
                  {val.watermark}
                </div>

                {/* Standardized Static Frosted Icon Container */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-fb-teal/5 border border-fb-teal/10 rounded-2xl p-3 sm:p-4 text-fb-green group-hover:bg-fb-green/10 group-hover:border-fb-green/30 transition-colors duration-300 relative z-10">
                  {val.icon}
                </div>

                <div className="space-y-2 sm:space-y-3 w-full relative z-10">
                  <h3 className="font-extrabold text-fb-teal text-base sm:text-lg md:text-xl tracking-tight leading-snug">{val.title}</h3>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. COMPANY TIMELINE STORY */}
      <section className="py-24 bg-fb-bg-light relative overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-4xl mx-auto px-6"
        >
          <div className="text-center mb-16 space-y-3">
            <span className="eyebrow">{t('about.timelineSubtitle')}</span>
            <h2 className="text-fb-teal font-extrabold tracking-tight text-3xl md:text-4xl">{t('about.timelineTitle')}</h2>
          </div>

          {/* Timeline Wrapper */}
          <motion.div 
            variants={containerVariants}
            className={`relative border-fb-teal/10 ${locale === 'ar' ? 'border-r-2 pr-6 md:pr-10' : 'border-l-2 pl-6 md:pl-10'} space-y-12`}
          >
            {milestones.map((milestone, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="relative space-y-2 group"
              >
                {/* Timeline Bullet */}
                <div className={`absolute ${locale === 'ar' ? '-right-[35px] md:-right-[51px]' : '-left-[35px] md:-left-[51px]'} top-1.5 w-4 h-4 rounded-full bg-fb-white border-2 border-fb-teal group-hover:border-fb-green group-hover:scale-125 transition-all duration-300 shadow-sm`} />
                
                <span className="text-3xl font-extrabold text-fb-green block tracking-tight group-hover:translate-x-1 transition-transform">{milestone.year}</span>
                <h3 className="text-fb-teal font-bold text-lg md:text-xl tracking-tight leading-snug">{milestone.title}</h3>
                <p className="text-slate-700 text-sm md:text-base leading-relaxed max-w-2xl">{milestone.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 5. EXECUTIVE LEADERSHIP */}
      <section className="py-20 bg-fb-teal text-fb-bg-light text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 grid-bg-overlay pointer-events-none" />
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-4xl mx-auto px-6 space-y-6 relative z-10"
        >
          <motion.span variants={itemVariants} className="eyebrow text-fb-green font-bold block">{t('about.teamSubtitle')}</motion.span>
          <motion.h2 variants={itemVariants} className="text-fb-bg-light font-extrabold tracking-tight text-2xl sm:text-3xl md:text-4xl">{t('about.teamTitle')}</motion.h2>
          <motion.p variants={itemVariants} className="text-fb-bg-light/85 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-normal">
            {t('about.teamDesc')}
          </motion.p>
          <motion.div variants={itemVariants} className="pt-2">
            <div className="inline-flex items-center gap-2 bg-fb-teal-light/40 border border-fb-bg-light/15 rounded-full px-5 py-2.5">
              <CheckCircle2 size={16} className="text-fb-green" />
              <span className="text-xs font-bold text-fb-bg-light uppercase tracking-wider">{t('about.governanceBadge') || 'Institutional Governance & Sourcing Oversight'}</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
