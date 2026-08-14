/**
 * The "Latent." wordmark — tight sans with the signature gold period.
 */
export default function Wordmark({
  className = "",
  size = "text-xl",
}: {
  className?: string;
  size?: string;
}) {
  return (
    <span
      className={`font-kalix ${size} tracking-tight text-paper select-none ${className}`}
    >
      Latent<span className="text-gold">.</span>
    </span>
  );
}
