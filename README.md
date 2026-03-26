# 🏠 Homelab

My homelab infrastructure and services.

## 📁 Structure

```
homelab/
├── docker/              # Docker Compose services
│   └── services/         # Individual service configs
├── ansible/             # Ansible playbooks (future)
├── docs/                # Documentation
└── README.md
```

## 🐳 Docker Services

### In This Repository

Each service in `docker/services/` includes:
- `docker-compose.yml` - Service configuration
- `README.md` - Setup and usage notes
- `.env.example` - Environment variable template

### Separate Repositories

Some applications have their own repositories for better separation:

- **[Security+ Study Hub](https://github.com/alove4tech/secplus-study)** - Next.js app for CompTIA Security+ exam prep
- *(more to be added)*

### Quick Start

```bash
# Clone repo
git clone https://github.com/alove4tech/homelab.git
cd homelab

# Deploy a service
cd docker/services/<service-name>
docker compose up -d
```

## 🏗️ Infrastructure

- **Proxmox**: N100 mini PC
- **Docker**: Running in LXC container

## 🔧 Adding a New Service

1. Create directory: `docker/services/<service-name>/`
2. Add `docker-compose.yml`
3. Add `README.md` with setup instructions
4. Add `.env.example` for secrets
5. Test deployment
6. Commit and push

## 📝 Notes

- All sensitive data should use environment variables
- Never commit actual secrets to the repo
- Use `.env` files locally (add to `.gitignore`)
