"use client";

import Link from "next/link";
import { ChevronRight } from "@/lib/icons";
import { FLOW } from "@/lib/site";
import { useFlowHref } from "@/lib/use-flow-router";

/**
 * Stepper across the top of the left panel (Figma node 11:6766).
 *
 * The comp draws two states only — accent for the step you are on, neutral
 * grey for the other — so a step you have already finished is drawn in the
 * neutral state rather than getting a "done" treatment the file does not
 * define. It is a link back, which is the same affordance as the Booking
 * Summary's Edit button; the step you are on is plain text, and `aria-current`
 * carries that to assistive tech.
 */
const STEPS = [
  { n: 1, label: "General info", href: FLOW.general },
  { n: 2, label: "Payment info", href: FLOW.payment },
] as const;

export default function FlowSteps({ current }: { current: 1 | 2 }) {
  const flowHref = useFlowHref();
  return (
    <nav className="fsteps" aria-label="Checkout progress">
      <ol className="fsteps-list">
        {STEPS.map((step, i) => {
          const active = step.n === current;
          const done = step.n < current;
          const cls = `fsteps-step${active ? " is-active" : ""}`;
          const inner = (
            <>
              <span className="fsteps-num" aria-hidden="true">{step.n}</span>
              <span className="fsteps-label">{step.label}</span>
            </>
          );
          return (
            <li className="fsteps-item" key={step.n}>
              {done ? (
                <Link className={cls} href={flowHref(step.href)}>{inner}</Link>
              ) : (
                <span className={cls} aria-current={active ? "step" : undefined}>{inner}</span>
              )}
              {i < STEPS.length - 1 ? <ChevronRight className="fsteps-sep" aria-hidden={true} /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
