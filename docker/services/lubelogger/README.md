# Lubelogger

Self-hosted vehicle maintenance and fuel mileage tracker. Record service history, fuel-ups, expenses, and reminders for your vehicles.

## Quick Start

```bash
cp .env.example .env
# Optional: edit LUBELOGGER_PORT in .env
docker compose up -d
```

Access at `http://<host>:8083` unless you change `LUBELOGGER_PORT`.

## Multi-Architecture Support

The `hargata/lubelogger:latest` image publishes Linux manifests for both **amd64** and **arm64**. Docker will automatically pull the correct variant for the Raspberry Pi 400 or another host architecture.

## Configuration

Lubelogger is configured through the web UI after first launch. The default authentication is HTTP Basic Auth — set your username and password on first visit.

| Variable | Default | Purpose |
|---|---:|---|
| `LUBELOGGER_PORT` | `8083` | Host port mapped to the container web UI |

## Ports

| Port | Purpose |
|------|---------|
| 8083 | Web UI |

## Volumes

| Volume | Container Path | Purpose |
|--------|---------------|---------|
| `lubelogger-data` | `/App/data` | Vehicle records, database, uploads |
| `lubelogger-keys` | `/root/.aspnet/DataProtection-Keys` | Data protection encryption keys |

## Backup and restore

```bash
chmod +x backup.sh restore.sh
./backup.sh
./restore.sh
```

`backup.sh` creates a timestamped tar archive of both volumes. `restore.sh` restores from a specified backup file.

### Manual backup

```bash
docker run --rm -v lubelogger-data:/data -v "$(pwd)":/backup alpine \
    tar czf /backup/lubelogger-data-$(date +%Y%m%d).tar.gz -C /data .
docker run --rm -v lubelogger-keys:/data -v "$(pwd)":/backup alpine \
    tar czf /backup/lubelogger-keys-$(date +%Y%m%d).tar.gz -C /data .
```

## Reverse proxy

Prefer exposing Lubelogger through the homelab reverse proxy with HTTPS. The app handles vehicle data and authentication.

## Useful commands

```bash
docker compose logs -f lubelogger
docker compose restart lubelogger
docker compose pull && docker compose up -d
```

## Resources

- [Lubelogger on GitHub](https://github.com/hargata/lubelog)
- [Lubelogger on Docker Hub](https://hub.docker.com/r/hargata/lubelogger)
