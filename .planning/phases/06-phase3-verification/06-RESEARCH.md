# Phase 6: Phase 3 Verification & Cleanup - Research

**Researched:** 2026-02-28
**Domain:** Verification, documentation, and dead code cleanup
**Confidence:** HIGH

## Summary

Phase 6 is a documentation and cleanup phase — no new features, no refactoring. The work involves: (1) creating a VERIFICATION.md that formally verifies all 11 Chat Widget + Cost Control requirements against the existing codebase, (2) updating REQUIREMENTS.md and ROADMAP.md to reflect verified completion status, and (3) removing the orphaned `export` keyword from the SYSTEM_PROMPT constant in chatPrompt.js.

All 8 chat components exist and are fully implemented. The code review confirms every requirement (CHAT-01 through CHAT-10, COST-01, COST-02) has corresponding implementation in the codebase. The verification task is straightforward — it requires citing specific file/line evidence for each requirement.

**Primary recommendation:** Create a single plan with three tasks — write VERIFICATION.md, update planning docs (REQUIREMENTS.md + ROADMAP.md), and remove orphaned export — all in one wave since there are no dependencies between the doc updates and cleanup.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Code-line citations per requirement (e.g., "CHAT-01: ChatFab.jsx:12 renders fixed bottom-right button")
- Code review only — no manual browser testing required
- Summary verdict at top (e.g., "11/11 requirements satisfied") with per-requirement details below
- Requirements backed by code implementation marked as satisfied — no need to flag as "unverifiable"
- Update REQUIREMENTS.md checkboxes: mark CHAT-01 through CHAT-10 and COST-01/COST-02 as [x]
- Update traceability table: change status from "Pending" to "Complete" for all verified requirements
- Simplify "Phase 3 → Phase 6" notation to just "Phase 3" — arrow notation served its purpose
- Update coverage summary to reflect full v1 completion (23/23 complete)
- Remove only the orphaned `export` keyword from SYSTEM_PROMPT — keep `const SYSTEM_PROMPT` as internal reference
- No broader dead code scan — phase goal is verification, not refactoring
- Update ROADMAP.md: Phase 3 status from "Executed (unverified)" to "Complete" with date
- Update ROADMAP.md: Phase 6 status to "Complete" with date

### Claude's Discretion
- Exact formatting of VERIFICATION.md sections
- Order of requirement verification (can group logically)
- Wording of summary verdict

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CHAT-01 | Floating chat widget anchored to bottom-right with open/close toggle | ChatFab.jsx renders fixed bottom-right button; style.scss .chat-fab has position:fixed, bottom:100px, right:24px |
| CHAT-02 | Welcome message on first open with bot introduction | ChatWindow.jsx useEffect dispatches ADD_SYSTEM_MESSAGE with welcome text on first open |
| CHAT-03 | 3-4 starter questions shown in empty state, clickable, disappear after first message | StarterQuestions.jsx renders 4 STARTER_QUESTIONS from chatPrompt.js; shown when messageCount===0; AnimatePresence handles exit |
| CHAT-04 | Typing/thinking indicator while waiting for API response | TypingIndicator.jsx renders 3 animated dots; MessageList.jsx showTyping logic checks isStreaming + empty bot content |
| CHAT-05 | Streaming text response — tokens rendered as they arrive | useChatApi.js reads SSE stream, dispatches APPEND_TOKEN per chunk; ChatContext.jsx APPEND_TOKEN reducer concatenates |
| CHAT-06 | Scrollable message history within session | MessageList.jsx .chat-message-list has overflow-y:auto; useEffect auto-scrolls to bottomRef |
| CHAT-07 | Input field with send button and Enter key submit | ChatInput.jsx has textarea + send button; handleKeyDown checks Enter (no shift) |
| CHAT-09 | Mobile responsive layout | style.scss @media (max-width:768px) rules for .chat-fab and .chat-window; mobile chat goes near-fullscreen |
| CHAT-10 | Widget styled to match portfolio design system | style.scss uses $primary, $secondary, $dark, $light, $font-body, $font-display, glassmorphism patterns from custom.scss |
| COST-01 | Per-session message cap (15-20) enforced client-side | ChatContext.jsx SESSION_LIMIT=18; ChatInput.jsx checks messageCount >= SESSION_LIMIT before sending |
| COST-02 | DeepSeek deepseek-chat (V3) model used | useChatApi.js sends to PROXY_URL; Worker (from Phase 1) specifies model: 'deepseek-chat' |
</phase_requirements>

## Standard Stack

Not applicable — this is a verification/documentation phase. No new libraries or tools needed.

## Architecture Patterns

### VERIFICATION.md Format Precedent

The project has established a VERIFICATION.md format through Phases 1, 2, 4, and 5. Phase 4's verification (04-VERIFICATION.md) provides the closest template since it also verifies Chat Widget requirements:

**Structure:**
1. YAML frontmatter: phase, verified date, status, score, re_verification
2. Goal Achievement > Observable Truths table (numbered, with Status + Evidence columns)
3. Required Artifacts table
4. Key Link Verification table (From → To → Via)
5. Requirements Coverage table (Requirement → Source Plan → Description → Status → Evidence)
6. Anti-Patterns Found section
7. Human Verification Required section (if applicable)
8. Gaps Summary

**Key pattern:** Use `VERIFIED` / `SATISFIED` status markers. Evidence is specific (file:line references). Score format is "X/X [noun] verified."

### Requirements & Roadmap Update Pattern

REQUIREMENTS.md uses:
- `- [x]` / `- [ ]` checkbox format for requirement list
- Traceability table with `| Requirement | Phase | Status |` columns
- Coverage summary with count totals

ROADMAP.md uses:
- Progress table: `| Phase | Plans Complete | Status | Completed |`
- Phase list: `- [x]` / `- [ ]` checkbox format

## Don't Hand-Roll

Not applicable — no code to build, only documentation updates and a single line edit.

## Common Pitfalls

### Pitfall 1: SYSTEM_PROMPT Export Removal
**What goes wrong:** Removing the entire `SYSTEM_PROMPT` declaration instead of just the `export` keyword breaks SYSTEM_MESSAGE which references it.
**Why it happens:** Misreading the cleanup scope.
**How to avoid:** Change line 10 from `export const SYSTEM_PROMPT =` to `const SYSTEM_PROMPT =`. SYSTEM_MESSAGE on line 170 still references it internally.
**Warning signs:** Build failure — SYSTEM_MESSAGE would lose its content reference.

### Pitfall 2: COST-02 Evidence Gap
**What goes wrong:** COST-02 (DeepSeek V3 model) evidence is not in the React codebase — it's in the Cloudflare Worker code deployed in Phase 1.
**Why it happens:** The model selection happens server-side in the Worker, not client-side.
**How to avoid:** Cite the Worker code from Phase 1 plans/research for COST-02 evidence, or note that the client sends to PROXY_URL which is configured to use deepseek-chat model.

### Pitfall 3: Inconsistent Status Updates
**What goes wrong:** Updating ROADMAP.md but forgetting REQUIREMENTS.md traceability table, or vice versa.
**Why it happens:** Multiple files need coordinated updates.
**How to avoid:** Update all three locations in REQUIREMENTS.md (checkboxes, traceability table, coverage summary) and both locations in ROADMAP.md (progress table, phase list checkboxes).

## Code Examples

### chatPrompt.js Line 10 — Before/After

**Before:**
```javascript
export const SYSTEM_PROMPT = `<identity>
```

**After:**
```javascript
const SYSTEM_PROMPT = `<identity>
```

The `export` is orphaned because only `SYSTEM_MESSAGE` and `STARTER_QUESTIONS` are consumed externally. `SYSTEM_PROMPT` is only used internally by `SYSTEM_MESSAGE` on line 170-173.

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection of all chat component files
- Existing VERIFICATION.md files from Phases 1, 2, 4, 5 (format precedent)
- REQUIREMENTS.md and ROADMAP.md (current state)

## Metadata

**Confidence breakdown:**
- Verification evidence: HIGH — direct code inspection of all files
- Documentation updates: HIGH — known file locations and formats
- Cleanup scope: HIGH — single-line change with clear before/after

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (stable — documentation phase)
