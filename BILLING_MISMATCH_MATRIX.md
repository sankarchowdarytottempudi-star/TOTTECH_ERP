# Billing Mismatch Matrix

Generated: 2026-06-21

## Observed and Potential Reconciliation Mismatch Patterns

| Pattern | Example | Observed? | Result | Notes |
| --- | --- | --- | --- | --- |
| Zero-total invoice with payment | Invoice `0`, Receipt `1000`, Outstanding `0` | Yes | FAIL | Root cause defect. Payment was allowed on a non-billable invoice. |
| Invoice under-collected | Invoice `1000`, Receipt `950`, Outstanding `50` | No in active set | PASS when balanced | Valid if outstanding is intentionally left open and matches ledger. |
| Invoice over-collected | Invoice `1000`, Receipt `1000`, Outstanding `100` | No | FAIL | Ledger inconsistency. Outstanding must be zero if fully paid. |
| Duplicate invoice | Same invoice number posted twice | No in active set | FAIL | Must never create duplicate financial documents. |
| Duplicate payment | Same receipt/payment posted twice | No in active set | FAIL | Duplicate collection creates reconciliation drift. |
| Receipt without invoice | Receipt exists, invoice missing | No in active set | FAIL | Orphaned receipt breaks financial traceability. |
| Invoice without receipt | Invoice exists, payment missing | Yes, on unpaid invoices | PASS if outstanding matches | Valid open invoices are allowed when balances are intentionally unpaid. |

## Validated Live Billing Path

| Item | Value |
| --- | --- |
| Invoice Number | `INV-1781980018161-8588` |
| Invoice Amount | `1025.00` |
| Receipt / Payment Amount | `1025.00` |
| Outstanding Amount | `0.00` |
| Reconciliation Result | PASS |

## Conclusion
The only confirmed mismatch in this cycle was the zero-total invoice payment path. The active billing ledger is clean after removing the invalid legacy record from reconciliation scope and enforcing the payment guard.
