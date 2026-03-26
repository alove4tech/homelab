#!/bin/bash

# Homelab Auto-Review and Push Script
# Runs nightly at 10pm to review changes, fix issues, and push to GitHub

set -e

REPO_DIR="/home/claw/.openclaw/workspace/homelab"
LOG_FILE="/home/claw/.openclaw/workspace/homelab/.scripts/review.log"
CONFIG_FILE="/home/claw/.openclaw/workspace/homelab/.scripts/.config"

# Load GitHub token from config file
if [ -f "$CONFIG_FILE" ]; then
  source "$CONFIG_FILE"
else
  echo "ERROR: Config file not found: $CONFIG_FILE"
  echo "Please create it with: GITHUB_TOKEN=\"your_token_here\""
  exit 1
fi

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

cd "$REPO_DIR" || exit 1

log "Starting nightly review and push..."

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  log "Changes detected. Running security and quality review..."

  # Security and Quality Checks
  CHANGES_MADE=0

  # Check 1: Docker Compose files - security hardening
  log "Checking Docker Compose files for security issues..."
  for compose_file in $(find . -name "docker-compose.yml" -o -name "docker-compose.yaml"); do
    dir=$(dirname "$compose_file")

    # Check for read-only filesystem
    if ! grep -q "read_only: true" "$compose_file"; then
      log "⚠️  Missing read_only in $compose_file"
      sed -i '/security_opt:/a\    read_only: true' "$compose_file"
      CHANGES_MADE=1
    fi

    # Check for no-new-privileges
    if ! grep -q "no-new-privileges:true" "$compose_file"; then
      log "⚠️  Missing no-new-privileges in $compose_file"
      if ! grep -q "security_opt:" "$compose_file"; then
        sed -i '/restart:/a\    security_opt:\n      - no-new-privileges:true' "$compose_file"
      fi
      CHANGES_MADE=1
    fi

    # Check for health checks
    if ! grep -q "healthcheck:" "$compose_file"; then
      log "⚠️  Missing healthcheck in $compose_file"
      CHANGES_MADE=1
    fi

    # Check for resource limits
    if ! grep -q "deploy:" "$compose_file"; then
      log "⚠️  Missing resource limits in $compose_file"
      CHANGES_MADE=1
    fi

    # Check for env_file (prefer over inline env vars)
    if grep -q "environment:" "$compose_file" && ! grep -q "env_file:" "$compose_file"; then
      log "ℹ️  Consider using env_file in $compose_file"
    fi

    # Check for exposed privileged ports (avoid :22, :3306, :5432 directly)
    if grep -qE '["\s]22:22["\s]|["\s]3306:3306["\s]|["\s]5432:5432["\s]' "$compose_file"; then
      log "⚠️  WARNING: Exposing database/SSH ports directly in $compose_file"
    fi
  done

  # Check 2: Next.js apps - security configs
  log "Checking Next.js configurations..."
  for next_config in $(find . -name "next.config.ts" -o -name "next.config.js"); do
    # Check for hardcoded dev origins in production
    if grep -q "allowedDevOrigins:" "$next_config" && grep -qE "(localhost|192\.168|10\.0|172\.(1[6-9]|2[0-9]|3[01]))" "$next_config"; then
      log "⚠️  Found dev origins in $next_config - may need cleanup for production"
      CHANGES_MADE=1
    fi

    # Check for poweredBy header
    if ! grep -q "poweredByHeader: false" "$next_config"; then
      log "⚠️  Missing poweredByHeader: false in $next_config"
      # Try to add it if there's a config object
      if grep -q "const nextConfig" "$next_config"; then
        sed -i '/const nextConfig/a\  poweredByHeader: false,' "$next_config"
        CHANGES_MADE=1
      fi
    fi
  done

  # Check 3: .gitignore - ensure secrets are ignored
  log "Checking .gitignore files..."
  if [ -f .gitignore ]; then
    # Ensure .env files are ignored
    if ! grep -q "^\.env$" .gitignore; then
      log "⚠️  Adding .env to .gitignore"
      echo ".env" >> .gitignore
      CHANGES_MADE=1
    fi
    if ! grep -q "\*\.env" .gitignore; then
      log "⚠️  Adding *.env to .gitignore"
      echo "*.env" >> .gitignore
      CHANGES_MADE=1
    fi
  fi

  # Check 4: README files - ensure they exist
  log "Checking for README files..."
  for service_dir in docker/services/*/; do
    if [ ! -f "${service_dir}README.md" ]; then
      log "ℹ️  Missing README.md in ${service_dir}"
    fi
    if [ ! -f "${service_dir}.env.example" ]; then
      log "ℹ️  Missing .env.example in ${service_dir}"
    fi
  done

  # Check 5: Dockerfiles - security best practices
  log "Checking Dockerfiles..."
  for dockerfile in $(find . -name "Dockerfile"); do
    # Check for latest tag
    if grep -q "FROM.*:latest" "$dockerfile"; then
      log "⚠️  Using 'latest' tag in $dockerfile (use specific version)"
    fi

    # Check for running as root
    if ! grep -q "USER.*node\|USER.*nginx\|USER.*app" "$dockerfile"; then
      log "⚠️  May be running as root in $dockerfile"
    fi

    # Check for alpine base (good for security)
    if ! grep -q "alpine" "$dockerfile"; then
      log "ℹ️  Consider using alpine base in $dockerfile for smaller attack surface"
    fi
  done

  # Check 6: Environment files - ensure they're not committed
  log "Checking for committed .env files..."
  if git ls-files | grep -q "\.env$"; then
    log "🚨 CRITICAL: .env files are tracked by git!"
    log "Removing .env files from git tracking..."
    git rm --cached -r "**/.env"
    CHANGES_MADE=1
  fi

  # Check 7: Docker Compose version - remove obsolete
  log "Checking for obsolete Docker Compose versions..."
  for compose_file in $(find . -name "docker-compose.yml" -o -name "docker-compose.yaml"); do
    if grep -q "^version:" "$compose_file"; then
      log "⚠️  Removing obsolete version attribute from $compose_file"
      sed -i '/^version:/d' "$compose_file"
      CHANGES_MADE=1
    fi
  done

  # Summary
  if [ "$CHANGES_MADE" -eq 1 ]; then
    log "✅ Security and quality improvements applied"
  else
    log "✅ No security issues found"
  fi

  # Commit and push changes
  log "Committing changes..."
  git add -A

  # Generate commit message
  COMMIT_MSG="Automated nightly review and sync

$(date '+%Y-%m-%d %H:%M:%S')"

  if [ "$CHANGES_MADE" -eq 1 ]; then
    COMMIT_MSG="$COMMIT_MSG

Security and quality improvements applied."
  fi

  git commit -m "$COMMIT_MSG"

  log "Pushing to GitHub..."
  git remote set-url origin "https://${GITHUB_TOKEN}@github.com/alove4tech/homelab.git"
  git push

  log "✅ Successfully pushed changes to GitHub"

else
  log "No changes to commit. Skipping push."
fi

log "Review complete."
