"use client";

import { MotionConfig } from "framer-motion";

// The reduced-motion rules in globals.css only govern CSS animations — they have
// no effect on framer-motion's inline transforms. `reducedMotion="user"` is what
// actually honours the OS setting for every motion component: it drops transform
// and layout animations and leaves a plain opacity fade.
//
// Scroll-driven parallax is NOT covered by this and must call useReducedMotion()
// itself; see HeroMotion and ParallaxMedia.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
