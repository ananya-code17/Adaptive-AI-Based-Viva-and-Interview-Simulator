export default function Report({ report, onRestart }) {
  return (
    <section className="card">
      <h2>Final Performance Report</h2>

      <div className="finalScore">
        {report.overallScore}/10
        <small>{report.grade}</small>
      </div>

      <h3>Summary</h3>
      <p>{report.summary}</p>

      <h3>Strengths</h3>
      <ul>{report.strengths?.map((x, i) => <li key={i}>{x}</li>)}</ul>

      <h3>Weaknesses</h3>
      <ul>{report.weaknesses?.map((x, i) => <li key={i}>{x}</li>)}</ul>

      <h3>Topics to Revise</h3>
      <ul>{report.topicsToRevise?.map((x, i) => <li key={i}>{x}</li>)}</ul>

      <h3>Readiness Level</h3>
      <p>{report.readinessLevel}</p>

      <button onClick={onRestart}>Start New Session</button>
    </section>
  );
}
