export function calculateCampusHealth(
  students: number,
  teachers: number,
  attendance: number,
  exams: number,
  questionPapers: number
) {

  let score = 0;

  score += students > 0 ? 20 : 0;

  score += teachers > 0 ? 20 : 0;

  score += attendance > 0 ? 20 : 0;

  score += exams > 0 ? 20 : 0;

  score += questionPapers > 0 ? 20 : 0;

  return score;
}
