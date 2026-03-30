# Homelab

Infrastructure and services for my home network.

## Layout

```
homelab/
├── docker/services/    # Docker Compose configs per service
├── ansible/            # Playbooks (eventually)
└── docs/               # Notes and documentation
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
