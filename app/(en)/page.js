'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { motion } from '@/components/motion';
import { ArrowRight, ShieldCheck, Target, BarChart4, Cpu, Search, Compass, Shield, TrendingUp, Fuel, Building2, Store, FileText, Download, CheckCircle2, Briefcase } from 'lucide-react';
import projectsData from '@/data/projects.json';
import ProjectDrawer from '@/components/ProjectDrawer';
import TenantPartnershipSection from '@/components/TenantPartnershipSection';
import InteractiveEarthFocus from '@/components/InteractiveEarthFocus';
import PartnersMarquee from '@/components/PartnersMarquee';
import PortfolioTimeline from '@/components/PortfolioTimeline';
import CompanyProfile from '@/components/CompanyProfile';
import StatCounter from '@/components/StatCounter';
import ServicePaths from '@/components/ServicePaths';
import { ENTITY } from '@/lib/schema';
import Faq from '@/components/Faq';
import { useLanguage } from '@/context/LanguageContext';
import HeroVideo from '@/components/HeroVideo';
import { useData } from '@/context/DataContext';

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

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);
  const { locale, t } = useLanguage();
  const { projects, counters } = useData();
  const heroRef = useRef(null);

  // 3D Parallax Scroll transforms
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Parallax is disabled entirely for visitors who prefer reduced motion.
  const reduceMotion = useReducedMotion();
  const heroBgY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "28%"]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], reduceMotion ? ["0%", "0%"] : ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], reduceMotion ? [1, 1] : [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1, 0.95]);

  // Word-by-word reveal for hero headline
  const heroWords = t('nav.tagline').split(" ");
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.6,
        ease: corporateEase,
      },
    }),
  };

  const href = (path) => (locale === 'ar' ? (path === '/' ? '/ar' : `/ar${path}`) : path);

  const getField = (obj, field) => {
    if (locale === 'ar') {
      return obj[`${field}_ar`] || obj[field];
    }
    return obj[field];
  };

  const usps = [
    {
      icon: <Cpu strokeWidth={1.5} size={24} />,
      watermark: <Cpu size={110} />,
      title: t('home.usp.items.0.title'),
      desc: t('home.usp.items.0.desc')
    },
    {
      icon: <ShieldCheck strokeWidth={1.5} size={24} />,
      watermark: <ShieldCheck size={110} />,
      title: t('home.usp.items.1.title'),
      desc: t('home.usp.items.1.desc')
    },
    {
      icon: <Target strokeWidth={1.5} size={24} />,
      watermark: <Target size={110} />,
      title: t('home.usp.items.2.title'),
      desc: t('home.usp.items.2.desc')
    },
    {
      icon: <BarChart4 strokeWidth={1.5} size={24} />,
      watermark: <BarChart4 size={110} />,
      title: t('home.usp.items.3.title'),
      desc: t('home.usp.items.3.desc')
    }
  ];

  const valueTimeline = [
    { step: "01", name: t('home.methodology.steps.0.name'), icon: <Search strokeWidth={1.5} size={20} />, desc: t('home.methodology.steps.0.desc') },
    { step: "02", name: t('home.methodology.steps.1.name'), icon: <Compass strokeWidth={1.5} size={20} />, desc: t('home.methodology.steps.1.desc') },
    { step: "03", name: t('home.methodology.steps.2.name'), icon: <Shield strokeWidth={1.5} size={20} />, desc: t('home.methodology.steps.2.desc') },
    { step: "04", name: t('home.methodology.steps.3.name'), icon: <TrendingUp strokeWidth={1.5} size={20} />, desc: t('home.methodology.steps.3.desc') }
  ];

  return (
    <div className="flex flex-col min-h-screen relative bg-fb-bg-light">

      {/* 1. HERO SECTION (Signature Centered Experience with 3D Parallax) */}
      <section ref={heroRef} className="relative min-h-[100dvh] h-[100dvh] min-h-screen h-screen shrink-0 bg-fb-teal flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6">
        {/* Background Video Layer with Parallax Depth */}
        <motion.div
          style={{ y: heroBgY, willChange: 'transform' }}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <HeroVideo src="/videos/hero-bg.mp4" poster="/videos/hero-poster.jpg" className="w-full h-full object-cover opacity-50 scale-105" />
          <div className="absolute inset-0 bg-fb-teal/60 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 hero-grid-overlay pointer-events-none" />
        </motion.div>

        {/* Slowly shifting gradients and glowing nodes (GPU-accelerated CSS) */}
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-fb-green/10 rounded-full blur-3xl pointer-events-none transform-gpu animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-fb-green/5 rounded-full blur-3xl pointer-events-none transform-gpu animate-pulse [animation-duration:8s]" />

        {/* Foreground Content with Floating Parallax */}
        <motion.div
          style={{
            y: heroTextY,
            opacity: heroOpacity,
            scale: heroScale,
            willChange: 'transform, opacity'
          }}
          className="max-w-4xl mx-auto text-center z-10 space-y-6"
        >
          <span className="eyebrow text-fb-green font-bold block mb-4 tracking-[0.25em]">{t('home.eyebrow')}</span>

          <h1 className="mb-2">
            <span aria-hidden="true" className="text-fb-bg-light tracking-tight flex justify-center flex-wrap gap-x-2 sm:gap-x-3">
              {heroWords.map((word, idx) => (
                <motion.span
                  key={idx}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                  className="inline-block font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                >
                  {word}
                </motion.span>
              ))}
            </span>
            <span className="sr-only">From Vision to Value — Asset Management & Franchise Location Sourcing in Egypt</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: corporateEase }}
            className="text-fb-bg-light/80 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-6 px-2"
          >
            {t('home.subheadline')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: corporateEase }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4 max-w-sm sm:max-w-none mx-auto w-full"
          >
            <Link
              href={href('/asset-management')}
              className="w-full sm:w-auto sm:min-w-[260px] inline-flex items-center justify-center gap-2 min-h-[48px] bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-6 py-3.5 rounded-xl text-sm transition-colors shadow-lg"
            >
              <span>{locale === 'ar' ? 'لملاك العقارات: إدارة الأصول' : 'Property owners: Asset Management'}</span>
              <ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true" />
            </Link>
            <Link
              href={href('/franchise-sourcing')}
              className="w-full sm:w-auto sm:min-w-[260px] inline-flex items-center justify-center gap-2 min-h-[48px] bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-6 py-3.5 rounded-xl text-sm transition-colors shadow-lg"
            >
              <span>{locale === 'ar' ? 'للعلامات التجارية: توفير المواقع' : 'Brands: Franchise Location Sourcing'}</span>
              <ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 1b. THE TWO BUSINESS LINES — equal size and weight */}
      <ServicePaths />

      {/* 2. KEY FIGURES — values come from data/company.json (single source of truth) */}
      <section className="bg-fb-bg-light border-y border-fb-teal/10 py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center relative z-10">
          <div className="lg:col-span-5 space-y-4 sm:space-y-6 text-start">
            <span className="eyebrow inline-flex items-center gap-2">
              <BarChart4 size={14} aria-hidden="true" />
              {locale === 'ar' ? 'شركة إف بي بالأرقام' : 'F.B Company in Numbers'}
            </span>
            <h2 className="text-fb-teal font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-snug text-balance">
              {locale === 'ar' ? 'حجم أعمالنا في مصر' : 'Our Work Across Egypt'}
            </h2>
            <p className="text-fb-black/75 text-base leading-relaxed">
              {locale === 'ar'
                ? 'نختار مواقعنا بناءً على دراسات ميدانية لحركة المرور والكثافة المحيطة، ونعمل مع علامات تجارية محلية ودولية.'
                : 'We select our locations through field studies of traffic and catchment, and work with national and international brands.'}
            </p>
            <p className="text-sm text-fb-black/70">
              {locale === 'ar' ? 'الأرقام وفق بيانات الشركة، أكتوبر 2026.' : 'Figures from company data, October 2026.'}
            </p>
          </div>

          <ul className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { key: 'locations', icon: <Fuel size={20} aria-hidden="true" /> },
              { key: 'brands', icon: <Store size={20} aria-hidden="true" /> },
              { key: 'area', icon: <Building2 size={20} aria-hidden="true" /> },
            ].map((stat) => (
              <li key={stat.key} className="min-w-0 bg-white/60 border border-fb-teal/15 rounded-2xl p-5 xl:p-6 flex flex-col gap-4 shadow-[0_8px_30px_rgba(0,59,60,0.05)]">
                <span className="w-11 h-11 rounded-xl bg-fb-teal/5 border border-fb-teal/15 flex items-center justify-center text-fb-teal">
                  {stat.icon}
                </span>
                <span className="text-fb-teal font-extrabold text-4xl sm:text-3xl xl:text-4xl tracking-tight whitespace-nowrap">
                  <StatCounter value={counters?.[stat.key]} />
                </span>
                <span className="text-sm font-bold text-fb-black/80 leading-snug">
                  {t(`home.counters.${stat.key}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. SUCCESS PARTNERS EXPERIENCE (Marquee Logos Row) */}
      <PartnersMarquee />

      {/* 4. ABOUT F.B COMPANY (Split Screen + Radar Scan Visual) */}
      <section className="py-12 sm:py-20 md:py-24 bg-fb-bg-light">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
        >
          {/* Left Text */}
          <div className="space-y-4 sm:space-y-6">
            <span className="eyebrow">{t('home.about.eyebrow')}</span>
            <h2 className="text-fb-teal font-bold text-2xl sm:text-3xl md:text-4xl text-balance">{t('home.about.title')}</h2>
            <div className="text-fb-black/80 text-xs sm:text-sm md:text-base leading-relaxed space-y-3 sm:space-y-4">
              <p>
                {ENTITY[locale === 'ar' ? 'ar' : 'en']}
              </p>
              <p className="text-xs md:text-sm text-fb-black/60 italic border-s-2 border-fb-green ps-4">
                {t('home.about.p2')}
              </p>
            </div>
            <div className="pt-1 sm:pt-2">
              <Link
                href={href('/about')}
                className="inline-flex items-center gap-1.5 min-h-[44px] text-fb-teal font-bold text-sm uppercase tracking-wider hover:underline underline-offset-4"
              >
                <span>{t('home.about.link')}</span>
                <ArrowRight size={14} className="rtl:rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Visual: Interactive Earth / Egypt Strategic Focus */}
          <div className="w-full flex justify-center lg:justify-end">
            <InteractiveEarthFocus />
          </div>
        </motion.div>
      </section>

      {/* 5. WHY F.B COMPANY (Institutional Strengths) */}
      <section id="why-fb" className="py-12 sm:py-20 md:py-24 bg-fb-bg-light/30 border-t border-fb-teal/5">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12"
        >
          <div className="text-center space-y-3 sm:space-y-4 max-w-4xl mx-auto">
            <span className="eyebrow">{t('home.usp.eyebrow')}</span>
            <h2 className="text-fb-teal font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-balance leading-snug">
              {t('home.usp.title')}
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {usps.map((usp, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-fb-bg-light/90 border border-fb-teal/15 p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-3 sm:space-y-4 shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:border-fb-green hover:-translate-y-1.5 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
              >
                {/* Large Background Overlay Watermark Icon */}
                <div className="absolute -bottom-5 -right-5 rtl:-left-5 rtl:right-auto text-fb-teal/[0.05] group-hover:text-fb-green/[0.12] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
                  {usp.watermark}
                </div>

                <div className="space-y-3 sm:space-y-4 relative z-10">
                  <div className="p-2.5 sm:p-3 rounded-xl bg-fb-teal/5 border border-fb-teal/10 text-fb-green group-hover:bg-fb-green/10 transition-colors inline-block">{usp.icon}</div>
                  <h3 className="font-bold text-fb-teal text-base leading-snug">{usp.title}</h3>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{usp.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 6. HOW WE CREATE VALUE (Timeline) */}
      <section id="methodology" className="py-12 sm:py-20 md:py-24 bg-fb-bg-light border-b border-fb-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-14">
          <div className="text-center space-y-2.5 sm:space-y-4 max-w-2xl mx-auto">
            <span className="eyebrow">{t('home.methodology.eyebrow')}</span>
            <h2 className="text-fb-teal font-bold text-2xl sm:text-3xl md:text-4xl text-balance leading-snug">{t('home.methodology.title')}</h2>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative"
          >
            {/* Timeline horizontal background bar */}
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-fb-teal/10 z-0" />

            {valueTimeline.map((item) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                className="flex flex-col items-center text-center space-y-3 sm:space-y-4 relative z-10"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-fb-teal text-fb-bg-light flex items-center justify-center border border-fb-green/20 shadow-md">
                  {item.icon}
                </div>
                <div className="space-y-1">
                  <span className="text-fb-green-text text-xs font-bold uppercase tracking-widest">{locale === 'ar' ? `الخطوة ${item.step}` : `Step ${item.step}`}</span>
                  <h3 className="font-bold text-fb-teal text-base sm:text-lg">{item.name}</h3>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. CHRONOLOGICAL PORTFOLIO TIMELINE SECTION */}
      <PortfolioTimeline projects={projects} onSelectProject={setSelectedProject} />

      {/* 8. COMMERCIAL TENANT ECOSYSTEM & BRAND PARTNERSHIPS */}
      <TenantPartnershipSection />

      {/* 9. OFFICIAL COMPANY PROFILE & CORPORATE PRESENTATION */}
      <CompanyProfile />

      {/* 10. Articles section hidden (owner decision D5) until Insights returns */}

      <Faq topic="home" />

      {/* 11. FINAL CONSULTATION CTA */}
      <section className="bg-fb-teal text-fb-bg-light py-16 sm:py-24 md:py-28 flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden border-t border-fb-bg-light/10">
        <div className="absolute inset-0 opacity-10 grid-bg-overlay" />

        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
          <h2 className="text-fb-bg-light font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-[3.1rem] tracking-tight leading-snug max-w-4xl mx-auto text-balance">
            {t('home.cta.title')}
          </h2>
          <p className="text-fb-bg-light/75 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {t('home.cta.subtitle')}
          </p>
          <div className="pt-2 sm:pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href={href('/contact?interest=consultation#consultation-form')}
              className="inline-flex items-center gap-2 min-h-[48px] bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-8 py-3.5 rounded-2xl text-sm transition-colors shadow-xl"
            >
              <span>{t('common.bookConsultation')}</span>
              <ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true" />
            </Link>
            <Link
              href={href('/contact?interest=franchise-sourcing#consultation-form')}
              className="inline-flex items-center gap-2 min-h-[48px] bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold px-7 py-3.5 rounded-2xl text-sm transition-colors"
            >
              <span>{t('sourcing.ctaBtn')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Project Details Side Panel Drawer */}
      <ProjectDrawer project={selectedProject} onClose={() => setSelectedProject(null)} />

    </div>
  );
}
