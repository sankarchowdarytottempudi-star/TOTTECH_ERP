# Module Access Control Report

Date: 2026-06-19

## Implemented

- Added shared module licensing helper:
  - `lib/clinical/module-licensing.ts`
- Added route-to-module mapping for Clinical Services paths and APIs.
- Added server-side license enforcement in `requireClinicalContext`.
- APIs using `requireClinicalContext` now return:

```json
{
  "error": "Module Not Licensed",
  "module_code": "LAB",
  "module_name": "Laboratory"
}
```

with HTTP `403` when a module is disabled.

## Sidebar Enforcement

- `ClinicalShell` filters sidebar items based on active hospital licensed modules.
- Direct navigation to an unlicensed route displays a professional "Module Not Licensed" screen.
- Mobile bottom navigation also respects licensed modules.

## Notes

- Main dashboard remains accessible and should display only licensed-module metrics as dashboard APIs are further refined.
- Dedicated module pages and APIs are blocked by module access.

## Validation

- `npx prisma generate`: passed.
- `npm run build`: passed.
