# Linkstack

Self-hosted link-in-bio page — an open-source alternative to Linktree. Create a customizable profile page with links to all your social accounts, websites, and resources.

## Quick Start

```bash
cp .env.example .env
# Optional: edit LINKSTACK_PORT in .env
docker compose up -d
```

Access at `http://<host>:8082` unless you change `LINKSTACK_PORT`.

## Multi-Architecture Support

The `linkstackorg/linkstack:latest` image publishes Linux manifests for **amd64**, **arm**, and **arm64**. Docker will automatically pull the correct variant for the Raspberry Pi 400 or another host architecture.

## Configuration

Linkstack uses SQLite by default and is configured through the web UI after first launch. No additional environment variables are required for a basic setup.

Advanced settings (admin email, registration, SMTP) can be configured through the admin panel at `http://<host>:8082/admin`.

| Variable | Default | Purpose |
|---|---:|---|
| `LINKSTACK_PORT` | `8082` | Host port mapped to the container web UI |

## Ports

| Port | Purpose |
|------|---------|
| 8082 | Web UI |

## Volumes

| Volume | Container Path | Purpose |
|--------|---------------|---------|
| `linkstack-data` | `/htdocs/database` | SQLite database |
| `linkstack-storage` | `/htdocs/storage` | User uploads, logs, backups |

## Backup and restore

```bash
chmod +x backup.sh restore.sh
./backup.sh
./restore.sh
```

`backup.sh` creates a timestamped tar archive of the database and storage volumes. `restore.sh` restores from a specified backup file.

### Manual backup

```bash
docker run --rm -v linkstack-data:/data -v "$(pwd)":/backup alpine \
    tar czf /backup/linkstack-data-$(date +%Y%m%d).tar.gz -C /data .
docker run --rm -v linkstack-storage:/data -v "$(pwd)":/backup alpine \
    tar czf /backup/linkstack-storage-$(date +%Y%m%d).tar.gz -C /data .
```

## Reverse proxy

Prefer exposing Linkstack through the homelab reverse proxy with HTTPS. The app handles user accounts and should not be exposed over plain HTTP.

## Useful commands

```bash
docker compose logs -f linkstack
docker compose restart linkstack
docker compose pull && docker compose up -d
```

## Resources

- [Linkstack on GitHub](https://github.com/LinkStackOrg/LinkStack)
- [Linkstack on Docker Hub](https://hub.docker.com/r/linkstackorg/linkstack)
