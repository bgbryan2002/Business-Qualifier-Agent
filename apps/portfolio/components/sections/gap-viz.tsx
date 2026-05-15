"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/providers/reduced-motion";
import { formatCurrency } from "@/lib/utils";

/**
 * Simple three-bar comparison used on /deals/l002.
 * Bars: reported earnings | target draw | broker's adjusted figure.
 * The gap (target - reported) is highlighted in rust.
 */
export function GapVisualization({
  reported,
  target,
  adjusted,
}: {
  reported: number;
  target: number;
  adjusted: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduced = usePrefersReducedMotion();
  const max = Math.max(reported, target, adjusted) * 1.05;
  const animate = mounted || reduced;
  const gap = target - reported;

  const bars = [
    { label: "Reported EBITDA", value: reported, color: "var(--vellum)", note: "today" },
    {
      label: "Target draw",
      value: target,
      color: "var(--gilt)",
      note: "buyer-001 baseline",
    },
    {
      label: "Broker’s adjusted",
      value: adjusted,
      color: "var(--moss)",
      note: "if buyer replaces the manager — not viable",
    },
  ];

  return (
    <div
      ref={ref}
      className="rounded-sm border border-rule bg-surface-ink p-6 md:p-8"
      role="img"
      aria-label={`The gap is ${formatCurrency(gap)} — reported earnings ${formatCurrency(reported)} versus target ${formatCurrency(target)}.`}
    >
      <span className="sr-only">
        Reported EBITDA: {formatCurrency(reported)}. Target draw: {formatCurrency(target)}.
        Broker’s adjusted figure: {formatCurrency(adjusted)} (only achievable by eliminating the
        operations manager). Gap between reported and target: {formatCurrency(gap)}.
      </span>

      <div className="t-caption mb-5 text-fg-quiet">EBITDA / target draw — annualized</div>
      <div className="space-y-5">
        {bars.map((b, i) => {
          const pct = (b.value / max) * 100;
          return (
            <div key={b.label}>
              <div className="mb-2 flex items-baseline justify-between gap-3">
                <span className="text-[0.92rem] text-fg">{b.label}</span>
                <span className="tnum text-[0.95rem]" style={{ color: b.color }}>
                  {formatCurrency(b.value)}
                </span>
              </div>
              <div className="relative h-2.5 overflow-hidden rounded-full bg-rule">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={animate ? { width: `${pct}%` } : { width: "0%" }}
                  transition={{
                    duration: reduced ? 0 : 0.7,
                    delay: reduced ? 0 : 0.12 * i,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: b.color }}
                />
              </div>
              {b.note ? (
                <div className="mt-1.5 text-[0.78rem] text-fg-quiet">{b.note}</div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-7 border-t border-rule pt-5">
        <div className="flex items-baseline justify-between">
          <span className="t-caption text-rust">Gap</span>
          <span className="tnum text-[1.5rem] text-rust">{formatCurrency(gap)}</span>
        </div>
        <p className="text-pretty mt-2 text-[0.92rem] text-fg-muted">
          The gap is real. The path is to negotiate price down to the level where effective
          yield (after debt service) clears the target draw — or to carry a seller note that
          does the same.
        </p>
      </div>
    </div>
  );
}
