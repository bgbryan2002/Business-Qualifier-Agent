# SessionStart hook — print HUD, verify vault structure, list pending validations, verify remotes.
# Idempotent. Quiet on success. Writes warnings to stderr on soft failures.
$ErrorActionPreference = 'SilentlyContinue'

$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) { $repoRoot = (Get-Location).Path }
Set-Location $repoRoot

# --- HUD ---
$branch   = git rev-parse --abbrev-ref HEAD 2>$null; if (-not $branch)   { $branch = 'no-branch' }
$sha      = git rev-parse --short HEAD 2>$null;       if (-not $sha)      { $sha    = 'no-commits' }
$dirty    = @(git status --porcelain 2>$null).Count
Write-Host "[session-start] branch=$branch  sha=$sha  dirty=$dirty  cwd=$repoRoot"

# --- Vault structure check ---
$requiredDirs = @(
    'obsidian-vault/00-Claude-Control'
    'obsidian-vault/01-Skills'
    'obsidian-vault/02-Buyers'
    'obsidian-vault/03-Deals'
    'obsidian-vault/04-Dashboard'
    'obsidian-vault/05-Validation'
    'obsidian-vault/06-Portfolio'
    'obsidian-vault/99-Human'
    '.claude/agents'
    '.claude/scripts'
)
$missing = @($requiredDirs | Where-Object { -not (Test-Path $_) })
if ($missing.Count -gt 0) {
    [Console]::Error.WriteLine("[session-start] WARN: missing directories:")
    $missing | ForEach-Object { [Console]::Error.WriteLine("  - $_") }
}

# --- Pending validations ---
$flaggedDir = 'obsidian-vault/05-Validation/source-manifests/flagged'
if (Test-Path $flaggedDir) {
    $pending = @(Get-ChildItem $flaggedDir -Recurse -Include '*.md','*.json' -ErrorAction SilentlyContinue).Count
    if ($pending -gt 0) {
        Write-Host "[session-start] $pending flagged validation(s) pending in $flaggedDir"
    }
}

# Remote reachability check (any configured remote is sufficient)
$remotes = @(git remote 2>$null)
if ($remotes.Count -eq 0) {
    [Console]::Error.WriteLine("[session-start] WARN: no git remotes configured. Pushes will not persist beyond this session.")
} else {
    $reachable   = @()
    $unreachable = @()
    foreach ($r in $remotes) {
        git ls-remote --exit-code $r HEAD 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { $reachable += $r } else { $unreachable += $r }
    }
    if ($reachable.Count -gt 0) {
        Write-Host "[session-start] remotes reachable: $($reachable -join ', ')"
    }
    if ($unreachable.Count -gt 0) {
        [Console]::Error.WriteLine("[session-start] WARN: unreachable remote(s): $($unreachable -join ', ')")
    }
}

exit 0
