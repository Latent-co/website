"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

// Dim → bright, using the site's paper tokens.
const DIM = "#5C564B"; // paper-faint
const BRIGHT = "#F5EFE1"; // paper

/**
 * One character whose color ramps from dim to bright over its slice of the
 * shared scroll progress. Kept as its own component so each call to
 * useTransform gets a stable hook slot.
 */
function Char({
  char,
  progress,
  range,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(progress, range, [DIM, BRIGHT]);
  return <motion.span style={{ color }}>{char}</motion.span>;
}

/**
 * Scroll-linked text reveal: the copy sits dim and brightens letter by letter
 * as the block scrolls up through the viewport, like white text washing across
 * the words. Falls back to fully bright, static text under reduced motion.
 */
export default function ScrollReveal({
  lines,
  className = "",
  lineClassName = "",
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  // Total visible (non-space) characters, used to spread the reveal evenly.
  const total = lines.reduce((n, l) => n + l.replace(/\s/g, "").length, 0);
  // Each character fades over a window this many characters wide, so the
  // leading edge is a soft gradient rather than a hard on/off wipe.
  const fadeSpan = Math.max(8, Math.round(total * 0.06));

  let idx = -1; // running index across all visible characters

  return (
    <div ref={ref} className={className}>
      {lines.map((line) => (
        <p key={line} className={lineClassName}>
          {line.split(" ").map((word, wi) => (
            <span key={wi} className="inline-block whitespace-nowrap">
              {[...word].map((ch, ci) => {
                idx += 1;
                if (reduced) {
                  return (
                    <span key={ci} style={{ color: BRIGHT }}>
                      {ch}
                    </span>
                  );
                }
                const start = idx / total;
                const end = Math.min(1, (idx + fadeSpan) / total);
                return (
                  <Char
                    key={ci}
                    char={ch}
                    progress={scrollYProgress}
                    range={[start, end]}
                  />
                );
              })}
              {/* Non-breaking space keeps the reveal tight to each word while
                  still allowing the line to wrap between words. */}
              {" "}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
