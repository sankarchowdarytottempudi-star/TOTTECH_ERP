# Lab, Radiology, and Pharmacy Report

Generated: 2026-06-13

## Current Workflow Surface

Clinical routes exist for:

- Lab operations
- Radiology operations
- Pharmacy operations
- Billing revenue integration

## Sprint Improvement

Mobile clinical navigation now opens the actual operational pages:

- Lab/Radiology: `/clinical-services/operations#lab`
- Pharmacy: `/clinical-services/pharmacy`
- Billing: `/clinical-services/billing-revenue`

This removes stale mobile routes that previously led to dead or generic pages.

## Remaining Validation Required

The following must be replayed with real records:

- Doctor lab order appears in lab queue.
- Sample collection updates status.
- Result entry and approval are separate events.
- Released lab result appears in doctor review and Patient 360.
- Doctor prescription appears in pharmacy queue.
- Dispense reduces stock.
- Billing item is created and payment receipt is generated.

