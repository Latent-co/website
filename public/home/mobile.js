/* Latent landing — the phone page's motion. GSAP + ScrollTrigger on native touch scroll (no Lenis:
   momentum scrolling on a phone should feel like the phone). Data and the shared visuals come from
   shared.js. Reduce Motion collapses every scene to a still. */

(() => {
  "use strict";

  const { $, $$, clamp01, smooth, hms, S, tile, place } = LATENT;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const motion = !reduce && hasGsap;
  if (reduce) document.documentElement.classList.add("reduce");
  if (hasGsap) {
    gsap.registerPlugin(ScrollTrigger);
    // the URL bar sliding in and out resizes the viewport constantly; don't re-lay everything each time
    ScrollTrigger.config({ ignoreMobileResize: true });
  }
  const VW = innerWidth, VH = innerHeight;

  /* ══ 1 · HERO: the clip fills the phone, pulls back into the wall, then the name ══ */
  const stage = $("[data-stage]"), wall = $("[data-wall]"), clip = $("[data-clip]"), clipVideo = $("video", clip);
  const NB = 3, GAP = 12;
  const TW = Math.round((VW + 60) / NB - GAP), TH = Math.round(TW * 16 / 9), STEP = TH + GAP;
  const ZE = .62;                                        // wall scale when the pull-back ends
  let N = Math.ceil(VW / ((TW + GAP) * ZE) + .3); if (N % 2 === 0) N++;
  const PER = Math.max(5, Math.ceil((VH / ZE + 2 * TH) / STEP));
  const CEN = PER % 2 ? PER : PER + 1, MID = (N - 1) / 2;
  const G = place(N, c => (c === MID ? CEN : PER), (c, r) => c === MID && r === (CEN - 1) / 2);
  wall.style.setProperty("--tw", TW + "px");
  wall.style.setProperty("--th", TH + "px");
  wall.innerHTML = G.map((list, c) => `<div class="wall__col" data-c="${c}">${list.map(s => tile(s, false)).join("")}</div>`).join("");
  // the clip is its own layer (so it stays sharp at full screen); its slot in the wall stays empty

  // the clip covers the screen at the tile's 9:16, then shrinks into its slot
  const CW = Math.max(VW, VH * 9 / 16), CH = CW * 16 / 9, S0 = CW / TW;
  Object.assign(clip.style, { width: CW + "px", height: CH + "px", marginLeft: -CW / 2 + "px", marginTop: -CH / 2 + "px" });
  const dimmer = document.createElement("div");
  Object.assign(dimmer.style, { position: "absolute", inset: "0", zIndex: 1, background: "var(--bg)", pointerEvents: "none" });
  stage.insertBefore(dimmer, clip);

  const SPEED = [15, -11, 0, 12, -14, 10, -13];
  const cols = $$(".wall__col", wall).map((el, c) => {
    const tiles = $$(".t", el), center = c === MID, L = tiles.length * STEP;
    return { tiles, center, L, v: center ? 0 : SPEED[(c + (7 - N) / 2 + 7) % 7] || 12, phase: (c * .37 % 1) * L };
  });
  function drift(t) {
    cols.forEach(col => {
      if (col.center) {
        if (col.done) return;
        const m = (col.tiles.length - 1) / 2;
        col.tiles.forEach((el, r) => (el.style.transform = `translate3d(0,${(r - m) * STEP}px,0)`));
        col.done = 1; return;
      }
      const off = col.phase + (t / 1000) * col.v;
      col.tiles.forEach((el, r) => {
        let y = (r * STEP + off) % col.L; if (y < 0) y += col.L;
        el.style.transform = `translate3d(0,${(y - col.L / 2).toFixed(1)}px,0)`;
      });
    });
  }
  drift(0);

  // Every tile on screen plays, from the first frame of the pull-back to the fully zoomed-out wall.
  const vtiles = $$("[data-vt]", wall).map(el => ({ el, v: el.querySelector("video") }));
  vtiles.forEach(t => t.v.addEventListener("playing", () => t.el.classList.add("playing")));
  let heroOn = true;
  function schedule() {
    if (reduce) return;
    if (heroOn && clipVideo.paused) clipVideo.play().catch(() => {});
    if (!heroOn && !clipVideo.paused) clipVideo.pause();
    vtiles.forEach(t => {
      const r = t.el.getBoundingClientRect();
      const vis = heroOn && r.right > 0 && r.left < VW && r.bottom > 0 && r.top < VH;
      if (vis) {
        if (!t.v.getAttribute("src")) { t.v.preload = "auto"; t.v.src = t.v.dataset.src; }
        if (t.v.paused) t.v.play().catch(() => {});
      } else if (!t.v.paused) t.v.pause();
    });
  }
  new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; schedule(); }).observe(stage);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) schedule(); });

  const copy = $("[data-copy]"), shade = $("[data-shade]"), scrim = $("[data-scrim]"), hint = $("[data-hint]"), cap = $("[data-cap]");
  const words = $$(".w", cap), vis = $(".cap__vis");
  function render(p) {
    // a long, even pull-back (exponential, so each stretch of scroll feels the same), then a hold
    const z = smooth(clamp01((p - .04) / .6));
    const s = S0 * Math.pow(ZE / S0, z);
    wall.style.transform = `translate(-50%, -50%) scale(${s.toFixed(4)})`;
    const k = s / S0;                                   // the clip's own scale, always ≤ 1
    const r = 16 * s * smooth(clamp01(z * 5));          // square corners while it IS the screen
    clip.style.transform = `scale(${k.toFixed(4)})`;
    clip.style.borderRadius = (r / k).toFixed(1) + "px";
    dimmer.style.opacity = (1 - smooth(clamp01((p - .02) / .3))).toFixed(3);
    const c = clamp01(p / .06);
    copy.style.opacity = 1 - c;
    copy.style.transform = `translateY(${(-c * 24).toFixed(1)}px)`;
    copy.style.visibility = c >= 1 ? "hidden" : "visible";
    shade.style.opacity = 1 - clamp01(p / .1);
    hint.style.opacity = 1 - clamp01(p / .03);
    scrim.style.opacity = smooth(clamp01((p - .7) / .1));
    // the name "develops" word by word, like a print in the tray
    const n = words.length;
    words.forEach((w, i) => {
      const a = .74 + (i / n) * .17, kk = smooth(clamp01((p - a) / .05));
      if (w._k === kk) return;
      w._k = kk;
      w.style.opacity = kk.toFixed(3);
      w.style.filter = kk >= 1 ? "none" : `blur(${((1 - kk) * 8).toFixed(2)}px) brightness(${(.55 + .45 * kk).toFixed(3)}) sepia(${((1 - kk) * .8).toFixed(3)})`;
      w.style.transform = kk >= 1 ? "none" : `translateY(${((1 - kk) * 10).toFixed(1)}px)`;
    });
    vis.style.setProperty("--u", smooth(clamp01((p - .94) / .04)).toFixed(3));
  }

  /* ══ 2 · 01 RECORD: the whole screen is the app mid-recording ══════════════ */
  const NS = "http://www.w3.org/2000/svg";
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
  const beats = $$(".beat", takeEl), bars = $$("[data-tab]", takeEl), chip = Object.fromEntries($$("[data-chip]").map(n => [n.dataset.chip, n]));
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
  function take(p) {
    const b = Math.min(2, Math.floor(p * 3 + 1e-6));
    if (b !== beat) { beat = b; beats.forEach((n, i) => n.classList.toggle("on", i === b)); }
    bars.forEach((t, i) => t.style.setProperty("--f", clamp01((p - i / 3) * 3).toFixed(3)));
    const rec = clamp01(p / .667);                          // records until the pause beat
    draw(Math.round(rec * (FR - 1)));
    light(rec);
    const isPaused = p >= .667;
    screen.classList.toggle("is-paused", isPaused);
    recState.textContent = isPaused ? "PAUSED" : "REC";
    clockEl.textContent = hms(isPaused ? PAUSE_AT : rec * PAUSE_AT);
    modeEl.textContent = isPaused ? "YOU LEFT THE APP" : "STOPWATCH";
    // beat 1: the screen dims itself, the clock keeps running underneath
    const d = b === 1 ? Math.min(1, clamp01((p - .37) / .05), clamp01((.64 - p) / .04)) : 0;
    dim.style.opacity = (d * .92).toFixed(3);
    chip.apps.classList.toggle("on", b === 0 && p > .06 && p < .28);
    chip.dim.classList.toggle("on", d > .6 && p < .6);
    chip.left.classList.toggle("on", isPaused && p > .7 && p < .93);
  }

  /* ══ 3 · 02 TRACK ═══════════════════════════════════════════════════════ */
  LATENT.buildBars($("[data-bars]"), $("[data-legend]"));
  const fillHeat = LATENT.buildHeat($("[data-heat]")), WEEKS = LATENT.WEEKS;
  LATENT.buildProfile($("[data-pgrid]"));
  const countEls = root => LATENT.countEls(root, motion);

  /* ══ 4 · 03 SHARE ═══════════════════════════════════════════════════════ */
  $("[data-group] [data-count-hm]").dataset.countHm = LATENT.GROUP_MIN;
  LATENT.buildBoard($("[data-board]"), 3);
  const drawRace = LATENT.buildRace($("[data-race]"));
  LATENT.buildLive($("[data-live-list]"), reduce);
  // the phone shows each live friend's name and clock only; the tag goes, to leave the board room for three
  $$("[data-live-list] small").forEach(sm => sm.childNodes.forEach(n => { if (n.nodeType === 3) n.remove(); }));
  $("[data-race]").setAttribute("preserveAspectRatio", "none");
  const post = $("[data-sheet-b]"), friends = $("[data-sheet-a]"), sheet = $(".ms__sheet", post), story = $(".ms__story", post), capPost = $("[data-cap-post]");
  const shareHead = $(".ms__head"), igBars = $(".ig__bars", post);
  let liftMax = null;
  const igVideo = $("[data-ig-video]", post);
  LATENT.makeTray(post, { reduce });

  // videos below the hero load when they come near and play only while on screen
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && !reduce) { if (!v.getAttribute("src") && v.dataset.src) v.src = v.dataset.src; v.play().catch(() => {}); }
    else if (!e.isIntersecting) v.pause();
  }), { rootMargin: "160px" });
  $$(".pgrid video").forEach(v => vio.observe(v));
  vio.observe(igVideo);

  /* ══ close mosaic, reveals, the lead quote, testimonials ═══════════════ */
  let mh = "";
  place(4, () => 4, null, 17).forEach(list => {
    const inner = list.map(s => `<div class="t"><img src="${S}${s.f}.jpg" alt="" loading="lazy" decoding="async"></div>`).join("");
    mh += `<div class="mosaic__col">${inner}${inner}</div>`;
  });
  $("[data-mosaic]").innerHTML = mh;
  const close = $("[data-close]");
  new IntersectionObserver(([e]) => close.classList.toggle("paused", !e.isIntersecting)).observe(close);
  const rio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    setTimeout(() => e.target.classList.add("in"), +(e.target.dataset.reveal || 0));
    rio.unobserve(e.target);
  }), { rootMargin: "0px 0px -10% 0px" });
  $$("[data-reveal]").forEach(n => rio.observe(n));
  const qws = LATENT.splitWords($("[data-quote]"));
  LATENT.marquee($("[data-marquee]"), reduce);

  /* ══ scroll ═════════════════════════════════════════════════════════════ */
  const nav = $("[data-nav]");
  if (!motion) {
    render(0); copy.style.cssText = "";
    const still = new Image();
    still.onload = () => { sizeCanvas(); ctx.drawImage(still, 0, 0, canvas.width, canvas.height); };
    still.src = "assets/media/rec/040.jpg";
    clockEl.textContent = "1:09:00"; light(.5);
    countEls(document); fillHeat(99); drawRace(false);
    [$("[data-panel]"), $("[data-profile]"), $("[data-group]"), friends].forEach(n => n.classList.add("in"));
    qws.forEach(w => w.classList.add("on"));
    nav.classList.add("is-solid");
  } else {
    render(0);
    ScrollTrigger.create({ trigger: "[data-mhero]", start: "top top", end: "bottom bottom", onUpdate: s => render(s.progress), onRefresh: s => render(s.progress) });
    const loopT = t => { if (heroOn) drift(t); requestAnimationFrame(loopT); };
    requestAnimationFrame(loopT);
    ScrollTrigger.create({ trigger: "[data-mhero]", start: "bottom 64px", end: "max", onToggle: s => nav.classList.toggle("is-solid", s.isActive) });

    ScrollTrigger.create({ trigger: takeEl, start: "top 300%", once: true, onEnter: loadFrames });
    requestAnimationFrame(sizeCanvas);
    ScrollTrigger.create({ trigger: takeEl, start: "top top", end: "bottom bottom", onUpdate: s => take(s.progress), onRefresh: s => take(s.progress) });
    take(0);

    // 02 · track: the rail slides from history to numbers
    const rail = $("[data-track-rail]"), tdots = $$("[data-tdot]"), trackEl = $("[data-track]"), panel = $("[data-panel]");
    ScrollTrigger.create({ trigger: trackEl, start: "top 70%", once: true, onEnter: () => $("[data-profile]").classList.add("in") });
    ScrollTrigger.create({
      trigger: trackEl, start: "top top", end: "bottom bottom",
      onUpdate: s => {
        const k = smooth(clamp01((s.progress - .28) / .4));
        rail.style.transform = `translate3d(${(-k * 50).toFixed(3)}%,0,0)`;
        tdots.forEach((d, i) => d.classList.toggle("on", (k > .5 ? 1 : 0) === i));
        if (k > .55) {
          if (!trackEl._counted) { trackEl._counted = 1; countEls(panel); panel.classList.add("in"); }
          fillHeat(clamp01((s.progress - .6) / .3) * (WEEKS + 1));
        }
      },
    });

    // 03 · share: the story rises and fills the phone, then the editor slides up under it
    const sdots = $$("[data-sdot]"), group = $("[data-group]");
    ScrollTrigger.create({ trigger: "[data-share]", start: "top 60%", once: true, onEnter: () => { countEls(group); group.classList.add("in"); friends.classList.add("in"); drawRace(true); } });
    ScrollTrigger.create({
      trigger: "[data-share]", start: "top top", end: "bottom bottom",
      onUpdate: s => {
        const p = s.progress;
        const k = smooth(clamp01((p - .34) / .26));
        post.style.transform = `translate3d(0,${((1 - k) * 101).toFixed(2)}%,0)`;
        friends.style.transform = `scale(${(1 - .05 * k).toFixed(4)})`;
        friends.style.opacity = (1 - .6 * k).toFixed(3);
        // then the caption steps aside, the tray slides up, and the story shrinks into the preview above it
        const e = smooth(clamp01((p - .64) / .16));
        const top = shareHead.getBoundingClientRect().bottom + 4, room = VH - sheet.offsetHeight - 10 - top;
        const s1 = Math.min(1, room / VH), sc = 1 + (s1 - 1) * e;
        story.style.transform = `translate3d(0,${(top * e).toFixed(1)}px,0) scale(${sc.toFixed(4)})`;
        story.style.borderRadius = `${(20 * e / sc).toFixed(1)}px`;
        // full screen, the story's bar sits under the page header; as a preview it belongs at its own top edge
        if (liftMax === null) liftMax = Math.max(0, igBars.offsetTop - 14);
        story.style.setProperty("--lift", `${(liftMax * e).toFixed(1)}px`);
        capPost.style.opacity = (1 - clamp01(e * 2.2)).toFixed(3);
        capPost.style.visibility = e > .5 ? "hidden" : "visible";
        sheet.style.transform = `translate3d(0,${((1 - e) * 104).toFixed(2)}%,0)`;
        sdots.forEach((d, i) => d.classList.toggle("on", (k > .5 ? 1 : 0) === i));
      },
    });
    ScrollTrigger.create({ trigger: $("[data-quote]"), start: "top 85%", end: "bottom 45%", scrub: true, onUpdate: s => { const k = s.progress * qws.length; qws.forEach((w, i) => w.classList.toggle("on", i < k)); } });
  }
  schedule();
  setInterval(schedule, 400);
})();
