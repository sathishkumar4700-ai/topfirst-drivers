@echo off
REM TN News — runs once when Windows starts (after login). Edit PROJECT_DIR below.
set PROJECT_DIR=%~dp0..\..
cd /d "%PROJECT_DIR%"
call .venv\Scripts\activate.bat
python -m app.cli boot >> data\boot.log 2>&1
