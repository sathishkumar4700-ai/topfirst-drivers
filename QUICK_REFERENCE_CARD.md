# 🎴 Quick Reference Card

## Deployment Commands & URLs

### MongoDB Atlas
```
URL: https://www.mongodb.com/cloud/atlas/register
Connection String Format:
mongodb+srv://username:password@cluster.mongodb.net/topfirst-drivers?retryWrites=true&w=majority
```

### GitHub Commands
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

### Render URLs
```
Dashboard: https://dashboard.render.com
Backend Health: https://YOUR-BACKEND.onrender.com/health
Frontend: https://YOUR-FRONTEND.onrender.com
```

---

## Environment Variables

### Backend (3 variables)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/topfirst-drivers
JWT_SECRET=your-secret-key-minimum-32-characters-long
NODE_ENV=production
```

### Frontend (1 variable)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

---

## Render Configuration

### Backend Service
```
Type: Web Service
Root Directory: server
Build Command: npm install
Start Command: npm start
Plan: Free
```

### Frontend Service
```
Type: Static Site
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: build
Plan: Free
```

---

## Test Credentials

### Admin Login
```
Email: admin
Password: admin123
```

### Super Admin Phones
```
9962366104 - Kraja
8179824281 - Sathish
Password: Tharish@4700
```

---

## Deployment Checklist

```
□ MongoDB Atlas cluster created
□ Connection string saved
□ Code pushed to GitHub
□ Backend deployed on Render
□ Frontend deployed on Render
□ Environment variables set
□ Health check passing
□ App tested and working
```

---

## Time Estimates

```
MongoDB Atlas:    2 minutes
GitHub Push:      2 minutes
Backend Deploy:   3 minutes
Frontend Deploy:  2 minutes
Testing:          5 minutes
─────────────────────────────
TOTAL:           15 minutes
```

---

## Cost Summary

```
Free Tier:
  Backend:  $0 (with sleep)
  Frontend: $0
  Database: $0
  Total:    $0/month

Starter Tier:
  Backend:  $7 (no sleep)
  Frontend: $0
  Database: $0
  Total:    $7/month
```

---

## Important URLs

```
MongoDB Atlas:  mongodb.com/cloud/atlas
GitHub:         github.com
Render:         render.com
UptimeRobot:    uptimerobot.com (optional)
```

---

## Troubleshooting Quick Fixes

```
Backend won't start:
→ Check Render logs
→ Verify environment variables
→ Check MongoDB connection

Frontend can't connect:
→ Verify REACT_APP_API_URL
→ Check backend is running
→ No trailing slash in URL

Slow first load:
→ Normal for free tier
→ Backend waking up (30-60s)
→ Use UptimeRobot to keep awake

Database errors:
→ Check connection string
→ Verify IP whitelist (0.0.0.0/0)
→ Check MongoDB Atlas status
```

---

## Key Files

```
Configuration:
  client/src/config.js
  render.yaml
  .gitignore

Documentation:
  🎯_START_DEPLOYMENT_HERE.md
  STEP_1_MONGODB_ATLAS.md
  STEP_2_GITHUB.md
  STEP_3_RENDER_BACKEND.md
  STEP_4_RENDER_FRONTEND.md
  STEP_5_TESTING.md
```

---

## Support Resources

```
Render Docs:   render.com/docs
MongoDB Docs:  docs.atlas.mongodb.com
GitHub Docs:   docs.github.com
```

---

**Print this card for quick reference during deployment!**
