---
id: skill-frontend-design
title: Frontend-Design (Claude Code plugin + skill)
note_type: skill
category: ui
source_url: https://claude.com/plugins/frontend-design
source_repo: anthropics/skills
source_type: official_docs
license: unverified
checksum_sha256: pending-local-install
confidence: 0.85
citation:
  - https://claude.com/plugins/frontend-design
  - npm:anthropics/skills@frontend-design
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted-with-flags
tags: [skill, plugin, ui, design, tier-1, tier-2]
---

# Frontend-Design

Distinctive, production-grade UI generation. Heavy use in Phase 5 (Portfolio) and supporting role in Phase 4 (Dashboard).

## Why we use it

- Generates UI that doesn't read as "AI default React template"
- Strong opinions about hierarchy, spacing, typography pairing
- Component output is shadcn-compatible and Tailwind-clean
- Pairs with `UI-UX-Pro-Max` skill for design rationale

## How subagents invoke it

- `ui-ux-architect`: produces the `DashboardPlan` and `PortfolioPlan` artifacts using its design vocabulary
- `dashboard-builder`: generates utilitarian-but-clean layouts for `/`, `/buyers/[id]`, `/deals`, `/deals/[id]`, `/skills`, `/memos/[id]`
- `portfolio-designer`: generates the showcase narrative (hero, buyer thesis, business cards, comparison grid)

## Two-tier install

- **Tier 1 (plugin)**: install via `/plugin install frontend-design` for in-session UI generation
- **Tier 2 (skill)**: install via `npx skills add anthropics/skills@frontend-design` for skill-style invocation

## License flag

Skill is from Anthropic's repo (likely Apache 2.0 / MIT). Plugin license not yet verified. Re-validate after local install.
