#!/usr/bin/env bash
# Stirling PDF restore script
# Usage: ./restore.sh <data_backup> <config_backup>
# Restores tar.gz backups created by backup.sh

set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: $0 <data_backup.tar.gz> <config_backup.tar.gz>"
  exit 1
fi

DATA_BACKUP="$(readlink -f "$1")"
CONFIG_BACKUP="$(readlink -f "$2")"

if [ ! -f "$DATA_BACKUP" ]; then
  echo "Error: $DATA_BACKUP not found"
  exit 1
fi

if [ ! -f "$CONFIG_BACKUP" ]; then
  echo "Error: $CONFIG_BACKUP not found"
  exit 1
fi

# Verify checksums if available
for BACKUP_FILE in "$DATA_BACKUP" "$CONFIG_BACKUP"; do
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
    echo "Warning: No checksum for $(basename "$BACKUP_FILE"). Skipping."
  fi
done

echo "WARNING: This will replace all Stirling PDF data and config"
echo "Press Ctrl+C to cancel, or wait 5 seconds..."
sleep 5

echo "Stopping Stirling PDF container..."
docker compose -f "$(dirname "$0")/docker-compose.yml" stop stirlingpdf

echo "Restoring data..."
docker run --rm \
  -v stirlingpdf-data:/data \
  -v "$(dirname "$DATA_BACKUP")":/backup \
  alpine sh -c "rm -rf /data/* /data/.* 2>/dev/null; tar xzf /backup/$(basename "$DATA_BACKUP") -C /data"

echo "Restoring config..."
docker run --rm \
  -v stirlingpdf-config:/config \
  -v "$(dirname "$CONFIG_BACKUP")":/backup \
  alpine sh -c "rm -rf /config/* /config/.* 2>/dev/null; tar xzf /backup/$(basename "$CONFIG_BACKUP") -C /config"

echo "Starting Stirling PDF container..."
docker compose -f "$(dirname "$0")/docker-compose.yml" start stirlingpdf

echo "Done. Verify the restore by checking http://<host>:8480"
