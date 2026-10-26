# Orlando EOY: Seasonal Site and Global Banner Report

> Provenance: carried over unchanged from the Gatlinburg EOY template this Massanutten page was cloned from. Destination names below refer to the earlier builds; the season system and values described still apply here.

**Branch:** `feat/orlando-eoy` · **Updated:** Oct 15, 2026

## Summary

The Orlando EOY page changes its design and copy by season. A separate shared script (the global holiday banner) adds a sale bar to the top of the page. These two used to run on different calendars, so the bar and the page could promote different sales on the same day.

They are now aligned. **The global banner files (`globalBanners.css`, `globalBannersJS.js`) are the source of truth**, and the site's seasons follow their dates.

## Calendar (all cutovers at 12:00 AM Eastern)

| Dates | Global banner bar | Site season |
|---|---|---|
| Until Oct 31 | None | Winter ("Escape the Cold") |
| Nov 1 – Nov 28 | Black Friday | Black Friday, ends Saturday Nov 28 |
| Nov 29 | Cyber Sale "Starts Now" | Cyber Sale, ends Dec 4 |
| Nov 30 | Cyber Sale "Starts Now" | Cyber Monday (24 hours, live countdown) |
| Dec 1 | Cyber Sale "Ends Soon" | Travel Tuesday (24 hours, live countdown) |
| Dec 2 – Dec 4 | Cyber Sale "Ends Soon" | Cyber Sale, ends Dec 4 |
| Dec 5 – Dec 12 | Christmas Miracle | Holiday Sale, through Dec 12 |
| Dec 13 – Jan 12 | New Year Sale ("Happening Now", then "Ends Soon" from Jan 5) | New Year Blowout, ends Jan 12 |
| Jan 13 onward | None | Late Winter ("Fewer Crowds, Warmer Days") |

Verified by simulating every day from Oct 25 to Jan 22 for visitors in Eastern and Pacific time.

## How the seasonal site works

- One URL. The season is chosen on the server for each request, so every visitor sees one consistent version with no flicker.
- When the season changes, these all switch together: the top bar text and countdown, hero badge, headline, urgency line, seasonal sale banner (photo, copy, three highlights, button), sticky bar label, page title and color palette.
- Each season has its own colors and animation (Black Friday sparkle, Cyber pixels, Travel Tuesday plane, Holiday lights, New Year confetti, frosted hero in Winter). Animations turn off for visitors who have reduced motion enabled.
- **QA preview:** add `?season=<key>` to the URL to see any season early. Keys: `winter`, `bf`, `cs` (Cyber Sale), `cm` (Cyber Monday), `tt` (Travel Tuesday), `holiday`, `ny`, `winter-late`. The preview carries through the checkout flow.

## How the global banner files work

**globalBannersJS.js**
1. Adds its own styles to the page. Optional settings on the script tag: `data-customcss` (extra CSS) and `data-parent` (where to insert the bar; defaults to the top of the page).
2. Checks a list of dated banners (Black Friday, Cyber Sale, Christmas Miracle, New Year Sale) and shows the **first** one whose dates include today, based on the visitor's own clock.

**globalBanners.css**
- Brings the bar onto the project's 8pt spacing grid.
- Darkens the Cyber Sale blue so the yellow text meets accessibility contrast (4.0:1 raised to 5.3:1).
- **One bar at a time:** while a holiday bar is showing, the site's own seasonal top bar hides.

On this site, the script runs before the page first appears, so the bar never pushes content down after load.

## What changed in this update

- **Banner date fix.** The script read each date as midnight UTC, which is the previous evening in the US. That made every banner end one day early and left days with no banner (Nov 30, Dec 4, Jan 4). Dates now count as full days, as written.
- **Site seasons moved to match the banner dates**, including countdown end times and every "ends …" message.
- **New Cyber Sale season around Cyber Monday and Travel Tuesday.** The banner runs one Cyber Sale from Nov 29 to Dec 4. The site keeps its one-day Cyber Monday (Nov 30) and Travel Tuesday (Dec 1) designs inside that week and shows Cyber Sale on Nov 29 and Dec 2–4. Cyber Sale reuses the Cyber Monday look with its own copy.
- Season names are unchanged (Black Friday, Holiday Sale, New Year Blowout).

## Action items

| # | Item | Owner |
|---|---|---|
| 1 | Apply the same date fix to the hosted `globalBannersJS.js`. Other sites using it will otherwise end each banner a day early and won't match this page. | Dev |
| 2 | Approve new copy: Cyber Sale text ("This week only…", "Ends Friday, Dec 4"), "Ends Saturday" for Black Friday, "Thru Dec 12" for Holiday Sale. Note that on Nov 30 and Dec 1 the top banner says "Cyber Sale" while the page says Cyber Monday / Travel Tuesday. | Marketing |
| 3 | Decide whether holiday-event copy (EPCOT Festival of the Holidays, holiday lights) should still run until Jan 12. The festival ends around Dec 30. | Marketing |
| 4 | Two banners in the banner file never appear: Black Friday "Ends Soon" and Christmas "Ends Soon". The script picks the first match, and their dates are covered by other banners. Adjust dates in the banner file if they should show. | Marketing / Dev |
| 5 | Supply final photos for the Holiday Sale (holiday lights) and New Year (fireworks) banners. They currently use a placeholder. | Design |
