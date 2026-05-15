# Open this folder in Obsidian (after you clone the repo)

This file exists because the Obsidian vault lives inside this repo. You first need to download the repo to your laptop, *then* point Obsidian at the vault folder.

## Step 1 — Clone the repo to your laptop

Open a terminal on your laptop and run:

```bash
git clone https://github.com/bgbryan2002/Business-Qualifier-Agent.git
cd Business-Qualifier-Agent
```

You now have a local copy of everything Claude built online.

## Step 2 — Open the vault in Obsidian

1. Open the Obsidian desktop app.
2. Bottom-left of the sidebar, click the **vault switcher icon** (small box/stack icon, near the gear). Or press `Ctrl+Shift+P` (Windows/Linux) / `Cmd+Shift+P` (Mac) and search for **"Open another vault"**.
3. Click **"Open folder as vault"**.
4. Browse to the cloned repo and select the `obsidian-vault` folder **inside it** — not the repo root.
5. Click "Open" (or "Select Folder" on Windows).

Obsidian indexes the folder and shows the notes.

## Step 3 — Recommended community plugins (optional, ~2 minutes)

1. `Settings` → `Community plugins` → toggle off **Restricted mode** (one-time).
2. Click **Browse** and install:
   - **Dataview** — query frontmatter (e.g. "all skills with confidence > 0.8")
   - **Templater** — extend the YAML templates Claude uses
3. Enable each after install.

## Step 4 — Where to start reading

Open `obsidian-vault/00-Claude-Control/VAULT-INDEX.md` first. It's your map.

## Step 5 — Switching back to your default vault

Same vault switcher icon at the bottom-left. Both vaults can be open in different windows.

## Why this can't be automated

Obsidian only sees folders on your laptop's hard drive. The cloud computer Claude works on is separate. Cloning the repo is what bridges them.

## Your sovereign space

Anything you write in `obsidian-vault/99-Human/` or any note tagged `#human-authored` is **off-limits to Claude's subagents**. They won't modify, rename, move, or delete it. They will read it (treat it as input) and cite it when they use it. If they think you should change something there, they'll drop a new file in `obsidian-vault/99-Human/suggestions/` and leave your original alone.
