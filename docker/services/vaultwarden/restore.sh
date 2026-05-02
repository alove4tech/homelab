#!/usr/bin/env bash
# Vaultwarden restore script
# Usage: ./restore.sh <backup_file>
# Restores a tar.gz backup created by backup.sh

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <backup_file.tar.gz>"
  exit 1
fi

BACKUP_FILE="$(readlink -f "$1")"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: $BACKUP_FILE not found"
  exit 1
fi

# Verify checksum if available
CHECKSUM_FILE="${BACKUP_FILE}.sha256"
if [ -f "$CHECKSUM_FILE" ]; then
  echo "Verifying checksum..."
  cd "$(dirname "$BACKUP_FILE")"
  if sha256sum -c "$(basename "$CHECKSUM_FILE")" --quiet; then
    echo "Checksum OK."
  else
    echo "Error: Checksum mismatch! Aborting restore."
    exit 1
  fi
else
  echo "Warning: No checksum file found at ${CHECKSUM_FILE}. Skipping verification."
fi

echo "WARNING: This will replace all Vaultwarden data with the contents of $BACKUP_FILE"
echo "Press Ctrl+C to cancel, or wait 5 seconds..."
sleep 5

# Stop the container to avoid data corruption
echo "Stopping Vaultwarden container..."
docker compose -f "$(dirname "$0")/docker-compose.yml" stop vaultwarden

echo "Restoring data from ${BACKUP_FILE}..."

docker run --rm \
  -v vaultwarden-data:/data \
  -v "$(dirname "$BACKUP_FILE")":/backup \
  alpine sh -c "rm -rf /data/* /data/.* 2>/dev/null; tar xzf /backup/$(basename "$BACKUP_FILE") -C /data"

echo "Starting Vaultwarden container..."
docker compose -f "$(dirname "$0")/docker-compose.yml" start vaultwarden

echo "Done. Verify the restore by checking http://<host>:80/alive"
