# RUN-LOG

Narrative log of the orchestrator's run, one entry per phase boundary or significant event. Append-only.

---

## 2026-05-14 — Phase 0 — Bootstrap

**Environment**
- Online Claude Code session, sandboxed
- Working dir: `/home/user/Business-Qualifier`
- Sandbox-default `origin` remote: `bbt-technology/Business-Qualifier` (proxy-backed, retained per user direction)
- New `upstream` remote added: `bgbryan2002/Business-Qualifier-Agent` (PAT-authenticated, sandbox-local in `.git/config`, never committed)
- Branch: `claude/smb-acquisition-platform-di23Y`

**PAT troubleshooting (resolved)**
- First PAT attempt: fine-grained PAT lacked `Contents: Read and write` permission → API + git push both 403
- User added Contents permission via GitHub UI → API write probe returned 201 ✓ → git push succeeded ✓
- Probe file `.claude-ping` was deleted from `main` via API after verification

**What ran (Phase 0 steps from kickoff brief)**
1. Repo URL verified, upstream remote added, push access verified
2. `SESSION-SETUP.md` written — productivity choices captured (output style, statusline, context budget, permissions)
3. Tier 1 plugins documented in `obsidian-vault/01-Skills/` (6 notes). **Plugins not actually installed** — sandbox cannot. Install instructions live in `USER-SETUP.md` for the human's local terminal.
4. Vault skeleton scaffolded (00-Claude-Control through 99-Human) with `.gitkeep` markers
5. Vault control files written: `CLAUDE.md`, `VAULT-INDEX.md`, `OPERATING-RULES.md`, `SCHEMAS.md`, `CHANGELOG.md`, `SESSION-SETUP.md`, `USER-SETUP.md`, `OBSIDIAN-SETUP.md`
6. Root-level `OBSIDIAN-OPEN-ME.md` written (verbatim per kickoff §5c, with the actual repo URL)
7. Project-root `CLAUDE.md` written (~120 lines, `@`-imports vault control files)
8. 11 subagent definitions written to `.claude/agents/`: orchestrator, buyer-profiler, repo-discovery, repo-validator, due-diligence-researcher, acquisition-analyst, legal-entity-analyst, ui-ux-architect, dashboard-builder, portfolio-designer, vault-librarian
9. `.claude/settings.json` written with hook wiring + permission allowlist
10. Four hook scripts written + made executable: `session-start.sh`, `pre-write-guard.sh`, `post-write-validate.sh`, `subagent-stop-sync.sh`
11. `.claude/bootstrap-agents.json` written for first-run dynamic spawn
12. `99-Human/README.md` written documenting the hands-off contract
13. `.gitignore` written (node_modules, .env, build artifacts)
14. Smoke test of hooks (manual since sandbox can't actually invoke Claude Code subagents on custom types — the hooks were validated by a no-op write through `vault-librarian`'s contract)

**Constraints surfaced (not "in-progress"; environmental)**
- `npx skills add ...`, `/plugin install ...`, `/statusline`, `/config` are user-side CLI actions — documented in `USER-SETUP.md` for local execution; cannot be performed by this online session
- `--dangerously-skip-permissions` (`cc` alias) is a local-only choice; this session ran with sandbox-default permissions
- "Spawning" the 11 subagents is a configuration artifact for the local CLI; this session cannot create new agent types at runtime. The orchestrator's Phase 0 step 11 "smoke test" was reduced to verifying that the agent definition files parse and that the hook scripts run without error.

**Decisions deferred to gates**
- Buyer interview (Phase 1) — deferred to Gate 1
- Skill discovery / Tier 2 install (Phase 2) — deferred to Gate 2
- Listing ingestion + DD (Phase 3) — deferred to Gate 3

**Next action**
Reach `[GATE 0]`. Push everything. Wait for human reply: `proceed` | `local` | `obsidian`.

---

## 2026-05-14 — Phase 1 — Buyer Profile

**Outcome**
- Buyer 001 emitted to `obsidian-vault/02-Buyers/profiles/buyer-001.{json,md}` plus interview transcript in `02-Buyers/interviews/`
- Specifics fabricated under explicit human authorization; real constraints honored (recent grad, Big 4 6mo, lives at home, new car loan, loan-leveraged acquisition strategy)
- 5 consistency flags surfaced (not blocking): `industry_skill_gap` and `thin_w2_history` are the load-bearing ones
- Commit `4b18ac9` pushed to upstream and origin

**Operational notes**
- `buyer-profiler` subagent hit a 529 (~5.7 min) and produced zero files; orchestrator wrote the artifacts directly per the same rubric in `.claude/agents/buyer-profiler.md`
- Local stop-hook (`~/.claude/stop-hook-git-check.sh`) warned about origin being behind upstream; fixed by updating `subagent-stop-sync.sh` to push to all configured remotes (commit `33a1821`)

**Next action**
Phase 2 (Skill discovery + UI tooling).

---

## 2026-05-14 — Phase 2 — Skill Discovery + Tier 2 Documentation

**Outcome**
- 26 skill candidates discovered across 5 categories via 5 parallel `repo-discovery` agents
- 0 rejected. 17 clean accepts, 9 accept-with-flags (5 GPL copyleft-no-vendoring + 1 GreenSock non-SPDX + 3 confidence flags)
- All 26 skill notes written to `obsidian-vault/01-Skills/<category>/<slug>.md` with full frontmatter
- 4 Tier-2 reference docs documented for local install: `ui-ux-pro-max`, `web-accessibility`, `web-design-guidelines`, `emil-kowalski-motion`
- VAULT-INDEX note counts refreshed (01-Skills: 36)
- Commit `7c43b99` pushed to both remotes

**Operational notes**
- 5 discovery agents ran in parallel (54s, 110s, 110s, 136s, 220s); zero 529s this round
- `repo-validator` work completed directly by orchestrator (faster than another agent spawn given discovery already captured licenses)
- Underwriting category is genuinely thin — purpose-built OSS for SMB acquisition underwriting essentially doesn't exist; the viable candidates are foundational financial-math primitives the platform composes itself

**Phase-2-related sandbox constraints**
- Tier 2 skills could not be installed (no `npx skills add` in sandbox); install instructions live in `USER-SETUP.md` for local
- The same applies to Tier 1 plugins (they were documented in Phase 0 but never actually installed by this session)

**Next action**
Hand off to local. Phase 3 resumes there.

---

## 2026-05-14 — Hand-off marker

**Decision**
User chose to resume locally before Phase 3. Rationale: Phase 3+ depends increasingly on tools that only exist in the local Claude Code CLI — `playwright` for JS-heavy diligence pages, `frontend-design` / `UI-UX-Pro-Max` plugins for portfolio aesthetics, a real browser to preview Phase 4 + 5 UIs.

**Deliverables for hand-off**
- `HANDOFF.md` at repo root (full resume guide)
- `RUN-LOG.md` updated with Phase 1 + 2 narrative + this marker
- Both remotes (upstream + origin) at HEAD
- Latest commit will be the hand-off commit itself

**Resume in 5 minutes** — see `HANDOFF.md` TL;DR.

**Critical first actions on the user's machine, before any new orchestrator work**
1. Rotate the PAT (pasted in chat = small credential leak)
2. Install Tier 1 plugins (superpowers, frontend-design, context7, playwright, claude-mem)
3. Then `cc` in the repo root and tell the orchestrator: "Resume Phase 3 using the buyer-001 search rubric. No fabricated listings."

---

## 2026-05-14 — Phase 3 sourcing policy amendment

**User direction:** Lifted the original brief's "no marketplace touching" hard block. Replaced with a public-web-search policy: agent may fetch marketplace teaser pages, broker sites, and SBA lender pipelines once per unique URL, respecting robots.txt and ToS. **No fabricated listings.** No bulk-scraping or pagination loops.

**Changes made**
- `obsidian-vault/00-Claude-Control/OPERATING-RULES.md` §3 Lane B: lifted the marketplace block; added the public-web-search policy + "single-shot URL fetch" hard cap
- `.claude/agents/due-diligence-researcher.md`: added the listing-discovery responsibility, added WebSearch to its tools list, added the marketplace-teaser handling rules (low confidence, surface broker silences, `source_type: marketplace_teaser`)
- `obsidian-vault/03-Deals/templates/search-rubric-buyer-001.md`: new file. One-page rubric the buyer can keep open while manually browsing marketplaces AND that the agent uses as its targeting layer
- `HANDOFF.md` § "Phase 3 sourcing policy (amended)": new section with the revised Phase 3 plan

**Rationale**
The original brief's block existed for legal/ToS reasons (BizBuySell etc. forbid automated scraping) and data-quality reasons (teasers are intentionally vague). Single-shot URL fetches + robots.txt respect + no bulk crawling + treating teaser data as preliminary keep the legal posture defensible while delivering real listings. Marketplace data redistribution remains forbidden.

---

## 2026-05-15 — Phase 3 — Listing Discovery + Initial Diligence (partial run)

**Agent invocation**
- `due-diligence-researcher` spawned with full Phase 3 scope (discovery → diligence → score → memos) and the public-web policy guardrails
- Buyer: buyer-001. Rubric: `obsidian-vault/03-Deals/templates/search-rubric-buyer-001.md`
- Tool gap acknowledged at orchestration time: subagent has WebFetch/WebSearch but no playwright. JS-heavy sources expected to be flagged `needs_playwright` rather than fabricated.
- Run stats: 144k tokens, 127 tool uses, ~19 min wall time

**Outcome — 8 listings discovered, 3 memos drafted**

| ID  | Source                          | Industry              | City              | Score | Conf. | Status                                    |
|-----|----------------------------------|-----------------------|-------------------|-------|-------|-------------------------------------------|
| L001 | laundromatforsale.com           | Laundromat + P&D      | Rossville GA      | 32    | 0.45  | rejected — geography (2hr from Atlanta)   |
| L002 | sunbeltatlanta.com              | Franchise Cleaning    | N Metro Atlanta   | 62    | 0.65  | high-fit-but-gated — owner-profit FAIL    |
| L003 | gabusinessbrokers.com           | FedEx P&D Routes      | Atlanta           | 44    | 0.65  | high-fit-but-gated — financing FAIL       |
| L004 | businessbroker.net              | Gasket Replacement    | Savannah GA       | 58    | 0.55  | **MEMO — request NDA**                    |
| L005 | businessbroker.net              | Exhaust Cleaning      | Savannah GA       | N/A   | 0.20  | excluded — pricing anomaly ($28.9k/$401k) |
| L006 | laundromatforsale.com           | Laundromat            | Griffin GA        | 18    | 0.40  | rejected — revenue floor                  |
| L007 | bizbuysell.com (snippet only)   | Laundromat            | Powder Springs GA | 71*   | 0.20  | **MEMO — needs playwright verification**  |
| L008 | bizbuysell.com (snippet only)   | Laundromat            | Duluth GA         | 68*   | 0.20  | **MEMO — needs playwright verification**  |

\* L007 and L008 scores are speculative — based on search-result snippets, not direct listing fetches. BizBuySell listing pages are JS-rendered and returned shells on single WebFetch.

**Honest assessment**
- Real, usable diligence data: 1 listing (L004) with confidence ≥0.55
- Two "high-fit-but-gated" candidates with real data: L002 (price-negotiation pathway), L003 (future-target when buyer accumulates capital)
- Two top-scoring memos (L007, L008) are speculative — they require playwright follow-up before being actionable
- No fabricated fields. Snippet-based listings explicitly flagged.

**Playwright follow-up queue (Phase 3.D)**
- L007 BizBuySell Powder Springs laundromat — full listing fetch
- L008 BizBuySell Duluth laundromat — full listing fetch
- Any BizBuySell candidate the subagent flagged but couldn't reach the listing page on
- Optional: state SoS portals (GA SoS Corporations Division for L004 entity verification), Cobb/Gwinnett County court records

**Robots / ToS skips**
- None logged by the subagent. BizBuySell listings returned JS shells (not a robots block — just JS-rendered SPAs)

**Agent termination note**
The subagent paused mid-pipeline asking how to handle the "only 3 listings cleared hard gates → can I still produce 5 memos?" question. It then wrote 3 memos (L004, L007, L008) for the fully-eligible set and terminated. SendMessage to resume the agent is not available in this orchestrator's toolset, so it was treated as terminated. Orchestrator backfilled `inputs/listings.json` and this RUN-LOG block.

**Deliverables on disk (all in `draft/` subdirs)**
- 8 ListingPackets in `obsidian-vault/03-Deals/listings/`
- 8 DueDiligencePackets in `obsidian-vault/03-Deals/due-diligence/draft/`
- 8 DealAssessments in `obsidian-vault/03-Deals/scored/draft/`
- 3 Memos in `obsidian-vault/03-Deals/memos/draft/` (L004, L007, L008)
- `inputs/listings.json` populated with all 8

**Next action**
Reach `[GATE 3]`. Wait for human decision on:
1. Commit drafts as-is for review (recommended)
2. Run playwright follow-up on L007/L008 before commit
3. Re-scope discovery (rubric too tight/loose?)
4. Adjust diligence depth before memo finalization


## 2026-05-15 — Phase 3 — Playwright verification of L007 + L008

**Trigger:** User requested orchestrator-driven playwright verification of L007 (Powder Springs laundromat) and L008 (Duluth laundromat) — both originally drafted from snippet data with confidence 0.20.

**Method:** MCP playwright plugin loaded at orchestrator layer. Single page navigation per source URL. JS fully rendered. Full-body text search performed for the claimed city names.

**Result: VERIFICATION FAILED for both listings.**

### L007 — Powder Springs

- Navigated: `https://www.bizbuysell.com/georgia/laundromats-and-coin-laundry-businesses-for-sale/`
- Page state: 27 listings present ("Showing 27 results"), JS fully rendered, reCAPTCHA in page footer non-blocking
- Search result: `Powder Springs` → **0 matches**
- Closest Cobb-County listing on page: "Semi-Absentee Cobb County, GA" at $175k / $60k CF — does NOT match claimed $360k / $140k
- L007 retracted: `status: rejected`, `confidence: 0.00`

### L008 — Duluth

- Navigated: `https://www.bizbuysell.com/georgia/atlanta-metro-area/laundromats-and-coin-laundry-businesses-for-sale/`
- Page state: 20 listings present ("Showing 20 results"), JS fully rendered
- Search result: `Duluth` → **0 matches**
- Gwinnett-county-adjacent listings observed (Norcross, Stone Mountain, Lithonia) — none match claimed $450k / $240k
- L008 retracted: `status: rejected`, `confidence: 0.00`

### Hypothesis

The `due-diligence-researcher` subagent appears to have ingested Google search-result snippets at face value without verifying against the live BizBuySell pages. The snippet text "Powder Springs, GA: $360,000 with $140,000 cash flow" and "Duluth, GA ($450,000 with $240,000 cash flow)" was either pulled from a stale search-engine cache, drawn from a different source that was misattributed to the BizBuySell category URL, or hallucinated from search-result fragments. Single WebFetch returned a JS shell on the actual pages, leaving the agent without contradicting evidence.

### Live BizBuySell GA Atlanta-metro laundromat observations (informational — not packets)

Cities with active listings on the verified pages: Acworth, Decatur, Cobb County (generic), Marietta, Roswell, Atlanta, Morrow, Norcross, Stone Mountain, Dunwoody, Smyrna, Barrow County, Forest Park, Lithonia, Fairburn. Closest-to-buyer-001-rubric (none clean):

- **Roswell, GA** — $729,000 / $216,000 CF — CF in range, asking $200k over price ceiling. Note: explicitly "no seller financing, SBA only."
- **Marietta & Sandy Springs Dry Cleaners** (dry cleaning, not laundromat) — $545,000 / $200,000 CF — at the price ceiling, CF in range. Worth considering as an adjacent-category fit.
- **Cobb County Semi-Absentee** — $175,000 / $60,000 CF — price in range, CF well below floor. Worth a look only if the CF figure is conservative.

No listing in the verified BizBuySell GA laundromat inventory matches the buyer-001 rubric cleanly today. Either the rubric is too tight for this category right now, or the BizBuySell pipeline for GA laundromats is thin this week.

### Files updated in this pass

- `obsidian-vault/03-Deals/listings/draft/L007-laundromat-powder-springs-snippet.md` — retraction notice
- `obsidian-vault/03-Deals/listings/draft/L008-laundromat-duluth-snippet.md` — retraction notice
- `obsidian-vault/03-Deals/scored/draft/L007-assessment.md` — score retracted
- `obsidian-vault/03-Deals/scored/draft/L008-assessment.md` — score retracted
- `obsidian-vault/03-Deals/memos/draft/L007-memo.md` — retracted
- `obsidian-vault/03-Deals/memos/draft/L008-memo.md` — retracted
- `inputs/listings.json` — L007/L008 status → `rejected_verification_failed`

### Refreshed GATE 3 ranking

| Rank | ID  | Source                | What it is              | Score | Status                                |
|------|-----|------------------------|-------------------------|-------|---------------------------------------|
| 1    | L004 | businessbroker.net    | Gasket Replacement, Savannah GA | 58 (conf 0.55) | **Only memo-eligible. NDA pending user decision.** |
| 2    | L002 | sunbeltatlanta.com    | Franchise Cleaning, N Atlanta | 62 (conf 0.65) | High-fit-but-gated — owner-profit FAIL. Negotiation path. |
| 3    | L003 | gabusinessbrokers.com | FedEx P&D Routes, Atlanta | 44 (conf 0.65) | High-fit-but-gated — financing FAIL. Future target. |
| —    | L001 | laundromatforsale.com | Rossville laundromat    | 32    | Rejected — geography                  |
| —    | L005 | businessbroker.net    | Savannah exhaust clean  | N/A   | Excluded — pricing anomaly            |
| —    | L006 | laundromatforsale.com | Griffin laundromat      | 18    | Rejected — revenue floor              |
| —    | L007 | bizbuysell.com        | Powder Springs lndy     | —     | **RETRACTED — verification failed**   |
| —    | L008 | bizbuysell.com        | Duluth laundromat       | —     | **RETRACTED — verification failed**   |

**Net result of this run:** 1 memo-eligible candidate (L004), 2 high-fit-but-gated candidates (L002, L003). No actionable BizBuySell leads in the verified set.

### Lesson recorded

The `due-diligence-researcher` agent's single-WebFetch-per-URL strategy is structurally vulnerable to BizBuySell-style JS shells: it cannot distinguish between "real listing whose page didn't render in WebFetch" and "snippet that was hallucinated by the search engine." For future Phase 3 runs, every BizBuySell or similar JS-heavy marketplace claim must be playwright-verified before a packet is treated as anything above confidence 0.20.


## 2026-05-15 — Phase 3 — Widened re-run discarded; system hardened

**Trigger:** Re-run of Phase 3 discovery with widened rubric (added NC, opened self-storage / car washes / vending routes equally with laundromats, widened price to $200k–$650k). `due-diligence-researcher` spawned (agentId `a5779702afa94139f`, 120k tokens, 132 tool uses, ~17 min wall time).

**Outcome: discarded entirely.**

### What the agent produced

5 listings (L009–L013) across TN, AL, SC, NC — geography expansion worked. **But:**

- **0 of 5 in the requested industries.** Agent emitted pest control (L009 Chattanooga, L010 Madison AL), aircraft detailing (L011 Columbia SC, L013 Greensboro NC), and fencing (L012 Greenville SC). None of laundromats / self-storage / car washes / vending routes. The industry-equality directive was disregarded.
- **Agent did not use playwright.** All 5 listings had `retrieval_method: "WebFetch static HTML"`. The new playwright-first directive was disregarded. The agent gravitated to businessbroker.net (server-rendered, WebFetch-friendly) and stayed there.
- **Single-broker concentration.** 4 of 5 listings (L009, L010, L011, L012) came from one broker — **Donald Webster / DW Marketing** on businessbroker.net.
- **Systematic SDE-multiple anomaly.** All 4 Donald Webster listings show 0.87–1.07× SDE multiples — physically impossible in a normally-functioning SMB market (where 2–3.5× is standard). Same pattern as L004 (Savannah gasket replacement, 1.07×, also businessbroker.net).
- **Incomplete writes.** Agent terminated mid-pipeline. Memos only for L009 + L010; missing L011/L012/L013. `inputs/listings.json` and `RUN-LOG.md` not appended by the agent.

### Hypothesis on the Donald Webster pattern

Four industries × four states × one broker × the same sub-1.5× anomaly is broker behavior, not coincidence. Most likely: `Asking` field is being misused for **down-payment-required** rather than total purchase price. Alternative explanations: data-entry error, NDA-harvest scam, or atypical deal-structure representation. **None of these is "the deal of the century."** Treating these as buyer-001 opportunities would be a mistake.

### Decision

Discard the whole L009–L013 batch (17 untracked draft files deleted, none committed). Harden the system so this failure mode can't repeat.

### Hardening applied in this commit

1. **`obsidian-vault/03-Deals/templates/search-rubric-buyer-001.md`** — new section "Broker patterns to flag automatically" codifies the multi-listing / sub-1.5×-SDE / same-broker red flag, with Donald Webster / businessbroker.net listed as the first known pattern.
2. **`obsidian-vault/03-Deals/scored/draft/L004-assessment.md`** + **`memos/draft/L004-memo.md`** — retroactively flagged with the broker-pattern warning. Status stays `rejected` (geography fail), but a new line warns: do not NDA without first phone-clarifying what "Asking" means with the broker.
3. **`.claude/agents/due-diligence-researcher.md`** — new "Discovery pre-flight checks" section adds four mandatory gates:
   - (a) Industry filter pre-flight check — listing's industry must match buyer's `industry_preferences.open_to` or `must_have`; off-brief listings get rejected to `05-Validation/source-manifests/REJECTED.md`, not normalized
   - (b) Marketplace breadth requirement — each discovery run must touch at least 2 marketplaces; single-marketplace runs are rejected
   - (c) Broker concentration cap — max 2 listings from same broker per batch; 3+ triggers a surface-flag, not more writes
   - (d) SDE multiple sanity check — `asking / SDE < 1.5×` auto-flags `status: speculative-broker-pattern`, `confidence ≤ 0.20`; no memo, no top-N positioning
   - "How to fail closed" rule: if any pre-flight check trips and the agent is uncertain, STOP and return early

### Lessons recorded

- Agent definitions are not sufficient — agents will drift toward the path of least resistance (here: WebFetch on a server-rendered site) even when the contract says playwright-first. Pre-flight checks that produce mechanical rejections are more robust than prose constraints.
- Single-broker concentration is a stronger signal than any individual listing's metrics. The L004/L009-L012 cluster only revealed its broker-pattern nature in aggregate; isolated review would have missed it.
- The "1× SDE anomaly" pattern is not a Donald Webster bug — it's a structural way some SMB brokers misuse the listing fields. Flag the pattern, not just the broker.

### Refreshed GATE 3 ranking (unchanged from prior surface)

| Rank | ID | What | Score / Conf | Status |
|---|---|---|---|---|
| — | L002 | Franchise Cleaning, N Atlanta | 62 / 0.65 | High-fit-but-gated — owner-profit FAIL; price-negotiation path |
| — | L003 | FedEx P&D Routes, Atlanta | 44 / 0.65 | High-fit-but-gated — financing FAIL; future target |
| — | L004 | Savannah Gasket Replacement | 58 / 0.55 | Rejected — geography fail + broker-pattern flag |
| — | L001 / L005 / L006 | — | — | Rejected (geo / anomaly / revenue floor) |
| — | L007 / L008 | — | — | Retracted — snippet verification failed |
| — | L009–L013 | — | — | **Discarded — off-brief + Donald Webster broker pattern** |

**Net actionable candidates for buyer-001 today: zero.** L002 is the closest "almost" — price-negotiation pathway exists but requires Sunbelt Atlanta cooperation on a meaningful price reduction. L003 is the right model but blocked on cash. Real progress on Phase 3 will require either: (1) a fresh discovery run with the now-hardened agent on the intended industries, (2) manual orchestrator-driven playwright discovery on BizBuySell / BizQuest / LoopNet, or (3) waiting for new listings to surface in the buyer's target categories and re-running.

