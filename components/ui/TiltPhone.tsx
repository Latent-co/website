"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { PointerEvent } from "react";
import Phone from "./Phone";

// `useSpring` takes bare SpringOptions (no `type` field). This mirrors the
// `springMomentum` preset's feel - a touch of overshoot, since a real pointer
// gesture drives the tilt (§4/§8).
const TILT_SPRING = { bounce: 0.18, duration: 0.45 };

/**
 * A phone that tilts toward the pointer - direct manipulation (§2) and a
 * hint in the direction of movement (§8). The pointer position drives raw
 * motion values 1:1; springs sit between the input and the rendered rotation
 * so the tilt carries momentum and settles instead of snapping. Decomposed
 * into independent X and Y springs so diagonal motion doesn't desync.
 *
 * Honors prefers-reduced-motion: the tilt is disabled (vestibular motion),
 * the static screenshot stays fully visible.
 */
export default function TiltPhone({
  src,
  alt,
  priority = false,
  className = "",
  /** Baseline resting rotation, e.g. the fanned-out side phones. */
  baseRotate = 0,
  /** Max tilt in degrees at the edges of the surface. */
  strength = 10,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  baseRotate?: number;
  strength?: number;
}) {
  const reduce = useReducedMotion();

  // Normalized pointer offset from the element's center, in [-0.5, 0.5].
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Springs sit between raw input and output - momentum + graceful settle.
  const sx = useSpring(px, TILT_SPRING);
  const sy = useSpring(py, TILT_SPRING);

  const rotateY = useTransform(sx, [-0.5, 0.5], [-strength, strength]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [strength, -strength]);

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function reset() {
    px.set(0);
    py.set(0);
  }

  if (reduce) {
    return <Phone src={src} alt={alt} priority={priority} className={className} />;
  }

  return (
    <motion.div
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        rotate: baseRotate,
      }}
      className="[will-change:transform]"
    >
      <Phone src={src} alt={alt} priority={priority} className={className} />
    </motion.div>
  );
}
