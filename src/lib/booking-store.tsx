"use client";

/**
 * Booking state shared across the checkout flow.
 *
 * React context for the live value, sessionStorage for persistence across the
 * route changes between steps (and a refresh). sessionStorage rather than
 * localStorage on purpose: a booking should not outlive the tab. Card details
 * are never written here — the payment step keeps them in its own state.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  EMPTY_BOOKING,
  HOLD_SECONDS,
  addonToastMessage,
  checkOutFor,
  computeTotals,
  type Addons,
  type Booking,
  type Guest,
} from "./booking";
import { useToast } from "./toast";

const KEY = "vvip.booking.v1";

type Ctx = {
  booking: Booking;
  /** True once the stored value has been read; avoids a flash of empty state. */
  ready: boolean;
  totals: ReturnType<typeof computeTotals>;
  setGuest: (patch: Partial<Guest>) => void;
  setAddon: <K extends keyof Addons>(key: K, value: Addons[K]) => void;
  markPaid: () => void;
  startHold: () => void;
  reset: () => void;
};

const BookingContext = createContext<Ctx | null>(null);

function read(): Booking {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return EMPTY_BOOKING;
    const parsed = JSON.parse(raw) as Partial<Booking>;
    return {
      ...EMPTY_BOOKING,
      ...parsed,
      guest: { ...EMPTY_BOOKING.guest, ...(parsed.guest ?? {}) },
      addons: { ...EMPTY_BOOKING.addons, ...(parsed.addons ?? {}) },
    };
  } catch {
    return EMPTY_BOOKING;
  }
}

function write(b: Booking) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(b));
  } catch {
    /* storage unavailable — the in-memory value still drives this page */
  }
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<Booking>(EMPTY_BOOKING);
  const [ready, setReady] = useState(false);
  const { toast } = useToast();
  /** Last add-on set we toasted for; seeded on mount so a refresh is silent. */
  const prevAddons = useRef<Addons | null>(null);

  useEffect(() => {
    const restored = read();
    // Restoring from sessionStorage must wait for mount (SSR has no storage),
    // so this one setState-in-effect is the intended hydration step.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBooking(restored);
    prevAddons.current = restored.addons;
    setReady(true);
  }, []);

  const update = useCallback((fn: (b: Booking) => Booking) => {
    setBooking((prev) => {
      const next = fn(prev);
      write(next);
      return next;
    });
  }, []);

  const setGuest = useCallback(
    (patch: Partial<Guest>) =>
      update((b) => {
        const guest = { ...b.guest, ...patch };
        /* Check-out is derived, never typed. */
        guest.checkOut = checkOutFor(guest.checkIn, b.addons.extraNights);
        return { ...b, guest };
      }),
    [update],
  );

  const setAddon = useCallback(
    <K extends keyof Addons>(key: K, value: Addons[K]) =>
      update((b) => {
        const addons = { ...b.addons, [key]: value };
        const guest = { ...b.guest, checkOut: checkOutFor(b.guest.checkIn, addons.extraNights) };
        return { ...b, addons, guest };
      }),
    [update],
  );

  /**
   * Confirm every add-on with a toast, by watching the booking rather than the
   * call sites.
   *
   * An add-on can be taken from four places — the upsell "Yes", the "Are you
   * sure?" confirm, the Protection modal and the tickets card — and each must
   * confirm identically, so the trigger lives on the state, not the buttons.
   * It runs in an effect, not inside the state updater, because the updater has
   * to stay pure: StrictMode calls it twice and would toast twice.
   *
   * Removals stay silent — nothing was purchased. The ref is seeded from the
   * restored booking so a refresh mid-flow does not re-announce what the guest
   * already bought.
   */
  useEffect(() => {
    if (!ready) return;
    const prev = prevAddons.current;
    prevAddons.current = booking.addons;
    if (!prev) return;
    for (const key of Object.keys(booking.addons) as (keyof Addons)[]) {
      const now = booking.addons[key];
      const before = prev[key];
      /* "Added" = off→on for a flag, or a larger count for extra nights. */
      const added =
        typeof now === "number" ? now > (before as number) : now === true && before !== true;
      if (added) toast(addonToastMessage(key));
    }
  }, [ready, booking.addons, toast]);

  const markPaid = useCallback(
    () =>
      update((b) => ({
        ...b,
        paid: true,
        confirmation:
          b.confirmation || String(Math.floor(1_000_000_000 + Math.random() * 8_999_999_999)),
      })),
    [update],
  );

  /**
   * Begin the offer hold, or resume the one already running.
   *
   * Called on entry to every checkout step rather than only step 1, so a guest
   * who deep-links or refreshes on a later step gets a running clock instead of
   * a frozen one. An existing hold is left alone — that is what keeps the
   * countdown continuous across steps — unless it has already run out, which
   * means the tab sat idle past the window and the stored timestamp is stale.
   */
  const startHold = useCallback(
    () =>
      update((b) => {
        const live =
          b.holdStartedAt !== null && Date.now() - b.holdStartedAt < HOLD_SECONDS * 1000;
        return live ? b : { ...b, holdStartedAt: Date.now() };
      }),
    [update],
  );

  const reset = useCallback(() => update(() => EMPTY_BOOKING), [update]);

  const totals = useMemo(() => computeTotals(booking.addons), [booking.addons]);

  const value = useMemo(
    () => ({ booking, ready, totals, setGuest, setAddon, markPaid, startHold, reset }),
    [booking, ready, totals, setGuest, setAddon, markPaid, startHold, reset],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
