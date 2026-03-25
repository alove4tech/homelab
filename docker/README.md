# 🐳 Docker Services

This directory contains Docker Compose configurations for homelab services.

## 📂 Structure

Each service has its own directory:
```
docker/services/<service-name>/
├── docker-compose.yml
├── README.md
└── .env.example
```

## 🚀 Deployment

### Single Service
```bash
cd docker/services/<service-name>
docker compose up -d
```

### Multiple Services
```bash
# Start all services in a directory
cd docker/services
for dir in */; do
  echo "Deploying $dir"
  cd "$dir"
  docker compose up -d
  cd ..
done
```

## 🔄 Updates

```bash
# Update a specific service
cd docker/services/<service-name>
docker compose pull
docker compose up -d

# Update all services
cd docker/services
for dir in */; do
  echo "Updating $dir"
  cd "$dir"
  docker compose pull
  docker compose up -d
  cd ..
done
```

## 📊 Resource Limits

Services are configured with resource limits for the N100 mini PC:
- CPU: 1 core per service (adjust as needed)
- Memory: 512MB per service (conservative, can increase)
- Health checks enabled

## 🔐 Security

- All containers run as non-root where possible
- Read-only filesystems when applicable
- Network isolation via dedicated Docker networks
- No privileged containers
