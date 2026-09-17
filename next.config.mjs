/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // /early-access is served by this app now — see app/early-access/. It has been
  // through three shapes: it lived on the apex, then moved to its own deployment and
  // got a 307, then got proxied back here with a rewrite so the apex could own the URL.
  // The rewrite worked but kept the survey in a separate repo and a separate Vercel
  // project, which is the thing that made it awkward to change. It is one codebase now,
  // so there is no origin to proxy to and no assetPrefix dance to keep the two builds
  // from fighting over /_next.
  async redirects() {
    return [
      // Founding testers were handed /waitlist back when the waitlist owned the apex.
      { source: "/waitlist", destination: "/early-access", permanent: false },
      // Invite links. The iOS app's share sheet sends `trylatent.co/i/<CODE>`, and the code
      // in that URL is what lets a friend in: they paste the link (or type the six
      // characters) at the app's invite gate. This only has to get them the app, so it is a
      // redirect and not a page - Apple carries nothing through an install, so there is
      // nothing a page could hand over that the URL in their messages does not already.
      //
      // Per-code URLs rather than one shared link so that taps show up per inviter in
      // Vercel analytics: tap -> install -> redeem, instead of redeem alone.
      //
      // Points at TestFlight, the same link /early-access ends on. Swap it for the App
      // Store URL once 1.0 is approved. Temporary (307) so that swap is not cached away.
      {
        source: "/i/:code",
        destination: "https://testflight.apple.com/join/QJrVVGZA",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
