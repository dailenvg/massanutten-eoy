# massanutten-eoy

VacationVIP end-of-year landing page and checkout flow for a 4-Day / 3-Night stay at Massanutten Resort® in Virginia's Shenandoah Valley: $104 per family (retail $748, 86% off), 2 Ski Day Passes included, 12 months to travel. Seven seasonal versions (winter, Black Friday, Cyber Monday, Travel Tuesday, Holiday Sale, New Year, late winter) swap by date; preview any with `?season=<key>`.

Next.js 16 / React 19 / Framer Motion. Cloned from the Gatlinburg EOY template (`sognotours-eoy-gatlinburg-4-3-99-20260909`).

- Offer facts and destination copy: `src/lib/offer.ts` (placeholders at the top)
- Seasonal copy, hero photos and dates: `src/lib/season.ts`
- Checkout slug and URLs: `src/lib/site.ts`
- Legal copy: `src/lib/terms.ts`
- Photos: `public/images/massanutten/`

```bash
npm install
npm run dev
npm run typecheck && npm run lint && npm run build
```
