"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HERO_CONTENT_FADE, HERO_IMAGE_Y, HERO_OFFSET } from "@/lib/motion";

// Hero shell with scroll parallax. `media` and `children` arrive already
// rendered from the server component, so next/image and the copy stay out of the
// client bundle (see Next's server/client composition docs).
//
// The image drifts down as you scroll away while the copy lifts and fades, which
// gives the hero depth without moving anything while the page is at rest.
export default function HeroMotion({
  media,
  children,
}: {
  media: React.ReactNode;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [...HERO_OFFSET] as ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [...HERO_IMAGE_Y]);
  const contentOpacity = useTransform(scrollYProgress, [...HERO_CONTENT_FADE], [1, 0]);
  const contentY = useTransform(scrollYProgress, [...HERO_CONTENT_FADE], [0, -40]);

  return (
    <section id="home" ref={ref} className="hero-sky relative overflow-hidden">
      <div className="absolute inset-0">
        {/* Oversized so an ±8% drift never exposes an edge. */}
        <motion.div
          className="absolute inset-x-0 top-[-10%] h-[120%]"
          style={reduced ? undefined : { y: imageY }}
        >
          {media}
        </motion.div>
        {/* Overlays stay put — they exist to keep the copy readable. */}
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/88 to-background/25 md:via-background/70 md:to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-background/85 via-transparent to-transparent md:from-background/45" />
      </div>

      <motion.div
        className="relative mx-auto flex min-h-130 max-w-6xl items-center px-4 pt-16 pb-16 md:min-h-150 md:pt-24 md:pb-24"
        style={reduced ? undefined : { opacity: contentOpacity, y: contentY }}
      >
        <div className="max-w-2xl">{children}</div>
      </motion.div>
    </section>
  );
}
