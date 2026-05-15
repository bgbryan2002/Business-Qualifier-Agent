---
id: skill-emil-kowalski-motion
title: Emil Kowalski Motion Patterns (reference)
note_type: skill
category: animation
source_url: https://emilkowal.ski
source_repo: emilkowalski/motion-primitives
source_type: official_docs
license: reference-only
checksum_sha256: n/a-reference
confidence: 0.85
citation:
  - https://emilkowal.ski
  - https://github.com/emilkowalski
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted-with-flags
tags: [skill, animation, motion, reference, tier-2]
---

# Emil Kowalski Motion Patterns

Production-quality motion vocabulary for the Motion library. **Not a code dependency** — a reference vocabulary of patterns we ingest as skill notes and reimplement in our codebase.

## Why we use it

- Most "motion in React" examples are either too restrained (Material Design timings everywhere) or too maximalist (every component animates everything constantly)
- Emil's published work sits in the middle: motion only where it confirms an action, communicates state, or rewards attention
- Particularly strong on: drawer/sheet transitions, list-reorder choreography, modal/popover entrance + exit, scroll-driven progressive disclosure

## How subagents invoke it

- `portfolio-designer`: primary reference. The Phase-5 narrative cadence (hero → buyer thesis → top deals → comparison → next steps) should feel like a designed scroll experience, not a series of independent animated cards. Emil's scroll patterns are the closest published vocabulary.
- `ui-ux-architect`: cited in `PortfolioPlan.motion_budget` when justifying which surfaces get heavier motion and which get default.
- `dashboard-builder`: minor use — only for drawer/sheet/popover transitions, not full timelines.

## Ingestion plan

This skill note is a pointer. The actual patterns get ingested during Phase 5 as small standalone notes under `01-Skills/animation/patterns/<pattern-name>.md`, each with:

- A description of when to use it
- The Motion API surface it uses (variants, transitions, layout animations, gesture handlers)
- Notes on prefers-reduced-motion fallback
- An accessibility note (focus management during transitions)

## License flag

`license: reference-only` — Emil's work is published as articles + open-source companion repos. We do not vendor his code; we cite his patterns and re-implement. If we later choose to vendor `emilkowalski/motion-primitives` or similar, re-validate the LICENSE file and update this note.
