import React, {
  useEffect,
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
type StudentRow = {
  id: IdValue;
  name?: string;
  first_name?: string;
  last_name?: string;
  admission_number?: string;
};
type RosterPayload = {
  students?: StudentRow[];
};
type TransportPayload = {
  vehicles?: any[];
  routes?: any[];
  assignments?: any[];
  attendance?: any[];
  pickupDropHistory?: any[];
};

const today = () =>
  new Date().toISOString().slice(0, 10);

const emptyRoute = {
  route_name: "",
  vehicle_number: "",
  driver_name: "",
  driver_phone: "",
};

const emptyAssignment = {
  student_id: "",
  route_id: "",
  pickup_point: "",
  drop_point: "",
};

const emptyAttendance = {
  student_id: "",
  route_id: "",
  trip_type: "PICKUP",
  attendance_date: today(),
  status: "PRESENT",
  pickup_point: "",
  drop_point: "",
  remarks: "",
};

export default function TransportScreen() {
  const [students, setStudents] =
    useState<StudentRow[]>([]);
  const [data, setData] =
    useState<TransportPayload>({});
  const [routeForm, setRouteForm] =
    useState(emptyRoute);
  const [
    assignmentForm,
    setAssignmentForm,
  ] = useState(emptyAssignment);
  const [
    attendanceForm,
    setAttendanceForm,
  ] = useState(emptyAttendance);
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
      const [roster, transport] =
        await Promise.all([
          apiRequest<RosterPayload>(
            "/api/roster"
          ),
          apiRequest<TransportPayload>(
            "/api/transport"
          ),
        ]);

      setStudents(roster.students || []);
      setData(transport || {});
    } catch (error) {
      show(error, "Failed to load transport.");
    }
  };

  useEffect(() => {
    void Promise.resolve().then(load);
  }, []);

  async function submit(
    label: string,
    body: Record<string, unknown>,
    reset: () => void
  ) {
    try {
      setSaving(true);
      await apiRequest("/api/transport", {
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
      title="Transport"
      subtitle="Routes, assignments, attendance and pickup/drop operational history."
    >
      {message ? (
        <StatusMessage
          message={message}
          tone={tone}
        />
      ) : null}

      <View style={styles.command}>
        <Text style={styles.commandEyebrow}>
          Transport Administration
        </Text>
        <Text style={styles.commandTitle}>
          Route utilization, assignments and trip events for the active school.
        </Text>
        <Text style={styles.commandText}>
          Monitor fleet visibility, driver readiness, pickup/drop history and student assignment health before daily movement.
        </Text>
      </View>

      <View style={styles.metrics}>
        <ModuleCard
          title="Routes"
          value={data.routes?.length || 0}
          detail="Active transport routes"
        />
        <ModuleCard
          title="Assignments"
          value={
            data.assignments?.length || 0
          }
          detail="Students and staff assigned"
        />
        <ModuleCard
          title="Trip Events"
          value={
            data.attendance?.length || 0
          }
          detail="Pickup/drop attendance evidence"
        />
        <ModuleCard
          title="Route Revenue"
          value={
            data.pickupDropHistory
              ?.length || 0
          }
          detail="Movement records visible"
        />
      </View>

      <View style={styles.insight}>
        <Text style={styles.insightLabel}>
          AI Insights
        </Text>
        <Text style={styles.insightText}>
          Watch routes with high assignments and low attendance evidence. Review vehicle status, driver contacts and missing pickup/drop history.
        </Text>
      </View>

      <Panel>
        <Text style={styles.sectionTitle}>
          Create Route
        </Text>
        <Field
          label="Route Name"
          value={routeForm.route_name}
          onChangeText={(value) =>
            setRouteForm({
              ...routeForm,
              route_name: value,
            })
          }
        />
        <Field
          label="Vehicle Number"
          value={
            routeForm.vehicle_number
          }
          onChangeText={(value) =>
            setRouteForm({
              ...routeForm,
              vehicle_number: value,
            })
          }
        />
        <Field
          label="Driver Name"
          value={routeForm.driver_name}
          onChangeText={(value) =>
            setRouteForm({
              ...routeForm,
              driver_name: value,
            })
          }
        />
        <Field
          label="Driver Phone"
          keyboardType="phone-pad"
          value={routeForm.driver_phone}
          onChangeText={(value) =>
            setRouteForm({
              ...routeForm,
              driver_phone: value,
            })
          }
        />
        <PrimaryButton
          label="Create Route"
          loading={saving}
          onPress={() =>
            submit(
              "Route",
              {
                ...routeForm,
                kind: "route",
              },
              () =>
                setRouteForm(emptyRoute)
            )
          }
        />
      </Panel>

      <Panel>
        <Text style={styles.sectionTitle}>
          Assign Student
        </Text>
        <SelectList
          label="Student"
          value={assignmentForm.student_id}
          options={students
            .slice(0, 80)
            .map((student) => ({
              label: studentName(student),
              value: String(student.id),
              detail:
                student.admission_number,
            }))}
          onChange={(value) =>
            setAssignmentForm({
              ...assignmentForm,
              student_id: value,
            })
          }
        />
        <SelectList
          label="Route"
          value={assignmentForm.route_id}
          options={(data.routes || []).map(
            (route) => ({
              label:
                route.route_name ||
                `Route ${route.id}`,
              value: String(route.id),
              detail:
                route.vehicle_number,
            })
          )}
          onChange={(value) =>
            setAssignmentForm({
              ...assignmentForm,
              route_id: value,
            })
          }
        />
        <Field
          label="Pickup Point"
          value={
            assignmentForm.pickup_point
          }
          onChangeText={(value) =>
            setAssignmentForm({
              ...assignmentForm,
              pickup_point: value,
            })
          }
        />
        <Field
          label="Drop Point"
          value={assignmentForm.drop_point}
          onChangeText={(value) =>
            setAssignmentForm({
              ...assignmentForm,
              drop_point: value,
            })
          }
        />
        <PrimaryButton
          label="Assign Transport"
          loading={saving}
          onPress={() =>
            submit(
              "Transport assignment",
              {
                ...assignmentForm,
                kind: "assignment",
                assigned_to_type:
                  "STUDENT",
              },
              () =>
                setAssignmentForm(
                  emptyAssignment
                )
            )
          }
        />
      </Panel>

      <Panel>
        <Text style={styles.sectionTitle}>
          Attendance / Trip Event
        </Text>
        <SelectList
          label="Student"
          value={attendanceForm.student_id}
          options={students
            .slice(0, 80)
            .map((student) => ({
              label: studentName(student),
              value: String(student.id),
              detail:
                student.admission_number,
            }))}
          onChange={(value) =>
            setAttendanceForm({
              ...attendanceForm,
              student_id: value,
            })
          }
        />
        <SelectList
          label="Route"
          value={attendanceForm.route_id}
          options={(data.routes || []).map(
            (route) => ({
              label:
                route.route_name ||
                `Route ${route.id}`,
              value: String(route.id),
            })
          )}
          onChange={(value) =>
            setAttendanceForm({
              ...attendanceForm,
              route_id: value,
            })
          }
        />
        <SelectList
          label="Trip Type"
          value={attendanceForm.trip_type}
          options={["PICKUP", "DROP"].map(
            (value) => ({
              label: value,
              value,
            })
          )}
          onChange={(value) =>
            setAttendanceForm({
              ...attendanceForm,
              trip_type: value,
            })
          }
        />
        <Field
          label="Date"
          value={
            attendanceForm.attendance_date
          }
          onChangeText={(value) =>
            setAttendanceForm({
              ...attendanceForm,
              attendance_date: value,
            })
          }
        />
        <Field
          label="Status"
          value={attendanceForm.status}
          onChangeText={(value) =>
            setAttendanceForm({
              ...attendanceForm,
              status: value,
            })
          }
        />
        <Field
          label="Remarks"
          value={attendanceForm.remarks}
          onChangeText={(value) =>
            setAttendanceForm({
              ...attendanceForm,
              remarks: value,
            })
          }
        />
        <PrimaryButton
          label="Save Attendance"
          loading={saving}
          onPress={() =>
            submit(
              "Transport attendance",
              {
                ...attendanceForm,
                kind: "attendance",
              },
              () =>
                setAttendanceForm(
                  emptyAttendance
                )
            )
          }
        />
        <PrimaryButton
          label="Record Pickup / Drop"
          loading={saving}
          onPress={() =>
            submit(
              "Pickup/drop history",
              {
                ...attendanceForm,
                kind: "pickup_drop",
              },
              () =>
                setAttendanceForm(
                  emptyAttendance
                )
            )
          }
        />
      </Panel>

      <View style={styles.records}>
        <Text style={styles.sectionTitle}>
          Recent Assignments
        </Text>
        {(data.assignments || [])
          .slice(0, 20)
          .map((assignment) => (
            <ModuleCard
              key={`assignment-${assignment.id}`}
              title={
                assignment.student_name ||
                assignment.first_name ||
                `Assignment ${assignment.id}`
              }
              detail={[
                assignment.route_name,
                assignment.pickup_point,
                assignment.drop_point,
                assignment.status,
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
