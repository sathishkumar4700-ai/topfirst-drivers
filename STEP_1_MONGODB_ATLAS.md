# Step 1: MongoDB Atlas Setup (2 minutes)

## Create Your Free MongoDB Database

### 1. Sign Up for MongoDB Atlas
Go to: https://www.mongodb.com/cloud/atlas/register

- Sign up with Google/GitHub or email
- Choose the **FREE** tier (M0)

### 2. Create a Cluster
1. Click "Build a Database"
2. Choose **M0 FREE** tier
3. Select **AWS** as provider
4. Choose region closest to you (e.g., Singapore, Mumbai, or US)
5. Cluster Name: `topfirst-cluster` (or any name)
6. Click "Create"

### 3. Create Database User
1. Security → Database Access → Add New Database User
2. Authentication Method: **Password**
3. Username: `topfirst_admin` (or your choice)
4. Password: Click "Autogenerate Secure Password" and **COPY IT**
   - Or create your own strong password
5. Database User Privileges: **Read and write to any database**
6. Click "Add User"

**IMPORTANT**: Save your username and password somewhere safe!

### 4. Allow Network Access
1. Security → Network Access → Add IP Address
2. Click "Allow Access from Anywhere"
3. This adds `0.0.0.0/0` to the whitelist
4. Click "Confirm"

### 5. Get Connection String
1. Go to Database → Connect
2. Choose "Connect your application"
3. Driver: **Node.js**
4. Version: **4.1 or later**
5. Copy the connection string (looks like this):
   ```
   mongodb+srv://topfirst_admin:<password>@topfirst-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### 6. Format Your Connection String
Replace `<password>` with your actual password and add database name:

**Before:**
```
mongodb+srv://topfirst_admin:<password>@topfirst-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**After:**
```
mongodb+srv://topfirst_admin:YOUR_ACTUAL_PASSWORD@topfirst-cluster.xxxxx.mongodb.net/topfirst-drivers?retryWrites=true&w=majority
```

**SAVE THIS CONNECTION STRING** - You'll need it for Render!

---

## ✅ Checklist
- [ ] MongoDB Atlas account created
- [ ] Free M0 cluster created
- [ ] Database user created
- [ ] Password saved securely
- [ ] Network access set to 0.0.0.0/0
- [ ] Connection string copied and formatted
- [ ] Database name added: `/topfirst-drivers`

## Next Step
Once you have your connection string, proceed to **STEP_2_GITHUB.md**
