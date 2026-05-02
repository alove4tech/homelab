#!/usr/bin/env bash
# Lubelogger backup script
# Backs up vehicle data and ASP.NET data protection keys.

set -euo pipefail

BACKUP_DIR="$(cd "$(dirname "$0")" && pwd)/backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "Backing up Lubelogger data..."
docker run --rm \
    -v lubelogger-data:/data:ro \
    -v "$BACKUP_DIR":/backup \
    alpine tar czf "/backup/lubelogger-data-${TIMESTAMP}.tar.gz" -C /data .

echo "Backing up Lubelogger keys..."
docker run --rm \
    -v lubelogger-keys:/data:ro \
    -v "$BACKUP_DIR":/backup \
    alpine tar czf "/backup/lubelogger-keys-${TIMESTAMP}.tar.gz" -C /data .

echo "Backup complete: $BACKUP_DIR"
ls -lh "$BACKUP_DIR"/lubelogger-*-"${TIMESTAMP}".tar.gz
