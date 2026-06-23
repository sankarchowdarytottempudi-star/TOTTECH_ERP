#!/usr/bin/env bash
set -euo pipefail

BACKUP_ROOT="${BACKUP_ROOT:-/opt/backups/clinical-production}"
DB_NAME="${POSTGRES_DB:-schoolerp}"
DB_USER="${POSTGRES_USER:-postgres}"
STAMP="$(date +%Y%m%d-%H%M%S)"
TARGET="${BACKUP_ROOT}/${STAMP}"

mkdir -p "${TARGET}/database" "${TARGET}/source" "${TARGET}/env"

pg_dump -Fc -U "${DB_USER}" "${DB_NAME}" -f "${TARGET}/database/${DB_NAME}.dump"
tar --exclude=node_modules --exclude=.next/cache -czf "${TARGET}/source/tottech-clinical-source.tar.gz" -C /opt tottech-one

if [ -f /opt/tottech-one/.env ]; then
  cp /opt/tottech-one/.env "${TARGET}/env/.env.snapshot"
fi

find "${TARGET}" -type f -printf '%p\t%s bytes\n' | sort > "${TARGET}/BACKUP_MANIFEST.tsv"
pg_restore --list "${TARGET}/database/${DB_NAME}.dump" > "${TARGET}/database/${DB_NAME}.restore-list.txt"

echo "Clinical backup completed: ${TARGET}"
