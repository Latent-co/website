"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import TiltPhone from "@/components/ui/TiltPhone";
import AppStoreButton from "@/components/ui/AppStoreButton";
import { EASE } from "@/lib/motion";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const reduce = useReducedMotion();
  const yPhone = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -80]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  };

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden px-6 pb-28 pt-40 md:pb-36 md:pt-48"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto flex max-w-wrap flex-col items-center text-center"
      >
        <motion.h1
          variants={item}
          className="display max-w-5xl text-balance text-6xl font-semibold text-paper sm:text-7xl md:text-8xl lg:text-[7.5rem]"
        >
          Make your effort
          <br />
          <span className="font-kalix italic text-gold">visible.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-paper-dim md:text-xl"
        >
          Latent turns the work you do into something you can see, share, and
          build on.
        </motion.p>

        <motion.div variants={item} className="mt-10">
          <AppStoreButton variant="gold" />
        </motion.div>
      </motion.div>

      {/* One beautiful session, front and center. */}
      <motion.div
        style={{ y: yPhone }}
        initial={{ opacity: 0, y: 90, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.45 }}
        className="relative z-10 mx-auto mt-20 flex w-[280px] justify-center md:mt-24 md:w-[300px]"
      >
        <TiltPhone
          src="/screen-home.png"
          alt="A Latent session on the home screen"
          strength={12}
          priority
        />
      </motion.div>
    </section>
  );
}
