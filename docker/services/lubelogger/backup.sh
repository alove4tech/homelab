#!/usr/bin/env bash
# Lubelogger backup script
# Backs up vehicle data and ASP.NET data protection keys.
# Usage: ./backup.sh [backup_dir]

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="${1:-$SCRIPT_DIR/backups}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

mkdir -p "$BACKUP_DIR"

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

for f in lubelogger-data-${TIMESTAMP}.tar.gz lubelogger-keys-${TIMESTAMP}.tar.gz; do
    if [ ! -f "${BACKUP_DIR}/${f}" ]; then
        echo "Error: ${f} was not created"
        exit 1
    fi
done

# Generate checksums for verification
cd "$BACKUP_DIR"
for f in lubelogger-data-${TIMESTAMP}.tar.gz lubelogger-keys-${TIMESTAMP}.tar.gz; do
    sha256sum "$f" > "${f}.sha256"
done

echo "Done. Files:"
echo "  ${BACKUP_DIR}/lubelogger-data-${TIMESTAMP}.tar.gz"
echo "  ${BACKUP_DIR}/lubelogger-keys-${TIMESTAMP}.tar.gz"
echo "Checksums written alongside each archive."
