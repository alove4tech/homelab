# 📚 Security+ Study Hub

Standalone Next.js application for CompTIA Security+ exam preparation.

## 🎯 Features

- **Flashcards**: Review key exam concepts by domain
- **Practice Exams**: Multiple-choice questions with explanations
- **Domain Filtering**: Focus on specific Security+ domains
- **Dark UI**: Optimized for long study sessions

## 📋 Quick Start

### 1. Create Environment File

```bash
# Copy the example
cp .env.example .env

# Edit .env if needed (defaults should work for most use cases)
nano .env
```

### 2. Deploy with Docker

```bash
docker compose up -d --build
```

### 3. Access

```
http://your-domain.com:3001
```

Or configure via Pangolin reverse proxy:
- **Domain**: `secplus.yourdomain.com`
- **Port**: `3001`

## 🏗️ Infrastructure Notes

- **Optimized for**: N100 mini PC with 512MB RAM
- **Runtime**: Node.js 22 Alpine
- **Framework**: Next.js 16 + React 19
- **Build**: Multi-stage Docker build for small image size

## 🧪 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open <http://localhost:3000>

## 🔧 Docker Management

### View logs
```bash
docker compose logs -f secplus-study
```

### Restart service
```bash
docker compose restart secplus-study
```

### Update to latest
```bash
docker compose pull
docker compose up -d --build
```

### Stop service
```bash
docker compose down
```

## 📚 Security+ Domains Covered

1. **General Security Concepts** (12%) - Core principles, security controls, resilience
2. **Threats, Vulnerabilities, and Mitigations** (22%) - Threat actors, attacks, defenses
3. **Security Architecture** (18%) - Secure design across networks, cloud, applications
4. **Security Operations** (28%) - Monitoring, response, hardening, recovery
5. **Security Program Management and Oversight** (20%) - Governance, risk, training, compliance

## 🚀 Future Enhancements

Planned features for future updates:

- [ ] Progress tracking with local storage
- [ ] Randomized quiz generation
- [ ] Performance analytics
- [ ] Bookmark weak topics
- [ ] Export study statistics
- [ ] Mobile app companion
- [ ] Additional question bank

## 🔐 Security Features

- Read-only container filesystem
- Non-privileged container execution
- Resource limits (CPU: 1 core, Memory: 512MB)
- Health checks enabled
- Dedicated Docker network isolation

## 🐛 Troubleshooting

**Container not starting?**
```bash
docker compose logs secplus-study
```

**Port already in use?**
Change the port mapping in docker-compose.yml:
```yaml
ports:
  - "3002:3000"  # Use 3002 instead of 3001
```

**Performance issues?**
- Increase memory limit in docker-compose
- Check system resources: `htop`
- Consider reducing container count on N100

**Build failures?**
```bash
# Clean rebuild
docker compose down
docker system prune -f
docker compose up -d --build
```

## 📊 Performance Tuning (N100)

- **CPU**: 1 core limit is appropriate
- **Memory**: 512MB is conservative, increase to 1GB if needed
- **Cache**: `.next/cache` mounted to tmpfs for faster builds
- **Build**: Standalone output for smaller image size

## 📝 Notes

- Content currently uses a starter Security+ question/card bank
- No database required (data is embedded in app)
- Easy to extend with additional study content
- Perfect for self-hosted homelab study environment

## 📚 More Info

- [CompTIA Security+ Certification](https://certification.comptia.org/certifications/security)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Compose Reference](https://docs.docker.com/compose/)
