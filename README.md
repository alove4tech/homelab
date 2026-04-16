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
| Vaultwarden | Self-hosted Bitwarden-compatible password manager | `docker/services/vaultwarden/` |

### Separate repos

- [Security+ Study Hub](https://github.com/alove4tech/secplus-study) — exam prep app

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


## Operating conventions

- Keep each service self-contained with its own README and `.env.example`.
- Prefer reverse-proxy exposure over publishing service ports directly to the internet.
- Add backup and restore notes alongside each service before calling it production-ready.
- When a service needs more than a small README, graduate it into `docs/` instead of bloating the root README.
