/* Latent landing — what the desktop page (site.js) and the phone page (mobile.js) share:
   the real sessions, the app's stickers and clocks, and the builders that draw the Track and
   Share visuals into whichever markup calls them. Exposed as window.LATENT. */

(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = t => t * t * (3 - 2 * t);
  const NS = "http://www.w3.org/2000/svg";
  const pad2 = n => String(n).padStart(2, "0");
  const hm = min => { min = Math.round(min); return `${Math.floor(min / 60)}h ${Math.round(min % 60)}m`; };
  const hms = sec => `${Math.floor(sec / 3600)}:${pad2(Math.floor((sec % 3600) / 60))}:${pad2(Math.floor(sec % 60))}`;
  const ms = sec => `${Math.floor(sec / 60)}:${pad2(Math.floor(sec % 60))}`;

  /* ── real sessions from the app (friends-visible posts, used with permission) ── */
  const S = "assets/sessions/";
  const SESSIONS = [
    { f: "sydney-00", u: "sydney", tag: "IMM 703A", dur: "3h 00m", date: "SEP 25 · 9:11 PM" },
    { f: "sydney-01", u: "sydney", tag: "IMMUN 201", dur: "2h 10m", date: "SEP 26 · 7:18 PM" },
    { f: "sydney-02", u: "sydney", tag: "IMM 701A", dur: "1h 50m", date: "SEP 16 · 10:25 PM" },
    { f: "landon-03", u: "landon", tag: "Math", dur: "2h 58m", date: "AUG 13 · 9:52 PM" },
    { f: "landon-04", u: "landon", tag: "Cubing", dur: "1h 25m", date: "SEP 27 · 2:56 PM" },
    { f: "landon-05", u: "landon", tag: "Misc", dur: "52m", date: "JUL 13 · 11:01 PM" },
    { f: "krabbykai-06", u: "krabbykai", tag: "Coding", dur: "5h 00m", date: "SEP 26 · 9:30 PM" },
    { f: "krabbykai-07", u: "krabbykai", tag: "Making", dur: "4h 36m", date: "SEP 14 · 8:26 PM" },
    { f: "krabbykai-08", u: "krabbykai", tag: "Studying", dur: "5h 08m", date: "SEP 13 · 11:37 PM" },
    { f: "rosie-09", u: "rosie", tag: "heart", dur: "1h 32m", date: "SEP 11 · 8:31 AM" },
    { f: "rosie-10", u: "rosie", tag: "Creator", dur: "1h 29m", date: "JUL 31 · 11:43 PM" },
    { f: "rosie-11", u: "rosie", tag: "Writer", dur: "1h 25m", date: "SEP 10 · 10:20 PM" },
    { f: "chloe-12", u: "chloe", tag: "math", dur: "4h 07m", date: "SEP 15 · 5:14 PM" },
    { f: "chloe-13", u: "chloe", tag: "chem", dur: "3h 53m", date: "SEP 19 · 12:39 PM" },
    { f: "rjho-15", u: "rjho", tag: "Academics", dur: "3h 25m", date: "SEP 23 · 9:42 PM" },
    { f: "rjho-17", u: "rjho", tag: "Other", dur: "2h 19m", date: "SEP 25 · 11:43 PM" },
    { f: "philan_jin-19", u: "philan_jin", tag: "Homework (yawnnn)", dur: "4h 00m", date: "SEP 13 · 12:04 PM" },
    { f: "philan_jin-20", u: "philan_jin", tag: "Bag chasing ✌️", dur: "2h 34m", date: "JUL 31 · 9:11 AM" },
    { f: "eddie-21", u: "eddie", tag: "Building Latent", dur: "2h 51m", date: "SEP 15 · 8:42 PM" },
    { f: "eddie-22", u: "eddie", tag: "Studying Math", dur: "1h 35m", date: "JUL 19 · 1:19 AM" },
    { f: "eddie-23", u: "eddie", tag: "Other", dur: "33m", date: "SEP 22 · 5:36 PM" },
    { f: "malcolm-24", u: "malcolm", tag: "Building Latent", dur: "2h 20m", date: "SEP 17 · 1:36 PM" },
    { f: "malcolm-26", u: "malcolm", tag: "Other", dur: "26m", date: "SEP 9 · 10:19 PM" },
    { f: "sydney-b01", u: "sydney", tag: "IMMUN 201", dur: "1h 45m", date: "SEP 20 · 9:09 PM" },
    { f: "sydney-b02", u: "sydney", tag: "MCB 169", dur: "1h 40m", date: "SEP 28 · 3:22 PM" },
    { f: "sydney-b03", u: "sydney", tag: "HTGAA", dur: "1h 34m", date: "SEP 25 · 3:12 AM" },
    { f: "landon-b04", u: "landon", tag: "Math", dur: "1h 18m", date: "AUG 13 · 12:28 AM" },
    { f: "landon-b06", u: "landon", tag: "Math", dur: "1h 05m", date: "AUG 11 · 7:46 PM" },
    { f: "krabbykai-b08", u: "krabbykai", tag: "Making", dur: "3h 43m", date: "SEP 8 · 8:01 PM" },
    { f: "krabbykai-b10", u: "krabbykai", tag: "Studying", dur: "3h 05m", date: "SEP 20 · 11:08 PM" },
    { f: "rosie-b12", u: "rosie", tag: "Student", dur: "1h 17m", date: "SEP 17 · 6:11 PM" },
    { f: "rosie-b14", u: "rosie", tag: "Writer", dur: "27m", date: "AUG 27 · 7:33 PM" },
    { f: "rosie-b15", u: "rosie", tag: "Student", dur: "2h 08m", date: "SEP 28 · 12:24 PM" },
    { f: "chloe-b16", u: "chloe", tag: "math", dur: "5h 02m", date: "AUG 31 · 4:06 PM" },
    { f: "chloe-b17", u: "chloe", tag: "chem", dur: "3h 32m", date: "SEP 27 · 1:08 PM" },
    { f: "chloe-b18", u: "chloe", tag: "chem", dur: "3h 14m", date: "SEP 9 · 5:37 PM" },
    { f: "chloe-b19", u: "chloe", tag: "Other", dur: "2h 39m", date: "AUG 30 · 5:57 PM" },
    { f: "rjho-b20", u: "rjho", tag: "Academics", dur: "2h 24m", date: "SEP 27 · 3:45 PM" },
    { f: "rjho-b21", u: "rjho", tag: "Content", dur: "2h 12m", date: "SEP 26 · 2:10 PM" },
    { f: "philan_jin-b24", u: "philan_jin", tag: "Homework (yawnnn)", dur: "5h 00m", date: "AUG 23 · 4:35 PM" },
    { f: "philan_jin-b26", u: "philan_jin", tag: "Homework (yawnnn)", dur: "3h 00m", date: "AUG 26 · 5:14 PM" },
    { f: "philan_jin-b27", u: "philan_jin", tag: "Homework (yawnnn)", dur: "2h 32m", date: "AUG 17 · 5:33 PM" },
    { f: "eddie-b28", u: "eddie", tag: "Building Latent", dur: "2h 33m", date: "APR 3 · 7:49 AM" },
    { f: "eddie-b29", u: "eddie", tag: "Building Latent", dur: "1h 31m", date: "AUG 5 · 12:37 AM" },
    { f: "eddie-b30", u: "eddie", tag: "Building Latent", dur: "1h 25m", date: "AUG 24 · 6:18 PM" },
    { f: "eddie-b31", u: "eddie", tag: "Building Latent", dur: "1h 23m", date: "AUG 19 · 4:30 PM" },
    { f: "malcolm-b32", u: "malcolm", tag: "Building Latent", dur: "1h 44m", date: "SEP 23 · 10:08 AM" },
    { f: "malcolm-b34", u: "malcolm", tag: "Building Latent", dur: "1h 36m", date: "SEP 22 · 2:46 PM" },
    { f: "sydney-c00", u: "sydney", tag: "MCB 169", dur: "1h 31m", date: "SEP 25 · 3:35 PM" },
    { f: "sydney-c01", u: "sydney", tag: "HTGAA", dur: "1h 27m", date: "SEP 28 · 6:00 PM" },
    { f: "sydney-c02", u: "sydney", tag: "IMM 703A", dur: "1h 25m", date: "SEP 20 · 5:40 PM" },
    { f: "sydney-c03", u: "sydney", tag: "IMMUN 201", dur: "1h 15m", date: "SEP 21 · 4:45 PM" },
    { f: "landon-c05", u: "landon", tag: "Misc", dur: "34m", date: "SEP 27 · 8:03 PM" },
    { f: "landon-c06", u: "landon", tag: "French", dur: "30m", date: "AUG 21 · 8:11 AM" },
    { f: "landon-c07", u: "landon", tag: "Misc", dur: "29m", date: "SEP 27 · 6:25 PM" },
    { f: "landon-c08", u: "landon", tag: "Misc", dur: "1h 57m", date: "AUG 30 · 8:00 PM" },
    { f: "landon-c09", u: "landon", tag: "Writing", dur: "1h 57m", date: "SEP 14 · 7:36 PM" },
    { f: "krabbykai-c10", u: "krabbykai", tag: "Coding", dur: "2h 57m", date: "SEP 27 · 3:07 PM" },
    { f: "krabbykai-c12", u: "krabbykai", tag: "Other", dur: "2h 49m", date: "SEP 7 · 1:04 PM" },
    { f: "rosie-c15", u: "rosie", tag: "heart", dur: "2h 00m", date: "SEP 24 · 7:52 AM" },
    { f: "rosie-c16", u: "rosie", tag: "Student", dur: "1h 24m", date: "AUG 21 · 7:49 AM" },
    { f: "rosie-c17", u: "rosie", tag: "Student", dur: "1h 19m", date: "SEP 20 · 11:59 PM" },
    { f: "rosie-c18", u: "rosie", tag: "Student", dur: "1h 10m", date: "SEP 2 · 12:38 PM" },
    { f: "chloe-c20", u: "chloe", tag: "chem", dur: "2h 25m", date: "SEP 8 · 4:44 PM" },
    { f: "chloe-c21", u: "chloe", tag: "Other", dur: "2h 24m", date: "AUG 17 · 5:40 PM" },
    { f: "chloe-c22", u: "chloe", tag: "Other", dur: "2h 13m", date: "AUG 19 · 3:30 PM" },
    { f: "chloe-c23", u: "chloe", tag: "anatomy", dur: "2h 05m", date: "SEP 21 · 5:09 PM" },
    { f: "chloe-c24", u: "chloe", tag: "Other", dur: "2h 04m", date: "AUG 20 · 8:29 PM" },
    { f: "rjho-c25", u: "rjho", tag: "Academics", dur: "1h 34m", date: "SEP 24 · 9:37 PM" },
    { f: "rjho-c27", u: "rjho", tag: "Academics", dur: "1h 29m", date: "SEP 24 · 11:28 PM" },
    { f: "rjho-c29", u: "rjho", tag: "Academics", dur: "1h 24m", date: "SEP 24 · 10:21 AM" },
    { f: "philan_jin-c30", u: "philan_jin", tag: "Homework (yawnnn)", dur: "2h 31m", date: "SEP 12 · 2:34 PM" },
    { f: "philan_jin-c31", u: "philan_jin", tag: "Studying", dur: "2h 16m", date: "JUL 28 · 6:14 PM" },
    { f: "philan_jin-c33", u: "philan_jin", tag: "Bag chasing ✌️", dur: "1h 50m", date: "JUL 21 · 12:07 PM" },
    { f: "eddie-c35", u: "eddie", tag: "Building Latent", dur: "1h 21m", date: "SEP 24 · 1:38 PM" },
    { f: "eddie-c36", u: "eddie", tag: "Building Latent", dur: "1h 05m", date: "AUG 4 · 4:46 PM" },
    { f: "eddie-c37", u: "eddie", tag: "Building Latent", dur: "1h 04m", date: "AUG 18 · 8:37 PM" },
    { f: "eddie-c38", u: "eddie", tag: "Building Latent", dur: "1h 04m", date: "AUG 29 · 12:22 PM" },
    { f: "eddie-c39", u: "eddie", tag: "Building Latent", dur: "55m", date: "AUG 23 · 4:11 PM" },
    { f: "malcolm-c40", u: "malcolm", tag: "Building Latent", dur: "1h 34m", date: "SEP 17 · 7:34 PM" },
    { f: "malcolm-c41", u: "malcolm", tag: "Building Latent", dur: "1h 32m", date: "SEP 25 · 9:58 AM" },
    { f: "malcolm-c42", u: "malcolm", tag: "Building Latent", dur: "1h 23m", date: "SEP 14 · 9:30 PM" },
    { f: "malcolm-c43", u: "malcolm", tag: "Building Latent", dur: "1h 15m", date: "SEP 18 · 12:27 PM" },
    { f: "malcolm-c44", u: "malcolm", tag: "Building Latent", dur: "1h 12m", date: "SEP 22 · 7:23 PM" },
  ];
  const AVATAR = { sydney: 1, krabbykai: 1, rosie: 1, chloe: 1, rjho: 1, philan_jin: 1, eddie: 1, malcolm: 1 };
  const byF = Object.fromEntries(SESSIONS.map(s => [s.f, s]));

  // `s` null is the hero's slot: the desktop montage, or (hero === false) an empty slot the phone page fills itself
  function tile(s, hero = true) {
    if (!s && !hero) return `<div class="t t--slot" data-hero-tile></div>`;
    if (!s) return `<div class="t t--hero" data-hero-tile><video src="assets/media/montage.mp4" poster="assets/media/montage-poster.jpg" muted loop playsinline autoplay preload="auto"></video></div>`;
    const who = AVATAR[s.u] ? `<img src="${S}av-${s.u}.jpg" alt="" decoding="async">` : `<i>${s.u[0].toUpperCase()}</i>`;
    return `<div class="t" data-vt><img src="${S}${s.f}.jpg" alt="" decoding="async"><video data-src="${S}${s.f}.mp4" muted loop playsinline preload="none"></video><div class="t__shade"></div>` +
      `<div class="t__who">${who}@${s.u}</div><div class="stk"><b>${s.tag}</b><span>${s.dur}</span><em>${s.date}</em></div></div>`;
  }

  // Lay sessions out so no one appears twice and no one sits directly beside or above themselves.
  function place(nCols, perCol, skip, offset = 0) {
    const byUser = {};
    SESSIONS.forEach(s => (byUser[s.u] = byUser[s.u] || []).push(s));
    const pool = [], users = Object.keys(byUser);
    for (let i = 0; pool.length < SESSIONS.length; i++) users.forEach(u => byUser[u][i] && pool.push(byUser[u][i]));
    const order = pool.slice(offset).concat(pool.slice(0, offset));
    const used = new Set(), grid = [];
    for (let c = 0; c < nCols; c++) {
      grid[c] = [];
      for (let r = 0; r < perCol(c); r++) {
        if (skip && skip(c, r)) { grid[c].push(null); continue; }
        const above = grid[c][r - 1], left = c ? grid[c - 1][r] : null;
        let s = order.find(x => !used.has(x.f) && x.u !== (above && above.u) && x.u !== (left && left.u));
        if (!s) s = order.find(x => !used.has(x.f));
        if (!s) { used.clear(); s = order.find(x => x.u !== (above && above.u)) || order[0]; }
        used.add(s.f); grid[c].push(s);
      }
    }
    return grid;
  }


  /* ── 02 · track: chloe's sessions, then rjho's real week by tag and his last nine weeks ── */
  const WEEK = [{ Academics: 90 }, { Content: 221, Academics: 60 }, {}, { Academics: 315 }, { Academics: 535 }, { Business: 112, Academics: 162, Other: 140 }, { "Med School": 45, Content: 295 }];
  const TAGC = { Academics: "#C0705A", Content: "#A86597", Business: "#85977A", "Med School": "#658BA8", Other: "#8E7BA6" };
  const HEAT = [0, 0, 1.07, 5.87, 0, 10.11, 3.91, 5.9, 8.64, 4.09, 8.91, 2.6, 7.59, 2.19, 7.47, 9.99, 3.16, 3.48, 5.36, 0, 0.41, 1.9, 3.78, 1.87, 2.6, 0, 2.66, 0.79, 3.92, 1.97, 0.46, 3.0, 3.45, 5.51, 6.23, 6.4, 3.22, 5.47, 4.13, 2.08, 4.69, 1.41, 6.17, 7.32, 5.33, 1.1, 6.66, 3.37, 3.48, 8.91, 2.08, 2.27, 1.06, 6.29, 2.08, 0.68, 1.5, 4.68, 0, 5.25, 8.91, 6.9, 5.66];
  const WEEKS = HEAT.length / 7;
  const lvl = h => (h <= 0 ? 0 : h < 1 ? 1 : h < 2 ? 2 : h < 3 ? 3 : 4);

  function buildBars(barsEl, legendEl) {
    const dayTotal = d => Object.values(d).reduce((a, b) => a + b, 0);
    const maxDay = Math.max(...WEEK.map(dayTotal));
    barsEl.innerHTML = WEEK.map((d, i) => `<div class="bar">${Object.entries(d).map(([k, v]) => `<i style="height:${(v / maxDay * 100).toFixed(1)}%;background:${TAGC[k]};--d:${i}" title="${k} · ${hm(v)}"></i>`).join("")}</div>`).join("");
    if (legendEl) legendEl.innerHTML = Object.entries(TAGC).map(([k, c]) => `<span><i style="background:${c}"></i>${k}</span>`).join("");
  }
  // returns fill(k): light the first k weeks of the calendar
  function buildHeat(heatEl) {
    heatEl.innerHTML = HEAT.map((h, i) => `<i data-l="${lvl(h)}" data-w="${Math.floor(i / 7)}" title="${h ? hm(h * 60) : "—"}"></i>`).join("");
    const cells = $$("i", heatEl);
    return k => cells.forEach(c => { c.dataset.on = +c.dataset.w < k ? c.dataset.l : "0"; });
  }
  function buildProfile(pgridEl) {
    const CHLOE = ["chloe-12", "chloe-b16", "chloe-13", "chloe-b17", "chloe-b18", "chloe-b19"].map(f => byF[f]);
    pgridEl.innerHTML = CHLOE.map((s, i) => `<a style="--i:${i}"><img src="${S}${s.f}.jpg" alt="${s.tag}, ${s.dur}" loading="lazy" decoding="async"><video data-src="${S}${s.f}.mp4" muted loop playsinline preload="none"></video><span><b>${s.dur}</b><small>${s.tag}</small></span></a>`).join("");
  }

  /* ── 03 · share ── */
  const BOARD = [
    { u: "rjho", days: [1.5, 4.68, 0, 5.25, 8.91, 6.9, 5.66], tags: [["Academics", 19.36, "C0705A"], ["Content", 8.59, "A86597"], ["Other", 2.33, "8E7BA6"]] },
    { u: "krabbykai", days: [3.08, 4.66, 5.17, 3.87, 3.04, 2.71, 5.36], tags: [["Studying", 11.67, "85977A"], ["Writing", 6.28, "A06C8A"], ["Coding", 5.01, "C2A24E"]] },
    { u: "sydney", days: [7.15, 3.15, 0, 2.54, 1.95, 6.86, 2.17], tags: [["IMMUN 201", 10.53, "C2A24E"], ["IMM 703A", 7.53, "B0925C"], ["HTGAA", 2.48, "87A75E"]] },
    { u: "malcolm", days: [.75, 4.18, 3.42, 1.96, .5, 2.64, 1.25], tags: [["Building Latent", 13.96, "C2A24E"]] },
    { u: "rosie", days: [1.32, 1.18, .9, .66, 2.01, 0, 0], tags: [["heart", 2.67, "6598A8"], ["Writer", 2.08, "C2A24E"], ["Student", 1.32, "7165A8"]] },
  ];
  BOARD.forEach(b => (b.total = b.days.reduce((a, c) => a + c, 0)));
  const TOP = BOARD[0].total;
  const GROUP_MIN = Math.round(BOARD.reduce((t, b) => t + b.total, 0) * 60);

  function buildBoard(boardEl, rows = BOARD.length) {
    boardEl.innerHTML = BOARD.slice(0, rows).map((b, i) => {
      const tagsum = b.tags.reduce((a, t) => a + t[1], 0);
      return `<li><span class="board__rank">${i + 1}</span><img src="${S}av-${b.u}.jpg" alt=""><div><strong>@${b.u}</strong>${i === BOARD.length - 1 ? '<button class="board__nudge" type="button" data-nudge>Nudge</button>' : ""}<div class="board__tags" style="--w:${(b.total / TOP).toFixed(3)};--d:${i}">${b.tags.map(t => `<i style="flex:${(t[1] / tagsum).toFixed(3)};background:#${t[2]}" title="${t[0]}"></i>`).join("")}</div></div><em>${hm(b.total * 60)}</em></li>`;
    }).join("");
  }
  // five friends' hours adding up across the week; returns draw(motion) to animate the lines in
  function buildRace(svg) {
    const RW = 320, RH = 150;
    [40, 80, 120].forEach(y => { const l = document.createElementNS(NS, "line"); l.setAttribute("x1", 0); l.setAttribute("x2", RW); l.setAttribute("y1", y); l.setAttribute("y2", y); l.setAttribute("class", "race__grid"); svg.appendChild(l); });
    const lines = BOARD.map((b, i) => {
      let acc = 0; const pts = [[0, RH]];
      b.days.forEach((d, k) => { acc += d; pts.push([((k + 1) / 7) * RW, RH - (acc / TOP) * (RH - 12)]); });
      const dAttr = pts.map((p, k) => { if (!k) return `M${p[0]},${p[1]}`; const q = pts[k - 1], cx = (q[0] + p[0]) / 2; return `C${cx},${q[1]} ${cx},${p[1]} ${p[0]},${p[1]}`; }).join(" ");
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", dAttr);
      path.setAttribute("stroke", i === 0 ? "#E8C95F" : `rgba(247,243,234,${[0, .8, .55, .38, .24][i]})`);
      svg.appendChild(path);
      const end = pts[pts.length - 1], img = document.createElementNS(NS, "image");
      img.setAttributeNS("http://www.w3.org/1999/xlink", "href", `${S}av-${b.u}.jpg`);
      img.setAttribute("x", end[0] - 9); img.setAttribute("y", end[1] - 9); img.setAttribute("width", 18); img.setAttribute("height", 18);
      img.setAttribute("clip-path", "circle(9px at 9px 9px)"); img.style.opacity = 0;
      svg.appendChild(img);
      return { path, img, len: path.getTotalLength() + 2 };
    });
    return motion => lines.forEach(({ path, img, len }, i) => {
      path.style.strokeDasharray = len;
      if (!motion) { path.style.strokeDashoffset = 0; img.style.opacity = 1; return; }
      path.style.strokeDashoffset = len;
      gsap.to(path, { strokeDashoffset: 0, duration: 2, delay: i * .12, ease: "power2.inOut" });
      gsap.to(img, { opacity: 1, duration: .4, delay: i * .12 + 1.8 });
    });
  }
  // live now: the app's live look (red dot on the face, a red ticking clock, "Locked in")
  const LIVE = [["rjho", "Academics", 56 * 60 + 12], ["krabbykai", "Studying", 1 * 3600 + 32 * 60 + 6], ["sydney", "IMMUN 201", 18 * 60 + 41]];
  function buildLive(listEl, reduce) {
    listEl.innerHTML = LIVE.map(([u, tag, t], i) => `<li style="--i:${i}"><span class="live__av"><img src="${S}av-${u}.jpg" alt=""><i></i></span><div><b>@${u}</b><small><span class="live__clock" data-live-t="${t}">${t >= 3600 ? hms(t) : ms(t)}</span> · ${tag}</small></div></li>`).join("");
    const clocks = $$("[data-live-t]", listEl);
    if (!reduce) setInterval(() => clocks.forEach(el => { const t = ++el.dataset.liveT; el.textContent = t >= 3600 ? hms(t) : ms(t); }), 1000);
  }

  // an Instagram story wearing the app's default sticker, plus whichever timer is picked in the tray
  const IG = { tag: "BUILDING LATENT", dur: "2h 51m", secs: 2 * 3600 + 51 * 60, date: "SEP 15 · 8:42 PM", start: 20 * 3600 + 42 * 60 };
  const stkrHTML = (kind, x) => {
    const tag = `<b class="stkr__tag">${x.tag}</b>`, dur = `<span class="stkr__dur">${x.dur}</span>`, date = `<span class="stkr__date">${x.date}</span>`;
    const mark = `<img class="stkr__mark" src="assets/img/wordmark.png" alt="">`;
    if (kind === "none") return "";
    return ({ classic: tag + dur + date, focusDuration: tag + dur, durationDate: dur + date, duration: dur, focus: tag })[kind] + mark;
  };
  const wallClock = t => { const h24 = Math.floor(t / 3600) % 24, h = h24 % 12 || 12; return [`${h}:${pad2(Math.floor(t % 3600 / 60))}:${pad2(Math.floor(t % 60))}`, h24 < 12 ? "AM" : "PM"]; };
  function clkHTML(face, el, rem, frac) {
    if (face === "timer") return `<span class="clk__big">${el >= 3600 || rem >= 3600 ? hms(rem) : ms(rem)}</span>`;
    if (face === "stopwatch") return `<span class="clk__big">${el >= 3600 ? hms(el) : ms(el)}</span>`;
    if (face === "clock") { const [t, s2] = wallClock(IG.start + el); return `<span class="clk__wall"><b>${t}</b><small>${s2}</small></span>`; }
    if (face === "ring") {
      const r = 150 - 8, c = 2 * Math.PI * r;
      return `<svg viewBox="0 0 300 300"><circle cx="150" cy="150" r="${r}" fill="none" stroke="#F7F3EA" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(c * frac).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 150 150)"/></svg><span class="clk__ring">${hms(rem)}</span>`;
    }
    return "";
  }
  const STICKERS = [["none", "None"], ["classic", "Classic"], ["focusDuration", "Tag + duration"], ["durationDate", "Duration + date"], ["duration", "Duration"], ["focus", "Tag"]];
  const TIMERS = [["none", "None"], ["timer", "Timer"], ["stopwatch", "Stopwatch"], ["clock", "Clock"], ["ring", "Ring"]];
  const TORTOISE = `<svg viewBox="0 0 24 24" aria-label="Slower"><path d="M2.5 15.5c0-4.4 3.8-7.5 8.5-7.5s8.5 3.1 8.5 7.5z" fill="currentColor"/><circle cx="21" cy="13.6" r="2" fill="currentColor"/><rect x="5" y="15" width="3" height="3.5" rx="1.2" fill="currentColor"/><rect x="14" y="15" width="3" height="3.5" rx="1.2" fill="currentColor"/></svg>`;
  const HARE = `<svg viewBox="0 0 24 24" aria-label="Faster"><ellipse cx="10.5" cy="15" rx="7" ry="4.6" fill="currentColor"/><circle cx="18" cy="11.2" r="3.2" fill="currentColor"/><ellipse cx="16.6" cy="5.6" rx="1.4" ry="4" transform="rotate(-18 16.6 5.6)" fill="currentColor"/><ellipse cx="19.6" cy="5.9" rx="1.4" ry="4" transform="rotate(12 19.6 5.9)" fill="currentColor"/><circle cx="3.4" cy="13.4" r="1.7" fill="currentColor"/><rect x="11" y="17.5" width="7" height="2.5" rx="1.2" fill="currentColor"/></svg>`;

  // The edit tray (stickers / timers / trim / speed) driving the story it sits beside. Works on
  // whatever markup carries the data-ig-* / data-tray* hooks under `root`.
  function makeTray(root, { reduce, tourMs = 1500 } = {}) {
    const tray = { tab: "stickers", sticker: "classic", timer: "none", auto: true, trim: [0, 1], speed: 1 };
    const igSticker = $("[data-ig-sticker]", root), igClock = $("[data-ig-clock]", root), igVideo = $("[data-ig-video]", root), igBar = $("[data-ig-bar]", root), grid = $("[data-tray-grid]", root);
    const tabBtns = $$("[data-tab-kind]", root);
    const sample = { tag: "BUILDING", dur: IG.dur, date: IG.date };
    const STRIP = Array.from({ length: 8 }, (_, i) => `<img src="assets/strip/e21-${String(i + 1).padStart(2, "0")}.jpg" alt="">`).join("");
    const SPEED_F = v => (v - .5) / 2.5;
    const SRC_SECS = 10;                                    // the saved timelapse is about ten seconds
    const clipLen = () => (tray.trim[1] - tray.trim[0]) * SRC_SECS / tray.speed;
    function drawTray() {
      tabBtns.forEach(b => b.classList.toggle("on", b.dataset.tabKind === tray.tab));
      if (tray.tab === "trim") {
        const [a0, a1] = tray.trim;
        grid.innerHTML = `<div class="trim"><div class="trim__strip">${STRIP}<span class="trim__keep" style="left:${(a0 * 100).toFixed(1)}%;right:${((1 - a1) * 100).toFixed(1)}%"></span><span class="trim__head" data-trim-head></span></div>
          <div class="trim__read"><span>Keep <b>${ms((a1 - a0) * SRC_SECS)}</b> of ${ms(SRC_SECS)}</span><span>Drag the handles to trim</span></div></div>`;
      } else if (tray.tab === "speed") {
        const f = SPEED_F(tray.speed);
        grid.innerHTML = `<div class="speed"><div class="speed__row">${TORTOISE}<div class="speed__track"><span class="speed__fill" style="width:${(f * 100).toFixed(1)}%"></span><span class="speed__knob" style="left:${(f * 100).toFixed(1)}%"></span></div>${HARE}</div>
          <div class="speed__marks">${[.5, 1, 2, 3].map(v => `<span style="left:${SPEED_F(v) * 100}%">${v}×</span>`).join("")}</div>
          <div class="speed__read"><span>Speed <b>${tray.speed.toFixed(1)}×</b></span><span>Clip <b>${ms(clipLen())}</b></span></div></div>`;
      } else {
        const list = tray.tab === "stickers" ? STICKERS : TIMERS;
        grid.innerHTML = `<div class="tray__grid">${list.map(([k, label]) => {
          const on = (tray.tab === "stickers" ? tray.sticker : tray.timer) === k;
          const face = k === "none" ? `<svg class="tile__none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m6 18 12-12" stroke="currentColor" stroke-width="1.8"/></svg>`
            : tray.tab === "stickers" ? `<div class="stkr">${stkrHTML(k, sample)}</div>`
            : `<div class="clk" data-face="${k}">${clkHTML(k, 1 * 3600 + 24 * 60, 2 * 3600 + 36 * 60, .64)}</div>`;
          return `<button type="button" class="tile${on ? " on" : ""}" data-k="${k}"><span class="tile__face">${face}</span>${label}</button>`;
        }).join("")}</div>`;
      }
      igSticker.innerHTML = stkrHTML(tray.sticker, { tag: IG.tag, dur: IG.dur, date: IG.date });
      igClock.dataset.face = tray.timer;
      igClock.style.opacity = tray.timer === "none" ? 0 : 1;
      igVideo.playbackRate = tray.speed;
    }
    grid.addEventListener("click", e => {
      const b = e.target.closest("[data-k]"); if (!b) return;
      tray.auto = false;
      if (tray.tab === "stickers") tray.sticker = b.dataset.k; else tray.timer = b.dataset.k;
      drawTray();
    });
    tabBtns.forEach(b => b.addEventListener("click", () => {
      tray.auto = false; tray.tab = b.dataset.tabKind;
      if (tray.tab === "trim" && tray.trim[1] - tray.trim[0] > .99) { drawTray(); setTimeout(() => { tray.trim = [.12, .82]; drawTray(); }, 250); return; }
      drawTray();
    }));
    // trim handles and the speed slider really drag
    let drag = null;
    const frac = (e, el) => { const r = el.getBoundingClientRect(); return clamp01((e.clientX - r.left) / r.width); };
    const dragTo = e => {
      const f = frac(e, drag.el);
      if (drag.kind === "speed") tray.speed = Math.round((.5 + f * 2.5) * 10) / 10;
      else if (drag.edge === 0) tray.trim = [Math.min(f, tray.trim[1] - .1), tray.trim[1]];
      else tray.trim = [tray.trim[0], Math.max(f, tray.trim[0] + .1)];
      drawTray();
      drag.el = grid.querySelector(drag.kind === "speed" ? ".speed__track" : ".trim__strip");
    };
    grid.addEventListener("pointerdown", e => {
      const strip = e.target.closest(".trim__strip"), track = e.target.closest(".speed__track, .speed__row");
      if (!strip && !track) return;
      tray.auto = false;
      if (strip) { const f = frac(e, strip); drag = { kind: "trim", el: strip, edge: Math.abs(f - tray.trim[0]) < Math.abs(f - tray.trim[1]) ? 0 : 1 }; }
      else drag = { kind: "speed", el: grid.querySelector(".speed__track") };
      grid.setPointerCapture(e.pointerId); grid.classList.add("dragging");
      dragTo(e);
    });
    grid.addEventListener("pointermove", e => { if (drag) dragTo(e); });
    const endDrag = () => { drag = null; grid.classList.remove("dragging"); };
    grid.addEventListener("pointerup", endDrag); grid.addEventListener("pointercancel", endDrag);
    drawTray();
    // the clock reads its time off the video, like the app's ClockOverlay reads the player;
    // a trim loops the kept range only
    const igTick = () => {
      const d = igVideo.duration || 6;
      if (igVideo.currentTime < tray.trim[0] * d - .05 || igVideo.currentTime > tray.trim[1] * d) igVideo.currentTime = tray.trim[0] * d;
      const t = igVideo.currentTime || 0, f = t / d;
      const head = $("[data-trim-head]", root); if (head) head.style.left = `calc(${(f * 100).toFixed(2)}% - 1.5px)`;
      const el = f * IG.secs, rem = IG.secs - el;
      if (tray.timer !== "none") igClock.innerHTML = clkHTML(tray.timer, el, rem, 1 - f);
      igBar.style.transform = `scaleX(${f.toFixed(3)})`;
      requestAnimationFrame(igTick);
    };
    if (!reduce) requestAnimationFrame(igTick);
    // walk through the tray on its own until someone picks something
    const TOUR = [["stickers", "classic"], ["stickers", "focusDuration"], ["timers", "stopwatch"], ["timers", "ring"], ["trim", [.12, .82]], ["speed", 2], ["speed", 1]];
    let tourI = 0, trayOn = false;
    new IntersectionObserver(([e]) => (trayOn = e.isIntersecting), { threshold: .4 }).observe($("[data-tray]", root));
    if (!reduce) setInterval(() => {
      if (!tray.auto || !trayOn) return;
      tourI = (tourI + 1) % TOUR.length;
      const [tab, k] = TOUR[tourI];
      tray.tab = tab;
      if (tab === "stickers") { tray.sticker = k; tray.timer = "none"; tray.trim = [0, 1]; }
      else if (tab === "timers") { tray.sticker = "classic"; tray.timer = k; }
      else if (tab === "trim") { tray.timer = "none"; tray.trim = [0, 1]; drawTray(); setTimeout(() => { tray.trim = k; if (tray.tab === "trim") drawTray(); }, 220); return; }
      else if (tab === "speed") { tray.speed = k; }
      drawTray();
    }, tourMs);
  }

  function countEls(root, motion) {
    $$("[data-count-hm], [data-count]", root).forEach(el => {
      const to = +(el.dataset.countHm || el.dataset.count), isHm = "countHm" in el.dataset, o = { v: 0 };
      const fmt = v => (isHm ? hm(v) : Math.round(v));
      if (!motion) { el.textContent = fmt(to); return; }
      gsap.to(o, { v: to, duration: 1.8, ease: "power3.out", onUpdate: () => (el.textContent = fmt(o.v)) });
    });
  }

  // the lead quote, split into words that light one by one as it scrolls in
  function splitWords(el) {
    el.innerHTML = el.innerHTML.split(/(\s+)/).map(w => (w.trim() ? `<span class="qw">${w}</span>` : w)).join("");
    return $$(".qw", el);
  }

  // two rows of testimonials at a steady pace (not tied to scroll)
  function marquee(mq, reduce) {
    const rows = $$(".marquee__row", mq).map(row => {
      row.innerHTML += row.innerHTML;
      $$(".quote", row).slice(row.children.length / 2).forEach(q => q.setAttribute("aria-hidden", "true"));
      return { row, dir: +row.dataset.dir, x: 0, hover: false };
    });
    if (reduce) return;
    rows.forEach(r => {
      r.row.addEventListener("mouseenter", () => (r.hover = true));
      r.row.addEventListener("mouseleave", () => (r.hover = false));
    });
    rows[1].x = -rows[1].row.scrollWidth / 4;
    let visible = false, last = 0;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(mq);
    const tick = t => {
      const dt = last ? Math.min(t - last, 50) : 16; last = t;
      if (visible) rows.forEach(r => {
        const half = r.row.scrollWidth / 2, sp = r.hover ? .012 : .045;
        r.x += r.dir * sp * dt;
        if (r.x <= -half) r.x += half;
        if (r.x > 0) r.x -= half;
        r.row.style.transform = `translate3d(${r.x.toFixed(2)}px,0,0)`;
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  window.LATENT = {
    $, $$, clamp01, lerp, smooth, pad2, hm, hms, ms,
    S, SESSIONS, byF, tile, place,
    WEEKS, buildBars, buildHeat, buildProfile,
    GROUP_MIN, buildBoard, buildRace, buildLive, makeTray,
    countEls, splitWords, marquee,
  };
})();
