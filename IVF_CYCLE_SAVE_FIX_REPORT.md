# IVF Cycle Save Fix Report

Status: IMPLEMENTED

Changes:
- IVF save API now supports create and full update using the same endpoint.
- Existing cycle records are updated when `id` is submitted instead of creating duplicates.
- Writes are filtered against actual database columns before INSERT/UPDATE.
- IVF cycle `patient_id` is derived from the selected couple when available.
- IVF timeline now records cycle create/update events with the cycle id.
- IVF cycle notes were added to the cycle form configuration.

Validation:
- Production build passed with the IVF cycle route included.
- Route available: `/clinical-services/ivf/cycles`.
- API available: `/api/clinical/ivf/cycles`.

