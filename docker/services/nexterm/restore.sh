#!/usr/bin/env bash
# Nexterm restore script
# Restores data from a backup archive.
# Usage: ./restore.sh <timestamp>
# If no timestamp given, lists available backups and prompts.

set -euo pipefail

BACKUP_DIR="$(cd "$(dirname "$0")" && pwd)/backups"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "No backups directory found at $BACKUP_DIR"
    exit 1
fi

list_backups() {
    echo "Available backups:"
    ls -1t "$BACKUP_DIR"/nexterm-data-*.tar.gz 2>/dev/null || echo "  (none)"
}

if [ $# -lt 1 ]; then
    list_backups
    echo ""
    echo "Usage: $0 <timestamp>"
    echo "Example: $0 20250101-120000"
    exit 1
fi

TIMESTAMP="$1"

DATA_FILE="$BACKUP_DIR/nexterm-data-${TIMESTAMP}.tar.gz"

if [ ! -f "$DATA_FILE" ]; then
    echo "Backup not found: $DATA_FILE"
    exit 1
fi

# Verify checksum if available
checksum="${DATA_FILE}.sha256"
if [ -f "$checksum" ]; then
    echo "Verifying checksum..."
    cd "$BACKUP_DIR"
    if sha256sum -c "$(basename "$checksum")" --quiet; then
        echo "  OK"
    else
        echo "Error: Checksum mismatch! Aborting."
        exit 1
    fi
fi

echo "WARNING: This will replace current Nexterm data. Press Ctrl+C to cancel."
read -r -p "Continue? [y/N] " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Aborted."
    exit 0
fi

echo "Restoring Nexterm data..."
docker run --rm \
    -v nexterm-data:/data \
    -v "$BACKUP_DIR":/backup:ro \
    alpine sh -c "rm -rf /data/* && tar xzf /backup/nexterm-data-${TIMESTAMP}.tar.gz -C /data"

echo "Restore complete. Restart Nexterm: docker compose restart nexterm"
