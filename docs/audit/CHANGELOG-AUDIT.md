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
