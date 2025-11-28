# 🚀 Step-by-Step Setup Guide

## What You Need to Do

You have TWO parts to run:
1. **Backend Server** (handles data)
2. **React App** (the website with dashboards)

---

## STEP 1: Start Backend Server

### 1.1 Open Terminal/Command Prompt
- **Windows:** Press `Windows Key + R`, type `cmd`, press Enter
- **Mac:** Press `Cmd + Space`, type `terminal`, press Enter

### 1.2 Navigate to Server Folder
Type these commands one by one:

```bash
cd path/to/your/project
cd server
```

(Replace `path/to/your/project` with where your project is saved)

### 1.3 Start the Server
```bash
npm start
```

**You should see:**
```
Server running on port 5000
MongoDB connected
```

✅ **Keep this terminal window open!** Don't close it.

---

## STEP 2: Start React App (Frontend)

### 2.1 Open ANOTHER Terminal/Command Prompt
- Open a NEW terminal window (don't close the first one!)

### 2.2 Navigate to Client Folder
```bash
cd path/to/your/project
cd client
```

### 2.3 Start React App
```bash
npm start
```

**You should see:**
```
Compiled successfully!
Local: http://localhost:3000
```

✅ **A browser window should open automatically!**

---

## STEP 3: Access Your Application

### 3.1 Open Browser
If browser didn't open automatically:
- Open Chrome, Firefox, or Edge
- Go to: `http://localhost:3000`

### 3.2 You Should See
- Your homepage with "Top First Call Drivers"
- Login button
- Create Account button

---

## STEP 4: Test Login

### 4.1 Click "Login" Button

### 4.2 Login as Admin
- **Email:** `admin@example.com`
- **Password:** `admin123`
- Click "Login"

### 4.3 You Should See
- Admin Dashboard
- Stats, Drivers, Bookings tabs
- "Updated: HH:MM:SS" in navbar

---

## STEP 5: Test Refresh (The Issue We're Fixing)

### 5.1 While on Admin Dashboard
- Press `F5` key on keyboard
- OR Click browser refresh button

### 5.2 What Should Happen
✅ **Should stay on Admin Dashboard** (this is what we want)
❌ **Goes to homepage** (this is the bug we're fixing)

---

## STEP 6: Check Token (For Debugging)

### 6.1 While on `http://localhost:3000` (React App)
- Press `F12` key
- Click "Console" tab at the top
- You'll see a prompt: `>`

### 6.2 Type This Command
```javascript
localStorage.getItem('token')
```
Press Enter

### 6.3 What You Should See
**If logged in:**
```
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
(A long string of letters and numbers)

**If NOT logged in:**
```
null
```

---

## Common Issues & Solutions

### Issue 1: "npm: command not found"
**Solution:** You need to install Node.js
- Go to: https://nodejs.org
- Download and install
- Restart terminal

### Issue 2: "Cannot find module"
**Solution:** Install dependencies
```bash
# In server folder:
cd server
npm install

# In client folder:
cd client
npm install
```

### Issue 3: "Port 3000 already in use"
**Solution:** Kill the process
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID [number] /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### Issue 4: "MongoDB connection error"
**Solution:** Check server/.env file
- Make sure MONGODB_URI is set
- Or MongoDB is running locally

---

## Quick Reference

### URLs:
- **React App (Frontend):** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Static HTML:** file:///... (NOT used for dashboards!)

### Login Credentials:
- **Admin:** admin@example.com / admin123
- **Super Admin 1:** 9962366104 / Tharish@4700
- **Super Admin 2:** 8179824281 / Tharish@4700

### Terminals Needed:
1. **Terminal 1:** Backend server (keep running)
2. **Terminal 2:** React app (keep running)

---

## What to Tell Me

After following these steps, tell me:

1. ✅ or ❌ Backend server started?
2. ✅ or ❌ React app started?
3. ✅ or ❌ Can you see the homepage at localhost:3000?
4. ✅ or ❌ Can you login?
5. ✅ or ❌ After login, when you press F5, do you stay logged in?
6. What does `localStorage.getItem('token')` show in console?

This will help me understand exactly what's happening!

---

**Need Help?** Just tell me which step you're stuck on!
