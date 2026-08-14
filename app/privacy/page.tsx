import type { Metadata } from "next";
import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";

export const metadata: Metadata = {
  title: "Privacy Policy — Latent",
  description:
    "How Latent collects, uses, discloses, and protects your information.",
};

export default function PrivacyPolicy() {
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
          Latent Privacy Policy
        </h1>
        <p className="mt-4 text-sm uppercase tracking-[0.14em] text-paper-faint">
          Effective Date: August 13, 2026
        </p>

        <p>
          Latent (&ldquo;Latent,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
          &ldquo;our&rdquo;) respects your privacy and is committed to protecting
          your personal information. This Privacy Policy explains how we collect,
          use, disclose, and protect information when you use our mobile
          application, website, and related services (collectively, the
          &ldquo;Platform&rdquo;).
        </p>
        <p>
          By using the Platform, you consent to the practices described in this
          Privacy Policy.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information necessary to provide, maintain, and improve the
          Platform.
        </p>

        <h3>a. Personal Information</h3>
        <p>Depending on how you use Latent, we may collect:</p>
        <ul>
          <li>Name, username, and email address</li>
          <li>Account credentials and authentication information</li>
          <li>Profile information you choose to provide</li>
          <li>
            Information contained in posts, activities, tags, comments, or other
            content you submit
          </li>
        </ul>

        <h3>b. Focus Session and Productivity Data</h3>
        <p>
          Latent is designed to help users track and understand their
          productivity. We may collect:
        </p>
        <ul>
          <li>Focus session start and end times</li>
          <li>Activities or categories associated with a session</li>
          <li>Productivity and session history</li>
          <li>Timelapse recordings or images captured during focus sessions</li>
          <li>
            Automatically generated session summaries, insights, or statistics
          </li>
          <li>
            Information you voluntarily provide about your productivity or
            activities
          </li>
        </ul>

        <h3>c. Camera and Device Information</h3>
        <p>
          If you enable camera functionality, Latent may access your
          device&rsquo;s camera to record focus sessions and create timelapse
          content.
        </p>
        <p>
          Camera access is controlled through your device&rsquo;s permissions.
          Latent does not access your camera when you have not granted the
          applicable permission or when you are not using a feature that requires
          camera access.
        </p>
        <p>
          We may also collect device information such as device type, operating
          system, app version, IP address, and identifiers necessary to operate,
          secure, and troubleshoot the Platform.
        </p>

        <h3>d. Usage and Analytics Information</h3>
        <p>
          We may collect information about how you interact with the Platform,
          including features used, session activity, crash reports, performance
          information, and general usage patterns.
        </p>
        <p>
          We may use cookies, SDKs, or similar technologies on our website and
          within the Platform for analytics, security, and functionality.
        </p>

        <h3>e. Payment Information</h3>
        <p>
          If Latent offers paid subscriptions or other purchases, payments may be
          processed by third-party payment providers. We generally do not
          directly store your full payment card information.
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We may use the information we collect to:</p>
        <ul>
          <li>Provide, operate, and maintain Latent</li>
          <li>Record and display focus sessions and productivity history</li>
          <li>Generate timelapses, productivity insights, and analytics</li>
          <li>Personalize your experience</li>
          <li>Maintain and improve the Platform</li>
          <li>
            Communicate with you about your account, updates, or support requests
          </li>
          <li>Process subscriptions and payments</li>
          <li>
            Detect, prevent, and address fraud, abuse, security issues, and
            technical problems
          </li>
          <li>Analyze Platform usage and develop new features</li>
          <li>Comply with applicable laws and legal obligations</li>
        </ul>
        <p>
          We do <strong>not</strong> use camera recordings or focus-session data
          for purposes unrelated to operating and improving Latent without
          appropriate notice or consent.
        </p>

        <h2>3. Sharing and Disclosure</h2>
        <p>We may share information in limited circumstances, including:</p>
        <ul>
          <li>
            <strong>Service providers:</strong> With vendors that help us operate
            the Platform, such as cloud hosting, analytics, authentication,
            customer support, and payment providers.
          </li>
          <li>
            <strong>With your direction:</strong> When you choose to share content
            or make information publicly visible through Platform features.
          </li>
          <li>
            <strong>Legal requirements:</strong> When reasonably necessary to
            comply with applicable law, legal process, court orders, or
            governmental requests.
          </li>
          <li>
            <strong>Safety and security:</strong> When necessary to protect the
            rights, safety, security, or property of Latent, our users, or
            others.
          </li>
          <li>
            <strong>Corporate transactions:</strong> In connection with a merger,
            acquisition, financing, reorganization, sale of assets, or similar
            transaction.
          </li>
          <li>
            <strong>With your consent:</strong> When you otherwise authorize us to
            share your information.
          </li>
        </ul>
        <p>
          We do <strong>not sell your personal information</strong> to third
          parties.
        </p>

        <h2>4. Camera and Timelapse Privacy</h2>
        <p>
          Latent&rsquo;s focus-session functionality may involve recording video
          or images of your environment while you work.
        </p>
        <p>
          You are responsible for ensuring that you have appropriate permission to
          record other people or private spaces that may appear in your
          recordings.
        </p>
        <p>
          We encourage you not to record sensitive information, confidential
          documents, passwords, financial information, or other private material
          in your focus sessions.
        </p>
        <p>
          Where technically and commercially applicable, we may process recordings
          to create condensed timelapses or other productivity features. Retention
          periods for recordings may vary depending on the feature and your
          account settings.
        </p>

        <h2>5. User-Generated Content</h2>
        <p>
          Content you voluntarily upload or create through Latent, including
          focus-session recordings, timelapses, activity labels, posts, and other
          content, may be stored and processed to provide Platform functionality.
        </p>
        <p>
          If you choose to make content public or share it with other users, that
          content may be visible to those users and may be copied or redistributed
          by them.
        </p>
        <p>
          You should not upload information that you do not want stored or shared
          through the Platform.
        </p>

        <h2>6. Data Retention</h2>
        <p>
          We retain information for as long as reasonably necessary to provide the
          Platform, maintain legitimate business records, resolve disputes,
          enforce our agreements, prevent abuse, and comply with legal
          obligations.
        </p>
        <p>
          Retention periods may vary depending on the type of information and the
          purpose for which it was collected.
        </p>
        <p>
          When information is no longer reasonably necessary for these purposes, we
          may delete, anonymize, or otherwise de-identify it.
        </p>

        <h2>7. Security</h2>
        <p>
          We use reasonable administrative, technical, and organizational
          safeguards designed to protect your information against unauthorized
          access, disclosure, alteration, or destruction.
        </p>
        <p>
          However, no internet-based service, storage system, or method of
          transmission is completely secure. We cannot guarantee absolute security
          of your information.
        </p>

        <h2>8. Your Rights and Choices</h2>
        <p>
          Depending on your location and applicable law, you may have rights
          regarding your personal information, including the right to:
        </p>
        <ul>
          <li>Access information we maintain about you</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Request restriction of certain processing</li>
          <li>Object to certain uses of your information</li>
          <li>Withdraw consent where processing is based on consent</li>
          <li>Request a copy of certain information in a portable format</li>
          <li>Opt out of certain promotional communications</li>
        </ul>
        <p>
          You may also control certain permissions, including camera access,
          through your device settings.
        </p>
        <p>
          To exercise applicable privacy rights, contact us at{" "}
          <a href="mailto:info@latent.app">info@latent.app</a>.
        </p>
        <p>
          We may need to verify your identity before completing certain requests.
        </p>

        <h2>9. Children&rsquo;s Privacy</h2>
        <p>
          Latent is not intended for children under the age of 13, and we do not
          knowingly collect personal information from children under 13.
        </p>
        <p>
          If you believe that a child under 13 has provided personal information to
          us, please contact us so that we can take appropriate steps to delete
          it.
        </p>

        <h2>10. Third-Party Services</h2>
        <p>
          The Platform may integrate with or rely on third-party services,
          including analytics, authentication, cloud infrastructure, payment
          processing, and other service providers.
        </p>
        <p>
          Those third parties may process information according to their own
          privacy policies and terms. We encourage you to review the privacy
          practices of third-party services you use through Latent.
        </p>

        <h2>11. International Users</h2>
        <p>
          Latent may process and store information in countries other than the
          country in which you live. By using the Platform, you understand that
          your information may be transferred to and processed in jurisdictions
          with different data-protection laws.
        </p>
        <p>
          Where required by applicable law, we will take appropriate measures for
          international data transfers.
        </p>

        <h2>12. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes to
          our Platform, practices, or legal requirements.
        </p>
        <p>
          When we make changes, we will update the &ldquo;Effective Date&rdquo;
          above. Where required by law, we will provide additional notice.
        </p>
        <p>
          Your continued use of the Platform after an updated Privacy Policy
          becomes effective constitutes acceptance of the updated policy, to the
          extent permitted by applicable law.
        </p>

        <h2>13. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or Latent&rsquo;s privacy
          practices, please contact us at:
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:info@latent.app">info@latent.app</a>
        </p>
      </article>
    </main>
  );
}
