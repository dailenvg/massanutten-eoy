import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

// Same stylesheets, same cascade order as the original <head>.
import "@/styles/normalize.css";
import "@/styles/webflow.css";
import "@/styles/sogno-wg-orlando-99-8-26.webflow.css";
import "@/styles/fonts.css";
import "@/styles/fonts-extra.css";
import "@/styles/site-overrides.css";
// The page-level <style> blocks from index.html, concatenated in document order.
import "@/styles/home-inline.css";
import "@/styles/legal-modal.css";
import "@/styles/seasonal.css";
import "@/styles/season-accents.css";
// Rebuilt home components (load last so they win over the export layers above).
import "@/styles/offer-price.css";
import "@/styles/phone-modal.css";
import "@/styles/seasonal-sale-banner.css";
import "@/styles/bonus-cta.css";
import "@/styles/hero-bonus.css";
import "@/styles/frost.css";
import "@/styles/global-banner.css";

import GlobalBanner from "@/components/shared/GlobalBanner";
import PrePaintScript from "@/components/shared/PrePaintScript";
import { ClarityScripts, GtmNoScript, GtmScript } from "@/components/shared/Analytics";
import { ToastProvider } from "@/lib/toast";
import { SEASON_THEME_COLOR } from "@/lib/season-viewport";
import { BREADCRUMB_JSON_LD, PRODUCT_JSON_LD } from "@/lib/structured-data";
import {
  CANONICAL_URL,
  OG_IMAGE_URL,
  PAGE_DESCRIPTION,
  PAGE_TITLE,
  WEBFLOW_PAGE_ID,
  WEBFLOW_SITE_ID,
} from "@/lib/site";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  robots: "index, follow",
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE_URL],
    url: CANONICAL_URL,
    type: "website",
    siteName: "VacationVIP",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
  icons: {
    icon: [
      { url: "/images/icons/favicon.ico", sizes: "48x48" },
      { url: "/images/icons/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/images/icons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/images/icons/favicon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: "/images/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

/** Fallback only: every page overrides this with its season via generateSeasonViewport. */
export const viewport: Viewport = { themeColor: SEASON_THEME_COLOR.winter };

/**
 * Webflow's exported CSS keys off a `w-mod-js` class on <html>. Set it synchronously
 * before first paint so no element flashes an unstyled state (and `w-mod-touch` on touch devices).
 */
const W_MOD_SCRIPT = `!function (o, c) {
  var n = c.documentElement, t = ' w-mod-';
  n.className += t + 'js';
  if ('ontouchstart' in o || (o.DocumentTouch && c instanceof o.DocumentTouch)) n.className += t + 'touch';
}(window, document);`;

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the pre-paint script above mutates the class attribute.
    <html lang="en" data-wf-page={WEBFLOW_PAGE_ID} data-wf-site={WEBFLOW_SITE_ID} suppressHydrationWarning>
      <head>
        <ClarityScripts />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_JSON_LD) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }} />
        {/* Self-hosted Roboto: static 400/700 plus a variable file for 500/600/800/900 (hero CTAs and lockup). */}
        <link rel="preload" as="font" type="font/woff2" href="/fonts/roboto-400.woff2" crossOrigin="" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/roboto-700.woff2" crossOrigin="" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/roboto-variable-latin.woff2" crossOrigin="" />
        <PrePaintScript code={W_MOD_SCRIPT} />
        <GtmScript />
      </head>
      <body className="body property-sogno-wg-orlando-99-eoy" suppressHydrationWarning>
        <GtmNoScript />
        <GlobalBanner />
        {/*
          The toaster sits in the root layout, not in the checkout chrome.
          Taking an upsell adds the add-on and routes onward in the same click
          — including the last one, which leaves /checkout for /confirmation —
          so a provider mounted per page or per segment would be torn down in
          the same tick the confirmation appeared. Layouts survive navigation;
          the viewport renders nothing until something is toasted.
        */}
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
