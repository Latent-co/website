"use client";

// Where "Get Latent" goes: the App Store listing (no storefront in the path, so Apple sends
// each visitor to their own country's store).
const STORE_URL = "https://apps.apple.com/app/id6788947658";

/**
 * Copies the canonical invite link, whatever host served this page, because that is the
 * one shape the app looks for on the clipboard. `execCommand` is the fallback for in-app
 * browsers (Instagram, TikTok) that ship without the async clipboard API.
 */
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {}
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  field.remove();
}

export default function GetLatent({ code }: { code: string | null }) {
  async function get() {
    if (code) await copy(`https://trylatent.co/i/${code}`);
    window.location.href = STORE_URL;
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5">
      <button
        onClick={get}
        className="w-full rounded-full bg-paper py-4 text-[17px] font-semibold text-ink active:scale-[0.98] transition-transform"
      >
        Get Latent
      </button>
      {/* The app reads this invite off the clipboard on first open, which iOS guards with a
          one-time prompt. Say so here, because they leave for the store the moment they tap. */}
      {code && (
        <p className="text-[15px] text-paper-dim">
          When Latent asks, tap Allow Paste.
        </p>
      )}
    </div>
  );
}
