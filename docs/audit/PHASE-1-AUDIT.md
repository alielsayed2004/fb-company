# fbassets.com — Phase 1 Audit Report

**Branch:** `audit/full-site-2026-10` · **Date:** 2026-10-14 · **Status:** Report only, no fixes applied
**Method:** Local production build (`next build` + `next start`), full crawl of all routes (EN + AR), source review of every page/component/API route, Lighthouse 12 (mobile + desktop), headless-Chrome device sweep (11 widths × 15 pages), WCAG contrast computation, live-site header checks, visual review of the 25-page company-profile PDF.

Severity: **P0** = broken / legal / trust / security risk · **P1** = hurts conversion or ranking · **P2** = polish.

---

## Phase 2 status — 2026-10-14 (branch `audit/full-site-2026-10`, details in `CHANGELOG-AUDIT.md`)

**Legend:** ✅ fixed and verified locally · 🟡 partly done / needs your data · 👤 action on your side (dashboard, Google, designer, lawyer) · ⏸ not done (P2, optional)

| Area | Status |
|---|---|
| Security | ✅ SEC-01 fail-closed auth, no hard-coded secrets · ✅ SEC-02 httpOnly session only · ✅ SEC-03 login rate limit (per instance) · ✅ SEC-04 no browser token, no `.env.local` writes, no shell git · 👤 SEC-05 revoke GitHub PAT + reset remote · 🟡 SEC-06 CSP tightened (`unsafe-eval` and third-party origins removed); `unsafe-inline` remains (needs nonces) |
| Privacy | ✅ PRIV-02 no CV files on the web server · ✅ PRIV-03 4 MB cap with EN/AR message · ✅ PRIV-01 Apps Script stores CVs as Restricted — 👤 paste + redeploy the script as a new version |
| Compliance | ✅ CMP-01…06 all guarantee/yield/occupancy/traffic claims removed, AI assistant unmounted · ✅ CMP-07 Risk Disclaimer EN/AR + footer link — 👤 legal review · 👤 CMP-08 company-profile PDF needs a corrected export from your designer |
| Data | ✅ DATA-01…04 one source of truth (`data/company.json`), no browser override, no admin API calls from public pages, duplicate files removed — figures: 7 locations (from data), 200+ brand partners and 500,000+ m² managed & sourced (**provided by owner 2026-10-15**) |
| SEO | ✅ SEO-01…06, SEO-08, SEO-09 (canonical location pages EN/AR, 301s, 500s fixed, titles/descriptions, OG images, sitemap) · ✅/👤 SEO-07 www 301 backstop in code — add `www` domain in Vercel |
| UX & equal weight | ✅ UX-01…07, UX-09…11 · 🟡 UX-08 WhatsApp button ready (needs number), office hours [ADD] |
| Motion & performance | ✅ MOT-01…05 · ✅ PERF-01…03 · 🟡 PERF-04 mobile Lighthouse 59 → 77–83 (target ≥ 90 not yet reached in Lighthouse's simulation; real throttled LCP ≈ 1 s) · 👤 PERF-05 PDF size (designer) |
| GEO | ✅ GEO-01 entity definition · ✅ GEO-02 Organization/LocalBusiness/Person/WebSite/Place/Breadcrumb/FAQPage schema · ✅ GEO-03 FAQs EN/AR **[TO VERIFY answers]** · ✅ GEO-04 robots (AI crawlers allowed) + `/llms.txt` |
| Trust | 🟡 EEAT-01 leadership block is a visible `[ADD]` placeholder · ✅ TRUST-01 privacy policy rewritten — 👤 legal review · 🟡 TRUST-02 GA4 + consent + events ready (needs measurement ID) |
| Accessibility | ✅ A11Y-01…04 (D1 colour applied), RESP-01…04 — Lighthouse Accessibility 100 on all tested pages |
| Content | ✅ CNT-01…05 (terminology, data-driven case study and brand list, 404, README) · ✅ D2 Modern Standard Arabic · 🟡 D3 Asset Management wording **[PENDING D3 CONFIRMATION]** |
| Architecture | ✅ BUG-01 · 🟡 BUG-02 `/projects` layout removed; EN and AR remain separate root layouts (language switch = full page load — acceptable, no change recommended) · ✅ BLD-01 (👤 locally: `rm -rf node_modules && npm ci` to repair the corrupted SWC binary) |
| P2 polish | ⏸ UI-01 spacing/radius token normalisation · ✅ UI-02 · ✅ UI-03 RTL logical properties · ✅ UI-04 custom cursor removed (owner decision) |

**Open questions for you**
1. **Arabic tagline:** hero says "من الفكرة إلى القيمة"; older metadata used "من الرؤية إلى القيمة". Which is official?
2. **Mobile hero video:** to reach Lighthouse mobile ≥ 90, show only the poster image (no video) on phones? (recommended) — or keep the video.

**Lighthouse after Phase 2** (local production build; mobile = simulated Moto G Power / slow 4G). Before → after.

| Page | Mobile Perf | Desktop Perf | A11y | Best Practices | SEO | Page weight |
|---|---|---|---|---|---|---|
| Home | 59 → 77 | 90 → 98 | 94 → 100 | 96 → 100 | 100 | 9.9 MB → 2.7 MB |
| Home AR | 59 → 78 | 92 → 99 | 94 → 100 | 96 → 100 | 100 | 9.8 MB → 2.6 MB |
| About | 76 → 83 | 96 → 100 | 94 → 100 | 96 → 100 | 100 | 6.2 MB → 1.4 MB |
| Asset Management | 76 → 83 | 96 → 99 | 94 → 100 | 96 → 100 | 100 | 3.5 MB → 0.9 MB |
| Franchise Sourcing | 70 → 83 | 96 → 99 | 94 → 100 | 96 → 100 | 100 | 6.9 MB → 1.2 MB |
| Franchise Sourcing AR | 76 → 82 | 96 → 99 | 98 → 100 | 96 → 100 | 100 | 6.9 MB → 1.2 MB |
| Portfolio | 94 → 80 | 88 → 98 | 94 → 100 | 96 → 100 | 100 | 4.9 MB → 1.8 MB |
| Contact | 76 → 83 | 97 → 99 | 95 → 100 | 96 → 100 | 100 | 12.2 MB → 1.6 MB |
| Careers | 70 → 83 | 97 → 100 | 95 → 100 | 96 → 100 | 100 | 3.0 MB → 1.2 MB |
| Location (Marina 5) | 73 → 81 | 82 → 98 | 94 → 100 | 96 → 100 | 100 | 5.9 MB → 2.2 MB |

Notes: Portfolio mobile dropped 94 → 80 because its hero now shows a poster and then a video like every other page (before, its LCP happened to be text). Mobile is still below the ≥ 90 target in Lighthouse's **simulation**, which charges the post-load hero video to the page; measured in real Chrome with slow-4G + 4× CPU throttling, LCP is 0.8–1.0 s on Home and service pages. Options to reach ≥ 90 in Lighthouse: no hero video on mobile (poster only), or smaller mobile video cuts — your call (design decision).

---

## 1. Summary scores (out of 10)

| Area | Score | One-line reason |
|---|---|---|
| A. UI (visual) | 6 | Strong look and consistent cards; brand green fails contrast for all small text; heading levels skip (h2→h4) |
| B. UX (behaviour & flow) | 4 | No "investor vs brand" paths; Asset Management page has **no CTA at all**; leads can be silently lost; no WhatsApp |
| C. Content, text & data | **2** | Four different "brand partner" numbers, managed SQM claimed at 12× the portfolio's own data, stats hard-coded in 5+ places, two Arabic registers |
| D. Animations & motion | 4 | Most text starts at `opacity:0` in the server HTML; counters show "0+" without JS; reduced-motion ignored by framer-motion; marquee can't be paused |
| E. Responsive | 6 | No horizontal scroll at phone widths and one H1 everywhere; but 20–31 sub-44 px tap targets per page, 11 px labels, 14 px inputs, content left invisible after scroll |
| F. Technical SEO | 4 | 14 soft-404 + 6 HTTP-500 URLs (live), sitemap lists broken URLs, 7 location pages with identical titles/no schema, no OG images on inner pages |
| G. GEO | 3 | No FAQ, no entity paragraph, no llms.txt, no FinancialService/Person/Breadcrumb schema, content hidden pre-hydration |
| H. Accessibility | 5 | Lighthouse 94–98, but contrast failures, no focus trap / dialog semantics on menu & drawers, small tap targets |
| I. Trust, security & compliance | **1** | Hard-coded admin password/secret, static secret handed to browser, no login rate-limit, CVs shared "anyone with link", guarantee/yield language, no risk disclaimer, no analytics |

---

## 2. Decisions I need from you (each has a recommendation)

| # | Decision | Option A | Option B | My recommendation |
|---|---|---|---|---|
| D1 | **Accessible green for small text.** `#53B379` on `#E6EEF1` = **2.21:1** (needs 4.5). It is used for every eyebrow label, badge and small link. | Add a text-only shade of the same hue, **`#306E49`** (5.17:1 on bg, 6.08:1 on white). Keep `#53B379` for buttons, icons, large text and anything on teal (4.79:1 there — passes). | Keep green for decoration only; switch all small text to teal `#003B3C`. | **A** — stays inside the brand hue, minimal visual change. |
| D2 | **Arabic register.** `translations.js` is Egyptian colloquial ("بنختار"، "عايز"، "هيوصلك") while About milestones, tenant section, legal pages and metadata are MSA. | Clear, light Modern Standard Arabic everywhere. | Egyptian colloquial everywhere. | **A** — institutional/financial audience, matches the EN tone, and safer for regulators and AI citations. |
| D3 | **What "Asset Management" means.** Your brief: *buying, selling and managing investments matched to client risk tolerance.* The site and PDF: *owning/managing commercial real estate (fuel plazas, malls) and leasing to brands.* | Site describes **real-estate asset management** (what the portfolio actually shows). | Site describes **managing client investments by risk profile**. | Need your confirmation. Note: managing third-party money in Egypt is typically an FRA-regulated activity; option B copy will need careful wording and possibly legal review. I will not claim any licence. |
| D4 | **CV storage.** | Keep the Google Apps Script → Drive pipeline, change sharing to **restricted** (only your Google account), stop the `public/` write, cap CV at **4 MB** (Vercel's 4.5 MB request limit). | Move to Vercel Blob with signed, admin-only access + client-side direct upload (allows larger files, more code). | **A** — smallest change, already working, admin access via your Google account. |
| D5 | **Home "Insights/Blog" section.** Insights is out of the nav, but the homepage still renders 3 articles from `data/blogs.json` (a *different* source than `/insights`), containing "record yields" and "outperform by over 40%". | Hide the section until Insights returns (code kept). | Keep it, rewrite the copy. | **A**. |
| D6 | **Footer "Admin" link** (lock icon, visible to all visitors). | Remove from public footer; admins use `/admin` directly. | Keep. | **A**. |

**Deletions needing approval (Rule 4) — nothing deleted yet:**
- Unused components (imported nowhere): `components/EgyptScannerCard.js` (contains per-site "EXPECTED YIELD 13.9–17.2%"), `EgyptMap.js`, `EagleOfForesight.js`, `ImpactNumbers.js`, `PartnersGrid.js`, `BrandLogo.js`. → Propose delete (or move to `/_archive`).
- Unused dependency `lenis` (`SmoothScroll.js` returns `null`). → Propose remove.
- Stale `out/` static export (Sep 7) — **you already approved**.
- Duplicate project data: `data/projects/*.json` overrides disagree with `data/projects.json` (see DATA-04). → Propose merge into one file.
- Second article source `data/blogs.json` + blog defaults in `DataContext.js` vs `content/insights/*.md`. → Propose keep `content/insights` only.
- 6 unused/duplicate images in `public/images/` (only `earth-egypt-focus-cropped.png` is referenced) `public/videos/hero-bg.mp4.gif` (8.4 MB) and `public/videos/hero-bg-mobile.mp4` (both unreferenced). → Propose delete.

---

## 3. Data conflicts (why C scores 2/10)

| Fact | Homepage / About counters | Portfolio meta / other pages | `data/projects.json` | Company profile PDF | AI assistant |
|---|---|---|---|---|---|
| Brand partners | **200+** | **50+** (portfolio meta) | **54** tenant slots (sum of `numBrands`) · 54 logo files | **+60** "Global Brands" | 200+ |
| Managed area | **500,000+ SQM** (stated as achieved) | About timeline 2026: "*targeting* over 500,000 SQM" (not achieved) | **40,900 SQM** total land (sum of 7 projects) | +500,000 SQM | "exceeds 500,000" |
| Occupancy | **100%** ("guarantee 100% occupancy") | Tenant section "100% Portfolio Occupancy" | Obour **96%**, El Salam "Allocating" | **98%** | Marina **98%** (data says 100%) |
| Projects / stations | **8+** | — | **7** (1 under construction, 1 is a mall) | 7 | "(8+) projects" then lists 7 |
| El Salam project name | — | "El Salam Plaza Mall" | El Salam Plaza Mall | "**Mall Gesr El Suez**" | El Salam Plaza Mall |
| Company name | F.B Company | — | — | "**F&B** Assets Management" / "FOR ASSETS MANAGEMENT" | F.B Company |
| Banks Center tenants | — | — | **15** (master) vs **8** (override file) vs **16** logo files | — | lists 8 |

Also: `context/DataContext.js:258,269` silently rewrites any stored brand count of `60+` to `200+` and `50,000+` SQM to `500,000+` in visitors' browsers.

---

## 4. Issues

### 4.1 P0 — broken, security, legal, trust

| ID | Page | Area | Issue | Evidence | Proposed fix |
|---|---|---|---|---|---|
| SEC-01 | All (API) | Security | Hard-coded admin password hash with plaintext password in a comment; hard-coded fallback admin API secret and JWT secret. If an env var is missing, public defaults apply. | `app/api/admin/login/route.js:5-7`, `middleware.js:20`, `app/api/admin/sync/route.js:14`, `lib/auth.js:4` | Remove all fallbacks; read env vars only; if any is missing → return 503 / deny (fail closed). Add a startup check. |
| SEC-02 | /admin | Security | Login response returns the **static, never-rotating** admin API secret to the browser (stored in `sessionStorage`); every admin call uses it. The httpOnly JWT cookie is effectively bypassed. | `login/route.js:32-37,66-69`, `admin/login/page.js:38`, `AdminPanelModal.js:88,139` | Authorise admin API calls with the httpOnly JWT cookie only (+ SameSite + origin check). Never send the secret to the client. Keep `x-admin-secret` for server-to-server only. |
| SEC-03 | /admin | Security | No rate limit or lockout on `/api/admin/login`; current password is 6 numeric digits. | `login/route.js` | Per-IP rate limit + exponential back-off; require a strong password (you are rotating it). |
| SEC-04 | /api/admin/sync | Security | Endpoint can accept a GitHub token from the request body/header and **write it into `.env.local`**, and runs `git commit/push` via `child_process`. | `sync/route.js:251-261, 541-581` | Remove token-from-client path and shell git execution; GitHub token only from Vercel env. |
| SEC-05 | Repo | Security | GitHub PAT embedded in git remote URL. | `git remote -v` | **You are handling** (revoke + reset remote). |
| PRIV-01 | /careers | Privacy | Apps Script uploads each CV to Drive and sets **`ANYONE_WITH_LINK` / VIEW**; the link is written into the Sheet. Anyone who obtains a link can read the CV. | `scripts/google-apps-script-careers.js:83` | Set sharing to private (owner only), share folder with admin accounts. Re-permission existing files (script provided in Phase 2). |
| PRIV-02 | /careers | Privacy | API writes a CV backup to `public/uploads/cv/` (a publicly served folder). | `app/api/careers/route.js:112-114` | Remove the local write. **Exposure check:** local `public/uploads/cv/` is empty, never committed to git; on Vercel the filesystem is read-only so the write fails → **no CVs were publicly reachable via the website**. Drive links (PRIV-01) are the real exposure — please list the files in Drive folder `FB_Company_Careers_CVs`; I cannot access your Drive. |
| PRIV-03 | /careers | Reliability | Vercel serverless request limit is **4.5 MB**; form allows 10 MB CVs → large uploads fail with HTTP 413 and the applicant sees a generic error. | `careers/page.js:81`, `api/careers/route.js:94` | Cap at 4 MB client- and server-side with a clear AR/EN message (see D4). |
| CMP-01 | Home | Compliance | "consistently **guarantee 100% occupancy**"; AR version: "عوائد استثمارية **قياسية**". | `app/(en)/page.js:276-277` (and `app/ar/page.js`) | Replace with non-promissory, factual copy (e.g. "Portfolio occupancy is reported per location") and placeholder metrics. |
| CMP-02 | Home | Compliance | "Audited and verified institutional metrics" — no audit exists on record. | `page.js:282` | Remove, or replace with "Figures as of [ADD: date], source: internal records". |
| CMP-03 | Home | Compliance | Tenant section: "100% Portfolio Occupancy Stability", "100,000+ daily commuter vehicles", "reduces launch time by up to 70%", "Fully pre-approved licensing", AR "عوائد تشغيلية قياسية". | `components/TenantPartnershipSection.js:39-66, 94` | Remove figures; rewrite as capabilities without numbers until verified. |
| CMP-04 | Global copy | Compliance | Yield / return wording across `translations.js`: "high-yielding", "maximum compounding yield", "Institutional Yield", "high-yield holdings", "Optimize Your Portfolio Yield", "Premier", "top-tier", "stable yields"; AR: "أقصى عائد"، "عائد مستدام"، "بعائد قوي"، "نضمن أعلى تدفق نقدي"، "عالية العائد". | `data/translations.js:15,52,58,74,84,116-118,128-138,154,200,214,233-234,339,394,400,440,459-460,470-472,562-563,576` | Rewrite every line in neutral, non-promissory language (EN + AR). Full redline delivered in Phase 2 for your approval. |
| CMP-05 | Location pages, drawer, timeline | Compliance | Per-site traffic figures shown publicly (120,000+ daily vehicles, 300,000+ weekly tourists, etc.). | `data/projects.json → mapInfo.catchment`; rendered in `ProjectDrawer.js:238`, `ProjectPageClient.js:420`, `PortfolioTimeline.js:59-61` | Hide the field until you confirm figures. |
| CMP-06 | All | Compliance | AI assistant: "Net Annual Yield 14.5%–17.5%", "Zero vacancy risk", "sovereign tenants", "guaranteed cash flow" (AR "مضمون"), self-described "**investment advisor**". | §5 | **You decided:** disable on all public pages (code kept). |
| CMP-07 | All | Compliance | No risk disclaimer anywhere; Terms only say "informational purposes". | Footer, `/terms` | Add `/risk-disclaimer` + `/ar/risk-disclaimer`, link in footer, short disclaimer line on Asset Management page and Home stats. Text marked **[ADD: legal review]**. |
| CMP-08 | PDF | Compliance | Company profile: "premier firm", "high-yield investment hubs", "consistent ROI growth" with an unlabeled chart, "the world's most recognized brands", "F&B Assets Management". | `public/FB_Company_Profile.pdf` p.5-7, 13 | Needs a revised PDF from your designer (I can't edit a Photoshop export). Until then, consider removing the download links — **your call**. |
| DATA-01 | Home, About, Portfolio, AI | Data / trust | Conflicting stats (see §3). | §3 | One source of truth `data/site-facts.json`; brand count → `[ADD: verified brand partners count]`; other unconfirmed values → placeholders. |
| DATA-02 | All | Data | Visitor browser cache (IndexedDB/localStorage) overrides server data; stale/old content can show indefinitely; includes rewrite rules for names and numbers. | `context/DataContext.js:204-337` | Public pages read build-time data only; remove client persistence and `sanitizeArabicName` rewrites from public path. |
| DATA-03 | All | Data / errors | Every public page calls `/api/admin/sync` → 401 → the only console error (fails Lighthouse "errors-in-console"). | `DataContext.js:292` | Remove call from public pages (you decided). |
| DATA-04 | Location pages | Data | Two project files disagree (Banks: 15 vs 8 brands; Mostafa Kamel: 11 vs 6). Which one shows depends on the page. | `data/projects.json` vs `data/projects/*.json` | Merge into a single file after you confirm the correct values. |
| SEO-01 | /portfolio/[slug] ×14 | SEO | All return **HTTP 200 "Not Found"** (soft 404) — live. `params` is read synchronously; in Next 16 it is a Promise. These are the URLs in the sitemap. | crawl; `app/(en)/portfolio/[slug]/page.js:21` | Await `params`; becomes the canonical location page (your decision) with unique metadata + schema; `notFound()` for bad slugs. |
| SEO-02 | /insights/[slug] ×6 | SEO | **HTTP 500** (live). Same `params` bug. | live `curl`: 500; `insights/[slug]/page.js` | Await params; `notFound()`; remove from sitemap (your decision). |
| SEO-03 | /projects/* | SEO | Linked from all portfolio cards, but no AR version (switcher → 404), identical title ×7, no canonical/hreflang/schema. | crawl | 301 → `/portfolio/[slug]` (your decision). |
| UX-01 | /contact | Leads | API always returns `success` even if **both** Google Sheets and Formspree fail; errors are swallowed. A lead can be lost while the user sees "Submission Successful". | `app/api/contact/route.js:88-116` | Return success only if at least one delivery succeeded; otherwise error + show phone/WhatsApp fallback. |
| UX-02 | /contact | Spam | Honeypot `_gotcha` is never sent or checked; no server validation; any empty POST is accepted. | `contact/page.js:114`, `route.js` | Send + check honeypot, validate fields server-side (length, email format), keep rate-limit. |

### 4.2 P1 — hurts conversion or ranking

| ID | Page | Area | Issue | Evidence | Proposed fix |
|---|---|---|---|---|---|
| UX-03 | /asset-management | UX / equal weight | **No call-to-action anywhere on the page** (hero has none, page ends with company-profile block). Franchise Sourcing has a CTA only at the very bottom — neither service hero has one (confirmed in 390 px screenshots). | `asset-management/page.js` | Add hero CTA + closing CTA ("Book an investment consultation") linking to `/contact?interest=asset-management`. |
| UX-04 | Home | UX / equal weight | No section that presents the two business lines side by side; H1 visible text is only "From Vision to Value"; translations label them "Division **One**" / "Division **Two**". | `page.js:198-214`, `translations.js:190,212` | Two equal service cards in/under the hero ("I'm an investor" / "I'm a brand looking for a location"), each with its own CTA. Remove "One/Two" ranking. |
| UX-05 | Home | UX | Competing CTAs: hero = Consultation + 23 MB PDF; final CTA = Consultation + **Careers**. | `page.js:231-246, 534-547` | Hero: two path CTAs. Final CTA: consultation + secondary "Submit your brand". Careers stays in nav/footer. |
| UX-06 | AR pages | UX / i18n | Arabic pages link to English URLs: hero CTA, final CTA, about link, careers, franchise CTA, portfolio cards. | crawl: `/ar` links to `/contact…`, `/about`, `/careers`, `/projects/*` | Locale-aware link helper used everywhere. |
| UX-07 | /contact | UX | `?interest=leasing` (sent from Home) and `not-sure` don't exist in the `<select>`; server error text is English-only on AR page; no privacy/consent note. | `contact/page.js:29-34`; `route.js` messages | Map all params; localised error messages; consent line linking to privacy policy. |
| UX-08 | All | Trust / UX | No WhatsApp on public pages (only inside the AI assistant, which is being disabled); no map embed; no office hours. | grep | Add WhatsApp + phone click-to-chat (needs **[ADD: WhatsApp number]**), office hours **[ADD]**, static map link/embed. |
| UX-09 | All | Nav | On desktop, logo **and language switcher fade out** after 20px of scroll → no way to switch language or go home without scrolling up. No primary CTA in nav. | `Navbar.js:74-77,114-118` | Keep logo + language visible on scroll; add a compact "Book consultation" button. |
| UX-10 | Mobile menu | A11y / UX | No focus trap, no Escape to close, no `aria-expanded`/`aria-controls`, focus not returned to button. | `Navbar.js:131-197` | Add dialog semantics, focus trap, Escape. |
| UX-11 | /careers | UX | AR page title in English; error messages from API in English. | crawl; `api/careers/route.js` | Localised metadata and messages. |
| BUG-01 | All | React | Hooks called after an early `return` in Navbar and Footer (Rules of Hooks) → crashes/warnings when navigating between /admin and public pages. | `Navbar.js:21-25`, `Footer.js:12-16` | Move conditional return below hooks. |
| BUG-02 | All | Architecture | Three separate root layouts (`(en)`, `ar`, `projects`) each with its own `<html>` → every EN↔AR switch is a full page reload; `projects` layout lacks schema and hreflang. | `app/*/layout.js` | Consolidate shared shell; `/projects` removed by redirect. |
| MOT-01 | All | Motion / SEO / GEO | Server HTML has text at `opacity:0` (48 elements on Home, 20–30 on inner pages) → invisible without JS, delays LCP (home mobile LCP **9.5 s**; LCP element is the hero paragraph waiting for its fade-in). | crawl `opacity:0` counts; Lighthouse LCP element | Render content visible by default; animate only after hydration (or CSS-only reveal with `@supports`/`.js` class); hero text never hidden. |
| MOT-02 | Home, About | Content | Counters render **"0+", "0%", "0+", "0+"** in server HTML and stay 0 without JS. | crawl | Render final value server-side; animate from 0 only when JS runs and motion allowed. |
| MOT-03 | All | A11y | framer-motion ignores `prefers-reduced-motion` (only 2 components check it); hero parallax and word reveals always run. | no `MotionConfig` | Wrap app in `<MotionConfig reducedMotion="user">`; disable parallax under reduced motion. |
| MOT-04 | Home | A11y | Logo marquee (8 rows) has no pause on hover/focus and no pause control; mobile + desktop variants both rendered. | `PartnersMarquee.js` | Pause on hover/focus, visible pause button, render one variant. |
| MOT-05 | Home, About, Franchise | Motion / content | Sections stay at opacity 0 even after scrolling the full page (Home 11–32 elements, About 2–13). | §8 device sweep | Visible-by-default content; reveal = enhancement only (same fix as MOT-01). |
| RESP-02 | All (mobile) | Responsive | 20–31 tap targets under 44×44 px per page (logo, menu button 38 px, text links 16 px tall, social icons 30 px). | §8 | Min 44 px hit areas via padding; larger footer links. |
| RESP-03 | Home, Portfolio, Location | Responsive | Labels at 10–11 px (counter labels, card indices, field labels). | §8 | Minimum 12 px for labels, 14–16 px for body on mobile. |
| RESP-04 | All (mobile) | Responsive | Floating AI-assistant button (bottom corner) covers content: card text on service pages and the phone field on Contact (390 px screenshots). | `before/` screenshots | Goes away with the assistant; the future WhatsApp button must reserve space (`safe-area` + bottom padding) and never overlap form fields. |
| PERF-01 | Home | Performance | 435 `<img>` tags (logos ×4 copies × 2 layouts), each with a 15-entry srcset → 873 KB HTML. | crawl | Two copies max, one layout, fixed small `sizes`; consider SVG/sprite. |
| PERF-02 | All | Performance | Hero videos 3–12 MB with `preload="auto"` on inner pages; `contact.mp4` 11 MB; Contact page weight **12.2 MB**. | `du`; Lighthouse | Re-encode (H.264 ~1–2 MB, + WebM), `preload="none"`/poster first, no video on mobile or a lighter mobile cut. |
| PERF-03 | All | Performance | Fonts: 9 TTF weights (1.4 MB), no WOFF2, no preload; plus a render-blocking Google Fonts `@import` for **Outfit** (not a brand font). | `globals.css:1-77` | Convert to WOFF2, ship only used weights (400/500/600/700/800), preload 400+700, remove Outfit. |
| PERF-04 | Home | Performance | Mobile Lighthouse Performance: Home 59 (EN and AR), inner pages 70–76, location page 73 with **LCP 18.6 s**. Only `/portfolio` reaches ≥ 90 on mobile. | §7 | Fixes above. |
| PERF-05 | PDF | Performance | Company profile is 23 MB, image-only (not readable by search engines or AI). | `public/FB_Company_Profile.pdf` | Ask designer for an optimised (<5 MB) export with live text. |
| SEO-04 | All | SEO | Titles > 60 chars: Home 69, Asset Mgmt 75, Franchise 77, Portfolio 63 (AR 67), About 63, AR Franchise 62. Descriptions > 155: Home 163, Franchise 162. Privacy/Terms descriptions 31–33 chars. AR Careers/Privacy/Terms titles in English. | metadata crawl | Rewrite all titles/descriptions per language. |
| SEO-05 | Inner pages | SEO / social | No `og:image` on any inner page (only Home and Insights); Twitter card degrades to `summary`; OG image is the logo declared 800×600 but actually 3334×834. | metadata crawl | Branded 1200×630 OG images per page (EN/AR). |
| SEO-06 | Sitemap | SEO | Lists 14 broken portfolio URLs and 6 Insights pages (all erroring); fixed `lastModified` date for every URL; no image entries. | `app/sitemap.js` | Rebuild from the location data source; drop Insights (your decision). |
| SEO-07 | Domain | SEO | `www.fbassets.com` resolves to Vercel but has **no certificate** (HTTPS error). | `curl -v` | **Vercel dashboard (you):** add `www.fbassets.com` to the project → set "Redirect to fbassets.com" with **301**. I'll add a host-based 301 in `next.config.mjs` as a backstop. |
| SEO-08 | Franchise page | SEO | Meta description names McDonald's, KFC and El Ezaby as clients; brand names in metadata/schema are claims of a commercial relationship. | `franchise-sourcing/layout.js` | Only name brands you confirm in writing. |
| SEO-09 | Location pages | SEO | Embedded Google Map iframe in `/portfolio/[slug]` would be **blocked by CSP** (`frame-src 'self'`). | `next.config.mjs` CSP, `[slug]/page.js:75` | Allow `https://www.google.com` in `frame-src` or use a static map link. |
| GEO-01 | Home, About | GEO | No single, quotable entity definition paragraph. | content review | Add identical EN/AR entity paragraph (draft in Phase 2, placeholders for founding year/figures). |
| GEO-02 | All | GEO | Schema: `ProfessionalService` instead of `FinancialService`/`RealEstateAgent`; no `geo`, `openingHours`, `BreadcrumbList`, `FAQPage`, `Person` page; `founder` claim not shown anywhere on the site. | JSON-LD | Full graph with real data only; placeholders for geo/hours. |
| GEO-03 | All | GEO | No FAQ sections (AR/EN). | — | Add FAQ blocks on Home, Asset Management, Franchise Sourcing (+ FAQPage schema). |
| GEO-04 | Root | GEO | `/llms.txt` missing; robots.txt has no AI-crawler rules. | crawl | Add llms.txt; robots: allow GPTBot, ClaudeBot, PerplexityBot, Google-Extended (your decision). |
| EEAT-01 | About | Trust | No leadership section — Eng. Mohamed Bahr is never named on the site (only in schema). "Decades of combined experience", "board and senior investment committee" are unverified. | `about/page.js`, `translations.js:184-186` | Leadership block with **[ADD: photo, bio, role]**; remove unverifiable claims. |
| A11Y-01 | All | A11y | Contrast failures: green small text 2.21:1, `text-fb-teal/40` labels 2.20:1, mobile-menu tagline 2.97:1, `slate-500` on bg 4.05:1. | computed | Per D1; raise opacity of muted text. |
| A11Y-02 | All | A11y | Heading order: `h2 → h4` throughout (cards use `h4`); Lighthouse flags `heading-order` on every page. | Lighthouse | Use `h3` for card titles. |
| A11Y-03 | Drawer, Project page | A11y | ProjectDrawer has Escape but no `role="dialog"`, `aria-modal`, focus management. | `ProjectDrawer.js` | Dialog semantics + focus trap. |
| A11Y-04 | Forms | A11y / mobile | Inputs use `text-sm` (14 px) → iOS zooms on focus; errors not linked via `aria-describedby`; no inline validation. | `contact/page.js`, `careers/page.js` | 16 px inputs, inline AR/EN validation, `aria-invalid`/`aria-describedby`. |
| TRUST-01 | Legal | Compliance | Privacy policy doesn't mention CVs/recruitment data, processors (Google Sheets/Drive, Formspree, Vercel), retention or user rights. | `/privacy-policy` | Expanded text with **[ADD: legal review]** (Egypt Personal Data Protection Law No. 151/2020 — for your lawyer to confirm applicability). |
| TRUST-02 | All | Analytics | No GA4 / Search Console verification; no conversion events. | grep | Add GA4 (**[ADD: GA4 measurement ID]**), events on form submit, phone, WhatsApp, email, PDF download; cookie notice. |
| CNT-01 | All | Content | Terminology: "Franchise Sourcing" (6) vs "Franchise Location Sourcing" (4) vs "Commercial Franchise Location Sourcing"; AR "الفرنشايز" (translations) vs "الفرانشايز" (metadata) vs "الامتياز التجاري" (insights). | translations scan | Standardise: **Franchise Location Sourcing / توفير مواقع الفرنشايز** (or your preferred AR term). |
| CNT-02 | Franchise page | Content | Case study "10th of Ramadan — Operational (100% Leased) — Year Built 2023" + hard-coded brand list (McDonald's, El Ezaby, Othaim…) separate from project data. | `franchise-sourcing/page.js:91-94, 250-259` | Pull from location data; confirm values. |
| CNT-03 | Home | Content | Tenant section names Carrefour, Spinneys, Papa John's, Cilantro, Burger Republic, TBS, 929… AI assistant adds Burger King, Costa, CIB, QNB, TotalEnergies, Circle K, Kazyon, Seif — not all appear in logos/PDF. | `TenantPartnershipSection.js:22-35`, §5 | Show only brands you confirm (one list in the data file). |

### 4.3 P2 — polish

| ID | Page | Area | Issue | Evidence | Proposed fix |
|---|---|---|---|---|---|
| UI-01 | All | UI | Mixed radius/shadow tokens (rounded-xl / 2xl / 3xl, many arbitrary shadows); spacing values off the 4/8 scale (`py-4.5`, `gap-3.5`, `space-y-3.5`). | classes | Define tokens in `@theme`; normalise. |
| UI-02 | Footer | UI / mobile | Footer links `text-xs` (12 px) on mobile; social icons ~30 px tap targets. | `Footer.js` | 14–16 px links, 44 px targets. |
| UI-03 | RTL | UI | Hard-coded `md:text-left`, `ml-/mr-`, arrows not mirrored in some CTAs (franchise CTA, about link). | `franchise-sourcing/page.js:248,264,291`; `page.js:404` | Logical properties (`text-start`, `ms-/me-`), `rtl:rotate-180`. |
| UI-04 | All | UI | `CustomCursor` adds a JS cursor follower on desktop (extra main-thread work, no a11y value). | `CustomCursor.js` | Remove or disable under reduced motion — your preference. |
| RESP-01 | Home @1024 | Responsive | 1–2 px horizontal scroll caused by the header language switcher translating off-screen on scroll. | §8 | Resolved by UX-09 (switcher stays visible). |
| SEC-06 | All | Security | CSP allows `'unsafe-eval'` and `'unsafe-inline'` scripts; `connect-src` allows `api.github.com` from the browser. | `next.config.mjs` | Nonce-based CSP; drop `unsafe-eval`; GitHub calls server-side only. |
| BLD-01 | Repo | Build | Next warns: `middleware` → rename to `proxy`; two lockfiles (`~/package-lock.json` + project) confuse workspace root. Native SWC binary corrupted locally (falls back to WASM). | build log | Rename to `proxy.js`, set `outputFileTracingRoot`; `rm -rf node_modules && npm ci` locally. |
| CNT-04 | 404 | UX | Default unbranded English 404 for both languages. | crawl | Branded bilingual `not-found` pages with links to both services. |
| CNT-05 | README | Docs | README is the create-next-app default. | `README.md` | Short project README (env vars, data file, deploy). |

---

## 5. AI assistant — every claim it makes (assistant to be disabled)

Source: `components/AIAssistant.js`. All figures below are **unverified** and will not return until you confirm them.

| Topic | Claims (EN; AR equivalent says the same unless noted) |
|---|---|
| Identity | "As F.B Company's **investment advisor**" · "A **premier** Egyptian firm" · AR "شركة استثمار وتطوير **رائدة**" |
| Returns | "Net Annual Yield: Averages **14.5% to 17.5%**" (said 3 times: About, Land, ROI answers) · "Drive-Thru … generates **premium returns**" / AR "عوائد **مضاعفة**" · "Contractual compound escalations **safeguard capital principal**" / AR "تحمي الأصل **تماماً** من التضخم وتقلبات العملة" · "**Zero vacancy risk** with premier **sovereign** & blue-chip tenants" / AR "ملاءة مالية **سيادية**" · NNN: "Predictable, passive cash flow" / AR "تدفق نقدي دوري ثابت **ومضمون**" |
| Portfolio | 500,000+ SQM · 200+ partner brands · 100% portfolio occupancy · "(8+) projects" then lists 7 |
| Banks Center | 7,200 SQM · 120,000+ daily vehicles & employees · 100% leased · McDonald's, El Ezaby, Bazooka, Cilantro, TBS, 929, Othaim, Papa John's |
| Marina 5 | KM 105 Alex–Matrouh road, facing Rotana Hotel · 9,200 SQM · 300,000+ weekly summer tourists · **98%** occupancy · McDonald's, Spinneys, Burger Republic, TBS, Shashlik, Sultan, Al Koftageya, El Ezaby |
| Mostafa Kamel | South of Academy · 5,400 SQM · 85,000+ high-income residents within 1.5 km · 100% · Carrefour, Papa John's, El Ezaby, Burger Republic, 929, Cilantro |
| Al-Rowad | 4,900 SQM · 100% · 40,000+ footfall · Bazooka, El Ezaby, Othaim, Hunger Station, Sultan |
| Sour Nady El Nady | Sheraton, Heliopolis · 3,800 SQM · 70,000+ high-income residents · 100% · McDonald's, TBS, El Ezaby, Burger Republic, 929, Cilantro |
| Sour Nady El Obour | 4,200 SQM · 96% · Carrefour, Papa John's, El Ezaby, Al Koftageya, Bazooka |
| El Salam Plaza | 6,200 SQM land / **14,500 SQM BUA** · under construction, opening 2026 · 180,000+ daily vehicles · McDonald's, El Ezaby, TBS, Cilantro reserved |
| Leasing | Units 50–1,500 SQM · 9–15-year binding Triple-Net leases · "Franchise Sourcing **Director**" contact |
| Brands list | McDonald's, Burger King, Costa Coffee, Papa John's, Cilantro, Bazooka, TBS, Shashlik, Burger Republic, 929, Sultan, Carrefour, Spinneys, Othaim, Kazyon, Circle K, El Ezaby, Seif, **CIB, QNB, TotalEnergies**, Chillout Hub |
| Contact | "WhatsApp: **24/7** dedicated investor channel" / AR "متاحة على مدار الساعة" |

---

## 6. CV exposure check (your request)

- `public/uploads/cv/` exists locally but is **empty**; `git log --all -- public/uploads` → never committed.
- On Vercel the filesystem is read-only, so the backup write in `api/careers/route.js` fails silently → **no CV was ever served from fbassets.com**.
- **Real exposure:** every CV uploaded through the form is stored in Google Drive folder `FB_Company_Careers_CVs` with **"Anyone with the link can view"** (`scripts/google-apps-script-careers.js:83`), and the link is in the Sheet. **Action for you now:** in Drive, select all files in that folder → Share → General access → **Restricted**. I'll update the script in Phase 2 so new uploads stay private.

---

## 7. Lighthouse baseline (local production build)

Mobile = Lighthouse default (simulated Moto G Power, slow 4G); Desktop = desktop preset. Scores: Performance / Accessibility / Best Practices / SEO.

| Page | Mode | Perf / A11y / BP / SEO | LCP | TBT | Page weight |
|---|---|---|---|---|---|

Common failures on every page: `color-contrast`, `heading-order`, `errors-in-console` (the `/api/admin/sync` 401). Mobile LCP is dominated by hero text hidden until JS animation + multi-MB hero videos. Note: SEO shows 100 on pages that work, but Lighthouse cannot see the soft-404/500 location and article URLs, which are the main SEO problems.

---

## 8. Device matrix (11 widths × 15 pages, EN + AR)

Headless Chrome, widths 320 / 360 / 375 / 390 / 414 / 768 / 820 / 1024 / 1280 / 1440 / 1920, mobile emulation (touch, `isMobile`) below 768. Each page was loaded, scrolled top-to-bottom, then measured. 167 page loads.

| Check | Result | Severity / ID |
|---|---|---|
| Horizontal page scroll | None at phone widths. At **1024 px** Home scrolls 1–2 px sideways (EN 1026, AR 1025). Cause: the header's language switcher/logo is translated off-screen (`translate-x-12`) when it fades out on scroll; `body { overflow-x:hidden }` hides it at most widths. | P2 · RESP-01 → fixed by UX-09 |
| Exactly one `<h1>` | ✅ every page, both languages | — |
| Tap targets < 44 px (mobile) | **20–31 per page** on every page. Examples: logo link 128×32, menu button 38×38, "Read corporate chronicle" 219×16, footer social icons 30×30, footer text links ~16 px tall. | P1 · RESP-02 |
| Text < 12 px | Home **38** elements (counter labels 11 px, card index numbers, 10 px field labels), Portfolio/Location pages 13, Careers 8. | P1 · RESP-03 |
| Form inputs < 16 px on mobile (iOS zoom-on-focus) | Contact **5/5** fields, Careers **6** fields. | P1 · A11Y-04 |
| Text still invisible after scrolling the whole page | Home **11–32** headings/paragraphs (varies by width) — methodology steps, "Precision. Research…" heading, portfolio-timeline descriptions; About **2–13** (leadership block, milestones); Franchise @1024: case-study block. Reveal animations rely on `whileInView` with a `-100px` margin and staggered parents; on fast scrolls / anchor jumps they don't fire. | P1 · MOT-05 (new) |
| JavaScript disabled (what non-rendering crawlers and slow devices see first) | Home: **48** headings/paragraphs at opacity 0 (EN), **47** (AR) — including the hero sub-headline and "We Identify What Others Miss." | P1 · MOT-01 |
| Console errors | Only two kinds, on every page: `401 /api/admin/sync` (DATA-03) and `404 /ar/projects/*` RSC prefetch from the language switcher on location pages (SEO-03). | covered |
| RTL | `dir="rtl"` + `lang="ar"` set server-side; layout mirrors correctly in screenshots. Exceptions in UI-03. Mobile drawer slides from the left in AR ✅. | P2 · UI-03 |
| Not covered by automation | Real iOS Safari / Samsung Internet / Firefox, landscape, notch safe areas, on-screen keyboard, 200 % zoom, 4× CPU throttle on mid-range Android. These need manual device testing in Phase 3 (I'll provide a checklist) or a BrowserStack account. | — |

---

**Before screenshots** (390 px and 1440 px, first three screens of Home, Asset Management, Franchise Sourcing — EN + AR — plus Contact and Portfolio): saved for the Phase 3 before/after comparison.

---

## Owner decisions applied in Phase 2 (2026-10-14)

- **Figures in use until verified — all [TO VERIFY]:** 7 commercial locations · 54 brand outlets at our locations · 40,900 m² total land area (derived from `data/projects.json`; source and date recorded in `data/company.json → countersMeta`). No occupancy figure anywhere.
  - Note: 54 is the sum of brands per location; **39 distinct brands** appear in the project data. Label currently reads "brand outlets at our locations" — see open question below.
- **Asset Management service description: [PENDING D3 CONFIRMATION]** — currently "commercial real estate asset management: managing, leasing and operating commercial locations". No client-funds / investment-portfolio / risk-tolerance wording anywhere.
- About-page timeline years (2021–2026) and per-location metrics (land area, opening year, tenant lists) — [TO VERIFY].

---

## 9. Placeholder list — data I need from you

| # | Item | Used on |
|---|---|---|
| 1 | Verified brand partners count | Home, About, Portfolio, schema, llms.txt |
| 2 | Verified total managed / sourced area (SQM) and whether it is "managed" or "sourced" | Home, About, Portfolio |
| 3 | Verified occupancy figure and as-of date (or drop the metric) | Home, About, Portfolio, each location |
| 4 | Number of operating locations (7? 8?) | Home, About |
| 5 | Per location: land area, BUA, opening year, status, current tenants (confirmed list) | Location pages |
| 6 | Per-site traffic / catchment figures and their source (or keep hidden) | Location pages |
| 7 | Correct name for El Salam / "Mall Gesr El Suez" | Location page, PDF |
| 8 | Founding year (site says 2021) and company legal name (F.B Company / FB For Assets Management) | About, schema, footer |
| 9 | Commercial registration number / tax ID (optional, trust) | Footer, schema |
| 10 | Eng. Mohamed Bahr: photo, title, short bio (EN/AR), LinkedIn | About, Person schema |
| 11 | Other leadership/team members (optional) | About |
| 12 | WhatsApp business number | Sitewide |
| 13 | Office hours | Contact, LocalBusiness schema |
| 14 | Office coordinates confirmation (Maps listing shows 30.0344348, 31.4654409) and Google Business Profile exact NAP | Schema, Contact |
| 15 | GA4 measurement ID + Search Console access | Analytics |
| 16 | Risk disclaimer text approved by your lawyer | /risk-disclaimer |
| 17 | Privacy policy legal review | /privacy-policy |
| 18 | Confirmed list of brand names you may display (and written permission where needed) | Home, Franchise page, metadata |
| 19 | D3 answer: what Asset Management covers | Asset Management page, schema |
| 20 | Real FAQ answers (I'll draft questions; you confirm answers) | FAQ sections |
| 21 | Optimised company-profile PDF with corrected name/claims | Download links |
| 22 | Branded 1200×630 share image approval (I can generate from brand assets) | OG tags |

---

## 10. Improvement proposals (ranked by impact ÷ effort)

| # | Proposal | Impact | Effort |
|---|---|---|---|
| 1 | **Two-path hero selector** ("I'm an investor" / "I'm a brand seeking a location") with equal cards and dedicated CTAs | High | Low |
| 2 | **Location case-study template** at `/portfolio/[slug]` (photos, tenants, map, status, CTA) — replaces soft-404s, unique SEO page per site | High | Medium |
| 3 | **WhatsApp + click-to-call sticky bar** on mobile with GA4 events | High | Low |
| 4 | **Bilingual FAQ blocks** + FAQPage schema on Home and both service pages | High (GEO) | Low |
| 5 | **"Submit your brand" form variant** (brand, category, target cities, unit size) for Franchise Location Sourcing leads | High | Medium |
| 6 | **Interactive portfolio map** of all locations (static SVG map, accessible list fallback) | Medium | Medium |
| 7 | **Company profile behind a short lead form** (name, company, email) once the PDF is optimised | Medium | Low |
| 8 | **Leadership & governance page** (E-E-A-T) | Medium | Low |
| 9 | **Branded OG images** per page, generated at build time with `next/og` | Medium | Low |
| 10 | **Insights relaunch** with 1 verified article/month for SEO/GEO authority | Medium | Ongoing |

---

## 11. Proposed Phase 2 order (after approval)

1. **P0 security:** SEC-01 → SEC-04 (fail-closed auth, no secret to client, rate limit, remove token-write/shell git).
2. **P0 privacy:** PRIV-01 → PRIV-03.
3. **P0 compliance:** CMP-01 → CMP-07 (assistant off, copy redline, disclaimer page).
4. **P0 data:** DATA-01 → DATA-04 (`data/site-facts.json`, no client override, no sync call, admin modal removed from public).
5. **P0 SEO/UX:** SEO-01 → SEO-03, UX-01, UX-02; www 301 backstop; delete `out/`.
6. **P1** in table order, then **P2**.
7. Each step committed separately on `audit/full-site-2026-10` with a `CHANGELOG-AUDIT.md` entry.
