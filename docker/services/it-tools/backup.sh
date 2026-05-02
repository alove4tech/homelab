#!/usr/bin/env bash
# IT Tools backup script
# IT Tools is stateless; no Docker volumes are used.

set -euo pipefail

echo "IT Tools has no persistent data to back up."
echo "Back up docker-compose.yml and .env through git or your normal host backup."
