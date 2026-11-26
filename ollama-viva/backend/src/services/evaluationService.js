import { evaluateAnswer } from "./llmService.js";
import { nextDifficulty } from "../utils/difficultyEngine.js";

function normalizePoints(points) {
  if (!Array.isArray(points)) return [];

  return points
    .map(point => {
      if (typeof point === "string") {
        return point.trim();
      }

      if (point && typeof point === "object") {
        return (
          point.concept ||
          point.point ||
          point.text ||
          ""
        ).toString().trim();
      }

      return "";
    })
    .filter(Boolean);
}

function calculateScore(coveredPoints, keyPoints) {
  if (!keyPoints || keyPoints.length === 0) {
    console.log("WARNING: No key points available.");
    return 0;
  }

  const covered = Math.min(
    coveredPoints.length,
    keyPoints.length
  );

  const coverage = covered / keyPoints.length;

  if (coverage >= 0.85) return 9;
  if (coverage >= 0.65) return 8;
  if (coverage >= 0.45) return 7;
  if (coverage >= 0.25) return 6;
  if (coverage > 0) return 4;

  return 0;
}

export async function evaluateQuestion(question, answer) {
  const keyPoints = question.keyPoints || [];

  const text = answer
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const coveredPoints = [];
  const missedPoints = [];

  for (const point of keyPoints) {
    const concept = String(point).toLowerCase();

    const words = concept
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(word => word.length > 3);

    const matches = words.filter(word =>
      text.includes(word)
    );

    if (
      matches.length >= 1 &&
      matches.length / words.length >= 0.3
    ) {
      coveredPoints.push(point);
    } else {
      missedPoints.push(point);
    }
  }

  const overall = calculateScore(
    coveredPoints,
    keyPoints
  );

  const feedback =
    coveredPoints.length === keyPoints.length
      ? "Good answer. You covered the expected concepts clearly."
      : coveredPoints.length > 0
        ? "Good start, but some important concepts could be explained in more detail."
        : "The answer did not clearly cover the expected concepts.";

  console.log("QUESTION:", question.question);
  console.log("EXPECTED:", keyPoints);
  console.log("COVERED:", coveredPoints);
  console.log("MISSED:", missedPoints);
  console.log("SCORE:", overall);

  return {
    coveredPoints,
    missedPoints,
    feedback,

    relevance: overall,
    accuracy: overall,
    completeness: overall,
    overall,

    nextDifficulty: nextDifficulty(
      overall,
      question.difficulty
    )
  };
}