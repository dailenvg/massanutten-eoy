"use client";

import { useEffect, useRef, useState } from "react";
import { useFlowRouter } from "@/lib/use-flow-router";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { CheckCircle, ChevronRight, CreditCard, FlameSolid, LockKey, PencilSimple } from "@/lib/icons";
import FieldError from "./FieldError";
import { useBooking } from "@/lib/booking-store";
import { PRICES, TAX_NOTE, fmtDate, money } from "@/lib/booking";
import { NIGHTS_LABEL, ROOM_TYPE } from "@/lib/offer";
import { FLOW } from "@/lib/site";
import { TWEEN_COMPONENT } from "@/lib/motion";
import FlowSteps from "./FlowSteps";
import { splitClock, useHoldRemaining } from "./HoldTimer";
import ProtectionModal from "./ProtectionModal";

/**
 * Step 2: Payment Method (Figma 137:2579). Right column: hold sentence, Price
 * Details, Booking Summary from step 1 with an Edit link back.
 *
 * ⚠️ PROTOTYPE: confirmed as the intent for now. The card fields are not
 * connected to a processor; nothing is charged, sent or stored, and they carry
 * autoComplete="off" so the browser does not offer a saved card. Going live
 * means swapping the three card inputs for the PSP's hosted fields and putting
 * the charge in `submit()`.
 */
const STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

type F = { cardName: string; address: string; city: string; state: string; zip: string; cardNumber: string; expiry: string; cvc: string };
type Errors = Partial<Record<keyof F | "terms", string>>;
const EMPTY: F = { cardName: "", address: "", city: "", state: "Florida", zip: "", cardNumber: "", expiry: "", cvc: "" };
const digits = (v: string) => v.replace(/\D/g, "");
const formatCard = (v: string) => digits(v).slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (v: string) => { const d = digits(v).slice(0, 4); return d.length <= 2 ? d : `${d.slice(0, 2)} / ${d.slice(2)}`; };

function luhn(n: string) {
  const d = digits(n); if (d.length < 13 || d.length > 19) return false;
  let sum = 0, dbl = false;
  for (let i = d.length - 1; i >= 0; i--) { let x = Number(d[i]); if (dbl) { x *= 2; if (x > 9) x -= 9; } sum += x; dbl = !dbl; }
  return sum % 10 === 0;
}

function validate(f: F, terms: boolean): Errors {
  const e: Errors = {};
  if (!f.cardName.trim()) e.cardName = "Enter the name exactly as it appears on your card.";
  if (!f.address.trim()) e.address = "Enter your billing address.";
  if (!f.city.trim()) e.city = "Enter your city.";
  if (!/^\d{5}(-\d{4})?$/.test(f.zip.trim())) e.zip = "Enter a 5-digit ZIP code.";
  if (!luhn(f.cardNumber)) e.cardNumber = "Check your card number.";
  const [mm, yy] = f.expiry.split("/").map((s) => s.trim()); const m = Number(mm), y = Number(yy);
  if (!mm || !yy || m < 1 || m > 12 || Number.isNaN(y)) e.expiry = "Use MM / YY.";
  else if (new Date(2000 + y, m, 0, 23, 59, 59) < new Date()) e.expiry = "This card has expired.";
  if (digits(f.cvc).length < 3) e.cvc = "3 or 4 digits.";
  if (!terms) e.terms = "Please accept the Terms & Conditions to continue.";
  return e;
}

/**
 * All four are monochrome knockout card tiles on the same 39.67 x 28 box.
 * Discover was supplied as a full-colour wordmark and was rebuilt to match.
 */
const CARD_BRANDS = [
  { name: "Visa", src: "/images/shared/card-visa.svg" },
  { name: "Mastercard", src: "/images/shared/card-mastercard.svg" },
  { name: "American Express", src: "/images/shared/card-amex.svg" },
  { name: "Discover", src: "/images/shared/card-discover.svg" },
] as const;

export default function Step2Payment() {
  const router = useFlowRouter();
  const reduced = useReducedMotion();
  const { booking, ready, setAddon, markPaid } = useBooking();
  const g = booking.guest;
  const [f, setF] = useState<F>(EMPTY);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [showProtection, setShowProtection] = useState(false);
  const alertRef = useRef<HTMLParagraphElement>(null);
  const left = useHoldRemaining();
  const { hh, mm, ss } = splitClock(left);

  /* Step 1 is the only way to get name and email into the summary. */
  useEffect(() => { if (ready && !g.email) router.replace(FLOW.general); }, [ready, g.email, router]);

  const set = (k: keyof F) => (v: string) => { setF((p) => ({ ...p, [k]: v })); if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined })); };
  const blur = (k: keyof F) => () => setErrors((p) => ({ ...p, [k]: validate(f, terms)[k] }));

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(f, terms); setErrors(e);
    if (Object.keys(e).length) { setFormError("Please fix the highlighted fields and try again."); window.requestAnimationFrame(() => alertRef.current?.focus()); return; }
    setFormError("");
    /* A real PSP charge goes here, via a token from hosted fields, never `f`. */
    markPaid();
    setShowProtection(true);
  };

  const onProtection = (accepted: boolean) => { setAddon("protection", accepted); setShowProtection(false); router.push(FLOW.extend); };

  const v = reduced ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: TWEEN_COMPONENT } } : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: TWEEN_COMPONENT } };

  const input = (k: keyof F, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, hint?: string) => (
    <div className="fld">
      <label className="fld-label" htmlFor={`p-${k}`}>{label}</label>
      <input id={`p-${k}`} className={`fld-input${errors[k] ? " is-invalid" : ""}`} value={f[k]} onChange={(e) => set(k)(e.target.value)} onBlur={blur(k)} aria-invalid={errors[k] ? true : undefined} aria-describedby={[errors[k] ? `p-${k}-err` : null, hint ? `p-${k}-hint` : null].filter(Boolean).join(" ") || undefined} {...props} />
      {hint ? <p className="fld-hint" id={`p-${k}-hint`}>{hint}</p> : null}
      {errors[k] ? <FieldError id={`p-${k}-err`}>{errors[k]}</FieldError> : null}
    </div>
  );

  return (
    <>
      <form className="s2" onSubmit={submit} noValidate>
        <motion.section className="fcard s2-left" variants={v} initial="hidden" animate="show" aria-labelledby="s2-pay">
          <FlowSteps current={2} />
          <div className="s2-head">
            <h2 className="fcard-title" id="s2-pay">Payment Method</h2>
            <ul className="s2-cards" aria-label="Cards we accept">
              {CARD_BRANDS.map(({ name, src }) => (
                <li key={name}>
                  <img className="s2-card" src={src} alt={name} width={40} height={28} loading="lazy" decoding="async" />
                </li>
              ))}
            </ul>
          </div>
          <div className="fld-stack">
            {input("cardName", "Name on card", { autoComplete: "off", placeholder: "Jane Smith Doe" }, "Exactly as it appears on the card.")}
            {input("address", "Billing address", { autoComplete: "billing street-address", placeholder: "123 Main St" })}
            <div className="fld-row fld-row--three">
              {input("city", "City", { autoComplete: "billing address-level2", placeholder: "Harrisonburg" })}
              <div className="fld">
                <label className="fld-label" htmlFor="p-state">State</label>
                <select id="p-state" className="fld-input fld-select" value={f.state} onChange={(e) => set("state")(e.target.value)} autoComplete="billing address-level1">{STATES.map((s) => <option key={s}>{s}</option>)}</select>
              </div>
              {input("zip", "ZIP code", { autoComplete: "billing postal-code", inputMode: "numeric", placeholder: "29577" })}
            </div>
            <h3 className="fld-group-title">Card details</h3>
            <div className="fld">
              <label className="fld-label" htmlFor="p-cardNumber">Card number</label>
              <div className="fld-with-icon">
                <CreditCard className="fld-icon" aria-hidden={true} />
                <input id="p-cardNumber" className={`fld-input fld-input--icon${errors.cardNumber ? " is-invalid" : ""}`} value={f.cardNumber} onChange={(e) => set("cardNumber")(formatCard(e.target.value))} onBlur={blur("cardNumber")} inputMode="numeric" autoComplete="off" placeholder="1234 5678 9012 3456" aria-invalid={errors.cardNumber ? true : undefined} aria-describedby={errors.cardNumber ? "p-cardNumber-err" : undefined} />
              </div>
              {errors.cardNumber ? <FieldError id={"p-cardNumber-err"}>{errors.cardNumber}</FieldError> : null}
            </div>
            <div className="fld-row">
              <div className="fld">
                <label className="fld-label" htmlFor="p-expiry">Exp. date</label>
                <input id="p-expiry" className={`fld-input${errors.expiry ? " is-invalid" : ""}`} value={f.expiry} onChange={(e) => set("expiry")(formatExpiry(e.target.value))} onBlur={blur("expiry")} inputMode="numeric" autoComplete="off" placeholder="MM / YY" aria-invalid={errors.expiry ? true : undefined} aria-describedby={errors.expiry ? "p-expiry-err" : undefined} />
                {errors.expiry ? <FieldError id={"p-expiry-err"}>{errors.expiry}</FieldError> : null}
              </div>
              {input("cvc", "CVC", { inputMode: "numeric", autoComplete: "off", maxLength: 4, placeholder: "123" })}
            </div>
          </div>

          <p className="s2-secure">
            <span className="s2-secure-icon" aria-hidden="true"><LockKey /></span>
            Your payment details are processed over an encrypted connection and are not stored on this site.
          </p>

          <div className="fld">
            <label className="s2-terms" htmlFor="p-terms">
              <input
                id="p-terms"
                className="fld-checkbox"
                type="checkbox"
                checked={terms}
                onChange={(e) => { setTerms(e.target.checked); if (e.target.checked) setErrors((p) => ({ ...p, terms: undefined })); }}
                aria-invalid={errors.terms ? true : undefined}
                aria-describedby={errors.terms ? "p-terms-err" : undefined}
              />
              <span>
                I have read and agree to the <a href="/terms-and-conditions" target="_blank" rel="noopener">Terms &amp; Conditions</a> and the <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Statement</a>.
              </span>
            </label>
            {errors.terms ? <FieldError id={"p-terms-err"}>{errors.terms}</FieldError> : null}
          </div>

          <p className={`form-error${formError ? " is-shown" : ""}`} role="alert" tabIndex={-1} ref={alertRef}>{formError}</p>
          <button type="submit" className="fbtn fbtn--primary fbtn--wide">Complete booking <ChevronRight aria-hidden={true} /></button>
          <p className="s2-safe-note">Guaranteed safe checkout: secure transmission and encrypted storage protect your personal information.</p>
        </motion.section>

        <motion.aside className="fcard s2-right" variants={v} initial="hidden" animate="show" aria-label="Order summary">
          <p className="s2-hold"><span className="s2-flame" aria-hidden="true"><FlameSolid className="s2-flame-outer" /><FlameSolid className="s2-flame-core" /></span>This <strong>Shenandoah Valley vacation</strong> is in high demand. No worries, we have reserved your package for <strong className="s2-hold-clock">{hh}:{mm}:{ss}</strong>{left > 0 ? " Minutes!" : ". Call us to hold it."}</p>
          {/* Price Details, Figma node 139:8886: tinted panel, ruled rows, filled total. */}
          <section className="pricebox" aria-labelledby="s2-price">
            <h2 className="pricebox-title" id="s2-price">Price Details</h2>
            <dl className="price">
              <div><dt>3-Nights Accommodations</dt><dd>{money(PRICES.package)}</dd></div>
              <div><dt>Booking Fee</dt><dd>{money(PRICES.bookingFee)}</dd></div>
              <div className="price-total"><dt>Total</dt><dd>{money(PRICES.package + PRICES.bookingFee)}</dd></div>
            </dl>
            <p className="price-note">{TAX_NOTE}</p>
          </section>
          <div className="bs-head">
            <h2 className="fcard-title">Booking Summary</h2>
            <button type="button" className="bs-edit" onClick={() => router.push(FLOW.general)}><PencilSimple className="ic-inline" aria-hidden={true} />Edit</button>
          </div>
          <ul className="bs">
            <li><CheckCircle aria-hidden={true} /><b>Name:</b> {g.firstName} {g.lastName}</li>
            <li><CheckCircle aria-hidden={true} /><b>Nights:</b> {NIGHTS_LABEL}</li>
            <li><CheckCircle aria-hidden={true} /><b>Unit Type:</b> {ROOM_TYPE}</li>
            <li><CheckCircle aria-hidden={true} /><b>Requested Check-in:</b> {g.knowsDates ? fmtDate(g.checkIn) : "Flexible"}</li>
            <li><CheckCircle aria-hidden={true} /><b>Guests:</b> {g.adults + g.kids}</li>
            <li><CheckCircle aria-hidden={true} /><b>Phone:</b> {g.phone}</li>
            <li><CheckCircle aria-hidden={true} /><b>Email:</b> {g.email}</li>
          </ul>
        </motion.aside>
      </form>

      <ProtectionModal open={showProtection} onContinue={onProtection} />
    </>
  );
}
