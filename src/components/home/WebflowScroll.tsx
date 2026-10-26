"use client";

import { useEffect } from "react";

/**
 * Port of the Webflow runtime "scroll" module (the only part of webflow.js this page used):
 * in-page anchor links animate to their target with Webflow's easing/duration, push the hash
 * to history, move focus to the section, and `href="#"` links are inert.
 */
const HASH_RE = /^#[a-zA-Z0-9][\w:.-]*$/;
const FIXED_HEADER_SELECTOR = "header, body > .header, body > .w-nav:not([data-no-scroll])";

function easeInOutCubic(s: number) {
  return s < 0.5 ? 4 * s * s * s : (s - 1) * (2 * s - 2) * (2 * s - 2) + 1;
}

function swapTabIndex(el: HTMLElement, mode: "add" | "remove") {
  if (mode === "add") {
    const current = el.getAttribute("tabindex");
    if (current) el.setAttribute("data-wf-tabindex-swap", current);
    else el.setAttribute("tabindex", "-1");
  } else {
    const swap = el.getAttribute("data-wf-tabindex-swap");
    if (swap) {
      el.setAttribute("tabindex", swap);
      el.removeAttribute("data-wf-tabindex-swap");
    } else el.removeAttribute("tabindex");
  }
  el.classList.toggle("wf-force-outline-none", mode === "add");
}

function scrollToTarget(target: HTMLElement, reduceMotion: MediaQueryList | null) {
  const start = window.pageYOffset;
  const header = document.querySelector<HTMLElement>(FIXED_HEADER_SELECTOR);
  const headerHeight = header && getComputedStyle(header).position === "fixed" ? header.getBoundingClientRect().height : 0;
  let end = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
  if (target.dataset.scroll === "mid") {
    const available = window.innerHeight - headerHeight;
    const own = target.getBoundingClientRect().height;
    if (own < available) end -= Math.round((available - own) / 2);
  }
  if (start === end) return;

  let multiplier = 1;
  [document.body, target].forEach((el) => {
    const n = parseFloat(el.getAttribute("data-scroll-time") || "");
    if (!isNaN(n) && n >= 0) multiplier = n;
  });
  const duration =
    document.body.getAttribute("data-wf-scroll-motion") === "none" || (reduceMotion && reduceMotion.matches)
      ? 0
      : (472.143 * Math.log(Math.abs(end - start) + 125) - 2000) * multiplier;

  const done = () => {
    swapTabIndex(target, "add");
    target.focus({ preventScroll: true });
    swapTabIndex(target, "remove");
  };

  if (duration <= 0) {
    window.scroll(0, end);
    done();
    return;
  }

  const startedAt = Date.now();
  const frame = () => {
    const elapsed = Date.now() - startedAt;
    window.scroll(0, elapsed > duration ? end : start + (end - start) * easeInOutCubic(elapsed / duration));
    if (elapsed <= duration) requestAnimationFrame(frame);
    else done();
  };
  requestAnimationFrame(frame);
}

export default function WebflowScroll() {
  useEffect(() => {
    const reduceMotion = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const inIframe = (() => {
      try {
        return !!window.frameElement;
      } catch {
        return true;
      }
    })();

    const onClick = (e: MouseEvent) => {
      const el = e.target as Element | null;
      const link = el && el.closest ? (el.closest('a[href*="#"]') as HTMLAnchorElement | null) : null;
      if (!link) return;
      if (link.getAttribute("href") === "#") {
        e.preventDefault(); // Webflow: empty links are inert
        return;
      }
      if (link.classList.contains("w-tab-link")) return;
      const loc = window.location;
      const hash = HASH_RE.test(link.hash) && link.host + link.pathname === loc.host + loc.pathname ? link.hash : "";
      if (hash === "") return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      if (loc.hash !== hash && !inIframe && window.history.pushState && !(window.history.state && window.history.state.hash === hash)) {
        window.history.pushState({ hash }, "", hash);
      }
      window.setTimeout(() => scrollToTarget(target, reduceMotion), 0);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
