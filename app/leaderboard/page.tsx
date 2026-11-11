import type { Metadata } from "next";
import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";
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
 */
export default function LeaderboardPage() {
  return (
    <main className="mx-auto flex min-h-[100svh] max-w-xl flex-col px-5 pb-20 pt-10">
      <header className="flex items-center justify-between">
        <Link href="/" aria-label="Latent home">
          <Wordmark size="text-xl" />
        </Link>
        <span className="label text-[11px] text-paper-faint">Growth challenge</span>
      </header>
      <Leaderboard />
    </main>
  );
}
