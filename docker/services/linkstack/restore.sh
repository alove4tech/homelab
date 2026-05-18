#!/usr/bin/env bash
# Linkstack restore script
# Usage: ./restore.sh <data_backup> <storage_backup>
# Restores tar.gz backups created by backup.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_NAME="${COMPOSE_PROJECT_NAME:-$(basename "$SCRIPT_DIR")}"

volume_name() {
    printf '%s_%s' "$PROJECT_NAME" "$1"
}

if [ $# -lt 2 ]; then
    echo "Usage: $0 <data_backup.tar.gz> <storage_backup.tar.gz>"
    exit 1
fi

DATA_BACKUP="$(readlink -f "$1")"
STORAGE_BACKUP="$(readlink -f "$2")"

if [ ! -f "$DATA_BACKUP" ]; then
    echo "Error: $DATA_BACKUP not found"
    exit 1
fi

if [ ! -f "$STORAGE_BACKUP" ]; then
    echo "Error: $STORAGE_BACKUP not found"
    exit 1
fi

# Verify checksums if available
for BACKUP_FILE in "$DATA_BACKUP" "$STORAGE_BACKUP"; do
    CHECKSUM_FILE="${BACKUP_FILE}.sha256"
    if [ -f "$CHECKSUM_FILE" ]; then
        echo "Verifying checksum for $(basename "$BACKUP_FILE")..."
        cd "$(dirname "$BACKUP_FILE")"
        if sha256sum -c "$(basename "$CHECKSUM_FILE")" --quiet; then
            echo "Checksum OK."
        else
            echo "Error: Checksum mismatch for $(basename "$BACKUP_FILE")! Aborting restore."
            exit 1
        fi
    else
        echo "Warning: No checksum for $(basename "$BACKUP_FILE"). Skipping verification."
    fi
done

echo "WARNING: This will replace all Linkstack data and storage"
echo "Press Ctrl+C to cancel, or wait 5 seconds..."
sleep 5

# Stop the container to avoid data corruption
echo "Stopping Linkstack container..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" stop linkstack

echo "Restoring Linkstack data..."
docker run --rm \
    -v "$(volume_name linkstack-data)":/data \
    -v "$(dirname "$DATA_BACKUP")":/backup \
    alpine sh -c "rm -rf /data/* /data/.* 2>/dev/null; tar xzf /backup/$(basename "$DATA_BACKUP") -C /data"

echo "Restoring Linkstack storage..."
docker run --rm \
    -v "$(volume_name linkstack-storage)":/data \
    -v "$(dirname "$STORAGE_BACKUP")":/backup \
    alpine sh -c "rm -rf /data/* /data/.* 2>/dev/null; tar xzf /backup/$(basename "$STORAGE_BACKUP") -C /data"

echo "Starting Linkstack container..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" start linkstack

echo "Done. Verify the restore by checking http://<host>:8082"
