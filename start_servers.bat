
@echo off
echo Starting Carometro Alunos...
start "Carometro Alunos" /d "..\..\Carometro dos Alunos" npm run dev

echo Starting Carometro Funcionarios...
start "Carometro Funcionarios" /d "..\..\Crometro dos Funcionarios\CAROMETRO_FUNCIONARIOS" npm run dev

echo All services started!
pause
