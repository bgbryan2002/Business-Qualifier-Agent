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

# --- Push to every configured remote, with exponential backoff per remote ---
# Priority: upstream first (the canonical save), then origin (proxy / mirror).
# This keeps both bgbryan2002/Business-Qualifier-Agent and any sandbox/mirror remote in sync,
# which silences stop-hooks that only check origin.
MAX_RETRIES=4
SLEEPS=(2 4 8 16)
PUSHED_TO=()
FAILED=()

push_to_remote() {
  local REMOTE="$1"
  local R=0
  while true; do
    if git push -u "$REMOTE" "$BRANCH" 2>&1 | sed -E 's|https://oauth2:[^@]+@|https://REDACTED@|g'; then
      PUSHED_TO+=("$REMOTE")
      return 0
    fi
    if [ $R -ge $MAX_RETRIES ]; then
      FAILED+=("$REMOTE")
      return 1
    fi
    sleep "${SLEEPS[$R]}"
    R=$((R+1))
  done
}

# Build remote list in deterministic order: upstream, origin, then any others.
REMOTES=()
for r in upstream origin; do
  if git remote get-url "$r" >/dev/null 2>&1; then
    REMOTES+=("$r")
  fi
done
for r in $(git remote); do
  case " ${REMOTES[*]} " in *" $r "*) : ;; *) REMOTES+=("$r") ;; esac
done

if [ "${#REMOTES[@]}" -eq 0 ]; then
  echo "[subagent-stop-sync] no remotes configured; cannot push" >&2
  exit 1
fi

for r in "${REMOTES[@]}"; do
  push_to_remote "$r" || true
done

if [ "${#PUSHED_TO[@]}" -eq 0 ]; then
  echo "[subagent-stop-sync] all pushes failed: ${FAILED[*]}" >&2
  exit 1
fi

echo "[subagent-stop-sync] pushed $SHA to: ${PUSHED_TO[*]}${FAILED:+ (failed: ${FAILED[*]})}"
exit 0
