# Hospital Save API Trace Report

Date: 2026-06-19

## API

`POST /api/clinical/platform/hospitals`

## Trace Points Added

- Request received
- Validation passed
- Duplicate hospital code check
- Hospital insert
- Branch insert
- Clinic insert
- Owner user insert
- Admin user insert
- Subscription insert
- Module access insert
- Transaction commit
- Registry row fetch
- Response sent

## Error Handling

The API now returns specific errors where possible:

- Duplicate Hospital Code
- Invalid Email
- Database Transaction Failed
- Hospital logo required
- Hospital required fields missing

## Atomicity

Hospital creation now uses a transaction for the core create sequence:

Hospital → Branch → Clinic → Users → Subscription → Module Access

If any step fails, the transaction rolls back.
