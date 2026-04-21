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

N100 mini PC. Compose configs are tuned for low resources (512MB RAM, 1 CPU per service).

## Roadmap

- Add more service definitions under `docker/services/`
- Add `docs/` when there is enough material to justify a dedicated documentation tree
- Add `ansible/` when configuration management is in active use
- Add monitoring stack (Prometheus + Grafana)
- Add Tailscale / Wireguard networking notes


## Operating conventions

- Keep each service self-contained with its own README and `.env.example`.
- Prefer reverse-proxy exposure over publishing service ports directly to the internet.
- Add backup and restore notes alongside each service before calling it production-ready.
- When a service needs more than a small README, graduate it into `docs/` instead of bloating the root README.
