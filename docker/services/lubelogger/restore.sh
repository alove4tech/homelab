#!/usr/bin/env bash
# Lubelogger restore script
# Usage: ./restore.sh <data_backup> <keys_backup>
# Restores tar.gz backups created by backup.sh

set -euo pipefail

if [ $# -lt 2 ]; then
    echo "Usage: $0 <data_backup.tar.gz> <keys_backup.tar.gz>"
    exit 1
fi

DATA_BACKUP="$(readlink -f "$1")"
KEYS_BACKUP="$(readlink -f "$2")"

if [ ! -f "$DATA_BACKUP" ]; then
    echo "Error: $DATA_BACKUP not found"
    exit 1
fi

if [ ! -f "$KEYS_BACKUP" ]; then
    echo "Error: $KEYS_BACKUP not found"
    exit 1
fi

# Verify checksums if available
for BACKUP_FILE in "$DATA_BACKUP" "$KEYS_BACKUP"; do
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

echo "WARNING: This will replace all Lubelogger data and encryption keys"
echo "Press Ctrl+C to cancel, or wait 5 seconds..."
sleep 5

# Stop the container to avoid data corruption
echo "Stopping Lubelogger container..."
docker compose -f "$(dirname "$0")/docker-compose.yml" stop lubelogger

echo "Restoring Lubelogger data..."
docker run --rm \
    -v lubelogger-data:/data \
    -v "$(dirname "$DATA_BACKUP")":/backup \
    alpine sh -c "rm -rf /data/* /data/.* 2>/dev/null; tar xzf /backup/$(basename "$DATA_BACKUP") -C /data"

echo "Restoring Lubelogger keys..."
docker run --rm \
    -v lubelogger-keys:/data \
    -v "$(dirname "$KEYS_BACKUP")":/backup \
    alpine sh -c "rm -rf /data/* /data/.* 2>/dev/null; tar xzf /backup/$(basename "$KEYS_BACKUP") -C /data"

echo "Starting Lubelogger container..."
docker compose -f "$(dirname "$0")/docker-compose.yml" start lubelogger

echo "Done. Verify the restore by checking http://<host>:8083"
