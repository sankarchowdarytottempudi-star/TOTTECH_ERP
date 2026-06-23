# Hospital CRUD Verification Report

Generated: 2026-06-13

## Runtime Context

```json
{
  "app": "tottech-one",
  "localRuntime": "http://127.0.0.1:3000",
  "user": "CS-Superadmin@erp.com",
  "roleKey": "clinical_super_admin",
  "tenantId": 1
}
```

## API CRUD Validation

### Create

Request:

```http
POST /api/clinical/platform/hospitals
```

Result:

```json
{
  "status": 201,
  "id": 16,
  "code": "HP007870"
}
```

### Search / List

Request:

```http
GET /api/clinical/platform/hospitals?search=HP007870&status=ACTIVE
```

Result:

```json
{
  "status": 200,
  "rows": 1,
  "found": {
    "id": 16,
    "code": "HP007870",
    "name": "Visible CRUD Hospital Edited 007870",
    "status": "ACTIVE",
    "branch_count": 1,
    "doctor_count": 0,
    "staff_count": 0
  }
}
```

### Edit

Request:

```http
PATCH /api/clinical/platform/hospitals
```

Result:

```json
{
  "status": 200,
  "id": 16,
  "name": "Visible CRUD Hospital Edited 007870",
  "phone": "9777707870"
}
```

### Database Persistence

```json
{
  "id": 16,
  "hospital_name": "Visible CRUD Hospital Edited 007870",
  "hospital_code": "HP007870",
  "phone": "9777707870",
  "status": "ACTIVE",
  "is_deleted": false
}
```

This row was intentionally left active as a visible runtime proof hospital.

### Deactivate / Activate / Delete

A separate runtime CRUD record was used to validate status and delete behavior.

Create:

```json
{
  "status": 201,
  "id": 15,
  "code": "CRD95028"
}
```

Edit:

```json
{
  "status": 200,
  "id": 15,
  "name": "CRUD Runtime Hospital Edited 950282",
  "phone": "9111150282"
}
```

Deactivate:

```json
{
  "status": 200,
  "statusValue": "INACTIVE"
}
```

Activate:

```json
{
  "status": 200,
  "statusValue": "ACTIVE"
}
```

Delete:

```json
{
  "status": 200,
  "success": true,
  "deletedStatus": "DELETED"
}
```

Deleted filter:

```http
GET /api/clinical/platform/hospitals?search=CRD95028&status=DELETED
```

Confirmed:

```json
{
  "id": 15,
  "hospital_code": "CRD95028",
  "status": "DELETED",
  "is_deleted": true
}
```

## Browser Validation

Browser route:

```text
/clinical-services/platform-hospitals
```

Evidence:

```json
{
  "listShowsHospital": true,
  "detailsShowsHospital": true,
  "editFormPrefilled": true,
  "consoleMessages": [],
  "failedRequests": []
}
```

## Screenshot Evidence

Screenshots captured under:

- `reports/hospital-crud/01-platform-hospitals-list.png`
- `reports/hospital-crud/02-search-active-hospital.png`
- `reports/hospital-crud/03-view-hospital-details.png`
- `reports/hospital-crud/04-edit-hospital-form-prefilled.png`

Machine-readable browser evidence:

- `reports/hospital-crud/browser-hospital-crud-evidence.json`

## CRUD Result Matrix

| Capability | Status | Evidence |
| --- | --- | --- |
| Create Hospital | Working | HTTP 201, DB row id `16`. |
| View Hospital | Working | Browser details panel screenshot. |
| Edit Hospital | Working | HTTP 200, DB row updated. |
| Soft Delete Hospital | Working | HTTP 200, `is_deleted = true`, `status = DELETED`. |
| Activate Hospital | Working | HTTP 200, `status = ACTIVE`. |
| Deactivate Hospital | Working | HTTP 200, `status = INACTIVE`. |
| Search | Working | `search=HP007870` returned the proof hospital. |
| Active Filter | Working | `status=ACTIVE` returned active proof hospital. |
| Deleted Filter | Working | `status=DELETED` returned soft-deleted proof hospital. |
| Refresh Persistence | Working | API and browser reload still show active proof hospital. |
| Logout/Login Persistence | API-Proven | Record persisted in DB and is returned by authenticated GET after PM2 restart. |

## Final Status

Hospital Management is now a full CRUD surface for platform super admins:

- Create
- View
- Edit
- Delete
- Activate
- Deactivate
- Search
- Filter
- Persist after refresh/restart

