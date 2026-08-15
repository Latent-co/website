import Pressable from "./Pressable";
import { WAITLIST_URL, WAITLIST_LABEL } from "@/lib/links";

/**
 * Primary sign-up action. Two looks: `gold` (the loud, primary moment — hero
 * + final CTA) and the default off-white chip. The accent is used sparingly,
 * so most of the site stays monochrome.
 *
 * Points at the waitlist rather than the App Store: the app hasn't shipped
 * publicly yet, and this used to default to `#download` — an anchor pointing
 * at the section that contains the button, so it scrolled to itself.
 */
export default function AppStoreButton({
  href = WAITLIST_URL,
  className = "",
  variant = "paper",
  label = WAITLIST_LABEL,
}: {
  href?: string;
  className?: string;
  variant?: "paper" | "gold";
  label?: string;
}) {
  const surface = variant === "gold" ? "surface-gold" : "surface-paper";
  return (
    <Pressable
      href={href}
      className={`${surface} group inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-semibold ${className}`}
    >
      {label}
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Pressable>
  );
}
