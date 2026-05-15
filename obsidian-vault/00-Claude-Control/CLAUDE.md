---
id: vault-claude-md
title: Vault-scoped Operating Rules for Claude
note_type: validation
category: automation
source_url: internal
source_type: github_repo
license: n/a-public-record
checksum_sha256: pending
confidence: 1.0
citation:
  - kickoff-prompt-section-5d
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted
tags: [control, operating-rules]
---

# Vault-scoped Operating Rules

This file is `@`-imported from the project-root `CLAUDE.md`. It is the source of truth for any Claude session working inside this vault.

## Hard rules

1. **Vault-first knowledge model.** Every durable fact lands as a `.md` note in this vault with the YAML frontmatter defined in `SCHEMAS.md`. Code without a vault note is incomplete.
2. **Buyer-first scoring.** Never score a deal without a `BuyerProfile` unless the human explicitly says "buyer-agnostic screen."
3. **Workflow-opinionated, never legally or fiscally opinionated.** Entity, tax, and deal-structure outputs route to a human CPA / attorney via `05-Validation/signoffs/` checklists. SBA / IRS reference docs are baselines, not advice.
4. **Fail closed.** No license + no checksum + weak provenance = no vault entry. Reject to `05-Validation/source-manifests/REJECTED.md` instead.
5. **Two research lanes.** Skill/tooling research goes through `repo-discovery` (Lane A). Target-business diligence goes through `due-diligence-researcher` (Lane B). Different rules; see `OPERATING-RULES.md` §"Research lanes."
6. **Human-authored notes are sovereign.** See §"Human-authored notes" in `OPERATING-RULES.md`. The folder `99-Human/` and any note tagged `#human-authored` are read-only to subagents.
7. **Git-first persistence.** Every meaningful step ends in a `git add && git commit && git push upstream <branch>`. The session is ephemeral; only `git push` is a real save.

## Routing

- Buyer interview → `buyer-profiler` → `02-Buyers/`
- Skill discovery → `repo-discovery` → `repo-validator` → `vault-librarian` → `01-Skills/`
- Target research → `due-diligence-researcher` → `03-Deals/due-diligence/`
- Deal scoring + memos → `acquisition-analyst` → `03-Deals/{normalized,scored,memos}/`
- Entity / structure framing → `legal-entity-analyst` → `05-Validation/signoffs/`
- Dashboard plan + build → `ui-ux-architect` → `dashboard-builder` → `apps/dashboard/`
- Portfolio plan + build → `ui-ux-architect` → `portfolio-designer` → `apps/portfolio/`
- All vault writes → `vault-librarian` (sole writer for index + changelog + commit)

## Quality bars (non-negotiable)

- YAML frontmatter on every external artifact, validated by `post-write-validate.sh`
- Every diligence claim cites `source_url` + `retrieved_at`
- No marketplace scraping; importer-only ingestion until legal review (Phase 6+)
- No personal-life snooping on owners; business-operator track record only
- `apps/dashboard/` stays utilitarian; heavy motion / 3D lives in `apps/portfolio/`
