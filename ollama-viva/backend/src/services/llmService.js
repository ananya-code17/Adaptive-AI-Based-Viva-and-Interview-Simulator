import OpenAI from "openai";

const client = new OpenAI({
  baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
  apiKey: "ollama"
});

function extractJson(text, fallback = {}) {
  let cleaned = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.slice(start, end + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.log("LLM RAW RESPONSE:");
    console.log(text);

    return fallback;
  }
}

async function callLLM(system, user, maxTokens = 300, fallback = {}) {
  try {
    const response = await client.chat.completions.create({
      model: process.env.OLLAMA_MODEL || "llama3.2:1b",
      temperature: 0.1,
      max_tokens: maxTokens,
      response_format: {
        type: "json_object"
      },
      messages: [
        {
          role: "system",
          content: system
        },
        {
          role: "user",
          content: user
        }
      ]
    });

    const content =
      response.choices?.[0]?.message?.content || "";

    return extractJson(content, fallback);

  } catch (error) {
    console.log("LLM ERROR:", error.message);
    return fallback;
  }
}


export async function generateQuestion({
  topic,
  category,
  difficulty,
  asked = []
}) {
  return callLLM(
    `You are an expert technical viva examiner.

Generate exactly ONE new viva question.

Rules:
- The question must be directly related to the given topic.
- The question must match the requested difficulty.
- The question must test a DIFFERENT concept from all previous questions.
- Do NOT repeat any previous question.
- Do NOT rephrase or paraphrase a previous question.
- Do NOT ask about the same concept using different wording.
- Keep the question concise and suitable for a student viva.
- Return ONLY valid JSON.

Format:
{
  "question": "your question",
  "topic": "${topic}"
}`,
    `Topic: ${topic}
Category: ${category}
Difficulty: ${difficulty}

Previous questions:
${asked.length > 0 ? asked.map((q, i) => `${i + 1}. ${q}`).join("\n") : "None"}

Generate a completely new question testing a different concept.`,
    120,
    {
      question: "",
      topic
    }
  );
}

export async function generateKeyPoints({ question, topic }) {
  return callLLM(
    `You are an expert viva examiner.

Generate exactly 3 independent key concepts that a student's answer should mention to properly answer the question.

Rules:
- Each key point must be a distinct concept.
- Do NOT repeat the same concept in different words.
- Do NOT combine two concepts into one key point.
- Do NOT give generic terms such as "understanding", "explanation", or "knowledge".
- Do NOT include the question itself.
- Keep each key point short, preferably 1-5 words.
- The key points must be directly relevant to the question.
- Return ONLY valid JSON.

Format:
{
  "keyPoints": [
    "concept 1",
    "concept 2",
    "concept 3"
  ]
}`,
    `Topic: ${topic}

Question: ${question}`,
    120,
    {
      keyPoints: []
    }
  );
}

export async function evaluateAnswer({
  question,
  keyPoints,
  answer
}) {
  return callLLM(
    `You are evaluating a student's technical viva answer.

Compare the student's answer with EACH expected concept.

For each concept:
- covered = true ONLY if the student's answer clearly explains that concept.
- covered = false if the concept is not explained.
- Do NOT require the exact same words.
- Different wording with the same meaning counts as covered.
- Do NOT judge the student's answer based on the concept name alone.

IMPORTANT:
Return exactly ONE result for EVERY expected concept.

Return ONLY valid JSON in this exact format:

{
  "results": [
    {
      "concept": "exact expected concept",
      "covered": true
    },
    {
      "concept": "exact expected concept",
      "covered": false
    }
  ],
  "feedback": "short feedback"
}

Expected concepts:
${JSON.stringify(keyPoints)}

Student answer:
${JSON.stringify(answer)}`,
    
    JSON.stringify({
      question,
      expectedKeyPoints: keyPoints,
      studentAnswer: answer
    }),

    300,

    {
      results: keyPoints.map(point => ({
        concept: point,
        covered: false
      })),
      feedback: "Answer evaluated based on the expected concepts."
    }
  );
}


export async function generateReport(session) {
  const evaluations = session.questions
    .map((q, index) => ({
      questionNumber: index + 1,
      question: q.question,
      difficulty: q.difficulty,
      evaluation: q.evaluation,
      keyPoints: q.keyPoints
    }))
    .filter(item => item.evaluation);

  // Collect actual covered and missed concepts
  const covered = [];
  const missed = [];

  evaluations.forEach(item => {
    (item.evaluation.coveredPoints || []).forEach(point => {
      if (!covered.includes(point)) covered.push(point);
    });

    (item.evaluation.missedPoints || []).forEach(point => {
      if (!missed.includes(point)) missed.push(point);
    });
  });

  // Calculate the actual average score
  const scores = evaluations.map(item =>
    Number(item.evaluation.overall || 0)
  );

  const overallScore =
    scores.length > 0
      ? Number(
          (
            scores.reduce((sum, score) => sum + score, 0) /
            scores.length
          ).toFixed(1)
        )
      : 0;

  // Generate report directly from the actual evaluation
  let strengths = [];
  let weaknesses = [];
  let topicsToRevise = [];
  let readinessLevel;
  let summary;

  if (covered.length > 0) {
    strengths = covered.slice(0, 5).map(
      point => `Covered ${point}.`
    );
  }

  if (missed.length > 0) {
    weaknesses = missed.slice(0, 5).map(
      point => `Needs better understanding of ${point}.`
    );

    topicsToRevise = missed.slice(0, 5);
  }

  if (overallScore >= 8) {
    readinessLevel = "High";
    summary =
      "The candidate demonstrated strong understanding of the concepts and covered most expected points.";
  } else if (overallScore >= 6) {
    readinessLevel = "Moderate";
    summary =
      "The candidate demonstrated a reasonable understanding of the concepts but missed some expected points.";
  } else {
    readinessLevel = "Low";
    summary =
      "The candidate demonstrated partial understanding but missed several expected concepts.";
  }

  return {
    strengths,
    weaknesses,
    topicsToRevise,
    readinessLevel,
    summary
  };
}