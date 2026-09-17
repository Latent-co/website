import type { Metadata } from "next";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";

/**
 * The survey came over from its own deployment (latent-waitlist), where these two
 * faces were the whole site's fonts. Here they belong to this route and nothing else:
 * the marketing pages are Inter + Kalix, and loading two more families globally would
 * make every visitor who never opens the survey pay for them.
 *
 * Declaring them in a route layout keeps `survey.css` working untouched — it reads
 * --font-instrument-serif / --font-hanken-grotesk and knows nothing about where they
 * come from — while next/font still hashes and self-hosts them at build time.
 */
const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Latent — Early access",
  description:
    "Latent is available for early access. Answer five questions and get the TestFlight link.",
};

export default function EarlyAccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${hankenGrotesk.variable} ${instrumentSerif.variable}`}>
      {children}
    </div>
  );
}
