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
