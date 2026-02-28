# Requirements: Portfolio AI Chatbot

**Defined:** 2026-02-28
**Core Value:** Visitors can instantly get accurate, personalized answers about Audruey's qualifications and experience — turning passive portfolio browsing into an engaging conversation that promotes her for hiring.

## v1.1 Requirements

Requirements for Chat Interface Redesign milestone. Each maps to roadmap phases.

### Theme & Styling

- [x] **THEME-01**: Chat window uses light/cream background (#FFF5E3) matching portfolio palette
- [x] **THEME-02**: Chat text uses dark color (#303036) on light backgrounds
- [x] **THEME-03**: User message bubbles use coral (#FC5130) background with white text
- [x] **THEME-04**: Bot message bubbles use glassmorphism effect (translucent cream with blur)
- [x] **THEME-05**: Chat header uses gradient accents (coral-to-blue) consistent with portfolio
- [x] **THEME-06**: Input area uses light theme with matching border and focus states
- [x] **THEME-07**: All dark mode (#303036 background) styling removed from chat SCSS
- [x] **THEME-08**: Starter questions styled with portfolio accent colors on light background
- [x] **THEME-09**: Typing indicator restyled for light theme

### Visibility & Prominence

- [x] **VIS-01**: Dedicated "Ask My AI" section added to main page flow (scroll-tracked like Works/About)
- [x] **VIS-02**: Section includes headline, description text, and embedded chat interface
- [x] **VIS-03**: Floating chat FAB remains accessible from any scroll position
- [x] **VIS-04**: FAB has attention-drawing animation (pulse/glow) to encourage interaction
- [x] **VIS-05**: FAB is larger and more prominent than current 56px size
- [x] **VIS-06**: Chat section uses framer-motion entrance animation when scrolled into view

### Responsive

- [x] **RESP-01**: Chat section layout adapts for mobile screens
- [x] **RESP-02**: Floating widget maintains responsive behavior with new theme

## Future Requirements

None deferred for this milestone.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dark mode toggle | Removing dark mode entirely — portfolio is light-themed |
| Chat history persistence | Ephemeral conversations by design (from v1.0) |
| New chat functionality | This milestone is purely visual/UX — no new chat features |
| Backend/API changes | Worker proxy unchanged — UI-only milestone |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| THEME-01 | Phase 7 | Complete |
| THEME-02 | Phase 7 | Complete |
| THEME-03 | Phase 7 | Complete |
| THEME-04 | Phase 7 | Complete |
| THEME-05 | Phase 7 | Complete |
| THEME-06 | Phase 7 | Complete |
| THEME-07 | Phase 7 | Complete |
| THEME-08 | Phase 7 | Complete |
| THEME-09 | Phase 7 | Complete |
| VIS-01 | Phase 8 | Complete |
| VIS-02 | Phase 8 | Complete |
| VIS-03 | Phase 8 | Complete |
| VIS-04 | Phase 8 | Complete |
| VIS-05 | Phase 8 | Complete |
| VIS-06 | Phase 8 | Complete |
| RESP-01 | Phase 8 | Complete |
| RESP-02 | Phase 7 | Complete |

**Coverage:**
- v1.1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-28*
*Last updated: 2026-02-28 after Phase 8 completion*
