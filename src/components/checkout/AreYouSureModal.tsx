"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { Sparkle, X } from "@/lib/icons";
import { SPRING, TWEEN_COMPONENT } from "@/lib/motion";

/**
 * "Are you sure?" — shown when a guest skips an upsell (Figma "wonder why not
 * V3"). Two actions: skip anyway, or take the offer. Esc and the X both skip.
 */
export default function AreYouSureModal({
  open,
  title = "Are you sure?",
  body,
  question,
  confirmLabel,
  onConfirm,
  onSkip,
}: {
  open: boolean;
  title?: string;
  body: string;
  question: string;
  confirmLabel: string;
  onConfirm: () => void;
  onSkip: () => void;
}) {
  const reduced = useReducedMotion();
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onSkip(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onSkip]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="md-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={TWEEN_COMPONENT}
          onClick={onSkip}
        >
          <motion.div
            className="md md--sure"
            role="dialog"
            aria-modal="true"
            aria-labelledby="md-sure-title"
            onClick={(e) => e.stopPropagation()}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={reduced ? TWEEN_COMPONENT : SPRING}
          >
            <button type="button" className="md-close" onClick={onSkip} aria-label="Close"><X aria-hidden={true} /></button>
            <h2 className="md-title" id="md-sure-title"><Sparkle className="md-star" aria-hidden={true} />{title}</h2>
            <p className="md-body">{body}</p>
            <p className="md-question">{question}</p>
            <div className="md-actions">
              <button ref={first} type="button" className="fbtn fbtn--ghost" onClick={onSkip}>Skip</button>
              <button type="button" className="fbtn fbtn--primary" onClick={onConfirm}>{confirmLabel}</button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
