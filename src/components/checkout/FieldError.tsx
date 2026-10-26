import { Warning } from "@/lib/icons";

/**
 * Inline validation message for a form field.
 *
 * Exists so the warning mark is a Phosphor glyph in the markup rather than a
 * `content: "⚠ "` pseudo-element: the emoji rendered in whatever the OS
 * supplies, which is the one icon on the page we could not control.
 */
export default function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p className="fld-error" id={id}>
      <Warning className="ic-inline" aria-hidden={true} />
      {children}
    </p>
  );
}
