---
id: skill-context7
title: Context7 (Claude Code plugin)
note_type: skill
category: research
source_url: https://claude.com/plugins/context7
source_repo: upstash/context7
source_type: official_docs
license: unverified
checksum_sha256: pending-local-install
confidence: 0.9
citation:
  - https://claude.com/plugins/context7
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted-with-flags
tags: [skill, plugin, research, docs, tier-1]
---

# Context7

Live, version-specific docs for every library. Eliminates stale-API hallucinations.

## Why we use it

- Next.js, Tailwind, shadcn/ui, Motion, R3F, GSAP all evolve fast; their training-time docs go stale within months
- Before any meaningful code write involving a library, query context7 for the version-pinned API
- Especially important for: Motion (frequent breaking changes), R3F + Drei (composability gotchas), shadcn/ui (component variants)

## How subagents invoke it

Standard pattern (all UI/code agents):

```
Before writing code that uses <library>, query context7 for the docs of <library>@<version-from-package.json>.
Cite the doc URLs in code comments only when the API is non-obvious.
```

`dashboard-builder`, `portfolio-designer`, and `repo-discovery` all rely on this.

## Online-session note

Sandbox cannot install plugins. Documented here for the human's local install.

## License flag

License not yet verified.
