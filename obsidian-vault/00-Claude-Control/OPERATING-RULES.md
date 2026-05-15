---
id: operating-rules
title: Operating Rules
note_type: validation
category: automation
source_url: internal
source_type: github_repo
license: n/a-public-record
checksum_sha256: pending
confidence: 1.0
citation:
  - kickoff-prompt-section-7
  - kickoff-prompt-section-10
  - kickoff-prompt-section-10a
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted
tags: [control, operating-rules, validation]
---

# Operating Rules

These rules are non-negotiable. The `pre-write-guard.sh` and `post-write-validate.sh` hooks enforce them at write time.

## 1. Validation contract (frontmatter)

Every external artifact in `obsidian-vault/` outside `99-Human/` must include the YAML frontmatter defined in [[SCHEMAS#frontmatter-contract]]. Fields:

```
id, title, note_type, category, source_url, source_type, license,
checksum_sha256, confidence, citation, as_of_date, validator_id, status, tags
```

Reject if:
- `license` is missing or empty (skill notes only — not required for internal control files)
- Source non-canonical (random blog ≠ official docs unless cited as such)
- `checksum_sha256` collides with a different artifact without a `CHANGELOG.md` entry
- `confidence` not a number in [0, 1]

## 2. Vault write policy

- **Sole writer:** `vault-librarian`. All other agents propose; `vault-librarian` writes, indexes, and commits.
- **Path discipline:** writes are confined to `obsidian-vault/`, `apps/`, `.claude/`, and root-level `*.md` config files.
- **Atomic writes:** every write triggers `post-write-validate.sh`, which appends a `CHANGELOG.md` line and `git add`s the path.
- **Subagent stop:** `subagent-stop-sync.sh` flushes pending writes, refreshes `VAULT-INDEX.md`, runs `git commit && git push upstream <branch>`.

## 3. Research lanes

### Lane A — Skill / tooling research (`repo-discovery`)
- Sources: official docs, canonical GitHub repos, package registries (npm, PyPI), Anthropic plugin directory, `context7` plugin
- Output: `SkillCandidate` records → `repo-validator` → either `01-Skills/<category>/` or `05-Validation/source-manifests/REJECTED.md`

### Lane B — Due-diligence research + listing discovery (`due-diligence-researcher`)
- Whitelist: business registries (SoS, county clerk, IRS public records, OSHA, EPA), court records (PACER, state portals), BBB / Yelp / Google Maps / Trustpilot / Glassdoor (read-only), news aggregators, LinkedIn (public read only), business website + socials, trade publications, government licensing databases
- **Public-web listing discovery (amended 2026-05-14 per buyer direction).** The Lane-B agent may use WebSearch + WebFetch to find "businesses for sale" listings on the open web — marketplace teaser pages (BizBuySell, BizQuest, DealStream, etc.), broker websites, SBA-lender pipeline pages, news, state license-transfer filings. Constraints:
  - **One fetch per unique listing URL.** No pagination loops, no bulk crawling, no rate-defeating retries.
  - **Respect robots.txt and ToS.** If a site disallows automated access, stop on that domain and log to `RUN-LOG.md`.
  - **Treat marketplace teasers as preliminary.** Teaser data is intentionally vague. Normalize what's public into a `ListingPacket`, surface the gaps the broker is hiding, and flag every claim as `as_of_date: <fetch-date>` so it ages out fast. Real diligence happens *after* NDA + CIM.
  - **The buyer-specific search rubric is the targeting layer.** See `obsidian-vault/03-Deals/templates/search-rubric-buyer-001.md` (one per buyer) for the must-have / must-avoid filters that constrain the search.
- **Hard blocks (still in force):**
  - No bulk-scraping or repeated/automated marketplace crawling. Single-shot URL fetches per listing only.
  - No paywalled databases (D&B, ZoomInfo, PitchBook) without human-supplied credentials.
  - No personal-life snooping. Owner research = business-operator track record only.
  - No reselling or redistributing marketplace listing data. Anything fetched stays in this private vault.
- Tool stack: `playwright` plugin, `WebFetch`, `context7`, `browser-use` as escalation (Phase 3+)
- Output: `DueDiligencePacket` records → `03-Deals/due-diligence/`. Every claim cites `source_url` + `retrieved_at`. Unsourced claims stripped before vault write.
- **Skill creation feedback loop:** repeated research patterns get codified as `SKILL.md` under `01-Skills/research/`.

## 4. Safety rails

- No legal finality. Entity / tax / structure recommendations route to `05-Validation/signoffs/` for human sign-off.
- No marketplace data redistribution. Single-shot fetches stay in this private vault. Sample fetches for tooling validation stay in `05-Validation/source-manifests/marketplace-samples/`.
- No license-less skills. No license capture = no `01-Skills/` entry.
- No oversized project-root `CLAUDE.md`. Stays under ~200 lines; detail lives here.
- No heavy motion in core data views. R3F / Spline / heavy GSAP live in `apps/portfolio/`, not `apps/dashboard/`.
- No silent failures. Every rejection, flag, or skipped install gets a line in `RUN-LOG.md` and `CHANGELOG.md`.
- No drift from buyer-first. No rating without `BuyerProfile`.
- No unsourced claims in due-diligence packets.

## 5. Human-authored notes — sovereign

Human-authored notes live in `99-Human/` or carry `#human-authored` in their tags. They override Claude-authored content when they conflict. **No subagent may modify, rename, move, reformat, or delete them.** Subagents may read them, must cite them when used, and must surface any conflict at the next gate. Suggestions about human-authored notes go into `99-Human/suggestions/` as new files.

### Identification (any one is sufficient — default to assuming human-authored when uncertain)
1. Frontmatter `tags:` includes `human-authored`, OR `#human-authored` appears anywhere in the body
2. Path begins with `obsidian-vault/99-Human/`
3. Frontmatter `validator_id` is `human` OR the field is missing entirely
4. First line of body contains `<!-- human-authored -->`

### Hook enforcement
`pre-write-guard.sh` checks the target path. If under `99-Human/`, reject with stderr `BLOCKED: human-authored folder is protected.`. For any other vault path, read the existing file (if any) and check the four identification rules. If matched, reject with the same message. The hook fails closed: any check error means reject, not allow.

## 6. Git-first persistence

- `git push` is the only real save.
- Commits use the format: `[<phase>] <agent>: <action>` (e.g. `[Phase 0] vault-librarian: scaffold control files`).
- Every `[GATE]` checkpoint pushes first, then prints the gate message with the latest commit SHA and the GitHub URL.
- Before announcing any gate as complete, run `git status` (clean tree) and `git log -1` (latest commit is what you expect).

## 7. Skill / subagent invocation pre-flight (added 2026-05-15)

Before invoking any skill or spawning any agent that includes shell execution or file-write tools, the orchestrator must perform a four-step pre-flight check:

1. **Read** the skill's `SKILL.md` or the agent's definition file in full
2. **Inventory** operations: read paths, write paths, shell command usage, network access
3. **Report** any installation issues (broken symlinks, missing deps, partial installs) or scope mismatches (e.g. a mobile-biased skill being asked to drive web work)
4. **Propose** a constrained invocation that fits the current project's actual needs

The skill / agent is not invoked until the human approves the constrained scope. Single-shot human approval can pre-authorize a chained sequence (e.g. "architect → builder, no check-in between") — when that happens, the pre-flight READ step still occurs (so the orchestrator briefs the next agent correctly), but the approval gate is satisfied by the prior authorization.

Read-only-tool agents (`Read`, `Glob`, `Grep` only) are exempt — low blast radius.

**Origin:** ui-ux-pro-max skill investigation, 2026-05-15. Pre-flight discovered broken symlinks + React-Native bias before invocation, letting the user approve a constrained "read SKILL.md as static reference only" scope instead of running a broken + mismatched tool.
