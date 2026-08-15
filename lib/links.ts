/**
 * The waitlist survey lives on its own deployment (waitlist.trylatent.co) so
 * this site can own the apex. Every "sign up" surface points here — the app
 * isn't on the App Store yet, so the waitlist IS the conversion path.
 *
 * The utm_* params are read by the survey on load and stored on the waitlist
 * row, so signups originating from this site are attributable:
 *
 *   select count(*) from public.waitlist where utm_source = 'trylatent-site';
 *
 * That's the number to watch after the apex cutover — the old landing page was
 * capturing ~240/day, and this is how we tell whether that rate holds.
 */
const WAITLIST_BASE = "https://waitlist.trylatent.co/early-access";

export const WAITLIST_URL = `${WAITLIST_BASE}?utm_source=trylatent-site&utm_medium=web&utm_campaign=apex`;

export const WAITLIST_LABEL = "Join the waitlist";
