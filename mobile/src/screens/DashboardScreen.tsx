import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { RootStackParamList } from "../../App";
import { apiRequest } from "../api/client";
import ModuleCard from "../components/ModuleCard";
import ScreenShell from "../components/ScreenShell";
import TottechAIBadge from "../components/TottechAIBadge";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<
  RootStackParamList,
  "Dashboard"
>;

type RouteName = keyof RootStackParamList;

type DashboardPayload = {
  schools?: number;
  students?: number;
  teachers?: number;
  classes?: number;
  sections?: number;
  attendance?: number;
  subjects?: number;
  marksEntries?: number;
  campusHealth?: number;
};

const primaryModules: Array<{
  title: string;
  route: RouteName;
  detail: string;
  value?: string;
  featured?: boolean;
}> = [
  {
    title: "TOTTECH AI",
    route: "AICommandCenter",
    detail:
      "ChatGPT-style school brain with ERP grounding, source citations and approval-safe actions.",
    value: "AI",
    featured: true,
  },
  {
    title: "War Room",
    route: "WarRoom",
    detail:
      "Executive command center for school risk, health, audit and operational attention.",
    value: "OS",
  },
  {
    title: "Students",
    route: "Students",
    detail:
      "Student 360, timelines, attendance, finance, hostel, transport and dining context.",
    value: "360",
  },
  {
    title: "Teachers",
    route: "Teachers",
    detail:
      "Teacher 360, attendance, workload, academic history and classroom operations.",
    value: "360",
  },
];

const operatingModules: Array<{
  title: string;
  route: RouteName;
  detail: string;
}> = [
  {
    title: "Dining Command",
    route: "Dining",
    detail:
      "Meal attendance, production, inventory, cost tracking and wastage intelligence.",
  },
  {
    title: "Transport Command",
    route: "Transport",
    detail:
      "Route utilization, assignments, trip events and pickup/drop visibility.",
  },
  {
    title: "Hostel Command",
    route: "Hostel",
    detail:
      "Occupancy, allocations, attendance, movement history and warden operations.",
  },
  {
    title: "Finance Control",
    route: "Finance",
    detail:
      "Invoices, fee categories, concessions, revenue and recovery risk.",
  },
  {
    title: "Academics",
    route: "Academics",
    detail:
      "Exams, schedules, question papers, homework, marks and timetables.",
  },
  {
    title: "Operations",
    route: "Operations",
    detail:
      "Governance, automation, observability, audit center and platform controls.",
  },
];

export default function DashboardScreen({
  navigation,
}: Props) {
  const [data, setData] =
    useState<DashboardPayload | null>(null);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    apiRequest<DashboardPayload>(
      "/api/dashboard"
    )
      .then((payload) => {
        if (mounted) {
          setData(payload);
        }
      })
      .catch(() => {
        if (mounted) {
          setData(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const kpis = useMemo(
    () => [
      [
        "Health",
        loading
          ? "..."
          : `${data?.campusHealth ?? 0}%`,
      ],
      [
        "Students",
        loading
          ? "..."
          : String(data?.students ?? 0),
      ],
      [
        "Teachers",
        loading
          ? "..."
          : String(data?.teachers ?? 0),
      ],
      [
        "Classes",
        loading
          ? "..."
          : String(data?.classes ?? 0),
      ],
    ],
    [data, loading]
  );

  const navigateTo = (route: RouteName) => {
    const tabRouteMap: Partial<
      Record<RouteName, string>
    > = {
      Students: "SchoolStudents",
      Academics: "SchoolAcademics",
      Operations: "SchoolOperations",
      AICommandCenter: "SchoolAI",
    };
    const state = navigation.getState?.();
    const tabRoute = tabRouteMap[route];

    const routeNames =
      state?.routeNames as
        | readonly string[]
        | undefined;

    if (tabRoute && routeNames?.includes(tabRoute)) {
      navigation.navigate(tabRoute as never);
      return;
    }

    navigation.navigate(route as never);
  };

  return (
    <ScreenShell
      title="School Command Center"
      subtitle="Executive school operating system for intelligence, action and control."
    >
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroEyebrow}>
              Live School OS
            </Text>
            <Text style={styles.heroTitle}>
              One view for every school decision.
            </Text>
            <Text style={styles.heroText}>
              AI insights, operational KPIs, recent activity and safe action workflows stay connected to the active school and academic year context.
            </Text>
          </View>
          <TottechAIBadge size="lg" />
        </View>
        <View style={styles.kpiGrid}>
          {kpis.map(([label, value]) => (
            <View
              key={label}
              style={styles.kpi}
            >
              <Text style={styles.kpiLabel}>
                {label}
              </Text>
              <Text style={styles.kpiValue}>
                {value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.quickActions}>
        {[
          ["Ask AI", "AICommandCenter"],
          ["Attendance", "Attendance"],
          ["Reports", "Reports"],
          ["Notify", "Notifications"],
        ].map(([label, route]) => (
          <Pressable
            key={label}
            onPress={() =>
              navigateTo(route as RouteName)
            }
            style={({ pressed }) => [
              styles.quickAction,
              pressed &&
                styles.quickActionPressed,
            ]}
          >
            {label === "Ask AI" ? (
              <TottechAIBadge size="sm" />
            ) : null}
            <Text style={styles.quickText}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Priority Workspaces
        </Text>
        {primaryModules.map((module) => (
          <ModuleCard
            key={module.title}
            title={module.title}
            detail={module.detail}
            value={module.value}
            featured={module.featured}
            badge={
              module.featured ? (
                <TottechAIBadge size="sm" />
              ) : undefined
            }
            onPress={() =>
              navigateTo(module.route)
            }
          />
        ))}
      </View>

      <View style={styles.insightCard}>
        <Text style={styles.insightLabel}>
          Live School Metrics
        </Text>
        <Text style={styles.insightTitle}>
          {data?.schools ?? 0} schools, {data?.sections ?? 0} sections, {data?.attendance ?? 0} attendance records
        </Text>
        <Text style={styles.insightText}>
          These figures are loaded from the ERP dashboard API for the selected school and academic year. Use the sidebar or bottom tabs to drill into each operating center.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Operating Centers
        </Text>
        {operatingModules.map((module) => (
          <ModuleCard
            key={module.title}
            title={module.title}
            detail={module.detail}
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
  hero: {
    gap: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.black,
    padding: 18,
    shadowColor: colors.shadow,
    shadowOpacity: 0.24,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 8,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  heroEyebrow: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  heroTitle: {
    marginTop: 8,
    color: colors.white,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
  },
  heroText: {
    marginTop: 8,
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "600",
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  kpi: {
    flexBasis: "47%",
    flexGrow: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(242,209,138,0.32)",
    backgroundColor: "rgba(255,255,255,0.07)",
    padding: 12,
  },
  kpiLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  kpiValue: {
    marginTop: 4,
    color: colors.goldSoft,
    fontSize: 17,
    fontWeight: "900",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  quickAction: {
    flexGrow: 1,
    minWidth: "46%",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.surfaceWarm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: "center",
    gap: 6,
  },
  quickActionPressed: {
    opacity: 0.82,
  },
  quickText: {
    color: colors.goldDeep,
    fontSize: 13,
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
  insightCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.surfaceWarm,
    padding: 16,
  },
  insightLabel: {
    color: colors.goldDeep,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  insightTitle: {
    marginTop: 6,
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  insightText: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "700",
  },
});
