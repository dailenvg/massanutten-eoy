"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { lockBody, unlockBody } from "@/lib/scroll-lock";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { GUEST_STORIES } from "@/lib/guest-stories";
import { DUR_MICRO, EASE_OUT } from "@/lib/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useModals } from "./ModalContext";

const COUNT = GUEST_STORIES.length;
const wrap = (i: number) => (i + COUNT) % COUNT;

/** Guest video review player (opened from the "Stories From Recent Guests" cards). */
export default function VideoModal() {
  const { videoRef: videoHandleRef } = useModals();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const scrollY = useRef(0);
  const story = GUEST_STORIES[index];

  const teardown = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.removeAttribute("src");
    video.load();
  };

  const openVideo = useCallback((i: number, trigger?: HTMLElement | null) => {
    lastFocused.current = trigger || (document.activeElement as HTMLElement | null);
    scrollY.current = window.scrollY || window.pageYOffset;
    setIndex(wrap(i));
    setOpen(true);
    lockBody(scrollY.current);
  }, []);

  const close = useCallback(() => {
    teardown();
    setOpen(false);
    unlockBody(scrollY.current);
    if (lastFocused.current && lastFocused.current.focus) lastFocused.current.focus();
  }, []);

  const step = useCallback((dir: 1 | -1) => setIndex((i) => wrap(i + dir)), []);

  // Load and play whenever the modal opens or the story changes.
  useEffect(() => {
    const video = videoRef.current;
    if (!open || !video) return;
    video.src = GUEST_STORIES[index].src;
    const playing = video.play();
    if (playing && playing.catch) playing.catch(() => { /* autoplay blocked; controls remain */ });
  }, [open, index]);

  useEffect(() => {
    videoHandleRef.current = { open: openVideo };
    return () => {
      videoHandleRef.current = null;
    };
  }, [videoHandleRef, openVideo]);

  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      // Arrow keys seek inside the native player, so only page stories elsewhere.
      if (e.target instanceof HTMLVideoElement) return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close, step]);

  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !modalRef.current) return;
    const f = modalRef.current.querySelectorAll<HTMLElement>("button, video");
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const prev = GUEST_STORIES[wrap(index - 1)];
  const next = GUEST_STORIES[wrap(index + 1)];

  return (
    <div
      className="vv-video-modal"
      id="vv-video-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vv-video-modal-name"
      aria-describedby="vv-video-modal-desc"
      hidden={!open}
      ref={modalRef}
      onKeyDown={trapFocus}
    >
      <div className="vv-video-modal__backdrop" data-video-close onClick={close}></div>
      <div className="vv-video-modal__panel" role="document">
        <button type="button" className="vv-video-modal__close" data-video-close aria-label="Close video" ref={closeBtnRef} onClick={close}>
          <span aria-hidden="true">&times;</span>
        </button>
        <video className="vv-video-modal__video" id="vv-testimonial-video" controls playsInline poster={story.poster} ref={videoRef}></video>
        <div className="vv-video-modal__info">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={story.id}
              className="vv-video-modal__caption"
              initial={{ opacity: 0, y: reduced ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduced ? 0 : -8 }}
              transition={{ duration: reduced ? 0 : DUR_MICRO, ease: EASE_OUT }}
            >
              <p className="vv-video-modal__name" id="vv-video-modal-name">
                {story.name}
                <span className="vv-video-modal__place"> · {story.place}</span>
              </p>
              <p className="vv-video-modal__desc" id="vv-video-modal-desc">{story.description}</p>
            </motion.div>
          </AnimatePresence>
          <div className="vv-video-modal__nav">
            <button type="button" className="vv-video-modal__step" onClick={() => step(-1)} aria-label={`Previous video: ${prev.name}`}>
              <ChevronLeft aria-hidden="true" />
            </button>
            <span className="vv-video-modal__count" aria-live="polite" aria-atomic="true">
              <span className="sr-only">Video </span>{index + 1} of {COUNT}
            </span>
            <button type="button" className="vv-video-modal__step" onClick={() => step(1)} aria-label={`Next video: ${next.name}`}>
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
