# SessionStart hook (PowerShell) — print HUD, verify vault structure, list pending validations, verify upstream remote.
# Idempotent. Quiet on success. Exits non-zero with stderr message on hard failure.
$ErrorActionPreference = 'SilentlyContinue'

$RepoRoot = (git rev-parse --show-toplevel 2>$null)
if (-not $RepoRoot) { $RepoRoot = (Get-Location).Path }
$RepoRoot = $RepoRoot -replace '\\','/'
Set-Location $RepoRoot

# HUD
$Branch = git rev-parse --abbrev-ref HEAD 2>$null
if (-not $Branch) { $Branch = 'no-branch' }
$Sha = git rev-parse --short HEAD 2>$null
if (-not $Sha) { $Sha = 'no-commits' }
$Dirty = (git status --porcelain 2>$null | Measure-Object).Count
Write-Host "[session-start] branch=$Branch  sha=$Sha  dirty=$Dirty  cwd=$RepoRoot"

# Vault structure check
$Required = @(
    'obsidian-vault/00-Claude-Control',
    'obsidian-vault/01-Skills',
    'obsidian-vault/02-Buyers',
    'obsidian-vault/03-Deals',
    'obsidian-vault/04-Dashboard',
    'obsidian-vault/05-Validation',
    'obsidian-vault/06-Portfolio',
    'obsidian-vault/99-Human',
    '.claude/agents',
    '.claude/scripts'
)
$Missing = $Required | Where-Object { -not (Test-Path $_) }
if ($Missing.Count -gt 0) {
    [Console]::Error.WriteLine("[session-start] WARN: missing directories:")
    $Missing | ForEach-Object { [Console]::Error.WriteLine("  - $_") }
}

# Pending validations
$FlaggedDir = 'obsidian-vault/05-Validation/source-manifests/flagged'
if (Test-Path $FlaggedDir) {
    $Pending = (Get-ChildItem $FlaggedDir -Recurse -File -Include '*.md','*.json' -ErrorAction SilentlyContinue | Measure-Object).Count
    if ($Pending -gt 0) {
        Write-Host "[session-start] $Pending flagged validation(s) pending in $FlaggedDir"
    }
}

# Upstream remote check
git remote get-url upstream 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    git ls-remote --exit-code upstream HEAD 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[session-start] upstream reachable"
    } else {
        [Console]::Error.WriteLine("[session-start] WARN: upstream remote configured but unreachable (offline?)")
    }
} else {
    [Console]::Error.WriteLine("[session-start] WARN: no upstream remote configured. Pushes will not persist beyond this session.")
}

exit 0
