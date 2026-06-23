# IVF Graphical Dashboard Implementation Report

Date: 2026-06-13

## Scope

Rebuilt `/clinical-services/ivf/dashboard` from count-only cards into a patient/couple driven IVF graphical command dashboard.

## Files Changed

- `app/api/clinical/ivf/dashboard/route.ts`
- `app/clinical-services/ivf/dashboard/page.tsx`

## Implemented Capabilities

### Patient / Couple Search

Implemented autocomplete search after 2 characters using:

- UHID
- Mobile number
- Patient name
- Couple ID
- IVF cycle ID

The search endpoint returns couple, patient, and cycle matches scoped to the active clinical tenant, hospital, and branch.

### Selected IVF Context

After selecting a result, the dashboard loads the full IVF context for the selected couple:

- Couple profile
- Female and male patient identifiers
- IVF 360 link
- Tenant / hospital / branch scoped IVF records

### Graphical Dashboard Sections

Implemented the requested visual sections:

- Couple Management
  - Female AMH, FSH, AFC, BMI trend chart
  - Male sperm count, motility, morphology trend chart
- Fertility Assessment
  - Fertility score gauge
  - Risk indicators
  - Hormone trend charts
- IVF Cycles
  - Timeline view
  - Cycle status donut
  - Cycle outcome pie
- Stimulation
  - Follicle growth line chart
  - Medication timeline
  - Trigger / retrieval date display
- Retrieval
  - Retrieved, mature, immature, degenerated egg pie chart
- Embryology
  - 2PN, 4 Cell, 8 Cell, Blastocyst, Frozen, Discarded donut chart
- Cryopreservation
  - Frozen embryos, oocytes, sperm pie chart
- Transfer
  - Transfer history chart
  - Success-rate area chart
- Donor Management
  - Donor usage chart
  - Donor status chart
- Surrogacy
  - Surrogacy progress chart
  - Milestone chart
- Pregnancy Tracking
  - Beta HCG to delivery funnel

### View More / Grid / Print / PDF

Each dashboard section includes:

- View More
- Print
- Export PDF

View More opens the existing editable IVF module grid with the selected `couple_id` filter where applicable.

Print and Export PDF use the browser print flow, allowing users to print or save the visible dashboard as PDF without creating a duplicate report catalog.

## Data Source

The dashboard uses actual IVF tables:

- `ivf_couples`
- `ivf_female_assessments`
- `ivf_male_assessments`
- `ivf_cycles`
- `ivf_stimulation_records`
- `ivf_follicle_tracking`
- `ivf_retrievals`
- `ivf_fertilization_records`
- `ivf_embryos`
- `ivf_freezing_records`
- `ivf_embryo_transfers`
- `ivf_pregnancies`
- `ivf_donors`
- `ivf_surrogates`

No mock IVF chart data was added.

## Current Data Note

The currently available IVF couple in tenant/hospital/branch `1/1/1` has:

- Female assessments: 1
- Male assessments: 0
- Cycles: 5
- Stimulation records: 0
- Follicle tracking: 0
- Retrievals: 0
- Fertilization records: 0
- Embryos: 0
- Cryo records: 0
- Transfers: 0
- Pregnancies: 0
- Donors: 0
- Surrogates: 0

The dashboard therefore shows real charts where data exists and explicit no-data states where the clinical records do not yet exist.

## Evidence

Screenshots captured:

- `reports/ivf-dashboard/01-ivf-dashboard-search.png`
- `reports/ivf-dashboard/02-ivf-dashboard-autocomplete.png`
- `reports/ivf-dashboard/03-ivf-dashboard-charts-top.png`
- `reports/ivf-dashboard/04-ivf-dashboard-clinical-sections.png`
- `reports/ivf-dashboard/05-ivf-dashboard-pregnancy-section.png`

Runtime evidence:

- `reports/ivf-dashboard/evidence.json`

## Build / Deployment

- `npm run build`: PASSED
- `pm2 restart tottech-one --update-env`: COMPLETED

