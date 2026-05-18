#!/usr/bin/env bash
# Nexterm backup script
# Backs up the SQLite database and session data.
# Usage: ./backup.sh [backup_dir]

set -euo pipefail

KEEP_COUNT=5
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_NAME="${COMPOSE_PROJECT_NAME:-$(basename "$SCRIPT_DIR")}"
BACKUP_DIR="${1:-$SCRIPT_DIR/backups}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="nexterm-data-${TIMESTAMP}.tar.gz"

volume_name() {
    printf '%s_%s' "$PROJECT_NAME" "$1"
}

mkdir -p "$BACKUP_DIR"

# Stop the container for a consistent snapshot — Nexterm's SQLite DB can
# produce a corrupt backup if written to mid-copy.
echo "Stopping Nexterm container for consistent backup..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" stop nexterm

# Ensure the container gets restarted even if the backup fails
cleanup() {
  echo "Starting Nexterm container..."
  docker compose -f "$SCRIPT_DIR/docker-compose.yml" start nexterm
}
trap cleanup EXIT

echo "Backing up Nexterm data..."

docker run --rm \
    -v "$(volume_name nexterm-data)":/data:ro \
    -v "$BACKUP_DIR":/backup \
    alpine tar czf "/backup/${BACKUP_FILE}" -C /data .

if [ ! -f "${BACKUP_DIR}/${BACKUP_FILE}" ]; then
    echo "Error: Backup file was not created"
    exit 1
fi

# Generate checksum for verification
cd "$BACKUP_DIR"
sha256sum "$BACKUP_FILE" > "${BACKUP_FILE}.sha256"

# Prune old backups (keep the newest $KEEP_COUNT)
pruned=$(ls -1t nexterm-data-*.tar.gz 2>/dev/null | tail -n +"$((KEEP_COUNT + 1))")
if [ -n "$pruned" ]; then
    echo "Pruning old backups (keeping last ${KEEP_COUNT})..."
    echo "$pruned" | while read -r old; do
        rm -f "$old" "${old}.sha256"
        echo "  Removed: $old"
    done
fi

echo "Done. Backup size: $(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)"
echo "File: ${BACKUP_DIR}/${BACKUP_FILE}"
echo "Checksum: ${BACKUP_FILE}.sha256"
