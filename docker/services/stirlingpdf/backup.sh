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

# Generate checksums for verification
cd "$BACKUP_DIR"
for f in stirlingpdf-data-${TIMESTAMP}.tar.gz stirlingpdf-config-${TIMESTAMP}.tar.gz; do
  sha256sum "$f" > "${f}.sha256"
done

# Prune old backups (keep the newest 5 of each)
KEEP_COUNT=5
for prefix in stirlingpdf-data stirlingpdf-config; do
    pruned=$(ls -1t ${prefix}-*.tar.gz 2>/dev/null | tail -n +"$((KEEP_COUNT + 1))")
    if [ -n "$pruned" ]; then
        echo "Pruning old ${prefix} backups (keeping last ${KEEP_COUNT})..."
        echo "$pruned" | while read -r old; do
            rm -f "$old" "${old}.sha256"
            echo "  Removed: $old"
        done
    fi
done

echo "Done."
echo "Files:"
echo "  ${BACKUP_DIR}/stirlingpdf-data-${TIMESTAMP}.tar.gz"
echo "  ${BACKUP_DIR}/stirlingpdf-config-${TIMESTAMP}.tar.gz"
echo "Checksums written alongside each archive."
