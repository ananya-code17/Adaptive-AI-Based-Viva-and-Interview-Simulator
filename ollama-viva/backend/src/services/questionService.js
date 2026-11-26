import {
  generateQuestion,
  generateKeyPoints
} from "./llmService.js";

export async function createQuestion(session) {
  const asked = session.questions.map(q =>
    q.question.trim().toLowerCase()
  );

  for (let attempt = 0; attempt < 10; attempt++) {
    // Step 1: Generate question
    const generated = await generateQuestion({
      topic: session.topic,
      category: session.category,
      difficulty: session.currentDifficulty,
      asked
    });

    const newQuestion = generated?.question?.trim();

    if (
      !newQuestion ||
      asked.includes(newQuestion.toLowerCase())
    ) {
      console.log(
        `Invalid/duplicate question. Retrying (${attempt + 1}/10)...`
      );
      continue;
    }

    // Step 2: Generate key points separately
    const keyPointResult = await generateKeyPoints({
      question: newQuestion,
      topic: session.topic
    });

    const keyPoints = Array.isArray(keyPointResult?.keyPoints)
      ? keyPointResult.keyPoints
          .map(point => String(point).trim())
          .filter(Boolean)
      : [];

    console.log("GENERATED QUESTION:", newQuestion);
    console.log("GENERATED KEY POINTS:", keyPoints);

    // Step 3: Validate
    if (keyPoints.length >= 2) {
      return {
        question: newQuestion,
        keyPoints,
        topic: generated.topic || session.topic,
        difficulty: session.currentDifficulty,
        answer: null,
        evaluation: null
      };
    }

    console.log(
      `Invalid key points. Retrying (${attempt + 1}/5)...`
    );
  }

  throw new Error(
    "Llama could not generate a valid question. Please start a new session."
  );
}