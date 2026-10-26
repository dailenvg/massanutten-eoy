"use client";

import { useRef, useState } from "react";
import { useFlowRouter } from "@/lib/use-flow-router";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { CalendarBlank, ChevronRight, Timer } from "@/lib/icons";
import FieldError from "./FieldError";
import FlowSteps from "./FlowSteps";
import { useBooking } from "@/lib/booking-store";
import { fmtShort } from "@/lib/booking";
import { ROOM_TYPE } from "@/lib/offer";
import { FLOW } from "@/lib/site";
import { TWEEN_COMPONENT } from "@/lib/motion";
import DateRangeCalendar from "./DateRangeCalendar";

/**
 * Step 1 — General Information + preferred dates (Figma 137:1920).
 * Left: name, email, phone, travellers, consent, Continue, trust seals.
 * Right: "Know your preferred dates?" toggle and the two-month calendar.
 */
type Errors = Partial<Record<"firstName" | "lastName" | "email" | "phone" | "consent" | "checkIn", string>>;

const digits = (v: string) => v.replace(/\D/g, "");
const formatPhone = (v: string) => {
  const d = digits(v).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

const CONSENT =
  "By clicking here you agree to the Terms & Conditions, Privacy Policy and consent to receive promotional emails, SMS texts and calls, including pre-recorded messages and/or calls or texts made from an Auto-dial telephone dialing system from Sogno Tours, LLC d/b/a VacationVIP.com, and its affiliates, parents and subsidiaries (text/data and other charges may apply) at the address/numbers provided regardless of that number being on any Do not Call Registry. Your consent is not a condition of any purchase.";

export default function Step1General({ urgency }: { urgency: string }) {
  const router = useFlowRouter();
  const reduced = useReducedMotion();
  const { booking, setGuest } = useBooking();
  const g = booking.guest;
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const alertRef = useRef<HTMLParagraphElement>(null);

  /* The hold starts the moment the guest lands on step 1. */

  const validate = (): Errors => {
    const e: Errors = {};
    if (!g.firstName.trim()) e.firstName = "Enter your first name.";
    if (!g.lastName.trim()) e.lastName = "Enter your last name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(g.email.trim())) e.email = "Enter a valid email address.";
    if (digits(g.phone).length !== 10) e.phone = "Enter a 10-digit phone number.";
    if (g.knowsDates && !g.checkIn) e.checkIn = "Pick your preferred check-in date, or switch to No.";
    if (!consent) e.consent = "Please agree to continue.";
    return e;
  };

  const blur = (k: keyof Errors) => () => setErrors((prev) => ({ ...prev, [k]: validate()[k] }));

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setFormError("Please fix the highlighted fields and try again.");
      window.requestAnimationFrame(() => alertRef.current?.focus());
      return;
    }
    setFormError("");
    router.push(FLOW.payment);
  };

  const v = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: TWEEN_COMPONENT } }
    : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: TWEEN_COMPONENT } };

  const field = (
    k: "firstName" | "lastName" | "email",
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div className="fld">
      <label className="fld-label" htmlFor={`g-${k}`}>{label}</label>
      <input
        id={`g-${k}`}
        className={`fld-input${errors[k] ? " is-invalid" : ""}`}
        value={g[k]}
        onChange={(e) => { setGuest({ [k]: e.target.value }); if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined })); }}
        onBlur={blur(k)}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? `g-${k}-err` : undefined}
        {...props}
      />
      {errors[k] ? <FieldError id={`g-${k}-err`}>{errors[k]}</FieldError> : null}
    </div>
  );

  return (
    <form className="s1" onSubmit={submit} noValidate>
      <motion.section className="fcard s1-left" variants={v} initial="hidden" animate="show" aria-labelledby="s1-info">
        <FlowSteps current={1} />
        <h2 className="fcard-title" id="s1-info">General Information</h2>
        <div className="fld-stack">
          {field("firstName", "First Name", { autoComplete: "given-name", placeholder: "John" })}
          {field("lastName", "Last Name", { autoComplete: "family-name", placeholder: "Smith" })}
          {field("email", "Email", { type: "email", autoComplete: "email", placeholder: "johnsmith@gmail.com" })}
          <div className="fld">
            <label className="fld-label" htmlFor="g-phone">Phone</label>
            <input
              id="g-phone"
              className={`fld-input${errors.phone ? " is-invalid" : ""}`}
              value={g.phone}
              onChange={(e) => { setGuest({ phone: formatPhone(e.target.value) }); if (errors.phone) setErrors((p) => ({ ...p, phone: undefined })); }}
              onBlur={blur("phone")}
              inputMode="tel"
              autoComplete="tel"
              placeholder="(123) 456-7890"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? "g-phone-err" : undefined}
            />
            {errors.phone ? <FieldError id={"g-phone-err"}>{errors.phone}</FieldError> : null}
          </div>
        </div>

        <h2 className="fcard-title">How Many Traveling</h2>
        <div className="fld-row">
          <div className="fld">
            <label className="fld-label" htmlFor="g-adults">Adults</label>
            <select id="g-adults" className="fld-input fld-select" value={g.adults} onChange={(e) => setGuest({ adults: Number(e.target.value) })}>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="fld">
            <label className="fld-label" htmlFor="g-kids">Kids</label>
            <select id="g-kids" className="fld-input fld-select" value={g.kids} onChange={(e) => setGuest({ kids: Number(e.target.value) })}>
              {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <p className="fld-hint">The {ROOM_TYPE} sleeps up to 4 guests.</p>

        <div className="consent">
          <input id="g-consent" type="checkbox" className="fld-checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setErrors((p) => ({ ...p, consent: undefined })); }} aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? "g-consent-err" : undefined} />
          <label htmlFor="g-consent">
            {CONSENT} As an alternative to the consent above you may enter the Promotion <a href="/terms-and-conditions" target="_blank" rel="noopener">here</a>.
          </label>
        </div>
        {errors.consent ? <FieldError id={"g-consent-err"}>{errors.consent}</FieldError> : null}

        <p className={`form-error${formError ? " is-shown" : ""}`} role="alert" tabIndex={-1} ref={alertRef}>{formError}</p>

        <button type="submit" className="fbtn fbtn--primary fbtn--wide">Continue <ChevronRight aria-hidden={true} /></button>

        <div className="seals" aria-hidden="true">
          <img src="/images/badge-01.svg" alt="" width={80} height={80} loading="lazy" />
          <img src="/images/badge-02.svg" alt="" width={80} height={80} loading="lazy" />
          <img src="/images/shared/badge-03.webp" alt="" width={80} height={80} loading="lazy" />
        </div>
        <p className="urgency"><Timer className="ic-inline" aria-hidden={true} />{urgency}</p>
      </motion.section>

      <motion.section className={`fcard s1-right${g.knowsDates ? " is-open" : ""}`} variants={v} initial="hidden" animate="show" aria-labelledby="s1-dates">
        <div className="dates-head">
          <h2 className="fcard-title" id="s1-dates">Know Your Preferred Dates?</h2>
          <button
            type="button"
            role="switch"
            aria-checked={g.knowsDates}
            className={`toggle${g.knowsDates ? " is-on" : ""}`}
            onClick={() => setGuest({ knowsDates: !g.knowsDates })}
          >
            <span className="toggle-knob" aria-hidden="true" />
            <span className="toggle-text">{g.knowsDates ? "Yes" : "No"}</span>
          </button>
        </div>

        {g.knowsDates ? (
          <>
            <DateRangeCalendar checkIn={g.checkIn} extraNights={booking.addons.extraNights} onChange={(iso) => { setGuest({ checkIn: iso }); setErrors((p) => ({ ...p, checkIn: undefined })); }} />
            {errors.checkIn ? <FieldError>{errors.checkIn}</FieldError> : null}
            <div className="dates-summary">
              <div><span>Check-In</span><b>{fmtShort(g.checkIn)}</b></div>
              <div><span>Check-Out</span><b>{fmtShort(g.checkOut)}</b></div>
            </div>
          </>
        ) : (
          <p className="dates-flex"><CalendarBlank className="ic-inline" aria-hidden={true} />You&apos;ll have 12 months to travel. Your dates are flexible, and a vacation agent will help you book them.</p>
        )}
      </motion.section>
    </form>
  );
}
