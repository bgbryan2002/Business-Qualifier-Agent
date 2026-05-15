# HANDOFF — resume locally in 5 minutes

> Written at the end of the online session (between GATE 2 and Phase 3). Last pushed commit: see `git log -1` after cloning. This file is the single document you need to resume; everything else is reference.

---

## TL;DR — what to do, in order

```bash
# 1. Clone (replace path with wherever you keep code)
git clone https://github.com/bgbryan2002/Business-Qualifier-Agent.git
cd Business-Qualifier-Agent

# 2. Install Claude Code if you don't have it
#    https://docs.claude.com/en/docs/claude-code/overview
#    Verify:
claude --version

# 3. Add the cc alias (one-time, in ~/.zshrc or ~/.bashrc)
echo "alias cc='claude --dangerously-skip-permissions'" >> ~/.zshrc
source ~/.zshrc

# 4. Launch in this repo
cc
```

That's it. Claude Code reads `CLAUDE.md` from the current working directory automatically — no flags, no config, no "open project" step. The vault, subagents, hooks, and operating rules all cascade from there.

Then in the Claude Code session, just say:

> *"Resume Phase 3. Fabricate 3-5 listings consistent with buyer-001 (Atlanta-metro, semi-absentee-friendly, $250k-$550k, recurring revenue) unless I paste real ones first."*

The orchestrator subagent picks it up.

---

## How the local Claude Code "knows" the project (automatic, no action required)

When you run `cc` in this repo, Claude Code does the following on its own:

1. **Reads `./CLAUDE.md`** (the project-root one I wrote). That file `@`-imports:
   - `./obsidian-vault/00-Claude-Control/VAULT-INDEX.md` (the map)
   - `./obsidian-vault/00-Claude-Control/OPERATING-RULES.md` (the contract)
   - `./obsidian-vault/00-Claude-Control/SCHEMAS.md` (the data contracts)
   - `./obsidian-vault/00-Claude-Control/SESSION-SETUP.md` (productivity choices)
2. **Loads `./.claude/settings.json`** — wires the four hooks (session-start, pre-write-guard, post-write-validate, subagent-stop-sync) and a permissions allowlist
3. **Loads `./.claude/agents/*.md`** — registers all 11 subagents (orchestrator, buyer-profiler, repo-discovery, repo-validator, due-diligence-researcher, acquisition-analyst, legal-entity-analyst, ui-ux-architect, dashboard-builder, portfolio-designer, vault-librarian)
4. **Runs `./.claude/scripts/session-start.sh`** — prints the HUD (branch, SHA, dirty count), verifies vault structure, checks remote reachability

You don't import, you don't configure, you don't point at anything. `cd <repo> && cc` and the project context is loaded. Obsidian is a separate concern — it's for *you* to read/edit notes; it has no relationship to Claude Code.

---

## Critical first actions on your machine (before you start Phase 3)

### 1. Rotate the PAT (5 minutes, do this first)

The PAT you pasted into the online chat (`github_pat_11BFTZ…`) was a small credential leak. Open https://github.com/settings/personal-access-tokens, find **Get-Money**, click **Revoke**.

Your laptop's git will use whatever credential helper you already have (macOS Keychain, Git Credential Manager, `gh auth login`, etc.) for future pushes. No need to generate another PAT unless you don't have one of those set up.

If you don't have a credential helper, easiest path:

```bash
# Recommended: use the gh CLI as your git credential helper
brew install gh   # or: apt install gh / scoop install gh
gh auth login     # walks you through OAuth, way safer than PATs
```

### 2. Install Tier 1 plugins (10 minutes)

Run inside a Claude Code session (or via the plugin CLI if your version supports it):

```
/plugin install superpowers      # plan-before-code, TDD, Socratic specs
/plugin install frontend-design  # production-grade UI generation (Phase 4-5 critical)
/plugin install context7         # live, version-pinned library docs
/plugin install playwright       # browser automation for diligence + screenshots (Phase 3-5 critical)
/plugin install claude-mem       # cross-session memory; restores context when you resume
```

Plus the reference repo (clone but don't install — referenced where helpful):

```bash
git clone https://github.com/affaan-m/everything-claude-code.git ~/everything-claude-code
```

Plugin URLs and rationale: `obsidian-vault/00-Claude-Control/USER-SETUP.md` step 5.

### 3. Productivity setup (2 minutes)

Inside the Claude Code session:

```
/config             # set output style to "Concise"
/statusline         # turn on ctx %, branch, cwd HUD
/model opus         # default model; promote to opus[1m] only for long synthesis passes
```

### 4. Tier 2 skills (install when you actually reach Phase 5, not before)

```bash
npx skills add anthropics/skills@frontend-design
npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max
npx skills add giuseppe-trisciuoglio/developer-kit@shadcn-ui
npx skills add supercent-io/skills-template@web-accessibility
npx skills add vercel-labs/agent-skills@web-design-guidelines
```

---

## Where Phase 3 picks up

The orchestrator's next move when you resume:

1. **Spawn `acquisition-analyst`** to either:
   - Read `inputs/listings.json` if you've put real broker exports there, OR
   - Fabricate 3-5 plausible listings consistent with `buyer-001` (Atlanta-metro service businesses, $250-550k, semi-absentee-friendly, recurring revenue, manager-in-place). Same authorization model you used for Buyer 001.
2. **Normalize each listing** → `ListingPacket` JSON in `obsidian-vault/03-Deals/normalized/`
3. **Spawn `due-diligence-researcher`** per listing → `DueDiligencePacket` in `obsidian-vault/03-Deals/due-diligence/` (uses your local `playwright` plugin for JS-heavy sources)
4. **Compute scores** → `DealAssessment` in `obsidian-vault/03-Deals/scored/`, applying hard gates (target owner profit / financing feasibility / license transferability)
5. **Draft memos** for top deals → `obsidian-vault/03-Deals/memos/`
6. **Spawn `legal-entity-analyst`** for top deals → entity-advisory checklists in `obsidian-vault/05-Validation/signoffs/`
7. Auto-commit + push at each step (the `SubagentStop` hook handles this)

At GATE 3, orchestrator presents the top 5 deals with scores, top risks, top follow-ups, and asks: "Build the operational dashboard and the showcase portfolio?"

---

## Open questions you should answer before Phase 3 scoring is trustworthy

From the Buyer 001 summary (`obsidian-vault/02-Buyers/profiles/buyer-001.md`):

1. **Lender pre-qualification.** Has the buyer pinged an SBA preferred lender about the thin-W2 issue? Flips `financing_feasibility` from `unknown` → `pass`/`fail`. *Suggested action: even a 10-minute call with SmartBiz, Live Oak, or Huntington can change everything.*
2. **Parental cosigner / guaranty available?** If yes, expands borrowing_capacity and softens the W-2 flag.
3. **Exit-from-consulting trigger.** What concrete event prompts leaving Big 4? Affects how aggressive scoring should be on speed-to-target-profit vs. patient-equity.
4. **Bandwidth in first 90 days.** Is the 12 hrs/wk a hard cap, or can the first 90 days post-close be ~20 hrs/wk?
5. **Geography flexibility.** Is the 45-min commute strictly from parents' Atlanta address, or open if a strong deal lives in Chattanooga / Birmingham / Greenville?

If you don't answer these, the orchestrator will fabricate defaults consistent with the existing profile (just like it did with the buyer interview) and surface them as flags at GATE 3.

---

## Current state at hand-off

- **Phases complete:** 0 (Bootstrap), 1 (Buyer Profile), 2 (Skill Discovery + Tier 2 Documentation)
- **Skill catalog:** 26 validated candidates across 5 categories, 0 rejected. Plus 6 Tier-1/2 reference docs. See `obsidian-vault/01-Skills/`.
- **Buyer 001:** committed at `obsidian-vault/02-Buyers/profiles/buyer-001.{json,md}`. Specifics were fabricated under your explicit "make up answers" directive; the real constraints (recent grad, Big 4 6mo, lives at home, new car loan, loan-leveraged strategy) are honored.
- **Subagent fleet:** 11 definitions live, hooks wired, control plane scripted.
- **Both remotes synced:** `upstream` = `bgbryan2002/Business-Qualifier-Agent`, `origin` = `bbt-technology/Business-Qualifier` (sandbox proxy; only matters during this online run).

---

## File-map reference (where things live)

```
.
├── CLAUDE.md                                  # thin index, auto-read by Claude Code
├── OBSIDIAN-OPEN-ME.md                        # how to open the vault in Obsidian
├── HANDOFF.md                                 # this file
├── RUN-LOG.md                                 # narrative log per phase
├── .claude/
│   ├── settings.json                          # hook wiring + permissions allowlist
│   ├── bootstrap-agents.json                  # registers the 11 subagents on session start
│   ├── agents/                                # 11 subagent definition files (.md)
│   └── scripts/                               # 4 hook scripts (session-start, pre-write-guard, post-write-validate, subagent-stop-sync)
├── apps/                                      # empty; Phase 4 + 5 will fill in
├── inputs/                                    # broker exports / listings.json go here
└── obsidian-vault/
    ├── 00-Claude-Control/                     # the operating-rules / schemas / setup / changelog
    ├── 01-Skills/                             # 36 skill notes (26 validated + 10 Tier-1/2 docs)
    ├── 02-Buyers/                             # Buyer 001 profile + interview
    ├── 03-Deals/                              # populated in Phase 3
    ├── 04-Dashboard/                          # populated in Phase 4
    ├── 05-Validation/                         # source-manifests/, signoffs/
    ├── 06-Portfolio/                          # populated in Phase 5
    └── 99-Human/                              # YOUR sovereign space — subagents will never write here
```

---

## Cockpit shortcuts (Claude Code TUI)

| Action | Keys |
|---|---|
| Stop me | `Esc` |
| Rewind one turn | `Esc Esc` |
| Stash a draft prompt | `Ctrl+S` |
| Background me while you plan | `Ctrl+B` |
| Side question (off main thread) | `/btw <question>` |

---

## What's *different* about resuming locally vs. continuing here

Things that get **better** locally:

- `playwright` plugin → real browser for diligence (state SoS portals, court records, BBB)
- `frontend-design` + `UI-UX-Pro-Max` skills → portfolio doesn't look like an AI default
- Real browser preview → you can actually *see* Phase 4 (dashboard) and Phase 5 (portfolio) as they're built
- `claude-mem` → continuity across sessions
- No 529 retries
- `WebSearch` (real search-engine queries) in addition to `WebFetch`

Things that **stay the same**:

- Subagent definitions, hooks, schemas — they came with the repo
- Operating rules, validation contract, vault structure
- `git push` is still the only real save (your local repo is just another worktree)

Things that are *only* sandbox-specific (you can ignore them locally):

- The `origin` proxy remote (`bbt-technology/...`) — it only exists in this sandbox
- The PAT-embedded `upstream` URL — your local git will use your own credential helper

---

## If you get stuck

1. Read `RUN-LOG.md` for the narrative of what happened.
2. Open `obsidian-vault/00-Claude-Control/VAULT-INDEX.md` for the map.
3. Open `obsidian-vault/00-Claude-Control/USER-SETUP.md` for the local-machine playbook (more detailed than this HANDOFF, but redundant — start here, not there).
4. In a Claude Code session, just ask the orchestrator: *"Where are we, what's pending, what's next?"* — it'll read `RUN-LOG.md` + `VAULT-INDEX.md` and tell you.

Good luck.
