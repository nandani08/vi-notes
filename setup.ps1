# Vi-Notes Paste Detection - Windows Setup Script

Write-Host "╔═════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║    Vi-Notes Paste Detection - Initialization Script         ║" -ForegroundColor Cyan
Write-Host "╚═════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16+" -ForegroundColor Red
    exit 1
}

$nodeVersion = node --version
Write-Host "✅ Node.js detected: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Push-Location server
npm install
Pop-Location
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Write-Host ""

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Push-Location client
npm install
Pop-Location
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

# Create .env file if it doesn't exist
if (-not (Test-Path server/.env)) {
    Write-Host "🔧 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item server/.env.example server/.env
    Write-Host "✅ .env file created. Please update MongoDB URI if needed." -ForegroundColor Green
}
Write-Host ""

Write-Host "╔═════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║             🎉 Setup Complete!                              ║" -ForegroundColor Cyan
Write-Host "╚═════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Ensure MongoDB is running locally or update .env with Atlas URI"
Write-Host "2. Start backend: cd server && npm run dev"
Write-Host "3. In another terminal, start frontend: cd client && npm run dev"
Write-Host "4. Open http://localhost:3000 in your browser"
Write-Host ""
Write-Host "📖 For more info, see SETUP.md and PASTE_DETECTION.md" -ForegroundColor Cyan
Write-Host ""
