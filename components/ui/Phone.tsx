import Image from "next/image";

// True pixel aspect ratios of the shipped screenshots, so each fills its frame
// edge-to-edge with no cropping. Keyed by src; add new screenshots here.
const KNOWN_RATIOS: Record<string, string> = {
  "/screen-home.png": "604 / 1314",
  "/screen-stats.png": "612 / 1388",
  "/screen-feed.png": "922 / 1998",
  "/screen-profile.png": "922 / 1998",
};

/**
 * Renders a full-device screenshot inside a realistic phone shell. The
 * screenshots already include the real iOS status bar and dynamic island, so
 * the shell adds only the physical bezel — no fake notch overlay (that would
 * double up on the app's own top bar).
 */
export default function Phone({
  src,
  alt,
  priority = false,
  className = "",
  /**
   * Override the screen's aspect ratio (CSS `aspect-ratio` syntax). Defaults to
   * the screenshot's true pixel ratio so the image fills the frame edge-to-edge
   * with no cropping. These shots aren't standard 9:19.5, so a fixed frame
   * ratio would crop the bottom.
   */
  ratio,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  ratio?: string;
}) {
  const aspect = ratio ?? KNOWN_RATIOS[src] ?? "9 / 19.5";
  return (
    <div className={`phone-shell relative ${className}`}>
      <div
        className="phone-screen relative w-full"
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 70vw, 320px"
          className="object-cover object-top"
        />
      </div>
    </div>
  );
}
