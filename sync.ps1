# E-Clean - Script de synchronisation automatique
# Ce script synchronise automatiquement le projet avec GitHub

param(
    [string]$Branch = "main",
    [switch]$Auto
)

$ErrorActionPreference = "Stop"

# Colors
$Green = "`e[32m"
$Yellow = "`e[33m"
$Reset = "`e[0m"

function Write-Status {
    param([string]$Message, [string]$Type = "info")
    $color = if ($Type -eq "success") { $Green } elseif ($Type -eq "warning") { $Yellow } else { "" }
    Write-Host "$color$Message$Reset"
}

Write-Status "🔄 E-Clean - Synchronisation GitHub" "info"

# Fetch latest
Write-Status "📥 Récupération des dernières modifications..."
git fetch origin

# Check for updates
$local = git rev-parse HEAD
$remote = git rev-parse origin/$Branch

if ($local -eq $remote) {
    Write-Status "✅ Déjà à jour avec GitHub" "success"
    exit 0
}

# Show differences
$behind = git rev-list --count origin/$Branch..HEAD
$ahead = git rev-list --count HEAD..origin/$Branch

if ($behind -gt 0) {
    Write-Status "📤 $behind commit(s) à pousser"
    git push origin $Branch
}

if ($ahead -gt 0) {
    Write-Status "📥 $ahead commit(s) à récupérer"
    git pull origin $Branch
}

Write-Status "✅ Synchronisation terminée !" "success"