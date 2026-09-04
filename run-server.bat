@echo off
setlocal
cd /d "%~dp0server"
title HUGPONG Backend Sync Server
echo Starting HUGPONG Backend Server on http://localhost:3000...
node server.js
pause

