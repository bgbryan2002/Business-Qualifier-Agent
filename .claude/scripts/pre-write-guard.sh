#!/usr/bin/env bash
# PreToolUse(Write|Edit|MultiEdit|NotebookEdit) hook — refuse writes outside allowed paths
# and refuse any write that targets a human-authored note.
# Reads the tool input JSON from stdin (Claude Code passes it as a JSON object).
# Exits 0 to allow, 2 to block (with stderr message shown to Claude).
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT"

INPUT_JSON="$(cat)"
# Extract file_path or notebook_path from the tool input. Claude Code's hook contract
# passes the full tool_input under the top-level "tool_input" key.
TARGET_PATH="$(printf '%s' "$INPUT_JSON" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    ti = d.get('tool_input', d)  # tolerate raw input or wrapped
    p = ti.get('file_path') or ti.get('notebook_path') or ti.get('path') or ''
    print(p)
except Exception as e:
    sys.stderr.write(f'[pre-write-guard] failed to parse tool input: {e}\n')
    sys.exit(0)
")"

# Empty path means we can't enforce; let it through (PostToolUse will validate frontmatter).
if [ -z "$TARGET_PATH" ]; then
  exit 0
fi

# Normalize: strip trailing slash, resolve relative paths against REPO_ROOT.
case "$TARGET_PATH" in
  /*) ABS_PATH="$TARGET_PATH" ;;
  *)  ABS_PATH="$REPO_ROOT/$TARGET_PATH" ;;
esac
# Reject obvious traversal.
case "$ABS_PATH" in
  *..*) echo "BLOCKED: path traversal not allowed: $TARGET_PATH" >&2; exit 2 ;;
esac

# --- Allowed roots ---
ALLOWED_PREFIXES=(
  "$REPO_ROOT/obsidian-vault/"
  "$REPO_ROOT/apps/"
  "$REPO_ROOT/.claude/"
  "$REPO_ROOT/inputs/"
)
# Also allow root-level *.md, *.json, .gitignore, LICENSE, package.json
BASENAME="$(basename "$ABS_PATH")"
DIRNAME="$(dirname "$ABS_PATH")"
ROOT_LEVEL_ALLOW="false"
if [ "$DIRNAME" = "$REPO_ROOT" ]; then
  case "$BASENAME" in
    *.md|*.json|.gitignore|LICENSE|package.json|package-lock.json|tsconfig.json|README*|HANDOFF.md|RUN-LOG.md)
      ROOT_LEVEL_ALLOW="true" ;;
  esac
fi

WITHIN_ALLOWED="false"
for prefix in "${ALLOWED_PREFIXES[@]}"; do
  case "$ABS_PATH" in
    "$prefix"*) WITHIN_ALLOWED="true"; break ;;
  esac
done

if [ "$WITHIN_ALLOWED" != "true" ] && [ "$ROOT_LEVEL_ALLOW" != "true" ]; then
  echo "BLOCKED: writes are confined to obsidian-vault/, apps/, .claude/, inputs/, and root-level config files. Rejected: $TARGET_PATH" >&2
  exit 2
fi

# --- Human-authored guard ---
# Rule 2: any path under obsidian-vault/99-Human/ is protected.
case "$ABS_PATH" in
  "$REPO_ROOT/obsidian-vault/99-Human/"*)
    echo "BLOCKED: human-authored folder is protected." >&2
    exit 2
    ;;
esac

# Rules 1, 3, 4: if the existing file (anywhere in the vault) is human-authored, block.
if [ -f "$ABS_PATH" ]; then
  case "$ABS_PATH" in
    "$REPO_ROOT/obsidian-vault/"*)
      # Check first 50 lines for any of the four indicators.
      HEAD_CONTENT="$(head -n 50 "$ABS_PATH" 2>/dev/null || true)"
      if echo "$HEAD_CONTENT" | grep -qE '(^[[:space:]]*-[[:space:]]*human-authored[[:space:]]*$|^[[:space:]]*tags:.*human-authored|#human-authored|<!--[[:space:]]*human-authored[[:space:]]*-->|^validator_id:[[:space:]]*human[[:space:]]*$)'; then
        echo "BLOCKED: human-authored folder is protected." >&2
        exit 2
      fi
      # Also block if frontmatter exists but has no validator_id (rule 3 — missing field implies human).
      # Detect frontmatter block: starts with --- on line 1.
      FIRST_LINE="$(head -n 1 "$ABS_PATH" 2>/dev/null || true)"
      if [ "$FIRST_LINE" = "---" ]; then
        # Extract frontmatter and check for validator_id.
        FM="$(awk '/^---$/{c++; if(c==2) exit; next} c==1' "$ABS_PATH")"
        if ! echo "$FM" | grep -qE '^validator_id:'; then
          echo "BLOCKED: human-authored folder is protected." >&2
          exit 2
        fi
      fi
      ;;
  esac
fi

# Allow.
exit 0
