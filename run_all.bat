@echo off
echo ===================================================
echo   PantryPilot - Smart Pantry Assistant Launcher
echo ===================================================

set PATH=C:\Users\SRIHARISH\.gemini\antigravity\scratch\nodejs;%PATH%

echo Starting Backend Server on http://127.0.0.1:8000 ...
start "PantryPilot Backend" cmd /k "cd /d %~dp0backend && py start_server.py"

timeout /t 2 /nobreak >nul

echo Starting Frontend Dev Server on http://127.0.0.1:5173 ...
start "PantryPilot Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ===================================================
echo PantryPilot is running!
echo Frontend: http://127.0.0.1:5173
echo Backend API & Production App: http://127.0.0.1:8000
echo ===================================================
