"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Full-screen resort tour player. Any element with the `.playvideo` class opens it
 * (hero play icon, "Resort video" menu item, resort-details thumbnail).
 * `src` is lib/offer RESORT_VIDEO_SRC; the page skips the player while it is null.
 */
export default function ResortVideoModal({ src }: { src: string }) {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const openVideo = useCallback(() => {
    lastFocused.current = document.activeElement as HTMLElement | null;
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
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    setOpen((wasOpen) => {
      if (wasOpen) lastFocused.current?.focus?.();
      return false;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeVideo]);

  useEffect(() => {
    const onClick = (e: Event) => {
      const target = e.target as Element | null;
      if (!target || !target.closest || !target.closest(".playvideo")) return;
      e.preventDefault();
      openVideo();
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
      onKeyDown={(e) => {
        // Only two focusables (video controls, close): keep Tab inside the dialog.
        if (e.key !== "Tab") return;
        const video = videoRef.current;
        const btn = closeBtnRef.current;
        if (!video || !btn) return;
        if (e.shiftKey && document.activeElement === video) {
          e.preventDefault();
          btn.focus();
        } else if (!e.shiftKey && document.activeElement === btn) {
          e.preventDefault();
          video.focus();
        }
      }}
    >
      <div className="videowrapper">
        <div className="code-embed w-embed">
          <video controls id="video" style={{ width: "100%" }} ref={videoRef}></video>
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
