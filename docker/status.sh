#!/usr/bin/env bash
# Quick overview of all homelab Docker services
# Run from the docker/ directory: ./status.sh
set -euo pipefail

SERVICES_DIR="$(cd "$(dirname "$0")" && pwd)/services"

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

for dir in "$SERVICES_DIR"/*/; do
    name="$(basename "$dir")"
    if [ -f "$dir/docker-compose.yml" ]; then
        # Check if the container is running
        if docker compose -f "$dir/docker-compose.yml" ps --status running -q 2>/dev/null | grep -q .; then
            health=$(docker inspect --format='{{.State.Health.Status}}' "$name" 2>/dev/null || echo "unknown")
            case "$health" in
                healthy) status="${GREEN}healthy${NC}" ;;
                unhealthy) status="${RED}unhealthy${NC}" ;;
                starting) status="${YELLOW}starting${NC}" ;;
                *) status="${GREEN}running${NC}" ;;
            esac
        else
            status="${RED}stopped${NC}"
        fi
        port=$(grep -oP '"[0-9]+:' "$dir/docker-compose.yml" 2>/dev/null | head -1 | tr -d '":' || echo "—")
        echo -e "  $name: $status ${DIM}(port $port)${NC}"
    fi
done

echo ""
echo -e "${DIM}Run 'docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' for full details${NC}"
