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
type Opts = { instant?: boolean };
const queue: [string, Record<string, unknown> | undefined, Opts | undefined][] = [];

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
    queue.splice(0).forEach(([e, p, o]) => posthog.capture(e, p, o?.instant ? { send_instantly: true } : undefined));
  });
}

// A page's effects run before the layout's, so the first event can arrive before
// Providers has started the client; start it here rather than drop the event. `instant` skips
// the library's batch, for an event whose page may be left for another app within seconds.
export function track(event: string, props?: Record<string, unknown>, opts?: Opts) {
  startAnalytics();
  if (ph) ph.capture(event, props, opts?.instant ? { send_instantly: true } : undefined);
  else queue.push([event, props, opts]);
}

/**
 * An event raised right before the page is left for another app (a tap that opens the App
 * Store). A suspended tab may never send the library's batch, so this goes by beacon, which the
 * browser finishes after the page is gone. Before the library has loaded (a tap in the first
 * second), everything still waiting in `queue` goes with it, straight to PostHog's capture
 * endpoint through /ingest, keyed on `anonId` and making no person profile.
 */
// TRADEOFF: an event sent before the library loads carries `anonId` as its distinct_id and none
// of the library's automatic properties ($os, $browser, $session_id); `visit_id`, which both
// paths carry, is the join. Upgrade: bootstrap the library's distinct id with the visit id here.
export function trackBeforeLeaving(event: string, props: Record<string, unknown>, anonId: string) {
  if (ph) {
    ph.capture(event, props, { send_instantly: true, transport: "sendBeacon" });
    return;
  }
  startAnalytics();
  // Taken out of the queue, so the library cannot send them a second time if the page survives.
  const waiting = queue.splice(0);
  for (const [e, p] of waiting) beacon(e, p ?? {}, anonId);
  beacon(event, props, anonId);
}

function beacon(event: string, props: Record<string, unknown>, anonId: string) {
  const body = JSON.stringify({
    api_key: KEY,
    event,
    distinct_id: anonId,
    properties: {
      ...props,
      surface: "website",
      $current_url: window.location.href,
      $process_person_profile: false,
    },
  });
  const url = "/ingest/i/v0/e/";
  const sent =
    typeof navigator.sendBeacon === "function" &&
    navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
  if (!sent) {
    fetch(url, { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } })
      .catch(() => {});
  }
}
