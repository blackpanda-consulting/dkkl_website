"use client";

import { useEffect, useRef, useState } from "react";

// Reveals children on scroll into view. Supports a direction and an explicit
// stagger delay. Respects prefers-reduced-motion via the CSS in globals.css.
export default function Reveal({
  children,
  delay = 0,
  delayMs,
  dir = "up",
  as: Tag = "div",
  className = "",
}: {
  children: React.ReactNode;
  delay?: 0 | 1 | 2 | 3;
  delayMs?: number;
  dir?: "up" | "left" | "right" | "zoom";
  as?: React.ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const dirClass =
    dir === "left"
      ? "reveal-left"
      : dir === "right"
        ? "reveal-right"
        : dir === "zoom"
          ? "reveal-zoom"
          : "";

  return (
    <Tag
      ref={ref}
      data-delay={delayMs === undefined && delay ? delay : undefined}
      style={delayMs !== undefined ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`reveal ${dirClass} ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
