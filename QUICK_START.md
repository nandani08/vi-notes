# 🚀 Quick Start Checklist

## Before You Begin
- [ ] Node.js installed (check: `node --version`, need v16+)
- [ ] MongoDB installed or Atlas account created
- [ ] Git repository cloned/forked
- [ ] Terminal open in project root

---

## ✅ Installation (Choose One Method)

### Method 1: Automated Setup (RECOMMENDED)

#### Windows
```powershell
cd "C:\Users\Nandani Awase\OneDrive\Desktop\vintern- fork\vi-notes"
.\setup.ps1
```

#### Mac/Linux
```bash
cd ~/path/to/vi-notes
chmod +x setup.sh
./setup.sh
```

**Result:** Both `client/node_modules` and `server/node_modules` installed

---

### Method 2: Manual Setup

#### Backend Setup
```bash
cd server
copy .env.example .env        # Windows: copy
# or
cp .env.example .env           # Mac/Linux: cp

# Edit .env - update MongoDB URI if needed
# MONGODB_URI=mongodb://localhost:27017/vi-notes

npm install
```

#### Frontend Setup
```bash
cd ../client
npm install
```

---

## 🔧 Configuration

### MongoDB Setup

**Local MongoDB:**
1. Download from https://www.mongodb.com/try/download/community
2. Start MongoDB: `mongod`
3. Use connection: `mongodb://localhost:27017/vi-notes`

**MongoDB Atlas (Cloud):**
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/vi-notes`
4. Update in `server/.env`

### Server Environment
Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vi-notes
NODE_ENV=development
```

---

## 🎯 Running the Application

### Step 1: Start MongoDB
```bash
mongod
# Keep this running in background
```

### Step 2: Start Backend Server (Terminal 1)
```bash
cd server
npm run dev
```

**Expected output:**
```
✅ Connected to MongoDB
🎯 Vi-Notes Server Running
📝 API Server: http://localhost:5000
```

### Step 3: Start Frontend Server (Terminal 2)
```bash
cd client
npm run dev
```

**Expected output:**
```
VITE ready in 123 ms
➜ Local: http://localhost:3000/
```

### Step 4: Open Browser
- Go to http://localhost:3000
- Editor should load
- Ready to test!

---

## ✨ Test Paste Detection

### In Browser
1. Click in the textarea
2. Type some text
3. Copy text: `This is pasted content!`
4. Paste with **Ctrl+V** (or **Cmd+V** on Mac)
5. See green notification: ✓ Paste detected and recorded
6. Check footer - paste appears in history

### With cURL (Optional Verification)

**Test API is running:**
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Vi-Notes server is running"
}
```

---

## 📊 View Session Report

After pasting in the editor, go to backend terminal log and look for:
```
📋 Paste detected: {
  length: 456,
  timestamp: "2024-04-07T...",
  position: { line: 5, column: 23 }
}
```

---

## 🐛 Troubleshooting

### Problem: MongoDB connection error
```
Error: ECONNREFUSED
```
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- If using Atlas, ensure IP is whitelisted

### Problem: Port 5000 already in use
```
Error: EADDRINUSE :::5000
```
**Solution (Windows):**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Solution (Mac/Linux):**
```bash
lsof -i :5000
kill -9 <PID>
```

### Problem: Dependencies not installing
```
Error: npm ERR!
```
**Solution:**
```bash
npm cache clean --force
npm install
```

### Problem: CORS errors in browser
**Solution:** Verify:
- Backend running on http://localhost:5000
- Frontend running on http://localhost:3000
- Check browser console for exact error

### Problem: Paste events not showing
**Solution:**
- Check browser console (F12) for errors
- Verify backend terminal shows logs
- Check MongoDB is connected

---

## 📚 Documentation

Read these in order:

1. **[SETUP.md](./SETUP.md)** - Detailed installation (15 min read)
2. **[FILE_STRUCTURE.md](./FILE_STRUCTURE.md)** - Code structure overview (10 min read)
3. **[PASTE_DETECTION.md](./PASTE_DETECTION.md)** - Feature details (20 min read)
4. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - What was built (10 min read)

---

## 🔧 Development Tips

### Hot Reload
- Both client and server support hot reload
- Changes auto-reload when you save files

### Debugging
- Frontend: Press F12 to open developer tools
- Backend: Check console logs in terminal

### Database Explorer
- Use MongoDB Compass to view database
- Or use MongoDB Atlas UI for cloud

---

## 🎯 Next Features (Roadmap)

- [ ] User authentication
- [ ] Dashboard UI
- [ ] ML-powered analysis
- [ ] Browser extension
- [ ] Report PDF export
- [ ] Admin panel

---

## 💡 Common Commands

### Frontend
```bash
npm run dev           # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend
```bash
npm run dev          # Start with auto-reload
npm run build        # Compile TypeScript
npm start            # Run compiled code
```

---

## 🆘 Need Help?

| Issue | See | File |
|-------|-----|------|
| Installation problems | SETUP.md | [SETUP.md](./SETUP.md) |
| API documentation | PASTE_DETECTION.md | [PASTE_DETECTION.md](./PASTE_DETECTION.md) |
| File locations | FILE_STRUCTURE.md | [FILE_STRUCTURE.md](./FILE_STRUCTURE.md) |
| What was built | IMPLEMENTATION_SUMMARY.md | [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) |

---

## ✅ Success Checklist

- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Backend installed (`npm install` in server/)
- [ ] Frontend installed (`npm install` in client/)
- [ ] Server running on http://localhost:5000
- [ ] Frontend running on http://localhost:3000
- [ ] Can open http://localhost:3000 in browser
- [ ] Can type in editor
- [ ] Can paste text and see notification
- [ ] Paste shows in footer statistics

**When all checked, you're ready to go! 🎉**

---

## 📞 Quick Help

### I see an error saying MongoDB is not running
```bash
# Windows: Start MongoDB manually
mongod

# Mac: Install and start
brew install mongodb-community
mongod

# Linux: Install and start
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### I see "Cannot find module" error
```bash
cd client  # or server
rm -rf node_modules package-lock.json
npm install
```

### Nothing happens when I paste
1. Check browser console (F12)
2. Check server terminal for errors
3. Verify MongoDB is connected
4. Try refreshing the page

---

**You're all set! Start with Step 1 above. Happy coding! 🚀**

Version: 1.0.0  
Last Updated: April 7, 2026
