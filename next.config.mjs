import path from 'path';
import { fileURLToPath } from 'url';
import projects from './data/projects.json' with { type: 'json' };

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// Browsers only talk to our own origin: forms post to /api/*, which forwards to Formspree/Google server-side.
// 'unsafe-inline' is still required for Next.js inline bootstrap scripts (no nonce setup yet).
// Google Analytics domains are allowed only when GA4 is configured (NEXT_PUBLIC_GA_MEASUREMENT_ID).
const ga = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? ' https://www.googletagmanager.com https://*.google-analytics.com' : '';

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${ga};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self' data:;
  connect-src 'self'${ga};
  media-src 'self' blob: data:;
  frame-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`.replace(/\s{2,}/g, ' ').trim();

// Old location URLs → canonical /portfolio/[slug] (owner decision), as permanent 301s.
const locationRedirects = projects.flatMap((p) => {
  const slug = p.slug || p.id;
  return [
    { source: `/projects/${p.id}`, destination: `/portfolio/${slug}`, statusCode: 301 },
    { source: `/ar/projects/${p.id}`, destination: `/ar/portfolio/${slug}`, statusCode: 301 },
  ];
});

const nextConfig = {
  // The parent folder has its own lockfile; pin the workspace root to this project.
  outputFileTracingRoot: projectRoot,

  // Branded 404 for unmatched URLs across both root layouts (app/global-not-found.js).
  experimental: { globalNotFound: true },

  async redirects() {
    return [
      // Backstop for www → apex. Primary setup: add www.fbassets.com in Vercel → Domains → redirect (301).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.fbassets.com' }],
        destination: 'https://fbassets.com/:path*',
        statusCode: 301,
      },
      ...locationRedirects,
      { source: '/projects', destination: '/portfolio', statusCode: 301 },
      { source: '/ar/projects', destination: '/ar/portfolio', statusCode: 301 },
      // No catch-all for /projects/*: /projects/<id>/<file> are real photo/video assets in public/.
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: cspHeader },
        ],
      },
    ];
  },
};

export default nextConfig;
