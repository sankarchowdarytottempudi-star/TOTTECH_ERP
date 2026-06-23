# Global Search Implementation Report

Date: 2026-06-13

## Objective

Stop loading large record lists and add server-side search/pagination behavior to Clinical Services operational record engines.

## Server-Side Paging

Updated API routes:

- `GET /api/clinical/ivf/[module]`
- `GET /api/clinical/hms/[module]`
- `GET /api/clinical/pharmacy/[module]`
- `GET /api/clinical/finance/[module]`

Default behavior:

- `limit=10`
- `page=1`
- `pagination.totalCount` returned

Maximum allowed limit:

- `50`

## Search Behavior

Search parameters supported:

- `q`
- `search`

Search activates after:

- 2 characters

The UI search boxes were added to:

- IVF dynamic records
- HMS dynamic records
- Pharmacy dynamic records
- Finance dynamic records

## Runtime API Evidence

Validated after PM2 restart:

- `/api/clinical/ivf/cycles?limit=10&page=1` returned 2 rows and pagination metadata.
- `/api/clinical/hms/ip?limit=10&page=1` returned pagination metadata.
- `/api/clinical/pharmacy/medicines?limit=10&page=1` returned pagination metadata.
- `/api/clinical/finance/ar?limit=10&page=1` returned pagination metadata.

## Note

The existing global patient lookup component already supports patient-centric search by name, mobile, UHID/MRN, and ABHA in operational workflows. This sprint standardizes the generic record list engines so large modules do not send hundreds of raw records to the browser.
