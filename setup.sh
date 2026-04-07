#!/bin/bash
# Vi-Notes Paste Detection - Quick Start Script

echo "╔═════════════════════════════════════════════════════════════╗"
echo "║    Vi-Notes Paste Detection - Initialization Script         ║"
echo "╚═════════════════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..
echo "✅ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..
echo "✅ Frontend dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f server/.env ]; then
    echo "🔧 Creating .env file from template..."
    cp server/.env.example server/.env
    echo "✅ .env file created. Please update MongoDB URI if needed."
fi
echo ""

echo "╔═════════════════════════════════════════════════════════════╗"
echo "║             🎉 Setup Complete!                              ║"
echo "╚═════════════════════════════════════════════════════════════╝"
echo ""
echo "📋 Next Steps:"
echo "1. Ensure MongoDB is running locally or update .env with Atlas URI"
echo "2. Start backend: cd server && npm run dev"
echo "3. In another terminal, start frontend: cd client && npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📖 For more info, see SETUP.md and PASTE_DETECTION.md"
echo ""
