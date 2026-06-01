# PrepHire AI - Mock Interview Simulation Engine

PrepHire AI is a state-aware, dynamic **AI Mock Interview Simulation Engine** built for the **UnsaidTalks Hack2Hire Hackathon** on Unstop. The platform evaluates technical candidates on resume alignment, job descriptions, time management, and core technical competencies.

---

## 📸 Project Demonstration (Video Submission)

> [!IMPORTANT]
> **Mandatory Screen-Recording Placeholder**  
> Insert your live, working project screen-recording demonstration below:
> 
> [Replace this link with your recorded video or embed a Youtube/Loom link]

---

## ✨ Core Features & Requirements Coverage

The engine meets all the specific requirements from the **UnsaidTalks Hack2Hire** evaluation rubric:

| Hackathon Requirement | Implementation Details in PrepHire AI |
| :--- | :--- |
| **Varying Difficulty Levels** | Supports **Easy**, **Medium**, and **Hard** questions across 6 tech domains. |
| **Dynamic Difficulty Adaptation** | Increments difficulty for strong responses (Score $\ge 8.0/10$) and decrements for weaker responses (Score $< 5.0/10$). |
| **Strict Time Constraints** | Fixed per-question timers with dynamic overtime penalties calculated in the scoring math. |
| **Early Interview Termination** | Instantly truncates session on 2 consecutive failing scores ($< 4.0/10$) or if the session exceeds 10 minutes. |
| **Objective Scoring Mechanism** | Answers are scored out of 10 on 5 dimensions: **Accuracy** ($30\%$), **Clarity** ($20\%$), **Depth** ($20\%$), **Relevance** ($20\%$), and **Time Efficiency** ($10\%$). |
| **Readiness score Report** | Computes the final normalized **Interview Readiness Score (0-100%)** and visual metric breakdown charts. |
| **Actionable Feedback & Roadmap** | Generates a detailed strengths/weaknesses breakdown and customized next-step roadmaps. |

---

## 🛠 Tech Stack

*   **Frontend**: React (Vite)
*   **Styling**: Vanilla CSS (Tailored dark mode, glassmorphism, responsive grids, and keyframe visual animations)
*   **State & Engine Logic**: Javascript ES6 Modules
*   **Verification**: Custom Node.js assertion suite

---

## 📂 Project Architecture

```
interview-simulation-engine/
├── index.html                  # Main SEO optimized HTML entry point
├── testEngine.js               # Standalone test runner verifying state mechanics
├── src/
│   ├── main.jsx                # React root entry point
│   ├── App.jsx                 # App controller & routing state
│   ├── index.css               # Core styling tokens, animations, and design layout
│   ├── components/
│   │   ├── ResumeUploader.jsx  # Resume-JD analyzer and match calibrator
│   │   ├── InterviewConsole.jsx# Stateful Interview interface, countdowns, and voice dictation
│   │   ├── EvaluationReport.jsx# Analytical dashboard, SVG gauge, strengths/weaknesses cards
│   │   └── LogViewer.jsx       # Terminal component outputting the live structured log payload
│   └── utils/
│       ├── questionBank.js     # Indexed question pool across roles, types, and difficulty rubrics
│       └── engine.js           # Scoring algorithms, adaptive scaling, and log formatting
└── package.json                # Project dependencies and startup script configurations
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18+ or v20+ recommended).

### Installation
1. Navigate to the project root:
   ```bash
   cd interview-simulation-engine
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App
1. Start the local development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to the address shown in your console (usually `http://localhost:5173`).

### Running the Engine Validation Tests
Run the standalone unit test suite to inspect scoring equations and transition rules:
```bash
node testEngine.js
```
All tests should execute successfully:
```
=========================================
🧪 AI Mock Interview Engine Verification
=========================================
...
📊 Test Results: 14 of 14 assertions passed.
🚀 ALL TESTS PASSED SUCCESSFULLY!
```
