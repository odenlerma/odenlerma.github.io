---
phase: 02-prompt-engineering
plan: 01
subsystem: prompt
tags: [deepseek, system-prompt, llm, persona, anti-injection, chatbot]

requires:
  - phase: 01-02
    provides: "Deployed Cloudflare Worker with SSE streaming and DeepSeek API proxy"
provides:
  - "Complete system prompt with resume data, persona, scope rules, and anti-injection defenses"
  - "SYSTEM_MESSAGE export ready for Phase 3 chat widget integration"
  - "STARTER_QUESTIONS for chat widget empty state"
affects: [phase-3, 02-02]

tech-stack:
  added: []
  patterns: ["XML-delimited system prompt sections", "Client-side prompt storage in src/data/"]

key-files:
  created:
    - src/data/chatPrompt.js
  modified: []

key-decisions:
  - "Client-side prompt in src/data/chatPrompt.js for easy iteration — prompt content is not a security secret"
  - "XML-like delimiters (<identity>, <resume_data>, <projects>, etc.) for clear section boundaries"
  - "First-person voice: Audy speaks AS Audruey, not about Audruey"
  - "Plain text only responses — no markdown formatting"
  - "Layered anti-injection: structural delimiters + explicit refusal + identity anchoring + humor deflection"

patterns-established:
  - "System prompt structure: identity -> resume_data -> projects -> website_context -> rules -> safety"
  - "Data export pattern: SYSTEM_PROMPT (string), STARTER_QUESTIONS (array), SYSTEM_MESSAGE (object)"
  - "Scope deflection pattern: acknowledge -> redirect to professional topics"

requirements-completed: [PRMT-01, PRMT-02, PRMT-03, PRMT-04, PRMT-05, PRMT-06, PRMT-07]

duration: 2min
completed: 2026-02-28
---

# Phase 2 Plan 01: System Prompt Summary

**Complete system prompt (11.4KB) with full resume data, Audy persona, scope enforcement, and layered anti-injection defenses exported from src/data/chatPrompt.js**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-28
- **Completed:** 2026-02-28
- **Tasks:** 1 auto task completed
- **Files modified:** 1

## Accomplishments
- Created src/data/chatPrompt.js with 6 XML-delimited sections
- Included full resume data: 2 work roles (LegalMatch 2024-Present, Ole Software 2018-2024), 5 key achievements, education, areas of expertise
- Included all 16 projects from portfolio with title, year, description, and tech stack
- Defined Audy persona with first-person voice, warm professional tone, no emoji
- Scope enforcement covering off-topic, unknown skills, adjacent tech, rude messages, and salary redirects
- Anti-hallucination grounding chain: "NEVER fabricate, guess, or infer"
- Anti-injection defense: explicit refusal + identity anchoring + humor deflection
- 4 starter questions exported for Phase 3 chat widget

## Task Commits

Each task was committed atomically:

1. **Task 1: Create chatPrompt.js** - `9e21251` (feat)

## Files Created/Modified
- `src/data/chatPrompt.js` - Complete system prompt with SYSTEM_PROMPT, STARTER_QUESTIONS, SYSTEM_MESSAGE exports

## Decisions Made
- Stored prompt client-side in src/data/ for easy iteration (prompt content is not secret — defense is behavioral, not secrecy)
- Used XML-like delimiters for clean section separation (prevents model confusing data with instructions)
- 11.4KB prompt size (~2800 tokens) — well within budget, leaves ample room for conversation context
- Included all 16 projects individually rather than summarizing — maximizes factual grounding

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- chatPrompt.js ready for validation in Plan 02-02
- SYSTEM_MESSAGE export ready for Phase 3 chat widget integration
- STARTER_QUESTIONS ready for Phase 3 chat widget empty state

---
*Phase: 02-prompt-engineering*
*Completed: 2026-02-28*
