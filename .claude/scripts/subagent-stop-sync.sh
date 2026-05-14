#!/usr/bin/env bash
# SubagentStop hook — flush pending vault writes, refresh VAULT-INDEX.md,
# git commit + push upstream <branch>. Idempotent. Quiet on success.
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')"
[ -z "$BRANCH" ] && { echo "[subagent-stop-sync] no branch; skipping" >&2; exit 0; }

# --- Refresh VAULT-INDEX.md note counts (best-effort; will not fail the hook) ---
INDEX="$REPO_ROOT/obsidian-vault/00-Claude-Control/VAULT-INDEX.md"
if [ -f "$INDEX" ]; then
  python3 - <<'PY' || true
import os, re, glob
root = os.path.join(os.environ.get('REPO_ROOT', os.getcwd()), 'obsidian-vault')
sections = ['00-Claude-Control','01-Skills','02-Buyers','03-Deals','04-Dashboard','05-Validation','06-Portfolio','99-Human']
counts = {s: len(glob.glob(os.path.join(root, s, '**', '*.md'), recursive=True)) for s in sections}
idx = os.path.join(root, '00-Claude-Control', 'VAULT-INDEX.md')
if not os.path.exists(idx): exit(0)
with open(idx, 'r') as f: txt = f.read()
def repl(m):
    section = m.group(1).strip()
    n = counts.get(section, 0)
    return f"| {section} | {n} | {m.group(3)} |"
new = re.sub(r'\| (00-Claude-Control|01-Skills|02-Buyers|03-Deals|04-Dashboard|05-Validation|06-Portfolio|99-Human) \| ([^|]+)\|([^|]+)\|', repl, txt)
if new != txt:
    with open(idx, 'w') as f: f.write(new)
PY
  git add "$INDEX" 2>/dev/null || true
fi

# --- If nothing staged, exit cleanly ---
if git diff --cached --quiet; then
  exit 0
fi

# --- Commit ---
PHASE="${CLAUDE_PHASE:-Phase 0}"
AGENT="${CLAUDE_AGENT_NAME:-orchestrator}"
SUMMARY="${CLAUDE_COMMIT_SUMMARY:-batched vault writes}"
MSG="[$PHASE] $AGENT: $SUMMARY"

git commit -m "$MSG" >/dev/null 2>&1 || {
  echo "[subagent-stop-sync] git commit failed" >&2
  exit 1
}

# --- Backfill pending CHANGELOG SHAs to the new HEAD sha ---
SHA="$(git rev-parse --short HEAD)"
CHANGELOG="$REPO_ROOT/obsidian-vault/00-Claude-Control/CHANGELOG.md"
if [ -f "$CHANGELOG" ]; then
  if grep -q '| pending$' "$CHANGELOG"; then
    sed -i.bak "s/| pending$/| $SHA/g" "$CHANGELOG"
    rm -f "${CHANGELOG}.bak"
    git add "$CHANGELOG"
    git commit --amend --no-edit >/dev/null 2>&1 || true
  fi
fi

# --- Push to upstream with exponential backoff (only retries on transient errors) ---
RETRIES=0
MAX_RETRIES=4
SLEEPS=(2 4 8 16)
while true; do
  if git push -u upstream "$BRANCH" 2>&1 | sed -E 's|https://oauth2:[^@]+@|https://REDACTED@|g'; then
    break
  fi
  if [ $RETRIES -ge $MAX_RETRIES ]; then
    echo "[subagent-stop-sync] git push failed after $MAX_RETRIES retries; STOP" >&2
    exit 1
  fi
  sleep "${SLEEPS[$RETRIES]}"
  RETRIES=$((RETRIES+1))
done

echo "[subagent-stop-sync] pushed $SHA to upstream/$BRANCH"
exit 0
