#!/usr/bin/env bash
# Lubelogger restore script
# Restores data and keys from a backup archive.
# Usage: ./restore.sh <timestamp>
# If no timestamp given, lists available backups and prompts.

set -euo pipefail

BACKUP_DIR="$(cd "$(dirname "$0")" && pwd)/backups"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "No backups directory found at $BACKUP_DIR"
    exit 1
fi

list_backups() {
    echo "Available data backups:"
    ls -1t "$BACKUP_DIR"/lubelogger-data-*.tar.gz 2>/dev/null || echo "  (none)"
    echo ""
    echo "Available key backups:"
    ls -1t "$BACKUP_DIR"/lubelogger-keys-*.tar.gz 2>/dev/null || echo "  (none)"
}

if [ $# -lt 1 ]; then
    list_backups
    echo ""
    echo "Usage: $0 <timestamp>"
    echo "Example: $0 20250101-120000"
    exit 1
fi

TIMESTAMP="$1"

DATA_FILE="$BACKUP_DIR/lubelogger-data-${TIMESTAMP}.tar.gz"
KEYS_FILE="$BACKUP_DIR/lubelogger-keys-${TIMESTAMP}.tar.gz"

if [ ! -f "$DATA_FILE" ]; then
    echo "Data backup not found: $DATA_FILE"
    exit 1
fi

if [ ! -f "$KEYS_FILE" ]; then
    echo "Keys backup not found: $KEYS_FILE"
    exit 1
fi

# Verify checksums if available
for f in "$DATA_FILE" "$KEYS_FILE"; do
    checksum="${f}.sha256"
    if [ -f "$checksum" ]; then
        echo "Verifying checksum for $(basename "$f")..."
        cd "$BACKUP_DIR"
        if sha256sum -c "$(basename "$checksum")" --quiet; then
            echo "  OK"
        else
            echo "Error: Checksum mismatch for $(basename "$f")! Aborting."
            exit 1
        fi
    fi
done

echo "WARNING: This will replace current Lubelogger data. Press Ctrl+C to cancel."
read -r -p "Continue? [y/N] " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Aborted."
    exit 0
fi

echo "Restoring Lubelogger data..."
docker run --rm \
    -v lubelogger-data:/data \
    -v "$BACKUP_DIR":/backup:ro \
    alpine sh -c "rm -rf /data/* && tar xzf /backup/lubelogger-data-${TIMESTAMP}.tar.gz -C /data"

echo "Restoring Lubelogger keys..."
docker run --rm \
    -v lubelogger-keys:/data \
    -v "$BACKUP_DIR":/backup:ro \
    alpine sh -c "rm -rf /data/* && tar xzf /backup/lubelogger-keys-${TIMESTAMP}.tar.gz -C /data"

echo "Restore complete. Restart Lubelogger: docker compose restart lubelogger"
