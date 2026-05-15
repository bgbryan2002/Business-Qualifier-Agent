---
id: skill-everything-claude-code
title: everything-claude-code (performance harness)
note_type: skill
category: automation
source_url: https://github.com/affaan-m/everything-claude-code
source_repo: affaan-m/everything-claude-code
source_type: github_repo
license: unverified
checksum_sha256: pending-local-install
confidence: 0.7
citation:
  - https://github.com/affaan-m/everything-claude-code
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted-with-flags
tags: [skill, harness, meta-config, tier-1]
---

# everything-claude-code

Performance harness: skills, instincts, memory, security, research-first development. Meta-config layer that sits above the rest of the toolset.

## Why we use it

- Provides a baseline of "good defaults" so we're not reinventing every config
- Curated set of instincts (e.g. "always read context7 before writing library code") that pair with our subagent definitions
- Security guardrails compatible with our fail-closed validation contract

## How we use it

This is a **reference repo**, not a plugin. The human clones it alongside the project:

```bash
git clone https://github.com/affaan-m/everything-claude-code.git ~/everything-claude-code
```

Then the orchestrator (locally) `@`-imports relevant pieces into `.claude/` settings or subagent definitions on a case-by-case basis. We do not vendor it whole.

## License flag

License not yet verified. Re-validate after local clone.
