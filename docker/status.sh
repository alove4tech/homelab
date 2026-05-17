#!/usr/bin/env bash
# Quick overview of all homelab Docker services
# Run from the docker/ directory: ./status.sh
set -euo pipefail

SERVICES_DIR="$(cd "$(dirname "$0")" && pwd)/services"

# Bail early if Docker isn't available
if ! command -v docker &>/dev/null; then
  echo "Error: docker command not found. Is Docker installed?"
  exit 1
fi
if ! docker info &>/dev/null; then
  echo "Error: Docker daemon is not running (or current user lacks permissions)."
  exit 1
fi

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
DIM='\033[2m'
NC='\033[0m'

echo -e "${YELLOW}Homelab Service Status — $(date '+%Y-%m-%d %H:%M')${NC}"
echo "============================================"

# Disk usage on / (Pi SD card or SSD)
echo ""
echo -e "${DIM}Host disk usage:${NC}"
df -h / | tail -1 | awk '{printf "  / %s used of %s (%s available)\n", $3, $2, $4}'

# Memory
echo -e "${DIM}Memory:${NC}"
free -h | grep Mem | awk '{printf "  %s used of %s total (%s available)\n", $3, $2, $7}'

# Docker disk usage
echo -e "${DIM}Docker disk usage:${NC}"
docker system df --format '{{.Type}}: {{.Size}}' 2>/dev/null | sed 's/^/  /' || echo "  (unable to query)"

echo ""
echo -e "${YELLOW}Services:${NC}"

running=0
stopped=0
unhealthy=0

for dir in "$SERVICES_DIR"/*/; do
    name="$(basename "$dir")"
    if [ -f "$dir/docker-compose.yml" ]; then
        # Run compose from the service directory so service-specific .env files
        # are discovered correctly. Ignore compose errors here: a missing .env
        # or undeployed stack should show as stopped rather than aborting the
        # whole dashboard.
        container_id=$( (cd "$dir" && docker compose ps --status running -q 2>/dev/null | head -1) || true )
        if [ -n "$container_id" ]; then
            running=$((running + 1))
            health=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$container_id" 2>/dev/null || echo "unknown")
            case "$health" in
                healthy) status="${GREEN}healthy${NC}" ;;
                unhealthy) status="${RED}unhealthy${NC}"; unhealthy=$((unhealthy + 1)) ;;
                starting) status="${YELLOW}starting${NC}" ;;
                *) status="${GREEN}running${NC}" ;;
            esac
        else
            stopped=$((stopped + 1))
            status="${RED}stopped${NC}"
        fi
        # Extract the first published host port without invoking compose, which
        # may require secrets that are intentionally absent from a fresh clone.
        port=$(python3 - "$dir/docker-compose.yml" <<'PY'
import re
import sys
from pathlib import Path

for line in Path(sys.argv[1]).read_text().splitlines():
    match = re.match(r'\s*-\s*["\']?(?:\$\{([A-Z0-9_]+):-([0-9]+)\}|([0-9]+)):', line)
    if match:
        if match.group(1):
            print(f"{match.group(1)} (default {match.group(2)})")
        else:
            print(match.group(3))
        break
else:
    print("—")
PY
)
        echo -e "  $name: $status ${DIM}(port $port)${NC}"
    fi
done

echo ""
echo -e "${DIM}${running} running, ${stopped} stopped${NC}"
if [ "$unhealthy" -gt 0 ]; then
    echo -e "${RED}${unhealthy} unhealthy — check logs with: docker compose -f docker/services/<name>/docker-compose.yml logs${NC}"
fi
echo -e "${DIM}Run 'docker ps --format \"table {{.Names}}\\t{{.Status}}\\t{{.Ports}}\"' for full details${NC}"
