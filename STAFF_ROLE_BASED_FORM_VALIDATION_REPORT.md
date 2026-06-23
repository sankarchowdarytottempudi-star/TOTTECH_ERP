# Staff Role-Based Form Validation Report

Generated: 2026-06-22

## Scope

Implemented role-based dynamic behavior for `HR -> Staff Master`.

Staff type options:

- Teaching
- Non-Teaching

## Files Changed

- `app/hrms/[module]/page.tsx`
- `app/api/hrms/[module]/route.ts`
- `prisma/schema.prisma`
- `prisma/migrations/202606221245_staff_master_role_based_fields/migration.sql`

## Database Changes

Migration applied: `202606221245_staff_master_role_based_fields`

Added nullable role-based Staff Master fields:

- `staff_type`
- `staff_category`
- `sub_category`
- `class_assignment`
- `section_assignment`
- `subject_assignment`
- `assignment_type`
- `is_class_teacher`
- `teaching_experience`
- `teacher_gap_history`
- `previous_organization`
- `reporting_manager`
- `work_location`
- `joining_date`
- `salary_details`

Indexes added:

- `idx_hr_staff_master_staff_type`
- `idx_hr_staff_master_sub_category`

Database verification:

```text
assignment_type
class_assignment
is_class_teacher
reporting_manager
salary_details
section_assignment
staff_type
sub_category
subject_assignment
work_location
```

## UI Behavior

### Teaching Staff

When `Staff Type = Teaching`, the form shows:

- Department
- Class Assignment
- Section Assignment
- Subject Assignment
- Academic Year
- Class Teacher
- Assignment Type
- Teaching Experience
- Previous School
- Educational Qualification
- Teacher Gap History

### Non-Teaching Staff

When `Staff Type = Non-Teaching`, the form hides:

- Class Assignment
- Section Assignment
- Subject Assignment
- Assignment Type
- Academic Year assignment controls
- Class Teacher flag

It shows:

- Staff Category
- Sub Category
- Designation
- Reporting Manager
- Work Location
- Joining Date
- Salary Details
- PF Details
- Bank Details
- Experience
- Previous Organization

## Persistence Validation

Created validation records through the live HRMS API after PM2 restart.

Teaching record:

```text
id=9
staff_type=Teaching
class_assignment=Class 6
section_assignment=A
subject_assignment=Science
assignment_type=Subject Teacher
is_class_teacher=true
sub_category=NULL
```

Non-teaching record:

```text
id=10
staff_type=Non-Teaching
sub_category=Accountant
designation=Accountant
reporting_manager=Principal
work_location=Accounts Office
class_assignment=NULL
section_assignment=NULL
subject_assignment=NULL
assignment_type=NULL
is_class_teacher=false
```

Validation records were archived after testing:

```text
9|Teaching|UATTeaching|f|Class 6|
10|Non-Teaching|UATNonTeaching|f||Accountant
```

## Browser Validation

Playwright browser validation was executed against:

```text
http://127.0.0.1:3000/hrms/staff-directory
```

Result after switching Staff Type to Non-Teaching:

```json
{
  "teachingVisibleAfterSwitch": 0,
  "nonTeachingVisibleAfterSwitch": 1,
  "academicClassVisibleAfterSwitch": 0,
  "subCategoryVisibleAfterSwitch": 1,
  "errors": []
}
```

## Screenshot Evidence

- `evidence/staff-role-form/staff-master-teaching.png`
- `evidence/staff-role-form/staff-master-non-teaching.png`

## Build / Deployment Validation

Commands completed successfully:

```text
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 restart tottech-one --update-env
pm2 save
```

Build result:

```text
Compiled successfully
Finished TypeScript
Generated static pages: 361/361
```

PM2 process:

```text
tottech-one: online
```

## Final Status

PASS

Teaching staff now see academic assignment fields.

Non-teaching staff do not see or persist academic assignment fields.

