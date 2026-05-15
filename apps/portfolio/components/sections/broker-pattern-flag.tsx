"use client";

/**
 * Broker-pattern visualization. Static SVG fallback for the planned
 * broker-pattern-cluster.lottie (clustering dots metaphor).
 *
 * Per pre-authorized scope, since dotLottie source files cannot be authored in
 * this execution context, this is the SVG fallback — same metaphor (scattered
 * listings clustering toward a flagged ring), animated with Motion.
 */

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/providers/reduced-motion";

const LISTINGS = [
  { id: "L004", industry: "Gasket repl.", mult: 1.07, x: 38, y: 30 },
  { id: "L009", industry: "Pest control", mult: 0.92, x: 70, y: 24 },
  { id: "L010", industry: "Pest control", mult: 1.01, x: 26, y: 56 },
  { id: "L011", industry: "Aircraft detailing", mult: 0.87, x: 78, y: 60 },
  { id: "L012", industry: "Fencing", mult: 1.03, x: 50, y: 78 },
];

export function BrokerPatternFlag() {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduced = usePrefersReducedMotion();
  const animate = mounted || reduced;

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-8 rounded-sm border border-rule bg-surface-ink p-6 md:grid-cols-[1fr_1fr] md:p-10"
      role="img"
      aria-label="Five listings from the same broker — Donald Webster on businessbroker.net — clustered under 1.5× SDE multiple across four industries."
    >
      <span className="sr-only">
        Donald Webster broker pattern: five listings on businessbroker.net across pest
        control, aircraft detailing, fencing, and gasket replacement, all priced at
        approximately 1.0× SDE. This is broker behavior, not coincidence.
      </span>

      <div className="relative aspect-square">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {/* Flagged ring */}
          <motion.circle
            cx={50}
            cy={50}
            r={42}
            fill="none"
            stroke="var(--rust)"
            strokeWidth={0.4}
            strokeDasharray="1.2 2"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={animate ? { opacity: 0.85, scale: 1 } : {}}
            transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.4 }}
            style={{ transformOrigin: "50% 50%" }}
          />
          <motion.circle
            cx={50}
            cy={50}
            r={28}
            fill="none"
            stroke="var(--rust)"
            strokeWidth={0.25}
            initial={{ opacity: 0 }}
            animate={animate ? { opacity: 0.4 } : {}}
            transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : 0.5 }}
          />
          {LISTINGS.map((l, i) => (
            <motion.g
              key={l.id}
              initial={{
                cx: reduced ? 50 : l.x,
                cy: reduced ? 50 : l.y,
                opacity: 0,
              }}
              animate={
                animate
                  ? {
                      cx: 50 + Math.cos((i * 2 * Math.PI) / 5) * 18,
                      cy: 50 + Math.sin((i * 2 * Math.PI) / 5) * 18,
                      opacity: 1,
                    }
                  : {}
              }
              transition={{
                duration: reduced ? 0 : 1.2,
                delay: reduced ? 0 : 0.15 * i,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <motion.circle
                r={2.4}
                fill="var(--rust)"
                cx={50 + Math.cos((i * 2 * Math.PI) / 5) * 18}
                cy={50 + Math.sin((i * 2 * Math.PI) / 5) * 18}
              />
            </motion.g>
          ))}
          {/* Center label */}
          <motion.text
            x={50}
            y={51}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={4}
            fill="var(--rust)"
            initial={{ opacity: 0 }}
            animate={animate ? { opacity: 1 } : {}}
            transition={{ delay: reduced ? 0 : 1.2 }}
            style={{ letterSpacing: "0.18em" }}
          >
            PATTERN
          </motion.text>
        </svg>
      </div>

      <div>
        <div className="t-caption text-rust">Broker · Donald Webster · businessbroker.net</div>
        <table className="mt-5 w-full text-left">
          <thead>
            <tr className="border-b border-rule text-fg-quiet">
              <th className="t-caption py-2">Listing</th>
              <th className="t-caption py-2">Industry</th>
              <th className="t-caption py-2 text-right">SDE×</th>
            </tr>
          </thead>
          <tbody>
            {LISTINGS.map((l) => (
              <tr key={l.id} className="border-b border-rule/60 last:border-b-0">
                <td className="py-2.5 text-[0.92rem] text-fg">{l.id}</td>
                <td className="py-2.5 text-[0.92rem] text-fg-muted">{l.industry}</td>
                <td className="tnum py-2.5 text-right text-[0.92rem] text-rust">
                  {l.mult.toFixed(2)}×
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="t-body text-pretty mt-5 text-fg-muted">
          Four industries, five listings, one broker, the same sub-1.5× anomaly. The
          search-rubric was hardened to flag this pattern automatically — see{" "}
          <em>/system</em>.
        </p>
      </div>
    </div>
  );
}
