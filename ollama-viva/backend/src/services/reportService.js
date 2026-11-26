import { generateReport } from "./llmService.js";

export async function buildReport(session) {
  const evaluations = session.questions
    .map(q => q.evaluation)
    .filter(Boolean);

  // Calculate actual overall score from individual question scores
  const totalScore = evaluations.reduce(
    (sum, evaluation) => sum + Number(evaluation.overall || 0),
    0
  );

  const overallScore =
    evaluations.length > 0
      ? Number((totalScore / evaluations.length).toFixed(1))
      : 0;

  // Deterministic grade
  let grade;

  if (overallScore >= 8) {
    grade = "A";
  } else if (overallScore >= 6.5) {
    grade = "B";
  } else if (overallScore >= 5) {
    grade = "C";
  } else if (overallScore >= 4) {
    grade = "D";
  } else {
    grade = "Needs Improvement";
  }

  // Deterministic readiness
  let readinessLevel;

  if (overallScore >= 8) {
    readinessLevel = "High";
  } else if (overallScore >= 6) {
    readinessLevel = "Moderate";
  } else {
    readinessLevel = "Low";
  }

  // Let AI generate only qualitative feedback
  const aiReport = await generateReport(session);

  // Override AI's numerical fields with reliable calculations
  return {
    ...aiReport,
    overallScore,
    grade,
    readinessLevel
  };
}