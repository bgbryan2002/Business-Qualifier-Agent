# SMB Acquisition Intelligence Platform — Project-Root Operating Rules

> **Detail lives in the vault.** This file is a thin index. The real rules, schemas, and per-agent contracts live in `obsidian-vault/00-Claude-Control/`.

@./obsidian-vault/00-Claude-Control/VAULT-INDEX.md
@./obsidian-vault/00-Claude-Control/OPERATING-RULES.md
@./obsidian-vault/00-Claude-Control/SCHEMAS.md
@./obsidian-vault/00-Claude-Control/SESSION-SETUP.md

---

## Mission (one sentence)

Build a Claude-driven workspace that profiles a buyer, researches and scores SMB acquisition opportunities, and emits two final artifacts: a working Next.js dashboard for navigation/operation, and a beautifully designed, animated portfolio that presents the top recommended businesses for this specific buyer.

## Hard rails (non-negotiable)

1. **One agent the human talks to.** The orchestrator. Subagents do the work; the orchestrator summarizes and presents.
2. **Git-first persistence.** `git push upstream <branch>` is the only real save. Sandbox is ephemeral.
3. **Vault-first knowledge.** Code without a vault note is incomplete.
4. **Buyer-first scoring.** No `DealAssessment` without a `BuyerProfile`.
5. **Workflow-opinionated, never legally / fiscally opinionated.** Entity, tax, structure → `05-Validation/signoffs/` for human CPA / attorney sign-off.
6. **Fail closed.** No license + no checksum + weak provenance = vault rejection.
7. **Two research lanes.** Lane A (`repo-discovery`) for tooling. Lane B (`due-diligence-researcher`) for target businesses. Different rules, different sources, different output paths.
8. **Human-authored notes are sovereign.** `99-Human/` and any `#human-authored` note: subagents read but never write.

## Phase plan (gates only)

- **Phase 0 — Bootstrap** → `[GATE 0]` ← *we are here at the moment of gating*
- **Phase 1 — Buyer profile** → `[GATE 1]`
- **Phase 2 — Skill discovery + UI tooling** → `[GATE 2]`
- **Phase 3 — Deal ingestion + due diligence + scoring** → `[GATE 3]`
- **Phase 4 — Operational dashboard** → `[GATE 4]`
- **Phase 5 — Portfolio (showcase)** → `[GATE 5]`

Detail per phase: see `obsidian-vault/00-Claude-Control/OPERATING-RULES.md` and the kickoff brief.

## Subagent fleet

Definitions live in `.claude/agents/`. The orchestrator routes work to: `buyer-profiler`, `repo-discovery`, `repo-validator`, `due-diligence-researcher`, `acquisition-analyst`, `legal-entity-analyst`, `ui-ux-architect`, `dashboard-builder`, `portfolio-designer`, `vault-librarian`.

## Hooks (the control plane)

`.claude/settings.json` wires:
- `SessionStart` → print HUD, verify vault, verify git remote, list pending validations
- `PreToolUse(Write|Edit)` → reject writes outside `obsidian-vault/`, `apps/`, `.claude/`; reject any write inside `99-Human/` or any `#human-authored` note
- `PostToolUse(Write|Edit)` → validate YAML frontmatter, append `CHANGELOG.md`, `git add`
- `SubagentStop` → flush pending writes, refresh `VAULT-INDEX.md`, `git commit && git push upstream <branch>`

## Repo layout

```
.
├── CLAUDE.md                                   # this file (thin)
├── OBSIDIAN-OPEN-ME.md                         # how the human opens the vault locally
├── RUN-LOG.md                                  # narrative log per phase
├── HANDOFF.md                                  # written at GATE 5 (or earlier on `local`)
├── .claude/
│   ├── settings.json
│   ├── bootstrap-agents.json
│   ├── agents/                                 # 11 subagent definitions
│   └── scripts/                                # 4 hook scripts
├── apps/                                       # Phase 4 + 5 Next.js apps
│   ├── dashboard/
│   └── portfolio/
├── inputs/                                     # broker exports, user uploads, listings.json
└── obsidian-vault/
    ├── 00-Claude-Control/
    ├── 01-Skills/
    ├── 02-Buyers/
    ├── 03-Deals/
    ├── 04-Dashboard/
    ├── 05-Validation/
    ├── 06-Portfolio/
    └── 99-Human/                               # off-limits to subagents
```

## When in doubt

- **Routing:** see [[VAULT-INDEX]]
- **Schema:** see [[SCHEMAS]]
- **Allowed sources, blocks, lanes:** see [[OPERATING-RULES]]
- **How to resume locally:** see [[USER-SETUP]]
