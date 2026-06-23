# Platform Admin Report

Status: Implemented for branding resolution

Behavior:
- SUPER_ADMIN with `active_school_id=all` or no selected school receives platform branding.
- SUPER_ADMIN with a selected school receives that school branding.
- Non-super-admin users receive assigned school branding.

Platform branding preserved for:
- Public/login pages
- Platform/all-schools mode
- Super-admin context

