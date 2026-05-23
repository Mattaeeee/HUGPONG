@echo off
setlocal
set "ROOT=%~dp0"
cd /d "%ROOT%mobile"
title HUGPONG Expo Mobile App
echo Starting HUGPONG Expo Mobile App...
npm start
pause
