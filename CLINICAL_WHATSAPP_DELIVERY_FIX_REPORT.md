# Clinical WhatsApp Delivery Fix Report

Date: 2026-06-10

## Issue

TOTTECH Clinical Services created notification records for patient registration and appointment booking, but messages were not delivered because the live process was using the clinical-only WhatsApp gate.

## Root Cause

Clinical notifications were queued with:

`CLINICAL_WHATSAPP_ENABLED is not true.`

The server environment had the shared WhatsApp configuration enabled:

- `WHATSAPP_ENABLED=true`
- `WHATSAPP_PROVIDER=interakt`
- `WHATSAPP_BASE_URL` configured
- `WHATSAPP_API_KEY` configured

but the clinical flag was missing:

- `CLINICAL_WHATSAPP_ENABLED`

## Fix Applied

- Rebuilt the production Next.js application.
- Restarted PM2 with updated environment.
- Added `CLINICAL_WHATSAPP_ENABLED=true` to `.env`.
- Added a retry endpoint for queued clinical notification messages:

`PATCH /api/clinical/notifications/queue`

## Verification

Retried the latest queued clinical notifications for recipient `8179618819`.

| Queue ID | Template | Status | Provider HTTP | Interakt Message ID |
|---:|---|---|---:|---|
| 10 | `patient_registration_success` | SENT | 201 | `6107ab1c-4b8c-4f8e-8a93-b28bdf586264` |
| 11 | `appointment_booked` | SENT | 201 | `c9ad57e6-3923-4b82-a2cd-5c3c99c7d817` |
| 12 | `bill_generated` | SENT | 201 | `d82e6687-0c7b-4137-b1eb-ff66b413bed5` |
| 13 | `medicines_dispensed` | SENT | 201 | `5443a45a-8bee-4127-9e0b-d41659694f6e` |

Interakt response:

`Message queued for sending via Interakt. Check webhook for delivery status`

## Notes

Application-side dispatch is now working. Final device delivery depends on Interakt template approval, WhatsApp recipient eligibility, and provider delivery/webhook status.
