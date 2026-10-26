"use client";

import { createContext, useContext, useMemo, useRef, type ReactNode, type RefObject } from "react";

export type GalleryHandle = { openAt: (index: number, trigger?: HTMLElement | null) => void };
/** Opens the guest story at `index` in GUEST_STORIES. */
export type VideoHandle = { open: (index: number, trigger?: HTMLElement | null) => void };
export type PhoneHandle = { open: (trigger?: HTMLElement | null) => void };

type ModalRefs = {
  galleryRef: RefObject<GalleryHandle | null>;
  videoRef: RefObject<VideoHandle | null>;
  phoneRef: RefObject<PhoneHandle | null>;
};

const ModalContext = createContext<ModalRefs | null>(null);

/**
 * Shares imperative handles between the triggers (photo strip tiles, guest story cards,
 * "Book by phone" buttons) and the modals that own the UI state. Children stay server components.
 */
export function HomeInteractive({ children }: { children: ReactNode }) {
  const galleryRef = useRef<GalleryHandle | null>(null);
  const videoRef = useRef<VideoHandle | null>(null);
  const phoneRef = useRef<PhoneHandle | null>(null);
  const value = useMemo(() => ({ galleryRef, videoRef, phoneRef }), []);
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModals(): ModalRefs {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModals must be used inside <HomeInteractive>");
  return ctx;
}
