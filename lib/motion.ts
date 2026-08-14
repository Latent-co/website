import type { Transition, Variants } from "framer-motion";

// Shared easing - a soft, premium ease-out kept for a few duration-based
// ambient animations (long entrance drifts) where a spring's emergent settle
// time isn't wanted.
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Spring presets, mapped to Apple's designer-facing parameters
 * (damping ratio + response) from *Designing Fluid Interfaces*.
 * Framer's `bounce`/`duration` API maps closely: bounce 0 == critically
 * damped (no overshoot); duration ≈ response (settle time, not a hard cap).
 *
 * House rule: critically damped everywhere by default. Reserve bounce for
 * motion that a real gesture's momentum preceded.
 */

// Default UI move/settle - critically damped, no overshoot. (damping 1.0)
export const springSoft: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.5,
};

// Press / tap feedback - snappier settle so the control feels alive on touch.
export const springPress: Transition = {
  type: "spring",
  bounce: 0,
  duration: 0.3,
};

// Momentum interactions (flick/throw/pointer-tracked tilt) - a touch of
// overshoot, earned because a physical gesture drove it. (damping ~0.8)
export const springMomentum: Transition = {
  type: "spring",
  bounce: 0.18,
  duration: 0.45,
};

// Scroll reveals settle from the current value with a critically damped
// spring - physical, but no bounce (no gesture momentum preceded them).
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: springSoft,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: EASE } },
};

// Stagger container - children should use `fadeUp`.
export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const viewportOnce = { once: true, margin: "-80px" };
