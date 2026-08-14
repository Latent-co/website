"use client";

import { motion } from "framer-motion";
import TiltPhone from "@/components/ui/TiltPhone";
import { fadeUp, stagger, viewportOnce, EASE } from "@/lib/motion";

export default function Social() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-wrap items-center gap-14 md:grid-cols-2 md:gap-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.h2
            variants={fadeUp}
            className="display text-balance text-5xl font-semibold text-paper md:text-7xl"
          >
            Work hits different when someone sees it.
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-6 max-w-md text-lg text-paper-dim">
            Not “look at me.” More like “I showed up.” Friends see the session,
            the real timelapse, not a selfie.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-base text-paper-dim"
          >
            {["Kudos.", "Comments.", "Streaks.", "Accountability without the cringe."].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1, ease: EASE }}
          className="flex justify-center md:justify-end"
        >
          <TiltPhone
            src="/screen-feed.png"
            alt="The Latent feed: a friend's session with its timelapse"
            strength={10}
            className="w-[270px] md:w-[300px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
