import { useState } from "react";

export default function Setup({ onStart, disabled }) {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("Technical Viva");
  const [difficulty, setDifficulty] = useState("easy");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  function submit(e) {
    e.preventDefault();
    if (!topic.trim()) return;
    onStart({ topic, category, difficulty, numberOfQuestions });
  }

  return (
    <section className="card">
      <h2>Start Your Practice Session</h2>
      <form onSubmit={submit}>
        <label>Subject / Topic</label>
        <input value={topic} onChange={e => setTopic(e.target.value)}
          placeholder="e.g. Machine Learning" />

        <label>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option>Technical Viva</option>
          <option>Job Interview</option>
          <option>Data Science Interview</option>
          <option>Software Engineering Interview</option>
        </select>

        <label>Starting Difficulty</label>
        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <label>Number of Questions</label>
        <input type="number" min="1" max="20"
          value={numberOfQuestions}
          onChange={e => setNumberOfQuestions(e.target.value)} />

        <button disabled={disabled || !topic.trim()}>Start AI Session</button>
      </form>
    </section>
  );
}
