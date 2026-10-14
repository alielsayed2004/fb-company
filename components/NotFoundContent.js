import Link from 'next/link';

// Branded, bilingual-aware 404 content with routes to both business lines.
const COPY = {
  en: {
    code: 'Error 404',
    title: 'This page could not be found',
    desc: 'The page may have moved, or the link may be incorrect. These pages may help:',
    links: [
      ['/', 'Home'],
      ['/asset-management', 'Asset Management'],
      ['/franchise-sourcing', 'Franchise Location Sourcing'],
      ['/portfolio', 'Our Locations'],
      ['/contact', 'Contact Us'],
    ],
  },
  ar: {
    code: 'خطأ 404',
    title: 'تعذّر العثور على هذه الصفحة',
    desc: 'ربما نُقلت الصفحة أو أن الرابط غير صحيح. قد تفيدك هذه الصفحات:',
    links: [
      ['/', 'الرئيسية'],
      ['/asset-management', 'إدارة الأصول'],
      ['/franchise-sourcing', 'توفير مواقع الفرنشايز'],
      ['/portfolio', 'مواقعنا'],
      ['/contact', 'تواصل معنا'],
    ],
  },
};

export default function NotFoundContent({ locale = 'en', compact = false, headingLevel = 1 }) {
  const c = COPY[locale];
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  const href = (path) => (locale === 'ar' ? (path === '/' ? '/ar' : `/ar${path}`) : path);
  return (
    <section lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${compact ? 'py-10' : 'pt-36 pb-24'} px-4 sm:px-6`}>
      <div className="max-w-2xl mx-auto text-center space-y-5">
        <p className="eyebrow">{c.code}</p>
        <Heading className="text-fb-teal font-extrabold text-3xl sm:text-4xl">{c.title}</Heading>
        <p className="text-fb-black/80 text-base leading-relaxed">{c.desc}</p>
        <ul className="flex flex-wrap justify-center gap-3 pt-2">
          {c.links.map(([path, label]) => (
            <li key={path}>
              <Link href={href(path)} className="inline-flex items-center min-h-[44px] px-5 rounded-xl border border-fb-teal/20 bg-white/70 text-fb-teal font-bold hover:bg-white transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
