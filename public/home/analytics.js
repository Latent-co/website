/* Latent home page — analytics. PostHog, the same project as the app (505306), so a visit
   here can later be followed into the app. Explicit events only:

     $pageview / $pageleave      automatic; every event carries site_version + quiet
     landing_section_viewed      { section }   first time each section reaches mid-screen
     landing_cta_clicked         { placement } which App Store button (nav/hero/close/footer)
     landing_faq_opened          { question }
     landing_tray_used           { tab }       the first time someone works the edit tray
     landing_quiet_toggled       { quiet }

   Every call to action leaves for the App Store listing, so the web funnel ends at
   landing_cta_clicked; installs are counted on the app side.

   Requests go to /ingest on this domain (proxied in next.config.mjs), because ad blockers
   drop requests to posthog.com and a funnel missing a third of its top is worse than none.
   No session replay, no autocapture, and no person profile until someone is identified. */

(() => {
  "use strict";
  const KEY = "phc_w2xVV6e3WJvuwyak7AwKc69SHWE6UzAXK9eiAjnYvWME";

  // PostHog's own loader stub: queues calls until array.js arrives.
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled getFeatureFlag identify alias get_distinct_id".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  const version = document.body.classList.contains("m") ? "mobile" : "desktop";
  posthog.init(KEY, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    person_profiles: "identified_only",
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: true,
  });
  posthog.register({ surface: "website", site_version: version, quiet: document.documentElement.classList.contains("reduce") });

  // `now`: send at once instead of waiting for the next batch, for events that happen
  // just before the page goes away (a CTA click, the quiet-mode reload)
  const track = (event, props, now) => posthog.capture(event, props, now ? { send_instantly: true } : undefined);
  window.latentTrack = track;

  // which App Store button
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-cta]");
    if (a) track("landing_cta_clicked", { placement: a.dataset.cta }, true);
  });

  // each section once, when it first reaches the middle of the screen
  const seen = new Set();
  const io = new IntersectionObserver(es => es.forEach(en => {
    const s = en.target.dataset.section;
    if (!en.isIntersecting || seen.has(s)) return;
    seen.add(s); io.unobserve(en.target);
    track("landing_section_viewed", { section: s, order: seen.size });
  }), { rootMargin: "-45% 0px -45% 0px" });
  document.querySelectorAll("[data-section]").forEach(el => io.observe(el));

  // FAQ questions people actually open
  document.querySelectorAll("#faq details").forEach(d => d.addEventListener("toggle", () => {
    if (d.open) track("landing_faq_opened", { question: d.querySelector("summary").textContent.trim() });
  }));
})();
