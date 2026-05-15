"use client";

/**
 * FitGauge — inline-SVG state machine.
 *
 * Fallback from the planned Rive (.riv) asset. The Rive web editor is not
 * reachable from this subagent execution context, so we ship a hand-rolled
 * SVG with the same five states the .riv file would expose:
 *
 *   idle | enter | negotiable (gilt arc) | gated (moss + rust gate-icon) | flagged (rust strike)
 *
 * The component is Motion-animated on intersection. Decorative; the numeric
 * score and state name are conveyed by sr-only text adjacent to the gauge
 * so screen readers don't depend on the visual.
 */

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/providers/reduced-motion";

export type GaugeState = "negotiable" | "gated" | "flagged";

interface Props {
  score: number | null; // 0..100, or null for flagged
  state: GaugeState;
  size?: number;
  label: string;
}

const STROKE = 6;
// Arc spans from 220° to 500° (clockwise sweep of 280°)
const START_ANGLE = 220;
const SWEEP = 280;

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const polar = (a: number) => ({
    x: cx + r * Math.cos((a * Math.PI) / 180),
    y: cy + r * Math.sin((a * Math.PI) / 180),
  });
  const start = polar(startAngle);
  const end = polar(endAngle);
  const large = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
}

const STATE_STYLES: Record<
  GaugeState,
  { stroke: string; bgStroke: string; icon: "tick" | "gate" | "strike" }
> = {
  negotiable: { stroke: "var(--gilt)", bgStroke: "var(--rule)", icon: "tick" },
  gated: { stroke: "var(--moss)", bgStroke: "var(--rule)", icon: "gate" },
  flagged: { stroke: "var(--rust)", bgStroke: "var(--rule)", icon: "strike" },
};

export function FitGauge({ score, state, size = 128, label }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const reduced = usePrefersReducedMotion();
  const inView = mounted;

  const cx = size / 2;
  const cy = size / 2;
  const r = (size - STROKE) / 2;

  const bgArc = describeArc(cx, cy, r, START_ANGLE, START_ANGLE + SWEEP);
  const pct = score != null ? Math.min(Math.max(score, 0), 100) / 100 : 0;
  const valueArc = describeArc(cx, cy, r, START_ANGLE, START_ANGLE + SWEEP * pct);

  const { stroke, bgStroke, icon } = STATE_STYLES[state];

  const animate = inView || reduced;

  return (
    <div className="inline-flex flex-col items-center gap-1.5" role="img" aria-label={label}>
      <span className="sr-only">{label}</span>
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        className="block"
      >
        {/* Background track */}
        <path d={bgArc} stroke={bgStroke} strokeWidth={STROKE} fill="none" strokeLinecap="round" />
        {/* Value arc */}
        {state !== "flagged" && (
          <motion.path
            d={valueArc}
            stroke={stroke}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={animate ? { pathLength: 1, opacity: 1 } : {}}
            transition={{
              duration: reduced ? 0 : 1.1,
              ease: [0.16, 1, 0.3, 1],
              delay: reduced ? 0 : 0.15,
            }}
          />
        )}
        {/* Flagged: red full arc + diagonal strike */}
        {state === "flagged" && (
          <>
            <motion.path
              d={bgArc}
              stroke={stroke}
              strokeWidth={STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray="2 5"
              initial={{ opacity: 0 }}
              animate={animate ? { opacity: 0.7 } : {}}
              transition={{ duration: reduced ? 0 : 0.6 }}
            />
            <motion.line
              x1={cx - r * 0.7}
              y1={cy - r * 0.7}
              x2={cx + r * 0.7}
              y2={cy + r * 0.7}
              stroke={stroke}
              strokeWidth={STROKE - 1}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={animate ? { pathLength: 1 } : {}}
              transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.4 }}
            />
          </>
        )}
        {/* Center label */}
        {state !== "flagged" && (
          <text
            x={cx}
            y={cy + 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={size * 0.28}
            fontWeight={500}
            fill="var(--fg)"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {score ?? "—"}
          </text>
        )}
        {state === "flagged" && (
          <text
            x={cx}
            y={cy + 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={size * 0.18}
            fontWeight={500}
            fill="var(--rust)"
            style={{ letterSpacing: "0.08em" }}
          >
            FLAG
          </text>
        )}
        {/* State glyph below */}
        {icon === "gate" && (
          <text
            x={cx}
            y={cy + size * 0.28}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={size * 0.08}
            fill="var(--rust)"
            style={{ letterSpacing: "0.18em" }}
          >
            GATED
          </text>
        )}
        {icon === "tick" && (
          <text
            x={cx}
            y={cy + size * 0.28}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={size * 0.08}
            fill="var(--gilt)"
            style={{ letterSpacing: "0.18em" }}
          >
            NEGOTIABLE
          </text>
        )}
      </svg>
    </div>
  );
}
