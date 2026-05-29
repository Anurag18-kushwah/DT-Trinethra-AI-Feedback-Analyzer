# Trinethra AI Feedback Analyzer 🧠

## A Human-in-the-loop AI System for Supervisor Feedback Analysis

---

## Why I Built This

Supervisor feedback contains valuable signals about a person's growth, but raw conversations are difficult to evaluate because they contain:

- Personal opinions
- Incomplete information
- Recent event bias
- Confusion between hard work and real impact

A person can be very helpful and still not create scalable systems.

The goal of this project is not to replace a psychology intern or evaluator.

The goal is:

> Use AI as a thinking partner that organizes information, highlights evidence, and helps humans make better decisions.

---

# What The Application Does

The system takes a supervisor feedback transcript and converts it into a structured analysis report.

Input:

```
Unstructured Supervisor Conversation
```

Output:

```
✓ Evidence Extraction
✓ Rubric Based Score
✓ KPI Mapping
✓ Missing Growth Areas
✓ Follow-up Questions
✓ Confidence Level
```

---

# My Approach

Before writing code, I divided the problem into 3 questions:

## 1. What information can AI safely identify?

AI is good at:
- Finding patterns
- Organizing text
- Extracting signals

So I used it for:

- Evidence identification
- Classification
- Question generation


## 2. Where should AI NOT make decisions?

AI can hallucinate or overjudge people.

Therefore:

AI does NOT give the final decision.

The final reviewer remains human.

---

## 3. How to control hallucination?

Instead of asking:

```
Rate this employee
```

I designed the prompt around:

```
Find evidence → Map evidence → Identify gaps → Suggest questions
```

This reduces unsupported assumptions.

---

# System Architecture

```
                 Supervisor Transcript

                         ↓

                  React Frontend

                         ↓

                Express Backend API

                         ↓

              Prompt Engineering Layer

                         ↓

            Hallucination Guardrails

                         ↓

              Ollama Local LLM

                         ↓

              Structured JSON Output

                         ↓

              Human Review Dashboard
```

---

# Tech Stack

## Frontend

- React.js
- Vite
- CSS

Reason:

Fast development and simple interactive UI.

---

## Backend

- Node.js
- Express.js

Responsibilities:

- Receive transcript
- Build AI prompt
- Communicate with Ollama
- Validate response

---

## AI Layer

- Ollama
- Llama 3.2

Why local LLM?

- Data privacy
- No external API dependency
- Better experimentation control

---

# Evaluation Logic

The AI evaluates using the provided performance levels:

| Score | Meaning |
|---|---|
|1-3| Needs Attention |
|4-6| Productivity |
|7-10| Performance |

A special focus was given to the difficult boundary:

## Score 6 vs Score 7

### Score 6:
A person executes assigned work reliably.

Example:

"He completes all tasks given by supervisor"

### Score 7:
A person identifies problems independently.

Example:

"He found a recurring issue and created a process to fix it"

---

# KPI Understanding

The system tries to connect feedback with measurable outcomes:

- Lead Generation
- Lead Conversion
- Upselling
- Cross Selling
- NPS
- PAT
- TAT
- Quality

If KPI impact is unclear, the AI marks uncertainty instead of assuming.

---

# AI Hallucination Control

## Guardrail 1: Evidence First Approach

Every conclusion requires transcript evidence.

AI is instructed:

```
Do not assume facts outside the transcript.
```

---

## Guardrail 2: Exact Quote Extraction

Instead of only giving opinions:

Wrong:

```
He is a great leader.
```

Correct:

```
Quote:
"He created a tracking sheet"

Interpretation:
Shows process improvement.
```

---

## Guardrail 3: Confidence Level

AI provides confidence:

- Low
- Medium
- High

Low confidence means more human validation is needed.

---

## Guardrail 4: Human-in-Control

The UI clearly mentions:

```
AI Suggestion Only — Human Review Required
```

AI supports decision making.

It does not replace humans.

---

# Biases Considered

## Halo Effect

One positive story should not decide the complete score.


## Recency Bias

Recent performance should not hide older patterns.


## Presence Bias

Being available all the time is not always equal to creating impact.


## Helpfulness Bias

Helping everyone is different from building scalable systems.

---

# Challenges I Faced

## Challenge 1:
LLMs sometimes generate explanations instead of structured data.

### Solution:
Created strict JSON response format.


---

## Challenge 2:
AI tries to fill missing information.

### Solution:
Added negative prompting:

```
If evidence is missing,
mark it as a gap.
Do not imagine.
```

---

## What I Would Improve Next

Given more time:

- Add transcript history comparison
- Store previous evaluations
- Add confidence visualization
- Add multiple model comparison
- Add evaluator feedback loop

---

# Running The Project

## Install frontend dependencies

```bash
npm install
```

---

## Install backend dependencies

```bash
cd backend
npm install
```

---

## Start Ollama

```bash
ollama run llama3.2
```

---

## Start Backend

```bash
cd backend
node server.js
```

---

## Start Frontend

```bash
npm run dev
```

---

# Final Thought

This project follows the idea:

> AI should increase human thinking ability, not replace human thinking.

The strongest systems are created when AI handles information processing and humans handle judgment.
