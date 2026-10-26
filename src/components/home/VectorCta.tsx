import { RESERVE_URL } from "@/lib/site";
export default function VectorCta() {
  return (
    <>
        <a href={RESERVE_URL} className="div-block-5 vector-cta" aria-label="Reserve now">
          <img loading="lazy" src="/images/Vector-1.svg" alt="" className="vector-cta-img" />
          <span className="vector-cta-text">Reserve Now</span>
        </a>
    </>
  );
}
