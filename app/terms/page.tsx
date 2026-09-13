import type { Metadata } from "next";
import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";

export const metadata: Metadata = {
  title: "Terms of Service — Latent",
  description:
    "The terms that govern your use of Latent, including our rules for content and conduct.",
};

export default function TermsOfService() {
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
          Latent Terms of Service
        </h1>
        <p className="mt-4 text-sm uppercase tracking-[0.14em] text-paper-faint">
          Effective Date: September 13, 2026
        </p>

        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
          use of the Latent mobile application, website, and related services
          (collectively, the &ldquo;Platform&rdquo;). Latent
          (&ldquo;Latent,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) is operated by Weaive, Inc.
        </p>
        <p>
          By creating an account or using the Platform, you agree to these Terms
          and to our{" "}
          <Link href="/privacy" className="underline hover:text-gold">
            Privacy Policy
          </Link>
          . If you do not agree, do not use the Platform. Please read Section 13
          (Dispute Resolution) carefully: it requires most disputes to be
          resolved through binding individual arbitration and waives your right
          to a jury trial or class action.
        </p>

        <h2>1. Eligibility</h2>
        <p>
          You must be at least 13 years old to use Latent. If you are under the
          age of majority where you live, you may only use the Platform with the
          involvement of a parent or legal guardian. By using Latent, you
          represent that you meet these requirements, that the information you
          provide is accurate, and that you are not located in a country subject
          to a U.S. Government embargo and are not on any U.S. Government
          restricted-parties list.
        </p>

        <h2>2. Your Account</h2>
        <p>
          You are responsible for the activity that happens under your account
          and for keeping your login credentials secure. Provide accurate
          information when you register, and let us know promptly if you believe
          your account has been compromised. You may delete your account at any
          time from within the app, which removes your account and associated
          data as described in our Privacy Policy.
        </p>

        <h2>3. License to Use Latent</h2>
        <p>
          Subject to these Terms, Latent grants you a limited, non-exclusive,
          non-transferable, revocable license to download and use the Platform on
          a device you own or control, for your personal, non-commercial use, and
          subject to the App Store&rsquo;s usage rules. You may not copy, modify,
          distribute, sell, rent, reverse-engineer, decompile, or create
          derivative works of the Platform, or attempt to gain unauthorized
          access to it, except to the extent this restriction is prohibited by
          applicable law. We may update, change, or discontinue features of the
          Platform at any time.
        </p>

        <h2>4. Your Content</h2>
        <p>
          Latent lets you record focus sessions, capture timelapses and photos,
          write notes and comments, and send messages to friends
          (&ldquo;Your Content&rdquo;). You retain ownership of Your Content. You
          grant Latent a limited, non-exclusive, worldwide, royalty-free license
          to host, store, reproduce, and display Your Content solely to operate
          and provide the Platform to you and the people you choose to share it
          with. This license ends when you delete Your Content or your account,
          except for content others have already saved or copies we must retain
          to comply with law.
        </p>
        <p>
          You are solely responsible for Your Content and for ensuring you have
          the rights to share it, including the rights of anyone who appears in
          your recordings.
        </p>

        <h2>5. Feedback</h2>
        <p>
          If you send us feedback, suggestions, or ideas about the Platform, you
          grant us a perpetual, irrevocable, worldwide, royalty-free license to
          use them for any purpose, without any obligation or compensation to
          you.
        </p>

        <h2>6. Acceptable Use and Zero Tolerance for Objectionable Content</h2>
        <p>
          <strong>
            Latent has zero tolerance for objectionable content or abusive
            behavior.
          </strong>{" "}
          You agree not to post, send, or share content, and not to engage in
          conduct, that:
        </p>
        <ul>
          <li>
            is unlawful, harassing, threatening, abusive, defamatory, or invasive
            of another person&rsquo;s privacy;
          </li>
          <li>
            is hateful or discriminatory, or promotes violence or harm against
            any individual or group;
          </li>
          <li>
            is sexually explicit, pornographic, or exploits or endangers minors
            in any way;
          </li>
          <li>
            depicts or encourages self-harm, illegal activity, or dangerous acts;
          </li>
          <li>
            impersonates another person, or misrepresents your affiliation with a
            person or entity;
          </li>
          <li>
            infringes any patent, trademark, copyright, or other intellectual
            property or proprietary right;
          </li>
          <li>
            contains spam, malware, or attempts to compromise the security or
            integrity of the Platform.
          </li>
        </ul>
        <p>
          You also agree not to harass, bully, stalk, or abuse other users.
          Violating these rules may result in removal of content and suspension
          or termination of your account.
        </p>

        <h2>7. Reporting, Blocking, and Enforcement</h2>
        <p>
          Latent provides tools to <strong>report</strong> objectionable content
          or abusive users and to <strong>block</strong> other users directly
          within the app. We review reports of objectionable content and, where
          appropriate, act on them promptly — including removing content and
          removing the users who provided it. We may remove content or suspend or
          terminate accounts that violate these Terms, with or without notice.
        </p>
        <p>
          To report content or a user, use the in-app reporting tools, or contact
          us at <a href="mailto:info@latent.app">info@latent.app</a>.
        </p>

        <h2>8. Copyright and DMCA</h2>
        <p>
          We respect intellectual property rights and expect you to do the same.
          If you believe content on the Platform infringes your copyright, send a
          notice under the Digital Millennium Copyright Act (DMCA) to our
          designated agent at{" "}
          <a href="mailto:info@latent.app">info@latent.app</a>, including: (a)
          your physical or electronic signature; (b) identification of the
          copyrighted work; (c) identification of the material you claim is
          infringing and where it is located; (d) your contact information; (e) a
          statement that you have a good-faith belief the use is not authorized;
          and (f) a statement, under penalty of perjury, that the information is
          accurate and that you are the rights holder or authorized to act on
          their behalf. We respond to valid notices, including by removing
          infringing content, and we terminate the accounts of repeat
          infringers.
        </p>

        <h2>9. Termination</h2>
        <p>
          You may stop using Latent and delete your account at any time. We may
          suspend or terminate your access to the Platform if you violate these
          Terms, if required by law, or if we discontinue the Platform. Sections
          of these Terms that by their nature should survive termination will
          survive.
        </p>

        <h2>10. Disclaimers</h2>
        <p>
          The Platform is provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo; without warranties of any kind, whether express or
          implied, including warranties of merchantability, fitness for a
          particular purpose, and non-infringement. We do not warrant that the
          Platform will be uninterrupted, secure, or error-free.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, Latent and Weaive, Inc. will
          not be liable for any indirect, incidental, special, consequential, or
          punitive damages, or any loss of data, profits, or goodwill, arising
          out of or related to your use of the Platform. Our total liability for
          any claim relating to the Platform will not exceed one hundred U.S.
          dollars ($100).
        </p>

        <h2>12. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Latent, Weaive, Inc.,
          and its officers, directors, employees, and agents from and against any
          claims, liabilities, damages, losses, and expenses (including
          reasonable legal fees) arising out of or related to: (a) your use of
          the Platform; (b) Your Content; (c) your violation of these Terms; or
          (d) your violation of any right of another person or entity.
        </p>

        <h2>13. Dispute Resolution; Arbitration and Class-Action Waiver</h2>
        <p>
          <strong>
            Please read this section carefully — it affects your legal rights.
          </strong>{" "}
          Most disputes can be resolved informally, so before filing a claim you
          agree to contact us at{" "}
          <a href="mailto:info@latent.app">info@latent.app</a> and try to resolve
          it for at least 30 days.
        </p>
        <p>
          If we cannot resolve a dispute informally, you and Latent agree that any
          dispute arising out of or relating to these Terms or the Platform will
          be resolved by <strong>binding individual arbitration</strong>, rather
          than in court, except that either party may bring an individual claim
          in small-claims court. You and Latent{" "}
          <strong>
            waive the right to a jury trial and to participate in a class action
            or class-wide arbitration
          </strong>
          . You may opt out of this arbitration agreement by emailing{" "}
          <a href="mailto:info@latent.app">info@latent.app</a> within 30 days of
          first accepting these Terms.
        </p>

        <h2>14. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the State of Delaware, United
          States, without regard to its conflict-of-laws rules, except where
          local law requires otherwise.
        </p>

        <h2>15. Apple App Store</h2>
        <p>
          The following applies when you access the Platform through an app
          obtained from the Apple App Store:
        </p>
        <ul>
          <li>
            These Terms are between you and Latent (Weaive, Inc.) only, not Apple,
            and Apple is not responsible for the Platform or its content.
          </li>
          <li>
            Your license to use the app is a non-transferable license to use it on
            any Apple-branded device you own or control, as permitted by the App
            Store&rsquo;s usage rules.
          </li>
          <li>
            Apple has no obligation to provide maintenance or support for the app.
          </li>
          <li>
            To the maximum extent permitted by law, Apple has no warranty
            obligation with respect to the app, and any warranty claims are
            Latent&rsquo;s responsibility.
          </li>
          <li>
            Apple is not responsible for addressing any product-liability,
            third-party intellectual-property, or legal claims relating to the
            app.
          </li>
          <li>
            Apple and its subsidiaries are third-party beneficiaries of these
            Terms and may enforce them against you.
          </li>
        </ul>

        <h2>16. General</h2>
        <p>
          These Terms, together with our Privacy Policy, are the entire agreement
          between you and Latent regarding the Platform. If any provision is
          found unenforceable, the remaining provisions stay in effect. Our
          failure to enforce a provision is not a waiver. You may not assign these
          Terms; we may assign them to an affiliate or successor. Except for Apple
          as described in Section 15, there are no third-party beneficiaries to
          these Terms.
        </p>

        <h2>17. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. When we do, we will update
          the &ldquo;Effective Date&rdquo; above, and where required by law we
          will provide additional notice. Your continued use of the Platform
          after updated Terms take effect constitutes acceptance of the updated
          Terms.
        </p>

        <h2>18. Contact Us</h2>
        <p>
          If you have questions about these Terms, contact us at{" "}
          <a href="mailto:info@latent.app">info@latent.app</a>.
        </p>
      </article>
    </main>
  );
}
