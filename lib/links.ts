/**
 * The waitlist survey is a separate deployment (latent-waitlist), but it is proxied
 * onto this origin at /early-access, so the apex owns the canonical URL. Every
 * "sign up" surface points here — the app is TestFlight-only, so this IS the
 * conversion path.
 *
 * The utm_* params are read by the survey on load and stored on the signup row, so
 * signups originating from this site are attributable. The table moved to the app
 * Supabase project (private `waitlist` schema) on 2026-09-17, and that schema is not
 * exposed over PostgREST, so this is a SQL question now rather than a REST one:
 *
 *   select count(*) from waitlist.signups where utm_source = 'trylatent-site';
 *
 * That's the number to watch after the apex cutover — the old landing page was
 * capturing ~240/day, and this is how we tell whether that rate holds.
 */
// Same-origin now: the apex proxies the survey at /early-access (see next.config.mjs),
// so this stays a path rather than naming the subdomain the proxy happens to sit on.
const WAITLIST_BASE = "/early-access";

export const WAITLIST_URL = `${WAITLIST_BASE}?utm_source=trylatent-site&utm_medium=web&utm_campaign=apex`;

export const WAITLIST_LABEL = "Join the waitlist";
