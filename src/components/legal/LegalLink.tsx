"use client";

import { createContext, useContext, type AnchorHTMLAttributes, type ReactNode } from "react";

/** True when the legal copy is rendered inside the home page modal: links become plain text. */
const LegalEmbedContext = createContext(false);

export function LegalEmbedProvider({ children }: { children: ReactNode }) {
  return <LegalEmbedContext.Provider value={true}>{children}</LegalEmbedContext.Provider>;
}

export function LegalLink({ href, target, rel, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const embedded = useContext(LegalEmbedContext);
  if (embedded) return <a {...rest}>{children}</a>;
  return (
    <a href={href} target={target} rel={rel} {...rest}>
      {children}
    </a>
  );
}
