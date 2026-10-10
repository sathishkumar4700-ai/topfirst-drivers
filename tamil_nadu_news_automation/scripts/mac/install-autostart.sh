#!/bin/bash
set -euo pipefail
PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
PLIST_NAME="com.tnnews.dailyboot.plist"
PLIST_PATH="$HOME/Library/LaunchAgents/$PLIST_NAME"
RUN_SCRIPT="$PROJECT_DIR/scripts/mac/autorun.sh"
chmod +x "$RUN_SCRIPT"

cat > "$PLIST_PATH" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.tnnews.dailyboot</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>$RUN_SCRIPT</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>StandardOutPath</key>
  <string>$PROJECT_DIR/data/boot.log</string>
  <key>StandardErrorPath</key>
  <string>$PROJECT_DIR/data/boot.log</string>
</dict>
</plist>
EOF

launchctl unload "$PLIST_PATH" 2>/dev/null || true
launchctl load "$PLIST_PATH"
echo "Installed Mac login auto-start: $PLIST_PATH"
