# 🚀 Backend Setup Guide - Top First Call Drivers

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (optional) - [Download](https://git-scm.com/)

## Step 1: Install MongoDB

### Windows:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a Service (recommended)
5. MongoDB will start automatically

### Mac (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu):
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Verify MongoDB is Running:
```bash
mongo --version
```

## Step 2: Install Dependencies

Navigate to the server directory and install packages:

```bash
cd server
npm install
```

This will install:
- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - Cross-origin resource sharing
- dotenv - Environment variables
- multer - File uploads
- express-validator - Input validation

## Step 3: Configure Environment

The `.env` file is already created with default settings:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/topfirst-drivers
JWT_SECRET=topfirst_drivers_secret_key_change_in_production_2024
```

**Important**: Change `JWT_SECRET` in production!

## Step 4: Create Upload Directories

The server will create these automatically, but you can create them manually:

```bash
mkdir -p uploads/driver-documents
```

## Step 5: Start the Backend Server

### Development Mode (with auto-restart):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

## Step 6: Test the Backend

### Test 1: Check Server is Running
Open browser and go to: `http://localhost:5000`

### Test 2: Test API Endpoint
```bash
curl http://localhost:5000/api/auth/check-phone -X POST -H "Content-Type: application/json" -d "{\"phone\":\"9999999999\"}"
```

Expected response:
```json
{"exists":false}
```

## Step 7: Seed Super Admin Accounts

The super admin accounts are automatically created on first login:

**Super Admin 1:**
- Phone: `9962366104`
- Password: `Tharish@4700`
- Name: Kraja
- Email: kraja4700@gmail.com

**Super Admin 2:**
- Phone: `8179824281`
- Password: `Tharish@4700`
- Name: Sathish
- Email: sathishkumar4700@gmail.com

## Step 8: Connect Frontend (index.html)

The frontend will automatically connect to `http://localhost:5000` when running locally.

### Enable CORS (Already configured):
The server allows requests from any origin in development mode.

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongoNetworkError: connect ECONNREFUSED`

**Solution**:
1. Check if MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac/Linux
   sudo systemctl status mongodb
   ```

2. Verify MongoDB URI in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/topfirst-drivers
   ```

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
1. Change port in `.env`:
   ```
   PORT=5001
   ```

2. Or kill the process using port 5000:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```

### File Upload Errors

**Error**: `ENOENT: no such file or directory`

**Solution**:
Create upload directory:
```bash
mkdir -p uploads/driver-documents
```

## Database Management

### View Database in MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to: `mongodb://localhost:27017`
3. Select database: `topfirst-drivers`
4. View collections: users, drivers, bookings, etc.

### MongoDB Shell Commands

```bash
# Connect to MongoDB
mongo

# Switch to database
use topfirst-drivers

# View all users
db.users.find().pretty()

# View all drivers
db.drivers.find().pretty()

# View all bookings
db.bookings.find().pretty()

# Count documents
db.users.countDocuments()

# Clear all data (CAUTION!)
db.users.deleteMany({})
db.drivers.deleteMany({})
db.bookings.deleteMany({})
```

## API Endpoints

See `API_DOCUMENTATION.md` for complete API reference.

### Quick Test Endpoints:

1. **Check Phone**: `POST /api/auth/check-phone`
2. **Login**: `POST /api/auth/login-password`
3. **Send OTP**: `POST /api/auth/send-otp`
4. **Register Driver**: `POST /api/auth/register-driver`
5. **Get Stats**: `GET /api/admin/stats` (requires admin token)

## Production Deployment

### Environment Variables for Production:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/topfirst-drivers
JWT_SECRET=your_very_secure_random_secret_key_here
```

### Security Checklist:

- ✅ Change JWT_SECRET to a strong random string
- ✅ Use MongoDB Atlas or secure MongoDB instance
- ✅ Enable HTTPS
- ✅ Set up proper CORS origins
- ✅ Add rate limiting
- ✅ Enable MongoDB authentication
- ✅ Set up backup strategy
- ✅ Configure SMS/Email services

## Next Steps

1. ✅ Backend is running
2. ✅ MongoDB is connected
3. ✅ Super admins can login
4. 🔄 Integrate with index.html frontend
5. 🔄 Add SMS/Email notifications
6. 🔄 Add payment integration
7. 🔄 Deploy to production

## Support

For issues or questions:
- Email: kraja4700@gmail.com, sathishkumar4700@gmail.com
- Phone: +91 9962366104, +91 8179824281

---

**Status**: ✅ Backend Ready
**Last Updated**: November 20, 2025
