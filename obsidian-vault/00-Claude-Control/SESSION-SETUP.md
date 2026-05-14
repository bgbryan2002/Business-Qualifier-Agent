---
id: session-setup
title: Session Setup
note_type: validation
category: automation
source_url: internal
source_type: github_repo
license: n/a-public-record
checksum_sha256: pending
confidence: 1.0
citation:
  - kickoff-prompt-section-2
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted
tags: [control, setup, productivity]
---

# Session Setup

Captured productivity choices for this Claude Code session and any future session that resumes against this repo.

## Decisions made for the orchestrator's online session

| Setting | Choice | Rationale |
|---|---|---|
| Output style | Concise (default) — promote to `acquisition-analyst` style locally if needed | Terse, code-first, citation-mandatory |
| Statusline | Reference `ctx %`, branch, dir before any large operation | HUD discipline |
| Context budget | Default model; promote to `opus[1m]` only for long synthesis passes >60% | 1M as afterburner, not cruise |
| Permissions | Sandbox-default (no `--dangerously-skip-permissions`) | Online session safety |
| Auto-commit | `subagent-stop-sync.sh` runs `git add && commit && push upstream <branch>` | Git-first persistence |

## Online-session constraints (this run)

- This sandboxed online environment **cannot** run `npx skills add ...`, install Claude Code plugins from `claude.com/plugins/...`, or modify the user's local `~/.claude/output-styles/`. Those are documented in `USER-SETUP.md` for the human's local terminal.
- `git push origin` (the local proxy at `127.0.0.1`) is reserved for the sandbox harness. Real persistence is `git push upstream <branch>` to `bgbryan2002/Business-Qualifier-Agent`.
- The PAT used in this session is sandbox-local in `.git/config` only. The human is asked in `USER-SETUP.md` to **rotate it** after the session.

## Local resumption (when the human runs Claude Code on their laptop)

See [[USER-SETUP]] for: `cc` alias, `/statusline` invocation, `claude --agent orchestrator` to resume.
