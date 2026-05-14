#!/usr/bin/env bash
# Pull fresh images and restart all homelab services.
# Run from the docker/ directory: ./update-all.sh
set -euo pipefail

SERVICES_DIR="$(cd "$(dirname "$0")" && pwd)/services"

if ! command -v docker &>/dev/null; then
  echo "Error: docker command not found. Is Docker installed?"
  exit 1
fi

if ! docker info &>/dev/null; then
  echo "Error: Docker daemon is not running (or current user lacks permissions)."
  exit 1
fi

updated=0
failed=0
skipped=0

echo "Updating homelab services..."
echo "============================================"

for dir in "$SERVICES_DIR"/*/; do
    name="$(basename "$dir")"
    if [ -f "$dir/docker-compose.yml" ]; then
        echo ""
        echo "Updating $name..."
        if (cd "$dir" && docker compose pull 2>&1 && docker compose up -d 2>&1); then
            updated=$((updated + 1))
            echo "  $name: updated"
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
echo "Done. $updated updated, $failed failed, $skipped skipped."
if [ "$failed" -gt 0 ]; then
    echo "Check logs with: docker compose -f docker/services/<name>/docker-compose.yml logs"
    exit 1
fi
