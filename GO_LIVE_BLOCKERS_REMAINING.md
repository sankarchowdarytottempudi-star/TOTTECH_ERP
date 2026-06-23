# Go-Live Blockers Remaining

Generated: 2026-06-20

## Current Status
The core clinical journey and the main IVF operational chain are browser-validated. No live crash blocker was encountered in the flows tested here.

## Remaining Risks to Resolve Before Final Certification
1. **Billing reconciliation review**
   - The payment workflow completed, but the invoice snapshot should be reconciled one more time to ensure invoice total/balance state is consistent.

2. **Complete IVF walkthrough coverage**
   - Fertility assessment still needs a dedicated browser create/edit/search/view/delete pass.
   - Search and delete coverage for every IVF submodule was not exhaustively completed in this run.

3. **Final regression sweep**
   - The validated journey should be rerun once more end-to-end after the billing reconciliation check to lock the evidence set.

## Not a blocker anymore
- Lab result entry/release flow
- Pharmacy queue completion
- IVF stimulation/retrieval/embryology/transfer/pregnancy create flows
- Cryopreservation create/edit flow
