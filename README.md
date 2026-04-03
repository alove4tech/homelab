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
