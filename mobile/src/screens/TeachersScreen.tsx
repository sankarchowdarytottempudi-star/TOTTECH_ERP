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
type TeacherRow = {
  id: IdValue;
  first_name?: string;
  last_name?: string;
  employee_id?: string;
  phone?: string;
  email?: string;
  department?: string;
  designation?: string;
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
  employee_id: "",
  phone: "",
  email: "",
  department: "",
  designation: "",
  class_id: "",
  section_id: "",
};

export default function TeachersScreen() {
  const [teachers, setTeachers] =
    useState<TeacherRow[]>([]);
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
      const [teacherRows, roster] =
        await Promise.all([
          apiRequest<TeacherRow[]>(
            "/api/teachers"
          ),
          apiRequest<RosterPayload>(
            "/api/roster"
          ),
        ]);
      setTeachers(teacherRows);
      setClasses(roster.classes || []);
      setSections(roster.sections || []);
    } catch (error) {
      show(
        error instanceof Error
          ? error.message
          : "Failed to load teachers",
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

  const createTeacher = async () => {
    if (!form.first_name.trim()) {
      show(
        "Teacher first name is required.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);
      await apiRequest("/api/teachers", {
        method: "POST",
        body: form,
      });
      setForm(emptyForm);
      show("Teacher created.", "success");
      await load();
    } catch (error) {
      show(
        error instanceof Error
          ? error.message
          : "Failed to create teacher",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteTeacher = (
    teacher: TeacherRow
  ) => {
    Alert.alert(
      "Delete teacher",
      `Delete ${teacherName(teacher)} from database?`,
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiRequest(
                `/api/teachers/${teacher.id}`,
                { method: "DELETE" }
              );
              show(
                "Teacher deleted.",
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
      title="Teachers"
      subtitle="Create teachers, assign class-section ownership, and review teacher cards."
    >
      {message ? (
        <StatusMessage
          message={message}
          tone={tone}
        />
      ) : null}
      <Panel>
        <Text style={styles.sectionTitle}>
          Add Teacher / Staff
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
          label="Employee ID"
          value={form.employee_id}
          onChangeText={(value) =>
            setForm({
              ...form,
              employee_id: value,
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
          label="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(value) =>
            setForm({
              ...form,
              email: value,
            })
          }
        />
        <Field
          label="Department"
          value={form.department}
          onChangeText={(value) =>
            setForm({
              ...form,
              department: value,
            })
          }
        />
        <Field
          label="Designation"
          value={form.designation}
          onChangeText={(value) =>
            setForm({
              ...form,
              designation: value,
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
          label="Create Teacher"
          loading={saving}
          onPress={createTeacher}
        />
      </Panel>

      <View style={styles.records}>
        <Text style={styles.sectionTitle}>
          Teacher Cards
        </Text>
        {teachers.slice(0, 80).map(
          (teacher) => (
            <View
              key={String(teacher.id)}
              style={styles.cardWrap}
            >
              <ModuleCard
                title={teacherName(teacher)}
                detail={[
                  teacher.employee_id,
                  teacher.designation,
                  teacher.department,
                  teacher.class_name,
                  teacher.section_name,
                  teacher.phone,
                ]
                  .filter(Boolean)
                  .join(" / ")}
              />
              <SecondaryButton
                label="Delete From DB"
                onPress={() =>
                  deleteTeacher(teacher)
                }
              />
            </View>
          )
        )}
      </View>
    </ScreenShell>
  );
}

function teacherName(
  teacher: TeacherRow
) {
  return (
    [teacher.first_name, teacher.last_name]
      .filter(Boolean)
      .join(" ") ||
    `Teacher ${teacher.id}`
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
