import { Tag } from "@/lib/icons";
import { PERCENT_OFF_LINES, PRICE_UNIT, RETAIL_VALUE } from "@/lib/offer";
import PriceNumeral from "./PriceNumeral";

/**
 * Price composition: sale-name chip and struck retail value on one line, then
 * the dominant rolling "$104" with its "Per Family" label beside it. Shared by
 * the hero offer card and Resort Details so both price blocks match. Both
 * pass `percentOff` for the ribbon tab flush with the box's left edge.
 */
export default function OfferPrice({ saleName, percentOff = false }: { saleName: string; percentOff?: boolean }) {
  return (
    <div className="op-price">
      <div className="op-meta">
        <span className="op-chip">
          <Tag className="op-chip-icon" aria-hidden="true" />
          {saleName}
        </span>
        <span className="op-was">
          <span className="vv-visually-hidden">Regular price </span>
          <s className="op-was-amt">{RETAIL_VALUE}</s> VALUE
        </span>
      </div>
      <div className="op-main">
        {percentOff ? (
          <span className="op-off">
            {PERCENT_OFF_LINES.map((line) => <span key={line}>{line}</span>)}
          </span>
        ) : null}
        <PriceNumeral className="op-numeral" />
        <span className="op-unit">{PRICE_UNIT}</span>
      </div>
    </div>
  );
}
