#!/bin/bash
# deploy.sh - Build, Deploy to Firebase, and Push to GitHub

echo "🚀 Starting deployment process..."

# Build the app
echo "📦 Building app..."
npm run build

# Deploy to Firebase
echo "☁️ Deploying to Firebase..."
firebase deploy

# Add all changes to git
echo "📝 Committing to Git..."
git add .

# Get commit message from user or use default
read -p "Enter commit message (or press Enter for default): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="Update app - $(date '+%Y-%m-%d %H:%M')"
fi

git commit -m "$commit_msg"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push

echo "✅ Deployment complete!"
echo "🌐 Live at: https://you-thrive.web.app"
echo "💻 GitHub: https://github.com/john-barbagallo/you-thrive"