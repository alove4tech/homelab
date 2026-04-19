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
