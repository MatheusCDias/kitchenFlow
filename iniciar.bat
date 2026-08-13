@echo off
REM Script de inicializacao do KitchenFlow.
REM Liga o servidor (backend) e o site, e abre o navegador sozinho.
REM Para virar um .exe: aponte seu conversor (Antigravity) para este arquivo.
REM IMPORTANTE: a pasta inteira do projeto precisa estar junto do .exe
REM nessa outra maquina, nao so o .exe sozinho.

cd /d "%~dp0"

echo ============================================
echo   KitchenFlow - Iniciando
echo ============================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao esta instalado nesse computador.
    echo Baixe e instale em https://nodejs.org antes de continuar.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo Primeira vez rodando aqui - instalando dependencias do site...
    echo ^(isso pode demorar alguns minutos^)
    call npm install
    if %errorlevel% neq 0 (
        echo ERRO ao instalar dependencias do site.
        pause
        exit /b 1
    )
)

if not exist "backend\node_modules" (
    echo Primeira vez rodando aqui - instalando dependencias do servidor...
    cd backend
    call npm install
    cd ..
    if %errorlevel% neq 0 (
        echo ERRO ao instalar dependencias do servidor.
        pause
        exit /b 1
    )
)

echo Ligando o servidor...
start "KitchenFlow - Servidor" cmd /k "cd backend && npm run dev"

timeout /t 5 /nobreak >nul

echo Ligando o site...
start "KitchenFlow - Site" cmd /k "npm run web"

echo.
echo Aguardando tudo ficar pronto...
timeout /t 12 /nobreak >nul

echo Abrindo o navegador...
start http://localhost:8081

echo.
echo ============================================
echo   Pronto! Se o navegador nao abriu sozinho,
echo   acesse: http://localhost:8081
echo.
echo   Para outros aparelhos na mesma rede local
echo   acessarem, use o IP dessa maquina em vez de
echo   "localhost" (ex: http://192.168.X.X:8081).
echo ============================================
echo.
pause
