@echo off
title HUGPONG Web Console ^& Server
cd /d "%~dp0server"

echo ========================================================
echo   Starting HUGPONG Backend Server ^& Web Console...
echo ========================================================
echo.
echo Opening Web Browser at http://localhost:3000/login.html ...
start "" "http://localhost:3000/login.html"

echo Starting server with Node.js on http://localhost:3000 ...
echo (Keep this window OPEN while using HUGPONG)
echo.
node server.js

echo.
echo Server has stopped.
pause

