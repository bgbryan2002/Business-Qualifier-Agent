# PreToolUse(Write|Edit|MultiEdit|NotebookEdit) — block writes outside allowed paths and to human-authored notes.
# Reads tool input JSON from stdin. Exits 0 to allow, 2 to block (with stderr message shown to Claude).
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

# Normalize to forward-slash absolute path
if ($TargetPath -match '^([a-zA-Z]:|/)') {
    $AbsPath = $TargetPath
} else {
    $AbsPath = "$RepoRoot/$TargetPath"
}
$AbsPath = $AbsPath -replace '\\','/'

# Reject path traversal
if ($AbsPath -match '\.\.') {
    [Console]::Error.WriteLine("BLOCKED: path traversal not allowed: $TargetPath")
    exit 2
}

# Allowed prefixes
$AllowedPrefixes = @(
    "$RepoRoot/obsidian-vault/",
    "$RepoRoot/apps/",
    "$RepoRoot/.claude/",
    "$RepoRoot/inputs/"
)

# Root-level allowed filenames
$BaseName = [System.IO.Path]::GetFileName($AbsPath)
$DirName = [System.IO.Path]::GetDirectoryName($AbsPath) -replace '\\','/'
$RootLevelAllow = $false
if ($DirName -eq $RepoRoot) {
    if ($BaseName -match '\.(md|json)$' -or
        $BaseName -in @('.gitignore','LICENSE','package.json','package-lock.json','tsconfig.json','HANDOFF.md','RUN-LOG.md') -or
        $BaseName -match '^README') {
        $RootLevelAllow = $true
    }
}

$WithinAllowed = $false
foreach ($prefix in $AllowedPrefixes) {
    if ($AbsPath.StartsWith($prefix)) { $WithinAllowed = $true; break }
}

if (-not $WithinAllowed -and -not $RootLevelAllow) {
    [Console]::Error.WriteLine("BLOCKED: writes are confined to obsidian-vault/, apps/, .claude/, inputs/, and root-level config files. Rejected: $TargetPath")
    exit 2
}

# Block 99-Human/
if ($AbsPath.StartsWith("$RepoRoot/obsidian-vault/99-Human/")) {
    [Console]::Error.WriteLine("BLOCKED: human-authored folder is protected.")
    exit 2
}

# Check existing vault file for human-authored markers
if ((Test-Path $AbsPath) -and $AbsPath.StartsWith("$RepoRoot/obsidian-vault/")) {
    $HeadContent = Get-Content $AbsPath -TotalCount 50 -ErrorAction SilentlyContinue
    if ($HeadContent) {
        $HeadText = $HeadContent -join "`n"
        if ($HeadText -match '(?m)^\s*-\s*human-authored\s*$' -or
            $HeadText -match '(?m)^\s*tags:.*human-authored' -or
            $HeadText -match '#human-authored' -or
            $HeadText -match '<!--\s*human-authored\s*-->' -or
            $HeadText -match '(?m)^validator_id:\s*human\s*$') {
            [Console]::Error.WriteLine("BLOCKED: human-authored folder is protected.")
            exit 2
        }
        # Frontmatter without validator_id -> treat as human-authored
        if ($HeadContent[0] -eq '---') {
            $FmEnd = -1
            for ($i = 1; $i -lt $HeadContent.Count; $i++) {
                if ($HeadContent[$i] -eq '---') { $FmEnd = $i; break }
            }
            if ($FmEnd -gt 0) {
                $Fm = $HeadContent[1..($FmEnd - 1)] -join "`n"
                if ($Fm -notmatch '(?m)^validator_id:') {
                    [Console]::Error.WriteLine("BLOCKED: human-authored folder is protected.")
                    exit 2
                }
            }
        }
    }
}

exit 0
