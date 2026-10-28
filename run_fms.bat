@echo off
title CollegeSync Fee Management System (FMS) - Advance Java Backend
echo =====================================================================
echo   Starting CollegeSync Fee Management System (FMS) - Advance Java
echo =====================================================================
echo.
cd /d "%~dp0fms-java-backend"
call mvn.bat spring-boot:run
pause
