import { NextResponse } from "next/server";

import {
  recordClinicalAudit,
  requireClinicalContext,
} from "@/lib/clinical/context";
import { answerMedicalAIQuestion } from "@/lib/clinical/medical-ai";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request
) {
  const auth =
    await requireClinicalContext(
      request
    );

  if (auth.response) {
    return auth.response;
  }

  const context = auth.context!;
  const body =
    await request.json();
  const prompt = String(
    body.prompt || ""
  ).trim();

  if (!prompt) {
    return NextResponse.json(
      {
        error:
          "Ask a clinical question first.",
      },
      {
        status: 400,
      }
    );
  }

  const aiResponse =
    await answerMedicalAIQuestion({
      context,
      prompt,
      patientId:
        body.patientId ??
        body.patient_id ??
        null,
      audience:
        body.audience ??
        body.mode ??
        null,
    });

  const rows =
    await prisma.$queryRawUnsafe<
      { id: number }[]
    >(
      `
      INSERT INTO clinical_ai_logs (
        tenant_id,
        clinic_id,
        hospital_id,
        branch_id,
        user_id,
        prompt,
        answer,
        confidence_score,
        data_sources,
        reasoning_summary,
        metadata,
        created_by,
        updated_by,
        created_at,
        updated_at,
        is_deleted
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11::jsonb,$5,$5,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,false)
      RETURNING id
      `,
      context.tenantId,
      context.clinicId,
      context.hospitalId,
      context.branchId,
      context.user.id ?? null,
      prompt,
      aiResponse.answer,
      aiResponse.confidenceScore,
      JSON.stringify(
        aiResponse.dataSourcesUsed
      ),
      aiResponse.reasoningSummary,
      JSON.stringify({
        ...aiResponse.metadata,
        model: "MedGPT Clinical RAG",
        safety:
          "Clinical review required. AI must not independently diagnose or prescribe.",
      })
    );

  const aiLogId =
    Number(rows[0]?.id) || null;

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO clinical_medical_ai_retrievals (
      tenant_id,
      hospital_id,
      branch_id,
      clinic_id,
      ai_log_id,
      query,
      audience,
      intent,
      retrieved_documents,
      hospital_records,
      safety_flags,
      created_by,
      created_at,
      is_deleted
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11::jsonb,$12,CURRENT_TIMESTAMP,false)
    `,
    context.tenantId,
    context.hospitalId,
    context.branchId,
    context.clinicId,
    aiLogId,
    prompt,
    aiResponse.metadata.audience,
    aiResponse.metadata.intent,
    JSON.stringify(
      aiResponse.metadata
        .retrievedKnowledge
    ),
    JSON.stringify(
      aiResponse.metadata
        .hospitalRecordSummary
    ),
    JSON.stringify(
      aiResponse.metadata.safetyFlags
    ),
    context.user.id ?? null
  );

  await recordClinicalAudit(context, {
    moduleName: "ai",
    action: "ask_medical_gpt",
    entityType: "clinical_ai_log",
    entityId: aiLogId,
    summary:
      "MedGPT Clinical answered a role-aware question",
    payload: {
      confidenceScore:
        aiResponse.confidenceScore,
      dataSourcesUsed:
        aiResponse.dataSourcesUsed,
      audience:
        aiResponse.metadata.audience,
      intent: aiResponse.metadata.intent,
      patientId:
        aiResponse.metadata.patientId,
      safetyFlags:
        aiResponse.metadata.safetyFlags,
    },
  });

  return NextResponse.json({
    answer: aiResponse.answer,
    confidenceScore:
      aiResponse.confidenceScore,
    dataSourcesUsed:
      aiResponse.dataSourcesUsed,
    reasoningSummary:
      aiResponse.reasoningSummary,
    logId: aiLogId,
    audience:
      aiResponse.metadata.audience,
    intent: aiResponse.metadata.intent,
    patientId:
      aiResponse.metadata.patientId,
    safetyFlags:
      aiResponse.metadata.safetyFlags,
    retrievedKnowledge:
      aiResponse.metadata
        .retrievedKnowledge,
  });
}
