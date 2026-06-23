"use client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";

export default function QuestionBankPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const [editId, setEditId] = useState<number | null>(null);

  const [subjectId, setSubjectId] = useState("");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [learningOutcome, setLearningOutcome] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [bloom, setBloom] = useState("Apply");
  const [questionType, setQuestionType] = useState("Short Answer");
  const [questionText, setQuestionText] = useState("");
  const [idealAnswer, setIdealAnswer] = useState("");
  const [rubric, setRubric] = useState("");
  const [keywords, setKeywords] = useState("");
  const [marks, setMarks] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("erpUser");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadData();
  }, []);

  const isAdmin =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "SCHOOL_ADMIN";

  const loadData = async () => {
    try {
      const subjectsResponse = await fetch("/api/subjects");
      const questionsResponse = await fetch("/api/question-bank");

      const subjectsData = await subjectsResponse.json();
      const questionsData = await questionsResponse.json();

      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      setQuestions(Array.isArray(questionsData) ? questionsData : []);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditId(null);

    setSubjectId("");
    setChapter("");
    setTopic("");
    setLearningOutcome("");
    setDifficulty("Medium");
    setBloom("Apply");
    setQuestionType("Short Answer");
    setQuestionText("");
    setIdealAnswer("");
    setRubric("");
    setKeywords("");
    setMarks("");
  };

  const saveQuestion = async () => {
    try {
      const payload = {
        subject_id: subjectId,
        chapter_name: chapter,
        topic_name: topic,
        learning_outcome: learningOutcome,
        difficulty_level: difficulty,
        bloom_level: bloom,
        question_type: questionType,
        question_text: questionText,
        ideal_answer: idealAnswer,
        rubric,
        keywords: keywords
          .split(/[,;\n]/)
          .map((item) => item.trim())
          .filter(Boolean),
        max_marks: marks,
      };

      if (editId) {
        await fetch(
          "/api/question-bank/" + editId,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        await fetch(
          "/api/question-bank",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save question");
    }
  };

  const editQuestion = (question: any) => {
    setEditId(question.id);

    setSubjectId(
      String(question.subject_id || "")
    );

    setChapter(question.chapter_name || "");
    setTopic(question.topic_name || "");
    setLearningOutcome(
      question.learning_outcome || ""
    );

    setDifficulty(
      question.difficulty_level || "Medium"
    );

    setBloom(
      question.bloom_level || "Apply"
    );

    setQuestionType(
      question.question_type || "Short Answer"
    );

    setQuestionText(
      question.question_text || ""
    );

    setIdealAnswer(
      question.ideal_answer ||
        question.answer_text ||
        ""
    );
    setRubric(question.rubric || "");
    setKeywords(
      Array.isArray(question.keywords)
        ? question.keywords.join(", ")
        : question.keywords || ""
    );

    setMarks(
      String(question.max_marks || "")
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteQuestion = async (
    id: number
  ) => {
    if (!confirm("Delete Question?")) {
      return;
    }

    try {
      await fetch(
        "/api/question-bank/" + id,
        {
          method: "DELETE",
        }
      );

      loadData();
    } catch (error) {
      console.error(error);
      toast.error("Delete Failed");
    }
  };

  const getSubjectName = (
    subjectId: number
  ) => {
    const subject = subjects.find(
      (s) => s.id === subjectId
    );

    return (
      subject?.subject_name || "-"
    );
  };

  const filteredQuestions =
    questions.filter((q: any) =>
      (
        q.question_text || ""
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <Layout>
      <div className="space-y-8">

        <div className="bg-white rounded-3xl shadow p-8">
          <h1 className="text-4xl font-bold mb-8">
            Question Bank
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <select
              className="border p-3 rounded-xl"
              value={subjectId}
              onChange={(e) =>
                setSubjectId(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Subject
              </option>

              {subjects.map(
                (subject: any) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {
                      subject.subject_name
                    }
                  </option>
                )
              )}
            </select>

            <input
              className="border p-3 rounded-xl"
              placeholder="Chapter"
              value={chapter}
              onChange={(e) =>
                setChapter(
                  e.target.value
                )
              }
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Topic"
              value={topic}
              onChange={(e) =>
                setTopic(
                  e.target.value
                )
              }
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Learning Outcome"
              value={learningOutcome}
              onChange={(e) =>
                setLearningOutcome(
                  e.target.value
                )
              }
            />

            <select
              className="border p-3 rounded-xl"
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value
                )
              }
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <select
              className="border p-3 rounded-xl"
              value={bloom}
              onChange={(e) =>
                setBloom(
                  e.target.value
                )
              }
            >
              <option>Remember</option>
              <option>Understand</option>
              <option>Apply</option>
              <option>Analyze</option>
              <option>Evaluate</option>
              <option>Create</option>
            </select>

            <select
              className="border p-3 rounded-xl"
              value={questionType}
              onChange={(e) =>
                setQuestionType(
                  e.target.value
                )
              }
            >
              <option>
                Short Answer
              </option>
              <option>
                Long Answer
              </option>
              <option>MCQ</option>
            </select>

            <input
              className="border p-3 rounded-xl"
              placeholder="Marks"
              value={marks}
              onChange={(e) =>
                setMarks(
                  e.target.value
                )
              }
            />

          </div>

          <textarea
            rows={5}
            className="border p-3 rounded-xl w-full mt-4"
            placeholder="Question Text"
            value={questionText}
            onChange={(e) =>
              setQuestionText(
                e.target.value
              )
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <textarea
              rows={4}
              className="border p-3 rounded-xl w-full"
              placeholder="Ideal Answer"
              value={idealAnswer}
              onChange={(e) =>
                setIdealAnswer(
                  e.target.value
                )
              }
            />
            <textarea
              rows={4}
              className="border p-3 rounded-xl w-full"
              placeholder="Rubric"
              value={rubric}
              onChange={(e) =>
                setRubric(
                  e.target.value
                )
              }
            />
            <textarea
              rows={4}
              className="border p-3 rounded-xl w-full"
              placeholder="Keywords (comma separated)"
              value={keywords}
              onChange={(e) =>
                setKeywords(
                  e.target.value
                )
              }
            />
          </div>

          <div className="flex gap-3 mt-5">

            <button
              onClick={saveQuestion}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl"
            >
              {editId
                ? "Update Question"
                : "Save Question"}
            </button>

            {editId && (
              <button
                onClick={resetForm}
                className="bg-slate-500 text-white px-6 py-3 rounded-xl"
              >
                Cancel
              </button>
            )}

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow p-8">

          <input
            className="border p-3 rounded-xl w-full mb-6"
            placeholder="Search Question"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          <table className="w-full">

            <thead>
              <tr className="border-b">
                <th className="text-left py-3">
                  ID
                </th>
                <th className="text-left py-3">
                  Subject
                </th>
                <th className="text-left py-3">
                  Chapter
                </th>
                <th className="text-left py-3">
                  Topic
                </th>
                <th className="text-left py-3">
                  Marks
                </th>
                <th className="text-left py-3">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredQuestions.map(
                (question: any) => (
                  <tr
                    key={question.id}
                    className="border-b"
                  >

                    <td className="py-3">
                      {question.id}
                    </td>

                    <td className="py-3">
                      {getSubjectName(
                        question.subject_id
                      )}
                    </td>

                    <td className="py-3">
                      {
                        question.chapter_name
                      }
                    </td>

                    <td className="py-3">
                      {
                        question.topic_name
                      }
                    </td>

                    <td className="py-3">
                      {
                        question.max_marks
                      }
                    </td>

                    <td className="py-3 flex gap-2">

                      <button
                        onClick={() =>
                          toast.success(
                            question.question_text
                          )
                        }
                        className="bg-cyan-600 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() =>
                              editQuestion(
                                question
                              )
                            }
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              deleteQuestion(
                                question.id
                              )
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </>
                      )}

                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

      </div>
    </Layout>
  );
}
