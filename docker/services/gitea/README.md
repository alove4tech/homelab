# Gitea

Self-hosted Git service — lightweight GitHub alternative.

## Quick Start

```bash
docker compose up -d
```

Access at `http://<host>:3000`

## Multi-Architecture Support

The `gitea/gitea:latest` image supports both **amd64** and **arm64**. Docker pulls the right variant automatically.

## Configuration

First run opens a setup wizard at `http://<host>:3000`. After that, config lives in `/data/gitea/conf/app.ini` inside the container (persisted via the `gitea-data` volume).

## Ports

| Port | Purpose |
|------|---------|
| 3000 | Web UI and API |
| 2222 | SSH git operations |

## Volumes

| Mount | Purpose |
|-------|---------|
| gitea-data | Repos, config, database, LFS |

## Backup

Stop and start are not strictly required for a file-level backup, but taking a short maintenance window is safer if the instance is busy.

```bash
mkdir -p backups

docker run --rm \
  -v gitea-data:/data:ro \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/gitea-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
```

## Restore

```bash
docker compose down
mkdir -p restore

tar xzf backups/gitea-backup-YYYYMMDD-HHMMSS.tar.gz -C restore

docker run --rm \
  -v gitea-data:/data \
  -v $(pwd)/restore:/restore:ro \
  alpine sh -c 'rm -rf /data/* && cp -a /restore/. /data/'

docker compose up -d
```

After restore, confirm the web UI loads, SSH pushes still work on port `2222`, and the expected repositories are present.

## Useful commands

```bash
docker compose logs -f gitea
docker compose restart gitea
docker compose pull && docker compose up -d
```
