#!/usr/bin/env bash
# Linkstack restore script
# Restores database and storage from a backup archive.
# Usage: ./restore.sh [data-timestamp] [storage-timestamp]
# If no timestamps given, lists available backups and prompts.

set -euo pipefail

BACKUP_DIR="$(cd "$(dirname "$0")" && pwd)/backups"

if [ ! -d "$BACKUP_DIR" ]; then
    echo "No backups directory found at $BACKUP_DIR"
    exit 1
fi

list_backups() {
    echo "Available data backups:"
    ls -1t "$BACKUP_DIR"/linkstack-data-*.tar.gz 2>/dev/null || echo "  (none)"
    echo ""
    echo "Available storage backups:"
    ls -1t "$BACKUP_DIR"/linkstack-storage-*.tar.gz 2>/dev/null || echo "  (none)"
}

if [ $# -lt 2 ]; then
    list_backups
    echo ""
    echo "Usage: $0 <data-timestamp> <storage-timestamp>"
    echo "Example: $0 20250101-120000 20250101-120000"
    exit 1
fi

DATA_TS="$1"
STORAGE_TS="$2"

DATA_FILE="$BACKUP_DIR/linkstack-data-${DATA_TS}.tar.gz"
STORAGE_FILE="$BACKUP_DIR/linkstack-storage-${STORAGE_TS}.tar.gz"

if [ ! -f "$DATA_FILE" ]; then
    echo "Data backup not found: $DATA_FILE"
    exit 1
fi

if [ ! -f "$STORAGE_FILE" ]; then
    echo "Storage backup not found: $STORAGE_FILE"
    exit 1
fi

# Verify checksums if available
for f in "$DATA_FILE" "$STORAGE_FILE"; do
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

echo "WARNING: This will replace current Linkstack data. Press Ctrl+C to cancel."
read -r -p "Continue? [y/N] " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Aborted."
    exit 0
fi

echo "Restoring Linkstack data..."
docker run --rm \
    -v linkstack-data:/data \
    -v "$BACKUP_DIR":/backup:ro \
    alpine sh -c "rm -rf /data/* && tar xzf /backup/linkstack-data-${DATA_TS}.tar.gz -C /data"

echo "Restoring Linkstack storage..."
docker run --rm \
    -v linkstack-storage:/data \
    -v "$BACKUP_DIR":/backup:ro \
    alpine sh -c "rm -rf /data/* && tar xzf /backup/linkstack-storage-${STORAGE_TS}.tar.gz -C /data"

echo "Restore complete. Restart Linkstack: docker compose restart linkstack"
