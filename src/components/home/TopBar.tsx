import Link from "next/link";

/**
 * The bar pins to the top of the viewport everywhere except the homepage,
 * where the hero and the sticky section nav own the top of the screen — so
 * `sticky` defaults on and only the homepage passes `sticky={false}`.
 */
export default function TopBar({ sticky = true }: { sticky?: boolean }) {
  return (
    <div className={sticky ? "tb tb--sticky" : "tb"}>
      <div className="tb-top">
        <Link href="/" className="tb-logo-link" aria-label="VacationVIP, go to homepage">
          <img src="/images/VacationVIP-logo.svg" alt="VacationVIP" className="tb-logo" />
        </Link>
      </div>
    </div>
  );
}
