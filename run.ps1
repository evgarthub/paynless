
Write-Host "Starting backend..."
Start-Process powershell .\content-management\run.ps1

Write-Host "Starting frontend..."
Start-Process powershell .\ui\run.ps1