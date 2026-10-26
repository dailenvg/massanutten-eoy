"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Inline script that must run before first paint. React reuses the server's
 * <script> during hydration, but warns ("Encountered a script tag...") if it
 * has to create one on the client, e.g. after a client-side navigation. So
 * render it on the server and while hydrating only; once mounted, the script
 * has already run and client renders skip it.
 */
export default function PrePaintScript({ code }: { code: string }) {
  const serverOrHydrating = useSyncExternalStore(subscribe, () => false, () => true);
  if (!serverOrHydrating) return null;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
