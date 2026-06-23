# TOTTECH AI AGENTIC PLATFORM REPORT

Generated: 2026-06-05  
Target: `https://erp.tottechsolutions.com`  
Implementation path: `/opt/tottech-one`

## Result

TOTTECH AI is now structured as an agentic platform with three layers:

1. Knowledge Layer
2. Action Layer
3. Approval Layer

It remains provider-neutral and does not directly integrate Gemini or any external model provider.

## Knowledge Layer

API:

`/api/tottech-ai/knowledge`

Priority:

```text
ERP -> DOCUMENT -> OFFICIAL -> INTERNET
```

Seeded knowledge sources:

```text
TOTTECH ONE ERP Database
TOTTECH ONE Event Ledger
TOTTECH ONE Document Storage
Andhra Pradesh Commissionerate of School Education
Andhra Pradesh Board of Secondary Education
CBSE
NCERT
UGC
AICTE
Ministry of Education, Government of India
Governed Internet Search
```

Internet search is present as a governed disabled source. It remains disabled until `TOTTECH_AI_ENABLE_WEB_SEARCH=true` and a source/search policy are approved.

Validation:

```text
knowledge_sources_status=200
knowledge_sources=11
priority=ERP>DOCUMENT>OFFICIAL>INTERNET
internetSearchEnabled=false
knowledge_query_status=200
source_count=10
```

## Action Layer

API:

```text
/api/tottech-ai/actions
/api/tottech-ai/actions/[id]
```

Supported actions:

```text
CREATE_STUDENT
CREATE_TEACHER
CREATE_STAFF
CREATE_EXAM
CREATE_EXAM_SCHEDULE
CREATE_HOMEWORK
CREATE_QUESTION_PAPER
CREATE_ROUTE
CREATE_HOSTEL
CREATE_DINING_PLAN
GENERATE_INVOICE
ASSIGN_TRANSPORT
ASSIGN_HOSTEL
ASSIGN_DINING
CREATE_TIMETABLE
GENERATE_REPORTS
```

Safety rule:

```text
Action request creation produces a preview only.
No production table is written before approval and execution.
```

Smoke validation:

```text
action_request_status=201
action_status=PENDING_APPROVAL
writes=ai_action_requests,event_ledger
writes_before_approval=false
supported_actions=16
```

Student preview safety validation:

```text
student_preview_status=201
student_count_before=1003
student_count_after=1003
preview_status=PENDING_APPROVAL
requested_writes=students
writes_before_approval=false
```

## Approval Layer

APIs:

```text
/api/tottech-ai/actions/[id]/approve
/api/tottech-ai/actions/[id]/execute
```

Flow:

```text
Request -> Preview -> Approval -> Execute -> Event Ledger
```

Validation used `CREATE_HOMEWORK`, which has no recovered production table, so execution was preserved as an operational AI action/event-ledger record:

```text
action_approve_status=200
approved_status=APPROVED
action_execute_status=200
executed_status=EXECUTED
event_id=7
operationalRecord=true
```

## Observability

API:

`/api/tottech-ai/observability`

Tracked:

```text
Prompt
Answer excerpt
Source trace
Provider/router
User
School
Cost
Latency
Actions executed
Approvals
Failures
Event Ledger entries
```

Validation:

```text
observability_status=200
observed_events=6
knowledge_queries=1
approvals=2
action_status_rows=2
```

Final database counters:

```text
students                    1003
ai_knowledge_sources        11
ai_knowledge_queries        1
ai_action_requests          2
ai_action_approvals         2
ai_action_executed          1
ai_action_rejected          1
ai_action_pending_approval  0
ai_observability_events     6
ai_usage_logs               2
event_ledger                9
new_ai_permissions          5
```

## RBAC

New permissions:

```text
AI.KNOWLEDGE
AI.ACTION_REQUEST
AI.APPROVE_ACTION
AI.EXECUTE_ACTION
AI.VIEW_OBSERVABILITY
```

These were granted to `SUPER_ADMIN`. Non-admin access remains blocked until role profiles are approved.

## Validation Commands

```text
npx prisma validate      PASS
npx prisma generate      PASS
npm run build            PASS, 158 routes
npx eslint new AI files  PASS
PM2 restart              PASS
HTTPS smoke tests        PASS
```

Final route check:

```text
/api/tottech-ai/knowledge       200
/api/tottech-ai/actions         200
/api/tottech-ai/observability   200
/dashboard                      200
```

## Remaining Work

- Build the UI screens for action approvals, observability dashboards, and education source management.
- Implement real document ingestion/indexing for policies, homework, question papers, reports, and circulars.
- Enable governed official-source search only after choosing a compliant search provider.
- Map non-admin AI permissions to approved school roles.
- Add real production tables for homework, dining plans, and timetables if those workflows must become first-class ERP records.
