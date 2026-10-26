"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { ChevronRight } from "@/lib/icons";
import { RESERVE_URL } from "@/lib/site";
import { TWEEN_COMPONENT } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media";
import type { Season } from "@/lib/season";
import IncludedSheet from "./IncludedSheet";
import { IncludedPanel, TABS, TAB_KEYS, isTabKey, panelId, tabId, type TabKey } from "./IncludedPanels";

/**
 * Below this width the four tabs can't hold a legible label in one row, so the
 * section switches to a 2×2 card grid that opens the panel in a bottom sheet.
 */
const PHONE = "(max-width: 767px)";

const CARD_GRID = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const CARD = {
  hidden: { opacity: 0, y: 12 },
  shown: { opacity: 1, y: 0, transition: TWEEN_COMPONENT },
};

declare global {
  interface Window {
    /** Public hooks kept from the original page script (used by tag-manager / external callers). */
    rdTab?: (btn: HTMLElement | null, id: string) => void;
    rdTabById?: (id: string) => void;
  }
}

/**
 * Component H — "What's Included" (copy spec §10).
 *
 * Tablet and up: a four-up tab bar with the panel inline underneath, roving
 * tabindex across the tabs. Phones: four cards, and the panel opens in a
 * three-quarter-height bottom sheet that carries the icon tabs on top so a
 * guest can move between the four without closing it.
 */
export default function EverythingIncluded({ season }: { season: Season }) {
  const isPhone = useMediaQuery(PHONE);
  const reduced = useReducedMotion();
  const [active, setActive] = useState<TabKey>("accom");
  const [sheetOpen, setSheetOpen] = useState(false);
  const lastCard = useRef<HTMLButtonElement | null>(null);

  const select = useCallback((id: string) => {
    if (isTabKey(id)) setActive(id);
  }, []);

  useEffect(() => {
    /* External callers ask for a tab by id; on phones that has to open the sheet too. */
    const reveal = (id: string) => {
      if (!isTabKey(id)) return;
      setActive(id);
      if (isPhone) setSheetOpen(true);
    };
    window.rdTab = (_btn, id) => reveal(id);
    window.rdTabById = (id) => reveal(id);
    return () => {
      delete window.rdTab;
      delete window.rdTabById;
    };
  }, [isPhone]);

  const openSheet = (key: TabKey, trigger: HTMLButtonElement) => {
    lastCard.current = trigger;
    setActive(key);
    setSheetOpen(true);
  };

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    lastCard.current?.focus();
  }, []);

  const onTabBarKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>(".rd-tab"));
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (current + 1) % tabs.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (current - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    if (next === -1) return;
    e.preventDefault();
    select(TAB_KEYS[next]);
    tabs[next].focus();
  };

  return (
    <section id="everything-included">
      <div className="rd-inner">
        <h2 className="rd-section-title">What&apos;s Included</h2>

        {isPhone ? (
          <motion.div
            className="rd-card-grid"
            variants={reduced ? undefined : CARD_GRID}
            initial={reduced ? undefined : "hidden"}
            whileInView={reduced ? undefined : "shown"}
            viewport={{ once: true, margin: "-10%" }}
          >
            {TABS.map(({ key, label, Icon }) => (
              <motion.button
                key={key}
                type="button"
                className="rd-card"
                variants={reduced ? undefined : CARD}
                whileTap={reduced ? undefined : { scale: 0.97 }}
                aria-haspopup="dialog"
                aria-expanded={sheetOpen && active === key}
                aria-controls={panelId(key)}
                onClick={(e) => openSheet(key, e.currentTarget)}
              >
                <span className="rd-card-icon"><Icon aria-hidden={true} /></span>
                <span className="rd-card-label">{label}</span>
                <span className="rd-card-more">View<ChevronRight aria-hidden={true} /></span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <>
            <div className="rd-tab-bar" role="tablist" aria-label="What's Included" onKeyDown={onTabBarKeyDown}>
              {TABS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  className={active === key ? "rd-tab active" : "rd-tab"}
                  role="tab"
                  id={tabId(key)}
                  aria-controls={panelId(key)}
                  aria-selected={active === key}
                  tabIndex={active === key ? 0 : -1}
                  onClick={() => select(key)}
                >
                  <Icon aria-hidden={true} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {TAB_KEYS.map((key) => (
              <IncludedPanel key={key} tab={key} season={season} active={active === key} />
            ))}
          </>
        )}

        <a href={RESERVE_URL} className="rd-cta rd-cta-full">Reserve Now</a>
      </div>

      {isPhone ? (
        <IncludedSheet open={isPhone && sheetOpen} active={active} season={season} onSelect={select} onClose={closeSheet} />
      ) : null}
    </section>
  );
}
