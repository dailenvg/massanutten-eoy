import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site uses plain <img> tags (exact srcset/sizes/fetchpriority parity with the
  // original markup), so the image optimizer is not needed.
  images: { unoptimized: true },
  turbopack: { root: path.resolve(__dirname) },
  // Let editor previews open the dev server on 127.0.0.1 (Next blocks non-localhost dev origins, so the page never hydrates).
  allowedDevOrigins: ["127.0.0.1"],
  // Uncomment to deploy under the original sub-path (https://www.vacationvip.com/sogno-wg-orlando-99-8-26/):
  // basePath: "/sogno-wg-orlando-99-8-26",
};

export default nextConfig;
