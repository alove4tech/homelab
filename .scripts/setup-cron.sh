#!/bin/bash

# Setup system crontab for nightly homelab review and push

SCRIPT_PATH="/home/claw/.openclaw/workspace/homelab/.scripts/review-and-push.sh"
LOG_PATH="/home/claw/.openclaw/workspace/homelab/.scripts/review.log"

# Ensure script is executable
chmod +x "$SCRIPT_PATH"

# Add to crontab (runs at 10pm daily)
(crontab -l 2>/dev/null; echo "0 22 * * * $SCRIPT_PATH >> $LOG_PATH 2>&1") | crontab -

echo "✅ Cron job installed: Runs daily at 10:00 PM"
echo "📝 Script: $SCRIPT_PATH"
echo "📋 Log: $LOG_PATH"
echo ""
echo "To view logs: tail -f $LOG_PATH"
echo "To edit crontab: crontab -e"
echo "To remove: crontab -e (and delete the line)"
