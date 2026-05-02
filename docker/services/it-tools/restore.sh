#!/usr/bin/env bash
# IT Tools restore script
# IT Tools is stateless; no Docker volumes are used.

set -euo pipefail

echo "IT Tools has no persistent data to restore."
echo "To recover, restore docker-compose.yml/.env if needed, then run: docker compose up -d"
