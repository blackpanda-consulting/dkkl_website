"use client";

import { motion } from "framer-motion";
import { REVEAL_VIEWPORT, listItemVariants, listVariants } from "@/lib/motion";

// Container that reveals its children one after another. The parent owns the
// viewport trigger; items only carry variants, so they inherit the stagger.
export function StaggerList({
  children,
  as = "ul",
  className = "",
}: {
  children: React.ReactNode;
  as?: "ul" | "ol" | "div" | "dl";
  className?: string;
}) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={listVariants}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
    >
      {children}
    </Component>
  );
}

// A single row inside a StaggerList. Must be a direct child for the stagger to
// reach it.
export function StaggerItem({
  children,
  as = "li",
  className = "",
}: {
  children: React.ReactNode;
  as?: "li" | "div";
  className?: string;
}) {
  const Component = motion[as];
  return (
    <Component className={className} variants={listItemVariants}>
      {children}
    </Component>
  );
}
