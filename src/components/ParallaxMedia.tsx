"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { BAND_IMAGE_Y, BAND_OFFSET } from "@/lib/motion";

// Full-bleed band whose media drifts as the whole element passes through the
// viewport. Children arrive server-rendered, so next/image stays on the server.
export default function ParallaxMedia({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [...BAND_OFFSET] as ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [...BAND_IMAGE_Y]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {/* Oversized so a ±4% drift never exposes an edge. */}
      <motion.div
        className="absolute inset-x-0 top-[-6%] h-[112%]"
        style={reduced ? undefined : { y }}
      >
        {children}
      </motion.div>
    </div>
  );
}
