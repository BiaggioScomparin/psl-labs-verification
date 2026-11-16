# ==============================================================================
# PSL LABS - IMPORTAÇÃO AUTOMÁTICA DO SCHEMA NA VPS
# ==============================================================================
$ErrorActionPreference = "Stop"

$IP = "184.107.176.201"
$schemaPath = "$PSScriptRoot\supabase\schema.sql"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   IMPORTANDO BANCO DE DADOS PSL LABS NA VPS ($IP)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $schemaPath)) {
    Write-Host "Arquivo schema.sql nao encontrado em: $schemaPath" -ForegroundColor Red
    exit 1
}

Write-Host "[1/2] Enviando schema.sql para a VPS..." -ForegroundColor Yellow
Write-Host "DICA: Digite a senha root da VPS se solicitado." -ForegroundColor DarkGray
scp -o StrictHostKeyChecking=accept-new "$schemaPath" "root@${IP}:/root/schema.sql"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao enviar arquivo via SCP." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/2] Executando schema dentro do container PostgreSQL do Supabase..." -ForegroundColor Yellow
$remoteCmd = "CONTAINER_ID=\$(docker ps -q -f name=db | head -n 1); if [ -z \"\$CONTAINER_ID\" ]; then echo 'Container Postgres nao encontrado!'; exit 1; fi; echo \"Container Postgres encontrado: \$CONTAINER_ID\"; docker exec -i \$CONTAINER_ID psql -U postgres -d postgres < /root/schema.sql; echo 'Banco de dados importado com sucesso!'"

ssh -o StrictHostKeyChecking=accept-new -t "root@${IP}" $remoteCmd

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " BANCO DE DADOS CRIADO E POPULADO COM SUCESSO NA VPS!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
