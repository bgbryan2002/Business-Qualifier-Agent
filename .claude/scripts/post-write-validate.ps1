# PostToolUse(Write|Edit|MultiEdit|NotebookEdit) — validate frontmatter, append CHANGELOG, git add.
$ErrorActionPreference = 'SilentlyContinue'

$RepoRoot = (git rev-parse --show-toplevel 2>$null)
if (-not $RepoRoot) { $RepoRoot = (Get-Location).Path }
$RepoRoot = $RepoRoot -replace '\\','/'

$Stdin = [Console]::In.ReadToEnd()
try {
    $D = $Stdin | ConvertFrom-Json
} catch {
    exit 0
}

$Ti = if ($D.tool_input) { $D.tool_input } else { $D }
$TargetPath = $null
foreach ($field in @('file_path', 'notebook_path', 'path')) {
    $v = $Ti.$field
    if ($v) { $TargetPath = $v; break }
}
if (-not $TargetPath) { exit 0 }

if ($TargetPath -match '^([a-zA-Z]:|/)') {
    $AbsPath = $TargetPath
} else {
    $AbsPath = "$RepoRoot/$TargetPath"
}
$AbsPath = $AbsPath -replace '\\','/'

if (-not (Test-Path $AbsPath)) { exit 0 }

$RelPath = $AbsPath
if ($AbsPath.StartsWith("$RepoRoot/")) { $RelPath = $AbsPath.Substring("$RepoRoot/".Length) }

# Frontmatter validation (warn-only) — vault markdown outside 99-Human/
if ($AbsPath -match "$RepoRoot/obsidian-vault/" -and
    -not $AbsPath.StartsWith("$RepoRoot/obsidian-vault/99-Human/") -and
    $AbsPath -match '\.md$') {

    $Required = @('id','title','note_type','category','source_url','source_type','license','confidence','as_of_date','validator_id','status')
    $HeadContent = Get-Content $AbsPath -TotalCount 100 -ErrorAction SilentlyContinue
    if ($HeadContent) {
        if ($HeadContent[0] -ne '---') {
            [Console]::Error.WriteLine("[post-write-validate] WARN: $RelPath has no YAML frontmatter (vault markdown should)")
        } else {
            $FmEnd = -1
            for ($i = 1; $i -lt $HeadContent.Count; $i++) {
                if ($HeadContent[$i] -eq '---') { $FmEnd = $i; break }
            }
            if ($FmEnd -gt 0) {
                $Fm = $HeadContent[1..($FmEnd - 1)] -join "`n"
                $Missing = $Required | Where-Object { $Fm -notmatch "(?m)^$($_):" }
                if ($Missing.Count -gt 0) {
                    [Console]::Error.WriteLine("[post-write-validate] WARN: $RelPath missing required frontmatter fields: $($Missing -join ', ')")
                }
            }
        }
    }
}

# Append CHANGELOG.md (vault writes only)
if ($AbsPath -match "$RepoRoot/obsidian-vault/") {
    $Changelog = "$RepoRoot/obsidian-vault/00-Claude-Control/CHANGELOG.md"
    if (Test-Path $Changelog) {
        $Agent = if ($env:CLAUDE_AGENT_NAME) { $env:CLAUDE_AGENT_NAME } else { 'orchestrator' }
        $Ts = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        Add-Content -Path $Changelog -Value "$Ts | $Agent | $RelPath | pending"
    }
}

git add -- $AbsPath 2>$null | Out-Null

exit 0
