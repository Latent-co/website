import type { Metadata } from "next";
import Wordmark from "@/components/ui/Wordmark";

// The App Store listing, with no storefront in the path, so Apple sends each visitor to their
// own country's store (same as the invite page).
const STORE_URL = "https://apps.apple.com/app/id6788947658";

export const metadata: Metadata = {
  metadataBase: new URL("https://trylatent.co"),
  title: "A few quick questions from Eddie & Malcolm",
  description: "Open Latent to answer.",
  // Only for people sent the link: nothing here to be found by search.
  robots: { index: false, follow: false },
  openGraph: {
    title: "A few quick questions from Eddie & Malcolm",
    description: "Open Latent to answer.",
    type: "website",
    images: [{ url: "/brand/latent-icon-512.png", width: 512, height: 512 }],
  },
};

/**
 * The PMF survey's link: `trylatent.co/survey`, sent in a founder's DM inside the app.
 *
 * With the app installed this page normally never shows: the path is a universal link
 * (public/.well-known/apple-app-site-association) and the app opens the survey, asking its
 * server whether this person has one (latent-frontend `PMFSurveyGate`). The page is for
 * everyone else: a phone without the app, a link pasted into a browser, an app build too old
 * to know the path. The survey itself only exists in the app, so the page sends people there.
 *
 * "Open Latent" is `latent://survey`, not this domain: a page in Safari can't hand its own
 * domain's link back to the app, but the app's URL scheme always opens it. A build without
 * survey support just opens the app.
 */
export default function SurveyPage() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-between bg-ink px-6 pb-12 pt-16 text-center">
      <Wordmark size="text-3xl" />
      <h1 className="font-kalix text-[44px] leading-[1.05] tracking-tight text-paper">
        A few quick
        <br />
        questions
      </h1>
      <div className="flex w-full max-w-sm flex-col items-center gap-5">
        <a
          href="latent://survey"
          className="block w-full rounded-full bg-paper py-4 text-[17px] font-semibold text-ink active:scale-[0.98] transition-transform"
        >
          Open Latent to answer
        </a>
        <a href={STORE_URL} className="text-[15px] text-paper-dim underline underline-offset-4">
          Don&rsquo;t have Latent? Get it on the App Store
        </a>
      </div>
    </main>
  );
}
