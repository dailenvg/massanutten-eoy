/**
 * QA dashboard for the confirmation email, every season.
 *
 * Plain HTML + vanilla JS served from /emails-hub. Each season is fetched from
 * /email/confirmation/[season] and rendered in sandboxed iframes at desktop (600), tablet (768) and
 * mobile (375) widths, with an inbox preview and a send checklist.
 */
import { EMAIL_DASHBOARD_SUBTITLE } from "./offer";
import { SEASONS } from "./season";

const SENDER = "Vacation VIP";

export function renderEmailDashboard(): string {
  const seasons = SEASONS.map((s, i) => ({
    key: s.key,
    label: SEASONS.findIndex((o) => o.badge === s.badge) < i ? `${s.badge} (from ${s.start.slice(5, 10).replace("-", "/")})` : s.badge,
  }));
  const config = JSON.stringify({ seasons, sender: SENDER }).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Email Preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
:root{--bg:#E7E7EA;--panel:#F4F4F5;--card:#FFFFFF;--tile:#EDEDEF;--line:#E4E4E7;--hover:#E9E9EC;--seg:#E4E4E7;--segOn:#FFFFFF;--text:#18181B;--text2:#3F3F46;--muted:#62626B;--inv:#18181B;--invText:#FFFFFF;--bezel:#18181B;--focus:#2563EB;color-scheme:light}
:root[data-theme="dark"]{--bg:#0C0C0E;--panel:#161618;--card:#1F1F22;--tile:#18181B;--line:#2C2C30;--hover:#26262A;--seg:#26262A;--segOn:#3A3A3F;--text:#F4F4F5;--text2:#D4D4D8;--muted:#A8A8B0;--inv:#F4F4F5;--invText:#18181B;--bezel:#2E2E33;--focus:#60A5FA;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font-family:'Figtree',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
button,select{font-family:inherit;color:inherit}
button{cursor:pointer;border:0}
button:disabled{cursor:not-allowed;opacity:.5}
button:focus-visible,a:focus-visible,select:focus-visible{outline:2px solid var(--focus);outline-offset:2px}
a{color:inherit}
.app{min-height:100vh;display:flex;flex-wrap:wrap;align-items:flex-start;gap:16px;padding:16px}
aside{flex:1 1 100%;display:flex;flex-direction:column;gap:16px;padding:16px;background:var(--panel);border-radius:24px}
@media (min-width:1100px){aside{flex:0 0 288px;position:sticky;top:16px;min-height:calc(100vh - 32px)}}
.brand{display:flex;align-items:center;gap:12px;padding:0 8px}
.avatar{width:40px;height:40px;border-radius:50%;background:#062A6B;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;line-height:1;flex:none}
.brand b{display:block;font-size:16px;line-height:20px}
.brand span{font-size:13px;line-height:16px;color:var(--muted)}
.group{display:flex;flex-direction:column;gap:8px}
.label{font-size:12px;font-weight:600;color:var(--muted);padding:0 8px}
.nav{display:flex;flex-wrap:wrap;gap:4px}
@media (min-width:1100px){.nav{flex-direction:column}}
.nav button{flex:1 1 140px;display:flex;align-items:center;gap:12px;min-height:44px;padding:8px 16px;border-radius:16px;background:transparent;font-size:15px;font-weight:500;text-align:left}
@media (min-width:1100px){.nav button{flex:none}}
.nav button:hover{background:var(--hover)}
.nav button[aria-checked="true"]{background:var(--seg);font-weight:600}
.ico{width:20px;display:flex;justify-content:center;flex:none}
kbd{font-family:inherit;font-size:11px;font-weight:600;line-height:16px;color:var(--muted);border:1px solid var(--line);border-radius:6px;padding:0 6px;margin-left:auto}
.seg{display:flex;gap:4px;padding:4px;background:var(--seg);border-radius:999px}
.seg button{flex:1;min-height:44px;padding:8px;border-radius:999px;background:transparent;font-size:14px;font-weight:500}
.seg button:hover{background:var(--hover)}
.seg button[aria-checked="true"]{background:var(--segOn);font-weight:600;box-shadow:0 1px 2px rgba(0,0,0,.12)}
.select{min-height:44px;width:100%;padding:8px 48px 8px 16px;appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2362626B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 16px center;border-radius:16px;border:1px solid var(--line);background-color:var(--card);font-size:15px;font-weight:500}
:root[data-theme="dark"] .select{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23A8A8B0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E")}
.opts{display:flex;flex-wrap:wrap;gap:16px;padding:0 8px}
.opts>.group{flex:1 1 200px}
.opts>.group .label{padding:0}
@media (min-width:1100px){.opts{flex-direction:column}}
.switch{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:44px;background:transparent;padding:0;text-align:left;width:100%}
.switch b{display:block;font-size:14px;font-weight:500}
.switch small{font-size:12px;color:var(--muted)}
.track{width:40px;height:24px;border-radius:999px;background:var(--seg);position:relative;flex:none;transition:background .15s}
.track::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:var(--card);box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .15s}
.switch[aria-checked="true"] .track{background:var(--inv)}
.switch[aria-checked="true"] .track::after{background:var(--invText);transform:translateX(16px)}
.spacer{flex:1}
.ready{display:none;background:var(--card);border-radius:24px;padding:16px;flex-direction:column;gap:8px}
@media (min-width:1100px){.ready{display:flex}}
.ready b{font-size:16px;line-height:24px}
.ready p{margin:0 0 8px;font-size:13px;line-height:20px;color:var(--muted)}
.btn{min-height:44px;display:flex;align-items:center;justify-content:center;padding:8px 16px;border-radius:999px;font-size:14px;font-weight:600;text-decoration:none}
.btn-inv{background:var(--inv);color:var(--invText)}
.btn-inv:hover:not(:disabled){opacity:.88}
.btn-ghost{background:transparent;border:1px solid var(--line)}
.btn-ghost:hover{background:var(--hover)}
.btn:active:not(:disabled){transform:scale(.98)}
main{flex:1 1 600px;min-width:0;display:flex;flex-direction:column;gap:16px}
header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;padding:8px 8px 0}
h1{margin:0;font-size:24px;line-height:32px;font-weight:400;text-transform:uppercase}
h1 b,h2 b,.ft b{font-weight:700}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.chips span{font-size:12px;font-weight:500;padding:4px 12px;border-radius:999px;background:var(--panel);color:var(--text2)}
.actions{display:flex;gap:4px;padding:4px;background:var(--panel);border-radius:999px}
.actions .btn{min-height:44px}
.actions a.btn:hover{background:var(--hover)}
.stage{width:100%;min-width:0;overflow-x:hidden;overflow-y:hidden;border-radius:24px}
.stage.scroll{overflow-x:auto}
.scaler{overflow:hidden}
.strip{display:flex;gap:16px;align-items:flex-start;width:max-content;transform-origin:0 0}
.frame{flex:none;border-radius:24px;padding:16px 24px 24px;background:var(--tile);display:flex;flex-direction:column;gap:16px}
.fhead{display:flex;justify-content:space-between;align-items:center;gap:12px}
.ft{font-size:16px;line-height:24px}
.fs{font-size:13px;color:var(--muted)}
.fbtn{min-height:44px;padding:0 16px;border-radius:999px;background:var(--card);font-size:13px;font-weight:600}
.fbtn:hover{opacity:.85}
.device{display:flex;justify-content:center}
.desk{background:var(--card);border-radius:16px;overflow:hidden;box-shadow:0 20px 40px -24px rgba(0,0,0,.35)}
.mailhead{padding:12px 16px;border-bottom:1px solid var(--line);display:flex;gap:12px;align-items:center}
.mailhead .avatar{width:32px;height:32px;font-size:12px}
.mailhead b{display:block;font-size:15px;line-height:20px}
.mailhead span{font-size:12px;color:var(--muted)}
.tab{padding:16px;background:var(--bezel);border-radius:32px;box-shadow:0 20px 40px -24px rgba(0,0,0,.5)}
.tab iframe{border-radius:16px}
.phone{padding:12px;background:var(--bezel);border-radius:48px;box-shadow:0 20px 40px -24px rgba(0,0,0,.5)}
.screen{border-radius:36px;overflow:hidden;background:#fff}
.status{height:32px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;font-size:12px;font-weight:700;color:#18181B;background:#fff}
.status i{width:72px;height:20px;border-radius:999px;background:#18181B}
iframe{display:block;border:0;background:#fff}
.skeleton{background:linear-gradient(90deg,var(--line) 0%,var(--hover) 50%,var(--line) 100%);background-size:200% 100%;animation:sk 1.2s ease-in-out infinite}
@keyframes sk{to{background-position:-200% 0}}
.error{display:none;padding:24px;border-radius:24px;background:var(--tile);gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.error.on{display:flex}
.panels{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:16px}
.panel{border-radius:24px;padding:24px;background:var(--tile);display:flex;flex-direction:column;gap:16px}
h2{margin:0;font-size:16px;line-height:24px;font-weight:400;text-transform:uppercase}
.sub{font-size:13px;color:var(--muted)}
.inbox{background:var(--card);border-radius:16px;padding:16px;display:flex;gap:12px;align-items:flex-start}
.inbox>div{min-width:0;flex:1}
.inbox>.avatar{flex:none}
.inbox .top{display:flex;justify-content:space-between;gap:8px;font-size:14px}
.inbox .subj{font-size:14px;font-weight:600;line-height:20px;margin-top:4px;text-wrap:pretty}
.inbox .pre{font-size:13px;color:var(--muted);line-height:18px;margin-top:4px;text-wrap:pretty}
.counts{display:flex;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--muted);padding:0 4px}
.bar{width:120px;height:8px;border-radius:999px;background:var(--seg);overflow:hidden;margin-top:8px}
.bar i{display:block;height:100%;background:var(--inv);border-radius:999px;transition:width .3s}
.checks{list-style:none;margin:0;padding:4px 16px;background:var(--card);border-radius:16px}
.checks li{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line);font-size:14px}
.checks li:last-child{border-bottom:0}
.checks .mark{flex:none;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700}
.checks .ok{background:var(--inv);color:var(--invText)}
.checks .warn{border:1.5px solid var(--text)}
.checks .lbl{flex:1;min-width:0}
.checks .det{font-size:12px;color:var(--muted);text-align:right}
.toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom));transform:translate(-50%,12px);opacity:0;transition:opacity .2s,transform .2s;pointer-events:none;background:var(--inv);color:var(--invText);font-size:14px;font-weight:600;padding:12px 16px;border-radius:999px;box-shadow:0 10px 30px -10px rgba(0,0,0,.4);z-index:20}
.toast.on{opacity:1;transform:translate(-50%,0)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>
</head>
<body>
<div class="app">
  <aside aria-label="Preview controls">
    <div class="brand"><div class="avatar" aria-hidden="true">VIP</div><div><b>${SENDER}</b><span>${EMAIL_DASHBOARD_SUBTITLE}</span></div></div>

    <div class="group">
      <label class="label" for="season">Season <span style="font-weight:500">· S</span></label>
      <select class="select" id="season"></select>
    </div>

    <div class="group">
      <div class="label" id="lbl-view">Format</div>
      <div class="nav" role="radiogroup" aria-labelledby="lbl-view" id="views"></div>
    </div>

    <div class="opts">
      <div class="group">
        <div class="label" id="lbl-theme">Dashboard theme <span style="font-weight:500">· D</span></div>
        <div class="seg" role="radiogroup" aria-labelledby="lbl-theme" id="themes"></div>
      </div>
      <div class="group">
        <button class="switch" role="switch" id="sw-full" aria-checked="false"><span><b>Full email</b><small>Show the whole length · F</small></span><span class="track" aria-hidden="true"></span></button>
        <button class="switch" role="switch" id="sw-fit" aria-checked="true"><span><b>Fit to screen</b><small>Scale to see them all</small></span><span class="track" aria-hidden="true"></span></button>
      </div>
    </div>

    <div class="spacer"></div>
    <div class="ready">
      <b>Ready to send</b>
      <p>Inline-styled HTML for Gmail, Outlook and Apple Mail.</p>
      <button class="btn btn-inv" data-copy disabled>Copy HTML</button>
      <a class="btn btn-ghost" id="download" download>Download .html</a>
    </div>
  </aside>

  <main>
    <header>
      <div>
        <h1 id="title"></h1>
        <div class="chips" id="chips"></div>
      </div>
      <div class="actions">
        <a class="btn" id="open" target="_blank" rel="noopener">Open in tab ↗</a>
        <button class="btn btn-inv" data-copy disabled>Copy HTML</button>
      </div>
    </header>

    <div class="error" id="error" role="alert">
      <span>Couldn't load this email. Check that the dev server is running.</span>
      <button class="btn btn-inv" id="retry">Try again</button>
    </div>

    <div class="stage" id="stage"><div class="scaler" id="scaler"><div class="strip" id="strip"></div></div></div>

    <div class="panels">
      <section class="panel" aria-labelledby="h-inbox">
        <div><h2 id="h-inbox">Inbox <b>preview</b></h2><div class="sub">How it looks before opening</div></div>
        <div class="inbox">
          <div class="avatar" aria-hidden="true">VIP</div>
          <div>
            <div class="top"><strong>${SENDER}</strong><span style="color:var(--muted)">9:41</span></div>
            <div class="subj" id="subject"></div>
            <div class="pre" id="preheader"></div>
          </div>
        </div>
        <div class="counts"><span id="subj-n"></span><span id="pre-n"></span></div>
      </section>

      <section class="panel" aria-labelledby="h-check">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
          <div><h2 id="h-check">Send <b>checklist</b></h2><div class="sub" id="check-sum"></div></div>
          <div class="bar" aria-hidden="true"><i id="check-bar"></i></div>
        </div>
        <ul class="checks" id="checks"></ul>
      </section>
    </div>
  </main>
</div>
<div class="toast" role="status" aria-live="polite" id="toast"></div>

<script>
(() => {
  const CFG = ${config};
  const FRAMES = {
    desktop: { t1: "Desktop", t2: "600px", sub: "Gmail · Outlook · Apple Mail", w: 600, h: 820, outer: 648 },
    tablet: { t1: "Tablet", t2: "768px", sub: "iPad · portrait", w: 768, h: 1024, outer: 848 },
    mobile: { t1: "Mobile", t2: "375px", sub: "iPhone · Android", w: 375, h: 812, outer: 448 },
  };
  // Lucide paths: monitor-smartphone, monitor, tablet, smartphone.
  const VIEWS = [
    ["all", "All", "<path d='M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8'/><path d='M10 19v-3.96 3.15'/><path d='M7 19h5'/><rect width='6' height='10' x='16' y='12' rx='2'/>", "1"],
    ["desktop", "Desktop", "<rect width='20' height='14' x='2' y='3' rx='2'/><path d='M8 21h8'/><path d='M12 17v4'/>", "2"],
    ["tablet", "Tablet", "<rect width='16' height='20' x='4' y='2' rx='2'/><path d='M12 18h.01'/>", "3"],
    ["mobile", "Mobile", "<rect width='14' height='20' x='5' y='2' rx='2'/><path d='M12 18h.01'/>", "4"],
  ];
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };

  const q = new URLSearchParams(location.search);
  const state = {
    season: CFG.seasons.some((s) => s.key === q.get("season")) ? q.get("season") : CFG.seasons[0].key,
    view: store.get("ep-view") || "all",
    theme: store.get("ep-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"),
    full: false, fit: true, html: "", loading: true, error: false,
  };
  const cache = new Map();
  const url = () => "/email/confirmation/" + state.season;

  function radios(el, items, key, onPick) {
    el.innerHTML = items.map(([id, label, extra = ""]) => '<button role="radio" data-id="' + id + '" aria-checked="' + (state[key] === id) + '" tabindex="' + (state[key] === id ? 0 : -1) + '">' + extra + '<span>' + esc(label) + '</span></button>').join("");
    el.onclick = (e) => { const b = e.target.closest("button"); if (b) onPick(b.dataset.id); };
    el.onkeydown = (e) => {
      if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      const ids = items.map((i) => i[0]);
      const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
      const next = ids[(ids.indexOf(state[key]) + step + ids.length) % ids.length];
      onPick(next); el.querySelector('[data-id="' + next + '"]').focus();
    };
  }
  function paintControls() {
    document.documentElement.dataset.theme = state.theme;
    radios($("views"), VIEWS.map(([id, l, d]) => [id, l, '<span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + d + "</svg></span>"]), "view", (id) => set({ view: id }));
    $("views").querySelectorAll("button").forEach((b, i) => { b.setAttribute("aria-keyshortcuts", VIEWS[i][3]); b.insertAdjacentHTML("beforeend", '<kbd aria-hidden="true">' + VIEWS[i][3] + "</kbd>"); });
    radios($("themes"), [["light", "Light"], ["dark", "Dark"]], "theme", (id) => set({ theme: id }));
    [["sw-full", "full"], ["sw-fit", "fit"]].forEach(([id, k]) => $(id).setAttribute("aria-checked", state[k]));
    $("season").value = state.season;
    $("title").innerHTML = "Confirmation <b>email</b>";
    $("open").href = url();
    $("download").href = url();
    $("download").setAttribute("download", "confirmation-email-" + state.season + ".html");
    document.querySelectorAll("[data-copy]").forEach((b) => (b.disabled = !state.html));
  }

  function paintFrames() {
    const ids = state.view === "all" ? ["desktop", "tablet", "mobile"] : [state.view];
    const doc = state.html ? esc(state.html) : "";
    const frame = (id) => {
      const f = FRAMES[id];
      const ifr = state.loading
        ? '<div class="skeleton" style="width:' + f.w + "px;height:" + f.h + 'px"></div>'
        : '<iframe data-h="' + f.h + '" title="' + f.t1 + " preview, " + f.w + 'px" sandbox="allow-same-origin allow-popups" srcdoc="' + doc + '" style="width:' + f.w + "px;height:" + f.h + 'px"></iframe>';
      const device = id === "desktop"
        ? '<div class="desk" style="width:' + f.w + 'px"><div class="mailhead"><div class="avatar" aria-hidden="true">VIP</div><div style="min-width:0"><b>' + esc(meta().subject) + "</b><span>" + esc(CFG.sender) + "</span></div></div>" + ifr + "</div>"
        : id === "tablet" ? '<div class="tab">' + ifr + "</div>"
        : '<div class="phone"><div class="screen"><div class="status" aria-hidden="true"><span>9:41</span><i></i><span>5G</span></div>' + ifr + "</div></div>";
      return '<section class="frame" aria-label="' + f.t1 + ' preview" style="width:' + f.outer + 'px"><div class="fhead"><div><div class="ft">' + f.t1.toUpperCase() + " <b>" + f.t2.toUpperCase() + '</b></div><div class="fs">' + f.sub + '</div></div><button class="fbtn" data-focus="' + id + '">' + (state.view === "all" ? "View only this" : "View all") + "</button></div><div class=\\"device\\">" + device + "</div></section>";
    };
    $("strip").innerHTML = ids.map(frame).join("");
    $("strip").querySelectorAll("iframe").forEach((f) => f.addEventListener("load", () => size(f)));
    $("strip").querySelectorAll("[data-focus]").forEach((b) => (b.onclick = () => set({ view: state.view === "all" ? b.dataset.focus : "all" })));
    fit();
  }

  function size(iframe) {
    const d = iframe.contentDocument;
    if (!d || !d.documentElement) return;
    if (!d.getElementById("ep-noscroll")) {
      const st = d.createElement("style"); st.id = "ep-noscroll";
      st.textContent = "html{scrollbar-width:none}html::-webkit-scrollbar{display:none}";
      d.head && d.head.appendChild(st);
    }
    d.documentElement.style.overflowY = state.full ? "hidden" : "";
    if (state.full) {
      iframe.style.height = "0px";
      iframe.style.height = Math.max(d.documentElement.scrollHeight, 200) + "px";
      d.querySelectorAll("img").forEach((im) => { if (!im.complete) im.addEventListener("load", () => size(iframe), { once: true }); });
    } else iframe.style.height = iframe.dataset.h + "px";
  }

  function fit() {
    const ids = state.view === "all" ? ["desktop", "tablet", "mobile"] : [state.view];
    const natW = ids.reduce((s, id) => s + FRAMES[id].outer, 0) + 16 * (ids.length - 1);
    const natH = Math.max(...ids.map((id) => FRAMES[id].h + 160));
    const stage = $("stage");
    const wide = innerWidth >= 1100;
    const widthFit = Math.min(1, stage.clientWidth / natW);
    const availH = Math.max(320, innerHeight - Math.min(stage.getBoundingClientRect().top + scrollY, 200) - 16);
    let z = widthFit;
    if (!state.full && wide) z = Math.min(widthFit, Math.max(availH / natH, widthFit * 0.6));
    if (!state.fit) z = 1;
    // Snap to whole device pixels (k / dpr): fractional scales leave hairline
    // seams between the email's table rows. Too narrow for the smallest step scrolls.
    const step = 1 / Math.max(2, Math.round(devicePixelRatio || 1));
    const raw = z;
    z = Math.max(step, Math.floor(z / step + 1e-6) * step);
    const strip = $("strip");
    strip.style.transform = z === 1 ? "" : "scale(" + z + ")";
    $("scaler").style.width = strip.offsetWidth * z + "px";
    $("scaler").style.height = strip.offsetHeight * z + "px";
    stage.classList.toggle("scroll", !state.fit || z > raw);
    chips(z);
  }

  function meta() {
    if (!state.html) return { subject: "Loading…", preheader: "" };
    const d = new DOMParser().parseFromString(state.html, "text/html");
    const pre = d.querySelector('body > div[style*="display:none"]');
    return { subject: (d.title || "").trim(), preheader: pre ? pre.textContent.trim() : "", doc: d };
  }

  function chips(z) {
    const season = CFG.seasons.find((s) => s.key === state.season);
    const kb = state.html ? (new Blob([state.html]).size / 1024).toFixed(0) + " KB" : "…";
    $("chips").innerHTML = [season.label, "Scale " + Math.round(z * 100) + "%", kb].map((c) => "<span>" + esc(c) + "</span>").join("");
  }

  function paintPanels() {
    const m = meta();
    $("subject").textContent = m.subject;
    $("preheader").textContent = m.preheader;
    $("subj-n").textContent = "Subject: " + m.subject.length + " characters";
    $("pre-n").textContent = "Preview text: " + m.preheader.length + " characters";
    let rows;
    if (!m.doc) rows = [{ ok: true, label: state.error ? "Couldn't analyze" : "Analyzing…", det: "" }];
    else {
      const d = m.doc, html = state.html;
      const kb = new Blob([html]).size / 1024;
      const imgs = [...d.querySelectorAll("img")];
      const alt = imgs.filter((i) => i.hasAttribute("alt")).length;
      const svg = imgs.filter((i) => /\\.svg(\\?|$)/i.test(i.getAttribute("src") || "")).length;
      const rel = imgs.filter((i) => !/^https?:/i.test(i.getAttribute("src") || "")).length;
      const links = [...d.querySelectorAll("a[href]")];
      const dead = links.filter((a) => ["#", ""].includes(a.getAttribute("href").trim())).length;
      const scripts = d.querySelectorAll("script").length;
      rows = [
        { ok: kb < 90, label: "Under Gmail clipping limit", det: kb.toFixed(1) + " / 102 KB" },
        { ok: alt === imgs.length, label: "Images have alt text", det: alt + "/" + imgs.length },
        { ok: rel === 0, label: "Absolute image URLs", det: rel ? rel + " relative" : "all absolute" },
        { ok: dead === 0, label: "Working links", det: links.length + " links" + (dead ? ", " + dead + " empty" : "") },
        { ok: m.preheader.length > 0, label: "Preview text", det: m.preheader ? "included" : "missing" },
        { ok: svg === 0, label: "Compatible images", det: svg ? svg + " SVG → switch to PNG" : "PNG/JPG" },
        { ok: scripts === 0, label: "No scripts", det: scripts ? scripts + " found" : "none" },
      ];
    }
    const ok = rows.filter((r) => r.ok).length;
    $("check-sum").textContent = ok + " of " + rows.length + " ready";
    $("check-bar").style.width = Math.round((ok / rows.length) * 100) + "%";
    $("checks").innerHTML = rows.map((r) => '<li><span class="mark ' + (r.ok ? "ok" : "warn") + '" role="img" aria-label="' + (r.ok ? "Passed" : "Needs attention") + '">' + (r.ok ? "✓" : "!") + '</span><span class="lbl">' + esc(r.label) + '</span><span class="det">' + esc(r.det) + "</span></li>").join("");
    $("error").classList.toggle("on", state.error);
  }

  async function load() {
    const key = url();
    state.loading = !cache.has(key); state.error = false; state.html = cache.get(key) || "";
    paintAll();
    if (!state.loading) return;
    try {
      const r = await fetch(key);
      if (!r.ok) throw new Error(r.status);
      cache.set(key, await r.text());
      if (key !== url()) return;
      state.html = cache.get(key);
    } catch { if (key === url()) state.error = true; }
    state.loading = false;
    paintAll();
  }

  function paintAll() { paintControls(); paintFrames(); paintPanels(); }

  function set(patch, reload) {
    Object.assign(state, patch);
    store.set("ep-view", state.view); store.set("ep-theme", state.theme);
    if (patch.season) history.replaceState(null, "", "?season=" + state.season);
    if (reload) return load();
    if ("full" in patch) { paintControls(); document.querySelectorAll("#strip iframe").forEach(size); fit(); return; }
    if ("fit" in patch || "theme" in patch) { paintControls(); fit(); return; }
    paintAll();
  }

  let toastT;
  function toast(msg) { $("toast").textContent = msg; $("toast").classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => $("toast").classList.remove("on"), 2000); }

  $("season").innerHTML = CFG.seasons.map((s) => '<option value="' + s.key + '">' + esc(s.label) + "</option>").join("");
  $("season").onchange = (e) => set({ season: e.target.value }, true);
  $("sw-full").onclick = () => set({ full: !state.full });
  $("sw-fit").onclick = () => set({ fit: !state.fit });
  $("retry").onclick = () => { cache.delete(url()); load(); };
  document.querySelectorAll("[data-copy]").forEach((b) => (b.onclick = () => {
    if (!state.html) return;
    navigator.clipboard.writeText(state.html).then(() => toast("HTML copied to clipboard"), () => toast("Couldn't copy. Use Download."));
  }));
  addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || /^(input|textarea|select)$/i.test(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    const map = { 1: "all", 2: "desktop", 3: "tablet", 4: "mobile" };
    if (map[k]) set({ view: map[k] });
    else if (k === "d") set({ theme: state.theme === "dark" ? "light" : "dark" });
    else if (k === "f") set({ full: !state.full });
    else if (k === "s") $("season").focus();
  });
  const ro = new ResizeObserver(() => fit());
  ro.observe($("stage"));
  ro.observe($("strip"));
  load();
})();
</script>
</body>
</html>`;
}
