CREATE TABLE IF NOT EXISTS clinical_medical_knowledge_documents (
  id SERIAL PRIMARY KEY,
  category VARCHAR(120) NOT NULL,
  specialty VARCHAR(160),
  title VARCHAR(500) NOT NULL,
  source VARCHAR(255) NOT NULL,
  source_url TEXT,
  publication_date DATE,
  content TEXT NOT NULL,
  keywords JSONB DEFAULT '[]'::jsonb,
  citations JSONB DEFAULT '[]'::jsonb,
  confidence_score INTEGER DEFAULT 70,
  embedding JSONB,
  status VARCHAR(40) DEFAULT 'ACTIVE',
  created_by INTEGER,
  updated_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_clinical_medical_knowledge_lookup
  ON clinical_medical_knowledge_documents(category, specialty, status, is_deleted);

CREATE INDEX IF NOT EXISTS idx_clinical_medical_knowledge_title
  ON clinical_medical_knowledge_documents USING gin(to_tsvector('english', title || ' ' || content));

CREATE TABLE IF NOT EXISTS clinical_medical_ai_retrievals (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER,
  hospital_id INTEGER,
  branch_id INTEGER,
  clinic_id INTEGER,
  ai_log_id INTEGER,
  query TEXT NOT NULL,
  audience VARCHAR(80),
  intent VARCHAR(120),
  retrieved_documents JSONB DEFAULT '[]'::jsonb,
  hospital_records JSONB DEFAULT '{}'::jsonb,
  safety_flags JSONB DEFAULT '[]'::jsonb,
  created_by INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_clinical_medical_ai_retrievals_scope
  ON clinical_medical_ai_retrievals(tenant_id, hospital_id, branch_id, clinic_id, created_at DESC);

INSERT INTO clinical_medical_knowledge_documents (
  category, specialty, title, source, source_url, publication_date, content, keywords, citations, confidence_score
)
VALUES
(
  'guidelines',
  'General Medicine',
  'Clinical AI safety policy for TOTTECH Clinical Services',
  'TOTTECH Clinical Governance',
  NULL,
  CURRENT_DATE,
  'Clinical AI must assist licensed clinicians and hospital staff but must not independently diagnose, prescribe, or replace physician judgment. Emergency symptoms such as chest pain, severe breathlessness, stroke signs, loss of consciousness, severe bleeding, seizures, pregnancy emergency symptoms, or critically abnormal vitals must be escalated immediately.',
  '["clinical safety","ai governance","emergency escalation"]'::jsonb,
  '["Internal clinical governance policy"]'::jsonb,
  95
),
(
  'lab_tests',
  'Pathology',
  'CBC interpretation basics',
  'TOTTECH Clinical Knowledge Base',
  NULL,
  CURRENT_DATE,
  'Complete blood count interpretation should consider hemoglobin, WBC count, platelet count, differential count, age, sex, symptoms, pregnancy status, infection signs, medication history, and previous results. Critical abnormal values require immediate clinician review. AI should explain abnormal patterns but should not diagnose without clinical correlation.',
  '["CBC","hemoglobin","WBC","platelets","critical results"]'::jsonb,
  '["Hospital lab interpretation policy"]'::jsonb,
  78
),
(
  'diseases',
  'Internal Medicine',
  'Hypertension patient education and clinical review',
  'TOTTECH Clinical Knowledge Base',
  NULL,
  CURRENT_DATE,
  'Blood pressure around 160/100 mmHg is significantly above normal and should be reviewed by a clinician, especially if repeated or associated with headache, chest pain, breathlessness, neurological symptoms, pregnancy, kidney disease, diabetes, or cardiovascular disease. Trend comparison with previous readings is clinically useful.',
  '["hypertension","blood pressure","patient education","vitals trend"]'::jsonb,
  '["General hypertension education reference"]'::jsonb,
  78
),
(
  'diseases',
  'Endocrinology',
  'Diabetes longitudinal monitoring',
  'TOTTECH Clinical Knowledge Base',
  NULL,
  CURRENT_DATE,
  'Diabetes follow-up commonly reviews HbA1c trends, fasting and post-prandial glucose, kidney function, lipid profile, blood pressure, weight, current medicines, adherence, hypoglycemia history, foot symptoms, eye screening, and cardiovascular risk. AI can summarize trends and highlight missing follow-up data.',
  '["diabetes","HbA1c","glucose","follow-up"]'::jsonb,
  '["General diabetes monitoring reference"]'::jsonb,
  78
),
(
  'drugs',
  'Pharmacology',
  'Medication safety response policy',
  'TOTTECH Clinical Knowledge Base',
  NULL,
  CURRENT_DATE,
  'Medication answers must include indication context, contraindication caution, interaction check requirement, pregnancy and renal/hepatic caution when relevant, and clinician/pharmacist review. Dose guidance must be treated as informational and not as an independent prescription.',
  '["drug safety","interactions","dosage","pregnancy","renal adjustment"]'::jsonb,
  '["Hospital medication safety policy"]'::jsonb,
  90
)
ON CONFLICT DO NOTHING;
