# Clinical Services Phase 17 Backup Report

## Phase

Phase 17 - HRMS + Payroll + Biometric Attendance + Roster + Doctor Credentialing + LMS

## Backup Time

- Created: 2026-06-07 15:02 Europe/Berlin
- Backup root: `/opt/backups/clinical-phase17-hrms/20260607-1502`

## Backup Artifacts

| Artifact | Location | Verified |
|---|---|---|
| PostgreSQL database dump | `/opt/backups/clinical-phase17-hrms/20260607-1502/database/schoolerp-before-clinical-phase17.dump` | Yes |
| Application source archive | `/opt/backups/clinical-phase17-hrms/20260607-1502/source/tottech-one-before-clinical-phase17.tar.gz` | Yes |
| Prisma schema snapshot | `/opt/backups/clinical-phase17-hrms/20260607-1502/prisma/schema.prisma.snapshot` | Yes |
| Prisma migrations archive | `/opt/backups/clinical-phase17-hrms/20260607-1502/prisma/migrations-before-clinical-phase17.tar.gz` | Yes |
| Environment snapshot | `/opt/backups/clinical-phase17-hrms/20260607-1502/env/.env.snapshot` | Yes |

## Verified Sizes

- Backup directory: 356 MB
- Database dump: 9.2 MB
- Source archive: 346 MB
- Prisma migrations archive: 138 KB
- Prisma schema snapshot: 83 KB
- Environment snapshot: 668 bytes

## Restore Commands

Database:

```bash
sudo -u postgres pg_restore --clean --if-exists -d schoolerp /opt/backups/clinical-phase17-hrms/20260607-1502/database/schoolerp-before-clinical-phase17.dump
```

Application source:

```bash
cd /opt
tar -xzf /opt/backups/clinical-phase17-hrms/20260607-1502/source/tottech-one-before-clinical-phase17.tar.gz
```

Prisma schema:

```bash
cp /opt/backups/clinical-phase17-hrms/20260607-1502/prisma/schema.prisma.snapshot /opt/tottech-one/prisma/schema.prisma
```

Environment:

```bash
cp /opt/backups/clinical-phase17-hrms/20260607-1502/env/.env.snapshot /opt/tottech-one/.env
```

After rollback:

```bash
cd /opt/tottech-one
npm run build
pm2 restart tottech-one --update-env
pm2 save
```

## Verification

- Database dump completed successfully.
- Source archive completed successfully.
- Prisma and environment snapshots are present.
- No secrets are exposed in frontend code, reports, or API responses.
