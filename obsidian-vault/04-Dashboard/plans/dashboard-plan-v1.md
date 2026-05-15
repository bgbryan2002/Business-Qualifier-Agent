---
id: dashboard-plan-v1
title: Operational Dashboard Plan v1 — apps/dashboard/
note_type: dashboard
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
  - obsidian-vault/03-Deals/templates/search-rubric-buyer-001.md
  - RUN-LOG.md (2026-05-15 entries — empty-state design driver)
as_of_date: 2026-05-15
validator_id: ui-ux-architect
status: accepted
tags: [dashboard, phase-4, plan, draft, shadcn, recharts, motion, wcag-aa]
---

# Operational Dashboard Plan — v1

> Companion JSON: `obsidian-vault/04-Dashboard/plans/dashboard-plan-v1.json`. The JSON is the contract; this markdown is the rationale.

## Executive summary

**What gets built:** a 6-route Next.js (App Router) + TypeScript application at `apps/dashboard/` that lets buyer-001 navigate buyers, deals, diligence packets, memos, and the validated skill stack. shadcn/ui primitives, Tailwind, Recharts for charts, Motion for restrained layout transitions. Server-component-first; URL-as-state for filters.

**What does NOT get built:** anything in the portfolio's vocabulary. No 3D, no Spline, no GSAP timelines, no Lottie, no Rive, no parallax, no scroll-driven choreography. No editing UI for the underlying vault — the dashboard is read-mostly; mutations happen via subagents committing to the vault and the dashboard re-rendering on the next request. No authentication in v1 (single-buyer local-first app).

**Operating reality the plan accommodates:** as of 2026-05-15, the vault holds 8 ListingPackets but **zero** are currently actionable (3 rejected, 2 retracted, 2 high-fit-but-gated, 1 broker-pattern-flagged). The dashboard must look intentional and useful in this state — not broken, not empty-confetti, not pretending there's data that isn't there.

## Information architecture

```
/                                Operator home (multi-buyer, multi-deal at-a-glance)
├── /buyers/[id]                 Read-only BuyerProfile detail
├── /deals                       Full deals table (filter + sort)
│   └── /deals/[id]              Single deal: listing + diligence + score + memo + entity-advisory
├── /skills                      Validated skills directory (36 today across 7 categories)
├── /memos/[id]                  Printable memo view
└── ↗ /portfolio                 Link-out to Phase 5 app (external; opens in new tab)
```

| Route | Loading | Empty state when… | Notes |
|---|---|---|---|
| `/` | server | 0 buyers / 0 deals / all-rejected | Headline counts + 5 recent activity entries + 3 hard-gate summary mini-charts |
| `/buyers/[id]` | server | buyer file missing → 404 | One buyer = buyer-001 today; future-proof for multi-buyer |
| `/deals` | server + client filters | 0 listings / all rejected → show with banner + default "show rejected" ON | Filter bar in URL search params |
| `/deals/[id]` | server (parallel reads) | DD packet missing / DealAssessment missing / retracted | Top banner for retraction or broker-pattern flag |
| `/skills` | server | category with 0 skills → visible "none yet" | Group by category |
| `/memos/[id]` | server | memo missing → 404; retracted → banner + body still readable | Print-optimized CSS |

## Per-route detail

### `/` — Operator home

```
┌────────────────────────────────────────────────────────────────────────────┐
│ GlobalNav  [buyers] [deals] [skills] [memos]                  ↗ portfolio │
├────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Buyers   │  │ Listings │  │ Memos    │  │ Skills   │   (StatBlock × 4) │
│  │   1      │  │   8      │  │   1*     │  │   36     │                   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                   │
│                                                                            │
│  Buyers                                                                    │
│  ┌────────────────────────────────────────────┐                            │
│  │ buyer-001  •  Atlanta  •  $22k liquid / $450k borrow                    │
│  │ 8 listings reviewed · 1 active memo · 6 rejected                        │
│  └────────────────────────────────────────────┘                            │
│                                                                            │
│  Active deal ribbon (top-5 by score, status ≠ rejected)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                                    │
│  │ L002 62  │ │ L004 58  │ │ L003 44  │  (DealRibbon)                     │
│  └──────────┘ └──────────┘ └──────────┘                                    │
│                                                                            │
│  Hard-gate summary           Recent activity (last 5 RUN-LOG entries)     │
│  [stacked bar Recharts]      [feed]                                       │
└────────────────────────────────────────────────────────────────────────────┘
```

*Memo count excludes retracted L007/L008.

Empty-state matrix:
- 0 buyers → CTA "Run buyer-profiler" inline
- 0 deals → CTA "Paste URLs into inputs/listings.json and run Phase 3"
- All deals rejected → "No actionable candidates today" + grouped rejection-reason breakdown + link to RUN-LOG anchor for the most recent Phase 3 entry

### `/buyers/[id]` — Buyer profile

Header (name, id, as_of_date, sba_eligibility badge) + six panels stacked:
- CapitalStackPanel: liquid / borrowing / target owner profit / SBA eligibility
- OperatorPanel: hours/wk, involvement level, skills, industries_lived
- GeographyPanel: home metro, willing_to_relocate, max_commute_minutes, preferred_states
- IndustryPreferencesPanel: must_have / must_avoid / open_to / license_willingness
- DealConstraintsPanel: revenue / price / payback / seller_financing min / deal_breakers
- ScoringWeightsPanel: shows "using default weights" badge unless override populated
- DealsForBuyerTable: deals scored against this buyer (link to /deals filtered by buyer_id)

### `/deals` — All deals

Two-pane: DealsFilterBar (left, sticky) + DealsTable (right).

Columns (default visible): `listing_id` | `business_name` | `industry` | `city/state` | `asking_price_usd` | `sde_or_ebitda_usd` | `score` (ScoreBadge) | `confidence` (ConfidenceMeter) | `hard_gates` (3× HardGateBadge) | `status` (StatusBadge) | actions (link to /deals/[id]).

Sortable: every numeric column + score + confidence. Filterable: status (multi), hard-gate result (per gate), score range (Slider), confidence range (Slider), industry (multi-select), state (multi-select), broker (multi-select).

Above table: DealsDistributionChart (histogram of scores, 10-point bins).

Empty-state: when actionable count = 0, the "Show rejected" toggle defaults ON and a banner explains why ("8 ingested, 0 currently actionable — see breakdown below").

### `/deals/[id]` — Single deal

Suspense boundary per panel — listing facts render fast, diligence + assessment + memo + advisory each stream in.

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [RetractionNotice if retracted]                                           │
│ [BrokerPatternFlag if asking/SDE < 1.5×]                                  │
│ DealHeader: business_name · industry · city · ScoreBadge · StatusBadge   │
├────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────┐  ┌────────────────────────────────────────┐    │
│ │ ListingFactsPanel     │  │ ScoreBreakdownChart (6 subscores)      │    │
│ │ (asking / SDE /       │  │ HardGatePanel (3 gates, large)         │    │
│ │  metric type / NAICS  │  │ Top risks · Top opportunities          │    │
│ │  / employees / etc)   │  └────────────────────────────────────────┘    │
│ └───────────────────────┘                                                  │
│                                                                            │
│ DiligenceClaimsList (accordion by category, citations inline)              │
│ RedFlagsList   FollowUpActionsList                                         │
│                                                                            │
│ MemoPanel (inline preview + "Open in full" → /memos/[id])                  │
│ EntityAdvisoryPanel (if exists; includes human sign-off required callout) │
└────────────────────────────────────────────────────────────────────────────┘
```

### `/skills`

Left rail: SkillsCategoryNav (7 categories). Right pane: grid of SkillCards. Top: SearchInput (client-side filter on title + tags). Each card: title, category, license badge (with SPDX expansion in aria-label), confidence meter, source URL link.

### `/memos/[id]`

Two-column print-optimized layout: MemoBody (markdown rendered) on the left, MemoMetaSidebar (listing summary, score, hard gates, retrieved_at) on the right. Print CSS collapses to single column. PrintButton triggers `window.print()`.

## Component library decisions

- **22 components total** (see JSON `components[]`)
- **20 wrap shadcn primitives** (Card, Table, Badge, Accordion, Alert, Progress, NavigationMenu, ScrollArea, etc.)
- **2 are pure compositions** (StatBlock, RecentActivityFeed) — no new primitives, just layout
- **0 are custom-from-scratch** — every interactive primitive comes from shadcn (and therefore Radix) so we inherit a known-good keyboard + ARIA baseline

Recharts is the only non-shadcn UI dependency. It is intentionally constrained to four chart components (HardGateSummaryChart, DealsDistributionChart, ScoreBreakdownChart, and a thin wrapper for the inline mini-charts on `/`).

## Aesthetic direction (kept short on purpose)

Neutral slate with a single semantic accent (Atlanta-clay terracotta) for primary CTAs. Inter variable, sans-only, tabular numerals on every numeric cell. Compact tables, generous card gutters, dark mode first-class via shadcn theme provider. Voice is operational, not promotional — earn the buyer's trust by showing the math, the sources, and the gaps. No hero copy. No marketing voice. No "AI-aesthetic word soup."

## Motion budget specifics

Library: **Motion** (formerly Framer Motion), only.

| Pattern | Where | Duration | Disabled under reduce |
|---|---|---|---|
| Page-segment fade | App Router transitions | 150ms ease-out | yes |
| Layout reorder (spring) | DealsTable sort | ≤ 220ms (stiffness 300, damping 30) | yes (snap instead) |
| Accordion height | DiligenceClaimsList | 180ms | yes (instant) |
| Card hover border tint | All Card components | 80ms | no (color only, no transform) |
| Filter-chip remove | DealsFilterBar | 150ms | yes |
| Empty-state mount fade | EmptyState | 120ms | yes |

**Forbidden:** parallax, scroll-jacking, count-ups, entrance animations > 250ms, decorative loops, Recharts default animations (`isAnimationActive={false}` everywhere), GSAP, R3F, Spline, Lottie, Rive.

`prefers-reduced-motion: reduce` honored via a single `useReducedMotion()` hook in the root layout that broadcasts to a context consumed by every Motion component. All durations → 0; layout transitions snap; accordions open instantly.

## Accessibility plan (concrete)

1. **Recharts is not accessible by default.** Every chart wrapped in `<figure>` with a one-sentence `<figcaption>`, the SVG carries `role="img"` + descriptive `aria-label`, and a `sr-only` `<table>` sibling renders the same data so screen readers and keyboard-only users get parity. Tooltips are keyboard-reachable via focusable rect overlays on bars/cells.
2. **Color is never load-bearing.** HardGateBadge = color + ✓/✗ icon + 'PASS'/'FAIL' text. ScoreBadge = color band + numeric + band-name in aria-label. StatusBadge = color + status word, always visible.
3. **Tables use real semantics.** `<table>/<thead>/<tbody>/<th scope>`; sortable headers are `<button>` children with `aria-sort`. Filter/sort changes announce via `aria-live="polite"` region: "showing N of M deals".
4. **Keyboard.** Every interactive element Tab-reachable in DOM order. Focus rings always visible (Tailwind `ring-2 ring-offset-2`, never `outline:none` without a replacement). Skip-to-main link first on every page.
5. **Contrast.** Body ≥ 4.5:1; large text ≥ 3:1; UI components ≥ 3:1. Status palette sampled to meet AA on both light and dark.
6. **Empty / loading / error states everywhere.** Loading = skeleton with `role="status"`. Empty = real heading + body + optional CTA. Error = `Alert` with `role="alert"`.
7. **Headings.** One `h1` per route; `h2` for regions; `h3` for cards; no skipping.
8. **Touch targets ≥ 44×44 px** (WCAG 2.5.5 AAA — cheap, take it).
9. **prefers-reduced-motion respected globally**, see motion budget.
10. **Page titles** follow `'<Route> — BQA Dashboard'` so browser history is scannable.

**Skill availability flag:** `web-accessibility` and `web-design-guidelines` Tier-2 skills are documented in `01-Skills/` but not installed in the sandbox session that wrote this plan. Principles applied here are from first-principles WCAG 2.2 + ARIA Authoring Practices Guide. `dashboard-builder` should re-run a lint pass with those skills active locally before declaring GATE 4.

## Build sequence for `dashboard-builder`

1. **Scaffold `apps/dashboard/`** — Next.js 14+/15 App Router, TypeScript strict, Tailwind, shadcn init with neutral base + terracotta accent, dark mode via class strategy.
2. **Wire vault read layer** — server-only utilities that parse frontmatter (gray-matter) and JSON from `obsidian-vault/02-Buyers/`, `03-Deals/`, `01-Skills/`. Typed against the SCHEMAS.md contracts. No write paths.
3. **Build GlobalNav + root layout** — header, dark-mode toggle, skip-to-main, `/portfolio` external link stub, `useReducedMotion` provider.
4. **Build leaf primitives** (Badge family, ScoreBadge, HardGateBadge, StatusBadge, ConfidenceMeter, EmptyState) — these are reused everywhere.
5. **Build `/` (home)** — StatBlock × 4, BuyerCard, DealRibbon, HardGateSummaryChart, RecentActivityFeed. First end-to-end view; validates the data-read layer.
6. **Build `/deals`** — DealsTable + DealsFilterBar + DealsDistributionChart. URL-as-state for filters. Make sure the all-rejected empty state looks intentional.
7. **Build `/deals/[id]`** — all sub-panels with suspense boundaries. BrokerPatternFlag + RetractionNotice tested against L004 (broker pattern) and L007/L008 (retracted) fixtures.
8. **Build `/buyers/[id]`** — read-only panels.
9. **Build `/skills`** — category nav + cards.
10. **Build `/memos/[id]`** — markdown render + print CSS.
11. **A11y pass** — keyboard walkthrough every route; axe-core CI check; Recharts a11y verification with screen reader.
12. **Reduced-motion pass** — flip the OS setting and walk every route.
13. **GATE 4 checklist** before declaring done: lighthouse a11y ≥ 95 on every route; all 6 routes have empty + loading + error states; no Recharts default animations; no GSAP / R3F / Spline / Lottie / Rive imports in `package.json`.

## Known unknowns / open questions for the orchestrator

1. **Single buyer vs. multi-buyer:** today we have buyer-001 only. Plan supports multi-buyer (`/buyers/[id]`) — fine. Do we want a `/buyers` index page? **Recommendation:** skip in v1; the home page's BuyerCard list is enough for n ≤ 5 buyers. Add `/buyers` index if/when n > 5.
2. **Mutation UX:** today the dashboard is read-only — subagents commit to the vault, dashboard re-renders. Does the buyer want any UI-driven action (e.g., "mark this memo as read", "snooze this deal until date X")? **Recommendation:** v1 no; v2 yes via a thin local-state layer that writes a `99-Human/dashboard-state.json` (still respects the human-authored rule because the buyer is the human).
3. **Authentication:** none in v1 (local-first single-user). If the dashboard ever gets deployed publicly, we'll need it — but that's out of scope here.
4. **EntityAdvisory data:** schema exists but no records yet. EntityAdvisoryPanel is built to render the contract; the legal-entity-analyst hasn't run yet. The panel gracefully no-renders when the file is absent.
5. **Real-time refresh:** current plan revalidates on each request. If subagent commits become frequent enough, consider a file-watcher → revalidateTag on the dashboard server. **Recommendation:** defer to post-GATE-4.
6. **Memos folder structure:** RUN-LOG references `03-Deals/memos/draft/` — should `/memos/[id]` read from draft only, or also from a future `published/` subfolder once `vault-librarian` promotes? **Recommendation:** read both; show a "draft" badge when the file path includes `/draft/`.
7. **Tier-2 skill availability:** the orchestrator should confirm whether `web-accessibility` and `web-design-guidelines` are installed locally before `dashboard-builder` starts. If not, the build still proceeds — we just won't get the extra lint pass.

