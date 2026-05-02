#!/usr/bin/env bash
# Nexterm backup script
# Backs up the SQLite database and session data.

set -euo pipefail

BACKUP_DIR="$(cd "$(dirname "$0")" && pwd)/backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "Backing up Nexterm data..."
docker run --rm \
    -v nexterm-data:/data:ro \
    -v "$BACKUP_DIR":/backup \
    alpine tar czf "/backup/nexterm-data-${TIMESTAMP}.tar.gz" -C /data .

echo "Backup complete: $BACKUP_DIR"
ls -lh "$BACKUP_DIR"/nexterm-data-"${TIMESTAMP}".tar.gz
