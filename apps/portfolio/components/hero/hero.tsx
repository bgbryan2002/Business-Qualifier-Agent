"use client";

/**
 * Hero — GSAP entry timeline + lazy R3F scene.
 *
 * Sequence (2400ms total):
 *   0ms     letter-mask reveal of "Buyer 001"
 *   700ms   R3F scene fade-in
 *   1200ms  thesis line types-on
 *   1800ms  CTA fades in
 *
 * Reduced-motion: timeline.progress(1) on mount + R3F replaced with AVIF fallback.
 * Mobile (<768px): R3F replaced with static fallback to preserve INP per plan.
 */

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import Link from "next/link";
import { usePrefersReducedMotion } from "@/components/providers/reduced-motion";

const HeroLedgerDrift = dynamic(() => import("./hero-ledger-drift"), {
  ssr: false,
  loading: () => null,
});

const NAME_LETTERS = "Buyer 001".split("");

export function Hero({ asOfDate, homeMetro, hours }: { asOfDate: string; homeMetro: string; hours: number }) {
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const r3fHostRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [mountedR3F, setMountedR3F] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect viewport — skip R3F under 768px
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // GSAP entry timeline — first of TWO GSAP uses in the whole app
  useEffect(() => {
    if (!root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".js-letter", {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        stagger: 0.05,
      });
      tl.fromTo(
        r3fHostRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.0 },
        0.7
      );
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.2
      );
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.5 },
        1.8
      );
      if (reduced) tl.progress(1);
      // Mount R3F only after the timeline has begun the fade-in
      const delay = reduced ? 0 : 800;
      const id = window.setTimeout(() => {
        if (!isMobile) setMountedR3F(true);
      }, delay);
      return () => window.clearTimeout(id);
    }, root);
    return () => ctx.revert();
  }, [reduced, isMobile]);

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-5 py-16"
    >
      {/* R3F host — absolutely positioned behind */}
      <div
        ref={r3fHostRef}
        className="pointer-events-none absolute inset-0 -z-10 opacity-0"
        aria-hidden="true"
      >
        {mountedR3F && !isMobile && !reduced ? (
          <HeroLedgerDrift />
        ) : (
          <StaticHeroFallback />
        )}
      </div>
      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, transparent 0%, var(--bg) 75%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1100px] text-center">
        <p className="t-caption mb-7 text-fg-quiet">A dossier prepared for</p>
        <h1 className="t-display text-balance text-fg" aria-label="Buyer 001 — a dossier">
          <span className="inline-flex">
            {NAME_LETTERS.map((c, i) => (
              <span
                key={i}
                className="js-letter inline-block"
                style={{
                  display: c === " " ? "inline-block" : undefined,
                  width: c === " " ? "0.5em" : undefined,
                  color: c.match(/[0-9]/) ? "var(--gilt)" : undefined,
                }}
              >
                {c === " " ? " " : c}
              </span>
            ))}
          </span>
        </h1>
        <p
          ref={taglineRef}
          className="tnum mt-7 text-[clamp(0.95rem,2vw,1.05rem)] uppercase tracking-[0.22em] text-fg-muted opacity-0"
        >
          {homeMetro.split(",")[0]} <span className="text-fg-quiet">·</span>{" "}
          {hours} hours a week <span className="text-fg-quiet">·</span> {asOfDate}
        </p>
        <p className="t-lead text-balance mx-auto mt-12 max-w-2xl text-fg">
          Three listings. Zero clean wins. One conversation worth having today.
        </p>
        <div ref={ctaRef} className="mt-12 flex flex-col items-center gap-3 opacity-0">
          <Link
            href="/thesis"
            className="group inline-flex items-center gap-2 border-b border-gilt/40 px-1 pb-2 text-[0.86rem] uppercase tracking-[0.18em] text-gilt hover:border-gilt"
            aria-label="Begin reading — go to the buyer thesis"
          >
            Begin reading
            <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
              →
            </span>
          </Link>
          <Link
            href="/findings"
            className="text-[0.78rem] uppercase tracking-[0.18em] text-fg-quiet hover:text-fg"
          >
            or jump to findings
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Static hero fallback — used under prefers-reduced-motion AND mobile.
 * Pure SVG so it serves at <8KB and matches the R3F scene's composition
 * (three drifting paper cards under warm rim-light).
 */
function StaticHeroFallback() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="rim" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="var(--gilt)" stopOpacity="0.16" />
          <stop offset="40%" stopColor="var(--gilt)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill="url(#rim)" />
      <g transform="translate(50 50)">
        <g transform="rotate(-12) translate(-22 -2)">
          <rect x="-9" y="-13" width="18" height="26" rx="0.4" fill="var(--verdant)" />
          <rect x="-9" y="-13" width="18" height="26" rx="0.4" fill="none" stroke="var(--gilt)" strokeWidth="0.18" strokeOpacity="0.6" />
        </g>
        <g transform="rotate(2) translate(0 0)">
          <rect x="-10" y="-14" width="20" height="28" rx="0.4" fill="#243A2F" />
          <rect x="-10" y="-14" width="20" height="28" rx="0.4" fill="none" stroke="var(--gilt)" strokeWidth="0.22" strokeOpacity="0.7" />
        </g>
        <g transform="rotate(11) translate(22 -1)">
          <rect x="-9" y="-13" width="18" height="26" rx="0.4" fill="var(--verdant)" />
          <rect x="-9" y="-13" width="18" height="26" rx="0.4" fill="none" stroke="var(--gilt)" strokeWidth="0.18" strokeOpacity="0.6" />
        </g>
      </g>
    </svg>
  );
}
