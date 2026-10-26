"use client";

import { useEffect, useState } from "react";
import type { CountdownMode } from "@/lib/season";

function format(mode: CountdownMode, msLeft: number): string {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  switch (mode.kind) {
    case "dhm":
      return `Ends in ${pad(days)}d ${pad(hours)}h ${pad(minutes)}m`;
    case "hms":
      return `Ends in ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    case "days":
      // Partial days still count as a day remaining.
      return `${pad(Math.ceil(total / 86400))} days left`;
    case "none":
      return "";
  }
}

/**
 * Live countdown for the seasonal top bar (copy spec §3).
 *
 * The value depends on the viewer's clock, so the server and the first client
 * paint render an empty, width-reserved chip and the label fills in after
 * mount. The chip is always in the markup, so nothing shifts when it does.
 */
export default function SeasonCountdown({ mode }: { mode: CountdownMode }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (mode.kind === "none") return;
    const target = Date.parse(mode.target);
    // Seconds tick every second; day/minute granularity only needs 30s.
    const interval = mode.kind === "hms" ? 1000 : 30_000;

    const tick = () => setLabel(format(mode, target - Date.now()));
    tick();
    const id = window.setInterval(tick, interval);
    return () => window.clearInterval(id);
  }, [mode]);

  if (mode.kind === "none") return null;

  return (
    <span className="stb-countdown" role="timer" aria-live="off">
      {label ?? "\u00a0"}
    </span>
  );
}
