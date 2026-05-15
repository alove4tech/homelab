#!/usr/bin/env bash
# Run backup.sh for every service that has one.
# Run from the docker/ directory: ./backup-all.sh [backup_root]
#
# If backup_root is given, each service's backups go into
#   <backup_root>/<service-name>/
# Otherwise each backup.sh uses its default (./backups next to the script).

set -euo pipefail

SERVICES_DIR="$(cd "$(dirname "$0")" && pwd)/services"
BACKUP_ROOT="${1:-}"

if ! command -v docker &>/dev/null; then
  echo "Error: docker command not found. Is Docker installed?"
  exit 1
fi

if ! docker info &>/dev/null; then
  echo "Error: Docker daemon is not running (or current user lacks permissions)."
  exit 1
fi

succeeded=0
failed=0
skipped=0

echo "Backing up homelab services..."
echo "============================================"

for dir in "$SERVICES_DIR"/*/; do
    name="$(basename "$dir")"
    if [ -f "$dir/backup.sh" ]; then
        echo ""
        echo "Backing up $name..."

        # Build the argument list — only pass backup_root if provided
        args=()
        if [ -n "$BACKUP_ROOT" ]; then
            svc_dir="${BACKUP_ROOT}/${name}"
            mkdir -p "$svc_dir"
            args=("$svc_dir")
        fi

        if (cd "$dir" && bash backup.sh "${args[@]}"); then
            succeeded=$((succeeded + 1))
            echo "  $name: backed up"
        else
            failed=$((failed + 1))
            echo "  $name: FAILED"
        fi
    else
        skipped=$((skipped + 1))
    fi
done

echo ""
echo "============================================"
echo "Done. $succeeded backed up, $failed failed, $skipped skipped."
if [ "$failed" -gt 0 ]; then
    echo "Check the output above for details."
    exit 1
fi
