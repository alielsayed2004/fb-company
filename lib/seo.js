// Shared metadata builder: unique title/description per page and language, canonical, hreflang, OG, Twitter.
export const SITE_URL = 'https://fbassets.com';
export const SITE_NAME = 'F.B Company';

// Branded share image (1200×630). [ADD: approved branded OG image] — logo-based placeholder until supplied.
export const OG_IMAGE = { url: '/og/fb-company-og.png', width: 1200, height: 630, alt: 'F.B Company — From Vision to Value' };

// path: English path ('/' or '/about'); locale: 'en' | 'ar'.
export function pageMetadata({ path, locale, title, description, noindex = false }) {
  const enPath = path;
  const arPath = path === '/' ? '/ar' : `/ar${path}`;
  const url = locale === 'ar' ? arPath : enPath;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: enPath, ar: arPath, 'x-default': enPath },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_EG'],
      type: 'website',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE.url],
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
