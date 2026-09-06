$ErrorActionPreference = 'Stop'

$sourceFile = Join-Path $PSScriptRoot 'click-particles.js'
$spicetifyFolder = Join-Path $env:APPDATA 'spicetify'
$extensionsFolder = Join-Path $spicetifyFolder 'Extensions'
$destinationFile = Join-Path $extensionsFolder 'click-particles.js'

if (-not (Test-Path -LiteralPath $sourceFile -PathType Leaf)) {
    throw "Could not find $sourceFile"
}
if (-not (Get-Command spicetify -ErrorAction SilentlyContinue)) {
    throw 'Spicetify is not installed or is not available in PowerShell.'
}

New-Item -ItemType Directory -Path $extensionsFolder -Force | Out-Null
Copy-Item -LiteralPath $sourceFile -Destination $destinationFile -Force

$configPath = (& spicetify -c).Trim()
$extensionsLine = Get-Content -LiteralPath $configPath | Where-Object { $_ -match '^extensions\s*=' } | Select-Object -First 1
if ($extensionsLine -notmatch '(^|\|)\s*click-particles\.js(\||\s*$)') {
    & spicetify config extensions click-particles.js
}

& spicetify apply
Write-Host 'Particle Effects is installed. Restart Spotify to use it.' -ForegroundColor Green
