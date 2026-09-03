@echo off
setlocal
set "ROOT=%~dp0"
cd /d "%ROOT%server"
title HUGPONG Backend Sync Server
echo Starting HUGPONG Backend Server...
start "" explorer "http://localhost:3000/login.html"
node server.js
pause

