# ⚡ Quick Start - Backend in 5 Minutes

## Step 1: Install MongoDB (if not installed)

### Windows:
Download and install from: https://www.mongodb.com/try/download/community

### Mac:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux:
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

---

## Step 2: Install Dependencies

```bash
cd server
npm install
```

---

## Step 3: Start the Server

```bash
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

---

## Step 4: Test It!

Open browser console (F12) and paste:

```javascript
// Test 1: Check if server is running
fetch('http://localhost:5000/api/auth/check-phone', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone: '9999999999' })
})
.then(r => r.json())
.then(data => console.log('✅ Server is running!', data));

// Test 2: Login as Super Admin
fetch('http://localhost:5000/api/auth/login-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    phone: '9962366104',
    password: 'Tharish@4700'
  })
})
.then(r => r.json())
.then(data => {
  console.log('✅ Super Admin Login Success!', data);
  localStorage.setItem('token', data.token);
});
```

---

## Step 5: View Database

### Option 1: MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `topfirst-drivers`

### Option 2: MongoDB Shell
```bash
mongo
use topfirst-drivers
db.users.find().pretty()
```

---

## 🎉 Done!

Your backend is now running on `http://localhost:5000`

### Super Admin Credentials:
- Phone: `9962366104` or `8179824281`
- Password: `Tharish@4700`

### API Base URL:
```
http://localhost:5000/api
```

### Next Steps:
1. Read `API_DOCS.md` for all endpoints
2. Read `BACKEND_SETUP_GUIDE.md` for detailed setup
3. Connect your frontend (index.html) to the backend

---

## Troubleshooting

**MongoDB not running?**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongodb
```

**Port 5000 in use?**
Edit `server/.env` and change:
```
PORT=5001
```

**Need help?**
- Check `BACKEND_SETUP_GUIDE.md`
- Check `API_DOCS.md`
- Email: kraja4700@gmail.com

---

**Status**: ✅ Backend Ready!
