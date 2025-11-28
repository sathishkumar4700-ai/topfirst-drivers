# CodeSandbox Setup Guide - Instant Online Preview

## 🚀 Option 1: Quick Import (Easiest)

### Step 1: Create CodeSandbox Account
1. Go to: **https://codesandbox.io/**
2. Click "Sign in" (use GitHub, Google, or email)

### Step 2: Import Your Project
1. Click "Create Sandbox" or "Import Project"
2. Choose "Import from GitHub" or "Upload folder"
3. If uploading folder:
   - Zip your entire project folder
   - Upload the zip file
   - CodeSandbox will auto-detect it's a React app

### Step 3: Configure Environment
1. In CodeSandbox, create `.env` file in server folder:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://demo:demo@cluster.mongodb.net/topfirst
   JWT_SECRET=codesandbox_secret_key
   ```

### Step 4: Get Your Preview Link! 🎉
- CodeSandbox will automatically:
  - Install dependencies
  - Start both servers
  - Give you a live preview URL
  - Example: `https://abc123.csb.app`

---

## 🚀 Option 2: Manual Setup in CodeSandbox

### Step 1: Create New Sandbox
1. Go to: https://codesandbox.io/
2. Click "Create Sandbox"
3. Choose "React" template

### Step 2: Upload Files
1. Delete default files
2. Upload your files:
   - Drag and drop `client/src` folder
   - Drag and drop `client/public` folder
   - Upload `package.json`

### Step 3: Install Dependencies
CodeSandbox auto-installs from package.json

### Step 4: Preview
- Click "Open Preview" button
- Your site will be live!

---

## 🚀 Option 3: Use StackBlitz (Alternative)

### Step 1: Go to StackBlitz
1. Visit: **https://stackblitz.com/**
2. Sign in with GitHub

### Step 2: Import Project
1. Click "Import project"
2. Choose "Upload from computer"
3. Upload your project folder

### Step 3: Instant Preview
- StackBlitz provides instant preview
- Live URL: `https://stackblitz.com/edit/your-project`

---

## 🚀 Option 4: Use Replit (Includes Backend)

### Step 1: Create Replit Account
1. Go to: **https://replit.com/**
2. Sign up (free)

### Step 2: Create New Repl
1. Click "Create Repl"
2. Choose "Node.js" template
3. Name it "top-first-drivers"

### Step 3: Upload Files
1. Click "Upload folder"
2. Upload your entire project
3. Or use GitHub import

### Step 4: Configure
1. Add `.env` file with MongoDB connection
2. Click "Run" button

### Step 5: Get Your Live URL
- Replit provides: `https://top-first-drivers.username.repl.co`
- Share this link with anyone!

---

## 📱 Testing Mobile on These Platforms

### CodeSandbox
- Click "Open in new window"
- Use browser DevTools (F12)
- Toggle device toolbar

### StackBlitz
- Built-in device preview
- Click device icons at top

### Replit
- Click "Open in new tab"
- Use browser DevTools for mobile view

---

## 🎯 Recommended: Use MongoDB Atlas (Free)

All these platforms work best with cloud MongoDB:

### Setup MongoDB Atlas
1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Create free account
3. Create cluster (free tier - M0)
4. Click "Connect"
5. Choose "Connect your application"
6. Copy connection string
7. Replace `<password>` with your password
8. Use this in your `.env` file

Example:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/topfirst-drivers?retryWrites=true&w=majority
```

---

## 🎨 What You'll See

Once deployed, you'll get a live URL like:
- CodeSandbox: `https://abc123.csb.app`
- StackBlitz: `https://stackblitz.com/edit/abc123`
- Replit: `https://top-first-drivers.username.repl.co`

### Features Working:
✅ Homepage with professional driver image
✅ Mobile responsive design
✅ All sections (Hero, Features, Services, Contact)
✅ WhatsApp integration
✅ Click-to-call functionality

### Features Needing Backend:
⚠️ Login/Registration (needs MongoDB)
⚠️ Admin Dashboard (needs MongoDB)
⚠️ Booking system (needs MongoDB)
⚠️ Dynamic content (needs MongoDB)

---

## 🔥 Quick Demo Without Backend

If you just want to see the design:

### Use the preview.html file:
1. Open `preview.html` in your browser
2. Right-click → "Open with" → Chrome/Firefox
3. Test mobile: Press F12 → Toggle Device Toolbar
4. Done! No installation needed!

---

## 📊 Comparison

| Platform | Setup Time | Backend Support | Free Tier | Best For |
|----------|-----------|-----------------|-----------|----------|
| **preview.html** | 0 min | ❌ | ✅ | Quick design preview |
| **CodeSandbox** | 5 min | ⚠️ Limited | ✅ | Frontend preview |
| **StackBlitz** | 5 min | ⚠️ Limited | ✅ | Quick prototyping |
| **Replit** | 10 min | ✅ Full | ✅ | Full-stack app |
| **Local Setup** | 15 min | ✅ Full | ✅ | Development |

---

## 🎯 My Recommendation

### For Immediate Preview (Right Now):
1. **Open `preview.html`** in your browser
2. Press F12 for mobile view
3. Done in 30 seconds!

### For Sharing with Others:
1. **Use Replit** (supports full backend)
2. Upload project
3. Share the live URL
4. Takes 10 minutes

### For Production:
1. **Install Node.js locally**
2. Follow SETUP_AND_RUN.md
3. Deploy to Netlify (frontend) + Heroku (backend)

---

## 📞 Need Help?

Contact:
- Phone: +91 9962366104
- Email: Kraja4700@gmail.com
- WhatsApp: +91 9962366104

---

## 🎉 Quick Start Commands

### If you have Node.js installed:

```bash
# Clone/navigate to project
cd "Top First Call Drivers"

# Install dependencies
cd server && npm install
cd ../client && npm install

# Start servers
# Terminal 1
cd server && npm start

# Terminal 2  
cd client && npm start

# Open browser
http://localhost:3000
```

### If you don't have Node.js:

```bash
# Just open the preview file
preview.html
```

Double-click `preview.html` and you're done! 🎉
