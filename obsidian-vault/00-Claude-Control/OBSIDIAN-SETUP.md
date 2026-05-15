---
id: obsidian-setup
title: Open the Vault in Obsidian
note_type: validation
category: automation
source_url: internal
source_type: github_repo
license: n/a-public-record
checksum_sha256: pending
confidence: 1.0
citation:
  - kickoff-prompt-section-5c
as_of_date: 2026-05-14
validator_id: orchestrator
status: accepted
tags: [control, setup, obsidian]
---

# Open the Vault in Obsidian

This is the in-vault duplicate of `OBSIDIAN-OPEN-ME.md` (which lives at the repo root). Same content; placed here so you can find it from inside Obsidian later.

## Step 1 — Clone the repo to your laptop

```bash
git clone https://github.com/bgbryan2002/Business-Qualifier-Agent.git
cd Business-Qualifier-Agent
```

## Step 2 — Open the vault in Obsidian

1. Open the Obsidian desktop app.
2. Bottom-left of the sidebar, click the **vault switcher icon** (small box/stack icon, near the gear). Or press `Ctrl+Shift+P` (Win/Linux) / `Cmd+Shift+P` (Mac) and search for **"Open another vault"**.
3. Click **"Open folder as vault"**.
4. Browse to the cloned repo and select the `obsidian-vault` folder **inside it** — not the repo root.
5. Click "Open" (or "Select Folder" on Windows).

Obsidian indexes the folder and shows the notes.

## Step 3 — Recommended community plugins (~2 minutes, optional)

1. `Settings` → `Community plugins` → toggle off **Restricted mode** (one-time).
2. Click **Browse** and install:
   - **Dataview** — query frontmatter (e.g. "all skills with confidence > 0.8")
   - **Templater** — extend the YAML templates Claude uses
3. Enable each after install.

## Step 4 — Where to start reading

Open `00-Claude-Control/VAULT-INDEX.md` first. It's your map.

## Step 5 — Switching back to your default vault

Same vault switcher icon at the bottom-left. Both vaults can be open in different windows.

## Why this can't be automated

Obsidian only sees folders on your laptop's hard drive. The cloud computer Claude works on is separate. Cloning the repo is what bridges them.
