@AGENTS.md

# Quality Guardrails — Read Before You Build

These are non-negotiable standards for any UI work in this project. They exist so
that what we ship matches the design intent, works across devices, and is
accessible by default. **Nothing merges, and no feature is considered "done",
until it passes every applicable check below.**

Two rules frame everything else:

1. **No unapproved design decisions.** If a design, spec, or handoff is ambiguous,
   incomplete, or missing states/breakpoints, do **not** improvise or "fill the gap"
   with your own interpretation. Flag it, list the specific missing items, and get a
   decision before coding that piece. Guessing is how we ship the wrong thing.
2. **QA is a gate, not an opinion.** The checklist below is the objective bar. Work
   that fails any item goes back with the specific failing items flagged — it does not
   get merged "to fix later".

## 1. Responsive Breakpoints

All UI must be fully responsive and tested as *fluid resizing*, not just at the exact
reference widths. Test the whole range, including the awkward in-between widths.

Reference breakpoints:

- **Mobile floor:** iPhone SE — 375px. Nothing may break below this; 375px is the
  smallest width we support.
- **Tablet:** iPad Mini — 768px.
- **Desktop:** 1024px, 1440px, and 2560px.

At every width from 375px up:

- No horizontal scroll.
- No overlapping elements.
- No cut-off or clipped text.
- No content that disappears off-screen or under fixed bars.

In this stack, prefer Tailwind's responsive utilities and fluid layout primitives
(flex/grid, `min-w-0`, `clamp()`, container queries where appropriate) over fixed
pixel widths. Avoid hard-coded heights on text containers.

## 2. Layout & Spacing

- **8pt grid.** All padding, margins, and gaps are multiples of **8** (use **4** only
  when 8 is genuinely too large). Do not invent one-off spacing values. Map these to
  the project's Tailwind spacing scale rather than arbitrary `[13px]`-style values.
- **Alignment.** Elements that sit on the same visual axis must actually align — verify,
  don't eyeball. Shared edges, baselines, and centers line up.
- **Type scale.** Headings and body text use a single consistent type scale across all
  pages. No page-specific one-off font sizes. Reuse the defined scale/tokens.

## 3. Interactive States

Anything that looks interactive must behave interactively — **nothing that looks
clickable can be dead.**

- Every button and link wires **all** applicable states: default, hover, active,
  focus (visible), and disabled.
- Buttons are wired to their actual functionality unless the spec explicitly says
  otherwise (e.g. "visual only for now").
- Forms include validation states, inline error messages, and success states.
- Loading/pending and empty states are handled, not left blank.

## 4. Animations & Motion

- All animations work correctly on **every** breakpoint, not just desktop.
- No animation may break layout, cause jank/dropped frames, or block interaction.
- Respect `prefers-reduced-motion` — provide a reduced or no-motion path for users who
  request it. Do not ship motion that ignores this.

## 5. Accessibility — WCAG 2.2 AA

This is a floor, not a nice-to-have.

- **Contrast:** text contrast ≥ **4.5:1** (≥ **3:1** for large text ≥ 24px, or ≥ 18.66px
  bold).
- **Touch targets:** minimum **44×44px** on mobile.
- **Keyboard:** every interactive element is reachable and operable by keyboard, with a
  **visible focus state**. Focus order is logical; no keyboard traps.
- **Images:** all meaningful images have descriptive `alt` text; decorative images use
  empty `alt=""`.
- **Forms:** every field has an associated `<label>` (or equivalent accessible name).
  Errors are announced, not color-only.
- Use semantic HTML first; reach for ARIA only when semantics can't express it.

## 6. Performance & Technical

- **Images optimized:** export correctly sized, use modern formats (WebP/AVIF where
  possible), and lean on `next/image`. No unoptimized multi-MB hero images.
- **No console errors** in the browser console (and no unhandled warnings we introduced).
- **No layout shift on load** — reserve space for images/embeds/fonts (CLS ≈ 0).
- **Cross-browser:** tested on **Chrome and Safari** at minimum before handoff.

## Definition of Done (self-QA before you request review)

Before marking any UI work ready, confirm you have personally verified:

- [ ] Fluid-resizes cleanly from 375px through 2560px — no h-scroll, overlap, or clipping.
- [ ] Spacing on the 8pt grid; alignment and type scale consistent.
- [ ] All interactive elements have every applicable state wired; nothing dead.
- [ ] Animations work on all breakpoints and honor `prefers-reduced-motion`.
- [ ] WCAG 2.2 AA: contrast, 44×44 targets, visible focus, alt text, labeled fields.
- [ ] Images optimized; no console errors; no layout shift; verified in Chrome + Safari.

If any item can't be met because of a gap in the design/spec, **stop and flag it** with
the specific missing items rather than guessing.

## Reference Standards

Design and build to the same shared bar:

- Nielsen Norman Group — 10 Usability Heuristics
- WCAG 2.2 AA
- The 8pt grid system

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
