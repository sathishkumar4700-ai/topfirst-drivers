# 🚀 Render.com Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Prepare MongoDB Atlas (Free)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account → Create cluster (M0 Free tier)
3. Click "Connect" → "Connect your application"
4. Copy connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Replace `<password>` with your actual password
6. Add `/topfirst-drivers` at the end

### Step 2: Deploy Backend to Render
1. Go to https://render.com and sign up (free)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `topfirst-api`
   - **Region**: Singapore (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `MONGODB_URI` = (paste your MongoDB Atlas connection string)
   - `JWT_SECRET` = (click "Generate" or use any random 32+ character string)
   - `NODE_ENV` = `production`
   - `PORT` = `5000`

6. Click "Create Web Service"
7. Wait 3-5 minutes for deployment
8. Copy your backend URL (e.g., `https://topfirst-api.onrender.com`)

### Step 3: Deploy Frontend to Render
1. Click "New +" → "Static Site"
2. Select same repository
3. Configure:
   - **Name**: `topfirst-frontend`
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add Environment Variable:
   - `REACT_APP_API_URL` = (paste your backend URL from Step 2)

5. Click "Create Static Site"
6. Wait 3-5 minutes for deployment

### Step 4: Update API URL in Frontend
After backend is deployed, update the frontend environment:

1. Go to your frontend service in Render
2. Environment → Edit `REACT_APP_API_URL`
3. Set it to your backend URL: `https://topfirst-api.onrender.com`
4. Save and redeploy

### Step 5: Test Your Deployment
1. Visit your frontend URL (e.g., `https://topfirst-frontend.onrender.com`)
2. Try logging in as admin: `admin` / `admin123`
3. Check if data syncs across devices

## Important Notes

### Free Tier Limitations
- Backend spins down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- 750 hours/month free (enough for one service 24/7)

### Keeping Backend Awake (Optional)
Use a free service like UptimeRobot to ping your backend every 10 minutes:
1. Go to https://uptimerobot.com
2. Add monitor: `https://topfirst-api.onrender.com/health`
3. Check interval: 10 minutes

### Custom Domain (Optional)
1. In Render dashboard → Settings → Custom Domain
2. Add your domain and follow DNS instructions

## Troubleshooting

### Backend won't start
- Check logs in Render dashboard
- Verify MONGODB_URI is correct
- Ensure all environment variables are set

### Frontend can't connect to backend
- Check REACT_APP_API_URL is correct
- Verify backend is running (visit `/health` endpoint)
- Check CORS settings in server.js

### Database connection fails
- Verify MongoDB Atlas IP whitelist (set to 0.0.0.0/0 for all IPs)
- Check connection string format
- Ensure password doesn't have special characters (or URL encode them)

## Alternative: Single Service Deployment

If you want to serve frontend from backend (simpler but less optimal):

1. Build frontend locally: `cd client && npm run build`
2. Copy build folder to server: `cp -r build ../server/public`
3. Update server.js to serve static files:
```javascript
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```
4. Deploy only the server folder to Render

## Cost Estimate
- **Free Plan**: $0/month (with sleep after inactivity)
- **Starter Plan**: $7/month per service (no sleep, better performance)
- **MongoDB Atlas**: Free M0 tier (512MB storage)

## Next Steps
1. Set up automatic deployments (push to GitHub → auto-deploy)
2. Configure custom domain
3. Set up monitoring and alerts
4. Add SSL certificate (automatic with Render)

Your app is now live and accessible from anywhere! 🎉
