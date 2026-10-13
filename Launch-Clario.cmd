@echo off
setlocal DisableDelayedExpansion
if not exist "%~dp0index.html" goto missing
if not exist "%~dp0app.js" goto missing
if not exist "%~dp0styles.css" goto missing
if not exist "%~dp0editor-core.js" goto missing
if not exist "%~dp0media.js" goto missing
set "CLARIO_URL=file:///%~dp0index.html"
set "CLARIO_URL=%CLARIO_URL:\=/%"
set "CLARIO_BROWSER="
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" set "CLARIO_BROWSER=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "CLARIO_BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "CLARIO_BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if exist "%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe" set "CLARIO_BROWSER=%LOCALAPPDATA%\Microsoft\Edge\Application\msedge.exe"
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "CLARIO_BROWSER=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "CLARIO_BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined CLARIO_BROWSER goto fallback
start "" "%CLARIO_BROWSER%" "--app=%CLARIO_URL%"
if errorlevel 1 goto fallback
exit /b 0
:fallback
start "" "%~dp0index.html"
if errorlevel 1 goto failed
exit /b 0
:missing
 echo Clario files are missing. Extract the ENTIRE ZIP, then run this launcher.
 echo Do not run the launcher from inside the ZIP preview.
pause
exit /b 1
:failed
 echo Windows could not open Clario. Open index.html manually with Edge or Chrome.
 echo If this is a managed computer, ask IT whether launch scripts are blocked.
pause
exit /b 1
