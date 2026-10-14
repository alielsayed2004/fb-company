'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Store, ShieldCheck, Car, Building2, Utensils, ShoppingBag, Pill, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useData } from '@/context/DataContext';

// Category per brand name (display grouping only). Brands not listed fall under "Other".
const BRAND_CATEGORY = {
  "McDonald's": 'fnb', "Domino's Pizza": 'fnb', "Papa John's": 'fnb', 'Pizza Party': 'fnb', 'Buffalo Burger': 'fnb',
  'Burger Republic': 'fnb', 'Doshka Burger': 'fnb', 'Just Smash': 'fnb', 'Bazooka': 'fnb', 'Kufta': 'fnb', 'Al Koftageya': 'fnb',
  'Koshary El Tahrir': 'fnb', 'Koshary El Khedeiwy': 'fnb', 'Karam El Sham': 'fnb', 'Shawerma Reem': 'fnb', 'Shrimp Zone': 'fnb',
  'Haj Arafa': 'fnb', 'El Abd': 'fnb', 'El Malky': 'fnb', 'Bakery Khan': 'fnb', 'B.Laban': 'fnb', 'Nos Dasta': 'fnb', 'Sultana': 'fnb',
  'Sultan': 'fnb', 'TBS': 'fnb', 'Cilantro': 'fnb', 'Second Cup': 'fnb', 'Nine Two Nine': 'fnb', 'Karaz': 'fnb', 'Dina Farms': 'fnb',
  'Carrefour': 'retail', 'Othaim Market': 'retail', 'Oppo': 'retail', 'Dream 2000': 'retail', '2B': 'retail', 'Max Muscle': 'retail',
  'Remas Land': 'retail', 'Hunger Station': 'retail',
  'El Ezaby Pharmacy': 'pharma',
};

export default function TenantPartnershipSection() {
  const { locale } = useLanguage();
  const { projects } = useData();
  const isAr = locale === 'ar';
  const [activeCategory, setActiveCategory] = useState('all');
  const href = (path) => (isAr ? `/ar${path}` : path);

  const categories = [
    { id: 'all', nameEn: 'All', nameAr: 'الكل', icon: <Store size={16} aria-hidden="true" /> },
    { id: 'fnb', nameEn: 'Food & Beverage', nameAr: 'الأغذية والمشروبات', icon: <Utensils size={16} aria-hidden="true" /> },
    { id: 'retail', nameEn: 'Retail & Services', nameAr: 'التجزئة والخدمات', icon: <ShoppingBag size={16} aria-hidden="true" /> },
    { id: 'pharma', nameEn: 'Pharmacy', nameAr: 'الصيدليات', icon: <Pill size={16} aria-hidden="true" /> },
  ];

  // Brands come from data/projects.json, so every name shown is tied to a listed location.
  const brandPartners = useMemo(() => {
    const map = new Map();
    for (const p of projects || []) {
      for (const b of p.brands || []) {
        const name = typeof b === 'string' ? b : b?.name;
        if (!name) continue;
        const entry = map.get(name) || { name, category: BRAND_CATEGORY[name] || 'other', locations: 0 };
        entry.locations += 1;
        map.set(name, entry);
      }
    }
    return [...map.values()].sort((a, b) => b.locations - a.locations || a.name.localeCompare(b.name));
  }, [projects]);

  const pillars = [
    {
      icon: <Car className="text-fb-teal" size={24} aria-hidden="true" />,
      titleEn: 'Access and Visibility',
      titleAr: 'سهولة الوصول ووضوح الرؤية',
      descEn: 'Locations on main roads, city corridors and club perimeters, selected after on-site traffic studies.',
      descAr: 'مواقع على الطرق الرئيسية ومحاور المدن وأسوار الأندية، تُختار بعد دراسات ميدانية لحركة المرور.',
    },
    {
      icon: <ShieldCheck className="text-fb-teal" size={24} aria-hidden="true" />,
      titleEn: 'Permits Coordination',
      titleAr: 'تنسيق التراخيص',
      descEn: 'We coordinate the planning and licensing steps with the relevant authorities together with each tenant.',
      descAr: 'ننسّق خطوات التخطيط والترخيص مع الجهات المختصة بالتعاون مع كل مستأجر.',
    },
    {
      icon: <Building2 className="text-fb-teal" size={24} aria-hidden="true" />,
      titleEn: 'Units Fitted to Brand Needs',
      titleAr: 'وحدات تناسب احتياجات العلامة',
      descEn: 'Unit sizes, frontage and drive-thru options planned around each brand’s operating requirements.',
      descAr: 'مساحات الوحدات والواجهات وخيارات الخدمة من السيارة تُخطَّط وفق متطلبات تشغيل كل علامة تجارية.',
    },
    {
      icon: <Store className="text-fb-teal" size={24} aria-hidden="true" />,
      titleEn: 'Long-Term Management',
      titleAr: 'إدارة طويلة الأمد',
      descEn: 'Ongoing site management and a balanced brand mix at each location.',
      descAr: 'إدارة مستمرة للموقع ومزيج متوازن من العلامات التجارية في كل موقع.',
    },
  ];

  const filteredBrands = brandPartners.filter((b) => activeCategory === 'all' || b.category === activeCategory);

  return (
    <section className="py-12 sm:py-20 md:py-24 bg-fb-bg-light border-b border-fb-teal/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-14 relative z-10">

        <div className="text-center space-y-3 sm:space-y-4 max-w-5xl mx-auto">
          <span className="eyebrow">{isAr ? 'للعلامات التجارية' : 'For Brands'}</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-extrabold text-fb-teal tracking-tight leading-snug text-balance">
            {isAr ? 'مواقع مُعدّة لتشغيل العلامات التجارية' : 'Locations Prepared for Brand Operations'}
          </h2>
          <p className="text-fb-black/75 text-base leading-relaxed max-w-3xl mx-auto">
            {isAr
              ? 'نعمل مع العلامات التجارية المحلية والدولية لتوفير وحدات تجارية في مواقع مدروسة، ثم ندير هذه المواقع على المدى الطويل.'
              : 'We work with national and international brands to provide commercial units in researched locations, and we manage those locations for the long term.'}
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((p) => (
            <li key={p.titleEn} className="bg-white/60 border border-fb-teal/15 p-6 rounded-2xl space-y-4 shadow-[0_8px_30px_rgba(0,59,60,0.05)]">
              <span className="p-3 bg-fb-teal/5 inline-flex rounded-xl border border-fb-teal/10">{p.icon}</span>
              <h3 className="font-bold text-fb-teal text-lg leading-snug">{isAr ? p.titleAr : p.titleEn}</h3>
              <p className="text-fb-black/75 text-sm leading-relaxed">{isAr ? p.descAr : p.descEn}</p>
            </li>
          ))}
        </ul>

        <div className="bg-white/60 border border-fb-teal/15 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-[0_8px_30px_rgba(0,59,60,0.05)] space-y-6 sm:space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-fb-teal/10 pb-6">
            <div>
              <h3 className="text-xl font-extrabold text-fb-teal">
                {isAr ? 'العلامات التجارية في مواقعنا' : 'Brands at Our Locations'}
              </h3>
              <p className="text-sm text-fb-black/70">
                {isAr ? 'وفق بيانات المواقع المدرجة في صفحة المشاريع.' : 'Based on the locations listed on our portfolio page.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2" role="group" aria-label={isAr ? 'تصفية حسب القطاع' : 'Filter by category'}>
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-2 min-h-[44px] px-4 rounded-xl text-sm font-bold transition-colors ${
                      isSelected ? 'bg-fb-teal text-fb-white shadow-md' : 'bg-fb-bg-light text-fb-black/75 hover:text-fb-teal hover:bg-fb-teal/5'
                    }`}
                  >
                    {cat.icon}
                    <span>{isAr ? cat.nameAr : cat.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredBrands.map((brand) => (
              <li key={brand.name} className="bg-fb-bg-light/70 border border-fb-teal/10 px-4 py-3 rounded-xl">
                <span className="block font-bold text-fb-teal text-sm">{brand.name}</span>
                <span className="block text-xs text-fb-black/70">
                  {isAr
                    ? `${brand.locations} ${brand.locations === 1 ? 'موقع' : 'مواقع'}`
                    : `${brand.locations} ${brand.locations === 1 ? 'location' : 'locations'}`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#002B2C] text-fb-white rounded-3xl p-8 md:p-12 border border-fb-green/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl relative z-10 text-center md:text-start">
            <span className="text-xs font-bold text-fb-green tracking-widest uppercase block">
              {isAr ? 'توفير مواقع الفرنشايز' : 'Franchise Location Sourcing'}
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-fb-white leading-tight">
              {isAr ? 'هل تبحث عن موقع لعلامتك التجارية؟' : 'Looking for a Location for Your Brand?'}
            </h3>
            <p className="text-fb-bg-light/85 text-base leading-relaxed">
              {isAr
                ? 'أرسل متطلبات علامتك التجارية والمدن المستهدفة، وسيتواصل معك فريقنا.'
                : 'Send us your brand requirements and target cities, and our team will contact you.'}
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <Link
              href={href('/contact?interest=franchise-sourcing')}
              className="inline-flex items-center gap-2 min-h-[44px] bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-8 py-4 rounded-xl text-sm shadow-xl transition-colors"
            >
              <span>{isAr ? 'أرسل متطلبات علامتك' : 'Submit Your Brand Requirements'}</span>
              <ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
