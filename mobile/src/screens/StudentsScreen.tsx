import React, {
  useEffect,
  useState,
} from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { apiRequest } from "../api/client";
import {
  Field,
  Panel,
  PrimaryButton,
  SecondaryButton,
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
  roll_number?: string;
  phone?: string;
  class_name?: string;
  section_name?: string;
};
type RosterPayload = {
  classes?: ClassRow[];
  sections?: SectionRow[];
};

const emptyForm = {
  first_name: "",
  last_name: "",
  admission_number: "",
  phone: "",
  roll_number: "",
  class_id: "",
  section_id: "",
};

export default function StudentsScreen() {
  const [students, setStudents] =
    useState<StudentRow[]>([]);
  const [classes, setClasses] =
    useState<ClassRow[]>([]);
  const [sections, setSections] =
    useState<SectionRow[]>([]);
  const [form, setForm] =
    useState(emptyForm);
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
      const [studentRows, roster] =
        await Promise.all([
          apiRequest<StudentRow[]>(
            "/api/students"
          ),
          apiRequest<RosterPayload>(
            "/api/roster"
          ),
        ]);
      setStudents(studentRows);
      setClasses(roster.classes || []);
      setSections(roster.sections || []);
    } catch (error) {
      show(
        error instanceof Error
          ? error.message
          : "Failed to load students",
        "error"
      );
    }
  };

  useEffect(() => {
    void Promise.resolve().then(load);
  }, []);

  const filteredSections =
    sections.filter(
      (section) =>
        !form.class_id ||
        String(section.class_id) ===
          form.class_id
    );

  const createStudent = async () => {
    if (!form.first_name.trim()) {
      show(
        "Student first name is required.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);
      await apiRequest("/api/students", {
        method: "POST",
        body: form,
      });
      setForm(emptyForm);
      show("Student created.", "success");
      await load();
    } catch (error) {
      show(
        error instanceof Error
          ? error.message
          : "Failed to create student",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteStudent = (
    student: StudentRow
  ) => {
    Alert.alert(
      "Delete student",
      `Delete ${studentName(student)} from database?`,
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiRequest(
                `/api/students/${student.id}`,
                { method: "DELETE" }
              );
              show(
                "Student deleted.",
                "success"
              );
              await load();
            } catch (error) {
              show(
                error instanceof Error
                  ? error.message
                  : "Delete failed",
                "error"
              );
            }
          },
        },
      ]
    );
  };

  function show(
    text: string,
    nextTone:
      | "info"
      | "success"
      | "error" = "info"
  ) {
    setMessage(text);
    setTone(nextTone);
  }

  return (
    <ScreenShell
      title="Students"
      subtitle="Create, assign, review and remove student records with class-section context."
    >
      {message ? (
        <StatusMessage
          message={message}
          tone={tone}
        />
      ) : null}
      <Panel>
        <Text style={styles.sectionTitle}>
          Add Student
        </Text>
        <Field
          label="First Name"
          value={form.first_name}
          onChangeText={(value) =>
            setForm({
              ...form,
              first_name: value,
            })
          }
        />
        <Field
          label="Last Name"
          value={form.last_name}
          onChangeText={(value) =>
            setForm({
              ...form,
              last_name: value,
            })
          }
        />
        <Field
          label="Admission Number"
          value={
            form.admission_number
          }
          onChangeText={(value) =>
            setForm({
              ...form,
              admission_number: value,
            })
          }
        />
        <Field
          label="Phone"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(value) =>
            setForm({
              ...form,
              phone: value,
            })
          }
        />
        <Field
          label="Roll Number"
          value={form.roll_number}
          onChangeText={(value) =>
            setForm({
              ...form,
              roll_number: value,
            })
          }
        />
        <SelectList
          label="Class"
          value={form.class_id}
          options={classes.map((item) => ({
            label:
              item.class_name ||
              `Class ${item.id}`,
            value: String(item.id),
          }))}
          onChange={(value) =>
            setForm({
              ...form,
              class_id: value,
              section_id: "",
            })
          }
        />
        <SelectList
          label="Section"
          value={form.section_id}
          options={filteredSections.map(
            (item) => ({
              label:
                item.section_name ||
                `Section ${item.id}`,
              value: String(item.id),
            })
          )}
          onChange={(value) =>
            setForm({
              ...form,
              section_id: value,
            })
          }
        />
        <PrimaryButton
          label="Create Student"
          loading={saving}
          onPress={createStudent}
        />
      </Panel>

      <View style={styles.records}>
        <Text style={styles.sectionTitle}>
          Student Cards
        </Text>
        {students.slice(0, 80).map(
          (student) => (
            <View
              key={String(student.id)}
              style={styles.cardWrap}
            >
              <ModuleCard
                title={studentName(student)}
                detail={[
                  student.admission_number,
                  student.class_name,
                  student.section_name,
                  student.phone,
                ]
                  .filter(Boolean)
                  .join(" / ")}
                value={
                  student.roll_number
                    ? `Roll ${student.roll_number}`
                    : undefined
                }
              />
              <SecondaryButton
                label="Delete From DB"
                onPress={() =>
                  deleteStudent(student)
                }
              />
            </View>
          )
        )}
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
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  records: {
    gap: 10,
  },
  cardWrap: {
    gap: 8,
  },
});
