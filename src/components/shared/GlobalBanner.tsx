import { readFileSync } from "node:fs";
import path from "node:path";
import PrePaintScript from "./PrePaintScript";

/*
 * Shared holiday top bar (public/js/globalBanners.js). Inlined and run before
 * first paint so the bar never pushes the page down after load. The lib
 * prepends the bar to <body>; React 19 skips that foreign node when hydrating.
 * If a banner went live, flag <html> so the seasonal top bar steps aside.
 */
const LIB = readFileSync(path.join(process.cwd(), "public/js/globalBanners.js"), "utf8");
const CODE = `${LIB}
if (document.querySelector(".holiday-bar")) document.documentElement.setAttribute("data-holiday-bar", "");`;

export default function GlobalBanner() {
  return <PrePaintScript code={CODE} />;
}
