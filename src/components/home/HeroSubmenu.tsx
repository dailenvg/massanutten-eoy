"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import { CalendarCheck, ChevronLeft, ChevronRight } from "@/lib/icons";
import { RESERVE_URL } from "@/lib/site";
import { RESORT_VIDEO_SRC } from "@/lib/offer";
import { SPRING, TWEEN_COMPONENT } from "@/lib/motion";
import PhoneTrigger from "./PhoneTrigger";

/**
 * Sticky section menu: "is-stuck" styling via a sentinel + IntersectionObserver,
 * active-section highlighting on scroll, and (below 992px) a horizontally
 * scrolling pill row with prev/next arrows that keeps the active pill in view.
 */
export default function HeroSubmenu() {
  const navRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  /*
    The stuck state drives two things: the existing "is-stuck" class the CSS
    keys off, and the VIP mark, which only exists while the nav is pinned (the
    full logo is already visible in the header before that point).
  */
  const [stuck, setStuck] = useState(false);
  const reduceMotion = useReducedMotion();
  const reduceMotionRef = useRef(reduceMotion);
  useEffect(() => {
    reduceMotionRef.current = reduceMotion;
  }, [reduceMotion]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const on = <K extends keyof WindowEventMap>(
      target: Window | HTMLElement,
      type: K | string,
      handler: EventListener,
      opts?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, handler, opts);
      cleanups.push(() => target.removeEventListener(type, handler, opts));
    };

    const nav = navRef.current;
    const sentinel = sentinelRef.current;
    if (!nav || !sentinel || !("IntersectionObserver" in window)) return () => cleanups.forEach((fn) => fn());

    const io = new IntersectionObserver(
      (entries) => {
        const isStuck = !entries[0].isIntersecting;
        nav.classList.toggle("is-stuck", isStuck);
        setStuck(isStuck);
      },
      { threshold: 0 },
    );
    io.observe(sentinel);
    cleanups.push(() => io.disconnect());

    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('.menul2item[href^="#"]'));
    const byId: Record<string, HTMLAnchorElement> = {};
    const targets: HTMLElement[] = [];
    links.forEach((link) => {
      const hash = link.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const sec = document.querySelector<HTMLElement>(hash);
      if (sec) {
        byId[sec.id] = link;
        targets.push(sec);
      }
    });
    if (!targets.length) return () => cleanups.forEach((fn) => fn());

    let ticking = false;
    function updateActive() {
      ticking = false;
      const line = (nav!.offsetHeight || 56) + 8; // just below the sticky nav
      let activeId: string | null = null;
      targets.forEach((sec) => {
        if (sec.getBoundingClientRect().top <= line) activeId = sec.id;
      });
      links.forEach((l) => {
        l.classList.remove("active");
        l.removeAttribute("aria-current");
      });
      if (activeId && byId[activeId]) {
        byId[activeId].classList.add("active");
        byId[activeId].setAttribute("aria-current", "location");
      }
    }
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActive);
      }
    }
    on(window, "scroll", onScroll, { passive: true });
    on(window, "resize", onScroll, { passive: true });
    updateActive();

    const scroller = nav.querySelector<HTMLElement>(".hero-submenu-scroll");
    const prevBtn = nav.querySelector<HTMLButtonElement>(".hero-submenu-arrow--prev");
    const nextBtn = nav.querySelector<HTMLButtonElement>(".hero-submenu-arrow--next");
    if (scroller && prevBtn && nextBtn) {
      function updateArrows() {
        const max = scroller!.scrollWidth - scroller!.clientWidth;
        const atStart = scroller!.scrollLeft <= 1;
        const atEnd = scroller!.scrollLeft >= max - 1;
        prevBtn!.disabled = atStart;
        nextBtn!.disabled = atEnd;
        scroller!.classList.toggle("at-start", atStart);
        scroller!.classList.toggle("at-end", atEnd);
      }
      function step(dir: number) {
        scroller!.scrollBy({ left: dir * Math.round(scroller!.clientWidth * 0.75), behavior: reduceMotionRef.current ? "auto" : "smooth" });
      }
      on(prevBtn, "click", () => step(-1));
      on(nextBtn, "click", () => step(1));
      let aTick = false;
      on(
        scroller,
        "scroll",
        () => {
          if (!aTick) {
            aTick = true;
            requestAnimationFrame(() => {
              aTick = false;
              updateArrows();
            });
          }
        },
        { passive: true },
      );
      on(window, "resize", updateArrows, { passive: true });
      updateArrows();

      /*
        Whenever the active pill changes, centre it in the scroller. Measured
        against the scroller's own box (not offsetLeft, which is relative to
        the nav and includes the logo and arrow), and done unconditionally so a
        pill half-hidden under the edge fade is pulled fully into view too.
      */
      let lastActive: Element | null = null;
      function centerActive() {
        const act = nav!.querySelector<HTMLElement>(".menul2item.active");
        if (!act || act === lastActive) return;
        lastActive = act;
        if (scroller!.scrollWidth <= scroller!.clientWidth) return;
        const sBox = scroller!.getBoundingClientRect();
        const aBox = act.getBoundingClientRect();
        const left = scroller!.scrollLeft + (aBox.left - sBox.left) - (sBox.width - aBox.width) / 2;
        scroller!.scrollTo({ left: Math.max(0, left), behavior: reduceMotionRef.current ? "auto" : "smooth" });
      }
      on(window, "scroll", () => requestAnimationFrame(centerActive), { passive: true });
      on(window, "resize", () => { lastActive = null; requestAnimationFrame(centerActive); }, { passive: true });
      requestAnimationFrame(centerActive);
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      {/* Sentinel: when it leaves the viewport the nav is stuck to the top. */}
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 0, width: "100%" }} />
      <nav className="hero-submenu" ref={navRef}>
        <div className="hero-submenu-inner">
          <AnimatePresence initial={false}>
            {stuck && (
              <motion.button
                key="nav-vip-mark"
                type="button"
                className="nav-vip-mark"
                aria-label="Back to top"
                onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, width: 0, scale: 0.8 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, width: 48, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, width: 0, scale: 0.8 }}
                transition={reduceMotion ? { duration: 0 } : { opacity: TWEEN_COMPONENT, width: SPRING, scale: SPRING }}
              >
                <Image src="/images/vip-icon.svg" alt="" width={24} height={20} priority={false} />
              </motion.button>
            )}
          </AnimatePresence>
          <button type="button" className="hero-submenu-arrow hero-submenu-arrow--prev" aria-label="Scroll menu left"><ChevronLeft aria-hidden="true" /></button>
          <div className="hero-submenu-scroll">
            <div className="hero-submenu-track">
              {RESORT_VIDEO_SRC ? <a href="#" className="menul2item playvideo">Resort video</a> : null}
              <a href="#whatYouGet" className="menul2item">What you get</a>
              <a href="#resort-details" className="menul2item">Resort details</a>
              <a href="#everything-included" className="menul2item">Included</a>
              <a href="#guest-reviews" className="menul2item">Guest reviews</a>
              <a href="#bonus-cta" className="menul2item">BONUS</a>
            </div>
          </div>
          <button type="button" className="hero-submenu-arrow hero-submenu-arrow--next" aria-label="Scroll menu right"><ChevronRight aria-hidden="true" /></button>
          <span className="hero-submenu-div" aria-hidden="true"></span>
          <PhoneTrigger variant="nav" /><a href={RESERVE_URL} className="menul2item checkout-cta nav-variant"><CalendarCheck aria-hidden="true" />Reserve it now</a>
        </div>
      </nav>
    </>
  );
}
