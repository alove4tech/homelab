# 🔐 Vaultwarden

Unofficial Bitwarden server implementation for your homelab.

## 📋 Quick Start

### 1. Generate Secure Admin Token

```bash
openssl rand -base64 48
```

### 2. Update docker-compose.yml

- Set `DOMAIN` to your actual domain
- Set `ADMIN_TOKEN` to the token generated above
- Set `SIGNUPS_ALLOWED` to `true` (set to `false` after creating your account)

### 3. Deploy

```bash
docker compose up -d
```

### 4. Access Admin Panel

```
http://your-lxc-ip:80/admin
```

### 5. Create Your Account

1. Visit `http://your-domain.com`
2. Create an account
3. Once created, set `SIGNUPS_ALLOWED: 'false'` in docker-compose.yml
4. Restart container: `docker compose restart`

## 🔧 Reverse Proxy (Recommended)

For production use, use a reverse proxy with HTTPS.

### Pangolin (Your Setup)

Configure Vaultwarden in Pangolin with:
- **Domain**: `vaultwarden.yourdomain.com` (or your preferred subdomain)
- **Port**: `80` (or `3012` for WebSocket-only)
- **WebSocket support**: Enable (required for real-time sync)

**Important for WebSocket**: Ensure your reverse proxy supports WebSocket upgrades on the `/notifications/hub` endpoint.

## 🔐 Security Checklist

- [ ] Change `ADMIN_TOKEN` to a secure random string
- [ ] Set up HTTPS/TLS certificate
- [ ] Set `SIGNUPS_ALLOWED: 'false'` after creating account
- [ ] Configure SMTP for email features
- [ ] Enable 2FA on your account
- [ ] Set up regular backups

## 💾 Backup Strategy

```bash
# Backup to another location
docker run --rm \
  -v vaultwarden-data:/data:ro \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/vaultwarden-backup-$(date +%Y%m%d).tar.gz -C /data .
```

## 📊 Performance Tuning (N100)

- **CPU**: `ROCKET_WORKERS: 2` is good for N100
- **Memory**: 512MB limit is conservative, increase if needed
- **Storage**: Use local storage (ZFS/direct) if available

## 🔧 Useful Commands

```bash
# View logs
docker compose logs -f vaultwarden

# Restart service
docker compose restart vaultwarden

# Update to latest
docker compose pull
docker compose up -d

# Access database (SQLite)
docker exec -it vaultwarden sqlite3 /data/db.sqlite3

# Shell access
docker exec -it vaultwarden sh
```

## 🐛 Troubleshooting

**Container not starting?**
```bash
docker compose logs vaultwarden
```

**WebSocket issues?**
- Ensure `WEBSOCKET_ENABLED: 'true'` is set
- Check reverse proxy WebSocket support

**Performance issues?**
- Increase memory limit in docker-compose
- Adjust `ROCKET_WORKERS` (try 3-4 for N100)

## 📚 More Info

- [Vaultwarden GitHub](https://github.com/dani-garcia/vaultwarden)
- [Vaultwarden Wiki](https://github.com/dani-garcia/vaultwarden/wiki)
