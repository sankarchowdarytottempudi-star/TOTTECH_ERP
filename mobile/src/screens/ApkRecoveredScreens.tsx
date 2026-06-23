import React, {
  useEffect,
  useState,
} from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { apiRequest } from "../api/client";
import {
  Field,
  Panel,
  PrimaryButton,
  SelectList,
  StatusMessage,
} from "../components/FormControls";
import ModuleCard from "../components/ModuleCard";
import ScreenShell from "../components/ScreenShell";
import TottechAIBadge from "../components/TottechAIBadge";
import { colors } from "../theme/colors";

type Feature = {
  title: string;
  detail: string;
  endpoint?: string;
};

type ScreenSpec = {
  title: string;
  subtitle: string;
  features: Feature[];
};

function RecoveredScreen({
  title,
  subtitle,
  features,
}: ScreenSpec) {
  const isAIScreen =
    /AI|SchoolGPT|TOTTECH AI/i.test(
      `${title} ${subtitle}`
    );

  return (
    <ScreenShell
      title={title}
      subtitle={subtitle}
    >
      {isAIScreen ? (
        <ModuleCard
          title="TOTTECH AI"
          detail="Gateway To Innovation - provider-neutral school intelligence with knowledge, action, approval, and observability layers."
          badge={
            <TottechAIBadge
              size="sm"
              showText
            />
          }
          featured
        />
      ) : null}
      {features.map((feature) => (
        (() => {
          const featureIsAI =
            /AI|SchoolGPT|TOTTECH AI/i.test(
              `${feature.title} ${feature.detail}`
            );

          return (
            <ModuleCard
              key={feature.title}
              title={feature.title}
              detail={
                feature.endpoint
                  ? `${feature.detail} API: ${feature.endpoint}`
                  : feature.detail
              }
              badge={
                featureIsAI ? (
                  <TottechAIBadge size="sm" />
                ) : undefined
              }
              featured={featureIsAI}
            />
          );
        })()
      ))}
    </ScreenShell>
  );
}

export function AcademicsScreen() {
  return (
    <RecoveredScreen
      title="Academic OS"
      subtitle="Classes, sections, exams, marks and timetable controls proven by the APK."
      features={[
        {
          title: "Classes and Sections",
          detail:
            "Live class, section and subject setup from ERP records.",
          endpoint: "/api/classes",
        },
        {
          title: "Question Paper Builder",
          detail:
            "Create and review question papers from mobile.",
          endpoint: "/api/question-papers",
        },
        {
          title: "Marks Grid",
          detail:
            "Spreadsheet-style marks entry with question-wise scoring.",
          endpoint: "/api/marks-entry/students",
        },
      ]}
    />
  );
}

export function AdmissionsScreen() {
  return (
    <RecoveredScreen
      title="Admissions Funnel"
      subtitle="Admissions readiness, student creation and school onboarding signals."
      features={[
        {
          title: "Admission Reports",
          detail:
            "Admission funnel reports and conversion status.",
          endpoint: "/api/reports-center",
        },
        {
          title: "Create Student",
          detail:
            "Adds a student to the active school context.",
          endpoint: "/api/students",
        },
        {
          title: "School Onboarding",
          detail:
            "Setup milestones from the onboarding API.",
          endpoint: "/api/onboarding",
        },
      ]}
    />
  );
}

export function AICommandCenterScreen() {
  const [prompt, setPrompt] =
    useState("");
  const [answer, setAnswer] =
    useState("");
  const [actionType, setActionType] =
    useState("CREATE_HOMEWORK");
  const [
    actionPrompt,
    setActionPrompt,
  ] = useState("");
  const [summary, setSummary] =
    useState<Record<string, any>>({});
  const [actions, setActions] =
    useState<any[]>([]);
  const [supportedActions, setSupportedActions] =
    useState<string[]>([]);
  const [saving, setSaving] =
    useState(false);
  const [message, setMessage] =
    useState("");
  const [tone, setTone] =
    useState<
      "info" | "success" | "error"
    >("info");

  const load = async () => {
    try {
      const [observability, actionPayload] =
        await Promise.all([
          apiRequest<any>(
            "/api/tottech-ai/observability"
          ),
          apiRequest<any>(
            "/api/tottech-ai/actions"
          ),
        ]);

      setSummary(
        observability.summary || {}
      );
      setActions(
        actionPayload.actions || []
      );
      setSupportedActions(
        actionPayload.supportedActions ||
          []
      );
    } catch (error) {
      show(
        error,
        "Failed to load TOTTECH AI."
      );
    }
  };

  useEffect(() => {
    void Promise.resolve().then(load);
  }, []);

  const ask = async () => {
    if (!prompt.trim()) {
      setMessage(
        "Ask a school or education question first."
      );
      setTone("error");
      return;
    }

    try {
      setSaving(true);
      setAnswer(
        "TOTTECH AI is grounding the answer..."
      );
      const result =
        await apiRequest<any>(
          "/api/tottech-ai/knowledge",
          {
            method: "POST",
            body: {
              prompt,
              include_internet: true,
            },
          }
        );
      setAnswer(
        result.answer ||
          result.response ||
          "No answer returned."
      );
      setMessage(
        "TOTTECH AI answered with ERP/knowledge grounding."
      );
      setTone("success");
      await load();
    } catch (error) {
      show(
        error,
        "TOTTECH AI query failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const requestAction = async () => {
    if (!actionPrompt.trim()) {
      setMessage(
        "Describe the school operation before requesting an AI action."
      );
      setTone("error");
      return;
    }

    try {
      setSaving(true);
      const result =
        await apiRequest<any>(
          "/api/tottech-ai/actions",
          {
            method: "POST",
            body: {
              action_type: actionType,
              prompt: actionPrompt,
              payload: {
                mobile_source: true,
                prompt: actionPrompt,
              },
            },
          }
        );
      setActionPrompt("");
      setMessage(
        `AI action queued for approval: ${result.action?.status || "PENDING_APPROVAL"}`
      );
      setTone("success");
      await load();
    } catch (error) {
      show(
        error,
        "AI action request failed."
      );
    } finally {
      setSaving(false);
    }
  };

  function show(
    error: unknown,
    fallback: string
  ) {
    setMessage(
      error instanceof Error
        ? error.message
        : fallback
    );
    setTone("error");
  }

  const suggestedPrompts = [
    "Which classes need intervention?",
    "Why is fee collection down?",
    "Generate a principal report for this week.",
    "What should I do at home this week?",
  ];

  return (
    <ScreenShell
      title="TOTTECH AI"
      subtitle="Gateway To Innovation - knowledge, safe actions, approvals and observability."
    >
      <View style={aiStyles.hero}>
        <TottechAIBadge
          size="lg"
          showText
        />
        <Text style={aiStyles.heroTitle}>
          School Brain for every decision.
        </Text>
        <Text style={aiStyles.heroText}>
          Answers are grounded in ERP records, academic year, RBAC, documents and event ledger context before actions move to approval.
        </Text>
        <View style={aiStyles.modeGrid}>
          {[
            "Executive",
            "Teacher",
            "Parent",
            "Student",
          ].map((mode) => (
            <View
              key={mode}
              style={aiStyles.modePill}
            >
              <Text style={aiStyles.modeText}>
                {mode}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {message ? (
        <StatusMessage
          message={message}
          tone={tone}
        />
      ) : null}

      <View style={aiStyles.metrics}>
        <ModuleCard
          title="Observed Events"
          value={
            summary.observedEvents || 0
          }
          detail="Prompt, source, provider, latency and failure evidence."
        />
        <ModuleCard
          title="Action Queue"
          value={actions.length}
          detail="Preview -> approval -> execute -> event ledger."
        />
      </View>

      <Panel>
        <Text style={aiStyles.panelTitle}>
          Conversation Workspace
        </Text>
        <View style={aiStyles.suggestions}>
          {suggestedPrompts.map(
            (item) => (
              <Pressable
                key={item}
                onPress={() =>
                  setPrompt(item)
                }
                style={aiStyles.suggestion}
              >
                <Text
                  style={
                    aiStyles.suggestionText
                  }
                >
                  {item}
                </Text>
              </Pressable>
            )
          )}
        </View>
        <Field
          label="Ask TOTTECH AI"
          value={prompt}
          multiline
          placeholder="Ask about ERP records, AP GO, CBSE, NCERT, fees, attendance or school operations"
          onChangeText={setPrompt}
        />
        <PrimaryButton
          label="Ask School Brain"
          loading={saving}
          onPress={ask}
        />
        {saving ? (
          <View style={aiStyles.thinking}>
            <Text
              style={aiStyles.thinkingText}
            >
              AI Brain Analyzing School Data
            </Text>
            <Text
              style={
                aiStyles.thinkingDetail
              }
            >
              Checking ERP, documents, academic year and official education context.
            </Text>
          </View>
        ) : null}
        {answer ? (
          <View style={aiStyles.answerCard}>
            <Text style={aiStyles.answerLabel}>
              TOTTECH AI Answer
            </Text>
            <Text style={aiStyles.answerText}>
              {answer}
            </Text>
            <View
              style={aiStyles.sourceRow}
            >
              {[
                "ERP",
                "Academic Year",
                "RBAC",
                "Event Ledger",
              ].map((source) => (
                <Text
                  key={source}
                  style={aiStyles.source}
                >
                  {source}
                </Text>
              ))}
            </View>
          </View>
        ) : null}
      </Panel>

      <Panel>
        <Text style={aiStyles.panelTitle}>
          Approval-Safe Action Layer
        </Text>
        <SelectList
          label="Safe Action"
          value={actionType}
          options={(
            supportedActions.length
              ? supportedActions
              : [
                  "CREATE_STUDENT",
                  "CREATE_TEACHER",
                  "CREATE_EXAM",
                  "CREATE_HOMEWORK",
                  "GENERATE_INVOICE",
                  "ASSIGN_TRANSPORT",
                  "ASSIGN_HOSTEL",
                  "ASSIGN_DINING",
                ]
          ).map((action) => ({
            label: action,
            value: action,
          }))}
          onChange={setActionType}
        />
        <Field
          label="Action Request"
          value={actionPrompt}
          multiline
          placeholder="Describe what AI should prepare. It will not write production data before approval."
          onChangeText={setActionPrompt}
        />
        <PrimaryButton
          label="Create Approval Request"
          loading={saving}
          onPress={requestAction}
        />
      </Panel>

      <View style={aiStyles.section}>
        <Text style={aiStyles.sectionTitle}>
          Pending Approvals
        </Text>
        {actions.slice(0, 12).map(
          (action) => (
            <ModuleCard
              key={String(action.id)}
              title={action.action_type}
              detail={[
                action.status,
                action.risk_level,
                action.module_name,
              ]
                .filter(Boolean)
                .join(" / ")}
              value={action.id}
              featured
            />
          )
        )}
      </View>
    </ScreenShell>
  );
}

export function AuditCenterScreen() {
  return (
    <RecoveredScreen
      title="Audit Center"
      subtitle="Audit trail, activity history and security evidence."
      features={[
        {
          title: "Event Ledger",
          detail:
            "Operational activity evidence and timeline fan-out.",
          endpoint: "/api/operations/audit-center",
        },
        {
          title: "Data Integrity",
          detail:
            "Academic year, workflow and pending approval checks.",
          endpoint: "/api/operations/data-integrity",
        },
      ]}
    />
  );
}

const aiStyles = StyleSheet.create({
  hero: {
    gap: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.black,
    padding: 18,
  },
  heroTitle: {
    color: colors.white,
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "900",
  },
  heroText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
  },
  modeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modePill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(242,209,138,0.36)",
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modeText: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: "900",
  },
  metrics: {
    gap: 12,
  },
  panelTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
  },
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestion: {
    maxWidth: "100%",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.goldPale,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  suggestionText: {
    color: colors.goldDeep,
    fontSize: 12,
    fontWeight: "900",
  },
  thinking: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.black,
    padding: 14,
  },
  thinkingText: {
    color: colors.goldSoft,
    fontSize: 14,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  thinkingDetail: {
    marginTop: 5,
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "700",
  },
  answerCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.surfaceWarm,
    padding: 15,
  },
  answerLabel: {
    color: colors.goldDeep,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  answerText: {
    marginTop: 8,
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "700",
  },
  sourceRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  source: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    color: colors.goldDeep,
    backgroundColor: colors.white,
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontSize: 10,
    fontWeight: "900",
    overflow: "hidden",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
});

export function AutomationEngineScreen() {
  return (
    <RecoveredScreen
      title="Automation Engine"
      subtitle="Workflow readiness, integrity checks and automation follow-up signals."
      features={[
        {
          title: "Workflow Builder",
          detail:
            "Create recovery tasks, reminders and operational follow-up queues.",
          endpoint: "/api/operations/data-integrity",
        },
        {
          title: "AI Recommendations",
          detail:
            "Recommendations stay grounded in ERP records before approval.",
          endpoint: "/api/tottech-ai/actions",
        },
      ]}
    />
  );
}

export function ConcessionsScreen() {
  return (
    <RecoveredScreen
      title="Concessions 360"
      subtitle="Owner approvals, waivers, audit logs and finance history."
      features={[
        {
          title: "Concession Requests",
          detail:
            "Review pending requests and concession status.",
          endpoint: "/api/concessions/360",
        },
        {
          title: "Approval Workflow",
          detail:
            "Approve or reject with audit evidence.",
          endpoint: "/api/finance/approvals",
        },
      ]}
    />
  );
}

export function ExamsScreen() {
  return (
    <RecoveredScreen
      title="Exams"
      subtitle="Schedules, question papers, invigilators and result readiness."
      features={[
        {
          title: "Exam Schedule",
          detail:
            "Academic-year aware exam schedule.",
          endpoint: "/api/exam-schedule",
        },
        {
          title: "Exam Types",
          detail:
            "Exam taxonomy from ERP setup.",
          endpoint: "/api/exam-types",
        },
        {
          title: "Question Bank",
          detail:
            "Reusable question bank and paper generation.",
          endpoint: "/api/question-bank",
        },
      ]}
    />
  );
}

export function FinanceScreen() {
  return (
    <RecoveredScreen
      title="Treasury Control"
      subtitle="Fee categories, invoice generation, collection health and approvals."
      features={[
        {
          title: "Fee Categories",
          detail:
            "School-specific fee categories and presets.",
          endpoint: "/api/fee-categories",
        },
        {
          title: "Invoice Generation",
          detail:
            "Generate invoices by scope and selected categories.",
          endpoint: "/api/finance/invoices",
        },
        {
          title: "Approval Ledger",
          detail:
            "Approvals, waivers and finance audit state.",
          endpoint: "/api/finance/approvals",
        },
      ]}
    />
  );
}

export function FinanceDrilldownScreen() {
  return (
    <RecoveredScreen
      title="Finance Drilldown"
      subtitle="Revenue trends, invoice exposure and fee recovery risks."
      features={[
        {
          title: "Revenue Health",
          detail:
            "Fee structures, collection and pending exposure.",
          endpoint: "/api/finance",
        },
        {
          title: "Outstanding Invoices",
          detail:
            "Review pending invoices and reminders.",
          endpoint: "/api/finance/invoices",
        },
      ]}
    />
  );
}

export function GovernanceScreen() {
  return (
    <RecoveredScreen
      title="Governance"
      subtitle="School-wise AI, WhatsApp, quotas and role activation controls."
      features={[
        {
          title: "Role Access",
          detail:
            "Database-driven permissions and role access.",
          endpoint: "/api/settings/roles",
        },
        {
          title: "Feature Flags",
          detail:
            "AI, WhatsApp and module activation per school.",
          endpoint: "/api/school-os/context",
        },
        {
          title: "Dining RBAC",
          detail:
            "Meal-plan access through DINING permissions.",
          endpoint: "/api/rbac/meal-plans",
        },
      ]}
    />
  );
}

export function HomeworkScreen() {
  return (
    <RecoveredScreen
      title="Homework"
      subtitle="Assignment targeting, submissions and parent status."
      features={[
        {
          title: "Assign Homework",
          detail:
            "Uses live class, section, subject and roster APIs.",
          endpoint: "/api/homework/submissions",
        },
        {
          title: "Submission Review",
          detail:
            "Submitted homework appears for teacher review.",
          endpoint: "/api/homework/submissions",
        },
      ]}
    />
  );
}

export function ImportCenterScreen() {
  return (
    <RecoveredScreen
      title="Import Center"
      subtitle="Bulk import jobs, status and data loading history."
      features={[
        {
          title: "Import Jobs",
          detail:
            "Bulk import status and upload operations.",
          endpoint: "/api/import",
        },
      ]}
    />
  );
}

export function KnowledgeBaseScreen() {
  return (
    <RecoveredScreen
      title="Knowledge Base"
      subtitle="Documents, policies, circulars and official source grounding."
      features={[
        {
          title: "Documents",
          detail:
            "Upload notes and index school knowledge for SchoolGPT.",
          endpoint: "/api/knowledge/documents",
        },
        {
          title: "SchoolGPT",
          detail:
            "Education knowledge engine with ERP-first grounding.",
          endpoint: "/api/schoolgpt",
        },
      ]}
    />
  );
}

export function NotificationsScreen() {
  return (
    <RecoveredScreen
      title="Notifications"
      subtitle="In-app alerts, push abstraction and parent communication."
      features={[
        {
          title: "Device Registration",
          detail:
            "Push readiness without provider lock-in.",
          endpoint: "/api/notifications/register",
        },
        {
          title: "Parent Notes",
          detail:
            "Track school communication from one workspace.",
          endpoint: "/api/parent/summary",
        },
      ]}
    />
  );
}

export function ObservabilityScreen() {
  return (
    <RecoveredScreen
      title="Observability"
      subtitle="Server, database, AI and operational health monitoring."
      features={[
        {
          title: "Operations Health",
          detail:
            "Live server, database and operational health.",
          endpoint: "/api/operations/health",
        },
        {
          title: "AI Observability",
          detail:
            "Prompt, answer, source, provider, cost and latency.",
          endpoint: "/api/tottech-ai/observability",
        },
      ]}
    />
  );
}

export function OnboardingScreen() {
  return (
    <RecoveredScreen
      title="Onboarding"
      subtitle="School setup readiness and implementation steps."
      features={[
        {
          title: "Setup Milestones",
          detail:
            "Branding, tenant and platform configuration state.",
          endpoint: "/api/onboarding",
        },
      ]}
    />
  );
}

export function PlatformScreen() {
  return (
    <RecoveredScreen
      title="Platform Center"
      subtitle="Tenant, branding and platform readiness."
      features={[
        {
          title: "Branding",
          detail:
            "TOTTECH ONE and TOTTECH AI brand settings.",
          endpoint: "/api/my-school-branding",
        },
        {
          title: "School OS Context",
          detail:
            "Active school, academic year and governance context.",
          endpoint: "/api/school-os/context",
        },
      ]}
    />
  );
}

export function ProfileScreen() {
  return (
    <RecoveredScreen
      title="Profile"
      subtitle="Identity, session, school assignment and role visibility."
      features={[
        {
          title: "School Context",
          detail:
            "Current active school and role permissions.",
          endpoint: "/api/school-os/context",
        },
      ]}
    />
  );
}

export function RecordDetailScreen() {
  return (
    <RecoveredScreen
      title="Record Detail"
      subtitle="Inspect selected records with timeline and Event Ledger evidence."
      features={[
        {
          title: "Student Detail",
          detail:
            "Student profile, history, risk and operational context.",
          endpoint: "/api/students/:studentIdentity",
        },
        {
          title: "Event Ledger",
          detail:
            "Audit-backed operational record history.",
          endpoint: "/api/operations/audit-center",
        },
      ]}
    />
  );
}

export function ReportsScreen() {
  return (
    <RecoveredScreen
      title="Reports Center"
      subtitle="Attendance, academic, fee, admissions, transport and hostel reports."
      features={[
        {
          title: "Report Exports",
          detail:
            "Export prepared from existing ERP report payloads.",
          endpoint: "/api/reports-center",
        },
        {
          title: "Academic Reports",
          detail:
            "Attendance, marks and assessment reporting.",
          endpoint: "/api/reports-center",
        },
      ]}
    />
  );
}

export function SchoolManagementScreen() {
  return (
    <RecoveredScreen
      title="School Management"
      subtitle="School list, active school switching and setup readiness."
      features={[
        {
          title: "School List",
          detail:
            "School list and active school switching.",
          endpoint: "/api/schools",
        },
        {
          title: "Switch School",
          detail:
            "Set active mobile school context.",
          endpoint:
            "/api/switch-school-os-context",
        },
      ]}
    />
  );
}

export function SettingsScreen() {
  return (
    <RecoveredScreen
      title="Settings"
      subtitle="Academic years, users, roles, branding, SMTP and governance."
      features={[
        {
          title: "Academic Years",
          detail:
            "June 1 to May 31 academic-year engine.",
          endpoint: "/api/academic-years",
        },
        {
          title: "User Management",
          detail:
            "Create users and assign school access.",
          endpoint: "/api/users",
        },
      ]}
    />
  );
}

export function StudentDetailScreen() {
  return (
    <RecoveredScreen
      title="Student Workspace"
      subtitle="Student 360 with attendance, marks, fees and school communication."
      features={[
        {
          title: "Student 360",
          detail:
            "Roster, profile, attendance signal and timeline.",
          endpoint:
            "/api/students/:studentIdentity",
        },
        {
          title: "Student Intelligence",
          detail:
            "Risk factors, interventions and AI grounding.",
          endpoint:
            "/api/students/:studentIdentity/enterprise-history",
        },
      ]}
    />
  );
}

export function TimetableScreen() {
  return (
    <RecoveredScreen
      title="Timetable"
      subtitle="Weekly academic schedule and teacher workload."
      features={[
        {
          title: "Weekly View",
          detail:
            "Tap a period card and move it with conflict detection.",
          endpoint: "/api/exam-schedule",
        },
        {
          title: "Teacher Assignment",
          detail:
            "Teacher chips and workload assignment.",
          endpoint: "/api/teachers",
        },
      ]}
    />
  );
}

export function UserManagementScreen() {
  return (
    <RecoveredScreen
      title="User Management"
      subtitle="Users, roles and assigned schools."
      features={[
        {
          title: "Create User",
          detail:
            "Create user access and assign school scope.",
          endpoint: "/api/users",
        },
        {
          title: "Role Permissions",
          detail:
            "Database-driven role permission model.",
          endpoint: "/api/settings/roles",
        },
      ]}
    />
  );
}

export function WarRoomScreen() {
  return (
    <RecoveredScreen
      title="War Room"
      subtitle="School health, analytics and role-based operations in one mobile workspace."
      features={[
        {
          title: "Command Center",
          detail:
            "School health, risk and operational control.",
          endpoint:
            "/api/schools/1/command-center",
        },
        {
          title: "Risk Scan",
          detail:
            "Attendance, fee recovery, admissions and report generation.",
          endpoint: "/api/school-os/context",
        },
      ]}
    />
  );
}

export function WorkflowBuilderScreen() {
  return (
    <RecoveredScreen
      title="Workflow Builder"
      subtitle="AI-safe workflows with preview, approval, execution and Event Ledger."
      features={[
        {
          title: "AI Action Preview",
          detail:
            "Actions cannot write production tables without approval.",
          endpoint: "/api/tottech-ai/actions",
        },
        {
          title: "Promotion Workflow",
          detail:
            "Academic-year aware promotion approval and execution.",
          endpoint: "/api/promotions",
        },
      ]}
    />
  );
}
