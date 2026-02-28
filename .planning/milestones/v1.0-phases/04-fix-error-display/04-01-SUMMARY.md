---
phase: 04-fix-error-display
plan: 01
subsystem: ui
tags: [react, context, reducer, scss, chat, error-handling]

# Dependency graph
requires:
  - phase: 03-chat-widget
    provides: MessageBubble with isError rendering, ChatContext reducer, useChatApi hook with SET_ERROR dispatch
provides:
  - SET_ERROR dispatch carries botMessageId for in-place bot message update
  - SET_ERROR reducer updates bot message in place with isError: true
  - CLEAR_ERROR_MESSAGE reducer removes error bubbles from messages array
  - handleRetry dispatches CLEAR_ERROR_MESSAGE then calls sendMessage with clean apiMessages
  - Error bubble accent border (orange-red) visually distinguishing errors from bot messages
affects: [future-chat-improvements, chat-testing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "map-by-id pattern for in-place message update (mirrors APPEND_TOKEN)"
    - "filter-before-clear pattern for retry: build apiMessages before dispatching CLEAR_ERROR_MESSAGE"
    - "isError flag on message object for UI rendering differentiation"

key-files:
  created: []
  modified:
    - src/hooks/useChatApi.js
    - src/context/ChatContext.jsx
    - src/components/chat/MessageList.jsx
    - src/components/chat/style.scss

key-decisions:
  - "SET_ERROR payload changed to object { id, message } so reducer can find and update the correct bot message in place"
  - "apiMessages built before CLEAR_ERROR_MESSAGE dispatch to capture clean list without timing ambiguity"
  - "Pre-existing project-wide lint errors (AnimatedText, MasonryCard, vite.config.js) are out of scope — files not modified by this plan"

patterns-established:
  - "Error bubble: existing empty bot message converted to error bubble via SET_ERROR (eliminates orphaned empty bubble)"
  - "Retry flow: filter isError from apiMessages -> CLEAR_ERROR_MESSAGE -> sendMessage (no double bubbles)"

requirements-completed: [CHAT-08]

# Metrics
duration: 6min
completed: 2026-02-28
---

# Phase 04 Plan 01: Fix Error Display Summary

**Wired SET_ERROR to update the existing empty bot message in-place with isError: true, added CLEAR_ERROR_MESSAGE reducer, fixed handleRetry to prevent double bubbles and API context leaking — closing CHAT-08**

## Performance

- **Duration:** 6 min
- **Started:** 2026-02-28T12:36:48Z
- **Completed:** 2026-02-28T12:42:48Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- SET_ERROR dispatch in useChatApi.js now carries `{ id: botMessageId, message }` so the reducer can find and convert the existing empty bot message into an error bubble in place — no orphaned empty bubble
- CLEAR_ERROR_MESSAGE reducer added to ChatContext.jsx — filters isError messages from state.messages and clears state.error in one action
- handleRetry in MessageList.jsx updated to dispatch CLEAR_ERROR_MESSAGE and filter `!m.isError` from apiMessages before calling sendMessage — prevents double bubbles and error content from leaking into API conversation history
- `.chat-bubble--error` in style.scss now has accent border `1px solid rgba($primary, 0.3)` matching the `--limit` pattern, visually distinguishing error bubbles

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire SET_ERROR to update bot message in place and add CLEAR_ERROR_MESSAGE reducer** - `539bc7e` (feat)
2. **Task 2: Fix handleRetry to use CLEAR_ERROR_MESSAGE and verify build** - `a11c7ff` (feat)

**Plan metadata:** (pending — this summary commit)

## Files Created/Modified

- `src/hooks/useChatApi.js` - SET_ERROR payload changed to `{ id: botMessageId, message }` object
- `src/context/ChatContext.jsx` - SET_ERROR reducer updated to map-by-id with isError: true; CLEAR_ERROR_MESSAGE case added
- `src/components/chat/MessageList.jsx` - handleRetry dispatches CLEAR_ERROR_MESSAGE and filters !m.isError from apiMessages
- `src/components/chat/style.scss` - `.chat-bubble--error` gains `border: 1px solid rgba($primary, 0.3)`

## Decisions Made

- SET_ERROR payload changed to object instead of plain string so reducer has the botMessageId to find the correct message — avoids creating a second error bubble alongside the orphaned empty one
- apiMessages is built before dispatching CLEAR_ERROR_MESSAGE to avoid any state-timing ambiguity (the reference captures at render time regardless, but explicit ordering is cleaner)

## Deviations from Plan

None - plan executed exactly as written.

### Out-of-Scope Notes

Pre-existing lint errors found during `npm run lint` in unrelated files (AnimatedText.jsx, MasonryCard.jsx, ProjectCard.jsx, vite.config.js, footer, layouts, workers). These are outside the scope of this plan. Logged for awareness:
- All three JS/JSX files modified by this plan pass ESLint individually with zero errors
- Production build (`npm run build`) succeeds

## Issues Encountered

None - all changes were straightforward wire-up of existing built-but-disconnected code.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- CHAT-08 is closed: error bubbles display inline on network/API failure with orange-red accent border
- Retry button removes the error bubble and re-sends the last user message with clean API history
- No orphaned empty bot bubbles on failure
- No double bubbles on retry

## Self-Check: PASSED

- FOUND: src/hooks/useChatApi.js
- FOUND: src/context/ChatContext.jsx
- FOUND: src/components/chat/MessageList.jsx
- FOUND: src/components/chat/style.scss
- FOUND: .planning/phases/04-fix-error-display/04-01-SUMMARY.md
- FOUND commit: 539bc7e (Task 1)
- FOUND commit: a11c7ff (Task 2)

---
*Phase: 04-fix-error-display*
*Completed: 2026-02-28*
