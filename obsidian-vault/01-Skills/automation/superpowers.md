---
id: skill-superpowers
title: Superpowers (Claude Code plugin)
note_type: skill
category: automation
source_url: https://claude.com/plugins/superpowers
source_repo: anthropic-marketplace/superpowers
source_type: official_docs
license: unverified
checksum_sha256: pending-local-install
confidence: 0.85
citation:
  - https://claude.com/plugins/superpowers
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted-with-flags
tags: [skill, plugin, planning, tdd, tier-1]
---

# Superpowers

Forces plan-before-code, TDD, four-phase debugging, Socratic spec sessions. The default planning loop for every non-trivial subagent task.

## Why we use it

- Pre-implementation: enforces a written plan that the human can sanity-check at each gate
- During implementation: enforces test-first discipline, reducing "looks-right" hallucinations
- Debugging: four-phase loop (reproduce → isolate → fix → regression test) keeps fixes from masking root causes
- Socratic specs: when a buyer interview or deal memo needs clarification, surfaces the questions instead of guessing

## How subagents invoke it

In Claude Code, with the plugin installed, subagents implicitly run their default workflow under Superpowers. No explicit invocation needed for most tasks. For an explicit Socratic spec session, the agent prefixes its turn with "Spec session:" and lets Superpowers drive question rounds.

## Online-session note

This note is documentation only. The actual plugin must be installed by the human in their **local** Claude Code (see `00-Claude-Control/USER-SETUP.md` step 5). The orchestrator's online sandboxed session cannot install plugins.

## License flag

License not yet verified. Status `accepted-with-flags`. Re-validate after local install: `git -C ~/.claude/plugins/superpowers log --pretty=oneline | head -1` and check repo LICENSE file.
