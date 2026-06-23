# Hospital Save Fix Report

Generated: 2026-06-15

## Files Changed

- `app/api/clinical/platform/hospitals/route.ts`
- `app/api/clinical/platform/hospitals/upload-logo/route.ts`
- `app/clinical-services/platform-hospitals/page.tsx`
- `app/uploads/clinical/hospitals/[file]/route.ts`

## Save Flow Now Verified

Button Click
-> Validation
-> Logo Upload
-> POST Hospital
-> DB Insert
-> Branch Creation
-> Clinic Creation
-> Owner User Creation
-> Admin User Creation
-> Registry Row Reload
-> UI State Append/Replace
-> Registry Refetch

## API Evidence

Created validation hospitals:

| Hospital | ID | Code | Branches | Staff | Registry Visible | Switcher Visible |
|---|---:|---|---:|---:|---|---|
| Test Hospital A 718372 | 29 | HTA71837 | 1 | 2 | Yes | Yes |
| Test Hospital B 718372 | 30 | HTB71837 | 1 | 2 | Yes | Yes |
| Test Hospital C 718372 | 31 | HTC71837 | 1 | 2 | Yes | Yes |

API validation result:

```json
{
  "activeRegistryContainsCreated": [true, true, true],
  "contextContainsCreated": [true, true, true],
  "edited": {
    "status": 200,
    "id": 29,
    "name": "Test Hospital A Edited 718372",
    "email": "edited.a.718372@hospital.test"
  },
  "deactivated": {
    "status": 200,
    "hospitalStatus": "INACTIVE"
  },
  "activated": {
    "status": 200,
    "hospitalStatus": "ACTIVE"
  },
  "deleted": {
    "status": 200,
    "success": true,
    "id": 30
  }
}
```

## Logo Evidence

Uploaded logo:

`/uploads/clinical/hospitals/hospital-logo-1781546687038-585521e97c14b.jpg`

Runtime serving check:

- Existing uploaded logo: `HTTP/1.1 200 OK`
- New post-restart uploaded logo: `HTTP/1.1 200 OK`
- New runtime route cache header: `Cache-Control: public, max-age=31536000, immutable`

## UI Evidence

Screenshots:

- `/opt/tottech-one/test-artifacts/hospital-crud/hospital-registry-test-a.png`
- `/opt/tottech-one/test-artifacts/hospital-crud/hospital-registry-test-c.png`
- `/opt/tottech-one/test-artifacts/hospital-crud/hospital-registry-logo-fixed.png`

Playwright image validation for `hospital-registry-logo-fixed.png`:

```json
{
  "src": "/uploads/clinical/hospitals/hospital-logo-1781546687038-585521e97c14b.jpg",
  "complete": true,
  "naturalWidth": 827,
  "alt": "Test Hospital A Edited 718372 logo"
}
```

## Build and Runtime

- `npm run build`: PASS
- PM2 app: `tottech-one`
- PM2 status: `online`

## Result

Newly created hospitals appear instantly in the registry and in the hospital switcher, and uploaded logos display correctly.
