# Roadmap: Portfolio AI Chatbot

## Milestones

- ✅ **v1.0 MVP** — Phases 1-6 (shipped 2026-02-28)
- 🚧 **v1.1 Chat Interface Redesign** — Phases 7-8 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-6) — SHIPPED 2026-02-28</summary>

- [x] Phase 1: Infrastructure (2/2 plans) — completed 2026-02-28
- [x] Phase 2: Prompt Engineering (2/2 plans) — completed 2026-02-28
- [x] Phase 3: Chat Widget (2/2 plans) — completed 2026-02-28
- [x] Phase 4: Fix Error Display & Retry (1/1 plan) — completed 2026-02-28
- [x] Phase 5: Fix Production Deploy (1/1 plan) — completed 2026-02-28
- [x] Phase 6: Phase 3 Verification & Cleanup (1/1 plan) — completed 2026-02-28

Full details: `.planning/milestones/v1.0-ROADMAP.md`

</details>

### 🚧 v1.1 Chat Interface Redesign (In Progress)

**Milestone Goal:** Redesign the AI chat interface to match the portfolio's light theme, remove dark mode, and elevate the chatbot from a hidden widget to the portfolio's centerpiece feature.

- [x] **Phase 7: Light Theme Redesign** - Restyle all existing chat components with the portfolio's cream/coral/blue palette, removing all dark mode SCSS — completed 2026-02-28
- [ ] **Phase 8: Chatbot Visibility & Prominence** - Add dedicated "Ask My AI" page section and elevate FAB with animation and size

## Phase Details

### Phase 7: Light Theme Redesign
**Goal**: The chat widget fully reflects the portfolio's light design system — cream backgrounds, coral/blue accents, glassmorphism bot bubbles, no trace of dark mode
**Depends on**: Phase 6 (v1.0 complete)
**Requirements**: THEME-01, THEME-02, THEME-03, THEME-04, THEME-05, THEME-06, THEME-07, THEME-08, THEME-09, RESP-02
**Success Criteria** (what must be TRUE):
  1. Visitor opens the chat widget and sees a cream (#FFF5E3) background with dark text — no dark backgrounds anywhere in the chat UI
  2. User message bubbles appear in coral (#FC5130) with white text; bot message bubbles use a translucent glassmorphism cream effect with backdrop blur
  3. The chat header displays coral-to-blue gradient accents matching the portfolio's hero section style
  4. The input area, border, and focus ring all use light-theme colors — no dark inputs or dark focus states
  5. Starter questions and the typing indicator render with portfolio accent colors on light backgrounds, and the floating widget maintains the light theme on all screen sizes
**Plans**: 1/1 complete (07-01 Light Theme SCSS Reskin)

### Phase 8: Chatbot Visibility & Prominence
**Goal**: The chatbot is the highlight of the portfolio — visitors encounter a dedicated "Ask My AI" section while scrolling and can always reach the chat via a prominent, attention-drawing FAB
**Depends on**: Phase 7
**Requirements**: VIS-01, VIS-02, VIS-03, VIS-04, VIS-05, VIS-06, RESP-01
**Success Criteria** (what must be TRUE):
  1. Scrolling down the portfolio reveals a dedicated "Ask My AI" section between the other page sections, with a headline, description, and embedded chat interface
  2. The section animates into view with a framer-motion entrance effect as the user scrolls to it
  3. The floating chat FAB is visibly larger than the previous 56px size and has a pulse or glow animation that draws the eye
  4. The FAB remains accessible and correctly positioned at all scroll depths on the page
  5. The "Ask My AI" section layout adapts cleanly for mobile screens without overflow or layout breakage
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Infrastructure | v1.0 | 2/2 | Complete | 2026-02-28 |
| 2. Prompt Engineering | v1.0 | 2/2 | Complete | 2026-02-28 |
| 3. Chat Widget | v1.0 | 2/2 | Complete | 2026-02-28 |
| 4. Fix Error Display & Retry | v1.0 | 1/1 | Complete | 2026-02-28 |
| 5. Fix Production Deploy | v1.0 | 1/1 | Complete | 2026-02-28 |
| 6. Phase 3 Verification & Cleanup | v1.0 | 1/1 | Complete | 2026-02-28 |
| 7. Light Theme Redesign | v1.1 | 1/1 | Complete | 2026-02-28 |
| 8. Chatbot Visibility & Prominence | v1.1 | 0/? | Not started | - |
