import type { Metadata } from "next";
import Wordmark from "@/components/ui/Wordmark";
import GetLatent from "./GetLatent";

/**
 * A friend's invite: `trylatent.co/i/<CODE>`, the only thing the app's share message sends.
 *
 * With the app installed this page never shows: the link is a universal link
 * (public/.well-known/apple-app-site-association) and opens the app, code in the URL. The
 * app only reads a six-character code from a URL, so a hand-picked code of any other length
 * (LARPY) opens the app with nothing.
 * Without the app, Apple carries nothing through an install, so the one button copies this
 * link before opening the store and the person pastes it at the app's invite screen.
 * That button is the whole page, because a browser only lets a page copy on a tap.
 */
type Props = { params: { code: string } };

// Only the shape of a code, not its alphabet. Generated codes are six characters with no
// 0/O, 1/I/L, but hand-picked shared codes are not (LARPY, LATENT2026), and the server is
// what decides whether a code is good. Anything else still gets the page, just without a
// code to hand over.
//
// Next passes `code` percent-encoded (never malformed: a bad escape is a 400 before it gets
// here), so decode it first. A stray comma on a link arrives as LARPY%2C, and stripping only
// the % would copy LARPY2C, a code nobody was sent. Strip, then upper-case, as the server does.
function clean(code: string) {
  const c = decodeURIComponent(code).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return c.length >= 4 && c.length <= 12 ? c : null;
}

export function generateMetadata(): Metadata {
  // What iMessage renders as the link's card, instead of a bare https string.
  return {
    metadataBase: new URL("https://trylatent.co"),
    title: "Join me on Latent",
    description: "Put your phone down. Do the work. Stay accountable with your friends.",
    openGraph: {
      title: "Join me on Latent",
      description: "Put your phone down. Do the work. Stay accountable with your friends.",
      type: "website",
      images: [{ url: "/brand/latent-icon-512.png", width: 512, height: 512 }],
    },
  };
}

export default function InvitePage({ params }: Props) {
  const code = clean(params.code);
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-between bg-ink px-6 pb-12 pt-16 text-center">
      <Wordmark size="text-3xl" />
      <h1 className="font-kalix text-[44px] leading-[1.05] tracking-tight text-paper">
        You&rsquo;re invited
        <br />
        to Latent
      </h1>
      <GetLatent code={code} />
    </main>
  );
}
