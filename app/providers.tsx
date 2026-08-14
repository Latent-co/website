"use client";

import { MotionConfig } from "framer-motion";

/**
 * Global motion config. `reducedMotion="user"` makes every Framer Motion
 * component respect prefers-reduced-motion automatically - it drops
 * transform/layout animations (movement) while keeping opacity, i.e.
 * "gentler, not zero" per Emil Kowalski's accessibility standard.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
