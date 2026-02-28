# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Portfolio AI Chatbot MVP

**Shipped:** 2026-02-28
**Phases:** 6 | **Plans:** 9 | **Sessions:** ~4

### What Was Built
- Secured Cloudflare Worker proxy with CORS lockdown, two-tier rate limiting, SSE streaming
- System prompt with full resume data, 7 requirement categories validated via 32 automated API tests
- Chat widget UI — 8 components with framer-motion animations, glassmorphism styling, mobile responsive
- End-to-end SSE streaming pipeline from DeepSeek API through Worker to browser
- Error display with inline error bubbles and functional retry flow
- Production deployment pipeline with GitHub Actions secret injection

### What Worked
- **Phase-gated security-first approach**: Building proxy (Phase 1) before prompt (Phase 2) before UI (Phase 3) ensured API keys never leaked and content quality was proven before any UI connected to real API traffic
- **Automated prompt validation**: 32-test validation script caught real prompt issues (pirate persona injection, overly strict scope) before UI integration
- **Audit-driven gap closure**: Milestone audit after Phase 3 identified 3 critical gaps (error display broken, production deploy broken, missing verification) — Phases 4-6 systematically closed each one
- **Fast iteration**: Entire milestone completed in a single day across ~4 sessions

### What Was Inefficient
- **Phase 3 missing verification**: Chat widget was built and summarized but never formally verified, requiring a dedicated Phase 6 to create verification retroactively. Verification should be part of the execution flow.
- **Error display wiring gap**: SET_ERROR dispatch was implemented in useChatApi but no component consumed state.error — a dead code path that wasn't caught until milestone audit. Integration testing earlier would have caught this.
- **VITE_PROXY_URL localhost default**: The .env file shipped with localhost:8787 and deploy.yml had no production URL injection. This fundamental deployment gap wasn't caught until audit.

### Patterns Established
- XML-delimited system prompts with distinct sections (identity, resume_data, website_context, rules, safety)
- useReducer + context pattern for chat state with typed action dispatches
- SSE streaming via ReadableStream + TextDecoder in hooks
- In-place message updates via map-by-id in reducer (for error → retry flows)
- Pre-build environment validation in GitHub Actions with exit 1

### Key Lessons
1. **Verify during execution, not after**: Missing VERIFICATION.md for the largest phase (12 requirements) created significant rework. Verification should be atomic with execution.
2. **Test cross-phase wiring, not just components**: Each component worked in isolation, but SET_ERROR dispatch → UI consumption was broken because no integration test covered the full error flow.
3. **Production deployment should be a first-class phase concern**: The VITE_PROXY_URL gap could have been caught in Phase 1 or 3 if deploy pipeline was part of success criteria.
4. **Audit → gap closure loop is effective**: The structured audit identified exactly the right gaps, and targeted phases (4, 5, 6) closed them efficiently without scope creep.

### Cost Observations
- Model mix: ~30% opus, ~60% sonnet, ~10% haiku (estimated)
- Sessions: ~4 (init/research, execution phases 1-3, audit + gap phases 4-6, completion)
- Notable: Gap closure phases (4-6) were each 1 plan and very fast — targeted fixes are efficient

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | ~4 | 6 | Established audit → gap closure loop |

### Cumulative Quality

| Milestone | Tests | Coverage | Verification |
|-----------|-------|----------|--------------|
| v1.0 | 32 prompt tests | 23/23 requirements | 6/6 phases verified |

### Top Lessons (Verified Across Milestones)

1. Verify during execution — retroactive verification creates rework
2. Test integration paths, not just components — dead wiring is invisible in unit-level checks
