# TOTTECH Clinical Services - Phase 1 Enterprise Architecture

Generated: 2026-06-06

## System Vision

Product: TOTTECH Clinical Services

Product type: Enterprise Healthcare Platform

Supported operating models:

- Multi Specialty Hospital
- IVF Center
- Fertility Clinic
- Diagnostic Center
- Pharmacy
- Day Care Hospital
- Corporate Hospital Chain

Supported deployment models:

- Multi-tenant SaaS
- Contabo
- AWS
- Azure
- GCP
- On premise

## Tenant Hierarchy

```text
TOTTECH Platform
|
+-- Tenant / Hospital Group
    |
    +-- Hospital
        |
        +-- Branch
            |
            +-- Department
```

Every clinical operational record must carry:

- `tenant_id`
- `hospital_id`
- `branch_id`

Legacy compatibility:

- Existing `organizations` continue to map to tenants.
- Existing `clinics` continue to map to branches.
- Existing `clinic_id` remains for compatibility while new code enforces `hospital_id` and `branch_id`.

## Database Strategy

Recommended architecture:

- Single PostgreSQL database
- Tenant isolation by `tenant_id`
- Hospital isolation by `hospital_id`
- Branch isolation by `branch_id`

Reason:

- Lower operating cost
- Easier backups and migrations
- Faster SaaS onboarding
- Easier reporting across branches for authorized users

## Master Data Groups

Implemented foundation tables:

- `clinical_tenants`
- `hospitals`
- `branches`
- `departments`
- `clinical_roles`
- `clinical_user_profiles`
- `clinical_menu_items`

Current seeded hierarchy:

- Tenant: TOTTECH Clinical Services
- Hospital: TOTTECH Clinical Services Hospital Network
- Branch: TOTTECH IVF Center

## User Management

Clinical users are mapped through:

- `users`
- `clinical_user_profiles`
- `clinical_roles`

Required user scope:

- `tenant_id`
- `hospital_id`
- `branch_id`
- `department_id`
- clinical role
- clinical permissions

Current clinical super admin:

- `CS-Superadmin@erp.com`
- Role: Clinical Super Admin
- Branch: TOTTECH IVF Center

## RBAC

Seeded clinical roles:

- Clinical Super Admin
- Organization Admin
- Clinic Admin
- Receptionist
- Doctor
- IVF Specialist
- Embryologist
- Nurse
- Lab Technician
- Radiologist
- Pharmacist
- Billing Executive
- Patient Support
- Auditor

Permission dimensions:

- Create
- Read
- Update
- Delete
- Approve
- Export
- AI Access
- Field Permissions

## Authentication

Current implemented login:

- Username/password through existing TOTTECH ONE auth
- Clinical routing by `projectType=CLINICAL`
- Clinical emails route to `/clinical-services`

Planned methods:

- Mobile OTP
- Email OTP
- MFA
- SSO

## Security

Security foundation table:

- `clinical_security_settings`

Configured defaults:

- At rest: AES-256 target
- In transit: TLS 1.3 target
- Patient record authorization required
- Audit capture includes user, action, timestamp, IP, device, browser, old value, new value

## Audit

Clinical audit table:

- `clinical_audit_events`

Audit now stores:

- `tenant_id`
- `hospital_id`
- `branch_id`
- `clinic_id`
- user
- module
- action
- entity
- payload
- timestamp

## File Storage

Foundation table:

- `clinical_file_objects`

Target storage:

- S3 compatible object storage

Supported document classes:

- PDF
- JPG
- PNG
- DICOM
- DOCX
- IVF images
- scans
- lab reports

## API Architecture

Current runtime:

- Next.js route handlers under `/api/clinical/*`

Registered API service foundation:

- `clinical_api_services`

Future target:

- NestJS API Gateway
- Service split by domain

Registered service domains:

- Auth Service
- Patient Service
- Appointment Service
- Doctor Service
- Lab Service
- Radiology Service
- Pharmacy Service
- Billing Service
- Insurance Service
- Referral Service
- IVF Service
- AI Service
- Notification Service

## Event Architecture

Foundation table:

- `clinical_event_definitions`

Registered events:

- PatientCreated
- AppointmentBooked
- InvoiceGenerated
- LabResultReady
- EmbryoCreated
- InsuranceApproved

Future broker:

- RabbitMQ

## Cache

Future cache:

- Redis

Target use:

- Sessions
- Doctor availability
- Reports
- Frequently accessed data

## Notification Engine

Foundation table:

- `clinical_notification_templates`

Target channels:

- WhatsApp
- SMS
- Email
- Push Notification

## Report Engine

Target formats:

- PDF
- Excel
- CSV

Foundation:

- `clinical_reports`

## TOTTECH AI Clinical

Foundation tables:

- `clinical_ai_logs`
- `clinical_ai_governance_policies`

Modules:

- Clinical AI
- Patient Summary
- IVF AI
- Outcome Analytics
- Revenue AI
- Financial Analytics
- Inventory AI
- Forecasting

Restrictions:

- Must never diagnose independently.
- Must never prescribe independently.
- Must always show: Clinical review required before patient action.

## Integrations

Foundation table:

- `clinical_integration_connectors`

Registered integration targets:

- FHIR R4
- FHIR R5
- HL7
- DICOM
- PACS
- ABHA
- Ayushman Bharat

## Observability

Foundation table:

- `clinical_observability_config`

Target stack:

- Prometheus
- Grafana
- ELK
- OpenTelemetry

## Backup And Disaster Recovery

Foundation table:

- `clinical_backup_policies`

Target:

- Daily backup
- Weekly full backup
- Monthly archive
- RPO: 15 minutes
- RTO: 1 hour

## High Availability

Target:

- 99.99% uptime

Future production architecture:

- Load-balanced app services
- Managed PostgreSQL or replicated PostgreSQL
- Object storage replication
- Queue-backed async workflows
- Automated failover runbooks

## DevOps

Target:

- Docker
- Docker Compose
- Kubernetes
- GitHub Actions

Current runtime:

- PM2
- Nginx
- PostgreSQL
- Next.js

## Performance Targets

Target scale:

- 100 hospitals
- 1000 branches
- 10000 concurrent users
- 10 million patients

## Design System

Theme:

- Gold: `#D4AF37`
- Navy Blue: `#0B1F3A`
- White: `#FFFFFF`

## Master Navigation

Clinical navigation foundation supports:

- Dashboard
- Patients
- Appointments
- Doctors
- OP
- IP
- ER
- ICU
- OT
- IVF
- Laboratory
- Radiology
- Pharmacy
- Inventory
- Insurance
- Referrals
- Billing
- Finance
- HR
- Reports
- Analytics
- AI
- Settings

Current navigation implemented:

- Dashboard
- Patient Management
- Appointments
- Doctors
- Front Desk
- OPD
- IPD
- IVF Management
- Laboratory
- Radiology
- Pharmacy
- Billing
- Inventory
- Reports
- Document Center
- Workflow Designer
- Form Builder
- TOTTECH AI Clinical
- Administration
- Settings

## Phase 1 Acceptance Status

Implemented in current codebase:

- Tenant isolation foundation
- Hospital and branch hierarchy
- Clinical context enforcement
- RBAC foundation
- Security settings foundation
- Audit logging foundation
- API service registry
- Backup policy registry
- Observability registry
- AI governance foundation
- Integration framework registry

External infrastructure not installed in this phase:

- NestJS API Gateway runtime
- RabbitMQ runtime
- Redis runtime
- Prometheus/Grafana/ELK/OpenTelemetry runtime
- Kubernetes/GitHub Actions

These are registered in the foundation model and should be provisioned during infrastructure hardening.
