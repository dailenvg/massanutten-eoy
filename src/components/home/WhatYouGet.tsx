import { Check } from "@/lib/icons";
import { RESERVE_URL } from "@/lib/site";
import {
  ACCOMMODATIONS_PARAGRAPH,
  PREVIEW_PARAGRAPH,
  WYG_INCLUDES,
} from "@/lib/offer";

/** Component E — What You Get & Why You Get It. */
export default function WhatYouGet() {
  return (
    <div id="whatYouGet" className="whatyouget">
      <div className="whatyougetcontainer">
        <h2 className="whatyougettitle">What You Get &amp; Why You Get it</h2>
        <h2 className="whatyougettitlembl">What You Get &amp; <br />Why You Get it</h2>

        <div className="w-layout-hflex whatyougetset">
          <div className="whatyougetcolumn">
            <div className="whyyougetsubtitle darker">
              <h3 className="columntitle blue">What you get</h3>
            </div>

            <div className="wyglistitem"><Check className="wyg-check" aria-hidden="true" />
              <div className="text-block-39"><strong>Accommodations</strong>: {ACCOMMODATIONS_PARAGRAPH}</div>
            </div>

            {WYG_INCLUDES.map((text) => (
              <div className="wyglistitem" key={text}><Check className="wyg-check" aria-hidden="true" />
                <div className="text-block-40"><strong>Includes</strong>: {text}</div>
              </div>
            ))}
          </div>

          <div className="whatyougetcolumn">
            <div className="whyyougetsubtitle">
              <h3 className="columntitle">Why you get it</h3>
            </div>

            <div className="wyglistitem"><Check className="wyg-check" aria-hidden="true" />
              <div className="text-block-37"><strong>Be Our Guest</strong>: {PREVIEW_PARAGRAPH}</div>
            </div>
          </div>
        </div>

        <a data-wf--button--variant="big" href={RESERVE_URL} className="checkout-cta w-variant-bb32e703-515b-0273-c76d-ea9f00368c6a w-button">Reserve now</a>
      </div>
    </div>
  );
}
