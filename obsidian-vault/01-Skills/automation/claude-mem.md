---
id: skill-claude-mem
title: claude-mem (Claude Code plugin)
note_type: skill
category: automation
source_url: https://github.com/thedotmack/claude-mem
source_repo: thedotmack/claude-mem
source_type: github_repo
license: unverified
checksum_sha256: pending-local-install
confidence: 0.8
citation:
  - https://github.com/thedotmack/claude-mem
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted-with-flags
tags: [skill, plugin, memory, persistence, tier-1]
---

# claude-mem

Persistent memory across sessions. Critical because the human will pull this project into a local terminal — `claude-mem` keeps continuity so we don't lose context between online and local sessions.

## Why we use it

- The orchestrator's online session ends; the human resumes locally days later
- Without `claude-mem`, the local session starts cold and has to re-read the whole vault
- With `claude-mem`, summarized session memory transfers, and the orchestrator picks up at the right gate

## Local-only

Only takes effect after the human installs it locally (`USER-SETUP.md` step 5). The online session writes to the vault and `RUN-LOG.md` instead — those serve as the durable, machine-independent memory.

## License flag

License not yet verified at the source repo. `accepted-with-flags`.
