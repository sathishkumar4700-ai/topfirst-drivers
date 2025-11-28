# Step 2: Push to GitHub (2 minutes)

## Prepare Your Repository

### Option A: Create New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `topfirst-drivers` (or your choice)
3. Description: "Professional driver booking system for Chennai"
4. Choose **Public** (required for free Render deployment)
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

### Option B: Use Existing Repository

If you already have a GitHub repository, just note the URL.

---

## Push Your Code to GitHub

### 1. Initialize Git (if not already done)
```bash
git init
```

### 2. Add All Files
```bash
git add .
```

### 3. Commit Your Changes
```bash
git commit -m "Ready for Render deployment with MongoDB Atlas"
```

### 4. Add Remote Repository
Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub details:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

Example:
```bash
git remote add origin https://github.com/johndoe/topfirst-drivers.git
```

### 5. Push to GitHub
```bash
git branch -M main
git push -u origin main
```

---

## Verify Upload

1. Go to your GitHub repository URL
2. Refresh the page
3. You should see all your files including:
   - `server/` folder
   - `client/` folder
   - `render.yaml`
   - `README.md`
   - All documentation files

---

## ✅ Checklist
- [ ] GitHub account exists
- [ ] New repository created (or existing one ready)
- [ ] Repository is **PUBLIC**
- [ ] Code committed locally
- [ ] Code pushed to GitHub
- [ ] All files visible on GitHub

## Troubleshooting

### "Permission denied" error
You may need to authenticate with GitHub:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### "Repository not found" error
Make sure the remote URL is correct:
```bash
git remote -v
```

To change it:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

---

## Next Step
Once your code is on GitHub, proceed to **STEP_3_RENDER_BACKEND.md**
