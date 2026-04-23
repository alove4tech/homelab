# Security Policy

## Reporting

Found a security issue with a service config, exposed secret, or misconfiguration? Open an issue or contact the maintainer directly.

## Scope

This covers the infrastructure configs, Docker Compose files, and scripts in this repo. It does not cover the upstream services themselves (Gitea, Vaultwarden, Stirling PDF) — report those to their respective projects.

## Best practices enforced

- No secrets committed — all credentials live in `.env` files excluded by `.gitignore`
- Each service runs with resource limits and `no-new-privileges`
- Backup/restore scripts are provided alongside service definitions
