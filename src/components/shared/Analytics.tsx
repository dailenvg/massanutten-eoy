import Script from "next/script";
import { CLARITY_PROJECTS, GTM_ID, GTM_SNIPPET, claritySnippet } from "@/lib/analytics";

/** Microsoft Clarity tags (OneAgency + Sogno). Rendered first in <head>, like the original. next/script so React does not warn about raw <script> tags. */
export function ClarityScripts() {
  return (
    <>
      <Script id="clarity-oneagency" dangerouslySetInnerHTML={{ __html: claritySnippet(CLARITY_PROJECTS.oneAgency) }} />
      <Script id="clarity-sogno" dangerouslySetInnerHTML={{ __html: claritySnippet(CLARITY_PROJECTS.sogno) }} />
    </>
  );
}

export function GtmScript() {
  return <Script id="gtm" dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />;
}

export function GtmNoScript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
