"use client";

// Where "Get Latent" goes. Swap for the App Store URL once 1.0 is approved.
const STORE_URL = "https://testflight.apple.com/join/bAn1FmPG";

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
      {/* Universal links do not fire inside in-app browsers, so someone who already has
          the app needs a way through from here. */}
      {code && (
        <a href={`latent://i/${code}`} className="text-[15px] text-paper-dim">
          Open Latent
        </a>
      )}
    </div>
  );
}
