"use client";

import { useEffect } from "react";
import { CHECKOUT_URL } from "@/lib/site";
import { seasonFromParam } from "@/lib/season";

declare global {
  interface Window {
    checkoutURL?: string;
  }
}

// Channel is derived from utm_source only (meta | google | bing | 3pr); every channel shares one checkout URL.
const UTM_STORAGE_KEY = "utm_params";
const TRACKING_PARAM_PATTERN = /^(utm_|gclid|fbclid|msclkid|referrer)/i;
const CTA_SELECTOR = ".checkout-cta, .hs-cta, .rd-cta, .gr-cta, .bch-cta, .msc-cta, a.vector-cta";
const SUPPRESS_SCARCITY_FOR = ["google", "bing"];

function getQueryStringFromUrl(): string {
  const href = window.location.href;
  const i = href.indexOf("?");
  return i >= 0 ? href.slice(i + 1) : "";
}

function parseParams(queryString: string): Record<string, string> {
  return queryString
    .split("&")
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, pair) => {
      const parts = pair.split("=");
      try {
        acc[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || "");
      } catch {
        acc[parts[0]] = parts[1] || "";
      }
      return acc;
    }, {});
}

function filterTrackingParams(queryString: string): string {
  if (!queryString) return "";
  return queryString
    .split("&")
    .filter(Boolean)
    .filter((pair) => {
      let key = pair.split("=")[0];
      try {
        key = decodeURIComponent(key);
      } catch {
        /* keep raw key */
      }
      return TRACKING_PARAM_PATTERN.test(key);
    })
    .join("&");
}

function getStoredQueryString(): string {
  try {
    return sessionStorage.getItem(UTM_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function persistQueryString(queryString: string) {
  if (!queryString) return;
  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, queryString);
  } catch {
    /* storage unavailable */
  }
}

function getEffectiveQueryString(): string {
  const fromUrl = filterTrackingParams(getQueryStringFromUrl());
  if (fromUrl) {
    persistQueryString(fromUrl);
    return fromUrl;
  }
  return getStoredQueryString();
}

function detectChannel(queryString: string): string {
  const params = parseParams(queryString || "");
  const utmSource = (params.utm_source || "").toLowerCase();
  const referrerParam = (params.referrer || "").toLowerCase();

  if (
    utmSource.indexOf("facebook") !== -1 ||
    utmSource === "meta" ||
    utmSource.indexOf("meta") !== -1 ||
    referrerParam.indexOf("facebook.com") !== -1 ||
    referrerParam.indexOf("fb.com") !== -1
  )
    return "meta";

  if (
    utmSource.indexOf("google") !== -1 ||
    referrerParam.indexOf("google.com") !== -1 ||
    referrerParam.indexOf("googleads") !== -1 ||
    referrerParam.indexOf("doubleclick") !== -1
  )
    return "google";

  if (
    utmSource.indexOf("bing") !== -1 ||
    utmSource.indexOf("microsoft") !== -1 ||
    referrerParam.indexOf("bing") !== -1 ||
    referrerParam.indexOf("microsoft") !== -1
  )
    return "bing";

  if (
    utmSource.indexOf("3pr") !== -1 ||
    utmSource.indexOf("rokt") !== -1 ||
    referrerParam.indexOf("3pr") !== -1 ||
    referrerParam.indexOf("rokt") !== -1
  )
    return "3pr";

  const ref = (document.referrer || "").toLowerCase();
  if (ref.indexOf("facebook.com") !== -1 || ref.indexOf("fb.com") !== -1) return "meta";
  if (ref.indexOf("google.com") !== -1 || ref.indexOf("googleads") !== -1 || ref.indexOf("doubleclick") !== -1) return "google";
  if (ref.indexOf("bing.com") !== -1) return "bing";

  return "meta";
}

/** The `?season=` QA override, carried into checkout so the whole flow previews one version. */
function seasonOverrideParam(): string {
  const season = seasonFromParam(new URLSearchParams(window.location.search).get("season"));
  return season ? "season=" + season.key : "";
}

function applyCheckoutUrl(queryString: string, destination: string) {
  /* Always the real checkout, whatever this page's CTAs point at. */
  window.checkoutURL = CHECKOUT_URL;
  const query = [queryString, seasonOverrideParam()].filter(Boolean).join("&");
  const target = query.length > 0 ? destination + "?" + query : destination;
  const ctas = document.querySelectorAll(CTA_SELECTOR);
  for (let i = 0; i < ctas.length; i++) ctas[i].setAttribute("href", target);
}

function propagateQueryString(queryString: string) {
  if (!queryString) return;
  const links = document.querySelectorAll("a[href]");
  for (let i = 0; i < links.length; i++) {
    const href = links[i].getAttribute("href");
    if (!href) continue;
    if (href.charAt(0) === "#") continue;
    if (href.indexOf("tel:") === 0 || href.indexOf("mailto:") === 0 || href.indexOf("javascript:") === 0) continue;
    if (href.indexOf("terms-and-conditions") !== -1 || href.indexOf("privacy-policy") !== -1) continue;
    if (href.indexOf("?") !== -1) continue;
    links[i].setAttribute("href", href + "?" + queryString);
  }
}

function applyScarcityPolicy(channel: string) {
  if (SUPPRESS_SCARCITY_FOR.indexOf(channel) === -1) return;
  const hide = document.querySelectorAll<HTMLElement>(".offerexpirecounter, .offerexpirecounteracccard");
  for (let i = 0; i < hide.length; i++) hide[i].style.display = "none";
  const containers = document.querySelectorAll<HTMLElement>(".acccardblock");
  for (let j = 0; j < containers.length; j++) containers[j].style.justifyContent = "center";
}

/**
 * Carries UTM / click-id parameters from the landing URL (or the session) into every
 * CTA and outbound link, and applies the per-channel scarcity policy.
 * Runs once after hydration, mutating hrefs in place exactly like the original script.
 */
export default function CheckoutRouter({
  destination,
}: {
  /**
   * Where this page's CTAs go. Required, not defaulted: this component
   * overwrites every CTA href after hydration, so a page that forgets to say
   * where it points silently sends people somewhere else than its own markup
   * says. Landing -> the bonus step, bonus -> payment.
   */
  destination: string;
}) {
  useEffect(() => {
    try {
      const queryString = getEffectiveQueryString();
      const channel = detectChannel(queryString);
      applyCheckoutUrl(queryString, destination);
      propagateQueryString(queryString);
      applyScarcityPolicy(channel);
    } catch (err) {
      if (window.console && console.warn) console.warn("[checkout-router]", err);
    }
  }, [destination]);

  return null;
}
