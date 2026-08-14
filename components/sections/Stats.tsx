"use client";

import { motion } from "framer-motion";
import TiltPhone from "@/components/ui/TiltPhone";
import Heatmap from "@/components/ui/Heatmap";
import { fadeUp, stagger, viewportOnce, EASE } from "@/lib/motion";

const totals = [
  { value: "62h 14m", label: "this year", accent: false },
  { value: "47", label: "sessions", accent: false },
  { value: "18", label: "day streak", accent: true },
];

export default function Stats() {
  return (
    <section id="stats" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-wrap">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="max-w-2xl"
        >
          <motion.h2
            variants={fadeUp}
            className="display text-balance text-5xl font-semibold text-paper md:text-7xl"
          >
            Watch yourself compound.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 max-w-md text-lg text-paper-dim">
            Every session leaves a mark. Over weeks, the marks become a picture
            of who you’re becoming.
          </motion.p>
        </motion.div>

        {/* Real profile screen beside the running totals. */}
        <div className="mt-16 flex flex-col items-center gap-12 md:flex-row md:items-center md:justify-center md:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 1, ease: EASE }}
            className="flex shrink-0 justify-center"
          >
            <TiltPhone
              src="/screen-profile.png"
              alt="A Latent profile with sessions, total time and a weekly chart"
              strength={10}
              className="w-[270px] md:w-[300px]"
            />
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-3 gap-6 md:grid-cols-1 md:gap-12"
          >
            {totals.map((t) => (
              <motion.div key={t.label} variants={fadeUp} className="text-center md:text-left">
                <div
                  className={`numeric whitespace-nowrap font-semibold text-5xl leading-none md:text-8xl ${
                    t.accent ? "text-gold" : "text-paper"
                  }`}
                >
                  {t.value}
                </div>
                <div className="mt-3 text-base text-paper-dim md:text-lg">{t.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* The contribution graph — your work, left as a trace. (Kept.) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: EASE }}
          className="card mt-16 rounded-3xl p-5 md:p-8"
        >
          <Heatmap />
        </motion.div>
      </div>
    </section>
  );
}
