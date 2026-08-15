/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The waitlist site used to live at the apex. It now lives on
  // waitlist.trylatent.co, so keep the links we already handed out working —
  // founding testers were sent /early-access directly.
  async redirects() {
    return [
      {
        source: "/early-access",
        destination: "https://waitlist.trylatent.co/early-access",
        permanent: false,
      },
      {
        source: "/waitlist",
        destination: "https://waitlist.trylatent.co/early-access",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
