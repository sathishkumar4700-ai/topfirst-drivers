# Run once in PowerShell: Right-click → Run with PowerShell
# Installs TN News to run automatically when you sign in to Windows.

$ProjectDir = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$BatSource = Join-Path $PSScriptRoot "autorun.bat"
$StartupFolder = [Environment]::GetFolderPath("Startup")
$ShortcutPath = Join-Path $StartupFolder "TN-News-Daily.bat"

Copy-Item $BatSource $ShortcutPath -Force
# Ensure PROJECT_DIR in copied bat points correctly — rewrite bat in Startup
@"
@echo off
cd /d "$ProjectDir"
call .venv\Scripts\activate.bat
python -m app.cli boot >> data\boot.log 2>&1
"@ | Set-Content -Path $ShortcutPath -Encoding ASCII

Write-Host "Installed auto-start: $ShortcutPath"
Write-Host "Next time you log in to Windows, today's videos will be created (once per day)."
