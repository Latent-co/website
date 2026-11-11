"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { track } from "@/lib/analytics";
import "./leaderboard.css";

type Row = { rank: number; points: number; pending: number };
type Board = {
  ok: true;
  me: { username: string; rank: number; points: number; pending: number; position: number };
  rows: Row[];
  total: number;
  refreshed_at: string | null;
  last_sync_at: string | null;
  starts_at: string;
  ends_at: string;
  qualify_by: string;
  final: boolean;
};
type Miss = { ok: false; reason: "not_found" | "rate_limited" };

// The username that opened the board, so coming back does not mean typing it again.
const SAVED = "latent.leaderboard.username";
// The board changes every 5 minutes at most; this keeps an open tab close behind it.
const REFRESH_MS = 2 * 60 * 1000;

const PT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Los_Angeles",
});
const when = (iso: string) => `${PT.format(new Date(iso)).replace(":00", "")} PT`;

// Points are sums of halves (1, 0.5, 0.25 ...), exact in a double: show every digit they have
// (3.03125, not 3.0313), without a trail of zeros.
const pts = (n: number) => String(Number(n.toPrecision(12)));

// Browsers that block site data throw on any localStorage call; the board must still open.
const store = {
  get: () => { try { return localStorage.getItem(SAVED); } catch { return null; } },
  set: (v: string) => { try { localStorage.setItem(SAVED, v); } catch {} },
  clear: () => { try { localStorage.removeItem(SAVED); } catch {} },
};

function ago(iso: string | null, now: number) {
  if (!iso) return "not yet";
  const min = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  return min < 1 ? "just now" : min === 1 ? "1 min ago" : min < 60 ? `${min} min ago` : `${Math.round(min / 60)} h ago`;
}

async function lookUp(username: string): Promise<Board | Miss> {
  if (!supabase) throw new Error("not configured");
  const { data, error } = await supabase.rpc("growth_challenge_view", { p_username: username });
  if (error || !data) throw error ?? new Error("empty");
  return data as Board | Miss;
}

export default function Leaderboard() {
  const [input, setInput] = useState("");
  const [board, setBoard] = useState<Board | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [stale, setStale] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const username = useRef<string | null>(null);

  const open = useCallback(async (name: string, fromForm: boolean) => {
    setBusy(true);
    setMessage(null);
    try {
      const got = await lookUp(name);
      if (got.ok) {
        username.current = got.me.username;
        store.set(got.me.username);
        setBoard(got);
        setStale(false);
      } else if (got.reason === "rate_limited") {
        setMessage("Too many lookups from this network. Try again in a little while.");
      } else {
        store.clear();
        setMessage(
          "That username isn't on the contest list. Use the Latent username you put on the form.",
        );
      }
      if (fromForm) track("leaderboard_lookup", { found: got.ok, reason: got.ok ? null : got.reason });
    } catch {
      setMessage("Couldn't reach Latent. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }, []);

  // A returning contestant opens straight onto the board.
  useEffect(() => {
    const saved = store.get();
    if (saved) {
      setInput(saved);
      open(saved, false);
    }
  }, [open]);

  // Refresh while the tab is visible. A failed refresh keeps the last good board and says so.
  const hasBoard = board !== null;
  useEffect(() => {
    if (!hasBoard) return;
    const tick = async () => {
      setNow(Date.now());
      const asked = username.current;
      if (document.visibilityState !== "visible" || !asked) return;
      try {
        const got = await lookUp(asked);
        // "Not you?" may have been pressed while this was in flight: never bring that board back.
        if (username.current !== asked) return;
        if (got.ok) {
          setBoard(got);
          setStale(false);
        } else {
          setStale(true);
        }
      } catch {
        if (username.current === asked) setStale(true);
      }
    };
    const id = window.setInterval(tick, REFRESH_MS);
    const clock = window.setInterval(() => setNow(Date.now()), 30 * 1000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearInterval(id);
      window.clearInterval(clock);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [hasBoard]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const name = input.trim();
    if (name) open(name, true);
  }

  if (!board) {
    return (
      <section className="lb-gate">
        <p className="lb-label">Growth challenge</p>
        <h1 className="lb-title">Leaderboard</h1>
        <p className="lb-lede">
          Enter the Latent username you signed up for the challenge with to see where you stand.
        </p>
        <form onSubmit={submit} className="lb-form">
          <label htmlFor="username" className="lb-label">
            Latent username
          </label>
          <input
            id="username"
            className="lb-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="yourname"
          />
          <button type="submit" className="lb-btn" disabled={busy || !input.trim()}>
            {busy ? "Looking…" : "See the leaderboard"}
          </button>
          {message && (
            <p role="alert" className="lb-note">
              {message}
            </p>
          )}
        </form>
      </section>
    );
  }

  const t = now;
  const started = t >= new Date(board.starts_at).getTime();
  const joinsOpen = t < new Date(board.ends_at).getTime();
  const phase = board.final
    ? "Final results."
    : !started
      ? `Starts ${when(board.starts_at)}.`
      : joinsOpen
        ? `Invites count until ${when(board.ends_at)}.`
        : `Invites closed. People who joined have until ${when(board.qualify_by)} to record 25 minutes.`;

  return (
    <section className="lb-board">
      <div className="lb-card">
        <p className="lb-label">@{board.me.username}</p>
        <p className="lb-rank">
          #{board.me.rank}
          <span className="lb-of">of {board.total}</span>
        </p>
        <div className="lb-stats">
          <div>
            <p className="lb-stat lb-stat--accent">{pts(board.me.points)}</p>
            <p className="lb-stat-label">points</p>
          </div>
          <div>
            <p className="lb-stat">{pts(board.me.pending)}</p>
            <p className="lb-stat-label">pending</p>
          </div>
        </div>
        <p className="lb-phase">{phase}</p>
      </div>

      <details className="lb-how">
        <summary>How points work</summary>
        <p>
          Everyone who joins with your invite link is worth 1 point. Everyone they bring is worth
          0.5, the next level 0.25, and so on. A person counts once they record a session of at
          least 25 minutes.
        </p>
        <p>
          Pending points are people who joined but haven&rsquo;t recorded 25 minutes yet. Ties go to
          whoever has more direct invites. The board updates every few minutes.
        </p>
      </details>

      <div className="lb-list-head">
        <h2 className="lb-label">All contestants</h2>
        <p className="lb-updated">
          {stale ? "Couldn\u2019t refresh · " : ""}updated {ago(board.refreshed_at, t)}
        </p>
      </div>
      <ol className="lb-list">
        {board.rows.map((row, i) => {
          const mine = i + 1 === board.me.position;
          return (
            <li key={i} aria-current={mine ? "true" : undefined} className={mine ? "lb-row lb-row--me" : "lb-row"}>
              <span className="lb-row-rank">#{row.rank}</span>
              <span className="lb-row-who">{mine ? "You" : "Contestant"}</span>
              <span className="lb-row-points">{pts(row.points)}</span>
              <span className="lb-row-pending">{row.pending ? `+${pts(row.pending)} pending` : ""}</span>
            </li>
          );
        })}
      </ol>

      <button
        className="lb-switch"
        onClick={() => {
          store.clear();
          username.current = null;
          setBoard(null);
          setInput("");
        }}
      >
        Not you? Use a different username
      </button>
    </section>
  );
}
