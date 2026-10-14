import company from '@/data/company.json';
import { SITE_URL } from '@/lib/seo';

// One quotable entity definition, reused word-for-word on Home, About, llms.txt and in structured data.
export const ENTITY = {
  en: 'F.B Company is an Egyptian company based in New Cairo with two lines of business: commercial real estate asset management (managing, leasing and operating commercial locations) and franchise location sourcing (finding locations in fuel stations, malls and clubs for franchise brands expanding in Egypt).',
  ar: 'شركة إف بي شركة مصرية مقرها القاهرة الجديدة، تعمل في مجالين: إدارة الأصول العقارية التجارية (إدارة المواقع التجارية وتأجيرها وتشغيلها)، وتوفير مواقع الفرنشايز (إيجاد مواقع في محطات الوقود والمولات والأندية للعلامات التجارية التي تتوسع في مصر).',
};

// Coordinates parsed from the company's own Google Maps link (data/company.json → contactInfo.mapUrl). TO VERIFY.
function geoFromMapUrl(url = '') {
  const m = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  return m ? { '@type': 'GeoCoordinates', latitude: Number(m[1]), longitude: Number(m[2]) } : undefined;
}

export function organizationJsonLd(locale = 'en') {
  const c = company.contactInfo;
  const isAr = locale === 'ar';
  const address = {
    '@type': 'PostalAddress',
    streetAddress: 'B165, Dr. Ahmed Okasha St., El Banafseg Buildings',
    addressLocality: 'New Cairo',
    addressRegion: 'Cairo Governorate',
    addressCountry: 'EG',
  };
  const sameAs = [c.facebook, c.x, c.instagram, c.linkedin, c.tiktok].filter(Boolean);
  const telephone = (c.phone || '').replace(/\s+/g, '');

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'F.B Company',
        alternateName: ['FB Assets', 'F.B Assets', 'FB For Assets Management', 'إف بي'],
        url: SITE_URL,
        logo: `${SITE_URL}/company/logo.png`,
        slogan: 'From Vision to Value',
        description: ENTITY[isAr ? 'ar' : 'en'],
        email: c.email,
        telephone,
        address,
        areaServed: { '@type': 'Country', name: 'Egypt' },
        knowsAbout: ['Commercial real estate asset management', 'Franchise location sourcing', 'Retail site selection', 'Commercial leasing'],
        sameAs,
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#localbusiness`,
        name: 'F.B Company',
        url: SITE_URL,
        image: `${SITE_URL}/og/fb-company-og.png`,
        description: ENTITY[isAr ? 'ar' : 'en'],
        telephone,
        email: c.email,
        address,
        geo: geoFromMapUrl(c.mapUrl),
        hasMap: c.mapUrl,
        areaServed: { '@type': 'Country', name: 'Egypt' },
        parentOrganization: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#ceo`,
        name: 'Eng. Mohamed Bahr',
        jobTitle: 'Chief Executive Officer',
        worksFor: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'F.B Company',
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: ['en', 'ar'],
      },
    ],
  };
}
