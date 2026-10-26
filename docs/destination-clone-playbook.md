# Destination Clone Playbook

How to turn this EOY template into a new destination page with the same layout, seasonal logic, design and checkout flow. It is written from the Massanutten build (cloned from Gatlinburg in October 2026). Every rule here comes from something that worked, or broke, on that build.

Use it as a checklist for a person, or paste sections into a brief for Claude or the Dailen Team (`/team`).

---

## 1. What you're cloning

A Next.js 16 / React 19 / Framer Motion landing page and checkout flow for a VacationVIP timeshare-preview getaway:

- **Landing page** (`/`): hero with lockup, price and offer card, then the sections below, in this order (`src/app/(site)/page.tsx`).
- **Checkout flow**: `/checkout` (general info + dates), then `/checkout/payment`, `/checkout/extend` (extra night upsell), `/checkout/tickets`, `/checkout/extra-vacation`, and `/confirmation`. State lives in sessionStorage (`lib/booking-store`), so the Package Summary stays in sync across steps.
- **Confirmation email** (`/email/confirmation/[season]`) and a QA hub (`/emails-hub`).
- **Legal pages**: `/terms-and-conditions`, `/privacy-policy`.
- **7 seasonal versions** on one URL, switched by date.

### Page section order

| # | Component | Content source |
|---|---|---|
| 1 | `SeasonalTopBar` | `season.ts` top bar copy and countdown |
| 2 | `Hero` (lockup, price circle, play button, `HeroBonusBanner`, `OfferCard`) | `offer.ts` + `HERO_IMAGES` |
| 3 | `HeroSubmenu` | anchors to the sections below |
| 4 | `PhotoStrip` | `gallery.ts` |
| 5 | `WhatYouGet` | accommodations + "Why you get it" preview paragraph |
| 6 | `ResortDetails` | destination heading and paragraph, resort video trigger |
| 7 | `EverythingIncluded` (tabs: Accommodations, Amenities, Bonus, Things To Do) | `offer.ts` tab data |
| 8 | `VectorCta` | |
| 9 | `AmenitiesAndAttractions` ("More to Explore") | `EXPLORE_*` lists |
| 10 | `GuestReviews` | `REVIEWS`, Tripadvisor counts |
| 11 | `GuestStories` | `guest-stories.ts` (hidden while empty) |
| 12 | `BonusCta` (two panels joined by "+") | `BONUS_CARDS` |
| 13 | `Footer` | sponsor and timeshare disclosures |

Overlays: `ResortVideoModal` (only if `RESORT_VIDEO_SRC` is set), `MobileStickyCta`, `GalleryModal`, `VideoModal`, `PhoneModal`, `LegalModal`.

> Massanutten removed the `SeasonalSaleBanner` (the dark card with a circular price stamp, chips and a "BOOK ... FOR $XX" button) from every season. The template still has it. Decide per destination whether to keep it. Removing it cleanly means deleting the component, its CSS file and import, the `banner` field and types in `season.ts`, and the `.ss-cta` selector in `CheckoutRouter`.

---

## 2. Where everything lives

Nearly all destination content is in a few data files. Components read from them, so a destination swap is mostly data editing.

| File | What it holds |
|---|---|
| `src/lib/offer.ts` | **Everything about the offer and destination.** Placeholders block at the top; then price, retail, % off, nights, resort names, lockup lines, logo, room type, phone and hours, add-ons, bonus, hero perks, meta description, disclosures, and copy for every section (labelled Component B to K), Extra Vacation upsell and email copy. |
| `src/lib/season.ts` | The 7 seasons: dates, top bar copy, countdown, badge, H1, urgency line, sticky bar label, meta title, FX animation, and `HERO_IMAGES` per season. |
| `src/lib/site.ts` | Checkout `SLUG`, canonical URL, OG image URL, flow routes. |
| `src/lib/terms.ts` | Terms blocks: destination sponsor terms + the VacationVIP / Sogno booking terms. |
| `src/lib/gallery.ts` | Photo strip and lightbox images. |
| `src/lib/guest-stories.ts` | Testimonial videos (empty array hides the section). |
| `src/lib/image-variants.ts` | Smaller `-<width>w.webp` renditions per photo for `srcset`. |
| `src/lib/confirmation-email-content.ts` | Email copy (reads from `offer.ts`). |
| `src/lib/structured-data.ts` | JSON-LD (reads `PRICE_NUMBER` etc.). |
| `src/lib/motion.ts` | Shared motion tokens. Don't edit per destination. |
| `src/styles/seasonal.css` | Seasonal palette tokens per `[data-season]`. |
| `public/images/<destination>/` | Destination photos. |
| `public/images/shared/` | Brand assets reused across destinations (badges, BBB, Tripadvisor). |
| `public/videos/resort-tour.mp4` | Resort video. |
| `public/images/og-share.jpg`, `public/images/email/confirmation/hero-resort@2x.jpg` | Share card (1200x630) and email hero (1200x480). Regenerate per destination. |

Components with destination text baked in (check them on every clone): `Hero`, `HeroBonusBanner`, `HeroLockup`, `OfferCard`, `BonusCta`, `IncludedPanels`, `ResortDetails`, `GuestReviews`, `HeroSubmenu`, `AmenitiesAndAttractions`, `Footer`, `season-fx/BadgeFx` (destination stamp), checkout `PackageSummary`, `OfferBand`, `Step1General`, `Step2Payment`, `StepExtend`, `StepExtraVacation`, `ProtectionModal`, `Confirmation`, and the checkout page titles.

---

## 3. Seasonal logic (spec)

One URL, seven versions. The season is resolved **once per request on the server** (`resolveSeason` in `page.tsx`) and passed down as a prop, so server and client render the same version and hydration can't disagree.

### Calendar used on Massanutten (2026)

| Key | Name | Window (12:00 AM Eastern, EST UTC-5) | Countdown | FX |
|---|---|---|---|---|
| `winter` | Winter Getaway | until Nov 27 | none | none |
| `bf` | Black Friday Deal | Nov 27 to Nov 29 | `dhm` (days/hours/min) to Sun 11:59 PM | sparkle |
| `cm` | Cyber Monday Deal | Nov 30 | `hms` live ticking to midnight | pixels |
| `tt` | Travel Tuesday Deal | Dec 1 | `hms` to midnight | plane |
| `hs` | Holiday Sale | Dec 2 to Dec 25 | `days` left | lights |
| `ny` | New Year Blowout | Dec 26 to Jan 3 | `days` left | confetti |
| `late` | Winter Getaway (post-holiday) | Jan 4 onward | none | none |

- `start` is inclusive and `end` exclusive, in ISO with an explicit `-05:00` offset, compared in absolute time, so the viewer's time zone doesn't matter.
- `winter` and `late` share every field through `WINTER_SHARED`. `showsHolidayEvents(season)` drops holiday-only rows (tabs, More to Explore, destination paragraph) from `late` on.
- **Dates differ between builds.** The Orlando build aligned its seasons to the global banner calendar (`docs/seasonal-calendar-report.md`). Confirm the calendar for every new destination before you build, and keep it in sync with `public/js/globalBanners.js` if that bar is live.

### Per-season fields (`Season` type)

`topBarDesktop`, `topBarMobile`, `countdown`, `badge`, `h1` (visually hidden), `urgency`, `stickyLabel`, `stickyPkgLine1` / `stickyPkgLine2` (the two-line sticky bar), `metaTitle`, `animation`.

Patterns from Massanutten:
- `metaTitle` = season name + the source page title: `` `${versionName}: <source title>` ``.
- `h1` = `` `<Destination> ${versionName}: 4-Day/3-Night Stay at <Resort>` ``.
- Top bars: `SEASON NAME • <Destination> 4-Days / 3-Nights for $PRICE • <bonus> • <deadline>`. Mobile versions stay short enough for two lines at 375px.
- **Sticky label width:** each `stickyPkgLine` must fit about 147px at 375px (15px, weight 800). "MASSANUTTEN WINTER" (about 176px) wrapped to three lines, so the break moved to "MASSANUTTEN" / "WINTER GETAWAY". Check every season's lines when the destination name is long.

### Hero images

`HERO_IMAGES: Record<SeasonKey, { desktop, mobile, focus }>`:
- **Desktop**: full frame at natural aspect as a CSS background with `cover`. `focus` is the `background-position` that keeps the subject in the open band between the lockup (left) and the offer card (right).
- **Mobile**: a separate portrait crop at **0.7 ratio (588x840)** around the subject, named `<name>-mobile.webp`, served through `<picture>`.
- Seven seasons rarely have seven hero-quality photos. Massanutten reused two (`hs` = `winter`, `ny` = `late`). Note reuses in a comment.

### Seasonal design tokens

`src/styles/seasonal.css` sets the palette per `[data-season]`; a cutover repaints everything seasonal from one place:

| Token | Role |
|---|---|
| `--s-bg` / `--s-on` | seasonal block and its text (top bar, phone modal header) |
| `--s-accent` / `--s-accent-alt` | seasonal icons, particles (text only at large sizes) |
| `--s-cta-bg` / `--s-cta-text` | seasonal pill/tag fill |
| `--s-chip-bg` / `--s-chip-on` | countdown chips, at least 4.5:1 |
| `--s-badge-bg` / `--s-badge-on` | seasonal badge, at least 4.5:1 |
| `--s-pill-icon` | pill-row icons on white, at least 3:1 |

Massanutten kept the template's "Mountain palette" (winter `#0b2a4a` / `#7dd3fc`, bf `#17120e` / `#f2a93b`, cm `#0b1a2e` / `#5ed3e0`, tt `#1a5551` / `#f08a4b`, hs `#1e3d2f` / `#ecc469`, ny `#101a2b` / `#e6c77a`). For a beach or city destination, propose a new palette (see `docs/season-palette-proposal.md`) and get it approved. It's a brand decision.

### QA override

`?season=winter|bf|cm|tt|hs|ny|late` previews any version. `withSeasonParam` carries it through the checkout flow. An unknown key returns 404.

---

## 4. Design system (keep as-is)

These are shared across destinations. Don't change them during a destination swap without approval.

- **Type**: Roboto (self-hosted in `public/fonts`), one family, with the existing type scale.
- **Brand tokens** (`src/styles/brand.css`): `--navy #215272`, `--navy-deep #071330`, `--coral #fe5925`, `--text #1c2733`, `--muted #667085`, `--bg #f6f7f9`, `--radius 12px`, `--radius-pill 40px`, `--maxw 1090px`, soft card shadows.
- **Spacing**: 8pt grid (4 only where 8 is too large).
- **Breakpoints to test**: 375 (floor), 768, 1024, 1440, 2560, plus fluid resizing in between. No horizontal scroll at any width.
- **Motion**: Framer Motion with tokens in `lib/motion.ts` (`EASE_OUT`, `DUR_MICRO 0.2`, `DUR_COMPONENT 0.32`, `DUR_PAGE 0.45`, `SPRING`, `STAMP_IN`, loop and FX timings). Scroll reveal with stagger, `whileHover` / `whileTap` on cards and buttons, `useReducedMotion` fallbacks. Season FX scenes live in `components/home/season-fx/`.
- **Icons**: Phosphor (`@phosphor-icons/react`) through `lib/icons.tsx`. Add new icons there (Massanutten added Ski, Bike, Horse, Wine, Binoculars, Tv, Sofa).
- **Images**: plain `<img>` with exact `srcset` / `sizes` (the Next image optimizer is off).
- **Guardrails**: `CLAUDE.md` in the repo root. Nothing that looks clickable may be dead; every interactive element has hover, focus-visible, active and disabled states.

---

## 5. Step-by-step: cloning for a new destination

### Step 0: Decide before you build
Get answers on these. Each one changed the Massanutten plan:

1. **Offer**: price, unit ("Per Family" vs "Per Package"), retail value, % off, nights, and the bonus. The EOY template and the destination source site can disagree. Massanutten first planned $99, then switched to the source's $104 / $748 / 86%.
2. **Seasonal calendar**: dates per season (section 3).
3. **Phone number, checkout slug, call-center hours**: often missing from the source.
4. **Sections to keep or drop**: e.g. the seasonal sale banner, guest stories (are there testimonial videos for this resort?), resort video.
5. **Where the repo lives**: GitHub org and visibility (the earlier EOY repos are under `oneagencycom`).

### Step 1: Copy the template
Copy a finished destination repo into the new empty repo, excluding `.git`, `node_modules`, `.next`, `tsconfig.tsbuildinfo`, `.DS_Store` and scratch files (`out.txt`, `h.html`, `prof`). Rename `package.json` `name` (e.g. `sogno-<destination>-eoy-<price>`), then run `npm install --package-lock-only` to sync the lockfile.

### Step 2: Fill `offer.ts`
- Unconfirmed facts go in the **PLACEHOLDERS** block at the top as visible bracketed text (`"[PHONE TBD]"`, `"[ATTRACTION TICKETS: TBD]"`, `"[$XX]"`), and numeric ones as `null`. Never invent a value.
- `PHONE_CONFIRMED = PHONE_HREF !== "#"` drives every call link. While it's false, call links render as plain text (site, confirmation page and email), so nothing is a dead link.
- `RESORT_VIDEO_SRC: string | null` and `RESORT_VIDEO_CAPTIONS: string | null` show or hide the video triggers and the captions track.
- Copy that exists on the destination source site is pasted **word for word**. Only rewrite where the template has a sentence with no source equivalent, and then use only facts from the source.
- Legal text (sponsor terms, sponsor disclosure, `TIMESHARE_DISCLOSURE`) is copied byte-exact.

### Step 3: Fill `season.ts`
Keep campaign names and structure. Swap destination words and prices; check sticky label widths; map `HERO_IMAGES`.

### Step 4: `site.ts`, `terms.ts`, `gallery.ts`, `guest-stories.ts`, email content
- `SLUG` drives the checkout URL, canonical URL and OG image URL. Mark it `CONFIRM` until VacationVIP has the path.
- `terms.ts`: replace only the destination sponsor blocks; keep the VacationVIP / Sogno booking terms and privacy policy.
- No testimonial videos for this resort? Set `GUEST_STORIES = []`. `page.tsx` hides the section and its modal; don't delete the components.

### Step 5: Assets
- Create `public/images/<destination>/` with descriptive kebab-case names (`hero-snow-tubing-family.webp`, `guestroom-king.webp`).
- Convert to **webp**. On macOS, `cwebp` and `sips` may not write webp; Python Pillow works.
- Make the mobile hero crops (0.7) and the `-<width>w` variants, and register the variants in `image-variants.ts`.
- Regenerate `og-share.jpg` (1200x630) and the email hero (1200x480).
- Move reused brand assets into `public/images/shared/`. Delete the previous destination's folders and logos (e.g. `WG-logo.svg` was the Westgate mark). Use the destination's own logo from its source; never invent one.
- **Resort video from a stream** (Cloudflare Stream HLS `.m3u8`): download with ffmpeg and re-encode for the web:
  ```bash
  ffmpeg -i "<manifest>.m3u8" -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p \
    -c:a aac -b:a 128k -movflags +faststart resort-tour.mp4
  ```
  Write to a scratch folder, check with `ffprobe`, then move into `public/videos/`. The template's `<video>` can't play HLS in Chrome, so an MP4 is required.

### Step 6: Sweep components and fit-check
- Grep components for hard-coded old destination text, prices and units (e.g. a hard-coded "Per Package" in `IncludedPanels` and `ProtectionModal` that should read `PRICE_UNIT`).
- Fit-check long names and prices (section 7).

### Step 7: Verify (section 8), commit, push to a feature branch, open a PR.

---

## 6. Content rules

- **The destination source site wins** for every fact and sentence it contains. Paste, don't paraphrase.
- **Legal is byte-exact**, even when it looks odd. Flag issues for legal instead of fixing them. On Massanutten, the source's footer and terms list different sponsor addresses, and the terms mention a "$99.00" refundable deposit.
- **Em-dashes**: removed from copy we write. Em-dashes inside word-for-word source copy stay unless the client approves edits.
- **Names**: use the source's spelling and marks (e.g. "Massanutten Resort®", "WaterPark").
- **Keep format consistent**: "4-Days / 3-Nights" (`NIGHTS_LABEL`), "4-Days/3-Nights" (`NIGHTS_LABEL_TIGHT`).
- **Bonus passes or perks shown as a pair** must read as distinct items. The two identical "SKI DAY PASS / +1 PASS" cards confused users. They became "DAY 1" / "DAY 2", with headings that always break as "DAY N" over "SKI PASS" (`BONUS_CARDS` fields `day`, `headingLead`, `headingRest`).

---

## 7. Known fit hot spots

Things that broke on Massanutten when the copy changed length. Check them on every destination:

| Spot | Problem | Fix used |
|---|---|---|
| `HeroLockup` middle word (city/region) | Long words ("SHENANDOAH", about 700px at 94px) were squeezed into 620px with `textLength`, so the letters ran into each other | Fit with `MIDDLE_LENGTH` / `TOP_LENGTH` constants and slight horizontal scale, not letter-spacing alone |
| Sticky bar labels | Three-line wrap at 375px | Move the `stickyPkgLine1/2` break (section 3) |
| Price row in the offer card | A three-digit price plus "86% OFF!" plus "PER FAMILY" overflowed the 416px card (silently clipped by `overflow-x: clip`) | 8px gaps; `.op-unit { width: min-content }` |
| Hero bonus banner chip | Decorative chip covered the card label | Moved to top-right |
| Tab and side photos | Centred `cover` crop cut off off-centre subjects | `focus` prop as `object-position` per photo |
| Bonus panel headings | Uneven wraps ("DAY 1 SKI / PASS") | Two block spans with a controlled break |
| "More to Explore" cards | 10 attraction rows vs 5 amenity rows gives uneven card heights | Open design call: two columns for attractions |

---

## 8. QA checklist (definition of done)

- [ ] `npm run typecheck`, `npm run lint` (only the 5 known warnings in minified `public/js/globalBanners.js`), `npm run build` pass. On a fresh clone `typecheck` needs `.next/types` from a dev or build run first.
- [ ] Leftover grep (excluding `node_modules`, `.next`, `.git`) for the previous destination's names, resort, attractions, old price and old unit. Every hit is either fixed or justified (Sogno HQ address in Orlando, US states list, Webflow CSS identifiers, comments).
- [ ] Offer values correct on `/` for all 7 `?season=` variants, every checkout step, confirmation, email and meta tags. Checkout totals come from `PRICE_NUMBER`.
- [ ] Every `/images` and `/videos` path referenced in `src` exists in `public`.
- [ ] No `href="#"` or dead clickable element on `/` or `/confirmation` (video triggers are the only acceptable `#` links, and only when the video exists).
- [ ] Every `HeroSubmenu` anchor has a matching section.
- [ ] Every route returns 200: `/`, all `/checkout/*`, `/confirmation`, `/emails-hub`, `/email/confirmation/<each season>`, legal pages.
- [ ] Chrome at 375, 768, 1024, 1440: no horizontal scroll, no clipping, no console errors.
- [ ] Video modal: opens from all triggers, focus goes to Close, Tab stays inside, Escape closes and returns focus, page doesn't scroll behind it, sits above the sticky bars.
- [ ] `og:image` and `twitter:card=summary_large_image` render on `/` (Next replaces the layout's `openGraph` object wholesale, so `page.tsx` repeats `images`, `url`, `type`, `siteName`).
- [ ] Placeholders are visible and listed in the PR.
- [ ] Captions: if the resort video has speech, add a `.vtt` and set `RESORT_VIDEO_CAPTIONS`.

---

## 9. Gotchas

- **Git LFS**: `.gitattributes` sends all images and video through LFS. The host (e.g. Vercel) must have LFS turned on, or assets deploy as pointer files.
- **Running a build next to a dev server**: Next 16 dev writes to `.next/dev`, so `next build` alongside a running `next dev` is safe. Check before relying on that.
- **BSD `sed` on macOS** fails silently on GNU-style edits. One "deleted" CSS rule survived because of it. Re-grep after scripted edits.
- **Template lineage names** (`sogno-wg-orlando-99-8-26.webflow.css`, body class `property-sogno-wg-orlando-99-eoy`) are CSS hooks used by about 360 selectors. Leave them; renaming is a structural change.
- **`CLAUDE.md` imports `@AGENTS.md`**, which doesn't exist in this lineage. The guardrails in `CLAUDE.md` itself apply.

---

## 10. Massanutten build log (worked example)

| Round | What changed |
|---|---|
| 1. Clone + rebrand | Copied the Gatlinburg template. Rewrote `offer.ts`, `season.ts`, `site.ts`, `gallery.ts`, `terms.ts` and email content with Massanutten source copy. New `public/images/massanutten/` (30 files) from the source's winter photos; Gatlinburg and Orlando images and the Westgate logo deleted. Guest stories hidden (Gatlinburg testimonials only). |
| UX pass | Lockup fitting, sticky label breaks, bonus chip position, price row for three digits, per-photo focus, placeholder phone rendered as text instead of dead links. |
| 2. Source offer | Price switched to the source's $104 / Per Family / $748 / 86% OFF!. Meta title and description verbatim from source. |
| 2. Banner removal | `SeasonalSaleBanner` removed from all seasons (component, CSS, data, types, dead `.ssb*` rules). |
| 2. Resort video | Downloaded from Cloudflare HLS (1080p, 30s, 16.7 MB, faststart). Video modal hardened (z-index above sticky bars, focus return, focus trap, scroll lock, focus rings, `aria-haspopup`, captions hook). |
| Writer pass | Six edits to drafted copy; source and legal copy untouched. |
| QA fixes | Home `og:image` / large Twitter card restored; package renamed `sogno-massanutten-eoy-104`. |
| 3. Day passes | Bonus cards relabelled "DAY 1" / "DAY 2" with controlled heading breaks. |

**Still open at hand-off:** phone number, checkout slug (`sogno-massanutten-104-eoy`), call-center hours, attraction tickets and Extra Vacation details are placeholders; sponsor address mismatch for legal; video captions; Massanutten testimonial videos for Guest Stories.

### Reusable brief (paste and fill in)

```
/team Clone <template repo path or URL> into <new repo path> and apply content and
assets from <destination source site URL> and <source repo URL>.
Follow docs/destination-clone-playbook.md.
Offer: <price> <unit>, retail <value>, <% off>, <nights>, bonus: <bonus>.
Seasonal calendar: <use template dates | custom dates>.
Keep / remove: seasonal sale banner <keep|remove>, guest stories <videos available?>,
resort video <source URL or none>.
Unknown facts ship as visible placeholders: <phone, slug, hours, ...>.
Repo: <org/name>, push to a feature branch and open a PR.
```
