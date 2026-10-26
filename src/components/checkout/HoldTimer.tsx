"use client";

import { useEffect, useState } from "react";
import { Lightning } from "@/lib/icons";
import { HOLD_SECONDS } from "@/lib/booking";
import { useBooking } from "@/lib/booking-store";

/**
 * "OFFER EXPIRES" countdown — the yellow block in the Package Summary and the
 * sentence on the payment step. One hold for the whole flow: it starts when the
 * guest reaches step 1 and is read back from the store on every later page, so
 * navigating between steps never resets it. At zero it holds at 00:00:00.
 */
export function useHoldRemaining() {
  const { booking } = useBooking();
  const start = booking.holdStartedAt;
  /*
    Seeded with the full window so the server and the first client render agree:
    the stored start only exists after the store has read sessionStorage, which
    is an effect. The interval below corrects it on the next tick.
  */
  const [left, setLeft] = useState(HOLD_SECONDS);

  useEffect(() => {
    if (start === null) return;
    /* Recomputed from the timestamp, never decremented, so a backgrounded tab
       (where timers are throttled) shows the true remaining time on return. */
    const tick = () => {
      const next = Math.max(0, HOLD_SECONDS - Math.floor((Date.now() - start) / 1000));
      setLeft(next);
      return next;
    };
    if (tick() === 0) return;
    const id = window.setInterval(() => {
      if (tick() === 0) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [start]);

  return start === null ? HOLD_SECONDS : left;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function splitClock(seconds: number) {
  return {
    hh: pad(Math.floor(seconds / 3600)),
    mm: pad(Math.floor((seconds % 3600) / 60)),
    ss: pad(seconds % 60),
  };
}

/** The boxed HH : MM : SS timer (Figma "Timer" component). */
export default function HoldTimer({ label = "Offer expires:" }: { label?: string }) {
  const left = useHoldRemaining();
  const { hh, mm, ss } = splitClock(left);

  return (
    <div className="ht" role="timer" aria-live="off" aria-label={`${label} ${hh}:${mm}:${ss}`}>
      <span className="ht-label">
        <Lightning className="ht-bolt" aria-hidden={true} />
        {label}
      </span>
      <span className="ht-clock" aria-hidden="true">
        <span className="ht-unit"><b>{hh}</b><small>HR</small></span>
        <span className="ht-colon">:</span>
        <span className="ht-unit"><b>{mm}</b><small>MIN</small></span>
        <span className="ht-colon">:</span>
        <span className="ht-unit"><b>{ss}</b><small>SEC</small></span>
      </span>
    </div>
  );
}
