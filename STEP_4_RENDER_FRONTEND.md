# Step 4: Deploy Frontend on Render (2 minutes)

## Create Frontend Static Site

### 1. Create New Static Site
1. In Render dashboard, click "New +" button
2. Select "Static Site"
3. Select your `topfirst-drivers` repository
4. Click "Connect"

### 2. Configure Frontend Service

Fill in these settings:

**Basic Settings:**
- **Name**: `topfirst-frontend` (or your choice)
- **Branch**: `main`
- **Root Directory**: `client`

**Build Settings:**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

**Plan:**
- Select **Free** (Starter Free)

### 3. Add Environment Variable

Click "Advanced" → "Add Environment Variable"

Add ONE variable:

#### REACT_APP_API_URL
- **Key**: `REACT_APP_API_URL`
- **Value**: Your backend URL from Step 3 (WITHOUT trailing slash)
  ```
  https://topfirst-api.onrender.com
  ```

**IMPORTANT**: Use YOUR actual backend URL, not the example above!

### 4. Deploy!
1. Click "Create Static Site"
2. Wait 3-5 minutes for build and deployment
3. Watch the logs - you should see:
   ```
   ==> Building...
   ==> Installing dependencies...
   ==> Creating optimized production build...
   ==> Build successful!
   ==> Deploying...
   ==> Deploy successful!
   ```

### 5. Get Your Frontend URL
Once deployed, you'll see your site URL:
```
https://topfirst-frontend.onrender.com
```

**THIS IS YOUR APP URL** - Share this with users!

---

## ✅ Checklist
- [ ] Static Site created
- [ ] Repository connected
- [ ] Root directory set to `client`
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `build`
- [ ] REACT_APP_API_URL added with backend URL
- [ ] Site deployed successfully
- [ ] Frontend URL works

## Troubleshooting

### Build Failed
- Check logs for errors
- Verify `client/package.json` exists
- Ensure React build completes successfully

### "Cannot connect to backend"
- Verify REACT_APP_API_URL is correct
- Check backend is running (visit /health endpoint)
- Ensure no trailing slash in API URL

### Blank Page
- Check browser console for errors
- Verify build completed successfully
- Check publish directory is `build` not `dist`

---

## Next Step
Your app is now LIVE! Proceed to **STEP_5_TESTING.md** to verify everything works!
