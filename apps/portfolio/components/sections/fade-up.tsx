"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/providers/reduced-motion";

/**
 * Motion fade-up pattern per plan §C: 12px translate, 260ms enter, 160ms exit.
 * Reduced-motion: translate→0, duration→1ms (opacity-only).
 *
 * Uses `animate` (not whileInView) so the reveal triggers on mount regardless
 * of viewport position. This keeps the dossier honest under full-page captures
 * and on long surfaces where intersection observers can otherwise leave deep
 * content invisible.
 */
export function FadeUp({
  children,
  delay = 0,
  className,
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion(As as React.ElementType);
  return (
    <MotionTag
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0.001 : 0.42,
        delay: reduced ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
