import { useState } from "react";

export default function QuestionCard({ question, progress, onSubmit, disabled }) {
  const [answer, setAnswer] = useState("");

  function submit(e) {
    e.preventDefault();
    if (answer.trim()) onSubmit(answer);
  }

  return (
    <section className="card">
      <div className="progress">
        Question {progress.number} / {progress.total}
      </div>
      <span className="badge">{question.difficulty}</span>
      <h2>{question.question}</h2>

      <form onSubmit={submit}>
        <textarea
          rows="9"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
        />
        <button disabled={disabled || !answer.trim()}>
          Submit Answer
        </button>
      </form>
    </section>
  );
}
