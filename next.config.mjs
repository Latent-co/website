/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The survey lives in its own repo and its own Vercel project (latent-waitlist), but
  // its canonical URL is on the apex: trylatent.co/early-access. It used to 307 across
  // to waitlist.trylatent.co, which meant the address bar — and anything anyone copied
  // out of it — advertised the subdomain. These rewrites proxy it instead, so the apex
  // URL is the one people see and share.
  //
  // Why this does not need /_next/* proxied too: the survey app sets
  // `assetPrefix: "https://waitlist.trylatent.co"`, so its HTML asks for chunks and
  // fonts absolutely. /_next/* on this domain therefore stays exclusively THIS app's,
  // which is what makes the two builds coexist under one origin at all.
  async rewrites() {
    return [
      { source: "/early-access", destination: "https://waitlist.trylatent.co/early-access" },
      { source: "/early-access/:path*", destination: "https://waitlist.trylatent.co/early-access/:path*" },
      // public/ is NOT covered by assetPrefix, so the survey's brand marks stay
      // root-relative and would resolve against this app, which has no /brand. Proxying
      // the whole prefix is safe precisely because this site owns nothing under it.
      { source: "/brand/:path*", destination: "https://waitlist.trylatent.co/brand/:path*" },
    ];
  },

  // Kept from when the waitlist owned the apex: founding testers were handed /waitlist.
  async redirects() {
    return [
      { source: "/waitlist", destination: "/early-access", permanent: false },
    ];
  },
};

export default nextConfig;
