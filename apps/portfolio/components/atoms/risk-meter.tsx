"use client";

/**
 * RiskMeter — five-segment risk indicator, inline SVG state machine.
 *
 * Fallback from the planned Rive (.riv) asset. States: empty | low | medium | high | blocked.
 */

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/providers/reduced-motion";

interface Props {
  level: "low" | "medium" | "high" | "blocked";
  label: string;
}

const LEVEL: Record<Props["level"], { filled: number; tone: string }> = {
  low: { filled: 2, tone: "var(--moss)" },
  medium: { filled: 3, tone: "var(--warn)" },
  high: { filled: 5, tone: "var(--rust)" },
  blocked: { filled: 5, tone: "var(--rust)" },
};

export function RiskMeter({ level, label }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const reduced = usePrefersReducedMotion();
  const { filled, tone } = LEVEL[level];
  const animate = mounted || reduced;

  return (
    <div className="inline-flex items-center gap-2.5" role="img" aria-label={label}>
      <span className="sr-only">{label}</span>
      <svg ref={ref} width={120} height={18} viewBox="0 0 120 18" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.rect
            key={i}
            x={i * 24}
            y={2}
            width={20}
            height={14}
            rx={1.5}
            fill={i < filled ? tone : "var(--rule)"}
            initial={{ opacity: 0, scaleY: 0.4 }}
            animate={animate ? { opacity: i < filled ? 1 : 0.55, scaleY: 1 } : {}}
            style={{ transformOrigin: "center" }}
            transition={{
              duration: reduced ? 0 : 0.32,
              delay: reduced ? 0 : 0.08 * i,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}
      </svg>
      <span
        className="tnum text-[0.78rem] uppercase tracking-[0.14em]"
        style={{ color: tone }}
      >
        {level}
      </span>
    </div>
  );
}
