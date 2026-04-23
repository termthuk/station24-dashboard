@echo off
REM Station 24 Fitness - Push to GitHub
REM If you see this window close immediately, run from Command Prompt instead:
REM   cd C:\Users\FITNESS\station24-dashboard
REM   push-to-github.bat

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ======================================================
echo    Station 24 Fitness - Push to GitHub
echo ======================================================
echo.

REM Check git installed
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed or not in PATH.
    echo Download: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo [OK] Git detected:
git --version
echo.

REM Clean broken .git if exists
if exist ".git\config.lock" (
    echo [!] Found broken .git folder, cleaning...
    rmdir /s /q ".git" 2>nul
    if exist ".git" (
        echo [ERROR] Cannot remove .git folder automatically.
        echo Please delete the .git folder manually and run again.
        echo Folder: %~dp0.git
        pause
        exit /b 1
    )
    echo [OK] Cleaned.
    echo.
)

REM Get user input
set /p USERNAME=Enter your GitHub username:
if "%USERNAME%"=="" (
    echo [ERROR] Username is required.
    pause
    exit /b 1
)

set /p REPONAME=Repository name [station24-dashboard]:
if "%REPONAME%"=="" set REPONAME=station24-dashboard

echo.
echo ======================================================
echo   Username : %USERNAME%
echo   Repo     : %REPONAME%
echo   URL      : https://github.com/%USERNAME%/%REPONAME%.git
echo ======================================================
echo.
echo IMPORTANT: Create the repo on GitHub first (if not done):
echo   https://github.com/new
echo   Name: %REPONAME%  (do NOT add README)
echo.
pause

echo.
echo [Step 1/6] Initializing git repo...
if not exist ".git" (
    git init -b main
    if errorlevel 1 goto :failed
) else (
    echo [skip] .git already exists
)

echo.
echo [Step 2/6] Configuring git user...
git config user.name "%USERNAME%"
git config user.email "%USERNAME%@users.noreply.github.com"

echo.
echo [Step 3/6] Adding files...
git add .

echo.
echo [Step 4/6] Committing...
git commit -m "Station 24 Fitness Sales Dashboard"
if errorlevel 1 (
    echo [info] Nothing to commit or already committed. Continuing...
)

echo.
echo [Step 5/6] Setting remote...
git remote remove origin 2>nul
git remote add origin https://github.com/%USERNAME%/%REPONAME%.git
if errorlevel 1 goto :failed

echo.
echo [Step 6/6] Pushing to GitHub...
echo.
echo If prompted for password, paste your Personal Access Token.
echo Get token at: https://github.com/settings/tokens (scope: repo)
echo.
git push -u origin main
if errorlevel 1 goto :pushfailed

echo.
echo ======================================================
echo    SUCCESS! Pushed to GitHub.
echo ======================================================
echo.
echo View: https://github.com/%USERNAME%/%REPONAME%
echo.
echo Next step - Deploy on Vercel:
echo   https://vercel.com/new
echo.
pause
exit /b 0

:failed
echo.
echo [ERROR] A git command failed. See messages above.
pause
exit /b 1

:pushfailed
echo.
echo [ERROR] Push failed. Common causes:
echo.
echo   1. Repository "%REPONAME%" does not exist on GitHub yet.
echo      Create it at: https://github.com/new
echo.
echo   2. Wrong username or token.
echo      Generate token at: https://github.com/settings/tokens
echo      Scope needed: repo
echo.
echo   3. Repo already has content (e.g. README).
echo      Run:  git pull origin main --allow-unrelated-histories
echo      Then: git push
echo.
echo   4. To force overwrite (careful): git push -f origin main
echo.
pause
exit /b 1
