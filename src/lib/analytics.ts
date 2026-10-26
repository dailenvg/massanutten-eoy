export const GTM_ID = "GTM-K8HPRT4F";

export const CLARITY_PROJECTS = {
  oneAgency: "vt5gigzv4c",
  sogno: "wxt984qnan",
} as const;

export function claritySnippet(projectId: string): string {
  return `(function (c, l, a, r, i, t, y) {
  c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
  t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
  y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
})(window, document, "clarity", "script", "${projectId}");`;
}

/** Google Tag Manager loader (served through the first-party js-loader unless gtm_debug is set). */
export const GTM_SNIPPET = `(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != "dataLayer" ? "&l=" + l : "",
    url = (window.location.href.includes("gtm_debug") == true ? "https://www.googletagmanager.com/gtm.js" : "https://myonedot.co/js-loader/go");
  j.async = true;
  j.src = url + "?id=" + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, "script", "dataLayer", "${GTM_ID}");`;
