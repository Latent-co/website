"use client";

import { useRef } from "react";
import type { PointerEvent } from "react";
import { motion } from "framer-motion";
import AppStoreButton from "@/components/ui/AppStoreButton";
import { viewportOnce, EASE } from "@/lib/motion";

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
    el.style.setProperty("--spot-opacity", "1");
  }

  return (
    <section id="download" className="px-6 py-24 md:py-36">
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={() => ref.current?.style.setProperty("--spot-opacity", "0")}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.9, ease: EASE }}
        className="spotlight card relative mx-auto max-w-4xl overflow-hidden rounded-[40px] px-8 py-24 text-center md:px-16 md:py-32"
      >
        <div className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative z-10">
          <h2 className="display mx-auto max-w-2xl text-balance text-6xl font-semibold text-paper md:text-8xl">
            Show up.
            <br />
            Make it <span className="font-kalix italic text-gold">visible.</span>
          </h2>

          <div className="mt-12 flex justify-center">
            <AppStoreButton variant="gold" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
