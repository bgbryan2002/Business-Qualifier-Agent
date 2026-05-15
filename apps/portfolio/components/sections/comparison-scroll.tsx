"use client";

/**
 * /comparison — GSAP ScrollTrigger-pinned reveal across three axes.
 *
 * Per plan §B-cross-comparison: ink-line draws across, then deal-dots settle
 * into position with a Motion spring stagger. Reduced-motion: pin disabled,
 * all three axes render simultaneously.
 *
 * This is the SECOND and final use of GSAP in the app (the first is the
 * hero entry timeline). Everywhere else, Motion.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { usePrefersReducedMotion } from "@/components/providers/reduced-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Point {
  id: string;
  label: string;
  classification: "negotiable" | "future-target" | "flagged";
}

interface AxisDef {
  title: string;
  xLabel: string;
  yLabel: string;
  points: Array<Point & { x: number; y: number }>;
  xDomain: [number, number];
  yDomain: [number, number];
  xFormat: (v: number) => string;
  yFormat: (v: number) => string;
}

const COLOR = {
  negotiable: "var(--gilt)",
  "future-target": "var(--moss)",
  flagged: "var(--rust)",
};

function fmtUsd(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  return `$${Math.round(v / 1000)}k`;
}

const AXES: AxisDef[] = [
  {
    title: "Axis 1 — Price vs first-year cash yield",
    xLabel: "Asking price",
    yLabel: "Cash flow",
    xDomain: [200_000, 600_000],
    yDomain: [0, 320_000],
    xFormat: fmtUsd,
    yFormat: fmtUsd,
    points: [
      { id: "L002", label: "L002 · Negotiable", classification: "negotiable", x: 360_000, y: 107_848 },
      { id: "L003", label: "L003 · Future", classification: "future-target", x: 525_000, y: 162_000 },
      { id: "L004", label: "L004 · Flagged", classification: "flagged", x: 314_900, y: 294_861 },
    ],
  },
  {
    title: "Axis 2 — Operator fit vs effort required",
    xLabel: "Effort required (low → high)",
    yLabel: "Operator-fit score (0–100)",
    xDomain: [0, 100],
    yDomain: [0, 100],
    xFormat: (v) => String(v),
    yFormat: (v) => String(v),
    points: [
      { id: "L002", label: "L002 · Negotiable", classification: "negotiable", x: 55, y: 70 },
      { id: "L003", label: "L003 · Future", classification: "future-target", x: 22, y: 55 },
      { id: "L004", label: "L004 · Flagged", classification: "flagged", x: 75, y: 25 },
    ],
  },
  {
    title: "Axis 3 — Capital feasibility today vs in 24 months",
    xLabel: "Feasible today (0–100)",
    yLabel: "Feasible in 24 months (0–100)",
    xDomain: [0, 100],
    yDomain: [0, 100],
    xFormat: (v) => String(v),
    yFormat: (v) => String(v),
    points: [
      { id: "L002", label: "L002 · Negotiable", classification: "negotiable", x: 65, y: 90 },
      { id: "L003", label: "L003 · Future", classification: "future-target", x: 8, y: 78 },
      { id: "L004", label: "L004 · Flagged", classification: "flagged", x: 30, y: 30 },
    ],
  },
];

export function ComparisonScroll() {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const width = 760;
  const height = 420;
  const margin = { top: 24, right: 90, bottom: 60, left: 80 };
  const iw = width - margin.left - margin.right;
  const ih = height - margin.top - margin.bottom;

  // GSAP ScrollTrigger — second of two GSAP uses in the app.
  // Per-axis enter animations driven by viewport-entry scroll. No pin; the
  // three axes stack and reveal as the reader passes through them. This is
  // the scrub-friendly variant of the plan's pin behavior — it satisfies the
  // reduced-motion fallback and the full-page capture path identically.
  useEffect(() => {
    if (reduced) return;
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const axes = containerRef.current!.querySelectorAll<HTMLElement>("[data-axis]");
      const triggers: ScrollTrigger[] = [];
      axes.forEach((el) => {
        // Set up an enter animation: each axis lifts in as it scrolls into view.
        gsap.set(el, { opacity: 0, y: 20 });
        const tr = ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          end: "top 40%",
          onEnter: () => {
            gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
          },
          once: true,
        });
        triggers.push(tr);
      });
      // First axis always visible (above the fold)
      const first = axes[0];
      if (first) {
        gsap.to(first, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: 0.1 });
      }
      return () => {
        triggers.forEach((t) => t.kill());
      };
    }, containerRef);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="space-y-24">
        {AXES.map((ax, i) => (
          <div
            key={ax.title}
            data-axis={i}
            style={reduced ? {} : { opacity: i === 0 ? 1 : 0 }}
          >
            <ComparisonAxis
              axis={ax}
              width={width}
              height={height}
              margin={margin}
              iw={iw}
              ih={ih}
              visible
              reduced={reduced}
              index={i}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface AxisProps {
  axis: AxisDef;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  iw: number;
  ih: number;
  visible: boolean;
  reduced: boolean;
  index: number;
}

function ComparisonAxis({ axis, width, height, margin, iw, ih, reduced, index }: AxisProps) {
  const xScale = scaleLinear({ domain: axis.xDomain, range: [0, iw] });
  const yScale = scaleLinear({ domain: axis.yDomain, range: [ih, 0] });

  return (
    <div className="w-full" key={index}>
      <div className="t-caption mb-2 text-gilt">{axis.title}</div>
      <h2 className="t-h2 text-balance mb-6 text-fg">
        {index === 0
          ? "Price against first-year cash yield"
          : index === 1
            ? "How much work, how good a fit"
            : "Capital today versus capital in 24 months"}
      </h2>
      <div className="overflow-x-auto">
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`${axis.title}: scatter chart with three deals plotted against ${axis.xLabel} (x) and ${axis.yLabel} (y).`}
        >
          <Group left={margin.left} top={margin.top}>
            <AxisLeft
              scale={yScale}
              numTicks={5}
              tickFormat={(d) => axis.yFormat(Number(d))}
              stroke="var(--rule)"
              tickStroke="var(--rule)"
              tickLabelProps={() => ({
                fill: "var(--fg-quiet)",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                textAnchor: "end",
                dx: -6,
                dy: 4,
              })}
              label={axis.yLabel}
              labelProps={{
                fill: "var(--fg-muted)",
                fontSize: 12,
                fontFamily: "var(--font-sans)",
                textAnchor: "middle",
              }}
              labelOffset={50}
            />
            <AxisBottom
              top={ih}
              scale={xScale}
              numTicks={5}
              tickFormat={(d) => axis.xFormat(Number(d))}
              stroke="var(--rule)"
              tickStroke="var(--rule)"
              tickLabelProps={() => ({
                fill: "var(--fg-quiet)",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                textAnchor: "middle",
                dy: 4,
              })}
              label={axis.xLabel}
              labelProps={{
                fill: "var(--fg-muted)",
                fontSize: 12,
                fontFamily: "var(--font-sans)",
                textAnchor: "middle",
              }}
              labelOffset={20}
            />
            {axis.points.map((p, i) => (
              <g key={p.id} transform={`translate(${xScale(p.x)},${yScale(p.y)})`}>
                <circle
                  r={9}
                  fill={COLOR[p.classification]}
                  fillOpacity={0.16}
                  stroke="none"
                />
                <circle
                  r={5}
                  fill={COLOR[p.classification]}
                  style={{
                    transformOrigin: "center",
                    animation: reduced ? "none" : `pop 0.4s ${0.08 * i}s both`,
                  }}
                />
                <text
                  x={12}
                  y={4}
                  fontFamily="var(--font-mono)"
                  fontSize={11}
                  fill="var(--fg)"
                  style={{ letterSpacing: "0.04em" }}
                >
                  {p.label}
                </text>
              </g>
            ))}
          </Group>
        </svg>
      </div>
      {/* sr-only data table for a11y parity with visx scatter */}
      <table className="sr-only">
        <caption>{axis.title} — full data</caption>
        <thead>
          <tr>
            <th>Listing</th>
            <th>{axis.xLabel}</th>
            <th>{axis.yLabel}</th>
            <th>Classification</th>
          </tr>
        </thead>
        <tbody>
          {axis.points.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{axis.xFormat(p.x)}</td>
              <td>{axis.yFormat(p.y)}</td>
              <td>{p.classification}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        @keyframes pop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.25);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
