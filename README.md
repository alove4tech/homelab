# Homelab

Infrastructure and services for my home network.

## Layout

```
homelab/
├── docker/
│   ├── README.md       # Docker service notes and usage
│   └── services/       # Docker Compose configs per service
└── README.md
```

## Services

Each service lives in `docker/services/<name>/` with its own docker-compose.yml, .env.example, and README.

| Service | Purpose | Path |
|---|---|---|
| Gitea | Lightweight self-hosted Git service | `docker/services/gitea/` |
| Stirling PDF | PDF processing (merge, split, OCR, convert) | `docker/services/stirlingpdf/` |
| Vaultwarden | Self-hosted Bitwarden-compatible password manager | `docker/services/vaultwarden/` |

### Related projects

- [Cybersecurity Lab](https://github.com/alove4tech/Cybersecurity-Lab-Project) — SOC + detection lab on Proxmox
- [Security+ Study Hub](https://github.com/alove4tech/secplus-study) — exam prep app
- [Kasm Registry](https://github.com/alove4tech/kasm-registry) — custom Kasm Workspaces registry

### Quick start

```bash
git clone https://github.com/alove4tech/homelab.git
cd homelab/docker/services/<service>
cp .env.example .env
# edit .env
docker compose up -d
```

## Hardware

Raspberry Pi 400 4GB running Debian 13 (trixie) on aarch64. Compose configs are tuned for low resources (512MB RAM, 1 CPU per service). Stirling PDF gets 2 CPUs and 1GB due to heavier processing workloads.

## Roadmap

- Add more service definitions under `docker/services/`
- Add `docs/` when there is enough material to justify a dedicated documentation tree
- Add `ansible/` when configuration management is in active use
- Add monitoring stack (Prometheus + Grafana)
- Add Tailscale / Wireguard networking notes

### Monitoring stack plan

When the monitoring stack lands, it'll live at `docker/services/monitoring/` with:

- **Prometheus** — metrics collection from Docker hosts and exporters
- **Grafana** — dashboards for service health, resource usage, and alerting
- **Node exporter** — host-level metrics (CPU, memory, disk, network)
- **cAdvisor** — container-level metrics for running services

## Service details

| Service | Image | RAM | CPU | Port(s) | Notes |
|---|---|---|---|---|---|
| Gitea | `gitea/gitea:latest` | 512MB | 1 | 3000, 2222 | Git hosting, SSH on 2222 |
| Stirling PDF | `stirlingtools/stirling-pdf:latest` | 1GB | 2 | 8480 | PDF processing, no auth by default |
| Vaultwarden | `vaultwarden/server:latest` | 512MB | 1 | 80 | Bitwarden-compatible, WebSocket built-in since v1.29+ |

Resource targets: Grafana at 256MB, Prometheus at 256MB, exporters at 64MB each. Total monitoring footprint should stay under 1GB on the Pi 400.

## Operating conventions

- Keep each service self-contained with its own README and `.env.example`.
- Prefer reverse-proxy exposure over publishing service ports directly to the internet.
- Add backup and restore notes alongside each service before calling it production-ready.
- When a service needs more than a small README, graduate it into `docs/` instead of bloating the root README.
