---
id: skill-ui-ux-pro-max
title: UI-UX-Pro-Max (Tier-2 skill)
note_type: skill
category: ui
source_url: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
source_repo: nextlevelbuilder/ui-ux-pro-max-skill
source_type: github_repo
license: unverified
checksum_sha256: pending-local-install
confidence: 0.7
citation:
  - https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted-with-flags
tags: [skill, ui, design, tier-2]
---

# UI-UX-Pro-Max

Real design thinking: hierarchy, color psychology, interaction patterns. Phase 5 portfolio aesthetic depends on this skill to force a *direction*, not a React-default safe aesthetic.

## Why we use it

- Without it, AI-generated UI tends to converge on the same "shadcn-default + slight color tweak" look
- This skill pushes the model to commit to a typographic system, a palette with rationale, and a motion language
- Pairs with `frontend-design` plugin for execution

## How subagents invoke it

- `ui-ux-architect` (Phase 5): primary user. `PortfolioPlan.aesthetic_direction` must come from a UI-UX-Pro-Max-driven session, not from defaults.
- `dashboard-builder` (Phase 4): secondary use. The dashboard is utilitarian, so this skill informs hierarchy and density choices but doesn't drive an "aesthetic statement."

## Install (local)

```bash
npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max
```

Cannot be installed from the orchestrator's online sandbox — see `00-Claude-Control/USER-SETUP.md` step 6.

## License flag

Not yet verified. Re-validate after local install: check the repo's LICENSE file (`cat ~/.claude/skills/ui-ux-pro-max/LICENSE`) and update this note's frontmatter `license:` field accordingly.
