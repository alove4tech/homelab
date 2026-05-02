#!/usr/bin/env bash
# Linkstack backup script
# Backs up the SQLite database and user uploads/storage.

set -euo pipefail

BACKUP_DIR="$(cd "$(dirname "$0")" && pwd)/backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "Backing up Linkstack data..."
docker run --rm \
    -v linkstack-data:/data:ro \
    -v "$BACKUP_DIR":/backup \
    alpine tar czf "/backup/linkstack-data-${TIMESTAMP}.tar.gz" -C /data .

echo "Backing up Linkstack storage..."
docker run --rm \
    -v linkstack-storage:/data:ro \
    -v "$BACKUP_DIR":/backup \
    alpine tar czf "/backup/linkstack-storage-${TIMESTAMP}.tar.gz" -C /data .

echo "Backup complete: $BACKUP_DIR"
ls -lh "$BACKUP_DIR"/linkstack-*-"${TIMESTAMP}".tar.gz
