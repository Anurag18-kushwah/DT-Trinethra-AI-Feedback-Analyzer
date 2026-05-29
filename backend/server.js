const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;
const MODEL = "llama3.2";

app.use(cors());
app.use(express.json({ limit: "5mb" }));

function createPrompt(transcript) {
  return `
You are DeepThought Trinethra AI assistant.

Analyze this supervisor feedback transcript.

Strict rules:
- Do not make fake claims.
- Use only the given transcript.
- Use exact quotes as evidence.
- Output must be valid JSON only.
- This is an AI draft. Human review is required.
- Be careful: helpful task execution is not always systems building.

Rubric:
1 Not Interested
2 Lacks Discipline
3 Motivated but Directionless
4 Careless and Inconsistent
5 Consistent Performer
6 Reliable and Productive
7 Problem Identifier
8 Problem Solver
9 Innovative and Experimental
10 Exceptional Performer

Important boundary:
Score 6 = reliable executor of assigned tasks.
Score 7 = independently identifies problems and expands scope.

KPIs:
Lead Generation, Lead Conversion, Upselling, Cross-selling, NPS, PAT, TAT, Quality

Assessment dimensions:
execution, systems_building, kpi_impact, change_management

Return JSON only in this structure:
{
  "score": {
    "value": 6,
    "label": "Reliable and Productive",
    "band": "Productivity",
    "justification": "short paragraph with evidence",
    "confidence": "low/medium/high"
  },
  "evidence": [
    {
      "quote": "exact quote from transcript",
      "signal": "positive/negative/neutral",
      "dimension": "execution/systems_building/kpi_impact/change_management",
      "interpretation": "short explanation"
    }
  ],
  "kpiMapping": [
    {
      "kpi": "TAT",
      "evidence": "evidence from transcript",
      "systemOrPersonal": "system/personal/unclear"
    }
  ],
  "gaps": [
    {
      "dimension": "systems_building",
      "detail": "missing or weak area"
    }
  ],
  "followUpQuestions": [
    {
      "question": "question for next supervisor call",
      "targetGap": "systems_building",
      "lookingFor": "what this question will reveal"
    }
  ]
}

Transcript:
${transcript}
`;
}

function parseJsonFromAI(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("AI did not return valid JSON.");
    }
    return JSON.parse(match[0]);
  }
}

app.get("/", (req, res) => {
  res.send("Trinethra Backend Working");
});

app.post("/analyze", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript || transcript.trim().length < 20) {
      return res.status(400).json({
        error: "Please enter a proper supervisor transcript."
      });
    }

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: createPrompt(transcript),
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error("Ollama is not running. Start Ollama first.");
    }

    const data = await response.json();
    const result = parseJsonFromAI(data.response);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});