# IVF Critical Bugs Report

Generated: 2026-06-20

## Bugs Found and Resolved During Validation
1. **Lab result entry defaulted to release mode**
   - Symptom: POST `/api/clinical/operations/lab-results` returned `400` until the default action was changed.
   - Fix: defaulted the lab result action to `RESULT_ENTRY` in `app/clinical-services/operations/page.tsx`.
   - Outcome: lab result entry and release validated successfully in browser UI.

2. **IVF form save click targeted the wrong button in automation**
   - Symptom: browser automation saw no POST on several IVF pages because the first matching button on the page was not the form submit button.
   - Fix: scope the click to the actual create card/record article submit button.
   - Outcome: IVF create flows started returning `201`.

3. **Cryopreservation required a real embryo id**
   - Symptom: initial cryo create returned `400` when embryo id was invalid.
   - Fix: reran the workflow using the actual embryo record id `2`.
   - Outcome: cryopreservation create and edit validated successfully.

## Remaining Critical Watch Items
- Billing invoice/accounting state should be reconciled because the latest payment flow and invoice snapshot do not fully agree.
- Fertility assessment needs a dedicated browser UAT pass.
