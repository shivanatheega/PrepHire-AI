// testEngine.js
// Verification suite to validate scoring, timing, and state rules under Node.js environment.

import { calculateResumeJdMatch, evaluateAnswer, getReadinessReport } from './src/utils/engine.js';

console.log("=========================================");
console.log("🧪 AI Mock Interview Engine Verification");
console.log("=========================================");

let testsPassed = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    testsPassed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
  }
}

// 1. Test Resume-JD Matching
try {
  console.log("\n--- Testing Resume-JD Match Logic ---");
  const resume = "React, Javascript, HTML, CSS, Git, state management, Lighthouse";
  const jd = "React, CSS, Git, responsive layouts";
  const match = calculateResumeJdMatch(resume, jd);
  
  assert(match.score > 0 && match.score <= 100, `Score is in range: ${match.score}%`);
  assert(match.matchedSkills.includes("react"), "Correctly matched 'react'");
  assert(match.missingSkills.length === 0, "No missing skills detected");

  const mismatchJd = "Python, TensorFlow, Deep Learning";
  const mismatchResult = calculateResumeJdMatch(resume, mismatchJd);
  assert(mismatchResult.score < 50, `Unmatched skills score is low: ${mismatchResult.score}%`);
} catch (e) {
  console.error("Error in Match Logic Test:", e);
}

// 2. Test Answer Evaluation Rules
try {
  console.log("\n--- Testing Answer Evaluation Logic ---");
  const sampleQuestion = {
    id: "fe_easy_1",
    type: "Conceptual",
    question: "What is the difference between state and props in React?",
    allocatedTime: 60,
    idealKeywords: ["state is mutable", "props are immutable", "component local", "passed from parent"]
  };

  // High quality response
  const goodAnswer = "State is mutable and represents component local variables. In contrast, props are immutable and are passed from parent component down to children.";
  const goodEval = evaluateAnswer(sampleQuestion, goodAnswer, 30);
  
  assert(goodEval.accuracy >= 7.0, `Good answer scores high on Accuracy: ${goodEval.accuracy}/10`);
  assert(goodEval.depth >= 5.5, `Good answer scores high on Depth: ${goodEval.depth}/10`);
  assert(goodEval.rawScore >= 7.0, `Good answer overall score is solid: ${goodEval.rawScore}/10`);

  // Low quality/Too short response
  const badAnswer = "state props difference React";
  const badEval = evaluateAnswer(sampleQuestion, badAnswer, 10);
  assert(badEval.accuracy < 5.0, `Low keyword overlap and short answer scores low on Accuracy: ${badEval.accuracy}/10`);
  assert(badEval.depth <= 3.0, `Short response scores low on Depth: ${badEval.depth}/10`);
  assert(badEval.rawScore < 5.0, `Bad answer overall score is low: ${badEval.rawScore}/10`);

  // Time Efficiency logic verification
  const quickEval = evaluateAnswer(sampleQuestion, goodAnswer, 20); // 20s out of 60s
  const slowEval = evaluateAnswer(sampleQuestion, goodAnswer, 80); // 80s out of 60s (overtime)
  
  assert(quickEval.timeEfficiency > slowEval.timeEfficiency, 
    `Faster response time efficiency (${quickEval.timeEfficiency}) is higher than overtime response (${slowEval.timeEfficiency})`
  );
} catch (e) {
  console.error("Error in Answer Evaluation Test:", e);
}

// 3. Test Readiness Report Calculation
try {
  console.log("\n--- Testing Readiness Score and Report Generation ---");
  const dummyLogs = [
    {
      questionIndex: 1,
      difficulty: "Medium",
      question: "Q1",
      answer: "A1",
      timeSpent: 30,
      allocatedTime: 60,
      evaluation: {
        accuracy: 8.0,
        clarity: 7.0,
        depth: 6.0,
        relevance: 9.0,
        timeEfficiency: 8.0,
        rawScore: 7.6,
        weightedScore: 9.12, // Medium difficulty factor = 1.2
        difficultyFactor: 1.2,
        feedback: "Good response"
      }
    },
    {
      questionIndex: 2,
      difficulty: "Hard",
      question: "Q2",
      answer: "A2",
      timeSpent: 40,
      allocatedTime: 60,
      evaluation: {
        accuracy: 9.0,
        clarity: 8.0,
        depth: 8.0,
        relevance: 9.0,
        timeEfficiency: 8.0,
        rawScore: 8.5,
        weightedScore: 12.75, // Hard difficulty factor = 1.5
        difficultyFactor: 1.5,
        feedback: "Outstanding response"
      }
    }
  ];

  const report = getReadinessReport(dummyLogs, 80);
  
  // Total weighted score = 9.12 + 12.75 = 21.87
  // Total difficulty factor = 1.2 + 1.5 = 2.7
  // Expected Score = (21.87 / 27) * 100 = 81%
  assert(report.readinessScore === 81, `Expected Readiness score calculation matches: ${report.readinessScore}% (expected 81%)`);
  assert(report.hiringReadiness.includes("Elite") || report.hiringReadiness.includes("Placement"), `Hiring status is appropriate: ${report.hiringReadiness}`);
  assert(report.strengths.length > 0, `Deduces strengths successfully: ${report.strengths.length} items`);
} catch (e) {
  console.error("Error in Report Logic Test:", e);
}

console.log("\n=========================================");
console.log(`📊 Test Results: ${testsPassed} of ${totalTests} assertions passed.`);
console.log("=========================================");

if (testsPassed === totalTests) {
  console.log("🚀 ALL TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
} else {
  console.error("❌ SOME SYSTEM CHECKS FAILED!");
  process.exit(1);
}
