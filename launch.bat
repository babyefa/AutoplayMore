@echo off
title Starting AutoPlay...

echo.
echo 🔧 Starting local e621 proxy...
start cmd /k "cd /d %~dp0 && node proxy.js"

timeout /t 1 >nul

echo.
echo 🚀 Starting frontend server...
start cmd /k "cd /d %~dp0 && npx serve"

timeout /t 2 >nul

echo.
echo 🌐 Launching in browser...
start http://localhost:5000

exit
