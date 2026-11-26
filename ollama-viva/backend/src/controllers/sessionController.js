import { createSession, getSession, saveSession } from "../store/sessionStore.js";
import { createQuestion } from "../services/questionService.js";
import { evaluateQuestion } from "../services/evaluationService.js";
import { buildReport } from "../services/reportService.js";

export async function startSession(req, res) {
  try {
    const session = createSession(req.body);
    const question = await createQuestion(session);
    session.questions.push(question);
    saveSession(session);

    res.status(201).json({
      sessionId: session.id,
      question: publicQuestion(question),
      questionNumber: 1,
      totalQuestions: session.totalQuestions
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function submitAnswer(req, res) {
  try {
    const session = getSession(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found." });

    const current = session.questions[session.questions.length - 1];
    if (!current || current.answer !== null)
      return res.status(400).json({ error: "No unanswered question available." });

    const answer = String(req.body.answer || "").trim();
    if (!answer) return res.status(400).json({ error: "Answer is required." });

    current.answer = answer;
    current.evaluation = await evaluateQuestion(current, answer);
    session.currentDifficulty = current.evaluation.nextDifficulty;

    const completed = session.questions.length >= session.totalQuestions;
    if (completed) {
      session.completed = true;
      saveSession(session);
      const report = await buildReport(session);
      return res.json({
        completed: true,
        evaluation: current.evaluation,
        report
      });
    }

    const next = await createQuestion(session);
    session.questions.push(next);
    saveSession(session);

    res.json({
      completed: false,
      evaluation: current.evaluation,
      nextQuestion: publicQuestion(next),
      questionNumber: session.questions.length,
      totalQuestions: session.totalQuestions
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export function getSessionDetails(req, res) {
  const session = getSession(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found." });
  res.json(session);
}

function publicQuestion(q) {
  return {
    question: q.question,
    topic: q.topic,
    difficulty: q.difficulty
  };
}
