"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Wordmark from "./Wordmark";
import Pressable from "./Pressable";
import { EASE } from "@/lib/motion";
import { WAITLIST_URL, WAITLIST_LABEL } from "@/lib/links";

const links: { label: string; href: string }[] = [];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4"
    >
      {/* Scroll-edge mask: content dissolves into the top, no hard divider. */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 top-0 h-24 bg-gradient-to-b from-ink via-ink/70 to-transparent transition-opacity duration-500 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />
      <nav
        className={`mt-3 flex w-full max-w-wrap items-center justify-between rounded-full px-3 py-2 transition-all duration-500 ${
          scrolled
            ? "glass-nav shadow-[0_16px_50px_-24px_rgba(0,0,0,0.9)]"
            : "border border-transparent bg-transparent"
        }`}
      >
        <Link href="#top" className="pl-3">
          <Wordmark size="text-xl" />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm text-paper-dim transition-colors hover:text-paper"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Pressable
          href={WAITLIST_URL}
          hover={1.04}
          className="surface-paper rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          {WAITLIST_LABEL}
        </Pressable>
      </nav>
    </motion.header>
  );
}
