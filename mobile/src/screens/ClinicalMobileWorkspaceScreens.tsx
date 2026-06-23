import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";

import ModuleCard from "../components/ModuleCard";
import ScreenShell from "../components/ScreenShell";
import TottechAIBadge from "../components/TottechAIBadge";
import { colors } from "../theme/colors";

const CLINICAL_BASE_URL =
  "https://erp.tottechsolutions.com/clinical-services";

function openClinical(path = "") {
  Linking.openURL(`${CLINICAL_BASE_URL}${path}`);
}

function ClinicalHero({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.hero}>
      <Text style={styles.eyebrow}>
        {eyebrow}
      </Text>
      <Text style={styles.heroTitle}>
        {title}
      </Text>
      <Text style={styles.heroText}>
        {text}
      </Text>
    </View>
  );
}

function Metrics({
  items,
}: {
  items: Array<[string, string]>;
}) {
  return (
    <View style={styles.metricGrid}>
      {items.map(([label, value]) => (
        <View key={label} style={styles.metric}>
          <Text style={styles.metricLabel}>
            {label}
          </Text>
          <Text style={styles.metricValue}>
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function ClinicalHomeScreen() {
  return (
    <ScreenShell
      title="Clinical Command Center"
      subtitle="Hospital, IVF, diagnostics, pharmacy, billing and operational intelligence."
      workspace="clinical"
    >
      <ClinicalHero
        eyebrow="Hospital Operating System"
        title="One mobile cockpit for clinical operations."
        text="Patient flow, doctor work, diagnostics, pharmacy, finance, alerts and AI governance stay separated from TOTTECH ONE school data."
      />
      <Metrics
        items={[
          ["Patients", "Live"],
          ["Appointments", "Today"],
          ["Revenue", "Tracked"],
          ["AI", "Review"],
        ]}
      />
      <ModuleCard
        title="Patient 360"
        detail="Registration, visits, documents, lab, radiology, prescriptions, billing, claims and timeline."
        value="360"
        featured
        onPress={() => openClinical("/patients")}
      />
      <ModuleCard
        title="Executive Dashboard"
        detail="Clinical, operational and financial KPIs for hospital leadership."
        value="OS"
        onPress={() => openClinical("")}
      />
      <ModuleCard
        title="Today's Schedule"
        detail="Appointments, queues, doctors, procedures, diagnostics and follow-ups."
        onPress={() =>
          openClinical("/appointments")
        }
      />
    </ScreenShell>
  );
}

export function ClinicalPatientsScreen() {
  return (
    <ScreenShell
      title="Patients"
      subtitle="Patient registration, search, timeline and 360 view."
      workspace="clinical"
    >
      <ClinicalHero
        eyebrow="Patient Management"
        title="Patient lifecycle from registration to follow-up."
        text="Use this area for patient search, appointments, queue status, visits, documents and care history."
      />
      <ModuleCard
        title="Register Patient"
        detail="Create demographics, identifiers, contact details and first visit context."
        value="Create"
        featured
        onPress={() =>
          openClinical("/patients")
        }
      />
      <ModuleCard
        title="Patient Search"
        detail="Find patients by name, phone, UHID, branch, department, doctor or visit status."
        value="Search"
        onPress={() => openClinical("/patients")}
      />
      <ModuleCard
        title="Patient Timeline"
        detail="Clinical events, orders, notes, invoices, claims, pharmacy and diagnostics history."
        onPress={() => openClinical("/patients")}
      />
      <ModuleCard
        title="Appointments & Queue"
        detail="Book appointments, monitor waiting patients and manage follow-ups."
        onPress={() => openClinical("/appointments")}
      />
    </ScreenShell>
  );
}

export function ClinicalCareScreen() {
  return (
    <ScreenShell
      title="Clinical Care"
      subtitle="OP, IP, ER, ICU, OT, doctors and nursing operations."
      workspace="clinical"
    >
      <ClinicalHero
        eyebrow="Care Delivery"
        title="Every care area as a mobile workspace."
        text="Doctors, nurses, reception and operations teams get role-aware access to patient workflows."
      />
      <ModuleCard
        title="Outpatient"
        detail="Consultations, prescriptions, procedures, lab orders, radiology orders and follow-ups."
        value="OP"
        featured
        onPress={() => openClinical("/hms/op")}
      />
      <ModuleCard
        title="Inpatient"
        detail="Admissions, beds, wards, nursing station, care plans, discharge and IP billing."
        value="IP"
        onPress={() => openClinical("/hms/ip")}
      />
      <ModuleCard
        title="Emergency, ICU & OT"
        detail="Triage, critical monitoring, surgery scheduling, anesthesia and recovery."
        value="ER"
        onPress={() => openClinical("/hms/er")}
      />
      <ModuleCard
        title="Doctor Workspace"
        detail="Assigned patients, notes, orders, procedures, credentialing and performance."
        onPress={() => openClinical("/doctors")}
      />
    </ScreenShell>
  );
}

export function ClinicalOperationsScreen() {
  return (
    <ScreenShell
      title="Clinical Operations"
      subtitle="IVF, lab, radiology, pharmacy, inventory, billing and insurance."
      workspace="clinical"
    >
      <ClinicalHero
        eyebrow="Operations Center"
        title="Clinical service lines and revenue workflows."
        text="Operational modules stay grouped by healthcare domain instead of appearing inside the school ERP workspace."
      />
      <ModuleCard
        title="IVF & Fertility"
        detail="Couples, assessments, cycles, stimulation, retrieval, embryology, cryo and transfer."
        value="IVF"
        featured
        onPress={() => openClinical("/ivf")}
      />
      <ModuleCard
        title="Laboratory & Radiology"
        detail="Orders, samples, results, approvals, imaging, PACS and DICOM archive."
        value="Dx"
        onPress={() => openClinical("/operations#lab")}
      />
      <ModuleCard
        title="Pharmacy & Inventory"
        detail="Sales, dispensing, stock, low stock, expiry, purchases, GRN and assets."
        onPress={() => openClinical("/pharmacy")}
      />
      <ModuleCard
        title="Billing, Insurance & Finance"
        detail="OP/IP billing, packages, payments, refunds, claims, settlements and revenue dashboard."
        onPress={() => openClinical("/billing-revenue")}
      />
    </ScreenShell>
  );
}

export function ClinicalAIScreen() {
  return (
    <ScreenShell
      title="TOTTECH AI Clinical"
      subtitle="Clinical AI, IVF AI, finance AI and governance-safe assistance."
      workspace="clinical"
    >
      <ClinicalHero
        eyebrow="AI Command Center"
        title="Clinical review required for every AI-assisted workflow."
        text="TOTTECH AI can summarize, search, recommend and prepare action previews, but it must not diagnose or prescribe independently."
      />
      <View style={styles.aiBand}>
        <TottechAIBadge size="lg" showText />
      </View>
      <ModuleCard
        title="Clinical AI"
        detail="Patient summaries, source-cited answers, risk signals and care workflow assistance."
        value="AI"
        featured
        onPress={() => openClinical("/ai")}
      />
      <ModuleCard
        title="IVF AI"
        detail="Cycle analytics, outcome trends, embryology summaries and protocol insights."
        onPress={() => openClinical("/ai")}
      />
      <ModuleCard
        title="AI Governance"
        detail="Approvals, usage tracking, audit, provider health and role-based access."
        onPress={() => openClinical("/ai")}
      />
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
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 6,
  },
  eyebrow: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
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
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metric: {
    flexGrow: 1,
    minWidth: "45%",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 14,
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  metricValue: {
    marginTop: 5,
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  aiBand: {
    alignItems: "flex-start",
  },
});
