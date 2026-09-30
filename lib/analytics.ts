"use client";

import type { PostHog } from "posthog-js";

/**
 * Website analytics: PostHog, the same project as the app (505306). The static home page
 * (public/home/analytics.js) sets up the same client with the same settings; both live on
 * trylatent.co, so one visitor keeps one id from the home page into /early-access.
 *
 * Requests go through /ingest on this domain (rewritten in next.config.mjs) so ad blockers
 * don't drop them. Explicit events only: no autocapture, no session replay, and no person
 * profile for anonymous visitors.
 */
const KEY = "phc_w2xVV6e3WJvuwyak7AwKc69SHWE6UzAXK9eiAjnYvWME";

let started = false;
let ph: PostHog | null = null;
const queue: [string, Record<string, unknown> | undefined][] = [];

// The library (~100 KB) loads after the page, so the signup form isn't slower for it;
// events raised before it arrives wait in the queue.
export function startAnalytics() {
  if (started || typeof window === "undefined") return;
  started = true;
  import("posthog-js").then(({ default: posthog }) => {
    posthog.init(KEY, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      person_profiles: "identified_only",
      autocapture: false,
      capture_pageview: true,
      capture_pageleave: true,
      disable_session_recording: true,
    });
    posthog.register({ surface: "website" });
    ph = posthog;
    queue.splice(0).forEach(([e, p]) => posthog.capture(e, p));
  });
}

// A page's effects run before the layout's, so the first event can arrive before
// Providers has started the client; start it here rather than drop the event.
export function track(event: string, props?: Record<string, unknown>) {
  startAnalytics();
  if (ph) ph.capture(event, props);
  else queue.push([event, props]);
}
