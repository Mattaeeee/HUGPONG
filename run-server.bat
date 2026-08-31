@echo off
setlocal
set "ROOT=%~dp0"
cd /d "%ROOT%server"
title HUGPONG Backend Sync Server
echo Starting HUGPONG Backend Server...
node server.js
pause
