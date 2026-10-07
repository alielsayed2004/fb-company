export default function sitemap() {
  const baseUrl = 'https://fbassets.com';
  const fixedDate = new Date('2026-10-06T00:00:00.000Z');

  const routes = [
    '/',
    '/about',
    '/asset-management',
    '/franchise-sourcing',
    '/insights',
    '/portfolio',
    '/portfolio/10th-of-ramadan-chillout-station',
    '/portfolio/mostafa-kamel-axis-new-cairo',
    '/portfolio/marina-5-north-coast',
    '/portfolio/al-rowad-club-10th-of-ramadan',
    '/portfolio/sour-nady-el-nady-sheraton',
    '/portfolio/sour-nady-el-obour',
    '/portfolio/el-salam-plaza-mall',
    '/contact',
    '/careers',
    '/privacy-policy',
    '/terms'
  ];

  const sitemapEntries = [];

  routes.forEach(route => {
    // English URL
    sitemapEntries.push({
      url: `${baseUrl}${route}`,
      lastModified: fixedDate,
      alternates: {
        languages: {
          en: `${baseUrl}${route}`,
          ar: `${baseUrl}/ar${route === '/' ? '' : route}`
        }
      }
    });
    
    // Arabic URL
    sitemapEntries.push({
      url: `${baseUrl}/ar${route === '/' ? '' : route}`,
      lastModified: fixedDate,
      alternates: {
        languages: {
          en: `${baseUrl}${route}`,
          ar: `${baseUrl}/ar${route === '/' ? '' : route}`
        }
      }
    });
  });

  return sitemapEntries;
}
