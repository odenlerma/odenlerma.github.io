# Portfolio AI Chatbot

## What This Is

An interactive AI chatbot embedded in Audruey Gana's personal portfolio website (odenlerma.github.io) that answers visitor questions about her professional background, skills, and experience. Powered by DeepSeek LLM via a secured Cloudflare Worker proxy, with SSE streaming, scope enforcement, and anti-hallucination defenses. Built as a chat widget with glassmorphism styling matching the portfolio's design system.

## Core Value

Visitors can instantly get accurate, personalized answers about Audruey's qualifications and experience — turning passive portfolio browsing into an engaging conversation that promotes her for hiring.

## Requirements

### Validated

- ✓ Serverless API proxy with encrypted API key (INFRA-01) — v1.0
- ✓ CORS restricted to portfolio domain (INFRA-02) — v1.0
- ✓ Per-IP rate limiting 30 req/hr (INFRA-03) — v1.0
- ✓ SSE streaming from Worker to browser (INFRA-04) — v1.0
- ✓ Full resume data in system prompt (PRMT-01) — v1.0
- ✓ Strict scope enforcement (PRMT-02) — v1.0
- ✓ Graceful out-of-scope deflection (PRMT-03) — v1.0
- ✓ Professional warm tone promoting for hiring (PRMT-04) — v1.0
- ✓ Anti-hallucination grounding (PRMT-05) — v1.0
- ✓ Anti-prompt-injection defenses (PRMT-06) — v1.0
- ✓ Website content in chatbot context (PRMT-07) — v1.0
- ✓ Floating chat widget with toggle (CHAT-01) — v1.0
- ✓ Welcome message on first open (CHAT-02) — v1.0
- ✓ Starter questions in empty state (CHAT-03) — v1.0
- ✓ Typing indicator during API wait (CHAT-04) — v1.0
- ✓ Streaming text tokens rendered live (CHAT-05) — v1.0
- ✓ Scrollable message history (CHAT-06) — v1.0
- ✓ Input field with send + Enter key (CHAT-07) — v1.0
- ✓ Error display with retry on failure (CHAT-08) — v1.0
- ✓ Mobile responsive layout (CHAT-09) — v1.0
- ✓ Widget matches portfolio design system (CHAT-10) — v1.0
- ✓ Per-session message cap of 18 (COST-01) — v1.0
- ✓ DeepSeek deepseek-chat V3 model (COST-02) — v1.0

### Active

## Current Milestone: v1.1 Chat Interface Redesign

**Goal:** Redesign the AI chat interface to match the portfolio's light theme, remove dark mode, and elevate the chatbot from a hidden widget to the portfolio's centerpiece feature.

**Target features:**
- Light theme redesign matching website design system (cream/coral/blue palette)
- Remove all dark mode styling from chat components
- Increase chatbot visibility and prominence — make it the highlight of the portfolio
- Maintain all existing chat functionality (streaming, starter questions, error handling)

### Out of Scope

- General-purpose AI assistant — chatbot is strictly scoped to Audruey's professional information
- Backend server hosting — uses Cloudflare Workers for serverless proxy
- Fine-tuning or training custom models — uses DeepSeek via API with prompt engineering
- Multi-language support — English only
- Chat history persistence across sessions — ephemeral conversations
- Voice input / speech recognition — recruiters in offices/public spaces
- Chat analytics / user tracking — privacy compliance obligations
- File/image upload — out of scope for Q&A chatbot
- Regenerate / edit previous messages — adds branching state complexity

## Context

**Shipped v1.0** with ~1,323 LOC across JS/JSX/SCSS.

**Tech stack:** React 18 + Vite SPA on GitHub Pages, Cloudflare Workers proxy, DeepSeek LLM via OpenAI-compatible API, SCSS with Bootstrap 5, framer-motion animations.

**Architecture:**
- `workers/chat-proxy/src/index.js` — Cloudflare Worker proxy (CORS, rate limiting, SSE streaming)
- `src/data/chatPrompt.js` — System prompt with XML-delimited resume data
- `src/context/ChatContext.jsx` — useReducer state management (8 action types)
- `src/hooks/useChatApi.js` — SSE streaming hook with AbortController
- `src/components/chat/` — 8 UI components (ChatFab, ChatWindow, ChatHeader, ChatInput, MessageList, MessageBubble, TypingIndicator, StarterQuestions)
- `.github/workflows/deploy.yml` — GitHub Pages deploy with VITE_PROXY_URL injection
- `.github/workflows/deploy-worker.yml` — Cloudflare Worker deploy

**Known tech debt (3 items):**
- `wrangler.toml` rate limiter `namespace_id=1001` is placeholder — needs real Cloudflare namespace
- Worker deployment requires manual Cloudflare account setup
- GitHub secrets (VITE_PROXY_URL, CLOUDFLARE_API_TOKEN) must be configured manually

## Constraints

- **Deployment**: GitHub Pages (static hosting) — requires serverless proxy for API calls
- **Tech Stack**: React 18 + Vite + SCSS architecture
- **LLM Provider**: DeepSeek via OpenAI SDK
- **Scope Boundary**: Chatbot responds ONLY using provided context (resume + website data)
- **Design**: Matches portfolio design system (colors, fonts, glassmorphism)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| DeepSeek via OpenAI SDK | User-specified, cost-effective with OpenAI-compatible API | ✓ Good — works well, cheap |
| Cloudflare Workers proxy | GitHub Pages can't run server-side code; encrypted secrets | ✓ Good — secure, low latency |
| Context-restricted responses | Prevent hallucination by constraining LLM to resume/website data | ✓ Good — 32/32 validation tests |
| Client-side prompt in chatPrompt.js | Prompt content not secret; defense is behavioral | ✓ Good — simpler architecture |
| XML-delimited prompt structure | Clear section boundaries for LLM parsing | ✓ Good — reliable parsing |
| Pattern-based validation | LLM responses are non-deterministic; exact matching fails | ✓ Good — robust tests |
| SET_ERROR payload as {id, message} | Reducer finds and updates correct bot message in place | ✓ Good — clean error UX |
| Build-time env validation in deploy.yml | Fail fast instead of silent empty VITE_PROXY_URL | ✓ Good — prevents broken deploys |
| Step-level env in GitHub Actions | Limits secret scope vs job-level env | ✓ Good — least privilege |

---
*Last updated: 2026-02-28 after v1.1 milestone started*
