"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { seasonFromParam, withSeasonParam } from "@/lib/season";

/** Builds internal flow URLs that keep the `?season=` QA override, if any. */
export function useFlowHref(): (path: string) => string {
  const override = seasonFromParam(useSearchParams().get("season"));
  return useMemo(() => (path: string) => withSeasonParam(path, override), [override]);
}

/** `useRouter` whose push/replace carry the `?season=` QA override through the flow. */
export function useFlowRouter() {
  const router = useRouter();
  const href = useFlowHref();
  return useMemo(
    () => ({
      push: (path: string) => router.push(href(path)),
      replace: (path: string) => router.replace(href(path)),
    }),
    [router, href],
  );
}
