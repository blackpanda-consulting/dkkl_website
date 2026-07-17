"use client";

import { motion } from "framer-motion";
import {
  EASE,
  REVEAL_DURATION,
  REVEAL_VIEWPORT,
  revealVariants,
  type RevealDir,
} from "@/lib/motion";

// General-purpose scroll reveal. Reduced motion is handled globally by
// MotionProvider's <MotionConfig reducedMotion="user">, which strips the
// transform and leaves the opacity fade.
//
// Stagger convention across grids: delay={i * REVEAL_STAGGER}.
export default function Reveal({
  children,
  delay = 0,
  dir = "up",
  as = "div",
  className = "",
}: {
  children: React.ReactNode;
  /** Seconds. Use delay={i * REVEAL_STAGGER} to stagger a grid. */
  delay?: number;
  dir?: RevealDir;
  as?: keyof typeof motion;
  className?: string;
}) {
  const Tag = motion[as] as typeof motion.div;

  return (
    <Tag
      className={className}
      variants={revealVariants(dir)}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: REVEAL_DURATION, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}
