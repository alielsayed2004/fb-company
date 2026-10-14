# fbassets.com — F.B Company website

Next.js 16 (App Router) site for F.B Company, New Cairo, Egypt — commercial real estate asset management and franchise location sourcing. English at `/`, Arabic (RTL) at `/ar`. Hosted on **Vercel**.

## Run locally

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build && npm start   # production build
```

## Where content lives (single source of truth)

| What | File |
|---|---|
| Key figures (locations, brand outlets, land area) + verification status | `data/company.json` → `counters`, `countersMeta` |
| Address, phone, email, social links, map link, WhatsApp | `data/company.json` → `contactInfo` |
| Locations (name, city, status, metrics, brands, overview EN/AR, URL slug) | `data/projects.json` |
| Location photos / video / logos | `public/projects/<id>/` (`cover.jpg`, `video.mp4`, `logos/`) |
| Brand logos in the marquee | `data/brands.json` + `public/logos/`, names in `lib/brandLogos.js` |
| Page copy (EN + Modern Standard Arabic) | `data/translations.js` |
| FAQ (EN + AR) | `data/faq.js` |
| Articles (Insights, currently `noindex` and out of the nav) | `content/insights/{en,ar}/*.md` |

Copy rules: no guarantees, no return/yield/occupancy claims, no superlatives, no licence claims. Figures only from `data/company.json`.

## Environment variables (Vercel → Settings → Environment Variables)

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_PASSWORD_HASH_B64` | yes (admin) | Base64 of a bcrypt hash. Generate with `node scripts/hash-admin-password.js`. (A raw `$2b$…` hash gets corrupted by Next.js `$` expansion.) |
| `ADMIN_JWT_SECRET` | yes (admin) | ≥ 32 random characters. Missing/short → admin login disabled (fails closed). |
| `ADMIN_API_SECRET` | optional | ≥ 32 chars; server-to-server `x-admin-secret` only, never used in a browser. |
| `GITHUB_TOKEN` | optional | Fine-grained token (contents read/write on this repo) so the admin dashboard can publish edits. |
| `GOOGLE_SHEETS_WEBHOOK_URL` | yes | Contact form → Google Sheet (Apps Script web app). |
| `FORMSPREE_ENDPOINT` | yes | Contact form → email. The form reports an error if **both** deliveries fail. |
| `CAREERS_GOOGLE_SHEETS_WEBHOOK_URL` | yes | Careers form → Sheet + private Drive folder (`scripts/google-apps-script-careers.js`). |
| `CAREERS_WEBHOOK_SECRET` | optional | Shared secret checked by the careers Apps Script (`WEBHOOK_SECRET` script property). |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | optional | Enables GA4 (with consent banner). |

## Admin

`/admin` (not linked publicly). Session is an httpOnly cookie; login is rate-limited. Saving commits `data/*.json` to GitHub via `GITHUB_TOKEN`, which triggers a Vercel rebuild.

## SEO / GEO

Per-page metadata via `lib/seo.js`; structured data via `lib/schema.js` and `lib/locationSeo.js`; `app/sitemap.js`, `app/robots.js` (AI crawlers allowed), `app/llms.txt/route.js`. Canonical location URLs: `/portfolio/<slug>` (+ `/ar/...`); `/projects/<id>` 301-redirects there.

## Audit

`docs/audit/PHASE-1-AUDIT.md` (findings, decisions, placeholders) and `docs/audit/CHANGELOG-AUDIT.md` (every change, per step).
