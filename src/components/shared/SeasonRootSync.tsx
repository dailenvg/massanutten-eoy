"use client";

import { useEffect } from "react";
import type { SeasonKey } from "@/lib/season";

/** Keeps `<html data-site-season>` in step on client-side navigation. */
export default function SeasonRootSync({ season }: { season: SeasonKey }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-site-season", season);
  }, [season]);
  return null;
}
