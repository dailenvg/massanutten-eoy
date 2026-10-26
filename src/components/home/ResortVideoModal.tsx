"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { lockBody, unlockBody } from "@/lib/scroll-lock";
import { RESORT_VIDEO_CAPTIONS } from "@/lib/offer";

/**
 * Full-screen resort tour player. Any element with the `.playvideo` class opens it
 * (hero play icon, "Resort video" menu item, resort-details thumbnail).
 * `src` is lib/offer RESORT_VIDEO_SRC; the page skips the player while it is null.
 *
 * Dialog behaviour (matches PhoneModal): focus moves to Close and is trapped
 * between the video controls and Close; Esc, Close and a backdrop click all
 * close it; focus returns to the trigger that opened it; the page is
 * scroll-locked. Playback only starts from that explicit click, never on load.
 */
export default function ResortVideoModal({ src }: { src: string }) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const scrollY = useRef(0);

  const openVideo = useCallback((trigger: HTMLElement | null) => {
    if (openRef.current) return;
    openRef.current = true;
    // The trigger, not activeElement: Safari does not focus links on click, so
    // activeElement would be <body> and focus would be lost on close.
    lastFocused.current = trigger ?? (document.activeElement as HTMLElement | null);
    scrollY.current = window.scrollY;
    lockBody(scrollY.current);
    setOpen(true);
    // Move focus into the dialog once it is visible.
    requestAnimationFrame(() => closeBtnRef.current?.focus());
    const video = videoRef.current;
    if (!video) return;
    if (!video.getAttribute("src")) video.src = src;
    const playing = video.play();
    if (playing && playing.catch) playing.catch(() => {});
  }, [src]);

  const closeVideo = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setOpen(false);
    unlockBody(scrollY.current);
    lastFocused.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!open) return;
    // Document-level so Esc and the trap still hold when focus has fallen to <body>.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeVideo();
        return;
      }
      if (e.key !== "Tab") return;
      const video = videoRef.current;
      const btn = closeBtnRef.current;
      if (!video || !btn) return;
      const active = document.activeElement;
      if (active !== video && active !== btn) {
        e.preventDefault();
        (e.shiftKey ? video : btn).focus();
      } else if (e.shiftKey && active === video) {
        e.preventDefault();
        btn.focus();
      } else if (!e.shiftKey && active === btn) {
        e.preventDefault();
        video.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeVideo]);

  useEffect(() => {
    const onClick = (e: Event) => {
      const target = e.target as Element | null;
      const trigger = target && typeof target.closest === "function" ? target.closest<HTMLElement>(".playvideo") : null;
      if (!trigger) return;
      e.preventDefault();
      openVideo(trigger);
    };
    const onVisibilityChange = () => {
      if (document.hidden) closeVideo();
    };
    document.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", closeVideo);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", closeVideo);
    };
  }, [openVideo, closeVideo]);

  return (
    <div
      className="w-layout-vflex resortvideo"
      style={open ? { display: "flex" } : undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Resort video"
      hidden={!open}
      // Backdrop click closes; clicks on the video or Close never reach here as the target.
      onClick={(e) => {
        if (e.target === e.currentTarget) closeVideo();
      }}
    >
      <div
        className="videowrapper"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeVideo();
        }}
      >
        <div className="code-embed w-embed">
          <video controls playsInline preload="none" id="video" style={{ width: "100%" }} ref={videoRef}>
            {RESORT_VIDEO_CAPTIONS ? <track kind="captions" src={RESORT_VIDEO_CAPTIONS} srcLang="en" label="English" default /> : null}
          </video>
        </div>
      </div>
      <button
        type="button"
        ref={closeBtnRef}
        className="videoclosebtn"
        aria-label="Close video"
        onClick={closeVideo}
        style={{
          background: "transparent",
          border: 0,
          padding: 0,
          minWidth: 44,
          minHeight: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          top: "env(safe-area-inset-top, 0px)",
          right: "env(safe-area-inset-right, 0px)",
        }}
      >
        <img src="/images/CloseButton.svg" alt="" aria-hidden="true" />
      </button>
    </div>
  );
}
