# Embryology Save Root Cause Report

Generated: 2026-06-13

## Reported Issue

The IVF Embryology Lab screen opened, but after entering data and clicking Save, the record did not appear in the grid.

## Runtime Reproduction

The save path was traced from browser and API:

Button click -> frontend handler -> `POST /api/clinical/ivf/embryology` -> database insert -> success response -> grid reload.

Initial browser reproduction on the current deployed code returned:

```text
POST /api/clinical/ivf/embryology
HTTP 201
Created record id: 6
```

That means the deployed create path was no longer fully broken at the time of validation. However, the audit uncovered related production defects that could make the screen appear unreliable:

1. Embryology Lab records did not model all required production relationships.
2. Embryo autocomplete search could fail because `ivf_embryos.patient_id` did not exist.
3. Embryology update failed with duplicate `patient_id` assignment.
4. Attachments button existed, but there was no upload control on the save screen.

## Root Causes Found

### 1. Missing Embryology Relationship Columns

`ivf_fertilization_records` did not support all required relationships:

- patient
- embryo
- doctor
- attachments

Added columns:

```sql
patient_id INTEGER REFERENCES patients(id)
embryo_record_id INTEGER REFERENCES ivf_embryos(id)
doctor_id INTEGER REFERENCES doctors(id)
notes TEXT
attachments JSONB DEFAULT '[]'::jsonb
```

### 2. Embryo Search Column Gap

Embryo autocomplete searched by patient context, but `ivf_embryos` did not have `patient_id`.

Added:

```sql
ALTER TABLE ivf_embryos ADD COLUMN IF NOT EXISTS patient_id INTEGER REFERENCES patients(id);
```

The embryo search query was also hardened to resolve patient context through `ivf_couples`.

### 3. Update Failure

Update failed with:

```text
multiple assignments to same column "patient_id"
```

Cause:

`patient_id` was included in writable form columns and also derived from couple context.

Fix:

The IVF API now tracks updated columns with a `Set` and only adds derived `patient_id` when it has not already been assigned.

### 4. Attachments Were Not Uploadable

The screen had an Attachments link but no upload control during save.

Fix:

Added an Embryology attachment input supporting:

- embryo images
- microscope images
- PDF attachments

Attachments are stored in:

- `ivf_fertilization_records.attachments`
- `ivf_documents` with source metadata

## Files Changed

- `prisma/migrations/202606132315_embryology_save_hardening/migration.sql`
- `lib/clinical/ivf-core.ts`
- `app/api/clinical/ivf/[module]/route.ts`
- `app/clinical-services/ivf/[module]/page.tsx`

## Migration Applied

The app DB user did not own the IVF tables, so the migration was applied as the database owner:

```text
ALTER TABLE
ALTER TABLE
CREATE INDEX
CREATE INDEX
CREATE INDEX
```

## Build Status

Production build passed:

```text
npm run build
Finished TypeScript
Generated static pages successfully
```

PM2 restarted:

```text
tottech-one online
```

