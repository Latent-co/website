"use client";

import { useEffect, useRef } from "react";
import { track, trackBeforeLeaving } from "@/lib/analytics";

// Where "Get Latent" goes: the App Store listing (no storefront in the path, so Apple sends
// each visitor to their own country's store).
const STORE_URL = "https://apps.apple.com/app/id6788947658";

type CopyMethod = "clipboard_api" | "exec_command" | "failed";

/**
 * Copies the canonical invite link, whatever host served this page, because that is the
 * one shape the app looks for on the clipboard. `execCommand` is the fallback for in-app
 * browsers (Instagram, TikTok) that ship without the async clipboard API. Says which way
 * worked, because a copy that fails is a friend who arrives in the app with nothing to paste.
 */
async function copy(text: string): Promise<CopyMethod> {
  try {
    // Some in-app webviews leave this promise pending forever; past half a second it counts as
    // a failure and the fallback runs, so the tap still copies, counts and opens the store.
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise((_, reject) => setTimeout(() => reject(new Error("clipboard timeout")), 500)),
    ]);
    return "clipboard_api";
  } catch {}
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {}
  field.remove();
  return copied ? "exec_command" : "failed";
}

/** A random id for this visit. `randomUUID` needs iOS 15.4; older phones build one by hand. */
function newVisitId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/**
 * Which app's built-in browser this is, if any. Universal links never fire inside these, so
 * even someone who has the app lands here, and their copy is the likeliest to fail.
 */
function inAppBrowser(ua: string): string {
  if (/Instagram/i.test(ua)) return "instagram";
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return "facebook";
  if (/musical_ly|BytedanceWebview|TikTok/i.test(ua)) return "tiktok";
  if (/Snapchat/i.test(ua)) return "snapchat";
  if (/LinkedInApp/i.test(ua)) return "linkedin";
  if (/Twitter/i.test(ua)) return "twitter";
  if (/\bLine\//i.test(ua)) return "line";
  return "none";
}

export default function GetLatent({ code }: { code: string | null }) {
  // One id per visit, made after hydration so the server and client renders agree. It rides
  // on both events here and on the copied link (`?v=`), where the app reads it back, so a
  // page visit can be joined to the install it led to: nothing else survives the App Store.
  const visit = useRef<string>("");
  const visitCode = useRef<string | null>(null);
  const browser = useRef<string>("none");
  useEffect(() => {
    // A new code is a new invite: its own visit, never another code's.
    if (!visit.current || visitCode.current !== code) {
      visit.current = newVisitId();
      visitCode.current = code;
    }
    browser.current = inAppBrowser(navigator.userAgent);
    track(
      "invite_page_viewed",
      { code, has_code: code !== null, visit_id: visit.current, in_app_browser: browser.current },
      { instant: true },
    );
  }, [code]);

  // Every tap copies, counts and opens the store: an in-app browser may swallow the first. A
  // double tap is two invite_get_tapped events with one visit_id, so count visits, not taps.
  async function get() {
    try {
      const method = code ? await copy(`https://trylatent.co/i/${code}?v=${visit.current}`) : null;
      trackBeforeLeaving(
        "invite_get_tapped",
        {
          code,
          visit_id: visit.current,
          copied: method !== null && method !== "failed",
          copy_method: method ?? "no_code",
          in_app_browser: browser.current,
        },
        visit.current,
      );
    } finally {
      // Whatever the copy or the analytics did, the button's job is the store.
      window.location.href = STORE_URL;
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5">
      <button
        onClick={get}
        className="w-full rounded-full bg-paper py-4 text-[17px] font-semibold text-ink active:scale-[0.98] transition-transform"
      >
        Get Latent
      </button>
      {/* The app's invite screen is one big Paste button that reads this link back off the
          clipboard. Say so here, because they leave for the store the moment they tap. */}
      {code && (
        <p className="text-[15px] text-paper-dim">
          Then open Latent and tap Paste.
        </p>
      )}
    </div>
  );
}
