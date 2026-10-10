# Step-by-step setup (non-technical)

This guide helps you run **Tamil Nadu daily news videos** on your computer, then later post them to your YouTube channel **toptrend71@gmail.com**.

You will do this in **three parts**. You can stop after Part 1 and still see videos on your PC.

---

## What you need before starting

- A Windows or Mac computer (8 GB RAM or more is better).
- Internet.
- About 1 hour for Part 1. Part 2 (YouTube) needs another 30–60 minutes the first time.
- For YouTube later: access to **toptrend71@gmail.com** (password and phone for Google sign-in).

---

# PART 1 — See today’s news videos on your computer (no YouTube yet)

**Goal:** The program picks Tamil Nadu news, makes 2 Tamil videos, and saves them in a folder. Nothing is uploaded.

### Step 1 — Install Python

**Windows**

1. Open: https://www.python.org/downloads/
2. Click **Download Python 3.12** (or newest 3.12.x).
3. Run the installer.
4. **Important:** On the first screen, tick **“Add python.exe to PATH”**, then click **Install Now**.
5. When finished, close the installer.

**Mac**

1. Open **Terminal** (search “Terminal” in Spotlight).
2. If you use Homebrew: `brew install python@3.12`  
   Or download from https://www.python.org/downloads/ like Windows.

### Step 2 — Install FFmpeg (for video)

**Windows**

1. Open: https://www.gyan.dev/ffmpeg/builds/ (or search “ffmpeg windows download”).
2. Download a **release** build (zip).
3. Unzip to `C:\ffmpeg`.
4. Add `C:\ffmpeg\bin` to your system PATH (search Windows for “Environment Variables” → Path → New).

**Mac**

```bash
brew install ffmpeg
```

### Step 3 — Open the project folder

1. Download or clone this project from GitHub (or unzip the folder you received).
2. Open the folder **`tamil_nadu_news_automation`**.
3. Remember this path (example: `C:\Users\You\Downloads\tamil_nadu_news_automation`).

### Step 4 — Open Command Prompt or Terminal in that folder

**Windows:** In File Explorer, click inside the folder address bar, type `cmd`, press Enter.

**Mac:** In Terminal:

```bash
cd path/to/tamil_nadu_news_automation
```

### Step 5 — Install the program (copy each line, press Enter, wait)

```bash
python -m venv .venv
```

**Windows:**

```bash
.venv\Scripts\activate
```

**Mac:**

```bash
source .venv/bin/activate
```

Then:

```bash
pip install -r requirements.txt
pip install -e .
copy .env.example .env
```

(On Mac use `cp .env.example .env` instead of `copy`.)

### Step 6 — First run (creates videos)

```bash
python -m app.cli init-db
python -m app.cli run
```

**This can take 5–15 minutes.** You will see text scrolling — that is normal.

### Step 7 — Watch your videos

1. Open folder: `tamil_nadu_news_automation` → `data` → `output`.
2. Open the newest `run_1` (or `run_2`) folder.
3. Inside `story_1` and `story_2`, double-click **`final.mp4`** to play.

**Part 1 done.** If the videos look OK, continue to Part 2 when you want them on YouTube.

---

# PART 2 — Connect YouTube (toptrend71@gmail.com)

**Goal:** Allow the program to upload to **your** channel only.

You need a **Google Cloud** project (free to create; YouTube API has daily limits but normal use is fine for 2 videos/day).

### Step 1 — Google Cloud console

1. Sign in to https://console.cloud.google.com/ with **toptrend71@gmail.com**.
2. Click **Select a project** → **New project**.
3. Name it e.g. `TN News Videos` → **Create**.

### Step 2 — Turn on YouTube API

1. Menu (☰) → **APIs & Services** → **Library**.
2. Search **YouTube Data API v3**.
3. Click it → **Enable**.

### Step 3 — OAuth consent screen (one time)

1. **APIs & Services** → **OAuth consent screen**.
2. User type: **External** → **Create**.
3. App name: e.g. `TN News Automation`.
4. User support email: **toptrend71@gmail.com**.
5. Developer contact: same email.
6. **Save and continue** through Scopes (defaults OK) and Test users.
7. Add **toptrend71@gmail.com** as a test user if the app is in “Testing” mode.
8. **Save**.

### Step 4 — Create OAuth client ID

1. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**.
2. Application type: **Desktop app** (easiest for home PC).
3. Name: `Desktop TN News`.
4. **Create** → **Download JSON**.

### Step 5 — Put the JSON file in the project

1. Create folder: `tamil_nadu_news_automation\data\secrets` (if it does not exist).
2. Move the downloaded file into that folder.
3. Rename it exactly to: **`client_secrets.json`**

### Step 6 — Use the channel settings file

In the project folder:

**Windows:**

```bash
copy .env.toptrend71.example .env
```

**Mac:**

```bash
cp .env.toptrend71.example .env
```

Open `.env` in Notepad and change:

- `DASHBOARD_PASSWORD=` to a password you will remember (for the web dashboard).

Leave:

- `YOUTUBE_EXPECTED_EMAIL=toptrend71@gmail.com`
- `PUBLISH_MODE=auto`
- `RUN_MODE=production`

### Step 7 — Sign in to YouTube (browser opens)

Make sure `.venv` is still activated, then:

```bash
python -m app.cli youtube-auth
```

1. Browser opens → choose **toptrend71@gmail.com**.
2. If Google warns “app not verified” → **Advanced** → **Go to TN News Automation (unsafe)** — this is *your* app in Testing mode.
3. Allow permissions.

### Step 8 — Check the correct channel

```bash
python -m app.cli youtube-whoami
```

You must see:

- Email: **toptrend71@gmail.com**
- Channel name: **your** channel name

If the email is wrong: delete file `data\secrets\youtube_token.json` and run `youtube-auth` again.

### Step 9 — Test one upload run

```bash
python -m app.cli run
```

After it finishes, check YouTube Studio (studio.youtube.com) — new videos may be **public** (because `RUN_MODE=production`).

**Part 2 done.**

---

# PART 3 — Run every morning automatically

**Goal:** At **7:15 AM India time**, the computer/server runs the job and uploads (if Part 2 is done).

The computer must stay **on** (or use a cloud server).

### Step 1 — Start the background service

In the project folder (venv activated):

```bash
python -m app.cli serve
```

Leave this window open. Open browser: http://localhost:8080  
Login: username `admin`, password = what you set in `.env` as `DASHBOARD_PASSWORD`.

### Step 2 — Keep it running 24/7 (options)

- **Simple:** Leave an old PC on with `serve` running.
- **Better:** Rent a small VPS (DigitalOcean, AWS, etc.) and use **Docker** — ask a technical friend or hire help for one hour to run `docker compose up -d` from the project README.

### Step 3 — Pause if needed

Open dashboard → **Pause** or **Emergency stop** if you go on holiday.

---

## Quick checklist

| Step | Done? |
|------|--------|
| Part 1: `python -m app.cli run` and watched `final.mp4` | ☐ |
| Part 2: `client_secrets.json` in `data/secrets` | ☐ |
| Part 2: `youtube-whoami` shows toptrend71@gmail.com | ☐ |
| Part 3: `python -m app.cli serve` running daily | ☐ |

---

## If something goes wrong

- **“python is not recognized”** → Reinstall Python with **Add to PATH** checked.
- **No videos in output** → Wait longer; check internet; run again next day.
- **Upload failed** → Run `youtube-whoami`; redo `youtube-auth`.
- **Wrong channel** → Delete `youtube_token.json`, auth again with correct Google account.

For more detail: [YOUTUBE.md](YOUTUBE.md) and [PHASES.md](PHASES.md).
