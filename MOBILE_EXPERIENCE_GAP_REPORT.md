# TOTTECH ONE Mobile Experience Gap Report

Generated: 2026-06-06

## Scope

This audit treats `/opt/recovery/downloads/app-release (3).apk` as the latest known mobile product specification, not just a feature inventory.

Backend, APIs, database models, and route counts are out of scope for this sprint. The focus is visible mobile experience parity.

## APK Evidence

APK analyzed:

- Path: `/opt/recovery/downloads/app-release (3).apk`
- Package: `com.mobile`
- Version code: `3`
- Version name: `1.2`
- Label: `TOTTECH ONE`
- Bundle: `assets/index.android.bundle`

High-signal UX strings found in the APK bundle:

- `AI Command Center`
- `AI Brain Analyzing School Data`
- `AI SCHOOL OS`
- `Conversational ERP Intelligence`
- `SchoolGPT`
- `Finance Command Center`
- `Finance Intelligence`
- `Invoice Generation Wizard`
- `Dining Attendance Intelligence`
- `Monthly Cost Tracking`
- `Food Wastage Analytics`
- `Hostel Command`
- `Hostel Occupancy Report`
- `Transport Admin`
- `Route utilization`
- `War Room`
- `Audit trail, activity history and security evidence`
- `Workflow Builder`
- `Governance`
- `Offline mode active`
- `Draft saved offline. It will sync when you are online.`

## Current Mobile Source Evidence

Current source inspected:

- `/opt/tottech-one/mobile/src/theme/colors.ts`
- `/opt/tottech-one/mobile/src/components/ScreenShell.tsx`
- `/opt/tottech-one/mobile/src/components/ModuleCard.tsx`
- `/opt/tottech-one/mobile/src/components/FormControls.tsx`
- `/opt/tottech-one/mobile/src/screens/DashboardScreen.tsx`
- `/opt/tottech-one/mobile/src/screens/ApkRecoveredScreens.tsx`
- `/opt/tottech-one/mobile/src/screens/DiningScreen.tsx`
- `/opt/tottech-one/mobile/src/screens/TransportScreen.tsx`
- `/opt/tottech-one/mobile/src/screens/HostelScreen.tsx`

The current app already has many modules wired, but most screens use a generic list/card/form structure. It does not consistently reproduce the command-center language and executive UX present in the APK.

## Scores Before Implementation

| Area | APK Target | Current State | Score |
|---|---|---:|---:|
| APK UX Score | Executive school OS | Generic module cards and form stacks | 42% |
| Navigation Parity | Workspace/command-center navigation | Routes exist, hierarchy feels flat | 56% |
| Interaction Parity | Quick actions, approval states, thinking states, offline states | Basic buttons and forms | 38% |
| Visual Parity | Premium black, white, gold command center | Navy/blue-tinted admin UI | 44% |
| Animation Parity | Loading/thinking/reveal states | Minimal/no motion | 18% |
| Premium Feel Parity | Apple-quality executive SaaS | Functional but CRUD-like | 36% |
| TOTTECH AI Experience | ChatGPT Enterprise feel | Basic prompt/answer form | 40% |
| Operations Modules | Dining/transport/hostel command centers | Forms with small metric cards | 39% |

Overall mobile experience parity before implementation: **39%**

## Top Experience Gaps

1. Dashboard lacks executive command-center composition.
2. Shared shell does not provide a premium school context header.
3. Cards are generic and do not communicate command-center priority.
4. Module screens feel like CRUD forms instead of operational centers.
5. TOTTECH AI lacks ChatGPT Enterprise-style workspace framing.
6. AI thinking state exists only as text, not as a premium state.
7. Approval/action cards are not visually distinguished.
8. Dining lacks meal/cost/inventory/wastage command-center summary at the top.
9. Transport lacks route utilization, assignment, and risk summary framing.
10. Hostel lacks occupancy/vacancy/allocation command-center framing.
11. Navigation is complete but not experiential.
12. There is no consistent black/white/gold-only mobile theme.
13. Status messages are text-only and visually weak.
14. Forms lack premium grouping and clear section hierarchy.
15. Quick actions are not consistently exposed.
16. Recent activity/timeline language is weak.
17. AI grounding/source indicators are under-emphasized.
18. Offline/draft states from the APK are not carried through the current experience.
19. Premium spacing and shadows are inconsistent.
20. Screens do not consistently feel like parts of one School Operating System.

## Screenshot Capture Status

Before screenshots were requested, but no Android emulator, connected device, or graphical display session is available in this VPS context. Therefore screenshots cannot be captured honestly from runtime in this environment. Evidence is based on APK bundle strings, app source inspection, TypeScript/build verification, and the generated APK artifact.

## Implementation Direction

Do not rebuild the mobile app from scratch. Preserve current TOTTECH ONE branding and source structure, then improve visible experience by:

- Replacing navy/blue admin styling with premium black, white, and gold.
- Upgrading shared shell, cards, panels, inputs, and buttons.
- Making Dashboard, Operations, TOTTECH AI, Dining, Transport, and Hostel feel like command centers.
- Adding AI thinking, source/grounding, approval, risk, recent activity, and quick action visual patterns.
- Keeping forms functional, but framing them under executive operations context.
