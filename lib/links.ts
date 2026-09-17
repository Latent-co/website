/**
 * The survey is a route in THIS app now (app/early-access/) rather than a separate
 * deployment proxied onto the origin. Every "sign up" surface points here — the app is
 * TestFlight-only, so this IS the conversion path.
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
const WAITLIST_BASE = "/early-access";

export const WAITLIST_URL = `${WAITLIST_BASE}?utm_source=trylatent-site&utm_medium=web&utm_campaign=apex`;

// Not "Join the waitlist" any more, because it is not one: the survey ends by handing
// over the TestFlight link, so nobody is waiting for anything. Promising a queue and
// then delivering the build immediately undersells the thing at the exact moment
// someone decides whether to start.
export const WAITLIST_LABEL = "Get early access";
