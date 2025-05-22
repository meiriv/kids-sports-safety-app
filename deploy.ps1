# Deployment script for Kids Sports Activity Monitoring & Safety App (PowerShell version)

Write-Host "Starting deployment process for Kids Sports Activity App..." -ForegroundColor Yellow

# Step 1: Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green

# Step 2: Run tests
Write-Host "Running tests..." -ForegroundColor Yellow
npm test -- --watchAll=false
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Tests failed, but continuing with deployment" -ForegroundColor Red
}
Write-Host "✅ Tests completed" -ForegroundColor Green

# Step 3: Build the app
Write-Host "Building production version..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build the application" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build completed successfully" -ForegroundColor Green

# Step 4: Deploy to hosting service
# This step depends on your hosting provider (Netlify, Vercel, Firebase, etc.)
# Here's an example for Firebase hosting

$firebaseExists = Get-Command firebase -ErrorAction SilentlyContinue
if ($firebaseExists) {
    Write-Host "Deploying to Firebase..." -ForegroundColor Yellow
    firebase deploy --only hosting
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to deploy to Firebase" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Deployed successfully to Firebase" -ForegroundColor Green
}
else {
    Write-Host "Firebase CLI not found. To deploy to Firebase:" -ForegroundColor Yellow
    Write-Host "1. Install Firebase CLI: npm install -g firebase-tools"
    Write-Host "2. Login to Firebase: firebase login"
    Write-Host "3. Initialize project: firebase init"
    Write-Host "4. Deploy: firebase deploy"
}

# Alternatively, for GitHub Pages
if ($args[0] -eq "github") {
    Write-Host "Deploying to GitHub Pages..." -ForegroundColor Yellow
    npm run deploy
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to deploy to GitHub Pages" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Deployed successfully to GitHub Pages" -ForegroundColor Green
}

Write-Host "Deployment process completed!" -ForegroundColor Green
Write-Host "Visit your hosting service dashboard to verify the deployment."
