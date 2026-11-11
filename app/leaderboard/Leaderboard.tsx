"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { track } from "@/lib/analytics";

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
          "That username isn't on the contest list. Use the Latent username you put on the form, without the @.",
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
      <section className="mt-16 flex flex-col">
        <h1 className="font-kalix text-[40px] leading-[1.05] tracking-tight text-paper">
          Leaderboard
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-paper-dim">
          Enter the Latent username you signed up for the challenge with to see where you stand.
        </p>
        <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
          <label htmlFor="username" className="label text-[11px] text-paper-faint">
            Latent username
          </label>
          <input
            id="username"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="yourname"
            className="w-full rounded-2xl border border-ink-line bg-ink-raised px-4 py-4 text-[17px] text-paper placeholder:text-paper-faint focus:border-gold/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="mt-2 w-full rounded-full bg-paper py-4 text-[17px] font-semibold text-ink transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            {busy ? "Looking…" : "See the leaderboard"}
          </button>
          {message && (
            <p role="alert" className="text-[14px] leading-relaxed text-paper-dim">
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
    <section className="mt-10 flex flex-col">
      <div className="rounded-3xl border border-ink-line bg-ink-raised p-6">
        <p className="label text-[11px] text-paper-faint">@{board.me.username}</p>
        <p className="mt-3 font-kalix text-[44px] leading-none tracking-tight text-paper">
          #{board.me.rank}
          <span className="ml-2 align-middle text-[17px] font-sans tracking-normal text-paper-dim">
            of {board.total}
          </span>
        </p>
        <div className="mt-5 flex gap-8">
          <div>
            <p className="numeric text-[28px] font-semibold text-gold">{pts(board.me.points)}</p>
            <p className="text-[13px] text-paper-dim">points</p>
          </div>
          <div>
            <p className="numeric text-[28px] font-semibold text-paper">{pts(board.me.pending)}</p>
            <p className="text-[13px] text-paper-dim">pending</p>
          </div>
        </div>
        <p className="mt-5 text-[13px] leading-relaxed text-paper-dim">{phase}</p>
      </div>

      <details className="mt-4 rounded-2xl border border-ink-line px-5 py-4 text-[14px] leading-relaxed text-paper-dim">
        <summary className="cursor-pointer text-paper">How points work</summary>
        <p className="mt-3">
          Everyone who joins with your invite link is worth 1 point. Everyone they bring is worth
          0.5, the next level 0.25, and so on. A person counts once they record a session of at
          least 25 minutes.
        </p>
        <p className="mt-2">
          Pending points are people who joined but haven&rsquo;t recorded 25 minutes yet. Ties go to
          whoever has more direct invites. The board updates every few minutes.
        </p>
      </details>

      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="label text-[11px] text-paper-faint">All contestants</h2>
        <p className="text-[12px] text-paper-faint">
          {stale ? "Couldn't refresh · " : ""}updated {ago(board.refreshed_at, t)}
        </p>
      </div>
      <ol className="mt-3 divide-y divide-ink-line rounded-2xl border border-ink-line">
        {board.rows.map((row, i) => {
          const mine = i + 1 === board.me.position;
          return (
            <li
              key={i}
              aria-current={mine ? "true" : undefined}
              className={`numeric flex items-center gap-4 px-5 py-3 text-[15px] ${mine ? "bg-gold/10" : ""}`}
            >
              <span className="w-10 text-paper-dim">#{row.rank}</span>
              <span className={`flex-1 ${mine ? "font-semibold text-gold" : "text-paper-faint"}`}>
                {mine ? "You" : "Contestant"}
              </span>
              <span className={mine ? "font-semibold text-paper" : "text-paper"}>{pts(row.points)}</span>
              <span className="w-24 text-right text-[13px] text-paper-faint">
                {row.pending ? `+${pts(row.pending)} pending` : ""}
              </span>
            </li>
          );
        })}
      </ol>

      <button
        onClick={() => {
          store.clear();
          username.current = null;
          setBoard(null);
          setInput("");
        }}
        className="mt-8 self-center text-[13px] text-paper-faint underline-offset-4 hover:text-paper-dim hover:underline"
      >
        Not you? Use a different username
      </button>
    </section>
  );
}
