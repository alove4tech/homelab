# Stirling PDF

Self-hosted PDF processing service — merge, split, convert, compress, OCR, and more.

## Quick Start

```bash
docker compose up -d
```

Access at `http://<host>:8480`

## Multi-Architecture Support

The `frooodle/s-pdf:latest` image publishes manifests for both **amd64** and **arm64**. Docker will automatically pull the correct variant for your host architecture — no special configuration needed.

## Configuration

By default the app runs without authentication. To enable login:

1. Set `DOCKER_ENABLE_SECURITY=true` in the environment block
2. Uncomment the `env_file` line
3. Create a `.env` file with your settings
4. Restart the container

## Ports

| Port | Purpose |
|------|---------|
| 8480 | Web UI and API |

## Volumes

| Mount | Purpose |
|-------|---------|
| stirlingpdf-data | OCR/Tesseract data |
| stirlingpdf-config | App configuration files |

## Backup

```bash
mkdir -p backups

docker run --rm \
  -v stirlingpdf-data:/data:ro \
  -v stirlingpdf-config:/config:ro \
  -v $(pwd)/backups:/backup \
  alpine sh -c 'tar czf /backup/stirlingpdf-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /data . && tar czf /backup/stirlingpdf-config-$(date +%Y%m%d-%H%M%S).tar.gz -C /config .'
```

That captures both OCR data and the app config volume.

## Restore

```bash
docker compose down
mkdir -p restore/data restore/config

tar xzf backups/stirlingpdf-backup-YYYYMMDD-HHMMSS.tar.gz -C restore/data
tar xzf backups/stirlingpdf-config-YYYYMMDD-HHMMSS.tar.gz -C restore/config

docker run --rm \
  -v stirlingpdf-data:/data \
  -v $(pwd)/restore/data:/restore-data:ro \
  alpine sh -c 'rm -rf /data/* && cp -a /restore-data/. /data/'

docker run --rm \
  -v stirlingpdf-config:/config \
  -v $(pwd)/restore/config:/restore-config:ro \
  alpine sh -c 'rm -rf /config/* && cp -a /restore-config/. /config/'

docker compose up -d
```

## Useful commands

```bash
docker compose logs -f stirlingpdf
docker compose restart stirlingpdf
docker compose pull && docker compose up -d
```
