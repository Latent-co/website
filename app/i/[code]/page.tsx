import type { Metadata } from "next";
import Wordmark from "@/components/ui/Wordmark";
import GetLatent from "./GetLatent";

/**
 * A friend's invite: `trylatent.co/i/<CODE>`, the only thing the app's share message sends.
 *
 * With the app installed this page never shows: the link is a universal link
 * (public/.well-known/apple-app-site-association) and opens the app, code in the URL.
 * Without it, Apple carries nothing through an install, so the one button copies this
 * link before opening the store and the app reads it back off the clipboard on first open.
 * That button is the whole page, because a browser only lets a page copy on a tap.
 */
type Props = { params: { code: string } };

// Same alphabet as the app's codes (no 0/O, 1/I/L). Anything else still gets the page,
// just without a code to hand over.
function clean(code: string) {
  const c = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return /^[A-HJKMNP-Z2-9]{6}$/.test(c) ? c : null;
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
