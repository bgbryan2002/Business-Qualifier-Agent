---
id: user-setup
title: Local Terminal Setup for the Human
note_type: validation
category: automation
source_url: internal
source_type: github_repo
license: n/a-public-record
checksum_sha256: pending
confidence: 1.0
citation:
  - kickoff-prompt-section-2
  - kickoff-prompt-section-3
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted
tags: [control, setup, human]
---

# Local Terminal Setup

How to run Claude Code on this repo from your laptop. The online session built the scaffolding; everything below is what *you* do once to make local sessions feel right.

> **Rotate the PAT first.** The PAT you pasted into the online chat (`github_pat_11BFTZ…`) was a small leak. Open https://github.com/settings/personal-access-tokens, click that token, **Revoke**, and generate a fresh one (same Contents: Read/Write scope on `Business-Qualifier-Agent`). Future pushes from your laptop will use your local git credentials, not that token.

## 1. Clone the repo

```bash
git clone https://github.com/bgbryan2002/Business-Qualifier-Agent.git
cd Business-Qualifier-Agent
```

## 2. Install Claude Code (if you haven't already)

Follow https://docs.claude.com/en/docs/claude-code/overview. Verify with `claude --version`.

## 3. Add the `cc` alias for permissionless local Claude Code

Append to `~/.zshrc` or `~/.bashrc`:

```bash
alias cc='claude --dangerously-skip-permissions'
```

Then `source ~/.zshrc` (or `~/.bashrc`). Now `cc` launches Claude Code without permission prompts. **Use this only on machines you fully trust** — it skips per-tool confirmations.

> The online session deliberately did **not** use `--dangerously-skip-permissions`. That flag is for your local machine only.

## 4. Productivity setup

Run these inside Claude Code once after launching `cc` in the repo root:

```
/config             # set output style to "Concise" (or import a custom acquisition-analyst style if you've authored one)
/statusline         # show ctx %, branch, working dir HUD
/model opus         # default model
                    # Switch to opus[1m] only for long synthesis passes (>60% ctx)
```

To author a custom output style locally, drop it under `~/.claude/output-styles/acquisition-analyst.md` (see Anthropic docs for format).

## 5. Install Tier 1 plugins

The online session documented these in `01-Skills/` but **could not** actually install plugins into your local CLI. Run these on your laptop:

```bash
# In a Claude Code session (or via CLI if your version supports it)
/plugin install superpowers          # plan-before-code, TDD, Socratic specs
/plugin install frontend-design      # production-grade UI generation
/plugin install context7             # live, version-specific library docs
/plugin install playwright           # browser automation, screenshots
/plugin install claude-mem           # cross-session memory (critical for resumption)
# Reference repo (clone alongside, don't install as plugin):
git clone https://github.com/affaan-m/everything-claude-code.git ~/everything-claude-code
```

Plugin marketplace URLs (in case the slash commands aren't available in your version):

| Plugin | URL |
|---|---|
| superpowers | https://claude.com/plugins/superpowers |
| frontend-design | https://claude.com/plugins/frontend-design |
| context7 | https://claude.com/plugins/context7 |
| playwright | https://claude.com/plugins/playwright |
| claude-mem | https://github.com/thedotmack/claude-mem |
| everything-claude-code | https://github.com/affaan-m/everything-claude-code |

## 6. Install Tier 2 skills (when you reach Phase 2 / Phase 5)

```bash
npx skills add anthropics/skills@frontend-design
npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max
npx skills add giuseppe-trisciuoglio/developer-kit@shadcn-ui
npx skills add supercent-io/skills-template@web-accessibility
npx skills add vercel-labs/agent-skills@web-design-guidelines
# Emil Kowalski motion patterns: ingest as vault skill note (no npm package; reference his published patterns)
```

## 7. Tier 3 (Phase 3+)

```bash
git clone https://github.com/browser-use/browser-use.git ~/browser-use   # heavier diligence automation
git clone https://github.com/czlonkowski/n8n-mcp.git                     # only if you run n8n
/plugin install ralph-loop                                               # iterative scoring tuning
# blender-mcp: optional, only if portfolio hero needs custom 3D
```

## 8. Resume the orchestrator

```bash
cd Business-Qualifier-Agent
cc                                   # launches Claude Code with permissionless mode
# Then in Claude:
claude --agent orchestrator          # resumes me with full subagent fleet
```

Or just open the repo in `cc` and say "Resume Phase X" — `claude-mem` will restore session continuity if installed.

## 9. Your sovereign space

Anything you write in `obsidian-vault/99-Human/` or any note tagged `#human-authored` is **off-limits to my subagents**. They won't modify, rename, move, or delete it. They will read it (treat it as input) and cite it when they use it. If they think you should change something there, they'll drop a new file in `99-Human/suggestions/` and leave your original alone.

## 10. Cockpit shortcuts (Claude Code TUI)

| Action | Keys |
|---|---|
| Stop me | `Esc` |
| Rewind one turn | `Esc Esc` |
| Stash a draft prompt | `Ctrl+S` |
| Background me while you plan | `Ctrl+B` |
| Side question (off main thread) | `/btw <question>` |

## 11. Open the vault in Obsidian

See [[OBSIDIAN-SETUP]] (same content as `OBSIDIAN-OPEN-ME.md` at repo root).
