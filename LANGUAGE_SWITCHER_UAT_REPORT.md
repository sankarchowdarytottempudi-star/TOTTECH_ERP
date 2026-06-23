# Language Switcher UAT Report

## Objective
Validate that the language selector is available globally and that language selection can persist through the normal application lifecycle.

## Implementation Status
- Language selector added to the main web header.
- Compact selector added to the clinical shell header.
- Selected language is written to browser storage, cookie, and user profile.

## Validation Evidence
- Build validation completed successfully.
- Login and profile APIs were updated to persist the language selection.

## Pending Runtime Checks
- Refresh persistence in browser
- Logout/login persistence in browser
- Role switch persistence
- Hospital switch persistence

## Outcome
- Implementation complete
- Runtime UAT still required in browser sessions
