---
id: skill-web-design-guidelines
title: web-design-guidelines (Tier-2 skill)
note_type: skill
category: ui
source_url: https://github.com/vercel-labs/agent-skills
source_repo: vercel-labs/agent-skills
source_type: github_repo
license: unverified
checksum_sha256: pending-local-install
confidence: 0.75
citation:
  - https://github.com/vercel-labs/agent-skills
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted-with-flags
tags: [skill, ui, design-system, quality, tier-2]
---

# web-design-guidelines

Always-on quality checker for spacing, typography, hierarchy, and interaction patterns. Authored by Vercel Labs — opinionated about what "production-grade" looks like in Next.js + Tailwind apps.

## Why we use it

- The dashboard tends to drift toward dense-utilitarian if no one is watching spacing
- The portfolio tends to drift toward over-decorated if no one is watching restraint
- This skill is the "design QA" voice on both apps

## How subagents invoke it

Standard pattern (both `dashboard-builder` and `portfolio-designer`):

```
Before finalizing a page, run a `web-design-guidelines` pass on it.
Specifically flag: inconsistent spacing scale, font-size scale violations,
weight-pair mismatches, button-hierarchy ambiguity, contrast issues,
and overuse of decorative effects.
```

## Install (local)

```bash
npx skills add vercel-labs/agent-skills@web-design-guidelines
```

## License flag

Vercel Labs typically Apache-2.0 / MIT, but unverified at write time. Re-validate after local install.

## Specific checks this skill enforces (per Vercel's published guidelines)

- 4 / 8 / 16 / 24 / 32 / 48 / 64 px spacing scale (Tailwind defaults)
- Maximum 3 font weights per surface
- 1 hero CTA, 1 secondary CTA — no ambiguous tertiary CTAs competing for attention
- Buttons sized consistently within a hierarchy (no random ad-hoc sizes)
- Color tokens, not hex literals, in component code
