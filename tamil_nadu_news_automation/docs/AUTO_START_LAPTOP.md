# Auto-run when you turn on the laptop (no manual start)

After a **one-time install**, the app runs **`python -m app.cli boot`** when you **log in** to your laptop. It:

- Makes trending Tamil Nadu news videos (**up to 3 minutes**)
- Creates **catchy thumbnails** and **YouTube titles/descriptions**
- **Uploads** to your channel (if YouTube OAuth is set up)
- Runs **only once per day** (won't duplicate if you restart the laptop)

You do **not** need to open Terminal every morning.

---

## Before auto-start works

Complete once:

1. Python + FFmpeg installed  
2. `pip install` in the project (see BEGINNER_SETUP.md)  
3. `.env` from `.env.toptrend71.example`  
4. Google `client_secrets.json` + `python -m app.cli youtube-auth` as **toptrend71@gmail.com**

---

## Windows — one-time install

1. Open **PowerShell** in folder:  
   `tamil_nadu_news_automation\scripts\windows`
2. Run:

```powershell
.\install-autostart.ps1
```

3. **Sign out and sign in** (or restart) to test.

Log file: `data\boot.log`

To remove: delete **TN-News-Daily.bat** from Startup folder  
(Press `Win+R`, type `shell:startup`, Enter)

---

## Mac — one-time install

In Terminal:

```bash
cd path/to/tamil_nadu_news_automation/scripts/mac
chmod +x install-autostart.sh autorun.sh
./install-autostart.sh
```

Log out and log in to test.

To remove:

```bash
launchctl unload ~/Library/LaunchAgents/com.tnnews.dailyboot.plist
rm ~/Library/LaunchAgents/com.tnnews.dailyboot.plist
```

---

## What happens when you turn on the laptop

1. You **log in** to Windows/Mac  
2. Auto-start runs **`boot`** in the background  
3. Wait **15–40 minutes** (first time can be longer) — laptop should stay awake  
4. Check **YouTube Studio** for new videos  

Keep the laptop **plugged in** and **not sleeping** until the job finishes.

---

## Settings (`.env`)

```env
RUN_TRIGGER=on_startup
SKIP_IF_RAN_TODAY=true
PUBLISH_MODE=auto
OPERATION_PHASE=4
```

Video length cap: `config/settings.yaml` → `max_duration_sec: 180` (3 minutes).
