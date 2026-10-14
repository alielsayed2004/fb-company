import { SITE_URL } from '@/lib/seo';
import { getAllLocations, locationSlug } from '@/lib/projects';

// Indexable pages only (no admin, API or Insights while it is out of the navigation).
const LAST_MODIFIED = new Date('2026-10-14T00:00:00.000Z');

export default function sitemap() {
  const paths = [
    '/',
    '/about',
    '/asset-management',
    '/franchise-sourcing',
    '/portfolio',
    ...getAllLocations().map((p) => `/portfolio/${locationSlug(p)}`),
    '/contact',
    '/careers',
    '/privacy-policy',
    '/terms',
    '/risk-disclaimer',
  ];

  return paths.flatMap((path) => {
    const en = `${SITE_URL}${path === '/' ? '' : path}`;
    const ar = `${SITE_URL}/ar${path === '/' ? '' : path}`;
    const alternates = { languages: { en, ar, 'x-default': en } };
    return [
      { url: en, lastModified: LAST_MODIFIED, alternates },
      { url: ar, lastModified: LAST_MODIFIED, alternates },
    ];
  });
}
