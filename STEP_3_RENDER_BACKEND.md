# Step 3: Deploy Backend on Render (3 minutes)

## Create Backend Web Service

### 1. Sign Up for Render
Go to: https://dashboard.render.com/register

- Sign up with GitHub (recommended) or email
- Authorize Render to access your GitHub repositories

### 2. Create New Web Service
1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your GitHub repository:
   - If not connected, click "Connect account"
   - Find and select your `topfirst-drivers` repository
   - Click "Connect"

### 3. Configure Backend Service

Fill in these settings:

**Basic Settings:**
- **Name**: `topfirst-api` (or your choice)
- **Region**: Choose closest to you (Singapore, Frankfurt, Oregon, etc.)
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Plan:**
- Select **Free** (first option)

### 4. Add Environment Variables

Click "Advanced" → "Add Environment Variable"

Add these THREE variables:

#### Variable 1: MONGODB_URI
- **Key**: `MONGODB_URI`
- **Value**: Your MongoDB Atlas connection string from Step 1
  ```
  mongodb+srv://username:password@cluster.mongodb.net/topfirst-drivers?retryWrites=true&w=majority
  ```

#### Variable 2: JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: Create a strong secret (at least 32 characters)
  ```
  topfirst_production_jwt_secret_key_2024_secure_random_string
  ```

#### Variable 3: NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`

### 5. Deploy!
1. Click "Create Web Service"
2. Wait 3-5 minutes for deployment
3. Watch the logs - you should see:
   ```
   ==> Building...
   ==> Installing dependencies...
   ==> Starting server...
   ==> MongoDB Connected
   ==> Server running on port 10000
   ```

### 6. Copy Your Backend URL
Once deployed, you'll see your service URL at the top:
```
https://topfirst-api.onrender.com
```

**SAVE THIS URL** - You'll need it for the frontend!

### 7. Test Your Backend
Visit: `https://your-backend-url.onrender.com/health`

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-11-28T..."
}
```

---

## ✅ Checklist
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Web Service created
- [ ] Root directory set to `server`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] MONGODB_URI added
- [ ] JWT_SECRET added
- [ ] NODE_ENV=production added
- [ ] Service deployed successfully
- [ ] Backend URL copied
- [ ] Health check endpoint works

## Troubleshooting

### Build Failed
- Check logs for errors
- Verify `server/package.json` exists
- Ensure all dependencies are listed

### "MongoDB Connection Error"
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Ensure password doesn't have special characters (or URL encode them)

### Service Won't Start
- Check logs for specific error
- Verify PORT is not hardcoded (Render uses port 10000)
- Ensure all environment variables are set

---

## Next Step
Once your backend is live, proceed to **STEP_4_RENDER_FRONTEND.md**
