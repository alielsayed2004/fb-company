'use client';

import Link from 'next/link';
import { ArrowRight, Building2, MapPin, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// The two business lines side by side, with identical size, structure and call-to-action weight.
export default function ServicePaths() {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const href = (path) => (isAr ? `/ar${path}` : path);

  const paths = [
    {
      key: 'asset',
      icon: <Building2 size={26} aria-hidden="true" />,
      audience: isAr ? 'لملاك العقارات التجارية' : 'For commercial property owners',
      title: isAr ? 'إدارة الأصول العقارية التجارية' : 'Commercial Real Estate Asset Management',
      desc: isAr
        ? 'ندير موقعك التجاري ونؤجره ونشغّله نيابةً عنك.'
        : 'We manage, lease and operate your commercial location on your behalf.',
      points: isAr
        ? ['التأجير ومزيج المستأجرين', 'إدارة العقود والتواصل مع المستأجرين', 'التشغيل اليومي والتقارير']
        : ['Leasing and tenant mix', 'Lease administration and tenant relations', 'Day-to-day operations and reporting'],
      cta: isAr ? 'احجز استشارة إدارة أصول' : 'Book an Asset Management Consultation',
      ctaPath: '/contact?interest=asset-management#consultation-form',
      more: isAr ? 'تعرّف على إدارة الأصول' : 'About Asset Management',
      morePath: '/asset-management',
    },
    {
      key: 'sourcing',
      icon: <MapPin size={26} aria-hidden="true" />,
      audience: isAr ? 'للعلامات التجارية التي تتوسع' : 'For brands looking for a location',
      title: isAr ? 'توفير مواقع الفرنشايز' : 'Franchise Location Sourcing',
      desc: isAr
        ? 'نوفّر لعلامتك التجارية مواقع في محطات الوقود والمولات والأندية في أنحاء مصر.'
        : 'We find locations for your brand in fuel stations, malls and clubs across Egypt.',
      points: isAr
        ? ['دراسة الموقع وحركة المرور', 'التفاوض على عقد الإيجار', 'تنسيق التراخيص والتسليم']
        : ['Site and traffic research', 'Lease negotiation', 'Permit coordination and handover'],
      cta: isAr ? 'أرسل متطلبات علامتك التجارية' : 'Submit Your Brand Requirements',
      ctaPath: '/contact?interest=franchise-sourcing#consultation-form',
      more: isAr ? 'تعرّف على توفير المواقع' : 'About Franchise Location Sourcing',
      morePath: '/franchise-sourcing',
    },
  ];

  return (
    <section aria-labelledby="services-heading" className="bg-fb-bg-light py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="eyebrow">{isAr ? 'خدماتنا' : 'Our Services'}</span>
          <h2 id="services-heading" className="text-fb-teal font-extrabold text-2xl sm:text-3xl md:text-4xl text-balance">
            {isAr ? 'مجالان رئيسيان. اختر ما يناسبك.' : 'Two Lines of Business. Choose Your Path.'}
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {paths.map((p) => (
            <li key={p.key} className="flex flex-col bg-white/70 border border-fb-teal/15 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,59,60,0.06)]">
              <span className="w-12 h-12 rounded-2xl bg-fb-teal text-fb-bg-light flex items-center justify-center">{p.icon}</span>
              <span className="eyebrow mt-5">{p.audience}</span>
              <h3 className="mt-2 text-fb-teal font-extrabold text-2xl leading-snug">{p.title}</h3>
              <p className="mt-3 text-fb-black/80 text-base leading-relaxed">{p.desc}</p>
              <ul className="mt-5 space-y-2.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-base text-fb-black/80">
                    <Check size={18} className="mt-1 shrink-0 text-fb-teal" aria-hidden="true" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7 flex flex-col sm:flex-row sm:items-center gap-3">
                <Link
                  href={href(p.ctaPath)}
                  className="inline-flex items-center justify-center gap-2 min-h-[44px] bg-fb-green hover:bg-fb-green-hover text-fb-teal font-extrabold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  <span>{p.cta}</span>
                  <ArrowRight size={16} className="rtl:rotate-180" aria-hidden="true" />
                </Link>
                <Link href={href(p.morePath)} className="inline-flex items-center justify-center min-h-[44px] px-4 text-sm font-bold text-fb-teal underline-offset-4 hover:underline">
                  {p.more}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
