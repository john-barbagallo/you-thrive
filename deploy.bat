@echo off
echo 🚀 Starting deployment process...

echo 📦 Building app...
call npm run build

echo ☁️ Deploying to Firebase...
call firebase deploy

echo 📝 Committing to Git...
git add .

set /p commit_msg="Enter commit message (or press Enter for default): "
if "%commit_msg%"=="" set commit_msg=Update app - %date% %time%

git commit -m "%commit_msg%"

echo 📤 Pushing to GitHub...
git push

echo ✅ Deployment complete!
echo 🌐 Live at: https://you-thrive.web.app
echo 💻 GitHub: https://github.com/john-barbagallo/you-thrive
pause