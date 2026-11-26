export default function Evaluation({ evaluation, nextQuestion, onContinue }) {
  return (
    <section className="card">
      <h2>Answer Evaluation</h2>

      <div className="scores">
        <Score label="Relevance" value={evaluation.relevance} />
        <Score label="Accuracy" value={evaluation.accuracy} />
        <Score label="Completeness" value={evaluation.completeness} />
        <Score label="Overall" value={evaluation.overall} />
      </div>

      <h3>Feedback</h3>
      <p>{evaluation.feedback}</p>

      <h3>Missed Points</h3>
      {evaluation.missedPoints?.length
        ? <ul>{evaluation.missedPoints.map((x, i) => <li key={i}>{x}</li>)}</ul>
        : <p>No major missed points.</p>}

      <p><strong>Next difficulty:</strong> {evaluation.nextDifficulty}</p>

      {nextQuestion && (
        <>
          <hr />
          <p><strong>Next question is ready.</strong></p>
          <button onClick={onContinue}>Continue</button>
        </>
      )}
    </section>
  );
}

function Score({ label, value }) {
  return <div className="score"><strong>{value}/10</strong><span>{label}</span></div>;
}
