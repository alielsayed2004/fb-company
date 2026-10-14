import { pageMetadata, SITE_URL } from '@/lib/seo';
import { locationSlug } from '@/lib/projects';

const clip = (text, max) => {
  if (!text || text.length <= max) return text || '';
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
};

function locationTitle(project, locale) {
  const name = locale === 'ar' ? project.name_ar || project.name : project.name;
  const brand = locale === 'ar' ? 'إف بي' : 'F.B Company';
  const full = `${name} | ${brand}`;
  return full.length <= 60 ? full : clip(name, 60);
}

export function locationMetadata(project, locale) {
  const description = locale === 'ar' ? project.overview_ar || project.overview : project.overview;
  return pageMetadata({
    path: `/portfolio/${locationSlug(project)}`,
    locale,
    title: locationTitle(project, locale),
    description: clip(description, 155),
  });
}

// Place + BreadcrumbList. Only facts that exist in data/projects.json are used.
export function locationJsonLd(project, locale, coverImage) {
  const isAr = locale === 'ar';
  const base = isAr ? `${SITE_URL}/ar` : SITE_URL;
  const url = `${base}/portfolio/${locationSlug(project)}`;
  const name = isAr ? project.name_ar || project.name : project.name;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': project.id === 'el-salam-plaza-mall' ? 'ShoppingCenter' : 'Place',
        '@id': `${url}#place`,
        name,
        description: isAr ? project.overview_ar || project.overview : project.overview,
        url,
        ...(coverImage ? { image: `${SITE_URL}${encodeURI(coverImage)}` } : {}),
        address: {
          '@type': 'PostalAddress',
          streetAddress: isAr ? project.location_ar || project.location : project.location,
          addressLocality: isAr ? project.city_ar || project.city : project.city,
          addressCountry: 'EG',
        },
        containedInPlace: { '@type': 'Country', name: isAr ? 'مصر' : 'Egypt' },
        isPartOf: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isAr ? 'الرئيسية' : 'Home', item: isAr ? `${SITE_URL}/ar` : SITE_URL },
          { '@type': 'ListItem', position: 2, name: isAr ? 'المشاريع' : 'Portfolio', item: `${base}/portfolio` },
          { '@type': 'ListItem', position: 3, name, item: url },
        ],
      },
    ],
  };
}
