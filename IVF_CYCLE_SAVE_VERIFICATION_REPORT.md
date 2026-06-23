# IVF Cycle Save Verification Report

Generated: 2026-06-13

## Summary

IVF cycle save was verified through:

- API create
- API update
- Database row before/after comparison
- Refresh read
- IVF 360 read
- Browser-level Save button execution with screenshots
- Invalid foreign key validation test

## Runtime Context

```json
{
  "tenantId": 1,
  "hospitalId": 1,
  "branchId": 1,
  "clinicId": 1,
  "user": "CS-Superadmin@erp.com"
}
```

## Database Evidence

### Before Save

```json
{
  "count": 3,
  "max_id": 13
}
```

### API Create Request

```json
{
  "couple_id": "1",
  "treatment_plan_id": "1",
  "cycle_type": "IVF",
  "protocol_type": "Runtime UI/API Verification Protocol",
  "start_date": "2026-06-13",
  "expected_retrieval_date": "2026-06-20",
  "expected_transfer_date": "2026-06-25",
  "status": "ACTIVE",
  "workflow_stage": "Runtime verification save path",
  "priority": "URGENT_SAVE_FIX_PROOF",
  "notes": "Created by urgent IVF cycle save verification script after API/UI patch."
}
```

### API Create Response

```json
{
  "status": 201,
  "id": 14,
  "cycle_number": "CYC-1781380821845",
  "workflow_stage": "Runtime verification save path",
  "priority": "URGENT_SAVE_FIX_PROOF"
}
```

### After Save

```json
{
  "count": 4,
  "max_id": 14
}
```

### Created Row

```json
{
  "id": 14,
  "cycle_number": "CYC-1781380821845",
  "couple_id": 1,
  "treatment_plan_id": 1,
  "patient_id": 1,
  "cycle_type": "IVF",
  "protocol_type": "Runtime UI/API Verification Protocol",
  "status": "ACTIVE",
  "workflow_stage": "Runtime verification save path",
  "priority": "URGENT_SAVE_FIX_PROOF"
}
```

## Update Verification

### API Update Response

```json
{
  "status": 200,
  "id": 14,
  "workflow_stage": "Runtime verification update path",
  "priority": "URGENT_SAVE_FIX_UPDATED"
}
```

## Refresh Verification

### GET `/api/clinical/ivf/cycles`

```json
{
  "status": 200,
  "found": true,
  "rows": 4,
  "foundCycleNumber": "CYC-1781380821845",
  "foundPriority": "URGENT_SAVE_FIX_UPDATED"
}
```

## IVF 360 Verification

### GET `/api/clinical/ivf/360/1`

```json
{
  "status": 200,
  "containsCreatedCycleNumber": true
}
```

## Browser Save Button Verification

The IVF Cycle page was opened in Chromium through Playwright and the real Save button was clicked.

Browser POST response:

```json
{
  "status": 201,
  "id": 15,
  "cycle_number": "CYC-1781380944854",
  "protocol_type": "Playwright Browser Save Protocol",
  "workflow_stage": "Browser save verification",
  "priority": "PLAYWRIGHT_SAVE_PROOF_SUCCESS"
}
```

Refresh proof:

```json
{
  "containsBrowserSavedCycle15": true,
  "containsApiSavedCycle14": true
}
```

## Screenshot Evidence

Screenshots captured under:

- `reports/ivf-cycle-save/01-cycle-page-before-save.png`
- `reports/ivf-cycle-save/02-cycle-form-filled.png`
- `reports/ivf-cycle-save/03-cycle-page-after-save.png`
- `reports/ivf-cycle-save/04-browser-form-before-success-save.png`
- `reports/ivf-cycle-save/05-browser-form-filled-success.png`
- `reports/ivf-cycle-save/06-browser-after-success-save.png`
- `reports/ivf-cycle-save/07-refresh-shows-saved-cycles.png`

Machine-readable evidence:

- `reports/ivf-cycle-save/browser-evidence.json`
- `reports/ivf-cycle-save/browser-success-evidence.json`
- `reports/ivf-cycle-save/browser-refresh-evidence.json`

## Button Verification

| Button | Runtime Status |
| --- | --- |
| Save | Working. API returned 201 and DB row persisted. |
| Update | Working. API returned 200 and updated DB row persisted. |
| Delete | UI control added and wired to existing DELETE endpoint. |
| Cancel | UI control added; clears form and returns from edit mode. |
| Close | UI control added; routes back to IVF workspace. |
| View | Existing record card route remains available. |
| Edit | Existing record card edit route remains available. |
| Timeline | Audit/history links remain available through record card anchors. |
| Attachments | Dedicated record-card Attachments action added, linked to the record attachments section. |

## Fresh Server Smoke Test

After the final production build and PM2 restart:

```json
{
  "endpoint": "/api/clinical/ivf/cycles",
  "status": 200,
  "rows": 5,
  "hasBrowserCycle": true
}
```

## Final Status

IVF Cycle create, update, refresh, and IVF 360 visibility are verified in runtime.

The old silent/500 save path caused by invalid child IVF references is fixed with pre-write validation and visible error feedback.
