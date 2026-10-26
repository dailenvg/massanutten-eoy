/**
 * Email-safe HTML for the purchase confirmation.
 *
 * 600px table shell, inline styles plus a small <style> block for the 480px
 * and 360px breakpoints, absolute image URLs, a VML button for Outlook, no
 * scripts. One VacationVIP design and copy for every season; the route and hub
 * keep their per-season URLs.
 * Copy and tokens live in confirmation-email-content.ts; the Terms in terms.ts.
 */
import {
  CONFIRMATION_COPY as C,
  CONFIRMATION_IMAGES as IMG,
  CONFIRMATION_ROWS,
  CONFIRMATION_THEME as T,
  type ConfirmationRow,
} from "./confirmation-email-content";
import type { Season } from "./season";
import { TERMS_BLOCKS, TERMS_TITLE } from "./terms";

const WIDTH = 600;
const PAD_X = 32;

const STYLES = `
body { margin:0 !important; padding:0 !important; width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; background-color:${T.page}; }
img { border:0; outline:none; text-decoration:none; display:block; max-width:100%; -ms-interpolation-mode:bicubic; }
table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
a { text-decoration:none; }
@media only screen and (max-width:480px) {
  .vv-bar { padding:12px 16px !important; }
  .vv-bar-label { font-size:12px !important; }
  .vv-bar-amt { font-size:16px !important; }
  .vv-logo { width:112px !important; }
  .vv-pad { padding-left:20px !important; padding-right:20px !important; }
  .vv-pad-t { padding-top:28px !important; }
  .vv-h1 { font-size:27px !important; line-height:1.14 !important; letter-spacing:-0.5px !important; }
  .vv-lede { font-size:15px !important; }
  .vv-body { font-size:14px !important; }
  .vv-cta a { padding:16px 16px !important; }
  .vv-cta a { font-size:14px !important; letter-spacing:0.4px !important; }
  .vv-note { padding:20px !important; }
  .vv-h2 { font-size:21px !important; }
  .vv-card { padding:24px 16px !important; }
  .vv-row-label, .vv-row-value { font-size:13px !important; }
  .vv-foot { padding:32px 20px !important; }
  .vv-foot-txt { font-size:11.5px !important; }
  .vv-stack, .vv-stack td { display:block !important; }
  .vv-stack .vv-ico { display:inline-block !important; vertical-align:middle !important; padding:0 8px 0 0 !important; }
  .vv-stack .vv-row-label { display:inline-block !important; vertical-align:middle !important; width:auto !important; padding-right:0 !important; }
  .vv-stack .vv-row-value { display:block !important; width:100% !important; padding:4px 0 0 34px !important; }
  .vv-row-value { overflow-wrap:anywhere !important; }
}
@media only screen and (max-width:360px) {
  .vv-pad { padding-left:16px !important; padding-right:16px !important; }
  .vv-bar { padding:8px 16px !important; }
  .vv-logo { width:96px !important; }
  .vv-bar-label { font-size:11px !important; }
  .vv-bar-amt { font-size:15px !important; }
  .vv-h1 { font-size:24px !important; }
  .vv-note { padding:16px !important; }
  .vv-card { padding:24px 16px !important; }
}`;

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const text = (size: number, weight: number, color: string, extra = "") =>
  `font-family:${T.font};font-size:${size}px;font-weight:${weight};color:${color};${extra}`;

const icon = (origin: string, name: string, px = 18) =>
  `<img src="${origin}${IMG.iconDir}/${name}.png" width="${px}" height="${px}" alt="" style="width:${px}px;min-width:${px}px;max-width:${px}px;height:${px}px;display:block;border:0;" />`;

const ICON_CELL = "width:26px;min-width:26px;padding:2px 8px 0 0;line-height:0;font-size:0;";

/** Full-width section row with the shared horizontal padding. */
const section = (top: number, body: string, cls = "vv-pad", align = "") =>
  `<tr><td class="${cls}"${align} style="padding:${top}px ${PAD_X}px 0;">${body}</td></tr>`;

function topBar(origin: string) {
  return `
<tr><td class="vv-bar" bgcolor="${T.bar}" style="padding:16px 24px;background-color:${T.bar};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td align="left" valign="middle" style="line-height:0;font-size:0;">
      <img class="vv-logo" src="${origin}${IMG.logo.src}" width="${IMG.logo.width}" alt="${IMG.logo.alt}" style="width:${IMG.logo.width}px;max-width:${IMG.logo.width}px;height:auto;display:block;border:0;font-family:${T.font};font-size:16px;font-weight:700;line-height:20px;color:${T.onDark};" />
    </td>
    <td align="right" valign="middle" style="font-family:${T.font};color:${T.onDark};">
      <span class="vv-bar-label" style="font-size:14px;font-weight:500;white-space:nowrap;">${C.totalLabel}</span>
      <span class="vv-bar-amt" style="font-size:19px;font-weight:700;padding-left:4px;white-space:nowrap;">${C.total}</span>
    </td>
  </tr></table>
</td></tr>`;
}

function hero(origin: string) {
  const h = IMG.hero;
  return `
<tr><td style="padding:0;line-height:0;font-size:0;">
  <img src="${origin}${h.src}" width="${h.width}" height="${h.height}" alt="${h.alt}" style="width:100%;max-width:100%;height:auto;display:block;border:0;font-family:${T.font};font-size:14px;line-height:20px;color:${T.heading};" />
</td></tr>`;
}

const strong = (html: string) => html.replace(/<strong>/g, `<strong style="font-weight:700;color:${T.strong};">`);

/** Call link, or bold text while the number is a placeholder (no dead link). */
const phoneLink = () =>
  C.phoneConfirmed
    ? `<a href="${C.phoneHref}" style="display:inline-block;padding:11px 0;line-height:22px;color:${T.heading};text-decoration:underline;font-weight:700;white-space:nowrap;">${C.phoneDisplay}</a>`
    : `<strong style="display:inline-block;padding:11px 0;line-height:22px;color:${T.heading};font-weight:700;white-space:nowrap;">${C.phoneDisplay}</strong>`;

function headline() {
  return section(
    40,
    `<h1 class="vv-h1" style="margin:0 0 16px;${text(33, 800, T.heading, "line-height:1.12;letter-spacing:-0.8px;")}">${C.title}</h1>
    <p class="vv-lede" style="margin:0;${text(16, 600, T.heading, "line-height:1.5;")}">${C.lede}</p>`,
    "vv-pad vv-pad-t",
  );
}

/**
 * Placeholder number: a tinted info box, not a link. An orange-outlined,
 * full-width, uppercase pill still read as a (ghost) button in the CTA colour,
 * so this uses the note tint, an 8px radius and sentence case instead.
 * #205272 on #e9f3fb is ~7.6:1. No `vv-cta` class: its mobile rules target links.
 */
function pendingCta(label: string) {
  return section(
    24,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${T.note}" style="background-color:${T.note};border-radius:8px;">
  <tr><td align="center" style="padding:16px 24px;font-family:${T.font};font-size:16px;font-weight:700;line-height:24px;color:${T.heading};">${label}</td></tr>
</table>`,
    "vv-pad",
    ' align="center"',
  );
}

/** Gradient pill; Outlook gets a VML roundrect since it ignores border-radius and gradients. */
function cta() {
  if (!C.phoneConfirmed) return pendingCta(C.cta);
  const label = C.cta.toUpperCase();
  return section(
    24,
    `<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${C.phoneHref}" style="height:56px;v-text-anchor:middle;width:${WIDTH - PAD_X * 2}px;" arcsize="50%" stroke="f" fillcolor="${T.ctaFrom}">
<w:anchorlock/>
<center style="color:${T.onDark};font-family:Roboto,Arial,sans-serif;font-size:16px;font-weight:500;letter-spacing:1px;">${label}</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-- -->
<table role="presentation" class="vv-cta" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${T.ctaFrom}" style="border-radius:40px;background-color:${T.ctaFrom};background-image:linear-gradient(180deg,${T.ctaFrom} 0%,${T.ctaTo} 100%);">
  <tr><td align="center" style="padding:0;border-radius:40px;">
    <a href="${C.phoneHref}" style="display:block;padding:20px 24px;border-radius:40px;font-family:${T.ctaFont};font-size:16px;font-weight:500;line-height:1;letter-spacing:1px;color:${T.onDark};text-decoration:none;">${label}</a>
  </td></tr>
</table>
<!--<![endif]-->`,
    "vv-pad",
    ' align="center"',
  );
}

/** Action required box: what the guest must do before travelling. */
function actionRequired() {
  const items = C.actionLines
    .map((l, i) => `<li style="margin:0 0 ${i === C.actionLines.length - 1 ? 0 : 8}px;">${strong(l)}</li>`)
    .join("");
  return section(
    24,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.note};border-radius:16px;">
  <tr><td class="vv-note" style="padding:24px 28px;">
    <p style="margin:0 0 16px;${text(17, 700, T.heading, "letter-spacing:0.4px;")}">${C.actionTitle}</p>
    <ul class="vv-body" style="margin:0;padding:0 0 0 20px;${text(15, 400, T.body, "line-height:1.5;")}">${items}</ul>
    <p class="vv-body" style="margin:16px 0 0;${text(15, 400, T.body, "line-height:1.5;")}"><strong style="font-weight:700;color:${T.strong};">${C.hoursLabel}</strong><br />${C.hours}</p>
  </td></tr>
</table>`,
  );
}

const ROW_FONT = (weight: number) => text(14, weight, T.heading, "line-height:1.45;");

/** Label and value side by side; below 480px the value drops under the label. */
function row(origin: string, r: ConfirmationRow) {
  return `
<table role="presentation" class="vv-stack" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
  <td class="vv-ico" width="26" valign="top" style="${ICON_CELL}">${icon(origin, r.icon)}</td>
  <td class="vv-row-label" valign="top" style="white-space:nowrap;padding-right:12px;${ROW_FONT(600)}">${r.label}</td>
  <td class="vv-row-value" width="100%" align="left" valign="top" style="word-break:break-word;overflow-wrap:anywhere;${ROW_FONT(400)}">${r.value}</td>
</tr></table>`;
}

function summaryCard(origin: string) {
  const rows = CONFIRMATION_ROWS.map((r) => `<tr><td style="padding:0 0 12px;">${row(origin, r)}</td></tr>`).join("");
  return section(
    40,
    `<h2 class="vv-h2" style="margin:0 0 16px;${text(24, 700, T.heading, "line-height:1.2;letter-spacing:-0.3px;")}">${C.summaryTitle}</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.panel};border-radius:16px;">
  <tr><td class="vv-card" style="padding:28px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;"><tr>
      <td width="32" valign="middle" style="width:32px;padding:0 10px 0 0;line-height:0;font-size:0;">${icon(origin, "briefcase", 22)}</td>
      <td valign="middle" style="${text(18, 700, T.heading)}">${C.packageTitle}</td>
    </tr></table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
    <p style="margin:4px 0 0;${text(14, 700, T.heading, "line-height:1.45;")}">${C.travelLine}</p>
  </td></tr>
</table>`,
  );
}

function extras() {
  return section(
    16,
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.panel};border-radius:16px;">
  <tr><td class="vv-card" style="padding:24px 28px;">
    <p style="margin:0 0 16px;${text(16, 700, T.heading)}">${C.extrasTitle}</p>
    <p class="vv-row-value" style="margin:0 0 16px;${text(14, 400, T.body, "line-height:1.45;")}">${C.extras}</p>
    <p style="margin:0;padding-top:16px;border-top:1px solid ${T.rule};${text(16, 700, T.strong)}">${C.extrasTotalLabel}: ${C.total}</p>
  </td></tr>
</table>`,
  );
}

function questions() {
  return section(
    32,
    `<p class="vv-body" style="margin:0 0 16px;${text(15, 400, T.body, "line-height:1.5;")}">${C.questions} ${phoneLink()}</p>
<p class="vv-body" style="margin:0;${text(15, 400, T.body, "line-height:1.5;")}"><strong style="font-weight:700;color:${T.strong};">${C.hoursOfOperation}</strong><br />${C.hours}</p>`,
  );
}

/** The site's full Terms (lib/terms.ts), verbatim. The copy's blank spacer line is omitted. */
function terms() {
  const blocks = TERMS_BLOCKS.map((b) => {
    if (b.kind === "spacer") return "";
    if (b.kind === "heading")
      return `<h3 class="vv-legal-h" style="margin:24px 0 8px;${text(14, 700, T.strong, "line-height:1.3;letter-spacing:0.3px;")}">${escapeHtml(b.text)}</h3>`;
    const body = b.strong ? `<strong style="font-weight:700;color:${T.strong};">${escapeHtml(b.text)}</strong>` : escapeHtml(b.text);
    return `<p class="vv-legal" style="margin:0 0 8px;${text(12, 400, T.legalText, "line-height:1.55;")}">${body}</p>`;
  }).join("");
  return `
<tr><td style="padding:0 0 40px;line-height:0;font-size:0;">&nbsp;</td></tr>
<tr><td class="vv-pad" style="padding:40px ${PAD_X}px;background-color:${T.legalBg};">
  <h2 style="margin:0;${text(19, 700, T.strong, "line-height:1.25;")}">${TERMS_TITLE}</h2>
  ${blocks}
</td></tr>`;
}

function footer(origin: string) {
  return `
<tr><td class="vv-foot" align="center" bgcolor="${T.footer}" style="padding:40px ${PAD_X}px;background-color:${T.footer};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td align="center" style="padding:0 0 24px;line-height:0;font-size:0;">
      <img src="${origin}${IMG.logo.src}" width="150" alt="${IMG.logo.alt}" style="width:150px;max-width:150px;height:auto;display:block;margin:0 auto;border:0;font-family:${T.font};font-size:16px;font-weight:700;line-height:20px;color:${T.onDark};" />
    </td></tr>
    <tr><td class="vv-foot-txt" align="center" style="${text(12, 400, T.onDark, "line-height:1.7;")}">${C.footer}</td></tr>
  </table>
</td></tr>`;
}

/** Inbox preview text, padded so clients do not pull body copy in after it. */
const preheader = () =>
  `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${T.page};opacity:0;">${C.preheader}${"&#847;&zwnj;&nbsp;".repeat(16)}</div>`;

/** Full HTML document for the confirmation email; identical for every season. */
export function renderConfirmationEmail(_season: Season, origin: string): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>${C.title}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<link href="${T.fontsHref}" rel="stylesheet" />
<style type="text/css">${STYLES}</style>
</head>
<body style="margin:0;padding:0;background-color:${T.page};">
${preheader()}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.page};">
<tr><td align="center" style="padding:0;">
<!--[if mso]><table role="presentation" width="${WIDTH}" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" class="vv-shell" width="${WIDTH}" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:${WIDTH}px;background-color:${T.card};font-family:${T.font};">
${hero(origin)}
${topBar(origin)}
${headline()}
${cta()}
${actionRequired()}
${summaryCard(origin)}
${extras()}
${questions()}
${terms()}
${footer(origin)}
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}
