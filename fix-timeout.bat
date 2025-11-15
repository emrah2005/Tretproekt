@echo off
REM ========================================
REM Fix Timeout - Automated Script
REM ========================================
REM This script pulls the latest changes and clears all Laravel caches

echo.
echo ========================================
echo Influenita API - Timeout Fix Script
echo ========================================
echo.

REM Check if we're in the right directory
if not exist "artisan" (
    echo ERROR: This script must be run from the Tretproekt root directory!
    echo Expected: C:\Users\emrah\Desktop\tretproekt\Tretproekt
    pause
    exit /b 1
)

echo [1/5] Pulling latest changes from GitHub...
git pull origin main
if errorlevel 1 (
    echo ERROR: Git pull failed. Make sure Git is installed and you have internet connection.
    pause
    exit /b 1
)

echo.
echo [2/5] Clearing Laravel config cache...
php artisan config:clear

echo.
echo [3/5] Clearing Laravel application cache...
php artisan cache:clear

echo.
echo [4/5] Clearing Laravel route cache...
php artisan route:clear

echo.
echo [5/5] Clearing Laravel view cache...
php artisan view:clear

echo.
echo ========================================
echo SUCCESS! All caches cleared.
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Restart Apache in XAMPP Control Panel (Stop then Start)
echo 2. Reload: http://localhost/tretproekt/Tretproekt/public/
echo 3. You should see a JSON welcome message
echo.
echo If you still see the old page:
echo - Hard refresh: Ctrl+Shift+R or Ctrl+F5
echo - Clear browser cache: Ctrl+Shift+Delete
echo.
pause
