@echo off
REM 8 Ball Pool Auto-Win Mod - Installation Script for Windows

echo 8 Ball Pool Auto-Win Mod - Windows Installer
echo ============================================
echo.

REM Check if APK file is provided
if "%~1"==" " (
    echo Usage: install_mod.bat ^<path_to_modded_apk^>
    echo Example: install_mod.bat 8BallPool_MOD.apk
    pause
    exit /b 1
)

set APK_FILE=%~1

echo Checking for ADB...
where adb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: ADB not found! Please install Android SDK Platform Tools.
    pause
    exit /b 1
)

echo.
echo Checking for connected devices...
adb devices

echo.
echo Installing mod APK: %APK_FILE%
adb install "%APK_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo Installation successful!
    echo Launch 8 Ball Pool to start using the mod.
    echo ============================================
) else (
    echo.
    echo Error: Installation failed!
    echo Please check your device connection.
)

pause
