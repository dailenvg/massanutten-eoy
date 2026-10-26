"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { GALLERY_ITEMS } from "@/lib/gallery";
import { srcSetFor } from "@/lib/image-variants";
import { lockBody, unlockBody } from "@/lib/scroll-lock";
import { useModals } from "./ModalContext";

const SWIPE_MIN = 48;
/** Matches `.vv-gallery-modal__img { width: min(1500px, 94vw) }`. */
const MODAL_SIZES = "min(1500px, 94vw)";

/** Lightbox for the photo strip: prev/next, arrow keys, Escape, swipe, focus trap. */
export default function GalleryModal() {
  const { galleryRef } = useModals();
  const items = GALLERY_ITEMS;
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const scrollY = useRef(0);
  const swipe = useRef({ tracking: false, x: 0, y: 0 });

  const count = items.length;
  const wrap = useCallback((i: number) => ((i % count) + count) % count, [count]);
  const showAt = useCallback((i: number) => setIndex(wrap(i)), [wrap]);
  const step = useCallback((delta: number) => setIndex((i) => wrap(i + delta)), [wrap]);

  const openAt = useCallback(
    (i: number, trigger?: HTMLElement | null) => {
      lastFocused.current = trigger || (document.activeElement as HTMLElement | null);
      scrollY.current = window.scrollY || window.pageYOffset;
      showAt(i);
      setOpen(true);
      lockBody(scrollY.current);
    },
    [showAt],
  );

  const close = useCallback(() => {
    setOpen(false);
    unlockBody(scrollY.current);
    if (lastFocused.current && lastFocused.current.focus) lastFocused.current.focus();
  }, []);

  useEffect(() => {
    galleryRef.current = { openAt };
    return () => {
      galleryRef.current = null;
    };
  }, [galleryRef, openAt]);

  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close, step]);

  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !modalRef.current) return;
    const focusables = modalRef.current.querySelectorAll<HTMLElement>("button, [href], img[tabindex]");
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    // Focus that slipped outside the list (e.g. onto the dialog itself) re-enters at an end.
    if (!Array.from(focusables).includes(document.activeElement as HTMLElement)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onSwipeStart = (e: PointerEvent<HTMLDivElement>) => {
    if (!open || e.pointerType === "mouse") return;
    swipe.current = { tracking: true, x: e.clientX, y: e.clientY };
  };
  const onSwipeEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (!swipe.current.tracking || !open) return;
    swipe.current.tracking = false;
    const dx = e.clientX - swipe.current.x;
    const dy = e.clientY - swipe.current.y;
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return;
    step(dx < 0 ? 1 : -1);
  };
  const onSwipeCancel = () => {
    swipe.current.tracking = false;
  };

  const item = items[index];

  return (
    <div
      className="vv-gallery-modal"
      id="vv-gallery-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      hidden={!open}
      ref={modalRef}
      onKeyDown={trapFocus}
    >
      <div className="vv-gallery-modal__backdrop" data-gallery-close onClick={close}></div>
      <button type="button" className="vv-gallery-modal__nav vv-gallery-modal__prev" aria-label="Previous image" onClick={() => step(-1)}>
        <ChevronLeft aria-hidden="true" />
      </button>
      <button type="button" className="vv-gallery-modal__nav vv-gallery-modal__next" aria-label="Next image" onClick={() => step(1)}>
        <ChevronRight aria-hidden="true" />
      </button>
      <div
        className="vv-gallery-modal__panel"
        role="document"
        onPointerDown={onSwipeStart}
        onPointerUp={onSwipeEnd}
        onPointerCancel={onSwipeCancel}
      >
        <button type="button" className="vv-gallery-modal__close" data-gallery-close aria-label="Close image" ref={closeBtnRef} onClick={close}>
          <span aria-hidden="true">&times;</span>
        </button>
        <img className="vv-gallery-modal__img" src={open ? item.src : undefined} srcSet={open ? srcSetFor(item.src) : undefined} sizes={MODAL_SIZES} alt={open ? item.alt || item.caption || "" : ""} />
        <p className="vv-gallery-modal__caption" aria-live="polite">
          {open ? <span className="stb-sr">{`Image ${index + 1} of ${count}. `}</span> : null}
          {open ? item.caption || "" : ""}
        </p>
      </div>
    </div>
  );
}
