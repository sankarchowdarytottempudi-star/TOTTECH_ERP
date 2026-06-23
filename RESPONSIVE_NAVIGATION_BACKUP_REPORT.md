# Responsive Navigation Hardening Backup Report

## Backup Time

- Created: 2026-06-07 14:16 Europe/Berlin
- Backup root: `/opt/backups/responsive-navigation-hardening/20260607-1416`

## Backup Artifacts

| Artifact | Location | Verified |
|---|---|---|
| PostgreSQL database dump | `/opt/backups/responsive-navigation-hardening/20260607-1416/database/schoolerp-before-responsive-navigation.dump` | Yes |
| Application source archive | `/opt/backups/responsive-navigation-hardening/20260607-1416/source/tottech-one-before-responsive-navigation.tar.gz` | Yes |
| Environment snapshot | `/opt/backups/responsive-navigation-hardening/20260607-1416/env/.env.snapshot` | Yes |

## Verified Sizes

- Backup directory: 355 MB
- Database dump: 9.2 MB
- Source archive: 346 MB
- Environment snapshot: 668 bytes

## Restore Commands

Database:

```bash
sudo -u postgres pg_restore --clean --if-exists -d schoolerp /opt/backups/responsive-navigation-hardening/20260607-1416/database/schoolerp-before-responsive-navigation.dump
```

Application source:

```bash
cd /opt
tar -xzf /opt/backups/responsive-navigation-hardening/20260607-1416/source/tottech-one-before-responsive-navigation.tar.gz
```

Environment:

```bash
cp /opt/backups/responsive-navigation-hardening/20260607-1416/env/.env.snapshot /opt/tottech-one/.env
```

Production restart after rollback:

```bash
cd /opt/tottech-one
npm run build
pm2 restart tottech-one --update-env
pm2 save
```

## Backup Verification

- Database dump completed successfully.
- Source archive listed successfully with `tar -tzf`.
- Environment snapshot exists and remains outside frontend/API responses.
