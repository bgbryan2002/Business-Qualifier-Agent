---
id: skill-web-accessibility
title: web-accessibility (Tier-2 skill)
note_type: skill
category: ui
source_url: https://github.com/supercent-io/skills-template
source_repo: supercent-io/skills-template
source_type: github_repo
license: unverified
checksum_sha256: pending-local-install
confidence: 0.7
citation:
  - https://github.com/supercent-io/skills-template
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted-with-flags
tags: [skill, ui, accessibility, wcag, tier-2]
---

# web-accessibility

WCAG-compliant generation from day one. Used as a lint pass on every dashboard and portfolio surface.

## Why we use it

- The dashboard has data tables, filters, charts — all of which need ARIA roles, keyboard nav, focus management
- The portfolio uses heavy motion / 3D — risks failing `prefers-reduced-motion` and color-contrast checks
- This skill catches both classes of issue before they ship

## How subagents invoke it

- `dashboard-builder`: lint pass after each route is scaffolded. Required to pass before Gate 4 screenshots.
- `portfolio-designer`: lint pass with attention to `prefers-reduced-motion` fallbacks and contrast on text-over-3D-scene compositions. Required before Gate 5.
- `ui-ux-architect`: read during plan authoring so accessibility constraints are baked into the IA, not bolted on.

## Install (local)

```bash
npx skills add supercent-io/skills-template@web-accessibility
```

## License flag

Not yet verified. Re-validate after local install.

## WCAG minimums for this project

- Color contrast: AA (4.5:1 normal text, 3:1 large)
- Keyboard: full navigation without mouse
- `prefers-reduced-motion`: every animation has a static / minimal-motion fallback
- Screen reader: every interactive element has a meaningful accessible name
- Focus: visible focus indicators, no `outline: none` without replacement
