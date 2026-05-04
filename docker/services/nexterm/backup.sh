#!/usr/bin/env bash
# Nexterm backup script
# Backs up the SQLite database and session data.
# Usage: ./backup.sh [backup_dir]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="${1:-$SCRIPT_DIR/backups}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="nexterm-data-${TIMESTAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"

echo "Backing up Nexterm data..."

docker run --rm \
    -v nexterm-data:/data:ro \
    -v "$BACKUP_DIR":/backup \
    alpine tar czf "/backup/${BACKUP_FILE}" -C /data .

if [ ! -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    echo "Error: Backup file was not created"
    exit 1
fi

# Generate checksum for verification
cd "$BACKUP_DIR"
sha256sum "$BACKUP_FILE" > "${BACKUP_FILE}.sha256"

echo "Done. Backup size: $(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)"
echo "File: ${BACKUP_DIR}/${BACKUP_FILE}"
echo "Checksum: ${BACKUP_FILE}.sha256"
