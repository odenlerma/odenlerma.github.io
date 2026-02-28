---
phase: 08-chatbot-visibility-prominence
plan: 01
subsystem: ui
tags: [react, framer-motion, react-bootstrap, chat, scss]

requires:
  - phase: 07-light-theme-redesign
    provides: Light-themed chat widget styles
provides:
  - Dedicated "Ask My AI" scroll section with embedded inline chat
  - Shared ChatProvider between inline chat and floating widget
  - Bottom nav integration with 5th AI Chat item
  - AskAiLayout component with staggered entrance animation
affects: []

tech-stack:
  added: []
  patterns:
    - ChatProvider lifted to App.jsx for cross-component state sharing
    - InlineChat as non-floating chat variant reusing MessageList + ChatInput

key-files:
  created:
    - src/components/chat/InlineChat.jsx
    - src/layouts/AskAiLayout/index.jsx
  modified:
    - src/App.jsx
    - src/components/chat/index.jsx
    - src/components/chat/style.scss
    - src/pages/HomePage/index.jsx
    - src/components/bottom-nav/index.jsx

key-decisions:
  - "ChatProvider lifted from CHAT_WIDGET to App.jsx — enables shared conversation state between inline and floating chat"
  - "InlineChat triggers welcome message on mount (not gated on isOpen like ChatWindow)"

patterns-established:
  - "Layout components imported directly in HomePage, not barrel-exported"
  - "Section scroll tracking via useInView with getActiveSection() priority ordering"

requirements-completed: [VIS-01, VIS-02, VIS-06, RESP-01]

duration: 5min
completed: 2026-02-28
---

# Plan 08-01: Ask My AI Section & Shared Chat Context Summary

**Dedicated "Ask My AI" scroll section with inline chat, shared ChatProvider state, staggered framer-motion entrance, and bottom nav tracking**

## Performance

- **Duration:** 5 min
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- ChatProvider lifted to App.jsx so inline chat and floating widget share conversation state
- InlineChat component created reusing MessageList + ChatInput with immediate welcome message
- AskAiLayout built with staggered fade-up animation (headline -> description -> chat, 0.15s delay)
- Section integrated into HomePage between About and Footer with useInView tracking
- Bottom nav updated with 5th AI Chat item (coral color, chat-dots icon)

## Task Commits

1. **Task 1: Lift ChatProvider to App.jsx** - `14c10af` (feat)
2. **Task 2: Create AskAiLayout with staggered entrance** - `bf0bfd4` (feat)
3. **Task 3: Integrate section into HomePage and bottom nav** - `386de3a` (feat)

## Files Created/Modified
- `src/components/chat/InlineChat.jsx` - Non-floating chat interface for section embedding
- `src/layouts/AskAiLayout/index.jsx` - Centered layout with gradient headline and staggered entrance
- `src/App.jsx` - ChatProvider wrapper added around all children
- `src/components/chat/index.jsx` - ChatProvider removed from CHAT_WIDGET
- `src/components/chat/style.scss` - Added .ask-ai-section, .ask-ai__headline, .inline-chat styles
- `src/pages/HomePage/index.jsx` - Added ask-ai section with useInView tracking
- `src/components/bottom-nav/index.jsx` - Added AI Chat nav item

## Decisions Made
- ChatProvider lifted to App.jsx rather than creating a second provider — ensures true shared state
- InlineChat dispatches welcome message on mount (useEffect with messages.length guard) rather than requiring isOpen

## Deviations from Plan
None - plan executed exactly as written

## Issues Encountered
None

## Next Phase Readiness
- Ask My AI section complete and functional
- Ready for FAB glow animation (Plan 08-02)

---
*Phase: 08-chatbot-visibility-prominence*
*Completed: 2026-02-28*
