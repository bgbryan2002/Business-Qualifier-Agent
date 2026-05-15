---
id: portfolio-plan-v1
title: Showcase Portfolio Plan v1 — apps/portfolio/
note_type: portfolio
category: ui
source_url: internal
source_repo: bgbryan2002/Business-Qualifier-Agent
source_type: user_upload
license: n/a-public-record
checksum_sha256: pending-vault-librarian
confidence: 0.85
citation:
  - obsidian-vault/00-Claude-Control/OPERATING-RULES.md
  - obsidian-vault/00-Claude-Control/SCHEMAS.md
  - obsidian-vault/02-Buyers/profiles/buyer-001.json
  - obsidian-vault/02-Buyers/profiles/buyer-001.md
  - obsidian-vault/03-Deals/listings/draft/L002-franchise-cleaning-north-atlanta.md
  - obsidian-vault/03-Deals/scored/draft/L002-assessment.md
  - obsidian-vault/03-Deals/due-diligence/draft/L002-dd.md
  - obsidian-vault/03-Deals/listings/draft/L003-fedex-routes-atlanta.md
  - obsidian-vault/03-Deals/scored/draft/L003-assessment.md
  - obsidian-vault/03-Deals/due-diligence/draft/L003-dd.md
  - obsidian-vault/03-Deals/listings/draft/L004-gasket-replacement-savannah.md
  - obsidian-vault/03-Deals/memos/draft/L004-memo.md
  - obsidian-vault/03-Deals/templates/search-rubric-buyer-001.md
  - obsidian-vault/04-Dashboard/plans/dashboard-plan-v1.md
  - RUN-LOG.md (L007/L008 retractions, broker-pattern hardening)
as_of_date: 2026-05-15
validator_id: ui-ux-architect
status: draft
tags: [portfolio, phase-5, plan, draft, r3f, gsap, motion, rive, lottie, wcag-aa, editorial]
---

# Showcase Portfolio Plan — v1

> Companion JSON: `obsidian-vault/06-Portfolio/drafts/portfolio-plan-v1.json`. The JSON is the contract; this markdown is the rationale, the wireframes, and the build narrative.

## Executive summary

**What gets built:** a 10-surface Next.js (App Router) + TypeScript app at `apps/portfolio/` that presents the three actionable findings from the buyer-001 pipeline as a designed editorial dossier. The buyer reads this the way they would read a private memo from a partner — page-turn cadence, large numbers, load-bearing prose, intentional whitespace. Three listings (L002 negotiable, L003 future-target, L004 flagged) are the entire narrative input. Zero fabricated "deal of the year" candidates.

**What's different from the dashboard:** the dashboard is a tool (read-only, dense tables, neutral slate + terracotta, Inter only, Motion only, no decorations). The portfolio is a deliverable (sparse, typography-driven, paper-on-ink dark default with a gilt accent, Fraunces + Inter Tight + JetBrains Mono, R3F hero, two GSAP timelines, Rive gauges, dotLottie transitions). The buyer should feel the surface change when they navigate from one to the other.

**The honesty pivot:** buyer-001's pipeline today has zero clean wins. The portfolio surfaces this on the third screen with the line *"Three listings. Zero clean wins. One conversation worth having today."* This framing is load-bearing. Pretend-perfection would undermine every honest moment that follows.

## A. Aesthetic direction

### Typography system

**Headline:** Fraunces (Google Fonts, variable, OPSZ + SOFT + WONK axes). Weights 300–700. Tracking −0.02em at display sizes, −0.01em at H2. Fraunces is a contemporary humanist serif — it reads as "considered" and "editorial" without the law-firm stiffness of Tiempos or the trend-bait of Editorial New. The variable WONK axis gives the hero a single moment of personality (a subtle splay on the buyer's name) that no React/Next default ever ships with.

**Body:** Inter Tight (Google Fonts, variable). Weights 400–600. Tracking −0.005em. Inter Tight is dense and modern without being generic Inter. Pairing a soft serif headline with a tight neo-grotesque body is the deliberate inverse of the dashboard's all-Inter utility voice — same family root, different mood.

**Numeric:** JetBrains Mono (Google Fonts, variable). Tabular figures, slightly smaller cap-height than Inter Tight so it doesn't shout next to body text. Every dollar figure, every score, every percentage in narrative copy is set in mono. Mono numerics in editorial layouts (NYT, FT, Bloomberg) signal "this is a number, trust it" — in a portfolio about cash flows and scores, typography becomes a credibility cue.

**Type scale** (modular, 7 tokens):

| Token | Size | Line-height | Weight | Usage |
|---|---|---|---|---|
| display | 6.0rem | 0.95 | 400 | Hero buyer name, single use per page |
| h1 | 3.5rem | 1.05 | 400 | Section openers |
| h2 | 2.25rem | 1.15 | 500 | Deal card titles |
| h3 | 1.5rem | 1.25 | 500 | Sub-sections |
| lead | 1.375rem | 1.5 | 400 | Thesis paragraph, first paragraph of each surface |
| body | 1.0625rem | 1.65 | 400 | Default |
| caption | 0.875rem | 1.4 | 500 | Labels, citations, source URLs |

**Weight ladder:** 400 → 500 → 600. 700 reserved for inline strong. No 800/900.

### Palette

Two-temperature: a deep verdant *ledger green* anchors the brand (money, parsing, evergreen records) against a warm bone paper. Status colors are muted, not neon — this is a dossier, not a dashboard. The dashboard's terracotta accent is intentionally NOT carried over; this app gets its own identity (**gilt**) so the buyer can feel the surface change.

| Token | Hex | Name | Usage | Pairs with | Ratio | WCAG |
|---|---|---|---|---|---|---|
| ink | `#0E1410` | Deep ledger ink | Primary background (dark mode) | bone | 16.8:1 | AAA |
| bone | `#F4EFE6` | Bone paper | Primary background (light mode), primary text on ink | ink | 16.8:1 | AAA |
| verdant | `#1F3D2E` | Ledger verdant | Surfaces, card panels, brand accent | bone | 10.4:1 | AAA |
| moss | `#7BA68A` | Moss | Secondary accent, fit-meter mid-range, success-soft | ink | 8.1:1 | AAA |
| gilt | `#C7A24C` | Antique gilt | **Primary accent** — buyer name, score numerals, hero highlight. The one warm note. | ink | 10.2:1 | AAA |
| rust | `#A24E2B` | Iron rust | Risk / hard-gate-fail / retraction band. Muted, not alarm-red. | bone | 5.4:1 | AA body / AAA large |
| vellum | `#D9D1C0` | Vellum | Borders, dividers, low-contrast captions on bone | ink | 12.1:1 | AAA |

Dark-first by default (paper-on-ink, dramatic). Light reading mode toggle flips paper to ink (classical). Gilt is used under 5% of total surface area — the one warm note in a cool palette, reserved for moments that matter (the buyer's name, score numerals, the recommended-action arrows).

### Motion language (one paragraph)

Page-turn, not slideshow. Entries ease-out at 260ms with a 12px upward translate and opacity 0→1; exits are faster (160ms, no translate) — Emil Kowalski's *"exit faster than enter"* rule. Layout reorders use spring physics (stiffness 280, damping 32) — Emil's *"spring-physics on layout reorder"*. Shared-element transitions on the deal-card → deal-detail navigation give the dossier its "book-binding" feel — Emil's *"shared-element layout transitions"*. No parallax. No scroll-jacking. No count-ups longer than 600ms. The R3F hero is a single contemplative drift, not a demo reel. Everything clamps to opacity-only under `prefers-reduced-motion`.

### Density / voice

Editorial dossier, low-medium density. Each surface earns its scroll. Voice is *quiet authority* — the document was prepared for one reader, not for a market. No marketing hyperbole, no "AI-aesthetic word soup," no exclamation marks. When the system has nothing good to say, it says so plainly (the L004 flagged surface, the /findings honesty pivot). The dashboard sounds like a colleague reading a spreadsheet aloud; the portfolio sounds like a partner reading a memo to themselves.

### UI-UX-Pro-Max rules applied (cited, since the CLI is broken)

1. **Accessibility-first (priority 1):** WCAG 2.2 AA on every surface; AAA on body text.
2. **Touch (priority 2):** 44×44 hit targets minimum, 48×48 on the three deal cards.
3. **Performance (priority 3):** R3F lazy-loaded, single hero scene, <10k tris budget, static PNG fallback on mobile.
4. **Style (priority 4):** one accent color (gilt) used sparingly — under 5% of surface.
5. **Type (priority 6):** two type families + one mono; modular scale documented above.
6. **Color (priority 6):** non-load-bearing semantic colors (status always paired with icon + word).
7. **Animation (priority 7):** durations clamped, `prefers-reduced-motion` respected, no decorative loops.

## B. Narrative structure (10 surfaces)

| # | Surface | Route | Role |
|---|---|---|---|
| 1 | Hero | `/` | R3F + GSAP entry timeline; buyer name + one-sentence thesis |
| 2 | Buyer Thesis | `/thesis` | Capital posture, operator profile, what the buyer is hunting |
| 3 | The Three Truths | `/findings` | **Honesty pivot.** Zero clean wins. Negotiable / Future-target / Flagged framing |
| 4 | L002 — Negotiable | `/deals/l002` | Franchised cleaning. Sunbelt Atlanta. The $33k gap conversation |
| 5 | L003 — Future-target | `/deals/l003` | FedEx P&D Routes. Right model, wrong moment. 18–24 month patience play |
| 6 | L004 — Flagged | `/deals/l004` | Savannah gasket. Broker-pattern catch. **System-integrity surface** |
| 7 | Cross-comparison | `/comparison` | GSAP ScrollTrigger reveals three axes sequentially |
| 8 | Recommended Next Steps | `/next-steps` | Three concrete actions in order |
| 9 | System Integrity | `/system` | The retractions and broker-pattern hardening, exposed |
| 10 | Due Diligence Appendix | `/appendix` | Full DD packets behind accordion expand |

### Hero — ASCII wireframe

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│                                                                               │
│            ┌─ R3F canvas: three drifting paper cards, gilt edges ─┐           │
│            │       (camera fixed, scene slowly rotates)            │           │
│            │                                                        │           │
│            └────────────────────────────────────────────────────────┘           │
│                                                                               │
│                                                                               │
│                          A DOSSIER PREPARED FOR                               │
│                                                                               │
│                            B U Y E R   0 0 1                                  │
│                          (Fraunces display, WONK)                             │
│                                                                               │
│                   Atlanta · twelve hours a week · 2026-05-15                  │
│                            (Inter Tight, gilt)                                │
│                                                                               │
│                                                                               │
│                          [ Begin reading  ↓ ]                                 │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

Timeline: 0ms type-mask reveal of name → 700ms R3F fade-in → 1200ms tagline type-on → 1800ms CTA fade-in. Single GSAP timeline. Reduced-motion: `progress(1)` on mount.

### Deal card (L002) — ASCII wireframe

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  L002 · NEGOTIABLE                                          [Fit gauge 62/100]│
│                                                              (Rive arc, gilt) │
│  Franchised Commercial Cleaning                                               │
│  North Metro Atlanta · Sunbelt Brokers · Listed 2026-05-15                    │
│  ────────────────────────────────────────────────────────────────────────     │
│                                                                               │
│      $360,000             $597,121              $107,848                      │
│       asking            annual revenue       EBITDA (reported)                │
│      (mono)                (mono)              (mono, gilt)                   │
│                                                                               │
│      Target: $140,000 owner profit          ← $33,000 gap                    │
│                                                  (rust)                       │
│                                                                               │
│  Why it's the one to talk about                                               │
│  ────────────────────────────────                                             │
│  Thirteen years in business. Manager in place. Sixty-two active commercial    │
│  clients on recurring schedule. The owner works twelve hours a week — and    │
│  every one of those hours is in sales. That is the negotiation lever.        │
│                                                                               │
│  The $33,000 gap (and how negotiation closes it)                              │
│  ────────────────────────────────────────────────                             │
│  [single scroll-pinned visualization, GSAP single-pin — not a sequence]      │
│                                                                               │
│  Top risks                          Top opportunities                         │
│  [Rive risk-meter, 4/5]             [list, 5 items]                          │
│                                                                               │
│  What the broker isn't saying                                                 │
│  ────────────────────────────────                                             │
│  • Franchisor identity hidden — required before LOI                          │
│  • Adjusted EBITDA of $174k assumes eliminating the ops manager              │
│  • Owner-as-sales-driver risk not disclosed                                  │
│                                                                               │
│  Recommended ask                                                              │
│  ────────────────                                                             │
│  NDA + ask Mark Werbalowsky for franchisor name and FDD Item 19.             │
│  Counter at $300k OR ask for seller note to close the $33k gap.              │
│                                                                               │
│  [ See the receipts ↓ ]    — anchors to /appendix#L002                       │
└───────────────────────────────────────────────────────────────────────────────┘
```

### Cross-comparison — ASCII wireframe

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  CROSS-COMPARISON                              (GSAP ScrollTrigger pinned)    │
│  ────────────────────────────────────────────────────────────────────────     │
│                                                                               │
│  Axis 1: Price vs first-year cash yield to buyer                              │
│                                                                               │
│      ↑ yield                                                                  │
│      │                          ●  L004 (flagged — dimmed)                    │
│      │                                                                        │
│      │       ●  L002 (negotiable, gilt)                                       │
│      │                                                                        │
│      │                ●  L003 (gated — dimmed)                                │
│      │                                                                        │
│      └─────────────────────────────────→ asking price                         │
│                                                                               │
│  [scroll continues; axis 2 draws after ScrollTrigger threshold]               │
│                                                                               │
│  Axis 2: Operator-fit vs effort required                                      │
│  Axis 3: Capital-feasibility today vs in 24 months                            │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

Each axis is a visx scatter; ink-line draws across screen (700ms GSAP), then deal-dots settle into position (Motion spring, 320ms each, staggered 80ms). Three axes, one sequence. Reduced-motion: pin disabled, all three axes render simultaneously, normal scroll.

## C. Motion budget per surface

### R3F (one scene total)

| Scene | Surface | Depicts | Tri budget | Draw calls | Loading | Reduced-motion |
|---|---|---|---|---|---|---|
| hero-ledger-drift | `/` | Three suspended paper cards drifting under a gilt rim-light; primitives only (rounded boxes) | 8,000 | 8 | `next/dynamic` ssr:false, Suspense fallback = static AVIF (<80KB) | Render static AVIF, do not mount canvas. Same for mobile (<768px). |

### GSAP (two uses total)

| Timeline | Surface | Duration | Behavior | Why GSAP not Motion | Reduced-motion |
|---|---|---|---|---|---|
| hero-entry | `/` | 2400ms | Letter-mask reveal → R3F fade-in → thesis type-on → CTA fade-in | Sequence of dependent steps across SVG mask + canvas + DOM; cleaner in GSAP timeline syntax | `timeline.progress(1)` on mount |
| cross-comparison-scroll | `/comparison` | scroll-controlled | Three axes revealed via ScrollTrigger pin | ScrollTrigger pin + scrub-driven reveal is GSAP's home turf | ScrollTrigger disabled; axes render simultaneously |

### Motion (default for everything else)

| Pattern | Duration | Easing | Uses | Reduced-motion |
|---|---|---|---|---|
| fade-up (12px) | 260ms enter / 160ms exit | `cubic-bezier(0.16, 1, 0.3, 1)` enter; `cubic-bezier(0.7, 0, 0.84, 0)` exit | section enters, card enters, thesis paragraph | translate→0, duration→1ms |
| spring-layout | stiffness 280, damping 32 | spring | layout reorder, accordion height, filter chips | snap |
| shared-element | layout-id | spring | buyer-name → /thesis; deal-card → /deals/[id] | snap |
| stagger | 40ms delay | inherits | /findings blocks, /next-steps list | no stagger |

### Rive (two files total)

| File | Surface | States | Size | Fallback |
|---|---|---|---|---|
| fit-gauge.riv | every deal card | idle, enter, negotiable (gilt), gated (moss + rust icon), flagged (rust strike) | 30KB | static SVG + sr-only "Fit score: 62 of 100 — negotiable" |
| risk-meter.riv | /deals/l002, /deals/l003 | empty, low, medium, high (5 segments) | 18KB | static SVG + sr-only numeric |

### dotLottie (two files total, 52KB combined)

| File | Surface | Purpose | Size | Loop | Fallback |
|---|---|---|---|---|---|
| broker-pattern-cluster.lottie | /deals/l004 | dots clustering into flagged ring | 40KB | no | static SVG of final state |
| accordion-chevron.lottie | /appendix | open/close glyph | 12KB | no | CSS rotate on static SVG chevron |

## D. Asset pipeline (concrete deliverables)

1. **Hero R3F scene** — `apps/portfolio/src/scenes/HeroLedgerDrift.tsx` + `apps/portfolio/public/hero-fallback.avif`. Primitives only. Fallback PNG produced first.
2. **fit-gauge.riv** (blocking) — `apps/portfolio/public/rive/fit-gauge.riv` with 5 states. Must exist before `/findings` and `/deals/[id]` are buildable. Static SVG fallback in same dir.
3. **risk-meter.riv** (blocking) — `apps/portfolio/public/rive/risk-meter.riv` with 4 states.
4. **broker-pattern-cluster.lottie** (non-blocking) — `apps/portfolio/public/lottie/broker-pattern-cluster.lottie`. Static SVG fallback.
5. **accordion-chevron.lottie** (non-blocking) — `apps/portfolio/public/lottie/accordion-chevron.lottie`. Alternative: pure CSS rotate if it slips.
6. **Typography self-hosting** — `apps/portfolio/src/app/fonts.ts` via `next/font/google` for Fraunces + Inter Tight + JetBrains Mono. Latin-only subset. Preload Fraunces display weight + Inter Tight 400/500.
7. **CSS variable token system** — `apps/portfolio/src/app/globals.css` with all 7 palette tokens + dark/light flip + type-scale rem tokens.
8. **Photography / illustration** — **NONE in v1.** Surfaces are typography + R3F + Rive + Lottie + visx. Stock photography would dilute the editorial direction.

## Build sequence for `portfolio-designer`

1. Scaffold `apps/portfolio/` (Next.js 15 App Router, TypeScript strict, Tailwind). Mirror the dashboard's hand-rolled-on-Radix posture; do **not** install shadcn.
2. Token layer: `globals.css` with 7 palette CSS variables + dark/light flip + type-scale rem tokens.
3. Typography: `next/font/google` for Fraunces + Inter Tight + JetBrains Mono.
4. Vault read layer: server-only utilities to parse the 3 listing files + 3 assessment files + 3 DD/memo files + buyer profile + search rubric. Typed against SCHEMAS.md.
5. Primitives: Button, Card, Accordion (Radix), FocusRing, ReadingModeToggle, ReducedMotionProvider, ScrollLink.
6. Status atoms: ScoreBadge, HardGateBadge, ConfidenceMeter (visually distinct from the dashboard's — different palette + typography, same a11y contract).
7. Build `/thesis` first — typography-driven, no motion library needed yet. Validates the type system and read layer end-to-end.
8. Build `/findings` — first surface that mounts Rive. Ship with static SVG fallback; swap in Rive once `.riv` files exist.
9. Build `/deals/l002`, then `/deals/l003`, then `/deals/l004`. Shared-element transition from `/findings` card.
10. Build `/comparison` — visx scatter + GSAP ScrollTrigger pin. Second and final GSAP use.
11. Build `/next-steps` — pure typography + Motion hover.
12. Build `/system` — Motion stagger timeline of events.
13. Build `/appendix` — accordion + dotLottie chevron + sr-only data tables for DD claims.
14. Build `/` (hero) **last** — R3F scene + GSAP entry timeline. Can ship with static PNG fallback and add 3D iteratively.
15. A11y pass: keyboard walkthrough every surface, axe-core CI, screen-reader pass on `/findings`, `/deals/[id]`, `/comparison`, `/appendix`.
16. Reduced-motion pass: flip OS setting, walk every surface. R3F replaced by PNG. GSAP snaps. Lottie replaced by SVG.
17. Performance pass: Lighthouse on every route. Target: Performance ≥ 90 on `/thesis`, `/findings`, `/next-steps`, `/system`, `/appendix`. Performance ≥ 75 on `/`, `/comparison`, `/deals/[id]` (R3F and GSAP-pin surfaces have an intentional budget hit).
18. GATE 5 checklist: every surface has `prefers-reduced-motion` fallback, no decorative loops, no scroll-jacking, all 3 deals render from vault data (no hardcoded numbers), R3F lazy-loaded (verified in network panel), shared-element transitions work both directions.

## Top 3 system-integrity moments

1. **`/findings` opens with "Three listings. Zero clean wins. One conversation worth having today."** — frames honesty as the product, not a caveat.
2. **`/deals/l004` (Flagged surface)** — surfaces the broker-pattern catch in the portfolio itself, not buried in a log. The dossier shows what it filtered out and why.
3. **`/system` appendix** — lays out the L007/L008 retractions and broker-pattern hardening with dates and outcomes. Negative results are part of the product.

## Top 3 accessibility commitments

1. **WCAG 2.2 AA on every surface; AAA on body-text contrast.** All foreground/background pairs documented (16.8:1 max, 5.4:1 min). Status colors paired with icon + word everywhere (color is never load-bearing).
2. **`prefers-reduced-motion` honored globally and granularly.** R3F replaced by static AVIF, GSAP timelines `progress(1)` on mount, Lottie replaced by static SVG, Motion translate→0 with duration→1ms (opacity preserved at half duration since pure opacity is reduced-motion-safe).
3. **R3F / Rive / Lottie all marked `aria-hidden=true`; narrative meaning lives in surrounding text.** sr-only text accompanies every gauge ("Fit score: 62 of 100 — negotiable"). visx charts in `/comparison` include sr-only data tables (same a11y pattern dashboard used for Recharts).

## Tier-2 skill availability flag

- **ui-ux-pro-max**: SKILL.md used as static reference only — CLI is broken (RN-biased + broken symlinks per pre-flight). Priority order (Accessibility → Touch → Performance → Style → Layout → Type/Color → Animation → Forms → Nav → Charts) lifted and applied. Cited rules listed above.
- **web-accessibility**: skill failed to install (supercent-io repo auth failure). WCAG 2.2 AA principles applied from first principles + ARIA Authoring Practices Guide, mirroring the dashboard's approach.
- **web-design-guidelines** (Vercel Labs): treat as lint pass — `portfolio-designer` should re-run with this skill active locally before declaring GATE 5.
- **emil-kowalski-motion**: documented in `01-Skills/animation/`. Three named patterns cited explicitly in the motion language: *exit faster than enter*, *spring-physics on layout reorder*, *shared-element layout transitions*.

## Open questions for the orchestrator

1. Should `/comparison` include a fourth deal-slot for "placeholder — a future fit lives here"? Argues for: forward-looking narrative, sets reader expectation. Argues against: dilutes the honesty of "three listings, zero clean wins". **Recommendation:** no — preserve the honesty pivot.
2. Reading mode default: dark-first (paper-on-ink, dramatic) or light-first (paper-on-bone, classical)? **Recommendation:** dark-first to differentiate from dashboard's neutral-slate light-first.
3. Does the buyer want a printable / PDF export of the dossier? Editorial layout makes print plausible. **Recommendation:** defer to v2.
4. Where does the Rive editing happen — `portfolio-designer` authors `.riv` files via the Rive web editor (free tier), or does the human want to author them? **Recommendation:** `portfolio-designer` authors; human reviews before commit.
5. Confirm `/portfolio` is reachable from the dashboard's GlobalNav (the dashboard plan stubs an external link). New tab or same tab? **Recommendation:** new tab — the dossier is a destination, not a sub-page.
6. Confirm orchestrator is OK with ui-ux-pro-max being used as static reference only (CLI broken per pre-flight).
