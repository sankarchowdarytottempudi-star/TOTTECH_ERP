import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { RootStackParamList } from "../../App";
import ModuleCard from "../components/ModuleCard";
import ScreenShell from "../components/ScreenShell";
import TottechAIBadge from "../components/TottechAIBadge";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Operations"
>;

type RouteName = keyof RootStackParamList;

const modules: Array<{
  title: string;
  route: RouteName;
  detail: string;
  value?: string;
  ai?: boolean;
}> = [
  {
    title: "War Room",
    route: "WarRoom",
    detail:
      "Risk, school health, intervention queues and executive attention.",
    value: "Live",
  },
  {
    title: "Automation Engine",
    route: "AutomationEngine",
    detail:
      "Workflow builder, recovery tasks and AI-assisted follow-up.",
    value: "Flow",
  },
  {
    title: "Governance Center",
    route: "Governance",
    detail:
      "Dynamic roles, feature flags, quotas, AI school limits and access controls.",
    value: "RBAC",
  },
  {
    title: "Audit Center",
    route: "AuditCenter",
    detail:
      "Event ledger, activity history, approvals and security evidence.",
    value: "Audit",
  },
  {
    title: "AI Cost Dashboard",
    route: "AICommandCenter",
    detail:
      "Usage, provider cost, prompt logs, fallback routing and approvals.",
    value: "AI",
    ai: true,
  },
  {
    title: "Observability",
    route: "Observability",
    detail:
      "API health, data integrity, AI health checks and operational telemetry.",
    value: "Ops",
  },
  {
    title: "Platform Center",
    route: "Platform",
    detail:
      "Tenant, branding, onboarding and commercial readiness controls.",
    value: "SaaS",
  },
  {
    title: "Workflow Builder",
    route: "WorkflowBuilder",
    detail:
      "Approval-safe school automations with audit-ready execution.",
    value: "Build",
  },
];

export default function OperationalScreens({
  navigation,
}: Props) {
  const navigateTo = (route: RouteName) => {
    navigation.navigate(route as never);
  };

  return (
    <ScreenShell
      title="Operations Center"
      subtitle="Governance, automation, observability and TOTTECH AI control plane."
    >
      <View style={styles.command}>
        <TottechAIBadge
          size="lg"
          showText
        />
        <Text style={styles.commandTitle}>
          Provider-neutral AI. Approval-safe actions. Audit-ready operations.
        </Text>
        <Text style={styles.commandText}>
          Every school operation should move through preview, approval, execution and event ledger evidence.
        </Text>
        <View style={styles.statusGrid}>
          {[
            ["AI Health", "Watch"],
            ["RBAC", "Dynamic"],
            ["Audits", "Ledger"],
            ["Actions", "Approval"],
          ].map(([label, value]) => (
            <View
              key={label}
              style={styles.statusCard}
            >
              <Text style={styles.statusLabel}>
                {label}
              </Text>
              <Text style={styles.statusValue}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Control Plane
        </Text>
        {modules.map((module) => (
          <ModuleCard
            key={module.title}
            title={module.title}
            detail={module.detail}
            value={module.value}
            featured={module.ai}
            badge={
              module.ai ? (
                <TottechAIBadge size="sm" />
              ) : undefined
            }
            onPress={() =>
              navigateTo(module.route)
            }
          />
        ))}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  command: {
    gap: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.black,
    padding: 18,
  },
  commandTitle: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "900",
  },
  commandText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statusCard: {
    flexBasis: "47%",
    flexGrow: 1,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(242,209,138,0.35)",
    backgroundColor: "rgba(255,255,255,0.07)",
    padding: 12,
  },
  statusLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  statusValue: {
    marginTop: 4,
    color: colors.goldSoft,
    fontSize: 15,
    fontWeight: "900",
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
