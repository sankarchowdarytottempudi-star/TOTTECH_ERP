import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
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
import { colors } from "../theme/colors";

type IdValue = number | string;
type ClassRow = {
  id: IdValue;
  class_name?: string;
};
type SectionRow = {
  id: IdValue;
  class_id?: IdValue;
  section_name?: string;
};
type StudentRow = {
  id: IdValue;
  name?: string;
  first_name?: string;
  last_name?: string;
  admission_number?: string;
  class_name?: string;
  section_name?: string;
};
type RosterPayload = {
  classes?: ClassRow[];
  sections?: SectionRow[];
  students?: StudentRow[];
};
type DiningPayload = {
  diningAttendance?: any[];
  mealPlans?: any[];
  weeklyMenus?: any[];
};
type DiningOperationsPayload = {
  inventoryItems?: any[];
  purchases?: any[];
  consumptionLogs?: any[];
  productionSheets?: any[];
  wastageLogs?: any[];
  mealAssignments?: any[];
  analytics?: Record<string, unknown>;
};

const today = () =>
  new Date().toISOString().slice(0, 10);

const emptyAttendance = {
  class_id: "",
  section_id: "",
  student_id: "",
  meal_type: "LUNCH",
  attendance_date: today(),
  status: "PRESENT",
  remarks: "",
};

const emptyMealPlan = {
  plan_name: "",
  meal_type: "LUNCH",
  price: "",
};

const emptyInventory = {
  item_name: "",
  unit: "kg",
  current_quantity: "",
  reorder_level: "",
};

const emptyPurchase = {
  item_id: "",
  quantity: "",
  unit_cost: "",
  vendor_name: "",
};

const emptyProduction = {
  production_date: today(),
  meal_type: "LUNCH",
  expected_count: "",
  produced_count: "",
  served_count: "",
  cost_amount: "",
};

const emptyWastage = {
  production_sheet_id: "",
  quantity: "",
  cost_amount: "",
  reason: "",
};

export default function DiningScreen() {
  const [classes, setClasses] =
    useState<ClassRow[]>([]);
  const [sections, setSections] =
    useState<SectionRow[]>([]);
  const [students, setStudents] =
    useState<StudentRow[]>([]);
  const [dining, setDining] =
    useState<DiningPayload>({});
  const [operations, setOperations] =
    useState<DiningOperationsPayload>({});
  const [attendance, setAttendance] =
    useState(emptyAttendance);
  const [mealPlan, setMealPlan] =
    useState(emptyMealPlan);
  const [inventory, setInventory] =
    useState(emptyInventory);
  const [purchase, setPurchase] =
    useState(emptyPurchase);
  const [production, setProduction] =
    useState(emptyProduction);
  const [wastage, setWastage] =
    useState(emptyWastage);
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
      const [
        roster,
        diningPayload,
        operationPayload,
      ] = await Promise.all([
        apiRequest<RosterPayload>(
          "/api/roster"
        ),
        apiRequest<DiningPayload>(
          "/api/dining"
        ),
        apiRequest<DiningOperationsPayload>(
          "/api/dining/operations"
        ),
      ]);
      setClasses(roster.classes || []);
      setSections(roster.sections || []);
      setStudents(roster.students || []);
      setDining(diningPayload || {});
      setOperations(operationPayload || {});
    } catch (error) {
      show(error, "Failed to load dining.");
    }
  };

  useEffect(() => {
    void Promise.resolve().then(load);
  }, []);

  const filteredSections =
    sections.filter(
      (section) =>
        !attendance.class_id ||
        String(section.class_id) ===
          attendance.class_id
    );
  const filteredStudents =
    useMemo(
      () =>
        students.filter((student) => {
          const classOk =
            !attendance.class_id ||
            student.class_name ||
            true;
          const sectionOk =
            !attendance.section_id ||
            student.section_name ||
            true;

          return classOk && sectionOk;
        }),
      [
        students,
        attendance.class_id,
        attendance.section_id,
      ]
    );

  async function submit(
    label: string,
    path: string,
    body: Record<string, unknown>,
    reset: () => void
  ) {
    try {
      setSaving(true);
      await apiRequest(path, {
        method: "POST",
        body,
      });
      reset();
      setMessage(`${label} saved.`);
      setTone("success");
      await load();
    } catch (error) {
      show(error, `${label} failed.`);
    } finally {
      setSaving(false);
    }
  }

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

  return (
    <ScreenShell
      title="Dining"
      subtitle="Meal plans, attendance, inventory, kitchen production, wastage and dining history."
    >
      {message ? (
        <StatusMessage
          message={message}
          tone={tone}
        />
      ) : null}

      <View style={styles.command}>
        <Text style={styles.commandEyebrow}>
          Dining Operations Center
        </Text>
        <Text style={styles.commandTitle}>
          Meals, stock, production and cost intelligence in one live workspace.
        </Text>
        <Text style={styles.commandText}>
          Track attendance, special meals, purchases, consumption, production sheets and wastage before cost leakage becomes invisible.
        </Text>
      </View>

      <View style={styles.metrics}>
        <ModuleCard
          title="Served"
          value={String(
            operations.analytics
              ?.served_count || 0
          )}
          detail="Production served count"
        />
        <ModuleCard
          title="Dining Attendance"
          value={
            dining.diningAttendance
              ?.length || 0
          }
          detail="Recent records"
        />
        <ModuleCard
          title="Inventory Health"
          value={
            operations.inventoryItems
              ?.length || 0
          }
          detail="Stock items under watch"
        />
        <ModuleCard
          title="Wastage Logs"
          value={
            operations.wastageLogs
              ?.length || 0
          }
          detail="Kitchen leakage evidence"
        />
      </View>

      <View style={styles.insight}>
        <Text style={styles.insightLabel}>
          AI Recommendations
        </Text>
        <Text style={styles.insightText}>
          Compare meal attendance with served count, purchase rate and wastage. Prioritize low-stock items and unusual consumption variance.
        </Text>
      </View>

      <Panel>
        <Text style={styles.sectionTitle}>
          Record Meal Attendance
        </Text>
        <SelectList
          label="Class"
          value={attendance.class_id}
          options={classes.map((item) => ({
            label:
              item.class_name ||
              `Class ${item.id}`,
            value: String(item.id),
          }))}
          onChange={(value) =>
            setAttendance({
              ...attendance,
              class_id: value,
              section_id: "",
              student_id: "",
            })
          }
        />
        <SelectList
          label="Section"
          value={attendance.section_id}
          options={filteredSections.map(
            (item) => ({
              label:
                item.section_name ||
                `Section ${item.id}`,
              value: String(item.id),
            })
          )}
          onChange={(value) =>
            setAttendance({
              ...attendance,
              section_id: value,
            })
          }
        />
        <SelectList
          label="Student"
          value={attendance.student_id}
          options={filteredStudents
            .slice(0, 80)
            .map((student) => ({
              label: studentName(student),
              value: String(student.id),
              detail:
                student.admission_number,
            }))}
          onChange={(value) =>
            setAttendance({
              ...attendance,
              student_id: value,
            })
          }
        />
        <SelectList
          label="Meal"
          value={attendance.meal_type}
          options={[
            "BREAKFAST",
            "LUNCH",
            "SNACKS",
            "DINNER",
          ].map((value) => ({
            label: value,
            value,
          }))}
          onChange={(value) =>
            setAttendance({
              ...attendance,
              meal_type: value,
            })
          }
        />
        <Field
          label="Date"
          value={
            attendance.attendance_date
          }
          onChangeText={(value) =>
            setAttendance({
              ...attendance,
              attendance_date: value,
            })
          }
        />
        <Field
          label="Remarks"
          value={attendance.remarks}
          onChangeText={(value) =>
            setAttendance({
              ...attendance,
              remarks: value,
            })
          }
        />
        <PrimaryButton
          label="Save Dining Attendance"
          loading={saving}
          onPress={() =>
            submit(
              "Dining attendance",
              "/api/dining",
              attendance,
              () =>
                setAttendance(
                  emptyAttendance
                )
            )
          }
        />
      </Panel>

      <Panel>
        <Text style={styles.sectionTitle}>
          Meal Plan
        </Text>
        <Field
          label="Plan Name"
          value={mealPlan.plan_name}
          onChangeText={(value) =>
            setMealPlan({
              ...mealPlan,
              plan_name: value,
            })
          }
        />
        <SelectList
          label="Meal"
          value={mealPlan.meal_type}
          options={[
            "BREAKFAST",
            "LUNCH",
            "SNACKS",
            "DINNER",
          ].map((value) => ({
            label: value,
            value,
          }))}
          onChange={(value) =>
            setMealPlan({
              ...mealPlan,
              meal_type: value,
            })
          }
        />
        <Field
          label="Price"
          keyboardType="numeric"
          value={mealPlan.price}
          onChangeText={(value) =>
            setMealPlan({
              ...mealPlan,
              price: value,
            })
          }
        />
        <PrimaryButton
          label="Create Meal Plan"
          loading={saving}
          onPress={() =>
            submit(
              "Meal plan",
              "/api/dining",
              {
                ...mealPlan,
                kind: "meal_plan",
              },
              () =>
                setMealPlan(emptyMealPlan)
            )
          }
        />
      </Panel>

      <Panel>
        <Text style={styles.sectionTitle}>
          Inventory Item
        </Text>
        <Field
          label="Item Name"
          value={inventory.item_name}
          onChangeText={(value) =>
            setInventory({
              ...inventory,
              item_name: value,
            })
          }
        />
        <Field
          label="Unit"
          value={inventory.unit}
          onChangeText={(value) =>
            setInventory({
              ...inventory,
              unit: value,
            })
          }
        />
        <Field
          label="Current Quantity"
          keyboardType="numeric"
          value={
            inventory.current_quantity
          }
          onChangeText={(value) =>
            setInventory({
              ...inventory,
              current_quantity: value,
            })
          }
        />
        <Field
          label="Reorder Level"
          keyboardType="numeric"
          value={inventory.reorder_level}
          onChangeText={(value) =>
            setInventory({
              ...inventory,
              reorder_level: value,
            })
          }
        />
        <PrimaryButton
          label="Create Inventory Item"
          loading={saving}
          onPress={() =>
            submit(
              "Inventory item",
              "/api/dining/operations",
              {
                ...inventory,
                kind: "inventory_item",
              },
              () =>
                setInventory(
                  emptyInventory
                )
            )
          }
        />
      </Panel>

      <Panel>
        <Text style={styles.sectionTitle}>
          Purchase Stock
        </Text>
        <SelectList
          label="Item"
          value={purchase.item_id}
          options={(
            operations.inventoryItems || []
          ).map((item) => ({
            label:
              item.item_name ||
              `Item ${item.id}`,
            value: String(item.id),
            detail: item.unit,
          }))}
          onChange={(value) =>
            setPurchase({
              ...purchase,
              item_id: value,
            })
          }
        />
        <Field
          label="Quantity"
          keyboardType="numeric"
          value={purchase.quantity}
          onChangeText={(value) =>
            setPurchase({
              ...purchase,
              quantity: value,
            })
          }
        />
        <Field
          label="Unit Cost"
          keyboardType="numeric"
          value={purchase.unit_cost}
          onChangeText={(value) =>
            setPurchase({
              ...purchase,
              unit_cost: value,
            })
          }
        />
        <Field
          label="Vendor"
          value={purchase.vendor_name}
          onChangeText={(value) =>
            setPurchase({
              ...purchase,
              vendor_name: value,
            })
          }
        />
        <PrimaryButton
          label="Record Purchase"
          loading={saving}
          onPress={() =>
            submit(
              "Purchase",
              "/api/dining/operations",
              {
                ...purchase,
                kind: "purchase",
              },
              () =>
                setPurchase(emptyPurchase)
            )
          }
        />
      </Panel>

      <Panel>
        <Text style={styles.sectionTitle}>
          Kitchen Production
        </Text>
        <Field
          label="Production Date"
          value={
            production.production_date
          }
          onChangeText={(value) =>
            setProduction({
              ...production,
              production_date: value,
            })
          }
        />
        <SelectList
          label="Meal"
          value={production.meal_type}
          options={[
            "BREAKFAST",
            "LUNCH",
            "SNACKS",
            "DINNER",
          ].map((value) => ({
            label: value,
            value,
          }))}
          onChange={(value) =>
            setProduction({
              ...production,
              meal_type: value,
            })
          }
        />
        {[
          "expected_count",
          "produced_count",
          "served_count",
          "cost_amount",
        ].map((key) => (
          <Field
            key={key}
            label={labelize(key)}
            keyboardType="numeric"
            value={
              production[
                key as keyof typeof production
              ]
            }
            onChangeText={(value) =>
              setProduction({
                ...production,
                [key]: value,
              })
            }
          />
        ))}
        <PrimaryButton
          label="Save Production Sheet"
          loading={saving}
          onPress={() =>
            submit(
              "Production sheet",
              "/api/dining/operations",
              {
                ...production,
                kind: "production",
              },
              () =>
                setProduction(
                  emptyProduction
                )
            )
          }
        />
      </Panel>

      <Panel>
        <Text style={styles.sectionTitle}>
          Food Wastage
        </Text>
        <SelectList
          label="Production Sheet"
          value={
            wastage.production_sheet_id
          }
          options={(
            operations.productionSheets ||
            []
          ).map((item) => ({
            label: `${item.meal_type || "Meal"} ${String(item.production_date || "").slice(0, 10)}`,
            value: String(item.id),
          }))}
          onChange={(value) =>
            setWastage({
              ...wastage,
              production_sheet_id:
                value,
            })
          }
        />
        <Field
          label="Quantity"
          keyboardType="numeric"
          value={wastage.quantity}
          onChangeText={(value) =>
            setWastage({
              ...wastage,
              quantity: value,
            })
          }
        />
        <Field
          label="Cost Amount"
          keyboardType="numeric"
          value={wastage.cost_amount}
          onChangeText={(value) =>
            setWastage({
              ...wastage,
              cost_amount: value,
            })
          }
        />
        <Field
          label="Reason"
          value={wastage.reason}
          multiline
          onChangeText={(value) =>
            setWastage({
              ...wastage,
              reason: value,
            })
          }
        />
        <PrimaryButton
          label="Record Wastage"
          loading={saving}
          onPress={() =>
            submit(
              "Wastage",
              "/api/dining/operations",
              {
                ...wastage,
                kind: "wastage",
              },
              () =>
                setWastage(emptyWastage)
            )
          }
        />
      </Panel>

      <View style={styles.records}>
        <Text style={styles.sectionTitle}>
          Recent Dining Records
        </Text>
        {(dining.diningAttendance || [])
          .slice(0, 20)
          .map((record) => (
            <ModuleCard
              key={`attendance-${record.id}`}
              title={`${record.meal_type} - ${record.status}`}
              detail={[
                record.first_name,
                record.last_name,
                record.class_name,
                record.section_name,
                String(
                  record.attendance_date ||
                    ""
                ).slice(0, 10),
              ]
                .filter(Boolean)
                .join(" / ")}
            />
          ))}
      </View>
    </ScreenShell>
  );
}

function studentName(
  student: StudentRow
) {
  return (
    student.name ||
    [student.first_name, student.last_name]
      .filter(Boolean)
      .join(" ") ||
    `Student ${student.id}`
  );
}

function labelize(key: string) {
  return key
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1)
    )
    .join(" ");
}

const styles = StyleSheet.create({
  command: {
    gap: 9,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.black,
    padding: 18,
  },
  commandEyebrow: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
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
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  metrics: {
    gap: 12,
  },
  insight: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    backgroundColor: colors.surfaceWarm,
    padding: 15,
  },
  insightLabel: {
    color: colors.goldDeep,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  insightText: {
    marginTop: 6,
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
  },
  records: {
    gap: 12,
  },
});
