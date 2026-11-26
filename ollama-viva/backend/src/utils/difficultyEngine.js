export function nextDifficulty(score, current) {
  if (score >= 8) return current === "easy" ? "medium" : "hard";
  if (score <= 4) return current === "hard" ? "medium" : "easy";
  return current;
}

export function clampDifficulty(value) {
  return ["easy", "medium", "hard"].includes(value) ? value : "easy";
}
