"use client";

import { motion } from "framer-motion";
import { WORD_VIEWPORT, wordContainerVariants, wordVariants } from "@/lib/motion";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

// Per-word masked slide-up: each word sits in an overflow-hidden box and rises
// into it, staggered left to right.
//
// Two things here are load-bearing:
//
// 1. The whileInView trigger lives on the OUTER element, which is never clipped.
//    Putting it on the clipped word would deadlock — a word parked at y:108% is
//    outside its mask, so it never counts as in view, so it never animates in.
//    The parent triggers and propagates via variants instead.
//
// 2. Words are split on spaces and rejoined with U+00A0. The word boxes are
//    inline-block and sit flush against each other, so a normal space would
//    collapse and the words would run together.
export default function WordReveal({
  text,
  delay = 0,
  as = "span",
  className = "",
}: {
  text: string;
  /** Seconds before the first word starts. */
  delay?: number;
  as?: Tag;
  className?: string;
}) {
  const Component = motion[as];
  const words = text.split(" ");

  return (
    <Component
      className={className}
      // The split text is decorative; expose the whole string to assistive tech.
      aria-label={text}
      variants={wordContainerVariants(delay)}
      initial="hidden"
      whileInView="visible"
      viewport={WORD_VIEWPORT}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          // The padding gives descenders (g, y, p) room inside the mask; the
          // matching negative margin keeps the line box where it was.
          className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em]"
        >
          <motion.span className="inline-block" variants={wordVariants}>
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
