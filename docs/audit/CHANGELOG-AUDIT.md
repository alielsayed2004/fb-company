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
