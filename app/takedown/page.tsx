import type { Metadata } from "next";
import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";

export const metadata: Metadata = {
  title: "Request content removal — Latent",
  description:
    "How to ask Latent to remove an intimate image shared without consent, or other content that breaks our rules.",
};

// The notice-and-removal process the TAKE IT DOWN Act requires of platforms that host
// user content (in force May 19, 2026). It has to be clear, easy to find, and open to people
// who do not have an account, so it lives on the public site and the app links here from
// Settings › Privacy. The four things a request must contain mirror the statute. The 48-hour
// clock and the team's side of it are in docs/MODERATION.md in latent-frontend.
const REQUEST_MAILTO =
  "mailto:support@trylatent.co?subject=" +
  encodeURIComponent("Content removal request");

export default function Takedown() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-10">
      {/* Lightweight header — wordmark links home. */}
      <header className="flex items-center justify-between">
        <Link href="/" aria-label="Back to home">
          <Wordmark size="text-xl" />
        </Link>
        <Link
          href="/"
          className="text-sm text-paper-dim transition-colors hover:text-gold"
        >
          ← Back to home
        </Link>
      </header>

      <div className="rule-fade my-10" />

      <article className="privacy-prose">
        <h1 className="font-kalix text-4xl tracking-tight text-paper sm:text-5xl">
          Request content removal
        </h1>
        <p className="mt-4 text-sm uppercase tracking-[0.14em] text-paper-faint">
          Effective Date: October 1, 2026
        </p>

        <h2>Intimate images shared without consent</h2>
        <p>
          If an intimate image or video of you is on Latent and you did not
          consent to it being shared, you can ask us to remove it. You do not need
          a Latent account. Someone you have authorized, such as a parent or a
          lawyer, can ask for you.
        </p>
        <p>
          We remove valid requests <strong>within 48 hours</strong> of receiving
          them, along with any identical copies we can find.
        </p>

        <h3>How to ask</h3>
        <p>
          Email{" "}
          <a href={REQUEST_MAILTO}>support@trylatent.co</a> with the subject
          &ldquo;Content removal request&rdquo;, and include:
        </p>
        <ul>
          <li>
            <strong>Your name and signature.</strong> Typing your full name counts
            as a signature.
          </li>
          <li>
            <strong>What to remove.</strong> The username of the account that
            posted it and anything that helps us find it: when it was posted, a
            description, or a screenshot of where you saw it. Please do not send
            the image itself.
          </li>
          <li>
            <strong>A short statement</strong> that you believe in good faith the
            image is of you (or the person you represent) and was shared without
            consent.
          </li>
          <li>
            <strong>How to reach you</strong>, so we can confirm when it is done.
          </li>
        </ul>
        <p>
          If you use Latent, you can also report the post in the app: tap the
          &middot;&middot;&middot; on the post, then Report, then &ldquo;Intimate
          image shared without consent&rdquo;.
        </p>

        <h2>Content involving a minor</h2>
        <p>
          If you see content on Latent that sexually exploits or endangers a
          child, report it in the app (&ldquo;Child safety&rdquo;) or email{" "}
          <a href="mailto:support@trylatent.co">support@trylatent.co</a>{" "}
          right away. We remove it, report it to the National Center for Missing
          &amp; Exploited Children, and terminate the accounts involved. You can
          also report directly to NCMEC at{" "}
          <a href="https://report.cybertip.org">report.cybertip.org</a>. If a
          child is in immediate danger, call 911.
        </p>

        <h2>Everything else</h2>
        <p>
          For anything else that breaks our{" "}
          <Link href="/terms" className="underline hover:text-gold">
            Terms of Service
          </Link>
          , use the in-app Report button or email{" "}
          <a href="mailto:support@trylatent.co">support@trylatent.co</a>. For
          copyright claims, follow the DMCA process in Section 8 of the Terms.
        </p>
      </article>
    </main>
  );
}
