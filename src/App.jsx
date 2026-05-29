import { useState } from "react";
import "./App.css";

function App() {
  const [transcript, setTranscript] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sampleTranscript = `Karthik? Haan, he is good. Very sincere boy. Comes on time, leaves on time — actually he stays late most days, I don't ask him to. He's always on the floor.

He helps me with production tracking. Earlier I used to maintain everything in my head. Now Karthik maintains a sheet. Every evening he updates it and sends it to me on WhatsApp.

The new drum brake line — he's been involved from the beginning. He did a study on cycle times and suggested we move the deburring station closer to the CNC machines. Good idea. Saved maybe 10 minutes per batch.

One thing — he doesn't really push back. If I tell him to do something, he does it. Even if it's not the best way.`;

  async function runAnalysis() {
    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ transcript })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="page">
      <div className="hero">
        <h1>Trinethra AI Feedback Analyzer</h1>
        <p>
          AI-generated draft analysis for supervisor feedback. Human review is required.
        </p>
      </div>

      <div className="card">
        <div className="top-row">
          <h2>Supervisor Transcript</h2>
          <button className="secondary" onClick={() => setTranscript(sampleTranscript)}>
            Load Sample
          </button>
        </div>

        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste supervisor transcript here..."
        />

        <button className="primary" onClick={runAnalysis} disabled={loading}>
          {loading ? "Analyzing..." : "Run Analysis"}
        </button>

        {error && <p className="error">{error}</p>}
      </div>

      {analysis && (
        <div className="result">
          <div className="warning">
            AI Suggestion Only — Psychology Intern Must Review
          </div>

          <section className="card">
            <h2>Rubric Score</h2>
            <h3>
              {analysis.score?.value}/10 — {analysis.score?.label}
            </h3>
            <p>{analysis.score?.justification}</p>
            <p>
              <b>Confidence:</b> {analysis.score?.confidence}
            </p>
          </section>

          <section className="card">
            <h2>Extracted Evidence</h2>
            {analysis.evidence?.map((item, index) => (
              <div className="item" key={index}>
                <b>{item.signal} | {item.dimension}</b>
                <p>"{item.quote}"</p>
                <p>{item.interpretation}</p>
              </div>
            ))}
          </section>

          <section className="card">
            <h2>KPI Mapping</h2>
            {analysis.kpiMapping?.map((item, index) => (
              <div className="item" key={index}>
                <b>{item.kpi}</b>
                <p>{item.evidence}</p>
                <p>Type: {item.systemOrPersonal}</p>
              </div>
            ))}
          </section>

          <section className="card">
            <h2>Gap Analysis</h2>
            {analysis.gaps?.map((gap, index) => (
              <div className="item" key={index}>
                <b>{gap.dimension}</b>
                <p>{gap.detail}</p>
              </div>
            ))}
          </section>

          <section className="card">
            <h2>Suggested Follow-up Questions</h2>
            {analysis.followUpQuestions?.map((q, index) => (
              <div className="item" key={index}>
                <b>Question {index + 1}</b>
                <p>{q.question}</p>
                <small>
                  Gap: {q.targetGap} | Looking for: {q.lookingFor}
                </small>
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;