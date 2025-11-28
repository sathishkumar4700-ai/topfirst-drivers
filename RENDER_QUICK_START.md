# 🚀 Render Deployment - Quick Start

## Prerequisites
- GitHub account
- MongoDB Atlas account (free tier)
- Render.com account (free tier)

## Step 1: MongoDB Atlas Setup (2 minutes)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free cluster (M0 tier)
3. Create database user (username + password)
4. Network Access → Add IP: `0.0.0.0/0` (allow from anywhere)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/topfirst-drivers`

## Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 3: Deploy Backend on Render
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `topfirst-api`
   - **Region**: Singapore (or closest)
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/topfirst-drivers
   JWT_SECRET = your-super-secret-jwt-key-min-32-chars
   NODE_ENV = production
   ```

6. Click "Create Web Service"
7. Wait 3-5 minutes
8. **Copy your backend URL** (e.g., `https://topfirst-api.onrender.com`)

## Step 4: Deploy Frontend on Render
1. Click "New +" → "Static Site"
2. Select same repository
3. Configure:
   - **Name**: `topfirst-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add Environment Variable:
   ```
   REACT_APP_API_URL = https://topfirst-api.onrender.com
   ```
   (Use the URL from Step 3)

5. Click "Create Static Site"
6. Wait 3-5 minutes

## Step 5: Test Your App
1. Visit your frontend URL (e.g., `https://topfirst-frontend.onrender.com`)
2. Try logging in as admin: `admin` / `admin123`
3. Test driver registration
4. Check if data syncs across devices

## Important Notes

### Free Tier Behavior
- Backend sleeps after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- This is normal for free tier

### Keep Backend Awake (Optional)
Use UptimeRobot to ping every 10 minutes:
1. Go to https://uptimerobot.com (free)
2. Add monitor: `https://topfirst-api.onrender.com/health`
3. Interval: 10 minutes

### Troubleshooting
- **Backend won't start**: Check logs in Render dashboard
- **Frontend can't connect**: Verify REACT_APP_API_URL is correct
- **Database errors**: Check MongoDB Atlas IP whitelist and connection string

## Updating Your App
Just push to GitHub:
```bash
git add .
git commit -m "Update"
git push
```
Render will auto-deploy!

## Cost
- **Free**: $0/month (with sleep)
- **Upgrade**: $7/month per service (no sleep, better performance)

That's it! Your app is live! 🎉
