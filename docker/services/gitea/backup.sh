#!/usr/bin/env bash
# Gitea backup script
# Usage: ./backup.sh [backup_dir]
# Defaults to ./backups next to this script

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="${1:-$SCRIPT_DIR/backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_FILE="gitea-backup-${TIMESTAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"

echo "Backing up Gitea data to ${BACKUP_DIR}/${BACKUP_FILE}..."

docker run --rm \
  -v gitea-data:/data:ro \
  -v "${BACKUP_DIR}":/backup \
  alpine tar czf "/backup/${BACKUP_FILE}" -C /data .

echo "Done. Backup size: $(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)"
echo "File: ${BACKUP_DIR}/${BACKUP_FILE}"

# Generate checksum for verification
cd "$BACKUP_DIR"
sha256sum "$BACKUP_FILE" > "${BACKUP_FILE}.sha256"
echo "Checksum: ${BACKUP_FILE}.sha256"
