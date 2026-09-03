@echo off
setlocal
set "ROOT=%~dp0"
title Opening HUGPONG Web Console...

echo Checking HUGPONG Backend Server status...

:: Check if server is running on port 3000. If not, start it in a separate window
netstat -ano | findstr /i ":3000" | findstr /i "LISTENING" >nul
if errorlevel 1 (
    echo Starting Backend Server on http://localhost:3000...
    start "HUGPONG Backend Sync Server" cmd /k "cd /d "%ROOT%server" && title HUGPONG Backend Sync Server && echo Starting HUGPONG Backend Server... && node server.js"
    echo Waiting for server to initialize...
    timeout /t 2 /nobreak >nul
) else (
    echo Backend Server is already running.
)

echo Opening HUGPONG Web Console in your browser...
explorer "http://localhost:3000/login.html"
exit


