"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ComponentProps } from "react";
import { springPress } from "@/lib/motion";

const MotionLink = motion.create(Link);

/**
 * A pressable control with spring-driven feedback.
 *
 * Apple's fluid-interface rules, applied to a web button:
 *  - Feedback lives on the *press*, not the release (`whileTap`), and it's
 *    continuous - the spring tracks toward the target the whole time.
 *  - The transition is a spring, so a press that's grabbed/released mid-flight
 *    is interruptible and velocity-aware - no hard CSS `active:` cut.
 *  - Critically damped (no overshoot): the control settles, it doesn't wobble.
 *
 * Renders as a Next `Link` when `href` is given, otherwise a `button`.
 */
type PressableProps = {
  href?: string;
  /** Hover scale - a hair of lift so the pointer feels magnetic. */
  hover?: number;
  /** Press scale - the give when you push it. */
  press?: number;
  className?: string;
  children: React.ReactNode;
} & Omit<ComponentProps<typeof motion.button>, "ref">;

export default function Pressable({
  href,
  hover = 1.03,
  press = 0.96,
  className,
  children,
  ...rest
}: PressableProps) {
  const motionProps = {
    className,
    whileHover: { scale: hover },
    whileTap: { scale: press },
    transition: springPress,
    children,
  };

  if (href) {
    return (
      <MotionLink href={href} {...(motionProps as ComponentProps<typeof MotionLink>)} />
    );
  }

  return <motion.button type="button" {...motionProps} {...rest} />;
}
