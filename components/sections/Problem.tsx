"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

const lines = [
  "Hours at your desk disappear.",
  "The reps nobody sees don’t count.",
  "The pages you wrote don’t look like progress.",
];

export default function Problem() {
  return (
    <section className="px-6 py-32 md:py-48">
      <div className="mx-auto max-w-5xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: EASE }}
          className="display text-balance text-5xl font-semibold text-paper md:text-7xl"
        >
          Most work is invisible.
        </motion.h2>

        {/* Each line fades up slowly on its own as it scrolls into view. */}
        <div className="mx-auto mt-20 max-w-4xl space-y-12 md:mt-28 md:space-y-20">
          {lines.map((l) => (
            <motion.p
              key={l}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-25%" }}
              transition={{ duration: 1.3, ease: EASE }}
              className="text-balance text-3xl font-medium leading-snug text-paper-dim md:text-5xl"
            >
              {l}
            </motion.p>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="mt-20 text-2xl font-semibold tracking-tight text-paper md:mt-28 md:text-3xl"
        >
          Latent makes them <span className="text-gold">visible</span>.
        </motion.p>
      </div>
    </section>
  );
}
