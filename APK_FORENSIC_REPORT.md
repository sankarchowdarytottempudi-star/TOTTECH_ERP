# APK Forensic Report

Date: 2026-06-05

APK analyzed:

- `/opt/recovery/downloads/app-release (3).apk`

Forensic workspace:

- `/opt/apk-forensics/tottech-one-latest-apk`

## Tooling Used

- APKTool 2.5.0
- JADX 1.5.5
- Android `aapt`
- `strings`
- Hermes compiler/disassembler for HBC bytecode version 98

JADX completed with 23 decompilation errors but still produced partial Java output. The APK is a React Native/Hermes application, so the authoritative application evidence came from:

- `assets/index.android.bundle`
- Hermes bytecode dump
- Manifest/badging inspection
- Resource extraction
- Raw string context scans

## APK Identity

```text
Package: com.mobile
Version code: 3
Version name: 1.2
Application label: TOTTECH ONE
Compile SDK: 36
Target SDK: 36
Min SDK: 24
Hermes bytecode: version 98
```

Permissions found:

- `android.permission.INTERNET`
- `android.permission.ACCESS_NETWORK_STATE`
- `android.permission.ACCESS_WIFI_STATE`
- `com.mobile.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`

Raw bundle evidence also contains Android permission strings from React Native/Permissions APIs, including camera, SMS, contacts, media and calendar permission constants. These do not prove runtime permission requests by themselves; they prove the permission library/constants were bundled.

## Screens Discovered

APK screen identifiers recovered from Hermes bytecode:

- `AICommandCenter`
- `AICommandCenterScreen`
- `AcademicsScreen`
- `AdmissionsScreen`
- `AttendanceScreen`
- `AuditCenterScreen`
- `AutomationEngineScreen`
- `ConcessionsScreen`
- `DashboardScreen`
- `DiningScreen`
- `ExamsScreen`
- `FinanceDrilldownScreen`
- `FinanceScreen`
- `GovernanceScreen`
- `HomeworkScreen`
- `HostelScreen`
- `ImportCenterScreen`
- `KnowledgeBaseScreen`
- `LoginScreen`
- `MarksScreen`
- `NotificationsScreen`
- `ObservabilityScreen`
- `OnboardingScreen`
- `OperationsScreen`
- `PlatformScreen`
- `ProfileScreen`
- `RecordDetailScreen`
- `ReportsScreen`
- `SchoolManagementScreen`
- `SettingsScreen`
- `StudentDetailScreen`
- `StudentsScreen`
- `TeachersScreen`
- `TimetableScreen`
- `TransportScreen`
- `UserManagementScreen`
- `WarRoomScreen`
- `WorkflowBuilderScreen`

Additional generic/framework identifiers were present:

- `InnerScreen`
- `TabsScreen`
- `Screen`
- `Attendance`
- `Finance`
- `Dining`
- `Transport`
- `Hostel`
- `Reports`
- `Governance`
- `WarRoom`
- `KnowledgeBase`
- `StudentDetail`
- `Students`
- `Teachers`
- `Dashboard`
- `Concessions`

## Menu and Navigation Evidence

The APK contains navigation and UX references for:

- Dashboard
- Mobile command center
- School switching
- Student workspace / Student 360
- Teacher workspace / Teacher 360
- Finance / Treasury Control
- Invoice generation
- Fee categories
- Concessions 360
- Dining attendance and meal plans
- Hostel administration
- Transport administration
- Reports Center
- War Room
- Audit Center
- Automation Engine
- Governance
- Observability
- AI Command Center
- Knowledge Base
- Notifications
- User Management
- Onboarding
- Platform Center

Recovered strings include:

- `AI NATIVE SCHOOL OS`
- `TOTTECH AI is syncing`
- `AI Command Center`
- `School-scoped assistant for attendance, finance, academics, students and leadership.`
- `Student Workspace`
- `Student intervention workflow`
- `Teacher Workflow Builder`
- `Treasury Control`
- `Invoice Generation Wizard`
- `Generating invoices...`
- `Select scope, select record, choose fee categories and generate invoices from mobile.`
- `Concessions 360`
- `Save Hostel Admin`
- `Dining Attendance Intelligence`
- `Offline-first daily marking`
- `Dining Attendance draft saved offline. It will sync when you are online.`
- `Automation Engine`
- `Audit trail, activity history and security evidence`
- `School-wise AI, WhatsApp, quotas and role activation controls.`
- `Workflow readiness, integrity checks and automation follow-up signals.`

## API References Discovered

Endpoint references proven by APK context scans:

- `/api/auth/login`
- `/api/fee-categories`
- `/api/school-os/context`
- `/api/teachers`
- `/api/concessions/360`
- `/api/exam-schedule`
- `/api/ai/usage`
- `/api/schools`
- `/api/attendance`
- `/api/brain`
- `/api/branding`
- `/api/classes`
- `/api/dashboard`
- `/api/dining-attendance-recovery`
- `/api/exam-types`
- `/api/finance/invoices`
- `/api/homework/submissions`
- `/api/hostels`
- `/api/import`
- `/api/knowledge/documents`
- `/api/marks-entry/exams`
- `/api/marks-entry/questions`
- `/api/marks-entry/students`
- `/api/my-school-branding`
- `/api/notifications/register`
- `/api/onboarding`
- `/api/operations/audit-center`
- `/api/operations/data-integrity`
- `/api/operations/health`
- `/api/parent/summary`
- `/api/question-bank`
- `/api/question-papers`
- `/api/rbac/meal-plans`
- `/api/reports-center`
- `/api/schoolgpt`
- `/api/search`
- `/api/sections`
- `/api/students/:studentIdentity`
- `/api/subjects`
- `/api/switch-school-os-context`
- `/api/transport`
- `/api/users`

## Feature References

### TOTTECH AI

Evidence:

- AI Command Center
- SchoolGPT
- AI usage
- AI observability
- AI role access
- AI features
- AI recommendations
- AI roster intelligence
- AI finance recommendations
- Knowledge Base
- School Brain
- Copilot references for principal, parent and teacher

### Student 360

Evidence:

- Student Workspace
- Student profile
- Student intervention workflow
- At-risk students
- Attendance signals
- Marks and fee history references
- Student intelligence and risk factors

### Teacher 360

Evidence:

- Teacher profile
- Teacher workflow builder
- Teacher assignments
- Teacher copilot enablement
- Teacher creation and selected-school assignment

### School 360

Evidence:

- School health
- School OS context
- School switching
- School management
- School onboarding readiness
- Command Center and War Room

### Dining

Evidence:

- Dining Attendance Intelligence
- Offline dining attendance drafts
- Meal plans
- Weekly menu
- Special diet restrictions
- Kitchen production planning
- Food wastage
- Served count
- Person-level meal participation

### Transport

Evidence:

- Transport Admin
- Vehicles and route visibility
- Assigned vehicles
- Transport reports
- Pickup/drop route context

### Hostel

Evidence:

- Save Hostel Admin
- Room capacity
- Room creation
- Room number
- Warden name/phone
- Student assigned to hostel
- Hostel type

### Governance

Evidence:

- AI/WhatsApp/role activation per school
- Governance limits
- Role access
- Feature flags
- Quotas
- Mobile governance controls

### War Room / Automation / Observability

Evidence:

- War Room
- Automation Engine
- Audit Center
- Observability
- Operational health
- Data-integrity checks
- Recovery tasks and reminders
- Rule cards and alerts

### Parent Portal and Notifications

Evidence:

- Parent notification architecture
- Parent Copilot
- Parent summary
- In-app alerts and push abstraction
- Push readiness without paid Expo services

## Mobile-Only Features

APK-specific mobile behavior references:

- Offline attendance drafts
- Offline dining drafts
- Mobile school switching
- Mobile global search
- Compact mobile roster and dashboard density
- Keyboard-aware forms
- Native push abstraction
- React Native CLI native folders, no Expo/EAS dependency

## Forensic Conclusion

The APK represents a significantly more advanced mobile product state than the recovered source. It proves a mobile-first command center architecture with School OS context, AI Command Center, finance invoice generation, concessions 360, dining offline recovery, operations audit/data-integrity endpoints, reports center, governance controls, and many mobile screens that were absent from the recovered mobile source.
