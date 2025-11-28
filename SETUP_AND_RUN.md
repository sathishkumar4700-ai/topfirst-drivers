# Quick Setup & Run Guide - Top First Call Drivers

## 🚀 Prerequisites

Before you start, you need to install:

1. **Node.js** (v14 or higher)
   - Download: https://nodejs.org/
   - Choose LTS version
   - Verify: `node --version` and `npm --version`

2. **MongoDB** (Choose one option)
   - **Option A**: Local MongoDB
     - Download: https://www.mongodb.com/try/download/community
   - **Option B**: MongoDB Atlas (Cloud - Free)
     - Sign up: https://www.mongodb.com/cloud/atlas/register

## 📦 Installation Steps

### Step 1: Install Server Dependencies
```bash
cd server
npm install
```

This installs:
- express
- mongoose
- cors
- dotenv
- bcryptjs
- jsonwebtoken

### Step 2: Install Client Dependencies
```bash
cd client
npm install
```

This installs:
- react
- react-dom
- react-router-dom
- axios

### Step 3: Configure Environment Variables

Create `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/topfirst-drivers
JWT_SECRET=your_super_secret_key_change_this_in_production
```

**For MongoDB Atlas:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/topfirst-drivers
JWT_SECRET=your_super_secret_key_change_this_in_production
```

### Step 4: Seed Initial Content (Optional)
```bash
cd server
node seedContent.js
```

This populates:
- 9 Features (24/7 Availability, Verified Drivers, etc.)
- 4 Services (Hourly Drivers, Airport Transfers, etc.)

## ▶️ Running the Application

### Option 1: Two Separate Terminals

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```
Server runs on: http://localhost:5000

**Terminal 2 - Frontend Client:**
```bash
cd client
npm start
```
Client runs on: http://localhost:3000

### Option 2: Using npm scripts (if configured)
```bash
# From root directory
npm run dev
```

## 🌐 Accessing the Application

1. **Homepage**: http://localhost:3000
2. **Login**: http://localhost:3000/login
3. **API**: http://localhost:5000/api

## 👥 Creating Users

### Method 1: Using API (Postman/Thunder Client)

**Create Admin:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@topfirst.com",
  "phone": "9876543210",
  "password": "admin123",
  "role": "admin"
}
```

**Create Driver:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Driver Name",
  "email": "driver@topfirst.com",
  "phone": "9876543211",
  "password": "driver123",
  "role": "driver"
}
```

**Create Customer:**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Customer Name",
  "email": "customer@topfirst.com",
  "phone": "9876543212",
  "password": "customer123",
  "role": "customer"
}
```

### Method 2: Using the Website
1. Go to http://localhost:3000/login
2. Click "Register" (if you add a register link)
3. Fill in the form
4. Select role (customer/driver/admin)

## 📱 Testing Mobile Responsiveness

### Chrome DevTools
1. Open http://localhost:3000
2. Press F12 (Developer Tools)
3. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
4. Select device:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - Pixel 5 (393px)
   - iPad (768px)
   - Responsive mode (custom size)

### Firefox Responsive Design Mode
1. Open http://localhost:3000
2. Press Ctrl+Shift+M
3. Choose device or custom dimensions

### Real Device Testing
1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```
2. On your phone, connect to same WiFi
3. Open browser: http://YOUR_IP:3000

## 🎯 Features to Test

### Homepage
- ✅ Navigation bar
- ✅ Hero section with booking button
- ✅ Intro with professional driver image
- ✅ 9 feature cards
- ✅ 4 service cards
- ✅ Contact section with WhatsApp
- ✅ Mobile responsiveness

### Admin Dashboard
- ✅ Login as admin
- ✅ View dashboard stats
- ✅ Manage homepage content (CRUD)
- ✅ Manage drivers
- ✅ Manage customers
- ✅ Manage bookings

### Customer Dashboard
- ✅ Login as customer
- ✅ Create new booking
- ✅ View booking history
- ✅ Check booking status

### Driver Dashboard
- ✅ Login as driver
- ✅ View assigned rides
- ✅ Accept/reject bookings
- ✅ Update ride status

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
- Check if MongoDB is running
- Verify MONGODB_URI in .env
- For Atlas: Check IP whitelist

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Error
- Ensure server is running on port 5000
- Check CORS configuration in server.js

## 📊 Project Structure

```
Top First Call Drivers/
├── client/                 # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── PrivateRoute.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── DriverDashboard.js
│   │   │   └── CustomerDashboard.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── models/
│   │   ├── User.js
│   │   ├── Driver.js
│   │   ├── Booking.js
│   │   └── Content.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── drivers.js
│   │   ├── bookings.js
│   │   ├── customers.js
│   │   └── content.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── seedContent.js
│   └── package.json
│
├── README.md
├── CONTENT_MANAGEMENT_GUIDE.md
├── MOBILE_PREVIEW_GUIDE.md
├── VISUAL_PREVIEW.md
└── SETUP_AND_RUN.md (this file)
```

## 🎨 Key Features Implemented

### ✅ Homepage
- Professional driver image from Unsplash
- Fully mobile responsive
- Dynamic content from database
- WhatsApp integration
- Contact information

### ✅ Admin Panel
- Homepage content management (CRUD)
- Driver management
- Customer management
- Booking management
- Dashboard statistics

### ✅ Mobile Responsive
- All pages optimized for mobile
- Touch-friendly buttons
- Readable typography
- No horizontal scroll
- Responsive images

### ✅ Authentication
- JWT-based auth
- Role-based access (Admin/Driver/Customer)
- Protected routes
- Secure password hashing

## 📞 Support

**Contact Information:**
- Phone: +91 9962366104
- Email: Kraja4700@gmail.com
- WhatsApp: +91 9962366104

## 🚀 Next Steps

1. ✅ Install Node.js
2. ✅ Install dependencies
3. ✅ Setup MongoDB
4. ✅ Configure .env
5. ✅ Seed initial data
6. ✅ Start servers
7. ✅ Test on mobile
8. 🎯 Deploy to production

## 🌐 Deployment Options

### Frontend (Client)
- **Netlify**: https://www.netlify.com/
- **Vercel**: https://vercel.com/
- **GitHub Pages**: https://pages.github.com/

### Backend (Server)
- **Heroku**: https://www.heroku.com/
- **Railway**: https://railway.app/
- **Render**: https://render.com/

### Database
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas

---

**You're all set! Start the servers and enjoy your professional call driver website!** 🎉
