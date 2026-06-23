# CHANGE IMPACT REPORT - MOBILE APK REBUILD 20260605

## Summary

The recovered React Native mobile source was upgraded to match the TOTTECH ONE web theme and to expose live ERP workflows instead of static placeholder cards.

The Android project wrapper was generated, build tooling was installed, and a release APK was built and published under the ERP downloads path.

## Affected Mobile Files

- `mobile/App.tsx`
- `mobile/app.json`
- `mobile/package.json`
- `mobile/package-lock.json`
- `mobile/index.js`
- `mobile/babel.config.js`
- `mobile/metro.config.js`
- `mobile/android/**`
- `mobile/src/api/client.ts`
- `mobile/src/theme/colors.ts`
- `mobile/src/components/ScreenShell.tsx`
- `mobile/src/components/ModuleCard.tsx`
- `mobile/src/components/FormControls.tsx`
- `mobile/src/screens/LoginScreen.tsx`
- `mobile/src/screens/DashboardScreen.tsx`
- `mobile/src/screens/AcademicsScreen.tsx`
- `mobile/src/screens/StudentsScreen.tsx`
- `mobile/src/screens/TeachersScreen.tsx`

## Affected Web/Public Files

- `public/downloads/app-release.apk`
- `public/downloads/tottech-one-mobile-20260605.apk`

## Rebuilt Mobile Capabilities

- TOTTECH ONE navy/gold mobile theme
- Responsive card layout with stable padding
- Keyboard-safe scroll shell
- Production login through `/api/auth/login`
- Mobile session persistence using ERP cookie storage
- Students card list
- Create student with class and section assignment
- Hard delete student through database API
- Teachers card list
- Create teacher/staff with class and section assignment
- Hard delete teacher through database API
- Create exams
- Create exam types
- Create exam schedules
- Create question papers question-by-question
- Assign homework
- Enter marks by schedule, student, and question

## Affected APIs

- `POST /api/auth/login`
- `GET /api/students`
- `POST /api/students`
- `DELETE /api/students/[id]`
- `GET /api/teachers`
- `POST /api/teachers`
- `DELETE /api/teachers/[id]`
- `GET /api/roster`
- `GET /api/subjects`
- `GET /api/exams`
- `POST /api/exams`
- `GET /api/exam-types`
- `POST /api/exam-types`
- `GET /api/exam-schedule`
- `POST /api/exam-schedule`
- `GET /api/question-papers`
- `POST /api/question-papers`
- `GET /api/homework`
- `POST /api/homework`
- `GET /api/marks-entry/students`
- `GET /api/marks-entry/questions`
- `POST /api/marks-entry`

## Database Impact

No new database migration was added in this pass.

Mobile writes use the existing production APIs and therefore affect:

- `students`
- `student_year_enrollments`
- `teachers`
- `teacher_class_assignments`
- `exams`
- `exam_types`
- `exam_schedule`
- `question_papers`
- `question_bank`
- `question_paper_questions`
- `homework_assignments`
- `student_marks_entry`
- `marks`
- `event_ledger`

## RBAC Impact

No mobile-specific RBAC bypass was added. Mobile operations call the same authenticated ERP APIs as web.

## Academic Year Impact

Mobile academic operations are routed through web APIs that resolve the active/current academic year.

## Timeline and Event Ledger Impact

Mobile-created exams, schedules, papers, homework, student/teacher records, and marks flow through the same API event recording paths used by web.

## AI Grounding Impact

Mobile academic and roster data creation now contributes to the same ERP records used for TOTTECH AI grounding.

## Build Environment Added

- OpenJDK 17 JDK
- Android command-line tools
- Android SDK platform 35 and 36
- Android build-tools 35 and 36
- Android NDK `27.1.12297006`
- CMake `3.22.1`
- React Native Android wrapper under `mobile/android`

## Validation Completed

- `npm run typecheck` in `mobile`: passed
- `npx react-native config`: Android project detected
- `./android/gradlew -p android :app:assembleRelease --no-daemon`: passed
- APK manifest check: package `com.tottechonemobile`
- APK visible label: `TOTTECH ONE`
- APK internet permission: present
- Live download URL: `https://erp.tottechsolutions.com/downloads/app-release.apk`
- Live HTTP check: `200 OK`

## Published APK

- Primary: `https://erp.tottechsolutions.com/downloads/app-release.apk`
- Versioned copy: `https://erp.tottechsolutions.com/downloads/tottech-one-mobile-20260605.apk`
- SHA-256: `449f3fcb1b8ddbd2a971b3b26d6084b20286b4605aa9824a9084cb2b6f552910`

## Known Technical Debt

- APK is signed with the generated debug signing config used by the React Native template. A production Play Store keystore should be created before public/commercial distribution.
- Full parity with every web module is not complete; this pass prioritized the requested live school-management and academic workflows.
- No emulator/device runtime test was performed on the VPS because no Android device/emulator is attached.
- React Native 0.83 warns that `newArchEnabled=false` is ignored; the app builds with the new architecture.
