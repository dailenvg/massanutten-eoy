"use client";

/**
 * Toaster — the confirmation that fires when an add-on lands on the booking.
 *
 * Figma: Payment-Flow-Mockup 1:2928 ("Toaster TP Purchase Confirmed_V2").
 *
 * The provider owns a queue rather than a single slot so two quick adds stack
 * instead of clobbering one another, and the viewport is a live region so the
 * message is announced rather than only seen. Auto-dismiss pauses while the
 * pointer or focus is inside the stack — a toast a guest is reaching for must
 * not vanish out from under them.
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
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { X } from "@/lib/icons";
import { SPRING, TWEEN_COMPONENT } from "@/lib/motion";

/** How long a toast sits before it dismisses itself. */
const TOAST_MS = 6000;

type Toast = { id: number; message: string; /** Epoch ms when it should go. */ due: number };

type Ctx = {
  /** Show a confirmation toast. Returns nothing — toasts are fire-and-forget. */
  toast: (message: string) => void;
};

const ToastContext = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [paused, setPaused] = useState(false);
  const nextId = useRef(0);
  const reduced = useReducedMotion();

  const dismiss = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string) => {
    setToasts((list) => [...list, { id: nextId.current++, message, due: Date.now() + TOAST_MS }]);
  }, []);

  /*
   * Each toast carries its own deadline rather than sharing one timer, so a
   * second add does not extend the first one's stay — with a shared timer that
   * restarts on every change, a guest moving briskly through the upsells ends
   * up with the whole run stacked on screen. Pausing pushes the deadlines out
   * by however long the pointer rested there.
   */
  const pausedAt = useRef<number | null>(null);
  useEffect(() => {
    if (paused) {
      pausedAt.current = Date.now();
      return;
    }
    if (pausedAt.current !== null) {
      const held = Date.now() - pausedAt.current;
      pausedAt.current = null;
      setToasts((list) => list.map((t) => ({ ...t, due: t.due + held })));
      return;
    }
    if (toasts.length === 0) return;
    const next = Math.min(...toasts.map((t) => t.due));
    const id = window.setTimeout(
      () => setToasts((list) => list.filter((t) => t.due > Date.now())),
      Math.max(0, next - Date.now()),
    );
    return () => window.clearTimeout(id);
  }, [toasts, paused]);

  const value = useMemo(() => ({ toast }), [toast]);

  const enter = reduced
    ? { opacity: 0 }
    : { opacity: 0, y: 16, scale: 0.96 };
  const exit = reduced
    ? { opacity: 0 }
    : { opacity: 0, y: 8, scale: 0.98 };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="toaster"
        role="status"
        aria-live="polite"
        aria-atomic="false"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className="toast"
              layout={reduced ? false : true}
              initial={enter}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={exit}
              transition={reduced ? TWEEN_COMPONENT : SPRING}
            >
              <p className="toast-msg">{t.message}</p>
              <button
                type="button"
                className="toast-close"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
              >
                <X aria-hidden={true} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/**
 * The toast function, or a no-op when no provider is mounted.
 *
 * Deliberately non-throwing: the booking store calls this, and the store is
 * also used in places (tests, a bare step render) where the toaster is not
 * mounted. A missing toaster must not take the checkout down with it.
 */
export function useToast(): Ctx {
  const ctx = useContext(ToastContext);
  return ctx ?? NOOP;
}

const NOOP: Ctx = { toast: () => {} };
