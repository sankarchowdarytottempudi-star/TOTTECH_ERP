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
};
type RosterPayload = {
  classes?: ClassRow[];
  sections?: SectionRow[];
  students?: StudentRow[];
};
type HostelPayload = {
  hostels?: any[];
  allocations?: any[];
  attendance?: any[];
  movementHistory?: any[];
};

const today = () =>
  new Date().toISOString().slice(0, 10);

const emptyHostel = {
  hostel_name: "",
  hostel_type: "",
  warden_name: "",
  warden_phone: "",
};

const emptyAssignment = {
  class_id: "",
  section_id: "",
  student_id: "",
  hostel_id: "",
  room_number: "",
  bed_number: "",
  allocation_date: today(),
};

const emptyAttendance = {
  student_id: "",
  hostel_id: "",
  attendance_date: today(),
  status: "PRESENT",
  remarks: "",
};

const emptyMovement = {
  student_id: "",
  hostel_id: "",
  movement_type: "CHECK_IN",
  notes: "",
};

export default function HostelScreen() {
  const [classes, setClasses] =
    useState<ClassRow[]>([]);
  const [sections, setSections] =
    useState<SectionRow[]>([]);
  const [students, setStudents] =
    useState<StudentRow[]>([]);
  const [data, setData] =
    useState<HostelPayload>({});
  const [hostelForm, setHostelForm] =
    useState(emptyHostel);
  const [
    assignmentForm,
    setAssignmentForm,
  ] = useState(emptyAssignment);
  const [
    attendanceForm,
    setAttendanceForm,
  ] = useState(emptyAttendance);
  const [
    movementForm,
    setMovementForm,
  ] = useState(emptyMovement);
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
      const [roster, hostel] =
        await Promise.all([
          apiRequest<RosterPayload>(
            "/api/roster"
          ),
          apiRequest<HostelPayload>(
            "/api/hostels"
          ),
        ]);

      setClasses(roster.classes || []);
      setSections(roster.sections || []);
      setStudents(roster.students || []);
      setData(hostel || {});
    } catch (error) {
      show(error, "Failed to load hostel.");
    }
  };

  useEffect(() => {
    void Promise.resolve().then(load);
  }, []);

  const filteredSections =
    sections.filter(
      (section) =>
        !assignmentForm.class_id ||
        String(section.class_id) ===
          assignmentForm.class_id
    );

  async function submit(
    label: string,
    body: Record<string, unknown>,
    reset: () => void
  ) {
    try {
      setSaving(true);
      await apiRequest("/api/hostels", {
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
      title="Hostel"
      subtitle="Hostel administration, student allocation, attendance and movement history."
    >
      {message ? (
        <StatusMessage
          message={message}
          tone={tone}
        />
      ) : null}

      <View style={styles.command}>
        <Text style={styles.commandEyebrow}>
          Hostel Command
        </Text>
        <Text style={styles.commandTitle}>
          Occupancy, allocations, movements and warden operations in one place.
        </Text>
        <Text style={styles.commandText}>
          Track vacancies, student allocation, night attendance and movement history with audit-ready context.
        </Text>
      </View>

      <View style={styles.metrics}>
        <ModuleCard
          title="Hostels"
          value={data.hostels?.length || 0}
          detail="Configured hostels"
        />
        <ModuleCard
          title="Allocations"
          value={
            data.allocations?.length || 0
          }
          detail="Recent student allocations"
        />
        <ModuleCard
          title="Attendance"
          value={
            data.attendance?.length || 0
          }
          detail="Recent hostel attendance"
        />
        <ModuleCard
          title="Movements"
          value={
            data.movementHistory
              ?.length || 0
          }
          detail="Check-in, leave and room-change trail"
        />
      </View>

      <View style={styles.insight}>
        <Text style={styles.insightLabel}>
          AI Insights
        </Text>
        <Text style={styles.insightText}>
          Review unallocated students, missing attendance, room-change movements and warden contact readiness before hostel close.
        </Text>
      </View>

      <Panel>
        <Text style={styles.sectionTitle}>
          Create Hostel
        </Text>
        <Field
          label="Hostel Name"
          value={hostelForm.hostel_name}
          onChangeText={(value) =>
            setHostelForm({
              ...hostelForm,
              hostel_name: value,
            })
          }
        />
        <Field
          label="Hostel Type"
          value={hostelForm.hostel_type}
          onChangeText={(value) =>
            setHostelForm({
              ...hostelForm,
              hostel_type: value,
            })
          }
        />
        <Field
          label="Warden Name"
          value={hostelForm.warden_name}
          onChangeText={(value) =>
            setHostelForm({
              ...hostelForm,
              warden_name: value,
            })
          }
        />
        <Field
          label="Warden Phone"
          keyboardType="phone-pad"
          value={hostelForm.warden_phone}
          onChangeText={(value) =>
            setHostelForm({
              ...hostelForm,
              warden_phone: value,
            })
          }
        />
        <PrimaryButton
          label="Create Hostel"
          loading={saving}
          onPress={() =>
            submit(
              "Hostel",
              hostelForm,
              () =>
                setHostelForm(
                  emptyHostel
                )
            )
          }
        />
      </Panel>

      <Panel>
        <Text style={styles.sectionTitle}>
          Assign Student
        </Text>
        <SelectList
          label="Class"
          value={assignmentForm.class_id}
          options={classes.map((item) => ({
            label:
              item.class_name ||
              `Class ${item.id}`,
            value: String(item.id),
          }))}
          onChange={(value) =>
            setAssignmentForm({
              ...assignmentForm,
              class_id: value,
              section_id: "",
            })
          }
        />
        <SelectList
          label="Section"
          value={assignmentForm.section_id}
          options={filteredSections.map(
            (item) => ({
              label:
                item.section_name ||
                `Section ${item.id}`,
              value: String(item.id),
            })
          )}
          onChange={(value) =>
            setAssignmentForm({
              ...assignmentForm,
              section_id: value,
            })
          }
        />
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
          label="Hostel"
          value={assignmentForm.hostel_id}
          options={(data.hostels || []).map(
            (hostel) => ({
              label:
                hostel.hostel_name ||
                `Hostel ${hostel.id}`,
              value: String(hostel.id),
              detail: hostel.warden_name,
            })
          )}
          onChange={(value) =>
            setAssignmentForm({
              ...assignmentForm,
              hostel_id: value,
            })
          }
        />
        <Field
          label="Room Number"
          value={
            assignmentForm.room_number
          }
          onChangeText={(value) =>
            setAssignmentForm({
              ...assignmentForm,
              room_number: value,
            })
          }
        />
        <Field
          label="Bed Number"
          value={
            assignmentForm.bed_number
          }
          onChangeText={(value) =>
            setAssignmentForm({
              ...assignmentForm,
              bed_number: value,
            })
          }
        />
        <PrimaryButton
          label="Assign Hostel"
          loading={saving}
          onPress={() =>
            submit(
              "Hostel assignment",
              {
                ...assignmentForm,
                kind: "assignment",
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
          Attendance
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
          label="Hostel"
          value={attendanceForm.hostel_id}
          options={(data.hostels || []).map(
            (hostel) => ({
              label:
                hostel.hostel_name ||
                `Hostel ${hostel.id}`,
              value: String(hostel.id),
            })
          )}
          onChange={(value) =>
            setAttendanceForm({
              ...attendanceForm,
              hostel_id: value,
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
          label="Save Hostel Attendance"
          loading={saving}
          onPress={() =>
            submit(
              "Hostel attendance",
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
      </Panel>

      <Panel>
        <Text style={styles.sectionTitle}>
          Movement History
        </Text>
        <SelectList
          label="Student"
          value={movementForm.student_id}
          options={students
            .slice(0, 80)
            .map((student) => ({
              label: studentName(student),
              value: String(student.id),
              detail:
                student.admission_number,
            }))}
          onChange={(value) =>
            setMovementForm({
              ...movementForm,
              student_id: value,
            })
          }
        />
        <SelectList
          label="Hostel"
          value={movementForm.hostel_id}
          options={(data.hostels || []).map(
            (hostel) => ({
              label:
                hostel.hostel_name ||
                `Hostel ${hostel.id}`,
              value: String(hostel.id),
            })
          )}
          onChange={(value) =>
            setMovementForm({
              ...movementForm,
              hostel_id: value,
            })
          }
        />
        <SelectList
          label="Movement Type"
          value={
            movementForm.movement_type
          }
          options={[
            "CHECK_IN",
            "CHECK_OUT",
            "ROOM_CHANGE",
            "LEAVE",
            "RETURN",
          ].map((value) => ({
            label: value,
            value,
          }))}
          onChange={(value) =>
            setMovementForm({
              ...movementForm,
              movement_type: value,
            })
          }
        />
        <Field
          label="Notes"
          value={movementForm.notes}
          multiline
          onChangeText={(value) =>
            setMovementForm({
              ...movementForm,
              notes: value,
            })
          }
        />
        <PrimaryButton
          label="Record Movement"
          loading={saving}
          onPress={() =>
            submit(
              "Hostel movement",
              {
                ...movementForm,
                kind: "movement",
              },
              () =>
                setMovementForm(
                  emptyMovement
                )
            )
          }
        />
      </Panel>

      <View style={styles.records}>
        <Text style={styles.sectionTitle}>
          Recent Allocations
        </Text>
        {(data.allocations || [])
          .slice(0, 20)
          .map((allocation) => (
            <ModuleCard
              key={`allocation-${allocation.id}`}
              title={
                allocation.student_name ||
                [
                  allocation.first_name,
                  allocation.last_name,
                ]
                  .filter(Boolean)
                  .join(" ") ||
                `Allocation ${allocation.id}`
              }
              detail={[
                allocation.hostel_name,
                allocation.room_number,
                allocation.bed_number,
                String(
                  allocation.allocation_date ||
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
