#!/usr/bin/env bash
# SessionStart hook — print HUD, verify vault structure, list pending validations, verify upstream remote.
# Idempotent. Quiet on success. Exits non-zero with stderr message on hard failure.
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

# --- HUD ---
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'no-branch')"
LATEST_SHA="$(git rev-parse --short HEAD 2>/dev/null || echo 'no-commits')"
DIRTY="$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
echo "[session-start] branch=$BRANCH  sha=$LATEST_SHA  dirty=$DIRTY  cwd=$REPO_ROOT"

# --- Vault structure check ---
REQUIRED_DIRS=(
  obsidian-vault/00-Claude-Control
  obsidian-vault/01-Skills
  obsidian-vault/02-Buyers
  obsidian-vault/03-Deals
  obsidian-vault/04-Dashboard
  obsidian-vault/05-Validation
  obsidian-vault/06-Portfolio
  obsidian-vault/99-Human
  .claude/agents
  .claude/scripts
)
MISSING=()
for d in "${REQUIRED_DIRS[@]}"; do
  [ -d "$d" ] || MISSING+=("$d")
done
if [ "${#MISSING[@]}" -gt 0 ]; then
  echo "[session-start] WARN: missing directories:" >&2
  printf '  - %s\n' "${MISSING[@]}" >&2
fi

# --- Pending validations ---
FLAGGED_DIR="obsidian-vault/05-Validation/source-manifests/flagged"
if [ -d "$FLAGGED_DIR" ]; then
  PENDING="$(find "$FLAGGED_DIR" -type f -name '*.md' -o -name '*.json' 2>/dev/null | wc -l | tr -d ' ')"
  [ "$PENDING" -gt 0 ] && echo "[session-start] $PENDING flagged validation(s) pending in $FLAGGED_DIR"
fi

# --- Upstream remote check ---
if git remote get-url upstream >/dev/null 2>&1; then
  # Lightweight reachability probe; do not fail session-start if offline.
  if git ls-remote --exit-code upstream HEAD >/dev/null 2>&1; then
    echo "[session-start] upstream reachable"
  else
    echo "[session-start] WARN: upstream remote configured but unreachable (offline?)" >&2
  fi
else
  echo "[session-start] WARN: no upstream remote configured. Pushes will not persist beyond this session." >&2
fi

exit 0
