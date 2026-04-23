# Station 24 Fitness - Push to GitHub (PowerShell version)
# Run: Right-click this file -> "Run with PowerShell"
# Or in PowerShell:  .\push-to-github.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "======================================================" -ForegroundColor Red
Write-Host "   Station 24 Fitness - Push to GitHub" -ForegroundColor Red
Write-Host "======================================================" -ForegroundColor Red
Write-Host ""

# Check git
try {
    $gitVersion = git --version
    Write-Host "[OK] $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Git not installed. Download: https://git-scm.com/download/win" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Clean broken .git
if (Test-Path ".git/config.lock") {
    Write-Host "[!] Removing broken .git folder..." -ForegroundColor Yellow
    try {
        Remove-Item ".git" -Recurse -Force
        Write-Host "[OK] Cleaned" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] Cannot delete .git folder: $_" -ForegroundColor Red
        Write-Host "Please delete manually: $PSScriptRoot\.git"
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Get input
Write-Host ""
$username = Read-Host "Enter your GitHub username"
if ([string]::IsNullOrWhiteSpace($username)) { Write-Host "[ERROR] Username required" -ForegroundColor Red; Read-Host "Enter to exit"; exit 1 }

$repoName = Read-Host "Repository name [station24-dashboard]"
if ([string]::IsNullOrWhiteSpace($repoName)) { $repoName = "station24-dashboard" }

$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   User : $username"
Write-Host "   Repo : $repoName"
Write-Host "   URL  : $repoUrl"
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Create repo on GitHub first (if not done):"
Write-Host "   https://github.com/new" -ForegroundColor Yellow
Write-Host "   Name: $repoName (do NOT add README)"
Write-Host ""
Read-Host "Press Enter to continue"

try {
    Write-Host "`n[1/6] Initializing git..." -ForegroundColor Cyan
    if (-not (Test-Path ".git")) { git init -b main }

    Write-Host "[2/6] Configuring user..." -ForegroundColor Cyan
    git config user.name $username
    git config user.email "$username@users.noreply.github.com"

    Write-Host "[3/6] Adding files..." -ForegroundColor Cyan
    git add .

    Write-Host "[4/6] Committing..." -ForegroundColor Cyan
    git commit -m "Station 24 Fitness Sales Dashboard" 2>&1 | Out-Host

    Write-Host "[5/6] Setting remote..." -ForegroundColor Cyan
    git remote remove origin 2>$null
    git remote add origin $repoUrl

    Write-Host "[6/6] Pushing..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "If prompted for password: paste your Personal Access Token" -ForegroundColor Yellow
    Write-Host "Get token: https://github.com/settings/tokens (scope: repo)" -ForegroundColor Yellow
    Write-Host ""
    git push -u origin main

    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host "   SUCCESS! Pushed to GitHub" -ForegroundColor Green
    Write-Host "======================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "View: https://github.com/$username/$repoName"
    Write-Host "Deploy on Vercel: https://vercel.com/new" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "[ERROR] $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common fixes:"
    Write-Host "  1. Create repo first at https://github.com/new (name: $repoName)"
    Write-Host "  2. Use Personal Access Token as password, not GitHub password"
    Write-Host "  3. If 'rejected', run: git pull origin main --allow-unrelated-histories"
    Write-Host ""
}

Read-Host "Press Enter to exit"
