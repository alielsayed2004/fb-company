# Phase 3 — Manual device-testing checklist

**For:** whoever tests on real devices before go-live (no coding needed).
**Test against:** the Vercel **Preview** URL of branch `audit/full-site-2026-10` (not production).
**How to record:** tick ✅ / write ❌ + a screenshot + device/browser for anything wrong.

Automated checks already done locally (Chrome only): 11 widths × 15 pages, Lighthouse, link/asset crawl, JS-off rendering. This list covers what automation cannot.

---

## 1. Devices & browsers (minimum set)

| # | Device | Browser | Orientation |
|---|---|---|---|
| D1 | iPhone (notch / Dynamic Island, e.g. 13–16) | Safari | portrait + landscape |
| D2 | Small iPhone (SE / mini, 320–375 px) | Safari | portrait |
| D3 | Mid-range Android (e.g. Samsung A-series) | Chrome | portrait + landscape |
| D4 | Same Samsung | Samsung Internet | portrait |
| D5 | iPad / Android tablet | Safari / Chrome | portrait + landscape |
| D6 | Laptop 1280–1440 px | Chrome, Safari, Firefox, Edge | — |
| D7 | Large monitor 1920 px | Chrome | — |

Run every section below in **English and Arabic** (switch with the language button).

---

## 2. Pages to open on every device

Home · Asset Management · Franchise Location Sourcing · Portfolio · one location page (e.g. Marina 5) · About · Contact · Careers · Risk Disclaimer · Privacy Policy · a wrong URL (e.g. `/xyz`) for the 404 page.

---

## 3. Layout & reading

- [ ] No sideways scrolling on any page (try swiping left/right).
- [ ] Body text readable without zooming; no text cut off or overlapping.
- [ ] Arabic pages fully right-to-left: text aligned right, menu opens from the left side, arrows point the correct way, numbers display correctly (e.g. 40,900).
- [ ] Images and hero videos fill their areas, not stretched or blurry.
- [ ] Hero shows a still image first, then the video starts (no blank black box). With "Reduce Motion" on (iOS: Settings → Accessibility → Motion), the video does not play and nothing slides in.
- [ ] Logo strip scrolls smoothly; **Pause** button stops it; it also stops when hovered (desktop).
- [ ] **Desktop: scroll down — the top bar turns solid teal and the menu links stay readable over light sections.**
- [ ] iPhone: nothing hidden behind the notch or the bottom home bar (top menu, footer, any floating button).
- [ ] Landscape phone: hero text and buttons still visible without awkward cropping.
- [ ] Browser zoom 200% (desktop: Ctrl/Cmd +): content reflows, nothing overlaps, menu still usable.

## 4. Navigation

- [ ] Mobile menu opens and closes (button and ✕); page behind does not scroll while it is open; tapping a link closes it and navigates.
- [ ] Current page is highlighted in the menu.
- [ ] Language button keeps you on the **same page** in the other language (incl. location pages).
- [ ] Footer links work, including **Risk Disclaimer**; there is **no "Admin" link**.
- [ ] Keyboard only (desktop): Tab through the header, open the mobile menu at a narrow window, Esc closes it; focus outline is visible everywhere.

## 5. Both business lines get equal weight

- [ ] Home hero shows two equal buttons: property owners → Asset Management, brands → Franchise Location Sourcing.
- [ ] Section "Two Lines of Business" shows two equal cards side by side (stacked on phones).
- [ ] Asset Management page has a button in the hero **and** at the bottom; Franchise page the same.

## 6. Forms (use real data you can recognise, e.g. name "TEST – Phase 3")

**Contact form**
- [ ] Tapping a field does **not** zoom the page on iPhone.
- [ ] Keyboard does not hide the field you are typing in; you can scroll to the Send button.
- [ ] Leaving a required field empty shows a clear message (EN and AR).
- [ ] A valid submission shows "Submission successful".
- [ ] **The message arrives in the Google Sheet AND by Formspree email** (check both).
- [ ] Arabic page: error and success messages appear in Arabic.

**Careers form**
- [ ] CV button opens the file picker (also reachable by keyboard).
- [ ] A file larger than **4 MB** shows the 4 MB message (EN/AR) and is not sent.
- [ ] A valid application with a small PDF shows success.
- [ ] **Row appears in the careers Sheet; the CV is in Drive folder `FB_Company_Careers_CVs` and its sharing says "Restricted"** (open the file → Share).
- [ ] After Apps Script redeploy: an older CV link opened in a private/incognito window is **not** viewable.

## 7. Content & trust (spot check)

- [ ] Figures shown everywhere are 7 / 54 / 40,900 m² (until you send verified numbers) — no "100%", "500,000", "200+".
- [ ] No "guarantee", "yield", "returns" wording anywhere; Risk Disclaimer page shows its draft notice.
- [ ] Phone link opens the dialer; email link opens mail.
- [ ] 404 page is branded, shows English and Arabic, and its links work.

## 8. Performance feel (mid-range Android, 4G)

- [ ] Home shows text within about 1–2 seconds; no long white screen.
- [ ] Scrolling is smooth (no stutter on the logo strip or reveals).
- [ ] Location page photos load as you scroll.

## 9. Admin (one desktop test, after Vercel env vars are updated)

- [ ] `/admin` redirects to the login page.
- [ ] Wrong password 6 times → "Too many attempts".
- [ ] Correct new password logs in; old password `186204` does **not** work.
- [ ] "Cloud Sync" status shows connected after `GITHUB_TOKEN` is set in Vercel.

---

## 10. Sign-off

| Area | EN | AR | Tester | Date |
|---|---|---|---|---|
| Layout & reading | | | | |
| Navigation | | | | |
| Equal weight | | | | |
| Forms (real delivery) | | | | |
| Content & trust | | | | |
| Performance feel | | | | |
| Admin | | | | |
