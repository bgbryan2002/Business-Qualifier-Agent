#!/usr/bin/env bash
# PostToolUse(Write|Edit|MultiEdit|NotebookEdit) hook — validate YAML frontmatter on
# any vault markdown, append CHANGELOG.md, run git add.
# Reads tool input + output from stdin (Claude Code passes both wrapped).
# Exits 0 on success or non-fatal warnings; non-zero only on hard failures.
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

INPUT_JSON="$(cat)"
TARGET_PATH="$(printf '%s' "$INPUT_JSON" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    ti = d.get('tool_input', d)
    p = ti.get('file_path') or ti.get('notebook_path') or ti.get('path') or ''
    print(p)
except Exception:
    print('')
")"

[ -z "$TARGET_PATH" ] && exit 0

case "$TARGET_PATH" in
  /*) ABS_PATH="$TARGET_PATH" ;;
  *)  ABS_PATH="$REPO_ROOT/$TARGET_PATH" ;;
esac

[ -f "$ABS_PATH" ] || exit 0   # tool may have failed; nothing to do

# Compute path relative to repo root for changelog + git add.
REL_PATH="${ABS_PATH#$REPO_ROOT/}"

# --- Frontmatter validation (vault markdown only, excluding 99-Human/ which has no contract) ---
case "$ABS_PATH" in
  "$REPO_ROOT/obsidian-vault/99-Human/"*)
    : # human-authored notes are exempt
    ;;
  "$REPO_ROOT/obsidian-vault/"*.md|"$REPO_ROOT/obsidian-vault/"*.MD)
    REQUIRED=(id title note_type category source_url source_type license confidence as_of_date validator_id status)
    FIRST_LINE="$(head -n 1 "$ABS_PATH" 2>/dev/null || true)"
    if [ "$FIRST_LINE" != "---" ]; then
      echo "[post-write-validate] WARN: $REL_PATH has no YAML frontmatter (vault markdown should)" >&2
    else
      FM="$(awk '/^---$/{c++; if(c==2) exit; next} c==1' "$ABS_PATH")"
      MISSING=()
      for field in "${REQUIRED[@]}"; do
        if ! printf '%s' "$FM" | grep -qE "^${field}:"; then
          MISSING+=("$field")
        fi
      done
      if [ "${#MISSING[@]}" -gt 0 ]; then
        echo "[post-write-validate] WARN: $REL_PATH missing required frontmatter fields: ${MISSING[*]}" >&2
      fi
    fi
    ;;
esac

# --- Append CHANGELOG.md (vault writes only) ---
case "$ABS_PATH" in
  "$REPO_ROOT/obsidian-vault/"*)
    CHANGELOG="$REPO_ROOT/obsidian-vault/00-Claude-Control/CHANGELOG.md"
    if [ -f "$CHANGELOG" ]; then
      AGENT="${CLAUDE_AGENT_NAME:-orchestrator}"
      TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
      printf '%s | %s | %s | pending\n' "$TS" "$AGENT" "$REL_PATH" >> "$CHANGELOG"
    fi
    ;;
esac

# --- git add ---
git add -- "$ABS_PATH" 2>/dev/null || true

exit 0
