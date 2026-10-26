"use client";

import { useEffect, type ReactNode } from "react";
import { BookingProvider, useBooking } from "@/lib/booking-store";
import type { Addons } from "@/lib/booking";
import OfferBand from "./OfferBand";
import PackageSummary from "./PackageSummary";

/**
 * Starts the offer hold on entry to any checkout step.
 *
 * It used to live in step 1 alone, which left the countdown frozen for anyone
 * who landed on a later step directly or refreshed there. Must sit inside the
 * provider, hence the separate component.
 */
function HoldStarter() {
  const { ready, startHold } = useBooking();
  useEffect(() => {
    if (ready) startHold();
  }, [ready, startHold]);
  return null;
}

/**
 * Publishes the sticky header's height as `--fl-header-h` so anything that
 * pins below it (the Package Summary) can offset by the real measurement
 * rather than a hard-coded guess that drifts when the bar's type or padding
 * changes. Re-measures on resize and whenever the bar itself resizes.
 */
function HeaderOffset() {
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>(".tb");
    if (!bar) return;

    const sync = () => {
      document.documentElement.style.setProperty("--fl-header-h", `${bar.offsetHeight}px`);
    };
    sync();

    window.addEventListener("resize", sync, { passive: true });
    const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(sync);
    ro?.observe(bar);

    return () => {
      window.removeEventListener("resize", sync);
      ro?.disconnect();
      document.documentElement.style.removeProperty("--fl-header-h");
    };
  }, []);
  return null;
}

/**
 * Page chrome for the checkout steps.
 *
 *  - "band":    steps 1–2 — photo offer header, then the step's own two cards.
 *  - "summary": steps 3–6 — the step on the left, Package Summary on the right
 *               (summary first on narrow screens, as in the comps).
 *
 * `offering` is the add-on this step is selling. The summary previews it at the
 * bottom of the Upgrades list until the guest takes it, so the offer in front of
 * them is costed in the same place as everything they have already bought.
 */
export default function FlowLayout({
  variant,
  offering,
  children,
}: {
  variant: "band" | "summary";
  offering?: keyof Addons;
  children: ReactNode;
}) {
  return (
    <BookingProvider>
      <HoldStarter />
      <HeaderOffset />
      {variant === "band" ? <OfferBand /> : null}
      <main className={`flow flow--${variant}`}>
        <div className="flow-inner">
          {variant === "summary" ? (
            <>
              <div className="flow-main">{children}</div>
              <PackageSummary offering={offering} />
            </>
          ) : (
            children
          )}
        </div>
      </main>
    </BookingProvider>
  );
}
