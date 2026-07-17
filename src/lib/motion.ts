// The house motion spec, kept in one place so every component animates to the
// same numbers. Change a value here, not at a call site.
//
//   Reveal      y 24 · 0.9s · stagger 0.08 · viewport margin -80px
//   WordReveal  y 108% (masked) · 0.72s · stagger 0.065 · margin -60px
//   List        stagger 0.06 · delayChildren 0.1 · item 0.55s
//
// Every reveal is `once: true` — nothing re-animates on scroll back.

import type { Variants } from "framer-motion";

// Shared easing curve for the whole system.
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------------------------------- Reveal --------------------------------- */

export const REVEAL_DURATION = 0.9;
export const REVEAL_VIEWPORT = { once: true, margin: "-80px" } as const;
/** Grid convention: delay={i * REVEAL_STAGGER}. */
export const REVEAL_STAGGER = 0.08;

export type RevealDir = "up" | "left" | "right" | "zoom";

// Hidden offset per direction. "up" is the house default (y 24); the lateral and
// zoom variants reuse the same travel so the system stays coherent.
const REVEAL_HIDDEN: Record<RevealDir, Record<string, number>> = {
  up: { y: 24 },
  left: { x: -24 },
  right: { x: 24 },
  zoom: { scale: 0.96 },
};

export function revealVariants(dir: RevealDir): Variants {
  return {
    hidden: { opacity: 0, ...REVEAL_HIDDEN[dir] },
    visible: { opacity: 1, x: 0, y: 0, scale: 1 },
  };
}

/* -------------------------------- WordReveal ------------------------------- */

export const WORD_DURATION = 0.72;
export const WORD_STAGGER = 0.065;
export const WORD_VIEWPORT = { once: true, margin: "-60px" } as const;

// The parent is never clipped, so it can reliably trigger whileInView; only the
// per-word wrapper clips. See WordReveal for why that split matters.
export function wordContainerVariants(delay: number): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: WORD_STAGGER, delayChildren: delay },
    },
  };
}

export const wordVariants: Variants = {
  // 108% rather than 100% so descenders (g, y, p) clear the mask completely.
  hidden: { y: "108%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: WORD_DURATION, ease: EASE },
  },
};

/* ----------------------------------- List ---------------------------------- */

export const LIST_STAGGER = 0.06;
export const LIST_DELAY_CHILDREN = 0.1;
export const LIST_ITEM_DURATION = 0.55;

export const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: LIST_STAGGER, delayChildren: LIST_DELAY_CHILDREN },
  },
};

export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: LIST_ITEM_DURATION, ease: EASE },
  },
};

/* --------------------------------- Parallax -------------------------------- */

// Hero: the section passing under the viewport as you scroll away from it.
export const HERO_OFFSET = ["start start", "end start"] as const;
export const HERO_IMAGE_Y = ["-8%", "8%"] as const;
export const HERO_CONTENT_FADE = [0, 0.6] as const;

// Bands: the whole element travelling through the viewport.
export const BAND_OFFSET = ["start end", "end start"] as const;
export const BAND_IMAGE_Y = ["-4%", "4%"] as const;
