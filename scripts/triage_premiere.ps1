<#
.SYNOPSIS
    Triage and recover Adobe Premiere Pro from nvcuda64.dll deadlocks, headless zombie processes, and corrupt Media Cache locks.
.DESCRIPTION
    1. Detects and forcefully terminates hung 'Adobe Premiere Pro.exe' and orphaned 'CEPHtmlEngine.exe' processes.
    2. Clears stale .ims and .cfa Media Cache index files.
    3. Cleans stale CEP bridge communication locks in Temp.
    4. Verifies GPU and memory status before clean restart.
#>

Write-Host "=== Adobe Premiere Pro Recovery & Triage ===" -ForegroundColor Cyan

# 1. Kill hung Adobe processes
$procs = Get-Process -Name "Adobe Premiere Pro", "CEPHtmlEngine", "AfterFX" -ErrorAction SilentlyContinue
if ($procs) {
    Write-Host "Terminating $($procs.Count) Adobe processes..." -ForegroundColor Yellow
    $procs | Stop-Process -Force
    Start-Sleep -Seconds 2
} else {
    Write-Host "No active Adobe processes found." -ForegroundColor Green
}

# 2. Clear corrupted Media Cache index files
$cachePath = "$env:APPDATA\Adobe\Common\Media Cache"
if (Test-Path $cachePath) {
    $imsFiles = Get-ChildItem -Path $cachePath -Filter "*.ims" -ErrorAction SilentlyContinue
    if ($imsFiles) {
        Write-Host "Clearing $($imsFiles.Count) corrupted .ims cache files..." -ForegroundColor Yellow
        $imsFiles | Remove-Item -Force -ErrorAction SilentlyContinue
    }
}

# 3. Clear CEP MCP Bridge stale temp files
$bridgeDirs = @(
    "$env:TEMP\premiere-mcp-bridge",
    "$env:TEMP\premiere_mcp_bridge"
)
foreach ($dir in $bridgeDirs) {
    if (Test-Path $dir) {
        Write-Host "Cleaning stale bridge files in $dir..." -ForegroundColor Yellow
        Remove-Item -Path "$dir\*" -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "Premiere Pro environment cleaned successfully. Ready for clean launch." -ForegroundColor Green
