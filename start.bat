@echo off
echo ========================================
echo   E-Carte UCA - Demarrage Application
echo ========================================
echo.

echo [1/3] Verification PostgreSQL...
docker ps | findstr carte_postgres >nul
if %errorlevel% neq 0 (
    echo PostgreSQL non demarre, demarrage...
    docker compose up -d
    timeout /t 3 >nul
) else (
    echo PostgreSQL deja actif
)

echo.
echo [2/3] Installation dependances...
call pnpm install --silent

echo.
echo [3/3] Demarrage application...
echo.
echo ========================================
echo   Application prete !
echo   Ouvrir : http://localhost:3001
echo ========================================
echo.
echo Appuyez sur Ctrl+C pour arreter
echo.

cd apps\ecarte
call pnpm dev
