# Rollback Procedure

## Goal
Restore TOTTECH ONE to the verified pre-transformation baseline if a UI, AI, language, or go-live change causes production instability.

## Rollback Inputs
- Git tag: `PRE_UI_TRANSFORMATION_V1`
- Backup location: `/opt/backups/recovery-foundation/20260624-0758`
- Database archive: `database/tottech_one.backup`
- Source snapshot: `source/`
- Infrastructure snapshot: `infra/`
- Upload snapshot: `uploads/`

## Rollback Sequence

1. Stop only the affected application services.
2. Revert application code to `PRE_UI_TRANSFORMATION_V1`.
3. Restore the PostgreSQL database from the custom archive.
4. Restore uploads and document assets.
5. Restore environment and nginx configuration from the snapshot.
6. Reload the application stack.
7. Validate login, dashboard, one workflow, and file serving.

## Database Restore
```bash
createdb schoolerp_restore_check
pg_restore -d schoolerp_restore_check /opt/backups/recovery-foundation/20260624-0758/database/tottech_one.backup
```

## Code Restore
```bash
git checkout PRE_UI_TRANSFORMATION_V1
```

## Upload Restore
```bash
rsync -a /opt/backups/recovery-foundation/20260624-0758/uploads/ /opt/tottech-one/public/uploads/
```

## Infrastructure Restore
- Copy `.env` and nginx/PM2 configuration from `infra/`
- Reapply only the known-good configuration snapshot

## Validation Checklist
- Login page loads
- Dashboard loads
- Student workflow loads
- Teacher workflow loads
- File upload assets resolve
- Database queries return expected data

