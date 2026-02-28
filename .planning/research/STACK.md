# Stack Research

**Domain:** AI chatbot widget added to existing React 18 + Vite portfolio SPA
**Researched:** 2026-02-28
**Confidence:** MEDIUM-HIGH (core stack HIGH; UI library choice MEDIUM)

---

## Context

This is an additive milestone on an existing React 18 + Vite app deployed to GitHub Pages (static hosting only). The three problems to solve are:

1. **Secure API key handling** — GitHub Pages cannot run server-side code; the DeepSeek API key must never be in client-side code.
2. **LLM integration** — Call DeepSeek via the OpenAI-compatible SDK with context-restricted prompts.
3. **Chat UI** — A floating widget that fits the existing glassmorphism design system without adding heavyweight dependencies.

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `openai` npm package | `^4.x` (currently 4.x series; v6.x alpha) | DeepSeek API client | DeepSeek's official docs explicitly recommend the OpenAI SDK with `baseURL: 'https://api.deepseek.com'`. Identical API shape means zero adapter code. Use v4 — v6 was published recently and the ecosystem hasn't validated it yet. |
| Cloudflare Workers | Free tier (Wrangler v4) | Serverless API proxy | 100,000 free requests/day, no credit card required, deploys in seconds, handles CORS natively, stores API key as encrypted secret via `wrangler secret put`. Best free option for a personal portfolio. |
| `@ai-sdk/react` | `^3.0.x` (currently 3.0.103) | `useChat` hook for streaming chat state | Framework-agnostic React hook that manages messages, loading state, and streaming. Works with Vite + any custom backend (not Next.js-only). The `DefaultChatTransport` accepts any API URL including a Cloudflare Worker URL. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `ai` (Vercel AI SDK core) | `^4.x` (aligns with `@ai-sdk/react`) | Peer dependency for `@ai-sdk/react` | Always — `@ai-sdk/react` requires it |
| Custom SCSS widget component | n/a (existing `custom.scss`) | Chat bubble + panel UI | Always — do NOT install a third-party chat UI library; the existing glassmorphism/gradient mixins and design tokens produce a matching aesthetic cheaper than forcing a third-party widget to match. |
| `framer-motion` | Already installed (`^12.x`) | Open/close animation for chat panel | Already in the project; use `AnimatePresence` for the panel slide-in and the bubble bounce. No new dependency needed. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Wrangler CLI v4 | Local dev + deploy for Cloudflare Worker | `npx wrangler dev` for local testing at `localhost:8787`; `npx wrangler deploy` for production. Secrets stored via `wrangler secret put DEEPSEEK_API_KEY`. |
| `.dev.vars` file | Local API key during development | Worker equivalent of `.env`; never committed. Put `DEEPSEEK_API_KEY=sk-...` here for `wrangler dev`. |

---

## Installation

```bash
# In the React portfolio (client side)
npm install openai @ai-sdk/react ai

# Cloudflare Worker (separate directory, e.g., /worker/)
npm create cloudflare@latest -- deepseek-proxy
# Select: "Hello World Worker", JavaScript/TypeScript
# Then add the openai SDK in the worker:
npm install openai

# Set the secret (run once after wrangler login)
npx wrangler secret put DEEPSEEK_API_KEY
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Cloudflare Workers | Vercel Edge Functions | If the portfolio were hosted on Vercel instead of GitHub Pages. Slightly better DX for Next.js, but requires Vercel account and migration from GitHub Pages. |
| Cloudflare Workers | Netlify Functions | If already on Netlify. Equivalent capability, but requires migrating hosting. Cloudflare Workers has better free tier limits (100k/day vs Netlify's 125k/month). |
| Cloudflare Workers | AWS Lambda | If the project already uses AWS. Significant setup overhead (IAM roles, API Gateway) for a personal portfolio. Overkill. |
| `@ai-sdk/react` `useChat` | Manual `fetch` + `useState` | If you want zero new dependencies. More code to write, streaming requires manual ReadableStream parsing. Use `useChat` — it handles all of this correctly. |
| Custom SCSS chat widget | `assistant-ui` library | If building a complex multi-model chat product. For a scoped personal portfolio chatbot, `assistant-ui` adds ~50 kB+ of composable primitives that aren't needed. The existing framer-motion + Bootstrap grid + SCSS mixins are sufficient. |
| `openai` SDK (v4) | `@ai-sdk/deepseek` provider | If using Vercel AI SDK's server-side `streamText` on a Node.js backend. The `@ai-sdk/deepseek` package is the Vercel AI SDK server provider — useful only if the Worker were written with the full Vercel AI SDK, which adds unnecessary overhead for a proxy. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| DeepSeek API key in React client code | Exposes the key publicly in the browser bundle — anyone can read it and exhaust your quota | Cloudflare Worker proxy that holds the key as a secret |
| `react-chatbot-kit` or `chatbot-widget-ui` npm packages | These force their own styling system that will conflict with the portfolio's glassmorphism + Bootstrap design tokens; customization is harder than writing a component | Custom React component with existing SCSS |
| Streaming from the proxy via long-polling | Adds complexity without benefit | Use `TransformableStream` / `ReadableStream` in the Worker to forward SSE chunks from DeepSeek directly to the browser |
| `axios` for API calls | No benefit over native `fetch` in a Cloudflare Worker; adds bundle weight | Native `fetch` |
| `dotenv` in the Worker | `.env` files are for Node.js processes; Cloudflare Workers uses `.dev.vars` for local secrets | `.dev.vars` + `wrangler secret put` for production |

---

## Stack Patterns by Variant

**If you want true streaming (tokens appear character-by-character):**
- Worker must forward DeepSeek's streaming response using `TransformableStream`
- `useChat` hook handles parsing `text/event-stream` automatically when the Worker returns the right content type
- DeepSeek supports `stream: true` on the chat completions endpoint

**If you prefer simplicity over streaming:**
- Worker sends a single POST to DeepSeek, waits for full response, returns JSON
- `useChat` still works — just no token-by-token rendering
- Simpler code, slightly longer perceived latency

**If the portfolio ever moves off GitHub Pages:**
- Cloudflare Workers still works regardless of frontend host — the Worker URL is independent
- No stack change needed on the client

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|----------------|-------|
| `@ai-sdk/react@^3.0.x` | React 18.x | Confirmed — React 18 is the supported target |
| `openai@^4.x` | Node.js 18+, Cloudflare Workers runtime | v4 is stable and widely used; v6 is too new |
| Wrangler v4 | Node.js 16.17.0+ | Project already uses Node 20 (see deploy.yml) |
| `framer-motion@^12.x` | React 18.x | Already installed, no version conflict |

---

## DeepSeek API Reference

- **Base URL:** `https://api.deepseek.com`
- **Model for chat:** `deepseek-chat` (DeepSeek-V3.2, non-thinking mode, 128K context)
- **Pricing (as of late 2025):** $0.07/M tokens cache hit · $0.56/M tokens cache miss · $1.68/M output tokens
- **Context window:** 128,000 tokens — more than enough to hold the full resume as a system prompt

The system prompt with Audruey's resume data will be ~2,000-3,000 tokens. At $0.56/M cache-miss input, that's approximately $0.0017 per conversation start. Cost is negligible for a personal portfolio.

---

## Cloudflare Workers Free Tier Reference

- 100,000 requests/day (resets midnight UTC)
- 10ms CPU time per invocation (sufficient for proxying; the LLM wait time does not count against CPU time)
- No credit card required
- Secrets stored encrypted, not visible after creation
- Free `*.workers.dev` subdomain (e.g., `deepseek-proxy.yourname.workers.dev`)

---

## Sources

- [DeepSeek API Docs — Your First API Call](https://api-docs.deepseek.com/) — Official confirmation of OpenAI SDK compatibility and base URL (MEDIUM confidence — page returned 403 during fetch, but content confirmed via multiple secondary sources)
- [openai npm package](https://www.npmjs.com/package/openai) — Current version confirmed (HIGH confidence)
- [@ai-sdk/react npm package](https://www.npmjs.com/package/@ai-sdk/react) — Version 3.0.103, last published 2026-02-28 (HIGH confidence)
- [AI SDK UI: useChat docs](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat) — Custom `DefaultChatTransport` API endpoint confirmed (HIGH confidence via WebFetch)
- [Cloudflare Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/) — 100k/day free, 10ms CPU (HIGH confidence via WebFetch of official docs)
- [Cloudflare Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/) — `wrangler secret put` usage confirmed (HIGH confidence via WebSearch of official docs)
- [Cloudflare Workers CORS Proxy Example](https://developers.cloudflare.com/workers/examples/cors-header-proxy/) — CORS header pattern confirmed (HIGH confidence via WebFetch)
- [DeepSeek Pricing — Models & Pricing](https://api-docs.deepseek.com/quick_start/pricing) — Token costs as of late 2025 (MEDIUM confidence — from secondary sources confirming the official docs values)
- [assistant-ui GitHub](https://github.com/assistant-ui/assistant-ui) — Evaluated and ruled out for this use case (MEDIUM confidence)

---

*Stack research for: AI chatbot widget on React 18 + Vite portfolio (GitHub Pages + Cloudflare Workers proxy)*
*Researched: 2026-02-28*
