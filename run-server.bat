@echo off
setlocal
set "ROOT=%~dp0"
cd /d "%ROOT%"
title HUGPONG Backend Sync Server
echo Starting HUGPONG Mock Sync Server...
node server.js
pause
