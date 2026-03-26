# Homelab Scripts

Automated scripts for homelab maintenance and deployment.

## 📂 Scripts

### review-and-push.sh
**Nightly automated review and sync script** - Runs at 10:00 PM daily

**Features:**
- ✅ Checks for uncommitted changes
- 🔒 **Security Reviews:**
  - Docker Compose hardening (read-only, no-new-privileges, health checks)
  - Resource limit verification
  - Next.js config security (dev origins, headers)
  - Dockerfile best practices (no root, specific tags, alpine base)
  - Prevents .env files from being committed
- 🔍 **Quality Checks:**
  - README.md presence in services
  - .env.example templates
  - Remove obsolete Docker Compose version attributes
- 🚀 **Auto-fix:**
  - Adds missing security settings to docker-compose.yml
  - Removes .env from git tracking
  - Adds missing .gitignore entries
  - Removes obsolete version attributes
- 📦 **Auto-commit & push:**
  - Commits all changes with detailed message
  - Pushes to GitHub automatically

**Schedule:** Daily at 10:00 PM EST (via system crontab)

**Logs:** `.scripts/review.log`

## 🔧 Management

### Run manually
```bash
cd /home/claw/.openclaw/workspace/homelab
./.scripts/review-and-push.sh
```

### View logs
```bash
tail -f .scripts/review.log
```

### Check cron status
```bash
crontab -l
```

### Edit cron schedule
```bash
crontab -e
```

### Remove cron job
```bash
crontab -e
# Delete the line with review-and-push.sh
```

## ⚙️ Installation

Run setup script:
```bash
chmod +x .scripts/setup-cron.sh
./.scripts/setup-cron.sh
```

## 📋 Security Checks Performed

### Docker Compose Files
- ✅ `read_only: true` enabled
- ✅ `no-new-privileges:true` enabled
- ✅ Health checks present
- ✅ Resource limits configured
- ⚠️  Direct exposure of sensitive ports (22, 3306, 5432)
- ℹ️  Preference for `env_file` over inline env vars

### Next.js Apps
- ✅ No dev origins in production configs
- ✅ `poweredByHeader: false` set
- ⚠️  Specific version tags instead of `latest`

### Git Security
- ✅ No .env files tracked
- ✅ .gitignore blocks .env files

### Dockerfiles
- ⚠️  Specific image versions instead of `latest`
- ⚠️  Non-root user configured
- ℹ️  Alpine base recommended

## 🎯 Customization

To modify the schedule, edit the crontab:
```bash
crontab -e
```

Examples:
- 10pm daily: `0 22 * * *`
- 10pm weekdays: `0 22 * * 1-5`
- Every 6 hours: `0 */6 * * *`
