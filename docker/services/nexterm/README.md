# Nexterm

Self-hosted terminal manager — a web-based SSH, Telnet, and VNC client with a built-in Guacamole proxy. Manage remote server connections from a single pane of glass.

## Quick Start

```bash
cp .env.example .env
# Optional: edit NEXTERM_PORT in .env
docker compose up -d
```

Access at `http://<host>:6989` unless you change `NEXTERM_PORT`.

## Multi-Architecture Support

The `germannewsmaker/nexterm:latest` image publishes Linux manifests for both **amd64** and **arm64**. Docker will automatically pull the correct variant for the Raspberry Pi 400 or another host architecture.

## Configuration

Nexterm requires an encryption key to protect stored credentials. Generate one before first launch:

```bash
echo "NEXTERM_ENCRYPTION_KEY=$(openssl rand -hex 32)" >> .env
```

After setting the key, create an admin account on first visit, then add your SSH/Telnet/VNC server connections.

| Variable | Default | Purpose |
|---|---:|---|
| `NEXTERM_PORT` | `6989` | Host port mapped to the container web UI |
| `NEXTERM_LOG_LEVEL` | `info` | Log verbosity: error, warn, info, verbose, debug |
| `NEXTERM_ENCRYPTION_KEY` | *(required)* | Encryption key for stored credentials |

## Ports

| Port | Purpose |
|------|---------|
| 6989 | Web UI and API |

## Volumes

| Volume | Container Path | Purpose |
|--------|---------------|---------|
| `nexterm-data` | `/app/data` | SQLite database and session recordings |

## Backup and restore

```bash
chmod +x backup.sh restore.sh
./backup.sh
./restore.sh
```

`backup.sh` creates a timestamped tar archive of the data volume. `restore.sh` restores from a specified backup file.

### Manual backup

```bash
docker run --rm -v nexterm-data:/data -v "$(pwd)":/backup alpine \
    tar czf /backup/nexterm-data-$(date +%Y%m%d).tar.gz -C /data .
```

## Reverse proxy

Prefer exposing Nexterm through the homelab reverse proxy with HTTPS. The app handles SSH credentials and should always be served over an encrypted connection.

## Useful commands

```bash
docker compose logs -f nexterm
docker compose restart nexterm
docker compose pull && docker compose up -d
```

## Resources

- [Nexterm on GitHub](https://github.com/gnmyt/Nexterm)
- [Nexterm on Docker Hub](https://hub.docker.com/r/germannewsmaker/nexterm)
