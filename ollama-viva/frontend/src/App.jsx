import { useState } from "react";
import { startSession, submitAnswer } from "./api";
import Setup from "./components/Setup";
import QuestionCard from "./components/QuestionCard";
import Evaluation from "./components/Evaluation";
import Report from "./components/Report";

export default function App() {
  const [stage, setStage] = useState("setup");
  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [report, setReport] = useState(null);
  const [progress, setProgress] = useState({ number: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart(data) {
    try {
      setLoading(true); setError("");
      const result = await startSession(data);
      setSessionId(result.sessionId);
      setQuestion(result.question);
      setProgress({ number: result.questionNumber, total: result.totalQuestions });
      setStage("question");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  async function handleAnswer(answer) {
    try {
      setLoading(true); setError("");
      const result = await submitAnswer(sessionId, answer);
      setEvaluation(result.evaluation);

      if (result.completed) {
        setReport(result.report);
        setStage("report");
      } else {
        setQuestion(result.nextQuestion);
        setProgress({ number: result.questionNumber, total: result.totalQuestions });
        setStage("evaluation");
      }
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  function continueToNext() {
    setEvaluation(null);
    setStage("question");
  }

  function restart() {
    setStage("setup");
    setSessionId(null);
    setQuestion(null);
    setEvaluation(null);
    setReport(null);
  }

  return (
    <main className="app">
      <header>
        <h1>Adaptive AI Viva & Interview Simulator</h1>
        <p>Practice • Get evaluated • Adapt • Improve</p>
      </header>

      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">AI is processing...</div>}

      {stage === "setup" && <Setup onStart={handleStart} disabled={loading} />}
      {stage === "question" && question && (
        <QuestionCard
          question={question}
          progress={progress}
          onSubmit={handleAnswer}
          disabled={loading}
        />
      )}
      {stage === "evaluation" && evaluation && (
        <Evaluation
          evaluation={evaluation}
          nextQuestion={question}
          onContinue={continueToNext}
        />
      )}
      {stage === "report" && report && (
        <Report report={report} onRestart={restart} />
      )}
    </main>
  );
}
