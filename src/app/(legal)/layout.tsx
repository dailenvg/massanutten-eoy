import type { Metadata, Viewport } from "next";
import PrePaintScript from "@/components/shared/PrePaintScript";
import type { ReactNode } from "react";

import "@/styles/brand.css";
import "@/styles/legal-inline.css";

import { ClarityScripts, GtmNoScript, GtmScript } from "@/components/shared/Analytics";
import LegalEmbedMode from "@/components/legal/LegalEmbedMode";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
  icons: {
    icon: [
      { url: "/images/icons/favicon.ico", sizes: "48x48" },
      { url: "/images/icons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/images/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fe5925" },
    { media: "(prefers-color-scheme: dark)", color: "#fe5925" },
  ],
};

/** `?embed=1` (used by the home page's legal modal iframe) hides the page chrome before first paint. */
const EMBED_SCRIPT = `if (new URLSearchParams(location.search).get("embed")) document.documentElement.classList.add("is-embed");`;

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ClarityScripts />
        <GtmScript />
        {/* CLIENT-APPROVED legal copy — do not paraphrase (Sogno Tours, LLC d/b/a VacationVIP.com). */}
        <PrePaintScript code={EMBED_SCRIPT} />
      </head>
      <body suppressHydrationWarning>
        <GtmNoScript />

        <header className="pf-navbar">
          <img className="pf-navbar__logo" src="/images/VacationVIP-logo.svg" alt="VacationVIP" width="180" height="30" />
        </header>

        {children}

        <footer className="pf-footer">
          <img className="pf-footer__logo" src="/images/vacationvip-logo-f.svg" alt="VacationVIP.com" width="154" height="20" />
          <p className="pf-footer__legal">Price does not include hotel taxes which vary and are payable upon check-in.</p>
          <p className="pf-footer__legal">Sogno Tours, LLC d/b/a VacationVIP.com</p>
          <p className="pf-footer__legal">5900 Lake Ellenor Drive Suite 300, Orlando, FL 32809</p>
          <p className="pf-footer__legal">SOT: Florida: ST44683 | Washington: 603354522 | California: 2156600-50 | Hawaii: 7531</p>
          <div className="pf-footer__links">
            <a href="/terms-and-conditions">Terms &amp; Conditions</a>
            <span>|</span>
            <a href="/privacy-policy">Privacy Policy</a>
          </div>
        </footer>

        <LegalEmbedMode />
      </body>
    </html>
  );
}
