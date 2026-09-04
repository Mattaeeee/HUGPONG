@echo off
title HUGPONG Mobile App (Expo)
cd /d "%~dp0mobile"

echo ========================================================
echo   Starting HUGPONG Expo Mobile App...
echo ========================================================
echo.
echo Starting Expo Metro Bundler...
echo (Keep this window OPEN while running the mobile app)
echo.
npm start

echo.
echo Mobile app has stopped.
pause

