import { SPONSOR_DISCLOSURE, TIMESHARE_DISCLOSURE } from "@/lib/offer";

/** Footer. */
export default function Footer() {
  return (
    <footer className="footer-2">
      <div><img width="Auto" height="Auto" alt="VacationVIP logo white" src="/images/VacationVIP-logo-white.svg" loading="lazy" /></div>
      <div className="w-embed">
        <div>
          <a href="https://www.bbb.org/us/fl/belle-isle/profile/vacation-certificates-and-vouchers/vacationvip-com-0733-235962636/#sealclick" target="_blank" rel="nofollow noopener" style={{ display: 'inline-block', backgroundColor: 'white', borderRadius: '8px' }}><img src="/images/shared/bbb-seal.webp" width="170" height="44" style={{ border: '0' }} alt="VacationVIP.com BBB Business Review" /></a>
        </div>
      </div>
      <div className="footercontent">Sogno Tours, LLC d/b/a VacationVIP.com</div>
      <div className="footercontent">5900 Lake Ellenor Drive Suite 300, Orlando, FL 32809</div>
      <div className="footercontent">VacationVIP.com | Copyright © 2026 | All Rights Reserved.</div>
      <div className="footercontent">SOT: Florida: ST44683 | Washington: 603354522 | California: 2156600-50 | Hawaii: 7531</div>
      <div className="footer-taxes"></div>
      <div className="footercontent">{SPONSOR_DISCLOSURE}</div>
      <div className="text-block-4">{TIMESHARE_DISCLOSURE}</div>
      <div className="footerserlinks">
        <a href="/terms-and-conditions" className="text-block-6" data-legal-modal="terms">Terms &amp; conditions<br /></a>
        <div className="footerdivider">|<br /></div>
        <a href="/privacy-policy" className="text-block-5" data-legal-modal="privacy">Privacy Policy<br /></a>
      </div><img loading="lazy" src="/images/EHO-Logo.svg" alt="" className="houseicon" />
    </footer>
  );
}
