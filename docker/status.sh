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

echo ""
echo -e "${YELLOW}Services:${NC}"

running=0
stopped=0

for dir in "$SERVICES_DIR"/*/; do
    name="$(basename "$dir")"
    if [ -f "$dir/docker-compose.yml" ]; then
        # Get the first running container ID from this compose project
        container_id=$(docker compose -f "$dir/docker-compose.yml" ps --status running -q 2>/dev/null | head -1)
        if [ -n "$container_id" ]; then
            running=$((running + 1))
            health=$(docker inspect --format='{{.State.Health.Status}}' "$container_id" 2>/dev/null || echo "unknown")
            case "$health" in
                healthy) status="${GREEN}healthy${NC}" ;;
                unhealthy) status="${RED}unhealthy${NC}" ;;
                starting) status="${YELLOW}starting${NC}" ;;
                *) status="${GREEN}running${NC}" ;;
            esac
        else
            stopped=$((stopped + 1))
            status="${RED}stopped${NC}"
        fi
        # Extract first published port from docker-compose.yml (portable grep)
        port=$(grep -E '^\s*- ["'"'"']?[0-9]+' "$dir/docker-compose.yml" 2>/dev/null | head -1 | grep -oE '[0-9]+' | head -1 || echo "—")
        echo -e "  $name: $status ${DIM}(port $port)${NC}"
    fi
done

echo ""
echo -e "${DIM}${running} running, ${stopped} stopped${NC}"
echo -e "${DIM}Run 'docker ps --format \"table {{.Names}}\\t{{.Status}}\\t{{.Ports}}\"' for full details${NC}"
