import type { Metadata } from "next";
import Leaderboard from "./Leaderboard";

export const metadata: Metadata = {
  title: "Growth challenge leaderboard — Latent",
  description: "Where you stand in the Latent growth challenge.",
  // A contestant tool, not a page to be found: the board only opens with a contestant's username.
  robots: { index: false, follow: false },
};

/**
 * The growth challenge leaderboard (Nov 11 to Nov 18, 2026).
 *
 * Nothing shows until a contestant enters their Latent username (Eddie, 2026-11-10). Then the
 * board is every contestant's rank, points and pending points with no names, and their own row
 * marked. Everything comes from one call, `growth_challenge_view` in latent-frontend's
 * backend/supabase/migrations/20261111042000_growth_challenge_leaderboard.sql, which also
 * holds the scoring rule. The board refreshes there every 5 minutes.
 *
 * It wears the home page's look (leaderboard.css), not the rest of this Next app's.
 */
export default function LeaderboardPage() {
  return (
    <div className="lb">
      <main className="lb-wrap">
        <header className="lb-nav">
          {/* A plain link: `/` is a rewrite to static HTML, so a Next <Link> prefetch 404s. */}
          <a href="/" aria-label="Latent home">
            <img src="/home/assets/img/wordmark.png" alt="Latent." width={82} height={24} />
          </a>
        </header>
        <Leaderboard />
      </main>
    </div>
  );
}
