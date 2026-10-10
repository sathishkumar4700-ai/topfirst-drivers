#!/bin/bash
# TN News — run once at login. Install with scripts/mac/install-autostart.sh
PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_DIR" || exit 1
source .venv/bin/activate
python -m app.cli boot >> data/boot.log 2>&1
