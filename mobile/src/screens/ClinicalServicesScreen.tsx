import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ModuleCard from "../components/ModuleCard";
import ScreenShell from "../components/ScreenShell";
import { colors } from "../theme/colors";

type Props = {
  navigation: {
    navigate: (route: string) => void;
  };
  route: {
    params?: {
      lockedToClinical?: boolean;
    };
  };
};

const baseUrl =
  "https://erp.tottechsolutions.com/clinical-services";

const modules = [
  ["Dashboard", "", "Executive clinical command center for patient flow, revenue, risk and alerts."],
  ["Patients", "/patients", "Patient registration, patient search and Patient 360."],
  ["Appointments", "/appointments", "Scheduling, queue status and follow-ups."],
  ["Doctors", "/doctors", "Doctor availability, consultations and clinical workspaces."],
  ["HMS Core", "/hms", "OP, IP, ER, ICU, OT, billing and insurance."],
  ["IVF & Fertility", "/ivf", "Couples, cycles, embryology, cryo, transfer and outcomes."],
  ["Laboratory", "/hms/lab-orders", "Lab orders, samples, results and reports."],
  ["Radiology", "/hms/radiology", "Radiology orders, upload, reporting and PACS workflow."],
  ["Pharmacy", "/pharmacy", "Prescription queue, inventory, sales and purchases."],
  ["Finance", "/finance", "Revenue, payments, accounts and analytics."],
  ["HRMS", "/hrms", "Employee operations, leave, payroll, credentialing and compliance."],
  ["Provident Fund (PF)", "/hrms/pf", "EPFO guidance and employee PF identifiers."],
  ["Reports", "/reports", "Operational exports and reporting center."],
  ["Analytics", "/analytics", "Executive, financial and clinical analytics."],
  ["Security", "/security", "Users, roles, permissions, audit and governance."],
] as const;

export default function ClinicalServicesScreen({
  navigation,
  route,
}: Props) {
  const lockedToClinical =
    route.params?.lockedToClinical === true;

  const open = (path: string) => {
    void Linking.openURL(`${baseUrl}${path}`);
  };

  return (
    <ScreenShell
      title="Clinical Services"
      subtitle="Hospital, IVF, pharmacy, lab, radiology, billing and clinical command center."
      workspace="clinical"
    >
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>
          Hospital Operating System
        </Text>
        <Text style={styles.heroTitle}>
          Clinical workspaces open from one platform app.
        </Text>
        <Text style={styles.heroText}>
          Use this mobile launchpad for patient flow, doctor work, IVF operations, diagnostics, pharmacy, finance, analytics and governance.
        </Text>
      </View>

      {!lockedToClinical ? (
        <ModuleCard
          title="Back to TOTTECH ONE"
          detail="Switch to the school enterprise workspace."
          value="ONE"
          onPress={() =>
            navigation.navigate("Dashboard")
          }
        />
      ) : null}

      {modules.map(([title, path, detail]) => (
        <ModuleCard
          key={title}
          title={title}
          detail={detail}
          value="Open"
          onPress={() => open(path)}
        />
      ))}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.black,
    padding: 18,
  },
  eyebrow: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "900",
  },
  heroText: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
  },
});
