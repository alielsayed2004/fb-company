'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Store, ShieldCheck, Car, Building2, Utensils, ShoppingBag, Pill, Fuel, ArrowRight, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TenantPartnershipSection() {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', nameEn: 'All Categories', nameAr: 'كافة القطاعات التجارية', icon: <Store size={16} /> },
    { id: 'fnb', nameEn: 'F&B & Drive-Thru', nameAr: 'المطاعم والمقاهي والخدمة السريعة', icon: <Utensils size={16} /> },
    { id: 'retail', nameEn: 'Supermarkets & Retail', nameAr: 'التجزئة والهايبر ماركت', icon: <ShoppingBag size={16} /> },
    { id: 'pharma', nameEn: 'Healthcare & Pharma', nameAr: 'الصيدليات والخدمات الطبية', icon: <Pill size={16} /> },
    { id: 'fuel', nameEn: 'Fuel & Service Hubs', nameAr: 'مجمعات محطات الوقود', icon: <Fuel size={16} /> },
  ];

  const brandPartners = [
    { name: "McDonald's", category: 'fnb', descEn: 'Global QSR Anchor', descAr: 'علامة المأكولات السريعة العالمية', tag: 'Drive-Thru Ready' },
    { name: 'Carrefour', category: 'retail', descEn: 'Hypermarket & Supermarket Retail', descAr: 'سلسلة تجزئة وتوفير يومي', tag: 'Anchor Retailer' },
    { name: 'El Ezaby Pharmacy', category: 'pharma', descEn: 'Leading National Pharmacy Network', descAr: 'كبرى شبكات الصيدليات في مصر', tag: 'Essential Service' },
    { name: 'Papa John\'s', category: 'fnb', descEn: 'International Pizza Chain', descAr: 'مطاعم بيتزا عالمية', tag: 'High-Demand F&B' },
    { name: 'Spinneys', category: 'retail', descEn: 'Premium Supermarket Anchor', descAr: 'سوبرماركت ومنتجات ممتازة', tag: 'High Footfall' },
    { name: 'TBS (The Bakery Shop)', category: 'fnb', descEn: 'Artisanal Bakery & Coffee', descAr: 'المخبوزات والقهوة المختصة', tag: 'Daily Commute' },
    { name: 'Bazooka', category: 'fnb', descEn: 'Popular Fried Chicken Chain', descAr: 'سلسلة مطاعم الدجاج الشهيرة', tag: 'High Density' },
    { name: 'Cilantro', category: 'fnb', descEn: 'Specialty Coffee House Chain', descAr: 'سلسلة كافيهات مختصة', tag: 'Lifestyle & Coffee' },
    { name: 'Burger Republic', category: 'fnb', descEn: 'Gourmet Burger Chain', descAr: 'برجر فاخر ووجبات ممتازة', tag: 'Gourmet F&B' },
    { name: 'Othaim Market', category: 'retail', descEn: 'Regional Grocery Supermarket', descAr: 'أسواق تجزئة ومواد غذائية', tag: 'Neighborhood Anchor' },
    { name: 'Nine Two Nine', category: 'fnb', descEn: 'Coffee & Dessert Concept', descAr: 'مفهوم القهوة والحلويات', tag: 'Premium Drive-Thru' },
    { name: 'Chillout Hub Plazas', category: 'fuel', descEn: 'Multi-Service Fuel Station Infrastructure', descAr: 'مجمعات ومحطات خدمات الوقود (شيل أوت هب)', tag: 'Primary Hub' },
  ];

  const pillars = [
    {
      icon: <Car className="text-fb-green" size={24} />,
      watermark: <Car size={110} />,
      titleEn: 'High-Velocity Arterial Catchments',
      titleAr: 'مواقع كثيفة المرور على الشرايين الرئيسية',
      descEn: 'Our sites capture over 100,000+ daily commuter vehicles along primary highways and major city corridors.',
      descAr: 'تتميز مواقعنا بكثافة مرورية تتجاوز 100,000 سيارة يومياً على المحاور الرئيسية والطرق السريعة.',
    },
    {
      icon: <ShieldCheck className="text-fb-green" size={24} />,
      watermark: <ShieldCheck size={110} />,
      titleEn: 'Turnkey Regulatory Permits',
      titleAr: 'تراخيص حكومية وموافقات جاهزة',
      descEn: 'Fully pre-approved municipal and commercial licensing that reduces brand setup & launch time by up to 70%.',
      descAr: 'تراخيص تجارية وتنظيمية مكتملة الجاهزية تسرع تشغيل المستأجرين وتخفض زمن الإطلاق بنسبة 70%.',
    },
    {
      icon: <Building2 className="text-fb-green" size={24} />,
      watermark: <Building2 size={110} />,
      titleEn: 'Custom Built-to-Suit Infrastructure',
      titleAr: 'بنية تحتية هندسية مخصصة للعلامات العالمية',
      descEn: 'High-capacity utility grids, drive-thru lanes, and specialized layouts engineered to international tenant specs.',
      descAr: 'شبكات طاقة عالية القدرة، ممرات خدمة سريعة (Drive-Thru)، ومساحات مصممة وفقاً للمواصفات العالمية.',
    },
    {
      icon: <TrendingUp className="text-fb-green" size={24} />,
      watermark: <TrendingUp size={110} />,
      titleEn: '100% Portfolio Occupancy Stability',
      titleAr: 'استقرار وإشغال كامل بنسبة 100%',
      descEn: 'Long-term institutional asset management ensuring optimal brand mix and sustained long-term footfall.',
      descAr: 'إدارة أصول احترافية تضمن المزيج التجاري الأمثل واستمرار تدفق الزوار وتطوير قيمة الموقع.',
    },
  ];

  const filteredBrands = brandPartners.filter(
    (b) => activeCategory === 'all' || b.category === activeCategory
  );

  return (
    <section className="py-12 sm:py-20 md:py-24 bg-fb-bg-light border-b border-fb-teal/5 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-14 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-fb-green/10 border border-fb-green/20 text-fb-green text-xs font-bold uppercase tracking-widest">
            <Sparkles size={13} />
            <span>{isAr ? 'بيئة استثمار وتأجير نموذجية' : 'PREMIER TENANT ECOSYSTEM'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold text-fb-teal tracking-tight leading-snug text-balance">
            {isAr ? 'حلول تأجير مصممة لنمو وازدهار كبرى العلامات' : 'Engineered for Scale, Built for Brand Longevity'}
          </h2>

          <p className="text-fb-black/70 text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl mx-auto">
            {isAr
              ? 'نوفر لكبرى العلامات التجارية بيئة تشغيلية متكاملة تضمن أعلى معدلات الوصول للعملاء وعوائد تشغيلية قياسية في كل مشروع.'
              : 'Empowering regional & global operators with turnkey commercial real estate, pre-approved licenses, and sustained traffic catchments.'}
          </p>
        </div>

        {/* 4 Pillars of Tenant Partnership Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-fb-bg-light/90 border border-fb-teal/15 p-5 sm:p-7 rounded-2xl sm:rounded-3xl space-y-3 sm:space-y-4 shadow-[0_8px_30px_rgba(0,59,60,0.05)] hover:shadow-[0_15px_35px_rgba(83,179,121,0.15)] hover:border-fb-green hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Large Background Overlay Watermark Icon */}
              <div className="absolute -bottom-5 -right-5 rtl:-left-5 rtl:right-auto text-fb-teal/[0.05] group-hover:text-fb-green/[0.12] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 pointer-events-none">
                {p.watermark}
              </div>

              <div className="space-y-4 relative z-10">
                <div className="p-3.5 bg-fb-teal/5 inline-block rounded-xl border border-fb-teal/10 group-hover:bg-fb-green/10 transition-colors">
                  {p.icon}
                </div>
                <h4 className="font-bold text-fb-teal text-base leading-snug">
                  {isAr ? p.titleAr : p.titleEn}
                </h4>
                <p className="text-fb-black/70 text-xs md:text-sm leading-relaxed">
                  {isAr ? p.descAr : p.descEn}
                </p>
              </div>
              <div className="pt-2 flex items-center space-x-1.5 rtl:space-x-reverse text-xs font-semibold text-fb-green">
                <CheckCircle2 size={14} />
                <span>{isAr ? 'ميزة تنافسية مبرهنة' : 'Proven Advantage'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Category Matrix Filter & Brand Showcase */}
        <div className="bg-fb-bg-light/90 border border-fb-teal/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-[0_8px_30px_rgba(0,59,60,0.05)] space-y-6 sm:space-y-8 overflow-hidden">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-fb-teal/10 pb-6">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-fb-teal">
                {isAr ? 'مزيج العلامات التجارية في مشروعاتنا' : 'Curated Brand Partner Mix'}
              </h3>
              <p className="text-xs text-fb-black/60">
                {isAr ? 'تصفح كبرى الأسماء المتواجدة في مجمعاتنا التجارية' : 'Explore tier-1 operators thriving across our commercial plazas'}
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0 sm:flex-wrap scrollbar-none">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center space-x-2 rtl:space-x-reverse px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-fb-teal text-fb-white shadow-md'
                        : 'bg-fb-bg-light text-fb-black/70 hover:text-fb-teal hover:bg-fb-teal/5'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{isAr ? cat.nameAr : cat.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animated Brand Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredBrands.map((brand, bIdx) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: bIdx * 0.03 }}
                  className="bg-fb-bg-light/60 border border-fb-teal/5 hover:border-fb-green/40 p-4 rounded-xl space-y-2.5 transition-all duration-300 group hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-fb-teal text-sm group-hover:text-fb-green transition-colors">
                      {brand.name}
                    </span>
                    <span className="text-[9.5px] font-semibold bg-fb-green/10 text-fb-green px-2 py-0.5 rounded-full border border-fb-green/20">
                      {brand.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-fb-black/65 leading-tight">
                    {isAr ? brand.descAr : brand.descEn}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>

        {/* Commercial Leasing Invitation Callout Banner */}
        <div className="bg-[#002B2C] text-fb-white rounded-3xl p-8 md:p-12 border border-fb-green/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_center,rgba(83,179,121,0.2)_0%,transparent_70%)] pointer-events-none" />
          
          <div className="space-y-3 max-w-2xl relative z-10 text-center md:text-right rtl:md:text-right">
            <span className="text-xs font-bold text-fb-green tracking-widest uppercase block">
              {isAr ? 'فرص التوسع والتأجير التجاري' : 'COMMERCIAL LEASING OPPORTUNITIES'}
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-fb-white leading-tight">
              {isAr ? 'هل ترغب في توسيع علاماتك التجارية في مشروعاتنا القادمة؟' : 'Expand Your Brand Across Egypt’s Top Traffic Arteries'}
            </h3>
            <p className="text-fb-bg-light/75 text-xs md:text-sm leading-relaxed">
              {isAr
                ? 'نوفر خيارات تأجير ومواقع مخصصة لتلبية الاحتياجات التشغيلية لكبرى المطاعم والسلاسل التجارية في مجمعاتنا القادمة.'
                : 'Reserve prime retail, F&B, and service space across F.B Company’s active pipeline developments.'}
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <Link
              href="/contact?interest=leasing"
              className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-8 py-4 rounded-xl text-xs uppercase tracking-wider shadow-xl transition-all hover:scale-105"
            >
              <span>{isAr ? 'طلب حجز مساحة تجارية' : 'Request Commercial Space'}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
