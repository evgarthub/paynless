
Write-Host "Starting backend..."
Set-Location  .\content-management
Start-Job -ScriptBlock { Start-Process yarn start }

Write-Host "Starting frontend..."
Set-Location ..\ui
Start-Job -ScriptBlock { Start-Process yarn start }