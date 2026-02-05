@echo off
echo Starting Carometro Alunos (Port 3001)...
start "Carometro Alunos" /d "..\..\Carometro dos Alunos" npm run dev -- --port 3001 --strictPort

echo All services started!
echo Please check the newly opened terminal windows for any errors.
pause
