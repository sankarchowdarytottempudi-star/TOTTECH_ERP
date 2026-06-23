# WHATSAPP BACKUP REPORT

Generated: 2026-06-06 19:12 CEST

## Backup Root

`/opt/backups/whatsapp-integration/20260606-1912`

## Backup Contents

| Area | Location | Size |
| --- | --- | ---: |
| Database | `/opt/backups/whatsapp-integration/20260606-1912/database/schoolerp-whatsapp-before.dump` | 1017002 bytes |
| Application source | `/opt/backups/whatsapp-integration/20260606-1912/source/tottech-one-source.tar.gz` | 626092651 bytes |
| Environment file snapshot | `/opt/backups/whatsapp-integration/20260606-1912/env/.env.snapshot` | 549 bytes |
| Notification service files | `/opt/backups/whatsapp-integration/20260606-1912/notification-services/notification-files.tar.gz` | 2040 bytes |

## Verification

- `pg_restore -l` completed for the database dump.
- `tar -tzf` completed for source archive.
- `tar -tzf` completed for notification-services archive.

## Restore Commands

Database:

```bash
pg_restore --clean --if-exists -d schoolerp /opt/backups/whatsapp-integration/20260606-1912/database/schoolerp-whatsapp-before.dump
```

Source:

```bash
tar -xzf /opt/backups/whatsapp-integration/20260606-1912/source/tottech-one-source.tar.gz -C /opt
```

Environment:

```bash
install -m 600 /opt/backups/whatsapp-integration/20260606-1912/env/.env.snapshot /opt/tottech-one/.env
```

Notification files only:

```bash
tar -xzf /opt/backups/whatsapp-integration/20260606-1912/notification-services/notification-files.tar.gz -C /opt/tottech-one
```

## Secret Handling

The environment snapshot is stored with restricted file permissions. Secrets are not printed in this report.

