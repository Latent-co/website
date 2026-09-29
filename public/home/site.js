/* Latent landing — motion. GSAP + ScrollTrigger + Lenis, vendored in /vendor.
   Reduce Motion collapses every scene to a still, readable page. */

(() => {
  "use strict";
  if (document.documentElement.dataset.redirect) return;   // a phone, on its way to mobile.html

  const { $, $$, clamp01, smooth, hms, S, tile, place } = LATENT;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const motion = !reduce && hasGsap;
  if (reduce) document.documentElement.classList.add("reduce");

  /* ══ HERO: one framed session → a wall of real ones → the name ═══════════════ */
  const stage = $(".hero__stage"), wall = $("[data-wall]");
  // the copy sits beside the clip instead of under it; the same query as the CSS layout
  const WIDE_HERO = "(min-width: 1000px), (orientation: landscape) and (max-height: 520px) and (min-width: 640px)";
  const VW = innerWidth, VH = innerHeight;
  const NB = VW < 640 ? 3 : VW < 1000 ? 5 : 7;          // columns that fill the screen at scale 1
  const ZE = .6;                                       // where the zoom ends: well past 1, so clips end small
  const GAP0 = 12, TW0 = Math.round((VW + (NB === 3 ? 60 : 150)) / NB - GAP0);
  let N = Math.ceil(VW / ((TW0 + GAP0) * ZE) + .3); if (N % 2 === 0) N++;   // enough columns to fill the screen at ZE
  const GAP = 12;
  const TW = Math.round((VW + (NB === 3 ? 60 : 150)) / NB - GAP), TH = Math.round(TW * 16 / 9), STEP = TH + GAP;
  // enough tiles per column that the wrap point is always off screen, even fully zoomed out
  const PER = Math.max(5, Math.ceil((VH / ZE + 2 * TH) / STEP));
  const CEN = PER % 2 ? PER : PER + 1, MID = (N - 1) / 2;
  const G = place(N, c => (c === MID ? CEN : PER), (c, r) => c === MID && r === (CEN - 1) / 2);
  wall.style.setProperty("--tw", TW + "px");
  wall.style.setProperty("--th", TH + "px");
  wall.innerHTML = G.map((list, c) => `<div class="wall__col" data-c="${c}">${list.map(tile).join("")}</div>`).join("");

  // column drift, px per second in wall space; the centre column holds still
  const SPEED = [16, -12, 14, -10, 0, 11, -15, 13, -12, 15, -11];
  const cols = $$(".wall__col", wall).map((el, c) => {
    const tiles = $$(".t", el), center = c === MID;
    const L = tiles.length * STEP;
    const v = center ? 0 : SPEED[(c + (11 - N) / 2) % SPEED.length];
    return { tiles, center, L, v, phase: (c * 0.37 % 1) * L };
  });
  function drift(t) {
    cols.forEach(col => {
      if (col.center) {
        const m = (col.tiles.length - 1) / 2;
        col.tiles.forEach((el, r) => { if (!el._set) { el.style.transform = `translate3d(0,${(r - m) * STEP}px,0)`; el._set = 1; } });
        return;
      }
      const off = col.phase + (t / 1000) * col.v;
      col.tiles.forEach((el, r) => {
        let y = (r * STEP + off) % col.L; if (y < 0) y += col.L;
        el.style.transform = `translate3d(0,${(y - col.L / 2).toFixed(1)}px,0)`;
      });
    });
  }
  drift(0);

  // Every tile video that is on screen plays — before the scroll starts too, dimmed behind the frame.
  const vtiles = $$("[data-vt]", wall).map(el => ({ el, v: el.querySelector("video") }));
  vtiles.forEach(t => t.v.addEventListener("playing", () => t.el.classList.add("playing")));
  let heroOn = true;
  function schedule() {
    const heroVideo = $("[data-hero-tile] video");
    if (reduce) return;
    if (heroOn && heroVideo.paused) heroVideo.play().catch(() => {});
    if (!heroOn && !heroVideo.paused) heroVideo.pause();
    const m = 60;
    vtiles.forEach(t => {
      const r = t.el.getBoundingClientRect();
      const vis = heroOn && r.right > -m && r.left < innerWidth + m && r.bottom > -m && r.top < innerHeight + m && r.width > 4;
      if (vis) {
        if (!t.v.getAttribute("src")) { t.v.preload = "auto"; t.v.src = t.v.dataset.src; }
        if (t.v.paused) t.v.play().catch(() => {});
      } else if (!t.v.paused) t.v.pause();
    });
  }
  new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; schedule(); }).observe(stage);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) schedule(); });

  const spot = $("[data-spot]"), shade = $("[data-shade]"), scrim = $("[data-scrim]");
  const copy = $("[data-copy]"), cap = $("[data-cap]"), hint = $("[data-hint]"), vis = $(".cap__vis");
  const words = $$(".w", cap);
  let L = null, lastP = 0;
  function measure() {
    const W = stage.clientWidth, H = stage.clientHeight, wide = matchMedia(WIDE_HERO).matches;
    let S0, DX = 0, DY = 0;
    if (wide) {
      S0 = Math.max(1.05, Math.min((H * .9) / TH, (W * .94) / TW));
      DX = Math.min(W * .2, W / 2 - (TW * S0) / 2 - 56);
    } else {
      const top = 68, below = copy.offsetHeight + parseFloat(getComputedStyle(copy.parentElement).paddingBottom) + 20;
      const fh = Math.max(TH, Math.min(H * .56, H - top - below));
      S0 = Math.min(fh / TH, (W * .94) / TW);
      DY = top + (TH * S0) / 2 - H / 2;
    }
    L = { W, H, S0, DX, DY };
  }
  function render(p) {
    lastP = p;
    const { S0, DX, DY } = L;
    // a long, even zoom (exponential, so each stretch of scroll feels the same), then a hold
    const z = smooth(clamp01((p - .03) / .64));
    const s = S0 * Math.pow(ZE / S0, z);
    const ox = DX * (1 - z), oy = DY * (1 - z);
    const tr = `translate(calc(-50% + ${ox.toFixed(1)}px), calc(-50% + ${oy.toFixed(1)}px))`;
    wall.style.transform = `${tr} scale(${s.toFixed(4)})`;
    spot.style.transform = tr;
    spot.style.width = (TW * s).toFixed(1) + "px";
    spot.style.height = (TH * s).toFixed(1) + "px";
    spot.style.borderRadius = (16 * s).toFixed(1) + "px";
    // black around the one clip until the scroll starts, then the wall comes up out of it
    spot.style.boxShadow = `0 0 0 200vmax rgba(14,13,12,${(1 - smooth(clamp01((p - .01) / .3))).toFixed(3)})`;
    const c = clamp01(p / .08);
    copy.style.opacity = 1 - c;
    copy.style.transform = `translateY(${(-c * 30).toFixed(1)}px)`;
    copy.style.visibility = c >= 1 ? "hidden" : "visible";
    shade.style.opacity = 1 - clamp01(p / .12);
    hint.style.opacity = 1 - clamp01(p / .04);
    scrim.style.opacity = smooth(clamp01((p - .72) / .1));
    // the name "develops" word by word, like a print in the tray
    const n = words.length;
    words.forEach((w, i) => {
      const a = .75 + (i / n) * .17, k = smooth(clamp01((p - a) / .05));
      if (w._k === k) return;
      w._k = k;
      w.style.opacity = k.toFixed(3);
      w.style.filter = k >= 1 ? "none" : `blur(${((1 - k) * 9).toFixed(2)}px) brightness(${(.55 + .45 * k).toFixed(3)}) sepia(${((1 - k) * .8).toFixed(3)})`;
      w.style.transform = k >= 1 ? "none" : `translateY(${((1 - k) * 10).toFixed(1)}px)`;
    });
    vis.style.setProperty("--u", smooth(clamp01((p - .94) / .04)).toFixed(3));
  }
  measure();

  /* ── close mosaic: stills only, each column doubled for a seamless CSS loop ── */
  const mc = innerWidth < 640 ? 4 : 9;
  let mh = "";
  place(mc, () => 4, null, 17).forEach(list => {
    const inner = list.map(s => `<div class="t"><img src="${S}${s.f}.jpg" alt="" loading="lazy" decoding="async"></div>`).join("");
    mh += `<div class="mosaic__col">${inner}${inner}</div>`;
  });
  $("[data-mosaic]").innerHTML = mh;
  const close = $("[data-close]");
  new IntersectionObserver(([e]) => close.classList.toggle("paused", !e.isIntersecting)).observe(close);

  /* ── reveals ── */
  const rio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    setTimeout(() => e.target.classList.add("in"), +(e.target.dataset.reveal || 0));
    rio.unobserve(e.target);
  }), { rootMargin: "0px 0px -12% 0px" });
  $$("[data-reveal]").forEach(n => rio.observe(n));

  // Plain autoplay-on-view for the videos below the hero.
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && !reduce) { if (!v.getAttribute("src") && v.dataset.src) v.src = v.dataset.src; v.play().catch(() => {}); }
    else if (!e.isIntersecting) v.pause();
  }), { rootMargin: "160px" });

  /* ── smooth scroll ── */
  let lenis = null;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (motion && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id.length < 2 || !$(id)) return;
      e.preventDefault();
      lenis.scrollTo($(id), { duration: 1.5 });
    }));
  }

  if (!motion) {
    render(1);
    copy.style.cssText = ""; words.forEach(w => (w.style.cssText = ""));
  } else {
    render(0);
    ScrollTrigger.create({ trigger: ".hero", start: "top top", end: "bottom bottom", onUpdate: s => render(s.progress), onRefresh: s => render(s.progress) });
    const loopT = t => { if (heroOn) drift(t); requestAnimationFrame(loopT); };
    requestAnimationFrame(loopT);
  }
  schedule();
  setInterval(schedule, 350);
  let rw = innerWidth;
  addEventListener("resize", () => {
    if (Math.abs(innerWidth - rw) > 60) { location.reload(); return; }
    measure(); render(motion ? lastP : 1);
  });

  const nav = $("[data-nav]");
  if (hasGsap) ScrollTrigger.create({ trigger: ".hero", start: "bottom 64px", end: "max", onToggle: s => nav.classList.toggle("is-solid", s.isActive) });
  else nav.classList.add("is-solid");

  /* ══ HOW IT WORKS ════════════════════════════════════════════════════════ */
  const NS = "http://www.w3.org/2000/svg";

  /* 01 · record: camera → clock → dim → pause */
  const dial = $("[data-dial]"), ticks = [];
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2, l = document.createElementNS(NS, "line");
    l.setAttribute("x1", 60 + Math.cos(a) * 50); l.setAttribute("y1", 60 + Math.sin(a) * 50);
    l.setAttribute("x2", 60 + Math.cos(a) * 58); l.setAttribute("y2", 60 + Math.sin(a) * 58);
    dial.appendChild(l); ticks.push(l);
  }
  const light = f => { const n = Math.round(clamp01(f) * 60); ticks.forEach((t, i) => t.classList.toggle("on", i < n)); };
  const takeEl = $("[data-take]"), screen = $("[data-rec-screen]"), canvas = $("[data-canvas]"), ctx = canvas.getContext("2d");
  const clockEl = $("[data-clock]"), modeEl = $("[data-mode]"), dim = $("[data-dim]"), recState = $("[data-recstate]");
  const clocks = $("[data-clocks]"), clockOpts = $$("[data-c]", clocks), paused = $("[data-paused]");
  const beats = $$(".beat"), tabs = $$("[data-tab]"), chip = Object.fromEntries($$("[data-chip]").map(n => [n.dataset.chip, n]));
  const FR = 80, PAUSE_AT = 1 * 3600 + 52 * 60 + 10, frames = [];
  let current = -1, want = 0, beat = -1;
  function loadFrames() {
    if (frames.length) return;
    for (let i = 0; i < FR; i++) {
      const img = new Image(); img.decoding = "async";
      img.src = `assets/media/rec/${String(i + 1).padStart(3, "0")}.jpg`;
      img.onload = () => { if (i === want || current < 0) draw(want, true); };
      frames[i] = img;
    }
  }
  function draw(i, force) {
    want = i;
    let img = frames[i];
    if (!img || !img.naturalWidth) for (let j = i; j >= 0; j--) if (frames[j] && frames[j].naturalWidth) { img = frames[j]; break; }
    if (!img || !img.naturalWidth || (i === current && !force)) return;
    current = i;
    const cw = canvas.width, chh = canvas.height, sc = Math.max(cw / img.naturalWidth, chh / img.naturalHeight);
    ctx.drawImage(img, (cw - img.naturalWidth * sc) / 2, (chh - img.naturalHeight * sc) / 2, img.naturalWidth * sc, img.naturalHeight * sc);
  }
  function sizeCanvas() {
    const r = canvas.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    if (!r.width) return;
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    draw(want, true);
  }
  addEventListener("resize", sizeCanvas);
  function take(p) {
    const b = Math.min(2, Math.floor(p * 3 + 1e-6));
    if (b !== beat) { beat = b; beats.forEach((n, i) => n.classList.toggle("on", i === b)); }
    tabs.forEach((t, i) => { t.classList.toggle("on", i === b); t.style.setProperty("--f", clamp01((p - i / 3) * 3).toFixed(3)); });
    const rec = clamp01(p / .667);                          // records until the pause beat
    const sec = rec * PAUSE_AT;
    draw(Math.round(rec * (FR - 1)));
    light(rec);
    const isPaused = p >= .667;
    screen.classList.toggle("is-paused", isPaused);
    recState.textContent = isPaused ? "PAUSED" : "REC";
    clocks.classList.remove("on");
    clockEl.textContent = hms(isPaused ? PAUSE_AT : sec);
    modeEl.textContent = isPaused ? "YOU LEFT THE APP" : "STOPWATCH";
    // beat 1: the screen dims itself, the clock keeps running underneath
    const d = b === 1 ? Math.min(1, clamp01((p - .37) / .05), clamp01((.64 - p) / .04)) : 0;
    dim.style.opacity = (d * .9).toFixed(3);
    paused.classList.toggle("on", isPaused);
    chip.apps.classList.toggle("on", b === 0 && p > .05);
    chip.dim.classList.toggle("on", d > .6);
    chip.left.classList.toggle("on", isPaused && p > .7);
  }

  /* 02 · track: chloe's sessions, then rjho's real week by tag and his last nine weeks */
  LATENT.buildBars($("[data-bars]"), $("[data-legend]"));
  const fillHeat = LATENT.buildHeat($("[data-heat]")), WEEKS = LATENT.WEEKS;
  LATENT.buildProfile($("[data-pgrid]"));

  /* 03 · share */
  $("[data-group] [data-count-hm]").dataset.countHm = LATENT.GROUP_MIN;
  LATENT.buildBoard($("[data-board]"));
  const drawRace = LATENT.buildRace($("[data-race]"));
  $$(".pgrid video, [data-ig-video]").forEach(v => vio.observe(v));

  LATENT.buildLive($("[data-live-list]"), reduce);
  LATENT.makeTray($("[data-sheet-b]"), { reduce });

  const countEls = root => LATENT.countEls(root, motion);
  const feed = $("[data-feed]");
  const nudgeBtn = $("[data-nudge]");
  if (nudgeBtn) nudgeBtn.addEventListener("click", () => {
    feed.classList.remove("in"); void feed.offsetWidth; feed.classList.add("in");
    nudgeBtn.textContent = "Nudged"; nudgeBtn.disabled = true;
  });

  /* the lead quote lights word by word as it scrolls in */
  const quote = $("[data-quote]");
  const qws = LATENT.splitWords(quote);

  if (!motion) {
    const still = new Image();
    still.onload = () => { sizeCanvas(); ctx.drawImage(still, 0, 0, canvas.width, canvas.height); };
    still.src = "assets/media/rec/040.jpg";
    clockEl.textContent = "1:09:00"; light(.5); beats.forEach(b => b.classList.add("on"));
    countEls(document); fillHeat(99); drawRace(motion);
    [feed, $("[data-panel]"), $("[data-profile]"), $("[data-group]")].forEach(n => n.classList.add("in"));
    qws.forEach(w => w.classList.add("on"));
  } else {
    ScrollTrigger.create({ trigger: takeEl, start: "top 300%", once: true, onEnter: loadFrames });
    requestAnimationFrame(sizeCanvas);
    ScrollTrigger.create({ trigger: takeEl, start: "top top", end: "bottom bottom", onUpdate: s => take(s.progress), onRefresh: s => take(s.progress) });
    take(0);
    ScrollTrigger.create({ trigger: "[data-group]", start: "top 80%", once: true, onEnter: () => { countEls($("[data-group]")); $("[data-group]").classList.add("in"); drawRace(motion); } });
    // 02 · track: pinned, the rail slides from history to progress
    const rail = $("[data-track-rail]"), tdots = $$("[data-tdot]"), trackEl = $("[data-track]");
    gsap.matchMedia().add("(min-width: 901px)", () => {
      const st = ScrollTrigger.create({
        trigger: trackEl, start: "top top", end: "bottom bottom",
        onUpdate: s => {
          const k = smooth(clamp01((s.progress - .3) / .4));
          rail.style.transform = `translate3d(${(-k * 50).toFixed(3)}%,0,0)`;
          tdots.forEach((d, i) => d.classList.toggle("on", (k > .5 ? 1 : 0) === i));
          if (k > .55) { if (!trackEl._counted) { trackEl._counted = 1; countEls($("[data-panel]")); $("[data-panel]").classList.add("in"); } fillHeat(clamp01((s.progress - .6) / .3) * (WEEKS + 1)); }
        },
      });
      $("[data-profile]").classList.add("in");
      return () => { st.kill(); rail.style.transform = ""; };
    });
    gsap.matchMedia().add("(max-width: 900px)", () => {
      ScrollTrigger.create({ trigger: "[data-profile]", start: "top 80%", once: true, onEnter: () => $("[data-profile]").classList.add("in") });
      ScrollTrigger.create({ trigger: "[data-panel]", start: "top 78%", once: true, onEnter: () => { countEls($("[data-panel]")); $("[data-panel]").classList.add("in"); } });
      ScrollTrigger.create({ trigger: "[data-heat]", start: "top 88%", end: "top 45%", scrub: true, onUpdate: s => fillHeat(s.progress * (WEEKS + 1)) });
    });
    // 03 · share: pinned; "post it anywhere" folds up over the friends sheet and covers the
    // whole frame, the header riding on top of it. As it lands it loses its lifted tone and
    // corners, so the covered frame reads as the page itself rather than a card that stopped short.
    gsap.matchMedia().add("(min-width: 901px)", () => {
      const A = $("[data-sheet-a]"), B = $("[data-sheet-b]"), sdots = $$("[data-sdot]"), head = $("[data-share] .track__head");
      const LIFT = [19, 18, 16], PAGE = [14, 13, 12];      // #131210 → --bg #0E0D0C
      const fitB = () => (B.style.paddingTop = `${head.offsetTop + head.offsetHeight + 8}px`);
      const st = ScrollTrigger.create({
        trigger: "[data-share]", start: "top top", end: "bottom bottom",
        onRefresh: fitB,
        onUpdate: s => {
          const k = smooth(clamp01((s.progress - .3) / .38)), land = clamp01((k - .8) / .2);
          B.style.transform = `translate3d(0,${((1 - k) * 102).toFixed(2)}%,0)`;
          B.style.borderRadius = `${(36 * (1 - land)).toFixed(1)}px ${(36 * (1 - land)).toFixed(1)}px 0 0`;
          B.style.backgroundColor = `rgb(${LIFT.map((c, i) => Math.round(c + (PAGE[i] - c) * land)).join(",")})`;
          A.style.transform = `scale(${(1 - .06 * k).toFixed(4)})`;
          A.style.opacity = (1 - .7 * k).toFixed(3);
          sdots.forEach((d, i) => d.classList.toggle("on", (k > .5 ? 1 : 0) === i));
        },
      });
      fitB();
      return () => { st.kill(); A.style.cssText = ""; B.style.cssText = ""; };
    });
    ScrollTrigger.create({ trigger: feed, start: "top 75%", once: true, onEnter: () => feed.classList.add("in") });
    ScrollTrigger.create({ trigger: quote, start: "top 85%", end: "bottom 45%", scrub: true, onUpdate: s => { const k = s.progress * qws.length; qws.forEach((w, i) => w.classList.toggle("on", i < k)); } });
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const ph = $("[data-tilt]"), rx = gsap.quickTo(ph, "rotationX", { duration: .8, ease: "power3" }), ry = gsap.quickTo(ph, "rotationY", { duration: .8, ease: "power3" });
      gsap.set(ph, { transformPerspective: 1200 });
      addEventListener("pointermove", e => {
        const b = ph.getBoundingClientRect();
        if (b.bottom < 0 || b.top > innerHeight) return;
        ry(Math.max(-7, Math.min(7, (e.clientX - (b.left + b.width / 2)) / innerWidth * 12)));
        rx(Math.max(-5, Math.min(5, -(e.clientY - (b.top + b.height / 2)) / innerHeight * 9)));
      }, { passive: true });
    }
  }

  /* ══ VOICES: two rows at a steady pace (not tied to scroll) ═════════════ */
  LATENT.marquee($("[data-marquee]"), reduce);
})();
