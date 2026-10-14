# fbassets.com audit — CHANGELOG

Branch `audit/full-site-2026-10`. One commit per step; every step can be reverted with `git revert <sha>`.
Issue IDs refer to `docs/audit/PHASE-1-AUDIT.md`.

---

## Step 1 — P0 security (SEC-01 … SEC-04, BLD-01 partial)

| File | Change | Why |
|---|---|---|
| `lib/auth.js` | Rewritten. No fallback secrets. JWT secret must be ≥ 32 chars or auth is disabled. Adds `getPasswordHash()` (accepts `ADMIN_PASSWORD_HASH_B64` or a valid raw `ADMIN_PASSWORD_HASH`), `isAdminRequest()` (session cookie from same origin **or** server-to-server `x-admin-secret`), constant-time secret comparison, `isSameOrigin()`, shared `sessionCookieOptions()` (`HttpOnly; Secure; SameSite=Strict`). | SEC-01, SEC-02. Fail closed. |
| `app/api/admin/login/route.js` | Removed hard-coded hash, the plaintext-password comment and default API secret. Returns **503** if env is missing/invalid. Rate limit: 5 attempts / 15 min / IP + 750 ms delay on failure. Rejects cross-origin posts. Response and session check never include any secret. | SEC-01, SEC-02, SEC-03 |
| `app/api/admin/logout/route.js` | Uses shared cookie options. | Consistency |
| `lib/rateLimit.js` | New shared in-memory limiter. **Limitation:** per serverless instance on Vercel; for a global limit back it with Upstash Redis / Vercel KV. | SEC-03 |
| `middleware.js` → `proxy.js` | Renamed (Next 16 convention). No fallback secret. Admin API = session cookie or server secret; admin pages = session cookie. | SEC-01, BLD-01 |
| `app/api/admin/sync/route.js` | Auth via `isAdminRequest`. **Removed:** accepting a GitHub token from header/query/body, the `save-token` action that wrote to `.env.local`, and all `child_process` `git add/commit/push` calls. Token check (`verify-token`) uses the server env token only. | SEC-04 |
| `lib/githubSync.js` | `resolveToken()` reads `GITHUB_TOKEN` env only. Fixed bug: `verifyGitHubToken` used the raw argument instead of the resolved token. | SEC-04 |
| `app/(en)/admin/page.js` | No admin secret or GitHub token in `sessionStorage`/`localStorage`; no secret/token headers; requests rely on the httpOnly cookie. GitHub-token input replaced by a read-only "server configuration" status with instructions to set `GITHUB_TOKEN` in Vercel. | SEC-02, SEC-04 |
| `app/(en)/admin/login/page.js` | Stops storing the secret; clear messages for 429 / 503. | SEC-02 |
| `app/(en)/layout.js`, `app/ar/layout.js`, `app/projects/layout.js` | `AdminPanelModal` no longer mounted on public pages (file kept, now unused). | Owner decision |
| `scripts/hash-admin-password.js` | New helper: prompts for a password, prints `ADMIN_PASSWORD_HASH_B64=…`. | Setup |

**Bug found while testing:** Next.js expands `$…` inside environment values, so a raw bcrypt hash (`$2b$10$…`) set in the environment is silently corrupted and can never match — the likely reason a hard-coded fallback hash had been added. Store the hash base64-encoded in `ADMIN_PASSWORD_HASH_B64`.

**Verified locally** (production build, throwaway credentials): no-auth → 401; old hard-coded secret → 401; old password → 401; cross-origin login → 403; correct password → 200 + `HttpOnly; Secure; SameSite=strict` cookie, no secret in body; session/sync with cookie → 200; cross-origin sync POST with cookie → 401; 6th failed login → 429; `/admin` without cookie → 307 `/admin/login`; logout clears session; missing `ADMIN_JWT_SECRET` → 503.

**Owner action on Vercel (Production + Preview):**
1. `node scripts/hash-admin-password.js` → set `ADMIN_PASSWORD_HASH_B64`; remove `ADMIN_PASSWORD_HASH`.
2. `ADMIN_JWT_SECRET` — new random value, ≥ 32 chars (e.g. `openssl rand -base64 48`).
3. `ADMIN_API_SECRET` — new random value, ≥ 32 chars (only for scripts; optional).
4. `GITHUB_TOKEN` — new fine-grained token, contents read/write on `fb-company` only.
5. Redeploy.

---

## Step 2 — P0 privacy: CVs (PRIV-01 … PRIV-03, owner decision D4)

| File | Change | Why |
|---|---|---|
| `scripts/google-apps-script-careers.js` | New CVs are set to `DriveApp.Access.PRIVATE` (was `ANYONE_WITH_LINK`). The CV folder is kept private. Drive upload failure now returns `status: "error"` (was silently recorded as success). Optional shared secret (`WEBHOOK_SECRET` script property ↔ `CAREERS_WEBHOOK_SECRET` Vercel env). New one-time helper `restrictExistingCvs()`. Setup notes updated (Vercel env, redeploy as **new version**). | PRIV-01 |
| `app/api/careers/route.js` | Rewritten. **No file is written to `public/`** (or anywhere on the web server). CV cap **4 MB** (Vercel limit 4.5 MB), PDF/DOC/DOCX only, email format check, field length limits, honeypot. Returns an error (`502 delivery_failed`) when the webhook is missing or fails, instead of reporting success. Errors carry a `code` for localisation. Uses shared rate limiter. | PRIV-02, PRIV-03, UX (false success) |
| `app/(en)/careers/page.js`, `app/ar/careers/page.js` | Client-side 4 MB check; every error shown in Arabic or English from a code table; honeypot field added. | D4, UX-11 |
| `data/translations.js` | Upload hint: "max 4 MB" / "الحد الأقصى 4 ميجابايت". | D4 |
| `public/uploads/` | Removed empty local folder (never committed, never served). | PRIV-02 |

**Verified locally:** missing fields → 400; bad email → 400; no consent → 400; 4.1 MB file → 413 `file_too_large`; `.exe` → 400 `file_type`; webhook unreachable → 502 `delivery_failed` (no false success); honeypot → 200 without delivery; 6th request in 3 min → 429. A real submission was **not** sent, to keep test rows out of your Sheet — please send one test application after deploying.

**Owner action (Google):** paste the updated script into the Apps Script editor → Deploy → Manage deployments → Edit → **New version** (same URL). Optionally run `restrictExistingCvs()` once (you are already restricting existing files manually).

---

## Step 3 — P0 leads: contact form (UX-01, UX-02, UX-07 partial)

| File | Change | Why |
|---|---|---|
| `app/api/contact/route.js` | Rewritten. Sends to Google Sheets and Formspree in parallel and checks each response. **Success only if at least one destination accepted the lead; if both fail → `502 delivery_failed`.** Every failed destination is logged (`Contact lead delivery failed via …`) and a total failure logs `CONTACT LEAD NOT DELIVERED (…)` — without the visitor's personal data. Server-side validation (required fields, email format, length limits, allowed interest values), honeypot checked, shared rate limiter. Formspree gets `_replyto` and a subject line. | UX-01, UX-02 |
| `app/(en)/contact/page.js`, `app/ar/contact/page.js` | Errors shown in EN/AR from a code table; on delivery failure the message shows your phone and email as a fallback; `role="alert"`; honeypot sent and hidden from assistive tech; every `?interest=` used on the site (`leasing`, `sourcing`, `consultation`, …) maps to a real option (default: consultation). | UX-01, UX-07 |

**Verified locally (mock endpoints):** both down → 502 + log lines; Sheets down & Formspree up → 200 + Sheets failure logged; both up → 200, both received; missing fields → 400; bad email → 400; honeypot → 200 without delivery.

**Where to see failures:** Vercel → Project → Logs, search `CONTACT LEAD NOT DELIVERED`. (Optional later: alerting via a Vercel log drain.)


---

## Step 4 — P0 compliance & data, P1 equal weight (CMP-01…08, DATA-01…04, UX-03, UX-04, UX-05, UX-06 partial, SEO-04/05 partial, BUG-01)

### Single source of truth
| File | Change | Why |
|---|---|---|
| `data/company.json` | Counters are now `locations: 7`, `brands: 54`, `area: 40,900` (m²) with a `countersMeta` block: **status TO VERIFY**, as-of 2026-10-14, and how each value is derived from `data/projects.json`. No occupancy figure. | DATA-01, owner instruction |
| `context/DataContext.js` | Rewritten as a thin provider over `data/*.json` (bundled at build). **Removed:** IndexedDB/localStorage loading and writing, the public call to `/api/admin/sync`, the code that rewrote stored `60+`→`200+` and `50,000+`→`500,000+`, `sanitizeArabicName()` (verified no-op on current data), all hard-coded blog/brand/counter defaults. | DATA-01, DATA-02, DATA-03 |
| `data/projects/*.json` (8 files incl. README) | **Deleted** (approved). They overrode `projects.json` with different values: Banks Service Center 8 brands (master 15), Mostafa Kamel 6 (master 11). Master values kept — **TO VERIFY**. | DATA-04 |
| `data/blogs.json` | **Deleted** (approved second article source). `content/insights/*.md` is the only article source. | Owner decision |
| `app/projects/[id]/page.js` | No longer merges the deleted per-project files. | DATA-04 |
| `app/api/admin/sync/route.js` | No longer reads/writes `data/projects/*.json` or `data/blogs.json`; keeps other keys (e.g. `countersMeta`) when saving `company.json`. | DATA-04 |
| `app/(en)/admin/page.js` | Articles tab removed (its data source was deleted); occupancy input and the `"100%"` / `100,000+ vehicles` defaults for new locations removed. | DATA, CMP |
| `components/StatCounter.js` | New. Server HTML contains the **final value** (no more "0+"); counts up once only after hydration, when visible, and only if reduced motion is off. | MOT-02 |

### Unverified figures removed from the public site
Removed from `data/projects.json` (this file is shipped to browsers, so hiding in the UI was not enough). Values kept here for your verification:

| Location | Field | Removed value |
|---|---|---|
| `chillout-10th-of-ramadan-banks` | `metrics.occupancyRate` | 100% |
| `chillout-10th-of-ramadan-banks` | `mapInfo.catchment` | 120,000+ daily vehicles & employees |
| `chillout-mostafa-kamel` | `metrics.occupancyRate` | 100% |
| `chillout-mostafa-kamel` | `mapInfo.catchment` | 85,000+ local residents in 1.5km radius |
| `chillout-marina-5` | `metrics.occupancyRate` | 100% |
| `chillout-marina-5` | `mapInfo.catchment` | 300,000+ weekly summer tourists |
| `chillout-10th-of-ramadan-alrowad` | `metrics.occupancyRate` | 100% |
| `chillout-10th-of-ramadan-alrowad` | `mapInfo.catchment` | 40,000+ local sports club footfall |
| `sour-nady-el-nady` | `metrics.occupancyRate` | 100% |
| `sour-nady-el-nady` | `mapInfo.catchment` | 70,000+ local urban population |
| `sour-nady-el-obour` | `metrics.occupancyRate` | 96% |
| `sour-nady-el-obour` | `mapInfo.catchment` | 50,000+ local residents & club members |
| `el-salam-plaza-mall` | `metrics.occupancyRate` | Allocating |
| `el-salam-plaza-mall` | `mapInfo.catchment` | 180,000+ daily commuter vehicle flows |

Also removed: home "guarantee 100% occupancy" + "Audited and verified institutional metrics" (+ AR "عوائد استثمارية قياسية"); occupancy cards on Home, About, Portfolio, location drawer, location page and timeline ("100% Occupied" badge); tenant-section "100,000+ daily vehicles", "up to 70%", "pre-approved licensing", "100% Portfolio Occupancy", "Proven Advantage"; franchise case study "100% Leased"; About timeline "100% triple-net occupancy" and "targeting 500,000 SQM"; company-profile block "500,000+ SQM" bullet; meta "50+ leading brand partners", "KFC", "عائد مستمر".

### Copy
| File | Change | Why |
|---|---|---|
| `data/translations.js` | Fully rewritten. EN: institutional, non-promissory; no yield/return/guarantee/superlatives. **AR: Modern Standard Arabic throughout (D2).** Asset Management described only as commercial real estate asset management — managing, leasing and operating commercial locations (**[PENDING D3 CONFIRMATION]**); no client funds/portfolios/risk-tolerance wording. "Division One/Two" replaced with service names. Counter keys renamed `locations/brands/area`. Terminology: "Franchise Location Sourcing" / "توفير مواقع الفرنشايز". Leadership text = visible placeholder `[ADD: …]`. | CMP-04, D2, D3, CNT-01, EEAT-01 |
| `data/projects.json` | All 7 overviews rewritten factually (EN + MSA AR) — no "flagship/premium/elite/top-tier". | CMP-04 |
| `components/TenantPartnershipSection.js` | Rewritten: capability pillars without numbers; brand list **derived from `projects.json`** (39 distinct brands, with number of locations each); localized CTA. | CMP-03, CNT-03 |
| `components/PortfolioTimeline.js` | Removed catchment sentence and occupancy badge; the tag that labelled locations "Asset Management"/"Franchise Sourcing" **by odd/even index** now shows the city. | CMP-05, data accuracy |
| `components/ProjectDrawer.js`, `app/projects/[id]/ProjectPageClient.js` | Occupancy and catchment removed; no invented fallbacks ("High Volume"). | CMP-05 |
| `app/(en|ar)/about/page.js` | 3 figures; timeline rewritten neutrally (years **TO VERIFY**). | DATA-01, CMP |
| `app/(en|ar)/franchise-sourcing/page.js` | Case study reads city/status/year/brands from `projects.json`; process steps rewritten; RTL alignment (`text-start`). | CMP, CNT-02 |
| `app/(en|ar)/asset-management/page.js` | Process steps rewritten (removed "risk tolerances", "الأرباح"). | D3, CMP |
| `app/(en|ar)/portfolio/page.js`, `app/(en|ar)/page.js` | 3 figures; neutral hero/statement copy; AR "why" heading no longer hard-coded ("استدامة العوائد"). | CMP, DATA-01 |
| `content/insights/*/*.md` | Claims removed; bodies replaced with visible `[ADD: article text]` (they were placeholders). | CMP |

### Risk disclaimer & legal
| File | Change |
|---|---|
| `app/(en)/risk-disclaimer/*`, `app/ar/risk-disclaimer/*` | New page EN + AR, visible `[ADD: legal review]` notice. No licence claim. |
| `components/Footer.js` | Links: Privacy · Terms · **Risk Disclaimer**; **Admin link removed** (D6); 44 px link targets; hooks-order bug fixed (BUG-01). |
| `components/Navbar.js` | Hooks-order bug fixed (BUG-01). |
| Asset Management page | Short disclaimer under the closing CTA, linking to the Risk Disclaimer. |

### Equal weight for both business lines
| File | Change |
|---|---|
| `components/ServicePaths.js` (new) | Home section: two identical cards — "For commercial property owners → Asset Management" and "For brands looking for a location → Franchise Location Sourcing" — same size, 3 points each, primary CTA + "About…" link. |
| `app/(en|ar)/page.js` | Hero buttons: two equal path buttons (replaces Consultation + 23 MB PDF). Final CTA: Consultation + "Submit Your Brand Requirements" (Careers removed). Articles section hidden (D5). All links localized for AR. |
| `components/ServiceCta.js` (new) | Shared hero button + closing CTA used by **both** service pages. Asset Management now has a hero CTA and a closing CTA (it had none). |

### Metadata (SEO-04/05 brought forward)
| File | Change |
|---|---|
| `lib/seo.js` (new) | `pageMetadata()` builder: canonical, hreflang en/ar/x-default, OG + Twitter `summary_large_image`, branded image, optional `noindex`. |
| All page `layout.js` (EN + AR) + root layouts | New titles ≤ 60 chars and descriptions ≤ 155 chars per page and language (AR in MSA; AR pages no longer have English titles/OG text). Insights pages `noindex` while placeholder. |
| `public/og/fb-company-og.png` (new) | 1200×630 share image from the existing logo and brand colours — **[ADD: approved branded OG image]** if you want a designed one. |

### Unmounted (code kept)
- `components/AIAssistant.js` — no longer rendered on any page (owner decision 3).
- `components/AdminPanelModal.js`, `components/BlogSection.js` — no longer rendered; now unused.

**Verified locally:** all 15 key pages return 200; server HTML shows `7 / 54 / 40,900` without JavaScript; none of the banned terms appear in visible text (except inside the disclaimer itself); Risk Disclaimer linked on every page; no `/admin` link; **zero console errors and zero `/api/*` calls** on public pages (was a 401 on every page).

---

## Step 5 — P0 SEO: broken URLs, redirects, crawlers (SEO-01…03, SEO-06, SEO-07, GEO-04, SEC-06 partial, BLD-01)

| File | Change | Why |
|---|---|---|
| `app/(en)/portfolio/[slug]/page.js`, `app/ar/portfolio/[slug]/page.js` | Rebuilt as the **canonical location page** (owner decision): server component, `await params` (Next 16), static generation of all 7 slugs in EN + AR, `dynamicParams = false` → unknown slugs return a real **404** (was 200 "Not Found"). Renders the full case-study UI. Unique title/description per location and language; JSON-LD `Place` (`ShoppingCenter` for El Salam) + `BreadcrumbList` with only data-backed facts. The Google Maps iframe (blocked by CSP) is gone. | SEO-01, SEO-09 |
| `components/ProjectPageClient.js` (moved from `app/projects/[id]/`) | Back button → localized `/portfolio`; AR status "قيد التشغيل" (was "تشغيل ممتاز" = "excellent operation"); **removed developer instructions shown to the public** ("drop photos into public/projects/…") → visible `[Location photos pending]`; localized contact link. | UX, CNT |
| `lib/projects.js` (new) | Server helpers: slug lookup and photo/logo/video discovery (moved from the deleted `/projects/[id]` page). | Single source |
| `lib/locationSeo.js` (new) | Location metadata + JSON-LD builders. | SEO-01, GEO-02 |
| `data/projects.json` | Added `slug` to each location (keeps the URLs already in the sitemap). | SEO-01 |
| `app/projects/` (route, layout, page) | **Removed**; replaced by 301 redirects. | SEO-03 |
| Portfolio grid, drawer, homepage timeline | Links point to `/portfolio/<slug>` (or `/ar/portfolio/<slug>`). | SEO-03, UX-06 |
| `app/(en|ar)/insights/[slug]/page.js` | `await params` fixes the **HTTP 500**; static params, real 404 for unknown slugs, `noindex`, Article schema, single `<h1>` (Markdown headings demoted). Layout files removed (metadata now in the page). | SEO-02 |
| `lib/api.js` | Article slug validated (`^[a-z0-9-]+$`) — blocks path traversal into the filesystem. | Security |
| `next.config.mjs` | **301** redirects: `/projects/<id>` → `/portfolio/<slug>` and `/ar/projects/<id>` → `/ar/portfolio/<slug>` (generated from `projects.json`), plus catch-alls; **www.fbassets.com → fbassets.com 301** backstop; CSP tightened (removed `'unsafe-eval'`, browser access to `api.github.com`, `formspree.io`, `script.google.com` — forms post to our own API); `outputFileTracingRoot` (removes the lockfile warning). | SEO-03, SEO-07, SEC-06, BLD-01 |
| `app/sitemap.js` | Rebuilt from data: 17 pages × EN/AR = 34 URLs incl. the 7 location pages and the Risk Disclaimer; no Insights, no `/projects`. | SEO-06 |
| `app/robots.js` | `*` plus explicit **GPTBot, ClaudeBot, PerplexityBot, Google-Extended**: allow `/`, disallow `/admin` and `/api/` (owner decision). | GEO-04 |
| `app/llms.txt/route.js` (new) | `/llms.txt` generated from `data/company.json` + `data/projects.json`: entity summary, both services, figures with as-of date, all locations, contact, disclaimer link. | GEO-04 |
| `out/` | Stale static export deleted (approved; was never committed). | Owner decision |

**Verified locally:** all 7 location pages EN + AR → 200, one `<h1>`, unique titles, Place/ShoppingCenter + BreadcrumbList; `/portfolio/does-not-exist` → 404; `/projects/chillout-marina-5` → 301 `/portfolio/marina-5-north-coast`; `/ar/projects/sour-nady-el-obour` → 301 `/ar/portfolio/sour-nady-el-obour`; `/insights/<slug>` → 200 `noindex` (was 500); traversal attempt → 404; `Host: www.fbassets.com` → 301 `https://fbassets.com/...`; sitemap 34 URLs; robots and llms.txt correct; zero console errors on location pages.

**Owner action (Vercel dashboard):** Project → Settings → Domains → add `www.fbassets.com` → "Redirect to fbassets.com" → **301**. This issues the www certificate; the config redirect is only a backstop.

---

## Step 6 — Approved deletions (cleanup)

Everything below was re-checked as unreferenced immediately before removal. Restore any item with `git checkout <commit>~1 -- <path>`.

| Removed | Size | Notes |
|---|---|---|
| `components/EgyptScannerCard.js` | — | Contained per-site "EXPECTED YIELD 13.9–17.2%" and "100% occupancy". |
| `components/EgyptMap.js` | — | Unused. |
| `components/EagleOfForesight.js` | — | Unused. |
| `components/ImpactNumbers.js` | — | Unused (duplicate counter logic). |
| `components/PartnersGrid.js` | — | Unused. |
| `components/BrandLogo.js` | — | Unused. |
| `lenis` (npm dependency) | — | `SmoothScroll.js` never used it. |
| `public/images/earth-egypt-focus-transparent.png`, `-user.png`, `-wide.png`, `earth-egypt-focus.png`, `globe-sphere-pure.png` | ≈ 2.5 MB | Only `earth-egypt-focus-cropped.png` is used. |
| `public/videos/hero-bg.mp4.gif` | 8.4 MB | Unreferenced. |
| `public/videos/hero-bg-mobile.mp4` | — | Unreferenced. |
| `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | 20 KB | create-next-app defaults, unreferenced. |
| Earlier steps: `data/projects/*.json` (8 files), `data/blogs.json`, `out/` | — | See Steps 4 and 5. |

**Now unused but NOT deleted (not on the approved list):** `components/AdminPanelModal.js`, `components/BlogSection.js`, `components/SmoothScroll.js` (renders nothing), `lib/db.js` (IndexedDB helper, no longer imported). `components/AIAssistant.js` is kept on purpose (owner decision).

---

## Step 7 — Performance & motion (MOT-01…05, PERF-01…03, owner's performance list) + fix for a Step 5 regression

### Regression found and fixed
Step 5 added catch-all redirects `/projects/:path*` → `/portfolio`. These also matched the **real photo/video files** in `public/projects/<id>/…`, so location images and videos were redirected (never deployed — found during local testing). `next.config.mjs` now keeps only the exact per-location redirects (`/projects/<id>` → `/portfolio/<slug>`, AR too) plus `/projects` → `/portfolio`. Re-verified: 418 unique local links/assets across 24 pages return 200; old location URLs still 301.

### Content visible without JavaScript
| File | Change |
|---|---|
| `components/motion.js` (new) | Drop-in `motion` used by all public pages: mount animations (hero) render as plain visible HTML; scroll reveals render visible with `data-reveal`; real framer-motion is kept only for interactive/state-driven animation (exit/AnimatePresence, layout, gestures, MotionValue parallax, `animate` without `initial`). |
| `lib/reveal.js` (new) + root layouts | Tiny inline script: only elements that start **below the first screen** are hidden-then-revealed (IntersectionObserver, once), and only if JS runs and reduced motion is off. Anything on screen at load is never hidden. 3 s safety reveal. |
| `app/globals.css` | Reveal CSS (opacity + transform only, 500 ms, one easing); global `prefers-reduced-motion` rule disables animations/transitions. |
| `components/InteractiveEarthFocus.js` | Uses the new `motion`; decorative globe image no longer `priority` (it was preloaded and competing with the hero). |

Result: text at `opacity:0` in server HTML **48 → 0** (Home) and 10–30 → 0 (inner pages); the only remaining `opacity:0` is the decorative cursor dot. Text still invisible after scrolling: **0** on all pages at 390 px and 1440 px; with JavaScript disabled: **0** (was 48).

### Logo marquee
| File | Change |
|---|---|
| `components/PartnersMarquee.js` | One set of 3 rows for all breakpoints, each duplicated once for a seamless loop: **435 → 111 `<img>`** on Home; plain lazy `<img>` with fixed size instead of next/image srcsets; alt text from `lib/brandLogos.js` (was "Brand Partner #N"); duplicate copies `aria-hidden`; **pauses on hover/focus + visible Pause/Play button**; `h3` → `h2`. Home HTML **873 KB → 157 KB**. |
| `data/translations.js` | Marquee title "Our Brand Partners" / "العلامات التجارية الشريكة" (the logos come from the company profile, not only the project data). |

### Videos
| Change | Before → after |
|---|---|
| All 14 videos re-encoded (H.264, ≤1280 px, ≤30 fps, CRF 28, no audio track, fast-start) — same file names; frame comparison showed no visible difference under the hero overlay. | **≈ 75 MB → 13 MB** (e.g. contact 11.2 → 0.9 MB, hero 8.3 → 1.4 MB) |
| `components/HeroVideo.js` (new): poster image paints immediately; video attaches only after the `load` event (idle); skipped for reduced-motion and Data-Saver users. Used on Home, About, both service pages, Portfolio, Contact, Careers and location pages. | Hero video no longer competes with first paint |
| New posters `public/videos/*-poster.jpg` (13–43 KB; home 90 KB). Location pages use the Next image optimizer for the cover poster (Marina cover 2.9 MB PNG → 99 KB WebP). | — |
| Remaining `preload="auto"` → `preload="metadata"`. | — |

### Fonts
| Change |
|---|
| Lama Sans converted to **WOFF2** (≈155 KB → ≈51 KB per weight), TTF kept as fallback; unused Thin (100) and ExtraLight (200) faces removed from CSS; **Regular and ExtraBold preloaded**. |
| Render-blocking Google Fonts `@import` for **Outfit** removed (not a brand font); fallbacks are system fonts with Arabic support. CSP no longer allows Google Fonts. |

### Measured (local production build)
| Page | Lighthouse mobile Perf before → after | Page weight before → after |
|---|---|---|
| Home | 59 → ~78 | 9.9 MB → 2.7 MB |
| Home AR | 59 → ~80 | 9.8 MB → 2.7 MB |
| Asset Management | 76 → ~83 | 3.5 MB → 0.9 MB |
| Contact | 76 → ~83 | 12.2 MB → 1.6 MB |
| Location (Marina 5) | 73 → ~75 | 5.9 MB → 2.6 MB |

Best Practices: 96 → **100** on every page tested. Real Chrome with mobile throttling (slow 4G, 4× CPU) measures LCP **0.8–0.9 s** on Home and El Salam; Lighthouse's simulated LCP remains pessimistic (4–6 s) because it attributes the post-load video download to the page — final numbers in Phase 3.

---

## Step 8 — P1 accessibility & navigation (D1, A11Y-01…04, UX-09, UX-10, RESP-02, RESP-03)

| File | Change | Why |
|---|---|---|
| `app/globals.css` | New token **`--color-fb-green-text: #306E49`** (owner decision D1: small text on light backgrounds only; 5.17:1 on `#E6EEF1`). `.eyebrow` uses it and now lives in `@layer components`, so `text-fb-green` still overrides it on teal sections where the brand green passes (4.79:1). `#53B379` unchanged everywhere else. | D1, A11Y-01 |
| Light-background labels (insights dates, "Step 01" labels, careers benefit labels, company-profile block, timeline eyebrow, footer label, footer hovers) | `text-fb-green` → `text-fb-green-text`. | A11Y-01 |
| All public pages/components | Text 9.5–11 px → 12 px; `text-fb-black/50` → `/70`, `slate-500` → `slate-600`, `text-fb-teal/40` → `/70` (all ≥ 4.5:1 on the light background). | A11Y-01, RESP-03 |
| Pages, drawer, location page | Card/section headings `h4`/`h5` → `h3`; location-page sections, careers benefits/success and footer column titles → `h2`; visually-hidden `h2` "Our locations" on the portfolio grid. Visual sizes unchanged (classes). | A11Y-02 |
| `components/Navbar.js` | Rewritten. Scrolled header is a **solid teal bar at every width** (links were white-on-light and unreadable on desktop over light sections); logo and language switch **stay visible** (they used to fade out); compact **"Book a Consultation"** button; active link `aria-current="page"`; 44 px targets. Mobile menu: `role="dialog"`, `aria-modal`, `aria-expanded`/`aria-controls`, focus moves into the menu, **focus trap**, **Escape closes**, focus returns to the menu button, scroll lock, closes on navigation, mirrored in RTL. Full link row from 1280 px; menu button below. | UX-09, UX-10, RESP-02 |
| `components/ProjectDrawer.js` | `role="dialog"`, `aria-modal`, accessible name; close button 44 px, localized label, focused on open (Escape already closed it). | A11Y-03 |
| Contact & careers forms | Inputs/selects/textareas 16 px (no iOS zoom on focus). | A11Y-04 |
| `app/(en|ar)/careers/page.js` | CV picker is a real `<button>` (was a clickable `<div>`, unreachable by keyboard); file input labelled. | A11Y |
| `components/Footer.js` | Social icons 44 × 44 px; navigation links 44 px tall and 14 px text. | RESP-02, UI-02 |

**Verified locally:** Lighthouse Accessibility **100** on Home, Home AR, About, Asset Management, Franchise Sourcing, Portfolio, Contact, Careers (EN + AR) and a location page (was 94–98; `color-contrast` and `heading-order` no longer reported). Mobile menu tested: opens with focus inside, body scroll locked, Escape closes and returns focus to the button.
