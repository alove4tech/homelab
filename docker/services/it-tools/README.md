# IT Tools

Self-hosted collection of useful developer, network, crypto, encoding, and conversion utilities.

## Quick Start

```bash
cp .env.example .env
# Optional: edit ITTOOLS_PORT in .env
docker compose up -d
```

Access at `http://<host>:8081` unless you change `ITTOOLS_PORT`.

## Multi-Architecture Support

The `corentinth/it-tools:latest` image publishes Linux manifests for both **amd64** and **arm64**. Docker will automatically pull the correct variant for the Raspberry Pi 400 or another host architecture.

## Configuration

IT Tools is a static web application and does not require a database or persistent volume.

| Variable | Default | Purpose |
|---|---:|---|
| `ITTOOLS_PORT` | `8081` | Host port mapped to the container web UI |

## Ports

| Port | Purpose |
|------|---------|
| 8081 | Web UI |

## Volumes

No persistent Docker volumes are used. The service is stateless.

## Backup and restore

IT Tools stores no application data in this stack. Backup and restore scripts are included for operational consistency with the rest of the homelab services, but they intentionally report that there is no persistent data to archive.

```bash
chmod +x backup.sh restore.sh
./backup.sh
./restore.sh
```

## Reverse proxy

Prefer exposing IT Tools through the homelab reverse proxy rather than publishing it directly to the internet. The app contains utilities that can be useful internally but does not need public exposure.

## Useful commands

```bash
docker compose logs -f it-tools
docker compose restart it-tools
docker compose pull && docker compose up -d
```

## Resources

- [IT Tools on GitHub](https://github.com/CorentinTh/it-tools)
