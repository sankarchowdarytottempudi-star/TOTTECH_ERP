# TOTTECH AI KNOWLEDGE ENGINE REMEDIATION

Date: 2026-06-06

## Current Behavior

Before this remediation, TOTTECH AI could return diagnostic/source-registry style responses:

- ERP grounding counts
- Source trace
- NCERT/CBSE/UGC/AICTE source lists
- Official-source registry entries

That was not acceptable for user-facing AI because the assistant did not consistently answer the user question first.

## Correct Behavior

TOTTECH AI must behave like an assistant:

1. Search the knowledge base.
2. If a stored answer exists, return it first.
3. If no stored answer exists, search official sources and governed internet sources.
4. Extract a direct answer.
5. Return a concise response using:
   - Answer
   - Summary
   - Source
   - Confidence
   - Retrieved Date
6. Store the answer in the knowledge base for future reuse.

## Knowledge Flow

User question
-> normalized question
-> question hash
-> `ai_knowledge_base` lookup
-> official/web lookup if not found
-> answer extraction
-> response formatting
-> storage
-> observability logging

## Storage Flow

New table:

- `ai_knowledge_base`

Stored fields:

- `question`
- `normalized_question`
- `question_hash`
- `answer`
- `summary`
- `keywords`
- `sources`
- `embedding`
- `confidence`
- `mode`
- `school_id`
- `academic_year`
- `retrieved_at`
- `last_verified`
- `usage_count`
- `created_by`

## Retrieval Flow

TOTTECH AI now checks `ai_knowledge_base` before searching the internet.

When a match is found:

- `usage_count` increments.
- The answer is returned in the same user-facing format.
- The response includes `Knowledge Base: Returned from saved TOTTECH AI knowledge base.`

## Response Format

The user-facing response now follows:

```text
Answer
...

Summary
...

Source
...

Confidence
...

Retrieved Date
...
```

It does not return ERP grounding/source trace as the final answer.

## Implemented

- Added `ai_knowledge_base` Prisma model.
- Added production SQL table/indexes.
- Added knowledge-base retrieval before web search.
- Added answer storage after fresh lookup.
- Added confidence, source, date, mode, school, and academic-year storage.
- Added answer-first response formatting.
- Hardened floating TOTTECH AI chat bubble contrast and text wrapping.
- Verified the SSC exam question:
  - First request searched/saved.
  - Second request returned from knowledge base.

## Verified Example

Question:

```text
What is the SSC board public exam start date for academic year 2025-2026?
```

Answer:

```text
For Andhra Pradesh SSC/Class 10 Public Examinations for the 2025-2026 academic year, the public exams start on Monday, 16 March 2026.
```

Stored in:

- `ai_knowledge_base`

Source:

- Board of Secondary Education Andhra Pradesh
- BSEAP SSC Time Table 2026 PDF

## Remaining Implementation Plan

Next hardening steps:

- Add semantic search and embeddings for near-duplicate questions.
- Add source freshness policy and scheduled re-verification.
- Add an AI Knowledge Base admin screen.
- Add user-selectable response modes:
  - Executive
  - Teacher
  - Parent
  - Student
  - Governance
- Add explicit official-source confidence scoring.
