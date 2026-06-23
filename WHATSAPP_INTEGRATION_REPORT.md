# TOTTECH ONE WhatsApp Enterprise Integration Report

Generated: 2026-06-06 19:44 Europe/Berlin

## Backup

Backup location:

`/opt/backups/whatsapp-integration/20260606-1912`

Verified artifacts:

- Database dump: `database/schoolerp-whatsapp-before.dump` - 1,017,002 bytes
- Application source archive: `source/tottech-one-source.tar.gz` - 626,092,651 bytes
- Environment snapshot: `env/.env.snapshot` - 549 bytes, mode 600
- Notification services archive: `notification-services/notification-files.tar.gz` - 2,040 bytes
- Backup report: `/opt/tottech-one/WHATSAPP_BACKUP_REPORT.md`

Rollback entrypoint:

Use restore commands documented in `WHATSAPP_BACKUP_REPORT.md`.

## Environment

Configured environment keys:

- `WHATSAPP_API_KEY` - present, not exposed
- `WHATSAPP_BASE_URL` - present but empty
- `WHATSAPP_ENABLED` - `true`

Security status:

- API key is stored only in `.env`.
- API key is not hardcoded in source code.
- API key is not returned by the settings API.
- Delivery webhook requires bearer authorization using the configured key.

Provider readiness:

- Environment enabled: yes
- API key present: yes
- Base URL present: no
- External delivery status: blocked until `WHATSAPP_BASE_URL` is configured

## Database

Created/verified tables:

- `whatsapp_templates`
- `whatsapp_messages`
- `whatsapp_delivery_events`
- `whatsapp_retry_attempts`
- `whatsapp_metering`

Registered templates:

- `student_created`
- `payment_received`
- `invoice_created`
- `payment_due_reminder`
- `homework_assigned`
- `exam_schedule_created`
- `exam_schedule_reminder`
- `monthly_attendance_report`

Template verification:

- Enabled templates: 8
- Total templates: 8

## Application Integration

Created notification service:

- `lib/notifications/whatsapp.ts`

Capabilities:

- Template registry lookup
- Message queue
- Provider dispatch abstraction
- Retry attempt tracking
- Delivery status tracking
- Monthly metering
- Event Ledger logging
- Masked recipient logging
- Database enable/disable setting
- Template enable/disable setting

Created API routes:

- `GET /api/settings/whatsapp`
- `POST /api/settings/whatsapp`
- `POST /api/notifications/whatsapp/delivery`

Created settings UI:

- `Settings -> Notifications -> WhatsApp`
- Page: `/settings/whatsapp`

UI includes:

- Provider status
- Template status
- Delivery statistics
- Failed messages
- Retry queue
- Test message action
- Enable/disable controls

## Workflow Triggers

Automatic WhatsApp dispatch is wired into:

- Student created -> `student_created`
- Invoice generated -> `invoice_created`
- Payment recorded -> `payment_received`
- Homework assigned -> `homework_assigned`
- Exam schedule created -> `exam_schedule_created`

Manual/admin API support added for:

- Fee due reminder -> `payment_due_reminder`
- Monthly attendance report -> `monthly_attendance_report`
- Retry queue processing
- Test message

The following requested template is registered and ready, but requires a scheduler or reminder workflow to trigger automatically:

- Exam reminder -> `exam_schedule_reminder`

## Audit Trail

Every send attempt writes to:

- `whatsapp_messages`
- `whatsapp_retry_attempts`
- `event_ledger`

Delivery callbacks write to:

- `whatsapp_delivery_events`
- `whatsapp_messages.delivery_status`
- `event_ledger`

## Verification

Commands completed successfully:

- `npx prisma validate`
- `npm run build`
- Targeted ESLint on WhatsApp integration and touched workflow routes
- PM2 restart with `--update-env`
- PM2 save
- Local login health check: HTTP 200
- Public HTTPS login health check: HTTP 200
- Unauthenticated settings API check: HTTP 401

Global `npm run lint` status:

- Failed because of existing lint debt outside this integration.
- Current count: 389 problems, mostly in academics/mobile/scripts.
- Targeted lint for WhatsApp integration files passed with zero errors.

Service-level dry run:

- Trigger used: `student_created`
- Result: message queued and processed
- Provider result: `CONFIG_REQUIRED`
- Reason: `WHATSAPP_BASE_URL` is not configured
- Recipient stored only as masked value
- Event Ledger entry created: `WHATSAPP_MESSAGE_FAILED`
- Retry attempt created: yes

Current queue proof:

- `whatsapp_messages`: 1 test record
- `whatsapp_retry_attempts`: 1 test record
- Event Ledger contains WhatsApp failure entry with `CONFIG_REQUIRED`

## Remaining Provider Step

Real external WhatsApp delivery cannot complete until the provider endpoint is supplied.

Set:

`WHATSAPP_BASE_URL=<provider-send-endpoint>`

Then restart:

`pm2 restart tottech-one --update-env && pm2 save`

After that, use `/settings/whatsapp` to send a test message and verify delivery status.
