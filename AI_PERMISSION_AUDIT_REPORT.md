# AI Permission Audit Report

## Scope
- School module permissions
- User module permissions
- Role permissions
- Menu permissions
- Feature permissions
- API permissions

## Findings
- AI access was previously evaluated too loosely.
- School-level AI enablement and user-level AI enablement were not enforced as an intersection.
- Users could reach AI pages and UI entry points even when AI was disabled at the user level.

## Effective Access Rule

```text
Effective AI Access = School Enabled AI ∩ User Enabled TOTTECH_AI ∩ User Enabled SCHOOLGPT
```

## Status
- School Access: enforced
- User Access: enforced
- Effective Access: enforced
- PASS / FAIL: PASS after remediation

