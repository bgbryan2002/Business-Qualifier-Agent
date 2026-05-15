# SubagentStop — flush vault writes, refresh VAULT-INDEX, commit + push to all configured remotes.
$ErrorActionPreference = 'SilentlyContinue'

$RepoRoot = (git rev-parse --show-toplevel 2>$null)
if (-not $RepoRoot) { exit 0 }
$RepoRoot = $RepoRoot -replace '\\','/'
Set-Location $RepoRoot

$Branch = git rev-parse --abbrev-ref HEAD 2>$null
if (-not $Branch) {
    [Console]::Error.WriteLine("[subagent-stop-sync] no branch; skipping")
    exit 0
}

# Refresh VAULT-INDEX.md note counts (best-effort)
$Index = "$RepoRoot/obsidian-vault/00-Claude-Control/VAULT-INDEX.md"
if (Test-Path $Index) {
    $Sections = @('00-Claude-Control','01-Skills','02-Buyers','03-Deals','04-Dashboard','05-Validation','06-Portfolio','99-Human')
    $Counts = @{}
    foreach ($s in $Sections) {
        $dir = "$RepoRoot/obsidian-vault/$s"
        if (Test-Path $dir) {
            $Counts[$s] = (Get-ChildItem $dir -Recurse -File -Filter '*.md' -ErrorAction SilentlyContinue | Measure-Object).Count
        } else {
            $Counts[$s] = 0
        }
    }
    $Txt = Get-Content $Index -Raw
    foreach ($s in $Sections) {
        $Escaped = [regex]::Escape($s)
        $N = $Counts[$s]
        $Txt = $Txt -replace "(\| $Escaped \|)\s*[^|]+\|([^|]+)\|", "`$1 $N |`$2|"
    }
    Set-Content -Path $Index -Value $Txt -NoNewline
    git add $Index 2>$null | Out-Null
}

# If nothing staged, exit
git diff --cached --quiet
if ($LASTEXITCODE -eq 0) { exit 0 }

# Commit
$Phase = if ($env:CLAUDE_PHASE) { $env:CLAUDE_PHASE } else { 'Phase 0' }
$Agent = if ($env:CLAUDE_AGENT_NAME) { $env:CLAUDE_AGENT_NAME } else { 'orchestrator' }
$Summary = if ($env:CLAUDE_COMMIT_SUMMARY) { $env:CLAUDE_COMMIT_SUMMARY } else { 'batched vault writes' }
$Msg = "[$Phase] $Agent" + ": $Summary"

git commit -m "$Msg" 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    [Console]::Error.WriteLine("[subagent-stop-sync] git commit failed")
    exit 1
}

# Backfill pending CHANGELOG SHAs to the new HEAD sha
$Sha = git rev-parse --short HEAD
$Changelog = "$RepoRoot/obsidian-vault/00-Claude-Control/CHANGELOG.md"
if (Test-Path $Changelog) {
    $Content = Get-Content $Changelog -Raw
    if ($Content -match '\| pending\b') {
        $Content = $Content -replace '\| pending\b', "| $Sha"
        Set-Content -Path $Changelog -Value $Content -NoNewline
        git add $Changelog 2>$null | Out-Null
        git commit --amend --no-edit 2>$null | Out-Null
    }
}

# Push to every configured remote (upstream first, then origin, then any others)
$Remotes = New-Object System.Collections.ArrayList
foreach ($r in @('upstream', 'origin')) {
    git remote get-url $r 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { [void]$Remotes.Add($r) }
}
foreach ($r in (git remote)) {
    if ($Remotes -notcontains $r) { [void]$Remotes.Add($r) }
}

if ($Remotes.Count -eq 0) {
    [Console]::Error.WriteLine("[subagent-stop-sync] no remotes configured; cannot push")
    exit 1
}

$PushedTo = New-Object System.Collections.ArrayList
$Failed = New-Object System.Collections.ArrayList
$Sleeps = @(2, 4, 8, 16)
$MaxRetries = 4

foreach ($remote in $Remotes) {
    $Retries = 0
    while ($true) {
        git push -u $remote $Branch 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            [void]$PushedTo.Add($remote)
            break
        }
        if ($Retries -ge $MaxRetries) {
            [void]$Failed.Add($remote)
            break
        }
        Start-Sleep -Seconds $Sleeps[$Retries]
        $Retries++
    }
}

if ($PushedTo.Count -eq 0) {
    [Console]::Error.WriteLine("[subagent-stop-sync] all pushes failed: $($Failed -join ' ')")
    exit 1
}

$FailedSuffix = if ($Failed.Count -gt 0) { " (failed: $($Failed -join ' '))" } else { '' }
Write-Host "[subagent-stop-sync] pushed $Sha to: $($PushedTo -join ' ')$FailedSuffix"
exit 0
