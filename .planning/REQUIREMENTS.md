# Requirements: Portfolio AI Chatbot

**Defined:** 2026-02-28
**Core Value:** Visitors can instantly get accurate, personalized answers about Audruey's qualifications and experience — turning passive portfolio browsing into an engaging conversation that promotes her for hiring.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Infrastructure

- [x] **INFRA-01**: Serverless API proxy (Cloudflare Worker) deployed with DeepSeek API key stored as encrypted secret
- [x] **INFRA-02**: CORS restricted to odenlerma.github.io origin only — reject all other origins
- [x] **INFRA-03**: Per-IP rate limiting enforced in the Worker (30 requests/hour)
- [x] **INFRA-04**: Worker streams DeepSeek API response back to browser via SSE

### Prompt Engineering

- [x] **PRMT-01**: System prompt contains full resume data (experience, skills, education, achievements) structured with explicit context delimiters
- [x] **PRMT-02**: System prompt enforces strict scope — chatbot answers ONLY from provided resume and website context
- [x] **PRMT-03**: Chatbot gracefully deflects out-of-scope questions with warm redirect (not rude rejection)
- [x] **PRMT-04**: Chatbot promotes Audruey's skills and experience for hiring in a professional, warm tone
- [x] **PRMT-05**: System prompt includes anti-hallucination grounding instruction — never fabricate information
- [x] **PRMT-06**: System prompt includes anti-prompt-injection defenses with structural delimiters
- [x] **PRMT-07**: Website content (projects, about section, tech stack) included in chatbot context

### Chat Widget UI

- [ ] **CHAT-01**: Floating chat widget anchored to bottom-right of viewport with open/close toggle
- [ ] **CHAT-02**: Welcome message displayed on first open with bot introduction and purpose
- [ ] **CHAT-03**: 3-4 suggested starter questions shown in empty state (clickable, disappear after first message)
- [ ] **CHAT-04**: Typing/thinking indicator displayed while waiting for API response
- [ ] **CHAT-05**: Streaming text response — tokens rendered as they arrive from the API
- [ ] **CHAT-06**: Scrollable message history within the current session
- [ ] **CHAT-07**: Input field with send button and Enter key submit support
- [x] **CHAT-08**: Error message displayed on network/API failure with friendly retry prompt
- [ ] **CHAT-09**: Mobile responsive layout — chat window adapts to mobile viewport without covering critical content
- [ ] **CHAT-10**: Widget styled to match portfolio design system (colors, fonts, glassmorphism)

### Cost Control

- [ ] **COST-01**: Per-session message cap (15-20 messages) enforced client-side with graceful limit message
- [ ] **COST-02**: DeepSeek `deepseek-chat` (V3) model used — not the expensive reasoning model (R1)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhancements

- **ENH-01**: Resume download CTA offered in-chat when context is appropriate
- **ENH-02**: Proactive bubble teaser text near chat icon ("Ask me anything about Audruey") — auto-disappears after 5 seconds
- **ENH-03**: Keyboard-first accessibility (focus management on open, Esc to close, tab navigation through starters)
- **ENH-04**: Multi-turn conversation history cap (8-10 exchanges) with context window management

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Chat history persistence across sessions | High complexity, near-zero value for portfolio context — returning visitors are rare |
| Voice input / speech recognition | Recruiters in offices/public spaces; poor browser support; embarrassing to use |
| Multi-language support | Resume and portfolio are English-only; partial translation degrades quality |
| General-purpose AI assistant mode | Defeats entire scope guardrails; conflicts with anti-hallucination core requirement |
| Contact form inside chat | Portfolio already has contact info; duplicates existing functionality |
| Chat analytics / user tracking | Requires backend infrastructure beyond GitHub Pages; privacy compliance obligations |
| File/image upload | Out of scope for Q&A chatbot; adds multimodal API requirements and security surface |
| Regenerate / edit previous messages | Adds branching state complexity; users naturally rephrase factual questions |
| OAuth or fine-tuned models | Email-based DeepSeek API is sufficient; fine-tuning adds cost with no benefit at this scale |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Complete |
| INFRA-02 | Phase 1 | Complete |
| INFRA-03 | Phase 1 | Complete |
| INFRA-04 | Phase 1 | Complete |
| PRMT-01 | Phase 2 | Complete |
| PRMT-02 | Phase 2 | Complete |
| PRMT-03 | Phase 2 | Complete |
| PRMT-04 | Phase 2 | Complete |
| PRMT-05 | Phase 2 | Complete |
| PRMT-06 | Phase 2 | Complete |
| PRMT-07 | Phase 2 | Complete |
| CHAT-01 | Phase 3 → Phase 6 | Pending |
| CHAT-02 | Phase 3 → Phase 6 | Pending |
| CHAT-03 | Phase 3 → Phase 6 | Pending |
| CHAT-04 | Phase 3 → Phase 6 | Pending |
| CHAT-05 | Phase 3 → Phase 6 | Pending |
| CHAT-06 | Phase 3 → Phase 6 | Pending |
| CHAT-07 | Phase 3 → Phase 6 | Pending |
| CHAT-08 | Phase 4 | Complete |
| CHAT-09 | Phase 3 → Phase 6 | Pending |
| CHAT-10 | Phase 3 → Phase 6 | Pending |
| COST-01 | Phase 3 → Phase 6 | Pending |
| COST-02 | Phase 3 → Phase 6 | Pending |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0
- Complete: 12 (Phase 1 + 2 + CHAT-08 via Phase 4)
- Pending: 11 (assigned to gap closure phases 5-6)

---
*Requirements defined: 2026-02-28*
*Last updated: 2026-02-28 after Phase 4 completion — CHAT-08 closed*
