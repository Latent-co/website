import Link from "next/link";
import Wordmark from "@/components/ui/Wordmark";

const groups = [
  {
    heading: "Product",
    links: [
      { label: "Stats", href: "#stats" },
      { label: "Download", href: "#download" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Contact", href: "mailto:info@latent.app" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink-line px-6 py-16">
      <div className="mx-auto max-w-wrap">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper-dim">
              Your effort, made visible. Put your phone down, do the work, and
              watch it compound.
            </p>
          </div>

          {groups.map((g) => (
            <div key={g.heading}>
              <h4 className="text-xs uppercase tracking-[0.16em] text-paper-faint">
                {g.heading}
              </h4>
              <ul className="mt-4 space-y-3">
                {g.links.map((l) => {
                  const external = /^(mailto:|https?:)/.test(l.href);
                  const cls =
                    "text-sm text-paper-dim transition-colors hover:text-gold";
                  return (
                    <li key={l.label}>
                      {external ? (
                        <a href={l.href} className={cls}>
                          {l.label}
                        </a>
                      ) : (
                        <Link href={l.href} className={cls}>
                          {l.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="rule-fade my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-paper-dim md:flex-row">
          <p>© {new Date().getFullYear()} Latent. All rights reserved.</p>
          <p className="flex items-center gap-2">
            You did the work. Now you can see it.
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </p>
        </div>
      </div>
    </footer>
  );
}
