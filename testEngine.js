includes the core scoring utilities, the multi-role question bank, all sub-panels (Uploader, Interview Console, Report Dashboard, Log Parser Terminal), and embeds the custom dark-mode glassmorphism stylesheet dynamically. You can copy and paste this single code block directly into your `App.jsx` or any standalone online playground (like CodeSandbox or StackBlitz) to run the complete system:

```javascript
import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// 1. QUESTION BANK CATEGORIZED BY DOMAIN
// ==========================================
const questionBank = {
  "Frontend Engineer": {
    "Easy": [
      {
        "id": "fe_easy_1",
        "type": "Conceptual",
        "question": "What is the difference between state and props in React?",
        "allocatedTime": 60,
        "idealKeywords": ["state is mutable", "props are immutable", "component local", "passed from parent"],
        "guidelines": "The candidate should mention that state is managed within the component and can change, whereas props are read-only and passed down from a parent component."
      },
      {
        "id": "fe_easy_2",
        "type": "Technical",
        "question": "Explain the CSS Box Model and how box-sizing affects layout calculations.",
        "allocatedTime": 60,
        "idealKeywords": ["margin", "border", "padding", "content", "content-box", "border-box"],
        "guidelines": "Candidate must list margin, border, padding, and content. Explain that border-box includes padding and border in the width calculation."
      }
    ],
    "Medium": [
      {
        "id": "fe_med_1",
        "type": "Technical",
        "question": "How does the virtual DOM work in React, and what is the reconciliation process?",
        "allocatedTime": 90,
        "idealKeywords": ["virtual representation", "diffing algorithm", "heuristic", "reconciliation", "batch updates", "fiber"],
        "guidelines": "Should explain how React keeps a lightweight representation of UI in memory, compares it to the real DOM (diffing), and makes batch updates to minimize real DOM manipulation."
      },
      {
        "id": "fe_med_2",
        "type": "Scenario-based",
        "question": "You are building a real-time search auto-complete bar. How would you implement debounce/throttle to prevent API rate-limiting?",
        "allocatedTime": 90,
        "idealKeywords": ["setTimeout", "clearTimeout", "debounce delays execution", "throttle limits frequency", "event handler", "cleanup"],
        "guidelines": "Candidate should describe setting up a timer that resets on input changes (debounce) to delay API calls until typing pauses. Compare it with throttle."
      }
    ],
    "Hard": [
      {
        "id": "fe_hard_1",
        "type": "Scenario-based",
        "question": "Describe how you would design and optimize a virtualized list in React to render 100,000 items efficiently.",
        "allocatedTime": 120,
        "idealKeywords": ["viewport height", "item height", "windowing", "react-window", "scroll offset", "dynamic heights", "render visible only"],
        "guidelines": "Requires explaining list virtualization/windowing: rendering only elements within the viewport + buffer, using absolute positioning, and dynamic height recalculation."
      },
      {
        "id": "fe_hard_2",
        "type": "Behavioral",
        "question": "Tell me about a time you had to optimize the performance of a slow React app. What metrics did you trace, and what were the outcomes?",
        "allocatedTime": 120,
        "idealKeywords": ["Lighthouse", "Web Vitals", "LCP", "FID", "CLS", "React Profiler", "memoization", "code splitting"],
        "guidelines": "Look for a STAR structure. Must highlight measuring web vitals, identifying bottlenecks, and fixing them with React.memo, lazy loading, etc."
      }
    ]
  },
  "Backend Engineer": {
    "Easy": [
      {
        "id": "be_easy_1",
        "type": "Conceptual",
        "question": "Explain the difference between SQL and NoSQL databases. When would you use one over the other?",
        "allocatedTime": 60,
        "idealKeywords": ["relational", "schema", "document", "key-value", "ACID compliance", "scaling horizontally", "scaling vertically"],
        "guidelines": "Evaluate on explanation of relational schema/ACID properties for SQL, and schema-less flexibility/horizontal scaling for NoSQL."
      },
      {
        "id": "be_easy_2",
        "type": "Conceptual",
        "question": "What is REST, and what are the main HTTP methods used in RESTful APIs?",
        "allocatedTime": 60,
        "idealKeywords": ["GET", "POST", "PUT", "DELETE", "statelessness", "URI", "idempotency"],
        "guidelines": "Needs to explain REST as an architectural style, and list GET, POST, PUT, and DELETE."
      }
    ],
    "Medium": [
      {
        "id": "be_med_1",
        "type": "Technical",
        "question": "How do database indexes work, and what are the trade-offs of having too many indexes?",
        "allocatedTime": 90,
        "idealKeywords": ["B-Tree", "hash index", "lookup time", "insert update overhead", "read operations", "write operations", "storage cost"],
        "guidelines": "Explain that indexes speed up reads by creating reference structures (B-Trees) but slow down write operations and consume disk storage."
      },
      {
        "id": "be_med_2",
        "type": "Scenario-based",
        "question": "How would you handle race conditions in a high-concurrency ticket booking application?",
        "allocatedTime": 90,
        "idealKeywords": ["pessimistic locking", "optimistic locking", "versioning", "transactions", "Redis locks", "distributed locking"],
        "guidelines": "Candidate should address concurrency controls. Check for optimistic locks or pessimistic locks or Redis-based distributed locks."
      }
    ],
    "Hard": [
      {
        "id": "be_hard_1",
        "type": "Scenario-based",
        "question": "Design a highly available distributed session management system for a global platform handling millions of daily active users.",
        "allocatedTime": 120,
        "idealKeywords": ["sticky sessions", "Redis cluster", "stateless JWT", "replication", "partitioning", "eviction policy", "TTL"],
        "guidelines": "Verify they discuss scaling session storage: database clustering, session expiration policies, security considerations, and latency replication."
      },
      {
        "id": "be_hard_2",
        "type": "Technical",
        "question": "Explain the Event Loop model in Node.js (or async/await model in Go) and how it handles asynchronous non-blocking I/O operations.",
        "allocatedTime": 120,
        "idealKeywords": ["libuv", "thread pool", "microtasks", "macrotasks", "callbacks", "epoll/kqueue", "non-blocking", "goroutines"],
        "guidelines": "For Node, check explanation of libuv, event loop phases, and task queues. For Go, check goroutines scheduler (M:P:N model), channels, and network poller."
      }
    ]
  },
  "Fullstack Engineer": {
    "Easy": [
      {
        "id": "fs_easy_1",
        "type": "Conceptual",
        "question": "How does client-side rendering (CSR) differ from server-side rendering (SSR) in modern web apps?",
        "allocatedTime": 60,
        "idealKeywords": ["hydration", "SEO", "initial page load", "bundle size", "interactive time", "server load"],
        "guidelines": "CSR sends bare HTML and executes JS in browser; SSR renders HTML on server. SSR has better SEO and faster FCP; CSR is interactive faster after initial load."
      },
      {
        "id": "fs_easy_2",
        "type": "Technical",
        "question": "Explain the purpose of CORS (Cross-Origin Resource Sharing) and how it is enforced.",
        "allocatedTime": 60,
        "idealKeywords": ["Same-Origin Policy", "headers", "preflight request", "OPTIONS method", "Origin", "Access-Control-Allow-Origin"],
        "guidelines": "Explain CORS as a browser security mechanism, preflight requests, and setting appropriate response headers to allow requests from different origins."
      }
    ],
    "Medium": [
      {
        "id": "fs_med_1",
        "type": "Scenario-based",
        "question": "How would you secure a fullstack application? Explain authentication vs authorization and how to prevent SQL injection & XSS.",
        "allocatedTime": 90,
        "idealKeywords": ["JWT", "cookies", "bcrypt hashing", "parameterized queries", "input sanitization", "Helmet middleware", "CSP"],
        "guidelines": "Authentication is identifying user; authorization is checking permissions. Prevent SQL injection via prepared statements/ORMs; prevent XSS via output encoding."
      },
      {
        "id": "fs_med_2",
        "type": "Technical",
        "question": "Describe the lifecycle of a WebSocket connection and how it differs from HTTP polling.",
        "allocatedTime": 90,
        "idealKeywords": ["handshake", "upgrade header", "persistent TCP connection", "full-duplex", "bi-directional", "overhead reduction"],
        "guidelines": "WS starts with HTTP GET + Upgrade headers, transitions to full-duplex TCP stream. Explain efficiency gains over long polling / short polling."
      }
    ],
    "Hard": [
      {
        "id": "fs_hard_1",
        "type": "Scenario-based",
        "question": "Describe the architecture you would implement to handle large file uploads (e.g. 5GB video files) with pause/resume support from browser to cloud storage.",
        "allocatedTime": 120,
        "idealKeywords": ["multipart upload", "presigned URL", "chunks", "byte range", "S3 multipart", "Tus protocol", "checksum validation"],
        "guidelines": "Should propose slicing the file in browser, generating presigned upload URLs for chunks, uploading chunks in parallel with retries, and stitching them on server."
      },
      {
        "id": "fs_hard_2",
        "type": "Behavioral",
        "question": "Describe a scenario where you had to debug a memory leak or database deadlock in production. What was your process?",
        "allocatedTime": 120,
        "idealKeywords": ["profiling", "heap dump", "APM tools", "log analysis", "transaction isolation levels", "reproduction"],
        "guidelines": "Look for step-by-step diagnostic reasoning: metrics monitoring, isolation, heap analysis or deadlock graphs, and applying locks ordering or caching."
      }
    ]
  },
  "AI/ML Engineer": {
    "Easy": [
      {
        "id": "ai_easy_1",
        "type": "Conceptual",
        "question": "What is the difference between supervised, unsupervised, and reinforcement learning?",
        "allocatedTime": 60,
        "idealKeywords": ["labeled data", "unlabeled data", "rewards", "agent env", "clustering", "regression classification"],
        "guidelines": "Clearly define labeled data mapping, discovering hidden patterns, and learning by trial-and-error reward signals."
      },
      {
        "id": "ai_easy_2",
        "type": "Conceptual",
        "question": "What is overfitting, and how do you prevent it in neural networks?",
        "allocatedTime": 60,
        "idealKeywords": ["generalization", "dropout", "L1 L2 regularization", "early stopping", "data augmentation", "validation set"],
        "guidelines": "Overfitting happens when a model learns noise in training data. Prevent it using dropout, weight decay, early stopping, and training on more augmented data."
      }
    ],
    "Medium": [
      {
        "id": "ai_med_1",
        "type": "Technical",
        "question": "Explain the architecture and mechanism of the self-attention layer in Transformers. Why does it outperform RNNs?",
        "allocatedTime": 90,
        "idealKeywords": ["queries keys values", "dot product attention", "parallelization", "long-range dependencies", "scaling factor", "softmax"],
        "guidelines": "Explain Q, K, V calculation, scale dot-product formula, and the major advantage of global sequence access enabling parallel training."
      },
      {
        "id": "ai_med_2",
        "type": "Scenario-based",
        "question": "You are building a recommendation system for an e-commerce platform. How would you handle the cold-start problem for new users and items?",
        "allocatedTime": 90,
        "idealKeywords": ["collaborative filtering", "content-based filtering", "hybrid recommendations", "demographics", "popularity baseline", "exploration exploitation"],
        "guidelines": "Suggest using content metadata, item attributes, popularity-based fallback, and active preference elicitation."
      }
    ],
    "Hard": [
      {
        "id": "ai_hard_1",
        "type": "Scenario-based",
        "question": "Design a distributed training pipeline for a Large Language Model (e.g. 70B parameters) across multiple GPU nodes?",
        "allocatedTime": 120,
        "idealKeywords": ["data parallelism", "tensor parallelism", "pipeline parallelism", "DeepSpeed", "ZeRO stage 3", "Megatron-LM", "gradient accumulation", "all-reduce"],
        "guidelines": "Must explain 3D parallelism: tensor/model parallel, pipeline parallel, and data parallel, along with optimizer state partitioning."
      },
      {
        "id": "ai_hard_2",
        "type": "Technical",
        "question": "Explain Retrieval-Augmented Generation (RAG). What are the key bottlenecks in vector retrieval, and how would you optimize them?",
        "allocatedTime": 120,
        "idealKeywords": ["embedding models", "chunking strategies", "cosine similarity", "hierarchical navigable small world", "HNSW", "reranking", "vector index", "metadata filtering"],
        "guidelines": "Should discuss chunk size tradeoffs, embedding drift, similarity search scaling (HNSW index, IVFFlat), rerankers, and handling stale vectors in cache."
      }
    ]
  },
  "Data Analyst": {
    "Easy": [
      {
        "id": "da_easy_1",
        "type": "Conceptual",
        "question": "What is the difference between inner join, left join, and outer join in SQL?",
        "allocatedTime": 60,
        "idealKeywords": ["matching records", "all rows left", "null values", "unmatched records", "combine sets"],
        "guidelines": "Inner join returns matching rows. Left join returns all left rows plus matches. Outer join returns all rows from both tables, filling nulls for unmatched values."
      },
      {
        "id": "da_easy_2",
        "type": "Conceptual",
        "question": "What are outliers? How do you detect and handle them in a dataset?",
        "allocatedTime": 60,
        "idealKeywords": ["z-score", "IQR", "interquartile range", "whisker plot", "imputation", "clipping", "removal"],
        "guidelines": "Outliers are extreme data points. Detect via z-score or IQR. Handle via capping/clipping, removing, or transforming."
      }
    ],
    "Medium": [
      {
        "id": "da_med_1",
        "type": "Technical",
        "question": "Explain window functions in SQL. Write or explain how to compute a 7-day rolling average of daily sales.",
        "allocatedTime": 90,
        "idealKeywords": ["OVER clause", "PARTITION BY", "ORDER BY", "ROWS BETWEEN 6 PRECEDING AND CURRENT ROW", "AVG()", "analytical functions"],
        "guidelines": "Candidate must explain that window functions operate on a slice of rows without collapsing. The query must use ROWS BETWEEN 6 PRECEDING AND CURRENT ROW."
      },
      {
        "id": "da_med_2",
        "type": "Scenario-based",
        "question": "You see a 20% drop in user conversion rate week-over-week. What steps would you take to diagnose this issue?",
        "allocatedTime": 90,
        "idealKeywords": ["segmentation", "funnel analysis", "browser version", "geographic region", "device type", "data tracking bug", "campaign changes"],
        "guidelines": "First check data logging sanity. Then segment the drop: by browser, device, region, source. Perform funnel analysis to find the drop point."
      }
    ],
    "Hard": [
      {
        "id": "da_hard_1",
        "type": "Scenario-based",
        "question": "Describe how you would design an A/B test for a new feature. How do you calculate sample size, ensure statistical significance, and avoid p-hacking?",
        "allocatedTime": 120,
        "idealKeywords": ["null hypothesis", "p-value", "statistical power", "minimum detectable effect", "sample size calculation", "bonferroni correction", "type I error"],
        "guidelines": "Check for: defining hypothesis, sizing power (typically 80%) & significance (alpha=5%), MDE. Mention strict stopping rules to avoid early peaking (p-hacking) and corrections."
      },
      {
        "id": "da_hard_2",
        "type": "Technical",
        "question": "Explain Simpson's Paradox with a real-world example and how analysts can avoid drawing false conclusions from it.",
        "allocatedTime": 120,
        "idealKeywords": ["aggregated data", "subgroups", "confounding variable", "weighted average", "stratification"],
        "guidelines": "A trend appears in different groups of data but reverses when combined. Avoid it by stratifying data, analyzing subgroups, and accounting for confounders."
      }
    ]
  },
  "Product Manager": {
    "Easy": [
      {
        "id": "pm_easy_1",
        "type": "Conceptual",
        "question": "What is a Minimum Viable Product (MVP), and how do you decide what features to include in it?",
        "allocatedTime": 60,
        "idealKeywords": ["core value proposition", "user feedback", "hypothesis testing", "prioritization", "MoSCoW", "lean startup"],
        "guidelines": "Explain MVP as the simplest product release that validates hypotheses. Decide features based on core problem-solving value and critical user feedback loop."
      },
      {
        "id": "pm_easy_2",
        "type": "Conceptual",
        "question": "What metrics would you track to evaluate the health of a subscription-based product?",
        "allocatedTime": 60,
        "idealKeywords": ["churn rate", "MRR", "ARR", "LTV", "CAC", "retention rate", "NPS"],
        "guidelines": "Candidate must cover retention/churn, recurring revenue (MRR/ARR), customer acquisition cost (CAC), and customer lifetime value (LTV)."
      }
    ],
    "Medium": [
      {
        "id": "pm_med_1",
        "type": "Scenario-based",
        "question": "How do you prioritize a product roadmap when stakeholders have conflicting demands? Explain your framework.",
        "allocatedTime": 90,
        "idealKeywords": ["RICE framework", "Kano model", "effort vs impact", "strategic alignment", "customer feedback", "opportunity scoring"],
        "guidelines": "Check for structured frameworks: e.g., RICE, Kano model, or Value vs. Complexity. Emphasize business alignment."
      },
      {
        "id": "pm_med_2",
        "type": "Conceptual",
        "question": "What is Product-Market Fit (PMF) and how do you measure if a product has achieved it?",
        "allocatedTime": 90,
        "idealKeywords": ["retention plateau", "Sean Ellis rule 40 percent", "organic growth", "net promoter score", "referral loop"],
        "guidelines": "Define PMF as being in a good market with a product that can satisfy that market. Measure via retention curves, Sean Ellis test, and viral loops."
      }
    ],
    "Hard": [
      {
        "id": "pm_hard_1",
        "type": "Scenario-based",
        "question": "Your company is launching a ride-sharing service in a highly saturated city. How do you design the go-to-market (GTM) strategy and pricing model?",
        "allocatedTime": 120,
        "idealKeywords": ["network effects", "two-sided marketplace", "subsidizing driver side", "geo-targeting", "dynamic pricing", "CAC subsidies"],
        "guidelines": "Must solve the cold start in a two-sided marketplace. Propose driver incentives, hyper-local marketing, referral schemes, and competitive pricing."
      },
      {
        "id": "pm_hard_2",
        "type": "Behavioral",
        "question": "Tell me about a product you launched that failed. What went wrong, what did you learn, and how did you pivot?",
        "allocatedTime": 120,
        "idealKeywords": ["retrospective", "root cause", "post-mortem", "metrics discrepancy", "unvalidated assumptions", "customer signals"],
        "guidelines": "Evaluate on humility, analytical post-mortem, and concrete actions applied to subsequent launches."
      }
    ]
  }
};

// ==========================================
// 2. SCORING AND LOGICAL STATE ENGINES
// ==========================================
const SKILL_KEYWORDS = [
  "react", "vue", "angular", "javascript", "typescript", "html", "css", "sass", "less",
  "node", "express", "go", "golang", "python", "django", "fastapi", "sql", "nosql", "postgres",
  "postgresql", "mongodb", "redis", "memcached", "mysql", "cassandra", "aws", "gcp", "azure",
  "docker", "kubernetes", "ci/cd", "git", "rest", "restful", "graphql", "websockets", "jwt",
  "oauth", "bcrypt", "ssl", "cors", "microservices", "serverless", "system design", "distributed",
  "concurrency", "locking", "optimistic locking", "pessimistic locking", "debounce", "throttle",
  "virtual DOM", "reconciliation", "re-renders", "profiler", "lighthouse", "web vitals",
  "virtualization", "windowing", "multipart upload", "presigned URL", "tus protocol", "machine learning",
  "deep learning", "neural networks", "transformers", "attention", "attention layer", "bert", "gpt",
  "llm", "rag", "vector database", "vector search", "overfitting", "regularization", "dropout",
  "distributed training", "tensor parallel", "pipeline parallel", "data parallel", "deepspeed",
  "data analyst", "excel", "tableau", "power bi", "pandas", "numpy", "scikit-learn", "ab testing",
  "statistical significance", "p-value", "outliers", "iqr", "rolling average", "window function",
  "simpson's paradox", "product manager", "mvp", "rice", "kano", "moscow", "churn", "mrr", "arr",
  "ltv", "cac", "nps", "product-market fit", "sean ellis", "retention", "cohort analysis"
];

function calculateResumeJdMatch(resumeText, jdText) {
  if (!resumeText || !jdText) {
    return { score: 0, matchedSkills: [], missingSkills: [] };
  }
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  const jdSkills = SKILL_KEYWORDS.filter(skill => jdLower.includes(skill));
  const resumeSkills = SKILL_KEYWORDS.filter(skill => resumeLower.includes(skill));

  if (jdSkills.length === 0) {
    const overlap = resumeSkills.filter(skill => jdLower.includes(skill));
    const score = resumeSkills.length > 0 ? Math.round((overlap.length / resumeSkills.length) * 100) : 50;
    return { score: Math.min(100, Math.max(10, score)), matchedSkills: overlap, missingSkills: [] };
  }

  const matchedSkills = jdSkills.filter(skill => resumeSkills.includes(skill));
  const missingSkills = jdSkills.filter(skill => !resumeSkills.includes(skill));
  const score = Math.round((matchedSkills.length / jdSkills.length) * 100);

  return { score: Math.min(100, Math.max(10, score)), matchedSkills, missingSkills };
}

function evaluateAnswer(question, answer, timeSpent) {
  const ansLower = (answer || "").toLowerCase();
  const idealKeywords = question.idealKeywords || [];
  const allocatedTime = question.allocatedTime || 60;

  let matchedKeywords = idealKeywords.filter(keyword => ansLower.includes(keyword.toLowerCase()));
  let accuracy = idealKeywords.length > 0 ? (matchedKeywords.length / idealKeywords.length) * 10 : 1.0;
  if (ansLower.trim().split(/\s+/).length < 5) accuracy = Math.max(0.5, accuracy * 0.2);
  accuracy = Math.min(10, Math.max(1, Math.round(accuracy * 10) / 10));

  const structuralIndicators = ["because", "therefore", "firstly", "secondly", "specifically", "for example", "lead to", "impact"];
  const matchedStructures = structuralIndicators.filter(word => ansLower.includes(word));
  let clarity = 4.0;
  if (ansLower.trim().split(/\s+/).length > 25) clarity += 2.0;
  if (matchedStructures.length >= 2) clarity += 3.0;
  clarity = Math.min(10, Math.max(1, Math.round(clarity * 10) / 10));

  const wordCount = ansLower.trim().split(/\s+/).filter(w => w.length > 0).length;
  let depth = 1.0;
  if (wordCount > 10) depth = 3.0;
  if (wordCount > 30) depth = 5.0;
  if (wordCount > 60) depth = 7.5;
  if (idealKeywords.length > 0) depth = (depth * 0.6) + ((matchedKeywords.length / idealKeywords.length) * 10 * 0.4);
  depth = Math.min(10, Math.max(1, Math.round(depth * 10) / 10));

  const questionWords = question.question.toLowerCase().replace(/[?.,]/g, "").split(/\s+/).filter(w => w.length > 4);
  const matchedQuestionWords = questionWords.filter(w => ansLower.includes(w));
  let relevance = questionWords.length > 0 ? 5.0 + (matchedQuestionWords.length / questionWords.length) * 5.0 : 5.0;
  if (matchedKeywords.length === 0 && wordCount > 20) relevance = Math.max(2.0, relevance - 3.5);
  relevance = Math.min(10, Math.max(1, Math.round(relevance * 10) / 10));

  let timeEfficiency = 10;
  if (timeSpent <= 0) {
    timeEfficiency = 5.0;
  } else if (timeSpent <= allocatedTime) {
    timeEfficiency = 10 - 3 * (timeSpent / allocatedTime); 
  } else {
    timeEfficiency = Math.max(1, 7 - ((timeSpent - allocatedTime) / 10));
  }
  timeEfficiency = Math.min(10, Math.max(1, Math.round(timeEfficiency * 10) / 10));

  const rawScore = (0.3 * accuracy) + (0.2 * clarity) + (0.2 * depth) + (0.2 * relevance) + (0.1 * timeEfficiency);
  const roundedRawScore = Math.round(rawScore * 100) / 100;

  let difficultyFactor = 1.0;
  if (question.difficulty === "Medium") difficultyFactor = 1.2;
  if (question.difficulty === "Hard") difficultyFactor = 1.5;

  const weightedScore = Math.round((roundedRawScore * difficultyFactor) * 100) / 100;

  const feedback = [];
  if (accuracy >= 8.0) feedback.push(`Excellent technical accuracy! You hit key concepts: ${matchedKeywords.slice(0, 2).join(", ") || "essential definitions"}.`);
  else if (accuracy <= 5.0) feedback.push(`Accuracy needs refinement. Focus on: ${idealKeywords.slice(0, 2).join(", ")}.`);
  if (depth >= 7.5) feedback.push("Great depth and explanation density, demonstrating a solid command.");
  else feedback.push("Consider elaborating more to provide greater technical depth.");

  return { accuracy, clarity, depth, relevance, timeEfficiency, rawScore: roundedRawScore, weightedScore, difficultyFactor, feedback: feedback.join(" ") };
}

function getReadinessReport(logs, matchScore) {
  if (!logs || logs.length === 0) return { readinessScore: 0, hiringReadiness: "Not Evaluated", strengths: [], weaknesses: [], categoryAnalysis: { accuracy: 0, clarity: 0, depth: 0, relevance: 0, timeEfficiency: 0 }, actionableFeedback: "No logs found." };

  let totalWeightedScore = 0, totalDifficultyFactor = 0;
  let sumAccuracy = 0, sumClarity = 0, sumDepth = 0, sumRelevance = 0, sumTimeEfficiency = 0;

  logs.forEach(log => {
    totalWeightedScore += log.evaluation.weightedScore;
    totalDifficultyFactor += log.evaluation.difficultyFactor;
    sumAccuracy += log.evaluation.accuracy;
    sumClarity += log.evaluation.clarity;
    sumDepth += log.evaluation.depth;
    sumRelevance += log.evaluation.relevance;
    sumTimeEfficiency += log.evaluation.timeEfficiency;
  });

  const count = logs.length;
  const avgAccuracy = Math.round((sumAccuracy / count) * 10) / 10;
  const avgClarity = Math.round((sumClarity / count) * 10) / 10;
  const avgDepth = Math.round((sumDepth / count) * 10) / 10;
  const avgRelevance = Math.round((sumRelevance / count) * 10) / 10;
  const avgTimeEfficiency = Math.round((sumTimeEfficiency / count) * 10) / 10;

  let readinessScore = totalDifficultyFactor > 0 ? Math.round((totalWeightedScore / (totalDifficultyFactor * 10)) * 100) : 0;
  readinessScore = Math.min(100, Math.max(0, readinessScore));

  let hiringReadiness = "Needs Training", performanceCategory = "Needs Improvement", statusColor = "#d63500";
  if (readinessScore >= 75) performanceCategory = "Strong";
  else if (readinessScore >= 50) performanceCategory = "Average";

  if (readinessScore >= 80) { hiringReadiness = "Ready for Placement (Elite)"; statusColor = "#05c165"; }
  else if (readinessScore >= 65) { hiringReadiness = "Ready for Placement"; statusColor = "#2688ea"; }
  else if (readinessScore >= 50) { hiringReadiness = "Borderline / Needs Work"; statusColor = "#fa801c"; }

  const strengths = [];
  const weaknesses = [];

  if (avgAccuracy >= 7.0) strengths.push("Strong core conceptual accuracy and technical knowledge.");
  else weaknesses.push("Gaps in fundamental technical knowledge. Review key terms.");
  if (avgClarity >= 7.0) strengths.push("Highly structured answers with clear articulation.");
  else weaknesses.push("Unstructured explanations. Practice structuring responses using STAR framework.");
  if (avgTimeEfficiency >= 7.0) strengths.push("Effective time management under pressure.");
  else weaknesses.push("Exceeded time limits. Practice summarizing ideas concisely.");

  let actionableFeedback = "Practice is recommended.";
  if (readinessScore >= 80) actionableFeedback = "Outstanding performance! You show solid readiness for direct placement.";
  else if (readinessScore >= 65) actionableFeedback = "Good performance overall. Focus on refining structured explanations and timing limits.";

  return {
    readinessScore, hiringReadiness, performanceCategory, statusColor, strengths, weaknesses, actionableFeedback,
    categoryAnalysis: { accuracy: avgAccuracy, clarity: avgClarity, depth: avgDepth, relevance: avgRelevance, timeEfficiency: avgTimeEfficiency }
  };
}

function getNextAdaptiveQuestion(role, difficulty, askedIds) {
  const roleQuestions = questionBank[role] || questionBank["Frontend Engineer"];
  const pool = roleQuestions[difficulty] || [];
  const unasked = pool.filter(q => !askedIds.includes(q.id));
  if (unasked.length > 0) return unasked[Math.floor(Math.random() * unasked.length)];

  const difficulties = ["Easy", "Medium", "Hard"];
  const curIdx = difficulties.indexOf(difficulty);
  for (let offset of [1, -1, 2, -2]) {
    const nextDiff = difficulties[curIdx + offset];
    if (nextDiff) {
      const fallbackPool = roleQuestions[nextDiff] || [];
      const fallbackUnasked = fallbackPool.filter(q => !askedIds.includes(q.id));
      if (fallbackUnasked.length > 0) return fallbackUnasked[0];
    }
  }
  return null;
}

// ==========================================
// 3. UI PANELS & SUB-COMPONENTS
// ==========================================

const DEMO_DATA = {
  "Frontend Engineer": {
    resume: `Jane Doe\nFrontend Developer with 3 years of experience. Core skills: React, JavaScript, HTML, CSS, Git. Built responsive web applications and worked closely with backend teams on REST APIs. Experienced in state management using Redux and optimizing page load speeds using Lighthouse.`,
    jd: `Position: Frontend Engineer\nRequirements:\n- Strong proficiency in JavaScript, HTML, CSS, and modern framework React.\n- Experience with responsive design and mobile-first principles.\n- Knowledge of REST API consumption and performance profiling (Lighthouse, Web Vitals).\n- Version control with Git.`
  },
  "Backend Engineer": {
    resume: `John Smith\nBackend Engineer with 4 years of experience. Core skills: Go, Node.js, Express, SQL, Postgres, Redis, Docker, RESTful APIs. Designed relational database schemas and optimized indexing to speed up read performance. Familiar with basic distributed system patterns.`,
    jd: `Position: Backend Engineer\nRequirements:\n- Experience building scalable APIs using Node.js or Go.\n- Strong SQL knowledge and database schema design (PostgreSQL/MySQL).\n- Familiarity with caching tools like Redis.\n- Understanding of containerization with Docker and distributed locks.`
  },
  "Fullstack Engineer": {
    resume: `Alex Rivera\nFullstack Engineer. Core skills: React, Node.js, Express, JavaScript, SQL, Postgres, CORS, JWT Auth, WebSockets. Implemented secure user authentication flow with cookies, solved SQL injection vulnerabilities, and integrated full-duplex communication protocols.`,
    jd: `Position: Full Stack Developer\nRequirements:\n- Experience with React on the frontend and Node.js on the backend.\n- Understanding of web security practices (JWT, HTTPS, CORS, SQL Injection prevention).\n- Experience with real-time bi-directional protocols like WebSockets.\n- Relational database management (PostgreSQL).`
  },
  "AI/ML Engineer": {
    resume: `Dr. Sarah Lee\nAI Research Scientist. Expertise: Python, PyTorch, Transformers, Deep Learning, Neural Networks, Supervised/Unsupervised Learning, overfitting prevention, RAG, and vector databases. Built document retrieval applications and optimized model sizes with quantization.`,
    jd: `Position: AI/ML Engineer\nRequirements:\n- Strong knowledge of Machine Learning paradigms (Supervised, Unsupervised, Reinforcement).\n- Proficient with Deep Learning architectures, especially Transformers and Self-Attention.\n- Experience with modern AI techniques like Retrieval-Augmented Generation (RAG) and Vector databases.\n- Familiarity with overfitting prevention methods (Dropout, Regularization).`
  },
  "Data Analyst": {
    resume: `Bob Chen\nData Analyst. Core skills: SQL, Excel, Python, Pandas, Tableau, A/B Testing, Outliers detection, Interquartile Range (IQR). Wrote analytical SQL queries, computed rolling averages, and analyzed customer funnels.`,
    jd: `Position: Product Data Analyst\nRequirements:\n- Strong SQL skills, including analytical functions, joins, and rolling metrics.\n- Experience with A/B testing methodologies, hypothesis testing, and p-values.\n- Proficiency in outlier detection techniques (IQR, Z-Score).\n- Ability to identify customer conversion drop bottlenecks via segmentation.`
  },
  "Product Manager": {
    resume: `Emily Taylor\nTechnical Product Manager. Experienced in leading MVPs, product roadmaps using the RICE framework, and measuring subscription metrics (Churn, MRR, ARR, CAC, LTV). Achieved product-market fit for a fintech startup through cohort retention analysis.`,
    jd: `Position: Product Manager\nRequirements:\n- Ability to define and ship MVPs using rigorous prioritization frameworks (RICE, Kano).\n- Deep understanding of growth and retention metrics (MRR, Churn, ARR, CAC, LTV).\n- Experience testing and validating Product-Market Fit (PMF).\n- Strong customer-centric storytelling and cross-functional leadership.`
  }
};

function ResumeUploader({ onStartInterview }) {
  const [role, setRole] = useState("Frontend Engineer");
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handlePrefill = () => {
    const data = DEMO_DATA[role];
    if (data) { setResume(data.resume); setJd(data.jd); }
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!resume.trim() || !jd.trim()) return alert("Please fill in both fields.");
    setAnalyzing(true); setAnalysisResult(null);
    setTimeout(() => {
      setAnalysisResult(calculateResumeJdMatch(resume, jd));
      setAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="uploader-container glass">
      <h2 className="section-title">Configure Interview Session</h2>
      <p className="section-subtitle">Select target role and pre-fill or paste Resume/JD to begin.</p>
      <form onSubmit={handleAnalyze} className="uploader-form">
        <div className="form-group-row">
          <div className="form-group">
            <label>Target Role</label>
            <select value={role} onChange={(e) => { setRole(e.target.value); setAnalysisResult(null); }}>
              {Object.keys(DEMO_DATA).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button type="button" className="btn btn-secondary prefill-btn" onClick={handlePrefill}>⚡ Pre-fill Demo Data</button>
        </div>
        <div className="textareas-container">
          <div className="form-group">
            <label>Resume Content</label>
            <textarea rows="6" value={resume} onChange={e => { setResume(e.target.value); setAnalysisResult(null); }} />
          </div>
          <div className="form-group">
            <label>Job Description (JD)</label>
            <textarea rows="6" value={jd} onChange={e => { setJd(e.target.value); setAnalysisResult(null); }} />
          </div>
        </div>
        {!analysisResult && <button type="submit" className="btn btn-primary submit-btn" disabled={analyzing}>{analyzing ? 'Analyzing...' : 'Analyze Alignment'}</button>}
      </form>
      {analysisResult && (
        <div className="analysis-result-box fade-in">
          <div className="match-score-circle-wrapper">
            <div className="match-score-circle" style={{ background: `conic-gradient(var(--primary) ${analysisResult.score * 3.6}deg, var(--grey-200) 0deg)` }}>
              <div className="match-score-inner">
                <span className="score-val">{analysisResult.score}%</span>
                <span className="score-lbl">JD Match</span>
              </div>
            </div>
          </div>
          <div className="analysis-details">
            <h4>Alignment Mapping Report</h4>
            <div className="tags">
              {analysisResult.matchedSkills.map(s => <span key={s} className="tag tag-success">{s}</span>)}
              {analysisResult.missingSkills.map(s => <span key={s} className="tag tag-warning">{s}</span>)}
            </div>
            <button onClick={() => onStartInterview({ role, resume, jd, matchScore: analysisResult.score })} className="btn btn-primary start-btn">Proceed to Interview →</button>
          </div>
        </div>
      )}
    </div>
  );
}

function LogViewer({ logs, currentQuestionIndex, currentDifficulty }) {
  const [collapsed, setCollapsed] = useState(true);
  const engineState = {
    sessionState: { currentQuestionIndex, currentDifficulty, questionsAnswered: logs.length },
    structuredInterviewLogs: logs.map(l => ({
      index: l.questionIndex, difficulty: l.difficulty,
      scores: l.evaluation, feedback: l.evaluation.feedback
    }))
  };

  return (
    <div className="log-viewer">
      <div className="log-viewer-header" onClick={() => setCollapsed(!collapsed)}>
        <div className="title-wrapper">
          <span className="terminal-dot red"></span>
          <span className="terminal-dot yellow"></span>
          <span className="terminal-dot green"></span>
          <h4>Live Structured Engine Log Parser (JSON Payload)</h4>
        </div>
        <button className="collapse-toggle-btn">{collapsed ? "▲ Expand" : "▼ Collapse"}</button>
      </div>
      {!collapsed && (
        <div className="log-content-wrapper">
          <pre className="json-pre"><code>{JSON.stringify(engineState, null, 2)}</code></pre>
        </div>
      )}
    </div>
  );
}

function InterviewConsole({ sessionConfig, onInterviewEnded }) {
  const { role, matchScore } = sessionConfig;
  const [questionIndex, setQuestionIndex] = useState(1);
  const [difficulty, setDifficulty] = useState(matchScore < 40 ? "Easy" : "Medium");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [logs, setLogs] = useState([]);
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeSpent, setTimeSpent] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [avatarState, setAvatarState] = useState("thinking");
  const [interviewerText, setInterviewerText] = useState("");
  const [consecutiveFails, setConsecutiveFails] = useState(0);

  const timerRef = useRef(null);
  const totalTimerRef = useRef(null);

  useEffect(() => {
    const q = getNextAdaptiveQuestion(role, difficulty, []);
    if (q) {
      setCurrentQuestion(q); setTimeLeft(q.allocatedTime); setAvatarState("speaking");
      setInterviewerText(`Question ${questionIndex}: ${q.question}`);
      setAvatarState("listening");
    }
    totalTimerRef.current = setInterval(() => setTotalTimeSpent(prev => prev + 1), 1000);
    return () => { clearInterval(timerRef.current); clearInterval(totalTimerRef.current); };
  }, []);

  useEffect(() => {
    if (currentQuestion && avatarState === "listening") {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { handleAnswerSubmit(true); return 0; }
          return prev - 1;
        });
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentQuestion, avatarState]);

  const startMockDictation = () => {
    setIsRecording(true);
    let counter = 0;
    const keywords = currentQuestion.idealKeywords || [];
    const textSegments = [
      "Based on my architecture knowledge, ",
      `it relies on ${keywords[0] || 'core concepts'} and standard specifications. `,
      `Additionally, implementing ${keywords[1] || 'structural rules'} ensures robustness.`
    ];
    const dictationInterval = setInterval(() => {
      if (counter < textSegments.length) {
        setAnswer(prev => prev + textSegments[counter]);
        counter++;
      } else {
        clearInterval(dictationInterval); setIsRecording(false);
      }
    }, 1000);
  };

  const handleAnswerSubmit = (isTimeout = false) => {
    clearInterval(timerRef.current);
    setAvatarState("thinking");
    const text = answer.trim() || "(No response provided)";
    const evaluation = evaluateAnswer(currentQuestion, text, timeSpent);

    const newLog = { questionIndex, difficulty, question: currentQuestion.question, answer: text, timeSpent, allocatedTime: currentQuestion.allocatedTime, evaluation };
    const updatedLogs = [...logs, newLog];
    setLogs(updatedLogs);

    let nextDifficulty = difficulty;
    let newConsecutiveFails = consecutiveFails;

    if (evaluation.rawScore >= 8.0) {
      nextDifficulty = difficulty === "Easy" ? "Medium" : "Hard";
      newConsecutiveFails = 0;
    } else if (evaluation.rawScore < 5.0) {
      nextDifficulty = difficulty === "Hard" ? "Medium" : "Easy";
      newConsecutiveFails = evaluation.rawScore < 4.0 ? consecutiveFails + 1 : 0;
    } else {
      newConsecutiveFails = 0;
    }

    setConsecutiveFails(newConsecutiveFails);
    setDifficulty(nextDifficulty);
    setAnswer("");

    if (newConsecutiveFails >= 2) {
      setTimeout(() => onInterviewEnded({ logs: updatedLogs, terminationReason: "Performance Failure" }), 800);
      return;
    }
    if (questionIndex >= 5) {
      setTimeout(() => onInterviewEnded({ logs: updatedLogs, terminationReason: "Completed Successfully" }), 800);
      return;
    }

    const nextIdx = questionIndex + 1;
    setQuestionIndex(nextIdx);
    const askedIds = updatedLogs.map(l => l.id);
    const nextQ = getNextAdaptiveQuestion(role, nextDifficulty, askedIds);

    if (nextQ) {
      setCurrentQuestion(nextQ); setTimeLeft(nextQ.allocatedTime); setTimeSpent(0);
      setInterviewerText(`Question ${nextIdx} [${nextDifficulty}]: ${nextQ.question}`);
      setAvatarState("listening");
    } else {
      onInterviewEnded({ logs: updatedLogs, terminationReason: "Question Bank Exhaustion" });
    }
  };

  return (
    <div className="simulation-dashboard fade-in">
      <div className="sim-grid">
        <div className="panel interviewer-panel glass">
          <div className="panel-header">
            <h3>AI Interviewer Profile</h3>
            <span className="badge badge-primary">{difficulty} Difficulty</span>
          </div>
          <div className="avatar-wrapper">
            <div className={`avatar-pulse ${avatarState}`}>
              <div className="avatar-circle">🤖</div>
            </div>
            <span className="status-label">{avatarState === "listening" ? "Listening..." : "Thinking..."}</span>
          </div>
          <div className="speech-box">
            <p className="interviewer-speech">{interviewerText}</p>
          </div>
          {avatarState === "listening" && (
            <div className="time-tracker-card">
              <div className="timer-visual-bar"><div className="timer-fill" style={{ width: `${(timeLeft / (currentQuestion?.allocatedTime || 60)) * 100}%` }}></div></div>
              <div className="timer-labels"><span>Remaining:</span><strong>{timeLeft}s</strong></div>
            </div>
          )}
        </div>
        <div className="panel candidate-panel glass">
          <div className="panel-header">
            <h3>Response Console</h3>
            <span className="badge badge-dark">Q {questionIndex} of 5</span>
          </div>
          <div className="response-textarea-wrapper">
            <textarea value={answer} onChange={e => setAnswer(e.target.value)} disabled={avatarState !== "listening" || isRecording} rows="8" className="response-textarea" placeholder="Type answer or click dictation..." />
            {isRecording && <div className="recording-overlay"><div className="mic-pulse">🎤</div><p>Simulating Dictation...</p></div>}
          </div>
          <div className="response-controls">
            <button onClick={startMockDictation} disabled={avatarState !== "listening" || isRecording} className="btn btn-secondary">🎤 Simulated Speech</button>
            <button onClick={() => handleAnswerSubmit(false)} disabled={avatarState !== "listening" || isRecording} className="btn btn-primary">Submit Answer</button>
          </div>
        </div>
      </div>
      <div className="log-viewer-container glass"><LogViewer logs={logs} currentQuestionIndex={questionIndex} currentDifficulty={difficulty} /></div>
    </div>
  );
}

function EvaluationReport({ sessionConfig, resultData, onRestart }) {
  const { matchScore, role } = sessionConfig;
  const { logs } = resultData;
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => { setReport(getReadinessReport(logs, matchScore)); }, [logs, matchScore]);

  if (!report) return <div className="report-loading glass"><div className="spinner"></div><p>Compiling analytics...</p></div>;

  const { readinessScore, hiringReadiness, performanceCategory, statusColor, strengths, weaknesses, actionableFeedback, categoryAnalysis } = report;

  return (
    <div className="report-container fade-in">
      <div className="report-header glass">
        <div className="header-meta"><span className="meta-tag">{role}</span></div>
        <h2 className="report-title">Interview Readiness Dashboard</h2>
      </div>
      <div className="report-tabs">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab("overview")}>📊 Overview</button>
        <button className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab("details")}>📝 Question Details</button>
      </div>
      {activeTab === 'overview' && (
        <div className="tab-pane fade-in">
          <div className="overview-row">
            <div className="card score-card glass">
              <h3>Readiness Score</h3>
              <div className="gauge-text"><span className="gauge-score-value">{readinessScore}%</span></div>
              <div className="readiness-indicator-box"><span className="ind-value" style={{ color: statusColor }}>{hiringReadiness} | {performanceCategory}</span></div>
            </div>
            <div className="card metrics-card glass">
              <h3>Skill-wise Rubric Scores</h3>
              <div className="metrics-list">
                {Object.keys(categoryAnalysis).map(k => (
                  <div key={k} className="metric-row">
                    <div className="metric-info"><span style={{ textTransform: "capitalize" }}>{k}</span><strong>{categoryAnalysis[k]}/10</strong></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="feedback-row">
            <div className="card sw-card glass">
              <h4>🎉 Strengths</h4>
              <ul>{strengths.map((s, i) => <li key={i}>✓ {s}</li>)}</ul>
              <h4>⚠ Weaknesses</h4>
              <ul>{weaknesses.map((w, i) => <li key={i}>⚡ {w}</li>)}</ul>
            </div>
            <div className="card recommendation-card glass">
              <h4>🎯 Actionable Roadmap</h4>
              <p>{actionableFeedback}</p>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'details' && (
        <div className="tab-pane fade-in">
          {logs.map((l, idx) => (
            <div key={idx} className="card question-detail-card glass">
              <div className="q-card-header"><span>Q {l.questionIndex} ({l.difficulty})</span><strong>Weighted: {l.evaluation.weightedScore}</strong></div>
              <p><strong>Question:</strong> {l.question}</p>
              <p><strong>Your Answer:</strong> "{l.answer}"</p>
              <p className="evaluator-comment">🗣 {l.evaluation.feedback}</p>
            </div>
          ))}
        </div>
      )}
      <div className="report-actions"><button onClick={onRestart} className="btn btn-primary">🔄 Restart New Session</button></div>
    </div>
  );
}

// ==========================================
// 4. MAIN EXPORT AND EMBEDDED STYLESHEET
// ==========================================
export default function App() {
  const [screen, setScreen] = useState("setup");
  const [sessionConfig, setSessionConfig] = useState(null);
  const [resultData, setResultData] = useState(null);

  return (
    <div className="app-wrapper">
      {/* Dynamic Injection of Clean Dark-Mode Glassmorphism styling */}
      <style>{`
        :root {
          --bg-color: #050a18;
          --panel-bg: rgba(13, 22, 47, 0.65);
          --panel-border: rgba(255, 255, 255, 0.08);
          --text-primary: #f8fafc;
          --text-secondary: #cbd5e1;
          --text-muted: #64748b;
          --primary: #6366f1;
          --secondary: #06b6d4;
          --grey-100: #0f172a;
          --grey-200: #1e293b;
        }
        body {
          margin: 0;
          background-color: var(--bg-color);
          color: var(--text-primary);
          font-family: system-ui, -apple-system, sans-serif;
          min-height: 100vh;
        }
        .app-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
        .app-header { display: flex; justify-content: space-between; padding: 1.2rem 2.5rem; border-bottom: 1px solid var(--panel-border); background: rgba(8,13,28,0.7); backdrop-filter: blur(10px); }
        .brand-name { font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin: 0; }
        .brand-badge { font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; background: var(--grey-200); margin-left: 0.5rem; }
        .app-main { flex: 1; max-width: 1200px; margin: 0 auto; width: 100%; padding: 2rem 1.5rem; }
        .app-footer { text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.8rem; border-top: 1px solid var(--panel-border); }
        .glass { background: var(--panel-bg); border: 1px solid var(--panel-border); border-radius: 12px; backdrop-filter: blur(16px); padding: 2rem; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
        .btn { font-weight: 600; padding: 0.75rem 1.5rem; border-radius: 6px; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .btn-primary { background: var(--primary); color: #fff; }
        .btn-secondary { background: var(--grey-200); color: var(--text-primary); border: 1px solid var(--panel-border); }
        .uploader-form { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1.5rem; }
        .form-group-row { display: flex; gap: 1rem; align-items: flex-end; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
        .form-group label { font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); }
        .form-group select, .form-group textarea { background: rgba(0,0,0,0.2); border: 1px solid var(--panel-border); border-radius: 6px; padding: 0.7rem; color: #fff; font-family: inherit; font-size: 0.95rem; outline: none; }
        .textareas-container { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .analysis-result-box { display: flex; gap: 2rem; margin-top: 2rem; border-top: 1px solid var(--panel-border); padding-top: 2rem; }
        .match-score-circle { width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 6px; }
        .match-score-inner { background: var(--bg-color); width: 100%; height: 100%; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .score-val { font-size: 1.5rem; font-weight: 700; }
        .score-lbl { font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; }
        .tag { font-size: 0.75rem; padding: 0.25rem 0.5rem; border-radius: 4px; margin-right: 0.5rem; font-weight: 600; }
        .tag-success { background: rgba(16,185,129,0.15); color: #10b981; }
        .tag-warning { background: rgba(245,158,11,0.15); color: #f59e0b; }
        .sim-grid { display: grid; grid-template-columns: 320px 1fr; gap: 2rem; }
        .panel { display: flex; flex-direction: column; height: 480px; }
        .panel-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--panel-border); padding-bottom: 1rem; margin-bottom: 1rem; }
        .avatar-wrapper { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 1.5rem 0; gap: 0.5rem; }
        .avatar-pulse { width: 70px; height: 70px; border-radius: 50%; background: var(--grey-200); display: flex; align-items: center; justify-content: center; font-size: 2rem; }
        .speech-box { flex: 1; overflow-y: auto; text-align: center; font-style: italic; }
        .response-textarea-wrapper { flex: 1; position: relative; }
        .response-textarea { width: 100%; height: 80%; background: rgba(0,0,0,0.2); border: 1px solid var(--panel-border); border-radius: 8px; color: #fff; padding: 1rem; font-family: inherit; font-size: 1rem; resize: none; outline: none; }
        .response-controls { display: flex; justify-content: space-between; margin-top: 1rem; }
        .recording-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.9); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .log-viewer-container { margin-top: 2rem; }
        .log-viewer { font-family: monospace; background: #020617; border-radius: 8px; overflow: hidden; }
        .log-viewer-header { display: flex; justify-content: space-between; padding: 0.75rem 1.25rem; background: rgba(255,255,255,0.02); cursor: pointer; }
        .json-pre { font-size: 0.75rem; color: #10b981; padding: 1rem; background: #000; overflow-x: auto; max-height: 200px; }
        .report-header { margin-bottom: 1.5rem; }
        .report-tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid var(--panel-border); padding-bottom: 0.5rem; margin-bottom: 1.5rem; }
        .tab-btn { background: transparent; border: none; color: var(--text-muted); font-size: 0.95rem; font-weight: 600; padding: 0.5rem 1rem; cursor: pointer; }
        .tab-btn.active { color: var(--primary); border-bottom: 2px solid var(--primary); }
        .overview-row { display: grid; grid-template-columns: 1fr 1.5fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        .card { padding: 1.5rem; }
      `}</style>

      <header className="app-header">
        <div className="header-brand" style={{ display: "flex", alignItems: "center" }}>
          <h1 className="brand-name">PrepHire AI</h1>
          <span className="brand-badge">Interview Simulator v1.0</span>
        </div>
      </header>

      <main className="app-main">
        {screen === "setup" && (
          <ResumeUploader onStartInterview={(config) => { setSessionConfig(config); setScreen("interview"); }} />
        )}
        {screen === "interview" && (
          <InterviewConsole sessionConfig={sessionConfig} onInterviewEnded={(result) => { setResultData(result); setScreen("report"); }} />
        )}
        {screen === "report" && (
          <EvaluationReport sessionConfig={sessionConfig} resultData={resultData} onRestart={() => { setSessionConfig(null); setResultData(null); setScreen("setup"); }} />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2026 PrepHire AI Mock Interview Simulation Engine. Backed by Hack2Hire.</p>
      </footer>
    </div>
  );
}
```
