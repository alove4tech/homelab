#!/usr/bin/env bash
# Stirling PDF backup script
# Usage: ./backup.sh [backup_dir]
# Defaults to ./backups next to this script

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="${1:-$SCRIPT_DIR/backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"

echo "Backing up Stirling PDF data and config..."

docker run --rm \
  -v stirlingpdf-data:/data:ro \
  -v stirlingpdf-config:/config:ro \
  -v "${BACKUP_DIR}":/backup \
  alpine sh -c "tar czf /backup/stirlingpdf-data-${TIMESTAMP}.tar.gz -C /data . && tar czf /backup/stirlingpdf-config-${TIMESTAMP}.tar.gz -C /config ."

for f in stirlingpdf-data-${TIMESTAMP}.tar.gz stirlingpdf-config-${TIMESTAMP}.tar.gz; do
  if [ ! -f "${BACKUP_DIR}/${f}" ]; then
    echo "Error: ${f} was not created"
    exit 1
  fi
done

echo "Done."

# Generate checksums for verification
cd "$BACKUP_DIR"
for f in stirlingpdf-data-${TIMESTAMP}.tar.gz stirlingpdf-config-${TIMESTAMP}.tar.gz; do
  sha256sum "$f" > "${f}.sha256"
done

echo "Files:"
echo "  ${BACKUP_DIR}/stirlingpdf-data-${TIMESTAMP}.tar.gz"
echo "  ${BACKUP_DIR}/stirlingpdf-config-${TIMESTAMP}.tar.gz"
echo "Checksums written alongside each archive."
