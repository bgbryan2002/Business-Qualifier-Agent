<!-- human-authored -->

# 99-Human — Your Sovereign Space

This folder is yours. Anything you write here is **off-limits to Claude's subagents** — they will never modify, rename, move, reformat, or delete files in this folder, and never automatically "fix" them.

## What subagents *can* do

- **Read** anything you put here. They're encouraged to. Your notes are input.
- **Cite** your notes when they use the content (e.g. "per `99-Human/scoring-weights-override.md`, cash-flow weight raised from 25 to 30").
- **Suggest** changes by writing a *new* file in `99-Human/suggestions/`. Your original stays untouched.

## What subagents *cannot* do

- Modify any file under `obsidian-vault/99-Human/`
- Delete or rename any file under `obsidian-vault/99-Human/`
- "Reformat" or "improve" any file under `obsidian-vault/99-Human/` — even to fix YAML frontmatter, even to merge duplicates
- Touch any note **anywhere in the vault** that carries `#human-authored` in tags, has `validator_id: human` (or no validator_id at all), or starts with `<!-- human-authored -->`

The `pre-write-guard.sh` hook enforces this. If a subagent tries, the write is rejected with `BLOCKED: human-authored folder is protected.` and the attempt gets logged.

## Recommended use

| Subfolder | What goes here |
|---|---|
| `notes/` | Long-form thoughts, research notes, "things I'm noticing" |
| `suggestions/` | Subagents may write *new* files here proposing changes to your notes; you decide what to do |
| `overrides/` | Authoritative overrides — scoring weights, must-have / must-avoid industries, deal-breakers. These trump Claude-authored content when they conflict. |
| `scratch/` | Throwaway working space |

## How to mark a note elsewhere as yours

You don't have to put it in `99-Human/`. You can drop a note anywhere in the vault and protect it by **any one** of:

1. Add `human-authored` to the YAML `tags:` array
2. Put `#human-authored` anywhere in the body
3. Make the first line of the body `<!-- human-authored -->`
4. Omit the `validator_id:` field from frontmatter (or set it to `human`)

Any one is sufficient. Subagents default to "human-authored" when uncertain.

## Conflict resolution

When your note conflicts with Claude-authored content, **your number wins**. The orchestrator surfaces the conflict at the next gate so you can confirm or revise.

Example: `00-Claude-Control/SCHEMAS.md` says cash-flow weight is 25. You write `99-Human/overrides/scoring-weights.md` saying it's 30. The orchestrator uses 30, mentions the override in the next memo, and surfaces the conflict at `[GATE 3]`.

## You don't need YAML frontmatter

Notes in this folder are exempt from the validation contract in `00-Claude-Control/OPERATING-RULES.md`. Write however you want.
