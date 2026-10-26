"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { lockBody, unlockBody } from "@/lib/scroll-lock";
import { LegalEmbedProvider } from "@/components/legal/LegalLink";
import TermsContent from "@/components/legal/TermsContent";
import PrivacyContent from "@/components/legal/PrivacyContent";

type LegalDoc = "terms" | "privacy";

const isLegalDoc = (key: string): key is LegalDoc => key === "terms" || key === "privacy";

/**
 * Footer legal links (data-legal-modal="terms" | "privacy") open the document in an
 * in-page dialog. The copy is rendered inline (same components as the /terms-and-conditions
 * and /privacy-policy routes); links inside the copy are shown as plain text.
 */
export default function LegalModal() {
  const [doc, setDoc] = useState<LegalDoc | null>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const scrollY = useRef(0);
  const open = doc !== null;

  const openLegal = useCallback((key: LegalDoc, trigger?: HTMLElement | null) => {
    lastFocused.current = trigger || (document.activeElement as HTMLElement | null);
    scrollY.current = window.scrollY || window.pageYOffset || 0;
    setDoc(key);
    lockBody(scrollY.current);
  }, []);

  const close = useCallback(() => {
    setDoc(null);
    unlockBody(scrollY.current);
    if (lastFocused.current && lastFocused.current.focus) lastFocused.current.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    if (closeBtnRef.current && closeBtnRef.current.focus) closeBtnRef.current.focus();
  }, [open, doc]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const link = target && target.closest ? (target.closest("[data-legal-modal]") as HTMLElement | null) : null;
      if (!link) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const key = link.getAttribute("data-legal-modal") || "";
      if (!isLegalDoc(key)) return;
      e.preventDefault();
      openLegal(key, link);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [openLegal]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  return (
    <div
      className="vv-legal-modal"
      id="vv-legal-modal"
      role="dialog"
      aria-modal="true"
      aria-label={doc === "privacy" ? "Privacy Policy" : "Terms and Conditions"}
      hidden={!open}
    >
      <div className="vv-legal-modal__backdrop" data-legal-close onClick={close}></div>
      <div className="vv-legal-modal__panel" role="document">
        <button type="button" className="vv-legal-modal__close" data-legal-close aria-label="Close legal document" ref={closeBtnRef} onClick={close}>
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="vv-legal-modal__body" ref={bodyRef} tabIndex={-1}>
          <LegalEmbedProvider>
            {doc === "terms" && <TermsContent />}
            {doc === "privacy" && <PrivacyContent />}
          </LegalEmbedProvider>
        </div>
      </div>
    </div>
  );
}
