# Payment Collection Verification Report

Generated: 2026-06-13

## Validation Scenario

Goal:

Verify that a Rs. 50 lab test stays Rs. 50 through:

Doctor lab order -> bill generation -> front desk payment -> receipt print -> sample collection.

## Test Data

- Patient: `LabBilling Validation1781384552`
- Patient ID: `529`
- UHID: `UHID-1781384553216`
- Appointment ID: `131`
- Medical Record ID: `26`
- Lab Test: `FF`
- Lab Test Master ID: `1`
- Lab Test Cost: `Rs. 50`
- Lab Order ID: `92`
- Invoice ID: `212`
- Invoice Number: `INV-1781384553612-4890`
- Invoice Item ID: `253`
- Payment ID: `201`
- Payment Number: `PAY-1781384637259-9621`

## Flow Executed

1. Patient created through API.
2. Appointment booked through API.
3. Doctor consultation saved with lab order `FF`.
4. Lab order created with status `BILL_GENERATED`.
5. Billing invoice generated with amount `Rs. 50`.
6. Payment collected through Billing Counter API.
7. Payment receipt PDF rendered.
8. Lab order moved from `BILL_PAID` to `SAMPLE_COLLECTED`.
9. Invoice and billing item rechecked after sample collection.
10. WhatsApp queue rechecked after sample collection.

## Invoice Evidence

Before payment:

```json
{
  "invoice_id": 212,
  "invoice_number": "INV-1781384553612-4890",
  "source_module": "laboratory",
  "source_record_id": 92,
  "total": "50",
  "paid_amount": "0",
  "balance_amount": "50",
  "status": "OPEN"
}
```

After payment:

```sql
id  | invoice_number          | total | paid_amount | balance_amount | status
212 | INV-1781384553612-4890 | 50.00 | 50.00       | 0.00           | PAID
```

Payment row:

```sql
id  | invoice_id | payment_number          | amount | payment_mode | reference_number
201 | 212        | PAY-1781384637259-9621 | 50.00  | Cash         | LAB-VALIDATION-50
```

## Lab Status Evidence

After payment:

```sql
lab_order_id | status
92           | BILL_PAID
```

After sample collection:

```sql
lab_order_id | status           | master_cost | invoice_id | total | paid_amount | balance_amount | invoice_status | rate  | amount | item_total
92           | SAMPLE_COLLECTED | 50.00       | 212        | 50.00 | 50.00       | 0.00           | PAID           | 50.00 | 50.00  | 50.00
```

Lab invoice item count after sample collection:

```sql
lab_invoice_item_count
1
```

This proves sample collection did not create a second bill.

## WhatsApp Evidence

Queued notifications for the validation patient:

```sql
template_key                 | source_module          | amount
patient_registration_success | patients               | -
appointment_booked           | appointments           | -
bill_generated               | billing_invoice_items  | 50
lab_test_ordered             | lab_orders             | -
payment_received             | payments               | 50
```

No notification was queued for sample collection.

No payment demand was queued when status changed to `SAMPLE_COLLECTED`.

## Timeline Evidence

Patient timeline rows:

```sql
event_type          | event_title        | source_table                 | source_id
REGISTRATION        | Patient Registered | patients                     | 529
APPOINTMENT         | BOOKED             | appointments                 | 131
NOTIFICATION        | QUEUED             | clinical_notification_queue  | 50
CONSULTATION_SAVED  | Consultation saved | medical_records              | 26
NOTIFICATION        | QUEUED             | clinical_notification_queue  | 52
LAB                 | SAMPLE_COLLECTED   | lab_orders                   | 92
```

## Receipt Evidence

Receipt PDF:

- `/opt/tottech-one/reports/lab-billing/payment-receipt-201.pdf`

Billing counter screenshot:

- `/opt/tottech-one/reports/lab-billing/billing-counter-lab-validation.png`

## Build and Deployment

Production build:

- `npm run build` passed.

Runtime:

- PM2 app `tottech-one` restarted successfully.

## Result

PASS.

- Lab bill amount remained Rs. 50.
- Payment amount remained Rs. 50.
- Receipt generated for Rs. 50.
- `BILL_PAID -> SAMPLE_COLLECTED` did not create a new invoice.
- `BILL_PAID -> SAMPLE_COLLECTED` did not modify bill amount.
- `BILL_PAID -> SAMPLE_COLLECTED` did not send a payment request WhatsApp message.

