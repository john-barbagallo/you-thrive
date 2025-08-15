Write-Host "Starting deployment..." -ForegroundColor Green
npm run build
Write-Host "Deploying to Firebase..." -ForegroundColor Blue
firebase deploy
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git add .
$message = Read-Host "Enter commit message (or press Enter for default)"
if ([string]::IsNullOrWhiteSpace($message)) {
    $message = "Update app - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}
git commit -m $message
git push
Write-Host "Complete!" -ForegroundColor Green
Write-Host "Live at: https://you-thrive.web.app" -ForegroundColor Cyan