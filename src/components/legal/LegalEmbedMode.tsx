"use client";

import { useEffect } from "react";

/**
 * When rendered inside the home page's legal modal (`?embed=1`): mark <html>/<body>
 * as embedded (hides navbar/footer) and neutralise in-copy links.
 */
export default function LegalEmbedMode() {
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).get("embed")) return;
    document.documentElement.classList.add("is-embed");
    document.body.classList.add("is-embed");
    document.querySelectorAll(".legal-main a[href]").forEach((link) => {
      link.removeAttribute("href");
      link.removeAttribute("target");
      link.removeAttribute("rel");
    });
  }, []);

  return null;
}
