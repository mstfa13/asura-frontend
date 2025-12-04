# Asura Life Tracker Launcher
# This script builds and serves your life tracking app

param(
    [switch]$Dev,
    [switch]$Build
)

$projectPath = $PSScriptRoot
$appName = "Asura Life Tracker"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "     $appName Launcher" -ForegroundColor Cyan  
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $projectPath

if ($Dev) {
    Write-Host "Starting in Development Mode..." -ForegroundColor Yellow
    Write-Host "App will be available at: http://localhost:5173" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
    Write-Host ""
    
    Start-Sleep 2
    Start-Process "http://localhost:5173"
    npm run dev
} elseif ($Build) {
    Write-Host "Building production version..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build successful! Starting server..." -ForegroundColor Green
        Write-Host "App will be available at: http://localhost:4173" -ForegroundColor Green
        Write-Host "Press Ctrl+C to stop" -ForegroundColor Gray
        Write-Host ""
        
        Start-Sleep 2
        Start-Process "http://localhost:4173"
        npm run preview
    } else {
        Write-Host "Build failed!" -ForegroundColor Red
        pause
    }
} else {
    Write-Host "Choose an option:" -ForegroundColor Yellow
    Write-Host "1. Development Mode (faster startup, live reload)"
    Write-Host "2. Production Mode (optimized, faster app)"
    Write-Host ""
    $choice = Read-Host "Enter choice (1 or 2)"
    
    if ($choice -eq "1") {
        & $PSCommandPath -Dev
    } elseif ($choice -eq "2") {
        & $PSCommandPath -Build  
    } else {
        Write-Host "Invalid choice. Starting Development Mode..." -ForegroundColor Yellow
        & $PSCommandPath -Dev
    }
}
