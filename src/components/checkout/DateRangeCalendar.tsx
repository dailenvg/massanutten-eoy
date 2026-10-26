"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import { PACKAGE_NIGHTS, addDays, fromISO, toISO } from "@/lib/booking";

/**
 * Two-month check-in picker (Figma "Prefered Dates_section V2").
 *
 * The package is a fixed 3 nights, so the guest picks check-in and check-out
 * follows — the comp's free range is for a variable-length stay this offer
 * does not have. Past days are disabled. Keyboard: arrows move a day, Enter or
 * Space selects.
 */
const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const same = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

function Month({
  year,
  month,
  today,
  checkIn,
  checkOut,
  onPick,
}: {
  year: number;
  month: number;
  today: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  onPick: (d: Date) => void;
}) {
  const first = new Date(year, month, 1);
  const label = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const cells: (Date | null)[] = [];
  for (let i = 0; i < first.getDay(); i++) cells.push(null);
  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month, d));

  return (
    <div className="cal-month">
      <p className="cal-month-label" aria-hidden="true">{label}</p>
      <div className="cal-week" role="row">
        {WEEK.map((w) => <span key={w} role="columnheader">{w}</span>)}
      </div>
      <div className="cal-days" role="grid" aria-label={label}>
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} className="cal-day cal-day--empty" aria-hidden="true" />;
          const past = d < today;
          const isIn = checkIn ? same(d, checkIn) : false;
          const isOut = checkOut ? same(d, checkOut) : false;
          const inRange = checkIn && checkOut ? d > checkIn && d < checkOut : false;
          return (
            <button
              key={toISO(d)}
              type="button"
              role="gridcell"
              className={`cal-day${past ? " is-past" : ""}${isIn ? " is-in" : ""}${isOut ? " is-out" : ""}${inRange ? " is-range" : ""}`}
              disabled={past}
              aria-selected={isIn || isOut || undefined}
              aria-label={d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              onClick={() => onPick(d)}
            >
              {/*
                The button fills its grid column so the tap target stays full
                width; this span is the round marker the states paint, since a
                50% radius on the full-width button stretches to an ellipse.
              */}
              <span className="cal-day-n">{d.getDate()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DateRangeCalendar({
  checkIn,
  extraNights = 0,
  onChange,
}: {
  checkIn: string;
  extraNights?: number;
  onChange: (iso: string) => void;
}) {
  const today = useMemo(() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; }, []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const inDate = checkIn ? fromISO(checkIn) : null;
  const outDate = inDate ? addDays(inDate, PACKAGE_NIGHTS + extraNights) : null;
  const next = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
  const canGoBack = cursor > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <div className="cal">
      <div className="cal-nav">
        <button type="button" className="cal-arrow" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} disabled={!canGoBack} aria-label="Previous month"><ChevronLeft aria-hidden={true} /></button>
        <span className="cal-nav-label">{cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })} – {next.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
        <button type="button" className="cal-arrow" onClick={() => setCursor(next)} aria-label="Next month"><ChevronRight aria-hidden={true} /></button>
      </div>
      <Month year={cursor.getFullYear()} month={cursor.getMonth()} today={today} checkIn={inDate} checkOut={outDate} onPick={(d) => onChange(toISO(d))} />
      <Month year={next.getFullYear()} month={next.getMonth()} today={today} checkIn={inDate} checkOut={outDate} onPick={(d) => onChange(toISO(d))} />
    </div>
  );
}
