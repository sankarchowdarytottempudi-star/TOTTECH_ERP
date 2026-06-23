#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="${APP_ROOT:-/opt/tottech-one}"
BACKUP_ROOT="${BACKUP_ROOT:-/opt/backups/clinical-production}"
STAMP="$(date +%Y%m%d-%H%M%S)"
DEST="${BACKUP_ROOT}/${STAMP}"

mkdir -p "${DEST}"

cd "${APP_ROOT}"

if [[ -f ".env" ]]; then
  cp .env "${DEST}/env.backup"
  chmod 600 "${DEST}/env.backup"
fi

if [[ -d "public/uploads" ]]; then
  tar -czf "${DEST}/uploads.tar.gz" public/uploads
fi

if [[ -d "public/documents" ]]; then
  tar -czf "${DEST}/documents.tar.gz" public/documents
fi

tar -czf "${DEST}/source.tar.gz" \
  --exclude=node_modules \
  --exclude=.next/cache \
  --exclude=.git \
  .

sanitize_db_url() {
  local url="$1"
  if [[ "$url" == *\?* ]]; then
    local base="${url%%\?*}"
    local params="${url#*\?}"
    local filtered=""
    IFS='&' read -ra pairs <<< "$params"
    for p in "${pairs[@]}"; do
      case "$p" in
        schema=*) continue ;;
        '') continue ;;
        *) filtered+="${p}&" ;;
      esac
    done
    filtered="${filtered%&}"
    if [[ -n "$filtered" ]]; then
      printf '%s?%s' "$base" "$filtered"
    else
      printf '%s' "$base"
    fi
  else
    printf '%s' "$url"
  fi
}

if [[ -n "${DATABASE_URL:-}" ]]; then
  DB_URL="$(sanitize_db_url "${DATABASE_URL}")"
  pg_dump "${DB_URL}" > "${DEST}/database.sql"
elif [[ -f ".env" ]] && grep -q '^DATABASE_URL=' .env; then
  DB_URL="$(grep '^DATABASE_URL=' .env | tail -n 1 | cut -d= -f2- | tr -d '\"')"
  DB_URL="$(sanitize_db_url "${DB_URL}")"
  pg_dump "${DB_URL}" > "${DEST}/database.sql"
else
  sudo -u postgres pg_dump schoolerp > "${DEST}/database.sql"
fi

pm2 jlist > "${DEST}/pm2-processes.json" || true

cat > "${DEST}/RESTORE_COMMANDS.txt" <<EOF
Restore database:
  psql "\${DATABASE_URL}" < ${DEST}/database.sql

Restore source:
  tar -xzf ${DEST}/source.tar.gz -C /opt/tottech-one

Restore uploads:
  tar -xzf ${DEST}/uploads.tar.gz -C /opt/tottech-one

Restart:
  cd /opt/tottech-one
  npm install
  npm run build
  pm2 restart tottech-one --update-env
EOF

du -sh "${DEST}" > "${DEST}/BACKUP_SIZE.txt"
echo "Clinical production backup completed: ${DEST}"
