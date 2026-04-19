# Vaultwarden

Self-hosted Bitwarden-compatible password manager.

## Setup

### 1. Generate admin token

```bash
openssl rand -base64 48
```

### 2. Create .env

```bash
cp .env.example .env
nano .env
```

Set these:
- `DOMAIN` — your public domain
- `ADMIN_TOKEN` — the token from step 1
- `SIGNUPS_ALLOWED` — `true` for initial setup, then flip to `false`

### 3. Deploy

```bash
docker compose up -d
```

### 4. Create your account

Visit your domain, make an account, then set `SIGNUPS_ALLOWED: 'false'` and restart.

## Reverse proxy

Using Pangolin — point it at port 80. Enable WebSocket support for the `/notifications/hub` endpoint (needed for real-time sync).

## Backups

```bash
mkdir -p backups

docker run --rm \
  -v vaultwarden-data:/data:ro \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/vaultwarden-backup-$(date +%Y%m%d).tar.gz -C /data .
```

## Restore

Stop the stack before restoring so the database is not being written to mid-restore.

```bash
docker compose down
mkdir -p restore

tar xzf backups/vaultwarden-backup-YYYYMMDD.tar.gz -C restore

docker run --rm \
  -v vaultwarden-data:/data \
  -v $(pwd)/restore:/restore:ro \
  alpine sh -c 'rm -rf /data/* && cp -a /restore/. /data/'

docker compose up -d
```

After the container is healthy again, sign in and confirm logins, attachments, and admin access all look normal.

## Useful commands

```bash
docker compose logs -f vaultwarden
docker compose restart vaultwarden
docker compose pull && docker compose up -d
docker exec -it vaultwarden sqlite3 /data/db.sqlite3
```

## Quick backup

A backup script is included:

```bash
chmod +x backup.sh
./backup.sh
# or specify a directory: ./backup.sh /path/to/backups
```

## Quick restore

A restore script is also included:

```bash
chmod +x restore.sh
./restore.sh backups/vaultwarden-backup-YYYYMMDD-HHMMSS.tar.gz
```

It stops the container, restores data, and starts it back up.

## Resources

- [Vaultwarden on GitHub](https://github.com/dani-garcia/vaultwarden)
- [Vaultwarden Wiki](https://github.com/dani-garcia/vaultwarden/wiki)
