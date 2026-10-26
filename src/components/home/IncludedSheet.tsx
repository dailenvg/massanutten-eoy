"use client";

import { useCallback, useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion, useDragControls, type PanInfo } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { X } from "@/lib/icons";
import { SPRING, TWEEN_COMPONENT } from "@/lib/motion";
import { lockBody, unlockBody } from "@/lib/scroll-lock";
import type { Season } from "@/lib/season";
import { IncludedPanel, TABS, TAB_KEYS, panelId, panelTitleId, tabId, type TabKey } from "./IncludedPanels";

/** Drag past this far, or flick faster than this, and the sheet dismisses. */
const DISMISS_OFFSET = 120;
const DISMISS_VELOCITY = 600;

/**
 * Phone-only bottom sheet for "What's Included" (≤767px).
 *
 * Tapping one of the four cards opens the sheet at that tab. The icon tabs ride
 * on top of the sheet so a guest can move between the four without closing it;
 * the panel itself is the same markup the desktop tab bar renders inline.
 */
export default function IncludedSheet({
  open,
  active,
  season,
  onSelect,
  onClose,
}: {
  open: boolean;
  active: TabKey;
  season: Season;
  onSelect: (key: TabKey) => void;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  /* Pin the page behind the sheet, and put it back exactly where it was. */
  useEffect(() => {
    if (!open) return;
    const y = window.scrollY || window.pageYOffset;
    lockBody(y);
    return () => unlockBody(y);
  }, [open]);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  /* A new tab starts at the top rather than mid-scroll from the previous one. */
  useEffect(() => {
    if (open) bodyRef.current?.scrollTo({ top: 0 });
  }, [open, active]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !sheetRef.current) return;
    const focusables = sheetRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]):not([tabindex="-1"]), a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  /* Roving tabindex across the sheet's icon tabs, same contract as the desktop bar. */
  const onTabsKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>(".rd-sheet-tab"));
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (current + 1) % tabs.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (current - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next === -1) return;
    e.preventDefault();
    onSelect(TAB_KEYS[next]);
    tabs[next].focus();
  };

  const startDrag = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (reduced) return;
      dragControls.start(e);
    },
    [dragControls, reduced],
  );

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.y > DISMISS_OFFSET || info.velocity.y > DISMISS_VELOCITY) onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className="rd-sheet-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TWEEN_COMPONENT}
          />
          <motion.div
            className="rd-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={panelTitleId(active)}
            ref={sheetRef}
            onKeyDown={trapFocus}
            initial={reduced ? { opacity: 0 } : { y: "100%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            /* Spring in, tween out: a spring's settle leaves the sheet mounted well past
               the 800ms ceiling, and a dismissal wants to be over the moment it reads. */
            exit={reduced ? { opacity: 0, transition: TWEEN_COMPONENT } : { y: "100%", transition: TWEEN_COMPONENT }}
            transition={reduced ? TWEEN_COMPONENT : SPRING}
            drag={reduced ? false : "y"}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={onDragEnd}
          >
            <div className="rd-sheet-grip" onPointerDown={startDrag} aria-hidden="true">
              <span className="rd-sheet-grab" />
            </div>

            <div className="rd-sheet-head">
              <div className="rd-sheet-tabs" role="tablist" aria-label="What's Included" onKeyDown={onTabsKeyDown}>
                {TABS.map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    className={key === active ? "rd-sheet-tab is-active" : "rd-sheet-tab"}
                    role="tab"
                    id={tabId(key)}
                    aria-controls={panelId(key)}
                    aria-selected={key === active}
                    tabIndex={key === active ? 0 : -1}
                    onClick={() => onSelect(key)}
                  >
                    {key === active ? (
                      <motion.span className="rd-sheet-pill" layoutId="rd-sheet-pill" transition={SPRING} />
                    ) : null}
                    <Icon aria-hidden={true} />
                    <span className="vv-visually-hidden">{label}</span>
                  </button>
                ))}
              </div>

              <button type="button" className="rd-sheet-close" aria-label="Close" ref={closeRef} onClick={onClose}>
                <X aria-hidden={true} />
              </button>
            </div>

            <div className="rd-sheet-body" ref={bodyRef}>
              <IncludedPanel tab={active} season={season} active />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
