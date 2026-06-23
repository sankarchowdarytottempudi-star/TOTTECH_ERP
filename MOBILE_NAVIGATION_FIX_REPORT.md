# MOBILE NAVIGATION FIX REPORT

## Issue
The mobile app navigation surface was too narrow and behaved like a trimmed launcher. After opening a module and returning to the menu, users were not seeing the full enterprise navigation set, and PF was missing entirely from the sidebar.

## Root Cause
- The shared mobile menu catalog in `mobile/src/components/ScreenShell.tsx` only exposed a partial subset of web modules.
- PF and HRMS were not exposed in the main school workspace menu.
- The clinical workspace also lacked a direct PF entry, forcing users to hunt for it instead of seeing it in the sidebar.

## Fix Applied
- Expanded the school workspace menu to include:
  - Operations
  - Homework
  - Question Bank
  - Question Papers
  - Exams
  - Exam Schedule
  - Marks Entry
  - Invoices
  - Payments
  - Concessions
  - Expenses
  - Promotion Center
  - Communication
  - PTM
  - Complaints
  - Suggestions
  - Leave Management
  - Payroll
  - HRMS
  - Provident Fund (PF)
  - Roles
  - Permissions
  - School Setup
  - SchoolGPT
  - Student 360
  - Teacher 360
  - War Room
  - AI Insights
- Expanded the clinical workspace menu to include:
  - HRMS
  - Provident Fund (PF)
  - Finance
  - Inventory
  - Reports
  - Analytics
  - OPD / IPD / ICU / OT
  - Embryology
- Added PF directly to the mobile clinical launchpad and the school HRMS launchpad.

## Files Changed
- `mobile/src/components/ScreenShell.tsx`
- `mobile/src/screens/ClinicalServicesScreen.tsx`

## Validation
- `npm run typecheck` in `mobile/` passed successfully after the navigation update.

## Remaining Runtime Work
- Device/browser screenshot validation still needs to be collected from a live mobile build.
- Mobile menu parity should be rechecked in Android/iOS runtime to confirm the expanded catalog appears as expected.
