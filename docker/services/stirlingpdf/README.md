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
