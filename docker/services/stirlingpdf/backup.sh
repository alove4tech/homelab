#!/usr/bin/env bash
# Stirling PDF backup script
# Usage: ./backup.sh [backup_dir]
# Defaults to ./backups next to this script
#
# Keeps the 5 most recent backups; older ones are pruned automatically.

set -euo pipefail

KEEP_COUNT=5
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_NAME="${COMPOSE_PROJECT_NAME:-$(basename "$SCRIPT_DIR")}"
BACKUP_DIR="${1:-$SCRIPT_DIR/backups}"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"

volume_name() {
  printf '%s_%s' "$PROJECT_NAME" "$1"
}

mkdir -p "$BACKUP_DIR"

# Stop the container for a consistent snapshot — Stirling PDF's config files
# can change during operation and produce an inconsistent backup if copied mid-write.
echo "Stopping Stirling PDF container for consistent backup..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" stop stirlingpdf

# Ensure the container gets restarted even if the backup fails
cleanup() {
  echo "Starting Stirling PDF container..."
  docker compose -f "$SCRIPT_DIR/docker-compose.yml" start stirlingpdf
}
trap cleanup EXIT

echo "Backing up Stirling PDF data and config..."

docker run --rm \
  -v "$(volume_name stirlingpdf-data)":/data:ro \
  -v "$(volume_name stirlingpdf-config)":/config:ro \
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

# Prune old backups (keep the newest $KEEP_COUNT of each)
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
