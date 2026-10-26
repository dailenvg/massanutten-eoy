# Seasonal palette: Gatlinburg x season

> Provenance: carried over unchanged from the Gatlinburg EOY template this Massanutten page was cloned from. Destination names below refer to the earlier builds; the season system and values described still apply here.

Status: APPLIED (approved in full). Values live in `src/styles/seasonal.css` (`[data-season="..."]` blocks). `winter` and `late` now have separate selectors.

Scope: only the per-season `--s-*` tokens. These drive the top bar, hero badge, seasonal sale banner, phone modal header, sticky bar label and urgency lines. `season-accents.css`, `brand.css`, `--stb-pat-accent` (decorative particles only) and the HeroLockup colours (hard-coded, not token-driven) are unchanged.

Mountain vocabulary: blue-ridge dusk `#14304a`, ridge haze `#9fb8cc`, ember `#e8743b`, firelight gold `#d9a441`, evergreen `#1e3d2f`, cabin char `#17120e`, river stone `#b9c2cc`, river pool `#1a5551`, birch `#efe3c8`, slate fog `#2a3f52`, hoarfrost `#c9d8e4`.

## Changes from the approved proposal

Contrast checks found that three `--s-accent` values failed in practice. They were lightened before applying. They are used as text in the sale banner name and as chip icons, on a panel made of 88% band over a photo:

| Season | Proposed | Applied | Reason |
|---|---|---|---|
| winter | `#e8743b` | `#f7a670` (firelight ember) | chip icon was 2.21:1 |
| late | `#e08a5a` | `#f7bf9c` | chip icon was 2.11:1, banner name was 2.87:1 |
| hs | `#d9a441` | `#ecc469` (also `--s-rule`) | chip icon was 2.64:1 |

The ember buttons and chips (`--s-cta-bg`, `--s-chip-bg`) keep the proposed values.

The "previous" values in the tables below are what the file actually contained just before this change. Several had moved on from the values quoted in the proposal draft.

## Final tokens

| Token | winter | late | bf | cm | tt | hs | ny |
|---|---|---|---|---|---|---|---|
| `--s-bg` | `#14304a` | `#2a3f52` | `#17120e` | `#0b1a2e` | `#1a5551` | `#1e3d2f` | `#101a2b` |
| `--s-on` | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` | `#ffffff` | `#fff8e7` | `#ffffff` |
| `--s-accent` | `#f7a670` | `#f7bf9c` | `#f2a93b` | `#5ed3e0` | `#f08a4b` | `#ecc469` | `#e6c77a` |
| `--s-accent-alt` | (unset) | `#c9d8e4` | (unset) | `#8b7ad8` | `#efe3c8` | `#a3263a` | `#b9c2cc` |
| `--s-pill-icon` | `#b4501f` | `#3f6680` | `#8a5a12` | `#5b45b8` | `#1a5551` | `#a3263a` | `#7a5c14` |
| `--s-cta-bg` | `#e8743b` | `#e08a5a` | `#f2a93b` | `#5ed3e0` | `#f08a4b` | `#a3263a` | `#e6c77a` |
| `--s-cta-text` | `#0f2236` | `#14202c` | `#17120e` | `#0b1a2e` | `#10201f` | `#ffffff` | `#101a2b` |
| `--s-chip-bg` | `#e8743b` | `#c9d8e4` | `#f2a93b` | `#5ed3e0` | `#efe3c8` | `#d9a441` | `#e6c77a` |
| `--s-chip-on` | `#0f2236` | `#2a3f52` | `#17120e` | `#0b1a2e` | `#1f3b3a` | `#1e2a1f` | `#101a2b` |
| `--s-badge-bg` | `#14304a` | `#2a3f52` | `#17120e` | `#0b1a2e` | `#1a5551` | `#a3263a` | `#101a2b` |
| `--s-badge-on` | `#ffffff` | `#ffffff` | `#f2a93b` | `#5ed3e0` | `#ffffff` | `#fff8e7` | `#e6c77a` |
| `--s-rule` | `#9fb8cc` | `#c9d8e4` | `#f2a93b` | `#8b7ad8` | `#efe3c8` | `#ecc469` | `#b9c2cc` |

Previous values (`winter` and `late` shared these): winter/late `#0b2a4a / #fff / #7dd3fc / #0369a1 / cta #38bdf8 on #0b2a4a / rule #38bdf8`; cm bg `#1a0b3d`; tt bg `#0c3b6e`, pill `#1d5a9a`; hs bg `#b3122e`, cta `#0f5132`; ny bg `#1b1446`. The other bf/cm/tt/hs/ny accents are listed in the proposal history (git).

## Final contrast (WCAG 2.x)

Thresholds: text 4.5:1. Large text (24px or more, or 18.66px bold) and non-text 3:1.

| Pair | winter | late | bf | cm | tt | hs | ny | Need |
|---|---|---|---|---|---|---|---|---|
| `--s-on` / `--s-bg` | 13.54 | 10.87 | 18.60 | 17.48 | 8.53 | 11.24 | 17.43 | 4.5 |
| `--s-cta-text` / `--s-cta-bg` | 5.37 | 6.25 | 9.31 | 9.88 | 6.76 | 7.25 | 10.64 | 4.5 |
| `--s-chip-on` / `--s-chip-bg` | 5.37 | 7.47 | 9.31 | 9.88 | 9.45 | 6.64 | 10.64 | 4.5 |
| `--s-badge-on` / `--s-badge-bg` | 13.54 | 10.87 | 9.31 | 9.88 | 8.53 | 6.85 | 10.64 | 4.5 |
| `--s-pill-icon` / white | 5.11 | 6.13 | 5.91 | 7.03 | 8.53 | 7.25 | 6.23 | 3 |
| `--s-bg` text on white stamp | 13.54 | 10.87 | 18.60 | 17.48 | 8.53 | 11.91 | 17.43 | 4.5 |
| `--s-accent` / `--s-bg` | 6.86 | 6.67 | 9.31 | 9.88 | 3.43 | 7.18 | 10.64 | 3 (non-text / large) |
| `--s-rule` / `--s-bg` | 6.58 | 7.47 | 9.31 | 4.89 | 6.70 | 7.18 | 9.67 | 3 |
| Banner: `--s-on` / panel (worst case) | 9.34 | 7.57 | 13.41 | 12.42 | 6.24 | 7.82 | 12.32 | 4.5 |
| Banner: name / panel (worst case) | 4.74 | 4.65 | 6.71 | 7.02 | 4.90 (alt) | 7.82 (on) | 7.52 | 3 (20–24px/800) |
| Banner: chip text / chip (worst case) | 6.63 | 5.57 | 9.19 | 8.57 | 5.69 | 5.61 | 8.50 | 4.5 |
| Banner: chip icon / chip (worst case) | 3.36 | 3.42 | 4.60 | 4.84 | 4.47 (alt) | 3.59 | 5.19 | 3 |

"Worst case" means the 88% band panel composited over pure white, with a 12% white chip tint on top (4% for tt). It models neither the backdrop blur nor saturation, both of which only darken the backdrop further on these photos.

## Usage audit for the tight pairs

- **tt `--s-accent` (3.43:1 on band).** Used only as non-text: the `.stb-dot` separator glyph, the phone-modal ring and border, and the particle fills. Every text and icon use in the banner (`.ss-heading-name`, `.ss-chip-icon`, `.ssb-big-text`) is overridden for tt to `--s-accent-alt` birch (4.90 or better).
- **hs `--s-accent-alt` (1.64:1 on band).** Never rendered in hs. Its only consumers are `.sfx-pixel--alt` (cm effect), `.sfx-plane` (tt effect), the `[data-season="tt"]` banner overrides, and `.ssb-block[data-treatment="bright"]`, which no season currently uses. It is decorative-only by construction. Do not use it as text on `--s-bg`.
- **hs banner name.** It already renders `--s-on` cream with a gold `--s-accent` underline (7.82:1).

## Not changed

- `--stb-pat-accent`: top-bar star particle colour, decorative. It still reads against every new band.
- HeroLockup colours: hard-coded in `HeroLockup.tsx`, independent of `--s-*`, so they are unaffected.
