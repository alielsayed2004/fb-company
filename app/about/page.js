'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Compass, BookOpen, Layers, Users, Award, TrendingUp, Landmark, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

function Counter({ value, duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const rawNum = parseInt(String(value || '0').replace(/[^0-9]/g, ''), 10) || 0;

  useEffect(() => {
    if (!isInView || rawNum <= 0) return;

    let start = 0;
    const totalMs = duration * 1000;
    const steps = 35;
    const stepTime = Math.max(Math.floor(totalMs / steps), 20);
    const stepIncrement = Math.ceil(rawNum / steps);
    
    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= rawNum) {
        clearInterval(timer);
        start = rawNum;
      }
      setCount(start);
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, rawNum, duration]);

  const formatNumber = (num) => {
    const formatted = (num > 0 ? num : rawNum).toLocaleString();
    const str = String(value || '');
    if (str.includes('%')) return `${formatted}%`;
    if (str.startsWith('+')) return `+${formatted}`;
    if (str.endsWith('+')) return `${formatted}+`;
    return formatted;
  };

  return <span ref={ref}>{formatNumber(count)}</span>;
}

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

  const milestones = [
    { 
      year: "2021", 
      title: locale === 'ar' ? "التأسيس والنشاط الرئيسي" : "Foundation & Sourcing Core", 
      desc: locale === 'ar' ? "تأسيس شركة إف بي (F.B Company) لتحديد المواقع الاستثمارية المميزة وغير المستغلة على طول طرق السفر والممرات الحيوية في مصر." : "Established F.B Company to identify under-utilized locations along Egypt's developing transit corridors." 
    },
    { 
      year: "2022", 
      title: locale === 'ar' ? "الانطلاقة في الساحل الشمالي" : "North Coast Breakthrough", 
      desc: locale === 'ar' ? "سورسينج وهيكلة مجمع مارينا 5 التجاري الرائد، وتسكين كبرى العلامات التجارية للأغذية والتجزئة." : "Sourced and structured the flagship Marina 5 commercial plaza, leasing to top convenience and food brands." 
    },
    { 
      year: "2023", 
      title: locale === 'ar' ? "مجمع العاشر من رمضان الخدمي" : "10th of Ramadan Industrial Hub", 
      desc: locale === 'ar' ? "تطوير مركز خدمات البنوك وتدشين مجمع شيل أوت هب للخدمات والوقود، إلى جانب توفير مقرات لماكدونالدز وبابا جونز." : "Constructed the landmark Banks Service Center, introducing Chillout Hub fuel plaza alongside McDonald's and Papa John's." 
    },
    { 
      year: "2024", 
      title: locale === 'ar' ? "التوسع الحضري في القاهرة" : "Metropolitan Expansion", 
      desc: locale === 'ar' ? "هيكلة أسوار الأندية والمناطق الحضرية المتميزة في مصر الجديدة (شيراتون) ومدينة العبور، وتحقيق نسبة إشغال 100%." : "Structured multiple club perimeter layouts in Cairo (Sheraton & Obour) securing 100% triple-net lease occupancy." 
    },
    { 
      year: "2026", 
      title: locale === 'ar' ? "خطة التوسع المستقبلية" : "Strategic Pipeline", 
      desc: locale === 'ar' ? "سورسينج أراض جديدة على طريق القاهرة السويس، مستهدفين تجاوز 500,000 متر مربع من المساحات المدارة." : "Sourcing modern commercial corridor nodes on Suez highway, targeting over 500,000 SQM under management." 
    }
  ];

  return (
    <div className="flex flex-col min-h-screen relative bg-fb-bg-light">
      
      {/* 1. HERO SECTION */}
      <section className="bg-fb-teal text-fb-white py-24 px-6 relative overflow-hidden flex flex-col justify-center min-h-screen">
        {/* Background Video (Optional) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none z-0"
        >
          <source src="/videos/about.mp4" type="video/mp4" />
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
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
            className="!text-fb-bg-light max-w-2xl font-extrabold leading-snug tracking-tight text-xl sm:text-2xl md:text-[1.85rem] lg:text-[2.05rem]"
          >
            {t('about.title1')}
            <br />
            {t('about.title2')}
          </motion.h1>
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: corporateEase } }
            }}
            className="text-fb-bg-light/85 text-xs sm:text-sm md:text-[15px] max-w-lg leading-relaxed font-normal"
          >
            {t('about.desc')}
          </motion.p>
        </motion.div>
      </section>

      {/* 2. STATS SECTION (Large Numeric Statistics) */}
      <section className="py-20 bg-fb-bg-light border-y border-fb-bg-light relative">
        <div className="absolute inset-0 opacity-20 grid-bg-white pointer-events-none" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-6 relative z-10"
        >
          <div className="text-center mb-16 space-y-3">
            <span className="eyebrow">{locale === 'ar' ? 'مؤشرات الأداء المؤسسي' : 'Key Metrics'}</span>
            <h2 className="text-fb-teal font-extrabold tracking-tight text-3xl md:text-4xl">{t('about.metricsTitle')}</h2>
          </div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { label: t('about.metrics.sqm'), value: counters?.sqm || "500,000+", icon: <Layers strokeWidth={1.5} className="text-fb-green" size={24} /> },
              { label: t('about.metrics.occupancy'), value: counters?.occupancy || "100%", icon: <TrendingUp strokeWidth={1.5} className="text-fb-green" size={24} /> },
              { label: t('about.metrics.brands'), value: counters?.brands || "200+", icon: <Users strokeWidth={1.5} className="text-fb-green" size={24} /> },
              { label: t('about.metrics.gas'), value: counters?.gas || "8+", icon: <Landmark strokeWidth={1.5} className="text-fb-green" size={24} /> }
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="bg-fb-bg-light/90 border border-fb-teal/15 p-8 rounded-3xl text-center space-y-4 shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:border-fb-green hover:-translate-y-1.5 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-fb-teal group-hover:bg-fb-green transition-colors animate-pulse" />
                <div className="p-3 bg-fb-teal/5 border border-fb-teal/10 rounded-xl inline-block group-hover:bg-fb-green/10 transition-colors">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-extrabold text-slate-900 font-mono tracking-tight block">
                  <Counter value={stat.value} />
                </div>
                <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-700">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 3. CORE VALUES SECTION */}
      <section className="py-24 bg-fb-bg-light/40 border-b border-fb-teal/5">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-3">
            <span className="eyebrow">{t('about.valuesSubtitle')}</span>
            <h2 className="text-fb-teal font-extrabold tracking-tight text-3xl md:text-4xl">{t('about.valuesTitle')}</h2>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((val, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants}
                className="bg-fb-bg-light/90 border border-fb-teal/15 rounded-3xl p-8 flex flex-col justify-start items-center text-center shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:border-fb-green hover:-translate-y-1.5 transition-all duration-300 group min-h-[300px] space-y-6 relative overflow-hidden"
              >
                {/* Large Background Overlay Watermark Icon */}
                <div className="absolute -bottom-5 -right-5 rtl:-left-5 rtl:right-auto text-fb-teal/[0.05] group-hover:text-fb-green/[0.12] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
                  {val.watermark}
                </div>

                {/* Standardized Static Frosted Icon Container */}
                <div className="w-16 h-16 flex items-center justify-center bg-fb-teal/5 border border-fb-teal/10 rounded-2xl p-4 text-fb-green group-hover:bg-fb-green/10 group-hover:border-fb-green/30 transition-colors duration-300 relative z-10">
                  {val.icon}
                </div>

                <div className="space-y-3 w-full relative z-10">
                  <h4 className="font-extrabold text-fb-teal text-lg md:text-xl tracking-tight leading-snug">{val.title}</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{val.desc}</p>
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
                
                <span className="text-3xl font-extrabold text-fb-green font-mono block tracking-tight group-hover:translate-x-1 transition-transform">{milestone.year}</span>
                <h4 className="text-fb-teal font-bold text-lg md:text-xl tracking-tight leading-snug">{milestone.title}</h4>
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
