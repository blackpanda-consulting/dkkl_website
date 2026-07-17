"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, REVEAL_DURATION, REVEAL_VIEWPORT } from "@/lib/motion";

// The rule under a section title, drawing outward once the title has landed.
//
// MotionConfig's reducedMotion="user" only suppresses transform and layout
// animations — width isn't one, so this opts out explicitly.
export default function TitleAccent() {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span aria-hidden className="title-accent" style={{ width: "4.5rem" }} />;
  }

  return (
    <motion.span
      aria-hidden
      className="title-accent"
      initial={{ width: 0 }}
      whileInView={{ width: "4.5rem" }}
      viewport={REVEAL_VIEWPORT}
      transition={{ duration: REVEAL_DURATION, ease: EASE, delay: 0.35 }}
    />
  );
}
