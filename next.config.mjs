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
  // Invite links (`/i/<code>`) are a page now, app/i/[code]/, not a redirect: it copies the
  // link before sending someone to the store, which is how the code survives the install.
  // With the app installed the link never reaches here at all. This file is what tells iOS
  // to open the app instead, and Apple only reads it as JSON.
  // The home page is two static pages in public/home/: index.html for laptops and tablets,
  // mobile.html for phones, built as full-screen scenes. Both are served at `/` so a shared
  // link works on either; the user agent picks, and ?desktop=1 / ?mobile=1 force one (for
  // testing). iPads and Android tablets say neither "iPhone" nor "Android ... Mobile", so
  // they get the desktop page, which handles their widths.
  async rewrites() {
    const phone = ".*(?:iPhone|iPod|Android.+Mobile|Windows Phone).*";
    return {
      beforeFiles: [
        { source: "/", has: [{ type: "query", key: "desktop", value: "(?:.*)" }], destination: "/home/index.html" },
        { source: "/", has: [{ type: "query", key: "mobile", value: "(?:.*)" }], destination: "/home/mobile.html" },
        { source: "/", has: [{ type: "header", key: "user-agent", value: phone }], destination: "/home/mobile.html" },
        { source: "/", destination: "/home/index.html" },
      ],
    };
  },

  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
      // One URL, two pages: no cache in front of `/` may hand a phone the desktop page.
      {
        source: "/",
        headers: [{ key: "Vary", value: "User-Agent" }],
      },
    ];
  },

  async redirects() {
    return [
      // Founding testers were handed /waitlist back when the waitlist owned the apex.
      { source: "/waitlist", destination: "/early-access", permanent: false },
    ];
  },
};

export default nextConfig;
