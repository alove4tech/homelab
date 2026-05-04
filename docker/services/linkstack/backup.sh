#!/usr/bin/env bash
# Linkstack backup script
# Backs up the SQLite database and user uploads/storage.
# Usage: ./backup.sh [backup_dir]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="${1:-$SCRIPT_DIR/backups}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

mkdir -p "$BACKUP_DIR"

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

for f in linkstack-data-${TIMESTAMP}.tar.gz linkstack-storage-${TIMESTAMP}.tar.gz; do
    if [ ! -f "${BACKUP_DIR}/${f}" ]; then
        echo "Error: ${f} was not created"
        exit 1
    fi
done

# Generate checksums for verification
cd "$BACKUP_DIR"
for f in linkstack-data-${TIMESTAMP}.tar.gz linkstack-storage-${TIMESTAMP}.tar.gz; do
    sha256sum "$f" > "${f}.sha256"
done

echo "Done. Files:"
echo "  ${BACKUP_DIR}/linkstack-data-${TIMESTAMP}.tar.gz"
echo "  ${BACKUP_DIR}/linkstack-storage-${TIMESTAMP}.tar.gz"
echo "Checksums written alongside each archive."
