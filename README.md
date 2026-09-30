# trylatent.co

Next.js 14 on Vercel (`latent2/latent-website`). A push to `main` deploys production; every
branch gets a preview (behind Vercel login: `vercel curl <path> --deployment <url> --scope latent2`).
DNS is on Cloudflare, proxied to Vercel.

## What serves what

| Path | Source |
|---|---|
| `/` | **Static**, not React: `public/home/index.html` (laptops, tablets) or `public/home/mobile.html` (phones), picked by user agent in `next.config.mjs`. `?desktop=1` / `?mobile=1` force one. |
| `/early-access` | `app/early-access/` — the waitlist survey, saving to the waitlist Supabase project as you answer. |
| `/i/<code>` | `app/i/[code]/` — invite links from the app. |
| `/privacy`, `/terms` | `app/privacy/`, `app/terms/` |
| `/.well-known/apple-app-site-association` | `public/.well-known/` — tells iOS to open invite links in the app. Served as JSON (`next.config.mjs`). |
| `/ingest/*` | Proxy to PostHog (`next.config.mjs`), so ad blockers don't drop analytics. |
| `/sitemap.xml` | `public/sitemap.xml` |

## The home page

`public/home/` is plain HTML/CSS/JS with vendored GSAP, ScrollTrigger and Lenis:

- `shared.js` — the real sessions, the app's stickers and clocks, and the builders both pages use (`window.LATENT`).
- `site.js` + `site.css` — desktop. `mobile.js` + `mobile.css` — phones (loads `site.css` first).
- `analytics.js` — PostHog (see below).
- Both HTML files carry `<base href="/home/">`, so relative paths resolve while the URL stays `/`.

Preview locally with `npm run dev` and open http://localhost:3000 (add `?mobile=1` for the phone page).
A new asset goes in `public/home/assets/` and is referenced relatively (`assets/…`).

**Quiet mode** swaps the scroll scenes for a plain page: the `reduce` class on `<html>`, set by a
script in each page's `<head>` before first paint. The visitor's switch (localStorage
`latent-quiet`, or `?quiet=1` / `?quiet=0`) wins; with no choice made it follows the OS Reduce
Motion setting and Data Saver.

## Analytics

PostHog, the app's project (505306), every event tagged `surface: "website"`. Explicit events only:
no autocapture, no session replay, and no person profile for anonymous visitors.

| Event | Properties |
|---|---|
| `$pageview`, `$pageleave` | `site_version` (desktop / mobile), `quiet` |
| `landing_section_viewed` | `section` (hero, record, track, share, voices, faq, close), `order` |
| `landing_cta_clicked` | `placement` (nav, hero, close, footer) |
| `landing_faq_opened` | `question` |
| `landing_tray_used` | `tab` — the first time someone works the edit tray |
| `landing_quiet_toggled` | `quiet`, `from_section` |
| `early_access_step_viewed` | `step`, `step_key`, `waitlist_session_id` |
| `early_access_completed` | `pillar`, `has_email`, `has_phone`, `utm_source`, `waitlist_session_id` |

`waitlist_session_id` is the waitlist row's `session_id`, so a visitor can be joined to their
answers in the waitlist database without the email ever going to PostHog.
