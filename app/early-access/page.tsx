"use client";

import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import "./survey.css";

/* =========================================================================
   Latent - early-access application flow.
   Ported from the latent-early-access.html prototype: same copy, flow,
   film-strip progress, and behavior - recolored to the Latent gold brand.

   Persistence is PROGRESSIVE: a row in Supabase `waitlist` is upserted (keyed
   by session_id) on every answer, so a lead is captured the moment they enter
   their email - never deferred to the end. See persist() / emit() below.
   ========================================================================= */

type Resp = string | string[] | boolean | null;

interface Step {
  type: "welcome" | "single" | "multi" | "text" | "email" | "final";
  key?: string;
  head?: string;
  help?: string;
  options?: string[];
  placeholder?: string;
  placeholderPhone?: string;
}

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none">
    <path
      d="M20 6L9 17l-5-5"
      stroke="#1a1305"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DISCORD_INVITE = "https://discord.gg/NQBfWz6Zdr";

// The payoff. Shown in full on the final screen as well as wired to the button: this is
// the one URL someone may want to copy to a phone, and a bare <a> with no visible href is
// useless the moment they are reading it on a laptop.
const TESTFLIGHT_URL = "https://testflight.apple.com/join/QJrVVGZA";

// "Join the Discord" - the final screen's secondary action, under the TestFlight link.
// Opens the invite in a new tab and nothing else; it used to double as the "continue"
// on a dedicated Discord step, which is why it once took an onClick.
function DiscordButton() {
  return (
    <a
      className="btn btn-discord"
      href={DISCORD_INVITE}
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg className="discord-glyph" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.078.037c-.21.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.249.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.369a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.197.373.291a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"
        />
      </svg>
      Join the Discord
    </a>
  );
}

const STEPS: Step[] = [
  { type: "welcome" },

  {
    type: "single",
    key: "pillar",
    head: "Which part of Latent pulls you in most?",
    help: "Pick the one that resonates.",
    options: [
      "Filming timelapses of my sessions",
      "Tracking my progress over time with stats",
      "My friends, real stakes, holding me to it",
      "Seeing my own patterns: when I lock in vs. slip",
    ],
  },

  {
    type: "multi",
    key: "struggle",
    head: "What's the real thing getting in your way?",
    help: "Select all that apply.",
    options: [
      "I procrastinate or I can't make myself start",
      "I start strong and then fall off",
      "I get distracted with my phone",
      "I'm doing it alone or no one around me is locked in",
      "I have no clue on what to focus on",
    ],
  },

  {
    type: "text",
    key: "detail",
    head: "What does that actually look like for you?",
    help: "Optional, but the more real you get, the better we build for you.",
    placeholder:
      "The last time you sat down to work and it didn't happen, what got in the way?",
  },

  {
    type: "multi",
    key: "tried",
    head: "What have you already tried?",
    help: "Select all that apply.",
    options: [
      "An accountability partner or friend",
      "Deleting or limiting social apps",
      "To-do lists, time-blocking, Notion",
      "Other productivity apps",
      "Just willpower",
      "Nothing that's really stuck yet",
    ],
  },

  {
    type: "email",
    key: "email",
    head: "Where should we send your invite?",
    help: "We'll only use these to get you in.",
    placeholder: "youremail@email.com",
    placeholderPhone: "(555) 123-4567",
  },

  { type: "final" },
];

// indices that count toward the progress strip (the form portion)
const FORM_START = 1;
const FORM_END = STEPS.length - 2; // 1..5
const FORM_TOTAL = FORM_END - FORM_START + 1;

export default function EarlyAccess() {
  const responses = useRef<Record<string, Resp>>({}).current;
  const [step, setStep] = useState(0);
  const [, force] = useReducer((x: number) => x + 1, 0);

  // Mint the session id once and capture attribution (utm_* + referrer) the
  // moment the survey loads - before any answer is saved.
  useEffect(() => {
    if (responses.session_id) return;
    responses.session_id = crypto.randomUUID();
    const q = new URLSearchParams(window.location.search);
    responses.utm_source = q.get("utm_source");
    responses.utm_medium = q.get("utm_medium");
    responses.utm_campaign = q.get("utm_campaign");
    responses.referrer = document.referrer || null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Progressive save: upsert the current answers to the waitlist row keyed by
  // session_id via the `save_waitlist` RPC (a SECURITY DEFINER function that
  // does the insert-or-update server-side). Going through the function keeps the
  // table's reads locked down - anon never needs SELECT/INSERT/UPDATE on it.
  // Fire-and-forget so the UI never blocks on the network; failures are logged.
  const persist = (completed: boolean) => {
    const r = responses;
    if (!supabase || !r.session_id) return;
    supabase
      .rpc("save_waitlist", {
        payload: {
          session_id: r.session_id as string,
          updated_at: new Date().toISOString(),
          completed,
          email: (r.email as string) ?? null,
          phone: (r.phone as string) ?? null,
          pillar: (r.pillar as string) ?? null,
          struggle: (r.struggle as string[]) ?? null,
          detail: (r.detail as string) ?? null,
          tried: (r.tried as string[]) ?? null,
          utm_source: (r.utm_source as string) ?? null,
          utm_medium: (r.utm_medium as string) ?? null,
          utm_campaign: (r.utm_campaign as string) ?? null,
          referrer: (r.referrer as string) ?? null,
        },
      })
      .then(({ error }) => {
        if (error) console.warn("waitlist save failed:", error.message);
      });
  };

  const emit = () => {
    // dev hook: inspect the captured payload in the console
    console.log("Latent responses →", JSON.parse(JSON.stringify(responses)));
    // progressive save - `completed` is true only on the final screen
    persist(STEPS[step].type === "final");
  };

  const next = () => setStep((p) => Math.min(STEPS.length - 1, p + 1));
  const back = () => setStep((p) => Math.max(0, p - 1));

  const s = STEPS[step];
  const inForm = step >= FORM_START && step <= FORM_END;
  const pos = step - FORM_START; // 0-based within the form
  const isLast = step === STEPS.length - 1;

  // Final screen: emit() once on arrival, marking the row completed.
  useEffect(() => {
    if (STEPS[step].type === "final") emit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  return (
    <div className="survey">
      <main className="app">
        <div className={"topbar" + (!inForm && step !== 0 ? " hidden" : "")}>
          <a href="/" aria-label="Latent home" className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/latent-icon-512.png"
              alt="Latent"
              width={32}
              height={32}
            />
          </a>
          <span className="counter">
            {inForm
              ? `${String(pos + 1).padStart(2, "0")} / ${String(
                  FORM_TOTAL,
                ).padStart(2, "0")}`
              : ""}
          </span>
        </div>

        <div className={"filmstrip" + (!inForm ? " hidden" : "")}>
          {Array.from({ length: FORM_TOTAL }, (_, i) => (
            <div
              key={i}
              className={
                "frame" +
                (i < pos ? " done" : "") +
                (i === pos ? " current" : "")
              }
            />
          ))}
        </div>

        <section className="stage">
          <div className={`screen ${s.type}`} key={step}>
            <Screen
              s={s}
              responses={responses}
              emit={emit}
              force={force}
              next={next}
            />
          </div>
        </section>

        <div className="backrow">
          <button
            className={"back" + (step === 0 || isLast ? " hidden" : "")}
            type="button"
            onClick={back}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>
        </div>
      </main>
    </div>
  );
}

interface ScreenProps {
  s: Step;
  responses: Record<string, Resp>;
  emit: () => void;
  force: () => void;
  next: () => void;
}

function Screen({ s, responses, emit, force, next }: ScreenProps): ReactNode {
  if (s.type === "welcome") {
    return (
      <>
        <h1>
          Latent is available
          <br />
          <em>for early access</em>.
        </h1>
        <div className="stack">
          {[
            "Film timelapses of your sessions while conserving battery life",
            "Phone propped up and recording, keeping it out of reach",
            "Every session saved into a history of everything you've put in",
            "Your friends, real stakes. Miss your goal and they know",
            "Over time, Latent shows you your patterns: when you lock in, when you slip",
          ].map((t, i) => (
            <div className="stack-row" key={i}>
              <span className="tick" />
              <p>{t}</p>
            </div>
          ))}
        </div>
        <div className="actions">
          <button className="btn btn-primary" type="button" onClick={next}>
            Become an Early Tester
          </button>
        </div>
        <p className="reassure">Takes about 1 minute.</p>
      </>
    );
  }

  if (s.type === "single" || s.type === "multi") {
    const key = s.key as string;
    const current = responses[key] ?? (s.type === "multi" ? [] : null);
    const multiArr = (responses[key] as string[]) || [];

    return (
      <>
        <h1 className="qhead">{s.head}</h1>
        {s.help && <p className="help">{s.help}</p>}
        <div className="options">
          {s.options!.map((label) => {
            const selected =
              s.type === "multi"
                ? (current as string[]).includes(label)
                : current === label;
            return (
              <button
                key={label}
                type="button"
                className={
                  "option" +
                  (s.type === "multi" ? " multi" : " single") +
                  (selected ? " selected" : "")
                }
                onClick={() => {
                  if (s.type === "single") {
                    responses[key] = label;
                    emit();
                    force();
                    setTimeout(next, 380);
                  } else {
                    let arr = (responses[key] as string[]) || [];
                    if (arr.includes(label))
                      arr = arr.filter((x) => x !== label);
                    else arr = [...arr, label];
                    responses[key] = arr;
                    emit();
                    force();
                  }
                }}
              >
                <span className="box">{CHECK}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
        {s.type === "multi" && (
          <div className="actions">
            <button
              className="btn btn-primary"
              type="button"
              disabled={multiArr.length === 0}
              onClick={next}
            >
              Continue
            </button>
          </div>
        )}
      </>
    );
  }

  if (s.type === "text") {
    return <TextStep s={s} responses={responses} emit={emit} next={next} />;
  }

  if (s.type === "email") {
    return <EmailStep s={s} responses={responses} emit={emit} next={next} />;
  }

  // final
  return (
    <>
      <div className="final-mark">
        {Array.from({ length: FORM_TOTAL }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <h1 className="qhead">
        Here&rsquo;s your link to early access (on iOS only first):
      </h1>
      <div className="actions">
        <a
          className="btn btn-primary"
          href={TESTFLIGHT_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in TestFlight
        </a>
      </div>
      <p className="final-link">
        <a href={TESTFLIGHT_URL} target="_blank" rel="noopener noreferrer">
          {TESTFLIGHT_URL}
        </a>
      </p>
      <div className="actions">
        <DiscordButton />
      </div>
    </>
  );
}

function TextStep({
  s,
  responses,
  emit,
  next,
}: {
  s: Step;
  responses: Record<string, Resp>;
  emit: () => void;
  next: () => void;
}) {
  const key = s.key as string;
  const [value, setValue] = useState((responses[key] as string) || "");
  return (
    <>
      <h1 className="qhead">{s.head}</h1>
      {s.help && <p className="help">{s.help}</p>}
      <div className="field">
        <textarea
          placeholder={s.placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="actions">
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            responses[key] = value.trim();
            emit();
            next();
          }}
        >
          Continue
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => {
            responses[key] = "";
            emit();
            next();
          }}
        >
          Skip
        </button>
      </div>
    </>
  );
}

function EmailStep({
  s,
  responses,
  emit,
  next,
}: {
  s: Step;
  responses: Record<string, Resp>;
  emit: () => void;
  next: () => void;
}) {
  const key = s.key as string;
  const [value, setValue] = useState((responses[key] as string) || "");
  const [phone, setPhone] = useState((responses.phone as string) || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const valid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  // Deliberately loose: accept anything that could be a real number anywhere,
  // punctuation and country code included. 10-15 digits is the E.164 range.
  const validPhone = (v: string) => {
    const digits = v.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  };

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, []);

  // Capture the MOMENT a field is filled - as soon as it holds a valid value
  // and loses focus, not at the end of the flow.
  const captureOnBlur = (k: string, raw: string, ok: (v: string) => boolean) => {
    const v = raw.trim();
    if (ok(v) && responses[k] !== v) {
      responses[k] = v;
      emit();
    }
  };

  return (
    <>
      <h1 className="qhead">{s.head}</h1>
      {s.help && <p className="help">{s.help}</p>}
      <div className="field">
        <label className="field-label" htmlFor="survey-email">
          Email
        </label>
        <input
          ref={inputRef}
          id="survey-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={s.placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => captureOnBlur(key, value, valid)}
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="survey-phone">
          Phone number
        </label>
        <input
          id="survey-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={s.placeholderPhone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => captureOnBlur("phone", phone, validPhone)}
        />
      </div>
      <div className="actions">
        <button
          className="btn btn-primary"
          type="button"
          disabled={!valid(value.trim()) || !validPhone(phone.trim())}
          onClick={() => {
            responses[key] = value.trim();
            responses.phone = phone.trim();
            // CAPTURE POINT: persist the lead here, immediately.
            emit();
            next();
          }}
        >
          Continue
        </button>
      </div>
    </>
  );
}
