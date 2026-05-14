---
id: vault-index
title: Vault Index
note_type: validation
category: automation
source_url: internal
source_type: github_repo
license: n/a-public-record
checksum_sha256: pending
confidence: 1.0
citation:
  - kickoff-prompt-section-5b
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted
tags: [control, index]
---

# Vault Index

Auto-maintained by `vault-librarian` after every write. If you're reading this on day 1, most folders are scaffolding only — content lands as the phases run.

## Top-level map

| Folder | Purpose | Owner agent |
|---|---|---|
| `00-Claude-Control/` | Operating rules, schemas, changelog, setup notes | `vault-librarian` |
| `01-Skills/` | Validated tools, libraries, plugins, reusable prompt patterns | `repo-discovery` → `repo-validator` |
| `02-Buyers/` | Interview transcripts + structured `BuyerProfile` JSON | `buyer-profiler` |
| `03-Deals/` | Normalized listings, scored deals, memos, due-diligence packets | `acquisition-analyst` + `due-diligence-researcher` |
| `04-Dashboard/` | Plans + screenshots for the operational `apps/dashboard/` | `ui-ux-architect` + `dashboard-builder` |
| `05-Validation/` | Source manifests, sign-off checklists, rejected sources | `repo-validator` + `legal-entity-analyst` |
| `06-Portfolio/` | Plans, drafts, published screenshots for `apps/portfolio/` | `ui-ux-architect` + `portfolio-designer` |
| `99-Human/` | **Human-authored, off-limits to subagents.** Read-only input. | human only |

## Quick links

- Operating rules → [[OPERATING-RULES]]
- Schemas (BuyerProfile, DealAssessment, etc.) → [[SCHEMAS]]
- Changelog (auto-appended) → [[CHANGELOG]]
- Session productivity setup → [[SESSION-SETUP]]
- Local-terminal setup for the human → [[USER-SETUP]]
- How to open this vault in Obsidian → [[OBSIDIAN-SETUP]]
- Run log (root) → `../../RUN-LOG.md`

## Note counts

Refreshed by `vault-librarian` on each write. Initial values are zero or scaffold-only.

| Section | Notes | Validated sources |
|---|---|---|
| 00-Claude-Control | 8 | n/a |
| 01-Skills | 6 (Tier 1 plugins, documented) | 6 |
| 02-Buyers | 0 | 0 |
| 03-Deals | 0 | 0 |
| 04-Dashboard | 0 | 0 |
| 05-Validation | 0 | 0 |
| 06-Portfolio | 0 | 0 |
| 99-Human | 1 (README) | n/a |
