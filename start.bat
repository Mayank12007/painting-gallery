@echo off
title Gallerist Art Gallery Launcher
echo ===================================================
echo     LAUNCHING GALLERIST ART GALLERY PLATFORM
echo ===================================================
echo.
echo Starting Express Backend API (Port 5000)...
start "Gallerist Backend Server" cmd /k "cd server && npm start"

timeout /t 2 >nul

echo Starting Vite React Storefront (Port 5175)...
start "Gallerist Frontend Client" cmd /k "cd client && npm run dev"

echo.
echo ===================================================
echo Application is running!
echo Storefront URL: http://localhost:5175
echo Admin Login:    admin@gallerist.in / admin123
echo Buyer Login:    buyer@example.com / user123
echo ===================================================
timeout /t 3 >nul
start http://localhost:5175
