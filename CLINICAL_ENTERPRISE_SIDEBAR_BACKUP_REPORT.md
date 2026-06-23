# Clinical Enterprise Sidebar Backup Report

## Backup Time

- Created: 2026-06-07 15:27 Europe/Berlin
- Backup root: `/opt/backups/clinical-enterprise-sidebar/20260607-1527`

## Backup Artifacts

| Artifact | Location | Verified |
|---|---|---|
| Application source archive | `/opt/backups/clinical-enterprise-sidebar/20260607-1527/source/tottech-one-before-clinical-enterprise-sidebar.tar.gz` | Yes |
| Environment snapshot | `/opt/backups/clinical-enterprise-sidebar/20260607-1527/env/.env.snapshot` | Yes |

## Verified Sizes

- Backup directory: 347 MB
- Source archive: 347 MB
- Environment snapshot: 668 bytes

## Restore Commands

Application source:

```bash
cd /opt
tar -xzf /opt/backups/clinical-enterprise-sidebar/20260607-1527/source/tottech-one-before-clinical-enterprise-sidebar.tar.gz
```

Environment:

```bash
cp /opt/backups/clinical-enterprise-sidebar/20260607-1527/env/.env.snapshot /opt/tottech-one/.env
```

Restart:

```bash
cd /opt/tottech-one
npm run build
pm2 restart tottech-one --update-env
pm2 save
```

## Verification

- Source archive listed successfully.
- Environment snapshot exists.
- No database changes were required for this navigation-only sprint.
