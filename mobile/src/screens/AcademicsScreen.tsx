import React, {
  useEffect,
  useMemo,
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
  Option,
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
type AnyRow = Record<
  string,
  unknown
>;

type Exam = AnyRow & {
  id: IdValue;
  exam_name?: string;
  exam_type?: string;
  schedule_count?: number;
  paper_count?: number;
};

type ExamType = {
  id: IdValue;
  exam_name?: string;
};

type ClassRow = {
  id: IdValue;
  class_name?: string;
};

type SectionRow = {
  id: IdValue;
  class_id?: IdValue;
  section_name?: string;
};

type SubjectRow = {
  id: IdValue;
  subject_name?: string;
};

type TeacherRow = {
  id: IdValue;
  first_name?: string;
  last_name?: string;
};

type StudentRow = {
  id: IdValue;
  name?: string;
  first_name?: string;
  last_name?: string;
  admission_number?: string;
  roll_number?: string;
  class_name?: string;
  section_name?: string;
};

type ScheduleRow = AnyRow & {
  id: IdValue;
  exam_name?: string;
  exam_type_name?: string;
  paper_name?: string;
  class_name?: string;
  section_name?: string;
  subject_name?: string;
  exam_date?: string;
  question_paper_id?: IdValue | null;
};

type PaperRow = AnyRow & {
  id: IdValue;
  paper_name?: string;
  class_id?: IdValue;
  section_id?: IdValue;
  subject_id?: IdValue;
  class_name?: string;
  section_name?: string;
  subject_name?: string;
  question_count?: number;
  total_marks?: number;
};

type HomeworkRow = AnyRow & {
  id: IdValue;
  title?: string;
  class_name?: string;
  section_name?: string;
  subject_name?: string;
  due_date?: string;
  status?: string;
};

type QuestionRow = {
  question_id: IdValue;
  question_text?: string;
  question_marks?: number;
  topic_name?: string;
  section_name?: string;
};

type RosterPayload = {
  classes?: ClassRow[];
  sections?: SectionRow[];
  students?: StudentRow[];
  teachers?: TeacherRow[];
};

const emptyExam = {
  exam_name: "",
  exam_type: "",
  start_date: "",
  end_date: "",
};

const emptySchedule = {
  exam_id: "",
  exam_type_id: "",
  question_paper_id: "",
  class_id: "",
  section_id: "",
  subject_id: "",
  exam_date: "",
  start_time: "",
  end_time: "",
  room_no: "",
};

const emptyPaper = {
  paper_name: "",
  exam_id: "",
  exam_type_id: "",
  class_id: "",
  section_id: "",
  subject_id: "",
  exam_date: "",
  duration_minutes: "180",
  instructions: "",
};

const emptyQuestion = {
  section_name: "A",
  question_type: "SHORT_ANSWER",
  difficulty_level: "MEDIUM",
  topic_name: "",
  question_text: "",
  answer_text: "",
  question_marks: "5",
};

const emptyHomework = {
  class_id: "",
  section_id: "",
  subject_id: "",
  teacher_id: "",
  title: "",
  description: "",
  due_date: "",
  status: "ASSIGNED",
};

const tabs = [
  "Exams",
  "Schedule",
  "Papers",
  "Homework",
  "Marks",
] as const;

type Tab = (typeof tabs)[number];

export default function AcademicsScreen() {
  const [activeTab, setActiveTab] =
    useState<Tab>("Exams");
  const [loading, setLoading] =
    useState(false);
  const [saving, setSaving] =
    useState(false);
  const [message, setMessage] =
    useState("");
  const [tone, setTone] =
    useState<
      "info" | "success" | "error"
    >("info");

  const [exams, setExams] =
    useState<Exam[]>([]);
  const [examTypes, setExamTypes] =
    useState<ExamType[]>([]);
  const [schedules, setSchedules] =
    useState<ScheduleRow[]>([]);
  const [papers, setPapers] =
    useState<PaperRow[]>([]);
  const [homework, setHomework] =
    useState<HomeworkRow[]>([]);
  const [classes, setClasses] =
    useState<ClassRow[]>([]);
  const [sections, setSections] =
    useState<SectionRow[]>([]);
  const [subjects, setSubjects] =
    useState<SubjectRow[]>([]);
  const [teachers, setTeachers] =
    useState<TeacherRow[]>([]);

  const [examForm, setExamForm] =
    useState(emptyExam);
  const [examTypeName, setExamTypeName] =
    useState("");
  const [
    examTypeDescription,
    setExamTypeDescription,
  ] = useState("");
  const [scheduleForm, setScheduleForm] =
    useState(emptySchedule);
  const [paperForm, setPaperForm] =
    useState(emptyPaper);
  const [paperQuestions, setPaperQuestions] =
    useState([emptyQuestion]);
  const [homeworkForm, setHomeworkForm] =
    useState(emptyHomework);

  const [
    selectedScheduleId,
    setSelectedScheduleId,
  ] = useState("");
  const [
    selectedStudentId,
    setSelectedStudentId,
  ] = useState("");
  const [marksStudents, setMarksStudents] =
    useState<StudentRow[]>([]);
  const [marksQuestions, setMarksQuestions] =
    useState<QuestionRow[]>([]);
  const [marks, setMarks] = useState<
    Record<string, string>
  >({});

  const loadData = async () => {
    try {
      setLoading(true);
      setMessage("");
      const [
        examPayload,
        typeRows,
        scheduleRows,
        paperRows,
        homeworkPayload,
        roster,
        subjectRows,
      ] = await Promise.all([
        apiRequest<{
          exams?: Exam[];
        }>("/api/exams"),
        apiRequest<ExamType[]>(
          "/api/exam-types"
        ),
        apiRequest<ScheduleRow[]>(
          "/api/exam-schedule"
        ),
        apiRequest<PaperRow[]>(
          "/api/question-papers"
        ),
        apiRequest<{
          homework?: HomeworkRow[];
        }>("/api/homework"),
        apiRequest<RosterPayload>(
          "/api/roster"
        ),
        apiRequest<SubjectRow[]>(
          "/api/subjects"
        ),
      ]);

      setExams(examPayload.exams || []);
      setExamTypes(
        Array.isArray(typeRows)
          ? typeRows
          : []
      );
      setSchedules(
        Array.isArray(scheduleRows)
          ? scheduleRows
          : []
      );
      setPapers(
        Array.isArray(paperRows)
          ? paperRows
          : []
      );
      setHomework(
        homeworkPayload.homework || []
      );
      setClasses(roster.classes || []);
      setSections(roster.sections || []);
      setTeachers(roster.teachers || []);
      setSubjects(
        Array.isArray(subjectRows)
          ? subjectRows
          : []
      );
    } catch (error) {
      showMessage(
        errorMessage(error),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(
      loadData
    );
  }, []);

  const selectedSchedule =
    schedules.find(
      (schedule) =>
        String(schedule.id) ===
        selectedScheduleId
    );
  const selectedStudent =
    marksStudents.find(
      (student) =>
        String(student.id) ===
        selectedStudentId
    );

  const scheduleSections =
    filterSections(
      sections,
      scheduleForm.class_id
    );
  const paperSections = filterSections(
    sections,
    paperForm.class_id
  );
  const homeworkSections =
    filterSections(
      sections,
      homeworkForm.class_id
    );
  const filteredPapers =
    papers.filter((paper) => {
      const classOk =
        !scheduleForm.class_id ||
        String(paper.class_id) ===
          scheduleForm.class_id;
      const sectionOk =
        !scheduleForm.section_id ||
        String(paper.section_id) ===
          scheduleForm.section_id;
      const subjectOk =
        !scheduleForm.subject_id ||
        String(paper.subject_id) ===
          scheduleForm.subject_id;
      return (
        classOk &&
        sectionOk &&
        subjectOk
      );
    });

  const totalPaperMarks =
    useMemo(
      () =>
        paperQuestions.reduce(
          (sum, question) =>
            sum +
            Number(
              question.question_marks ||
                0
            ),
          0
        ),
      [paperQuestions]
    );

  const totalEnteredMarks =
    useMemo(
      () =>
        marksQuestions.reduce(
          (sum, question) =>
            sum +
            Number(
              marks[
                String(
                  question.question_id
                )
              ] || 0
            ),
          0
        ),
      [marks, marksQuestions]
    );

  const maxMarks =
    marksQuestions.reduce(
      (sum, question) =>
        sum +
        Number(
          question.question_marks || 0
        ),
      0
    );

  function showMessage(
    text: string,
    nextTone:
      | "info"
      | "success"
      | "error" = "info"
  ) {
    setMessage(text);
    setTone(nextTone);
  }

  async function refreshAfterSave(
    text: string
  ) {
    showMessage(text, "success");
    await loadData();
  }

  async function createExam() {
    if (!examForm.exam_name.trim()) {
      showMessage(
        "Exam name is required.",
        "error"
      );
      return;
    }

    await save(async () => {
      await apiRequest("/api/exams", {
        method: "POST",
        body: examForm,
      });
      setExamForm(emptyExam);
      await refreshAfterSave(
        "Exam created."
      );
    });
  }

  async function createExamType() {
    if (!examTypeName.trim()) {
      showMessage(
        "Exam type name is required.",
        "error"
      );
      return;
    }

    await save(async () => {
      await apiRequest(
        "/api/exam-types",
        {
          method: "POST",
          body: {
            exam_name:
              examTypeName.trim(),
            description:
              examTypeDescription,
          },
        }
      );
      setExamTypeName("");
      setExamTypeDescription("");
      await refreshAfterSave(
        "Exam type created."
      );
    });
  }

  async function createSchedule() {
    await save(async () => {
      await apiRequest(
        "/api/exam-schedule",
        {
          method: "POST",
          body: scheduleForm,
        }
      );
      setScheduleForm(
        emptySchedule
      );
      await refreshAfterSave(
        "Exam scheduled."
      );
    });
  }

  async function createPaper() {
    if (!paperForm.paper_name.trim()) {
      showMessage(
        "Paper name is required.",
        "error"
      );
      return;
    }

    await save(async () => {
      await apiRequest(
        "/api/question-papers",
        {
          method: "POST",
          body: {
            ...paperForm,
            total_marks:
              totalPaperMarks,
            questions:
              paperQuestions,
          },
        }
      );
      setPaperForm(emptyPaper);
      setPaperQuestions([
        emptyQuestion,
      ]);
      await refreshAfterSave(
        "Question paper created."
      );
    });
  }

  async function assignHomework() {
    await save(async () => {
      await apiRequest("/api/homework", {
        method: "POST",
        body: homeworkForm,
      });
      setHomeworkForm(
        emptyHomework
      );
      await refreshAfterSave(
        "Homework assigned."
      );
    });
  }

  async function loadMarksRoster(
    scheduleId: string
  ) {
    setSelectedScheduleId(scheduleId);
    setSelectedStudentId("");
    setMarks({});
    setMarksQuestions([]);
    setMarksStudents([]);

    const schedule =
      schedules.find(
        (item) =>
          String(item.id) === scheduleId
      );

    if (!schedule) {
      return;
    }

    try {
      setLoading(true);
      const [students, questions] =
        await Promise.all([
          apiRequest<StudentRow[]>(
            `/api/marks-entry/students?exam_schedule_id=${schedule.id}`
          ),
          schedule.question_paper_id
            ? apiRequest<
                QuestionRow[]
              >(
                `/api/marks-entry/questions?paperId=${schedule.question_paper_id}`
              )
            : Promise.resolve([]),
        ]);
      setMarksStudents(students);
      setMarksQuestions(questions);
    } catch (error) {
      showMessage(
        errorMessage(error),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveMarks() {
    if (
      !selectedSchedule ||
      !selectedStudent ||
      !selectedSchedule.question_paper_id
    ) {
      showMessage(
        "Select schedule, student, and attached question paper.",
        "error"
      );
      return;
    }

    await save(async () => {
      const result =
        await apiRequest<{
          grade?: string;
        }>("/api/marks-entry", {
          method: "POST",
          body: {
            student_id:
              selectedStudent.id,
            exam_schedule_id:
              selectedSchedule.id,
            question_paper_id:
              selectedSchedule.question_paper_id,
            entries:
              marksQuestions.map(
                (question) => ({
                  question_id:
                    question.question_id,
                  obtained_marks:
                    Number(
                      marks[
                        String(
                          question.question_id
                        )
                      ] || 0
                    ),
                  max_marks:
                    Number(
                      question.question_marks ||
                        0
                    ),
                })
              ),
          },
        });
      showMessage(
        `Marks saved. Grade ${result.grade || "-"}.`,
        "success"
      );
    });
  }

  async function save(
    operation: () => Promise<void>
  ) {
    try {
      setSaving(true);
      setMessage("");
      await operation();
    } catch (error) {
      showMessage(
        errorMessage(error),
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenShell
      title="Academics"
      subtitle="Mobile workflow parity for exams, schedules, papers, homework and marks."
    >
      {message ? (
        <StatusMessage
          message={message}
          tone={tone}
        />
      ) : null}
      {loading ? (
        <StatusMessage message="Loading live school data..." />
      ) : null}

      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() =>
              setActiveTab(tab)
            }
            style={[
              styles.tab,
              activeTab === tab &&
                styles.tabActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab &&
                  styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === "Exams" ? (
        <Panel>
          <Text style={styles.sectionTitle}>
            Create Exam
          </Text>
          <Field
            label="Exam Name"
            value={examForm.exam_name}
            onChangeText={(value) =>
              setExamForm({
                ...examForm,
                exam_name: value,
              })
            }
          />
          <SelectList
            label="Exam Type"
            value={examForm.exam_type}
            options={examTypes.map(
              (type) => ({
                label:
                  type.exam_name ||
                  `Type ${type.id}`,
                value:
                  type.exam_name || "",
              })
            )}
            onChange={(value) =>
              setExamForm({
                ...examForm,
                exam_type: value,
              })
            }
          />
          <Field
            label="Start Date"
            placeholder="YYYY-MM-DD"
            value={examForm.start_date}
            onChangeText={(value) =>
              setExamForm({
                ...examForm,
                start_date: value,
              })
            }
          />
          <Field
            label="End Date"
            placeholder="YYYY-MM-DD"
            value={examForm.end_date}
            onChangeText={(value) =>
              setExamForm({
                ...examForm,
                end_date: value,
              })
            }
          />
          <PrimaryButton
            label="Create Exam"
            loading={saving}
            onPress={createExam}
          />

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>
            Create Exam Type
          </Text>
          <Field
            label="Type Name"
            value={examTypeName}
            onChangeText={setExamTypeName}
          />
          <Field
            label="Description"
            value={examTypeDescription}
            onChangeText={
              setExamTypeDescription
            }
          />
          <SecondaryButton
            label="Add Exam Type"
            onPress={createExamType}
          />

          <RecordList
            title="Recent Exams"
            rows={exams}
            render={(exam) => (
              <ModuleCard
                key={String(exam.id)}
                title={
                  exam.exam_name ||
                  `Exam ${exam.id}`
                }
                detail={
                  exam.exam_type ||
                  "Academic exam"
                }
                value={`${exam.schedule_count || 0} schedules`}
              />
            )}
          />
        </Panel>
      ) : null}

      {activeTab === "Schedule" ? (
        <Panel>
          <Text style={styles.sectionTitle}>
            Schedule Exam
          </Text>
          <SelectList
            label="Exam"
            value={scheduleForm.exam_id}
            options={options(
              exams,
              "exam_name"
            )}
            onChange={(value) =>
              setScheduleForm({
                ...scheduleForm,
                exam_id: value,
              })
            }
          />
          <SelectList
            label="Exam Type"
            value={
              scheduleForm.exam_type_id
            }
            options={options(
              examTypes,
              "exam_name"
            )}
            onChange={(value) =>
              setScheduleForm({
                ...scheduleForm,
                exam_type_id: value,
              })
            }
          />
          <RosterSelectors
            classes={classes}
            sections={scheduleSections}
            subjects={subjects}
            classId={scheduleForm.class_id}
            sectionId={
              scheduleForm.section_id
            }
            subjectId={
              scheduleForm.subject_id
            }
            onClass={(value) =>
              setScheduleForm({
                ...scheduleForm,
                class_id: value,
                section_id: "",
                question_paper_id: "",
              })
            }
            onSection={(value) =>
              setScheduleForm({
                ...scheduleForm,
                section_id: value,
                question_paper_id: "",
              })
            }
            onSubject={(value) =>
              setScheduleForm({
                ...scheduleForm,
                subject_id: value,
                question_paper_id: "",
              })
            }
          />
          <SelectList
            label="Question Paper"
            value={
              scheduleForm.question_paper_id
            }
            options={options(
              filteredPapers,
              "paper_name"
            )}
            onChange={(value) =>
              setScheduleForm({
                ...scheduleForm,
                question_paper_id: value,
              })
            }
          />
          <Field
            label="Exam Date"
            placeholder="YYYY-MM-DD"
            value={scheduleForm.exam_date}
            onChangeText={(value) =>
              setScheduleForm({
                ...scheduleForm,
                exam_date: value,
              })
            }
          />
          <Field
            label="Start Time"
            placeholder="09:30"
            value={scheduleForm.start_time}
            onChangeText={(value) =>
              setScheduleForm({
                ...scheduleForm,
                start_time: value,
              })
            }
          />
          <Field
            label="End Time"
            placeholder="12:30"
            value={scheduleForm.end_time}
            onChangeText={(value) =>
              setScheduleForm({
                ...scheduleForm,
                end_time: value,
              })
            }
          />
          <Field
            label="Room"
            value={scheduleForm.room_no}
            onChangeText={(value) =>
              setScheduleForm({
                ...scheduleForm,
                room_no: value,
              })
            }
          />
          <PrimaryButton
            label="Schedule Exam"
            loading={saving}
            onPress={createSchedule}
          />

          <RecordList
            title="Schedules"
            rows={schedules}
            render={(schedule) => (
              <ModuleCard
                key={String(schedule.id)}
                title={
                  schedule.exam_name ||
                  schedule.exam_type_name ||
                  `Schedule ${schedule.id}`
                }
                detail={[
                  schedule.class_name,
                  schedule.section_name,
                  schedule.subject_name,
                  schedule.paper_name,
                ]
                  .filter(Boolean)
                  .join(" / ")}
                value={dateLabel(
                  schedule.exam_date
                )}
              />
            )}
          />
        </Panel>
      ) : null}

      {activeTab === "Papers" ? (
        <Panel>
          <Text style={styles.sectionTitle}>
            Question Paper Builder
          </Text>
          <Field
            label="Paper Name"
            value={paperForm.paper_name}
            onChangeText={(value) =>
              setPaperForm({
                ...paperForm,
                paper_name: value,
              })
            }
          />
          <SelectList
            label="Exam"
            value={paperForm.exam_id}
            options={options(
              exams,
              "exam_name"
            )}
            onChange={(value) =>
              setPaperForm({
                ...paperForm,
                exam_id: value,
              })
            }
          />
          <SelectList
            label="Exam Type"
            value={paperForm.exam_type_id}
            options={options(
              examTypes,
              "exam_name"
            )}
            onChange={(value) =>
              setPaperForm({
                ...paperForm,
                exam_type_id: value,
              })
            }
          />
          <RosterSelectors
            classes={classes}
            sections={paperSections}
            subjects={subjects}
            classId={paperForm.class_id}
            sectionId={paperForm.section_id}
            subjectId={paperForm.subject_id}
            onClass={(value) =>
              setPaperForm({
                ...paperForm,
                class_id: value,
                section_id: "",
              })
            }
            onSection={(value) =>
              setPaperForm({
                ...paperForm,
                section_id: value,
              })
            }
            onSubject={(value) =>
              setPaperForm({
                ...paperForm,
                subject_id: value,
              })
            }
          />
          <Field
            label="Exam Date"
            placeholder="YYYY-MM-DD"
            value={paperForm.exam_date}
            onChangeText={(value) =>
              setPaperForm({
                ...paperForm,
                exam_date: value,
              })
            }
          />
          <Field
            label="Duration Minutes"
            value={
              paperForm.duration_minutes
            }
            keyboardType="numeric"
            onChangeText={(value) =>
              setPaperForm({
                ...paperForm,
                duration_minutes: value,
              })
            }
          />
          <Field
            label="Instructions"
            multiline
            value={
              paperForm.instructions
            }
            onChangeText={(value) =>
              setPaperForm({
                ...paperForm,
                instructions: value,
              })
            }
          />
          <Text style={styles.meta}>
            Questions: {paperQuestions.length} · Total marks: {totalPaperMarks}
          </Text>
          {paperQuestions.map(
            (question, index) => (
              <View
                key={index}
                style={styles.questionBox}
              >
                <Text
                  style={
                    styles.questionTitle
                  }
                >
                  Question {index + 1}
                </Text>
                <Field
                  label="Question"
                  multiline
                  value={
                    question.question_text
                  }
                  onChangeText={(value) =>
                    updateQuestion(
                      index,
                      "question_text",
                      value
                    )
                  }
                />
                <Field
                  label="Answer / Notes"
                  multiline
                  value={
                    question.answer_text
                  }
                  onChangeText={(value) =>
                    updateQuestion(
                      index,
                      "answer_text",
                      value
                    )
                  }
                />
                <Field
                  label="Marks"
                  keyboardType="numeric"
                  value={
                    question.question_marks
                  }
                  onChangeText={(value) =>
                    updateQuestion(
                      index,
                      "question_marks",
                      value
                    )
                  }
                />
                <Field
                  label="Topic"
                  value={
                    question.topic_name
                  }
                  onChangeText={(value) =>
                    updateQuestion(
                      index,
                      "topic_name",
                      value
                    )
                  }
                />
              </View>
            )
          )}
          <SecondaryButton
            label="Add Question"
            onPress={() =>
              setPaperQuestions([
                ...paperQuestions,
                emptyQuestion,
              ])
            }
          />
          <PrimaryButton
            label="Create Question Paper"
            loading={saving}
            onPress={createPaper}
          />
          <RecordList
            title="Papers"
            rows={papers}
            render={(paper) => (
              <ModuleCard
                key={String(paper.id)}
                title={
                  paper.paper_name ||
                  `Paper ${paper.id}`
                }
                detail={[
                  paper.class_name,
                  paper.section_name,
                  paper.subject_name,
                ]
                  .filter(Boolean)
                  .join(" / ")}
                value={`${paper.question_count || 0} Q`}
              />
            )}
          />
        </Panel>
      ) : null}

      {activeTab === "Homework" ? (
        <Panel>
          <Text style={styles.sectionTitle}>
            Assign Homework
          </Text>
          <RosterSelectors
            classes={classes}
            sections={homeworkSections}
            subjects={subjects}
            classId={homeworkForm.class_id}
            sectionId={
              homeworkForm.section_id
            }
            subjectId={
              homeworkForm.subject_id
            }
            onClass={(value) =>
              setHomeworkForm({
                ...homeworkForm,
                class_id: value,
                section_id: "",
              })
            }
            onSection={(value) =>
              setHomeworkForm({
                ...homeworkForm,
                section_id: value,
              })
            }
            onSubject={(value) =>
              setHomeworkForm({
                ...homeworkForm,
                subject_id: value,
              })
            }
          />
          <SelectList
            label="Teacher"
            value={homeworkForm.teacher_id}
            options={teachers.map(
              (teacher) => ({
                label:
                  [
                    teacher.first_name,
                    teacher.last_name,
                  ]
                    .filter(Boolean)
                    .join(" ") ||
                  `Teacher ${teacher.id}`,
                value: String(
                  teacher.id
                ),
              })
            )}
            onChange={(value) =>
              setHomeworkForm({
                ...homeworkForm,
                teacher_id: value,
              })
            }
          />
          <Field
            label="Title"
            value={homeworkForm.title}
            onChangeText={(value) =>
              setHomeworkForm({
                ...homeworkForm,
                title: value,
              })
            }
          />
          <Field
            label="Due Date"
            placeholder="YYYY-MM-DD"
            value={homeworkForm.due_date}
            onChangeText={(value) =>
              setHomeworkForm({
                ...homeworkForm,
                due_date: value,
              })
            }
          />
          <Field
            label="Homework Details"
            multiline
            value={
              homeworkForm.description
            }
            onChangeText={(value) =>
              setHomeworkForm({
                ...homeworkForm,
                description: value,
              })
            }
          />
          <PrimaryButton
            label="Assign Homework"
            loading={saving}
            onPress={assignHomework}
          />
          <RecordList
            title="Recent Homework"
            rows={homework}
            render={(item) => (
              <ModuleCard
                key={String(item.id)}
                title={
                  item.title ||
                  `Homework ${item.id}`
                }
                detail={[
                  item.class_name,
                  item.section_name,
                  item.subject_name,
                  item.status,
                ]
                  .filter(Boolean)
                  .join(" / ")}
                value={dateLabel(
                  item.due_date
                )}
              />
            )}
          />
        </Panel>
      ) : null}

      {activeTab === "Marks" ? (
        <Panel>
          <Text style={styles.sectionTitle}>
            Marks Entry
          </Text>
          <SelectList
            label="Schedule"
            value={selectedScheduleId}
            options={schedules.map(
              (schedule) => ({
                label:
                  schedule.exam_name ||
                  schedule.exam_type_name ||
                  `Schedule ${schedule.id}`,
                value: String(
                  schedule.id
                ),
                detail: [
                  schedule.class_name,
                  schedule.section_name,
                  schedule.subject_name,
                ]
                  .filter(Boolean)
                  .join(" / "),
              })
            )}
            onChange={loadMarksRoster}
          />
          {selectedSchedule &&
          !selectedSchedule.question_paper_id ? (
            <StatusMessage
              tone="error"
              message="This schedule has no question paper attached."
            />
          ) : null}
          <SelectList
            label="Student"
            value={selectedStudentId}
            options={marksStudents.map(
              (student) => ({
                label:
                  studentName(student),
                value: String(
                  student.id
                ),
                detail: [
                  student.admission_number,
                  student.roll_number
                    ? `Roll ${student.roll_number}`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" / "),
              })
            )}
            onChange={setSelectedStudentId}
            emptyLabel="Select a schedule to load students"
          />
          {marksQuestions.map(
            (question, index) => {
              const key = String(
                question.question_id
              );
              return (
                <View
                  key={key}
                  style={styles.questionBox}
                >
                  <Text
                    style={
                      styles.questionTitle
                    }
                  >
                    Q{index + 1} · {question.question_marks || 0} marks
                  </Text>
                  <Text style={styles.questionText}>
                    {question.question_text ||
                      "Question text missing"}
                  </Text>
                  <Field
                    label="Obtained Marks"
                    keyboardType="numeric"
                    value={marks[key] || ""}
                    onChangeText={(value) =>
                      setMarks({
                        ...marks,
                        [key]: value,
                      })
                    }
                  />
                </View>
              );
            }
          )}
          <Text style={styles.meta}>
            Total: {totalEnteredMarks} / {maxMarks}
          </Text>
          <PrimaryButton
            label="Save Marks"
            loading={saving}
            onPress={saveMarks}
          />
        </Panel>
      ) : null}
    </ScreenShell>
  );

  function updateQuestion(
    index: number,
    key: keyof typeof emptyQuestion,
    value: string
  ) {
    setPaperQuestions((previous) =>
      previous.map(
        (question, currentIndex) =>
          currentIndex === index
            ? {
                ...question,
                [key]: value,
              }
            : question
      )
    );
  }
}

function RosterSelectors({
  classes,
  sections,
  subjects,
  classId,
  sectionId,
  subjectId,
  onClass,
  onSection,
  onSubject,
}: {
  classes: ClassRow[];
  sections: SectionRow[];
  subjects: SubjectRow[];
  classId: string;
  sectionId: string;
  subjectId: string;
  onClass: (value: string) => void;
  onSection: (value: string) => void;
  onSubject: (value: string) => void;
}) {
  return (
    <>
      <SelectList
        label="Class"
        value={classId}
        options={options(
          classes,
          "class_name"
        )}
        onChange={onClass}
      />
      <SelectList
        label="Section"
        value={sectionId}
        options={options(
          sections,
          "section_name"
        )}
        onChange={onSection}
      />
      <SelectList
        label="Subject"
        value={subjectId}
        options={options(
          subjects,
          "subject_name"
        )}
        onChange={onSubject}
      />
    </>
  );
}

function RecordList<T>({
  title,
  rows,
  render,
}: {
  title: string;
  rows: T[];
  render: (row: T) => React.ReactNode;
}) {
  return (
    <View style={styles.records}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>
      {rows.length === 0 ? (
        <Text style={styles.meta}>
          No records found.
        </Text>
      ) : (
        rows.slice(0, 12).map(render)
      )}
    </View>
  );
}

function options<T extends {
  id: IdValue;
}>(
  rows: T[],
  labelKey: keyof T
): Option[] {
  return rows
    .map((row) => ({
      label:
        String(row[labelKey] || "") ||
        `Item ${row.id}`,
      value: String(row.id),
    }))
    .filter((option) => option.value);
}

function filterSections(
  sections: SectionRow[],
  classId: string
) {
  return sections.filter(
    (section) =>
      !classId ||
      String(section.class_id) ===
        classId
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

function dateLabel(
  value?: string
) {
  if (!value) {
    return "-";
  }

  return new Date(
    value
  ).toLocaleDateString();
}

function errorMessage(
  error: unknown
) {
  return error instanceof Error
    ? error.message
    : "Something went wrong";
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tab: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tabActive: {
    borderColor: colors.gold,
    backgroundColor: colors.surfaceWarm,
  },
  tabText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  tabTextActive: {
    color: colors.gold,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 23,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  records: {
    gap: 10,
    marginTop: 6,
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },
  questionBox: {
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgSoft,
    padding: 12,
  },
  questionTitle: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: "900",
  },
  questionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
  },
});
