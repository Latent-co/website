"use client";

import { motion, useReducedMotion } from "framer-motion";

// 53 weeks × 7 days. Intensity is derived deterministically from the cell
// index (a hashed sine) so the server and client render identically — no
// hydration mismatch, and recent weeks trend denser for a "compounding" feel.
const WEEKS = 53;
const DAYS = 7;

const LEVEL_BG = [
  "rgba(245,239,225,0.05)",
  "rgba(240,194,43,0.22)",
  "rgba(240,194,43,0.42)",
  "rgba(240,194,43,0.72)",
  "rgba(240,194,43,1)",
];

function level(week: number, day: number) {
  const s = Math.sin((week * 7 + day) * 12.9898) * 43758.5453;
  const frac = s - Math.floor(s); // 0..1, deterministic
  const recency = week / WEEKS; // later weeks denser
  const v = frac * 0.7 + recency * 0.5;
  if (v < 0.3) return 0;
  if (v < 0.55) return 1;
  if (v < 0.75) return 2;
  if (v < 0.9) return 3;
  return 4;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Heatmap() {
  const reduce = useReducedMotion();
  const cells: { week: number; day: number; lvl: number }[] = [];
  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < DAYS; d++) {
      cells.push({ week: w, day: d, lvl: level(w, d) });
    }
  }

  return (
    <div className="w-full">
      {/* Month scale */}
      <div className="mb-2 flex justify-between px-0.5 text-[11px] text-paper-faint">
        {MONTHS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>

      <div
        className="grid w-full gap-[3px]"
        style={{
          gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${DAYS}, minmax(0, 1fr))`,
          gridAutoFlow: "column",
          aspectRatio: `${WEEKS} / ${DAYS}`,
        }}
      >
        {cells.map((c, i) => (
          <motion.div
            key={i}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: reduce ? 0 : Math.min(c.week * 0.012, 0.7),
            }}
            className="rounded-[2px]"
            style={{ backgroundColor: LEVEL_BG[c.lvl] }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-paper-faint">
        <span className="mr-1">Less</span>
        {LEVEL_BG.map((bg, i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-[2px]"
            style={{ backgroundColor: bg }}
          />
        ))}
        <span className="ml-1">More</span>
      </div>
    </div>
  );
}
