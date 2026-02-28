# Phase 1: Infrastructure - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Deploy a secured Cloudflare Worker proxy that safely forwards DeepSeek API calls. The Worker holds the API key as an encrypted secret, enforces CORS to the portfolio domain only, rate-limits by IP, and streams the DeepSeek response back to the browser. No frontend chatbot UI work in this phase.

</domain>

<decisions>
## Implementation Decisions

### Serverless Provider
- Cloudflare Workers (free tier, 100k requests/day)
- Default *.workers.dev subdomain — no custom domain needed
- Worker name: `portfolio-chat-proxy` (becomes portfolio-chat-proxy.{account}.workers.dev)
- User needs to create a Cloudflare account (include setup instructions in plan)
- User already has a DeepSeek API key ready to configure as a secret

### Worker Project Setup
- Worker code lives in same repo: `workers/chat-proxy/` directory alongside portfolio code
- Deployed via GitHub Actions auto-deploy on push to main (alongside existing portfolio deploy)
- Separate wrangler.toml in `workers/chat-proxy/` directory

### Rate Limiting Behavior
- 30 requests per hour per IP
- When rate-limited: return a friendly JSON message that the chat UI can display nicely ("You've asked a lot of questions! Please wait a bit before asking more.")
- Per-session message cap: 20 messages (enforced client-side in Phase 3, but the Worker should also validate)

### Local Development Workflow
- Use `wrangler dev` locally for realistic Worker testing with real DeepSeek calls
- API key stored in `.dev.vars` file (gitignored) for local development
- Frontend uses `VITE_PROXY_URL` env var to find the Worker URL
  - Local: `http://localhost:8787`
  - Production: `https://portfolio-chat-proxy.{account}.workers.dev`
- `.env` already exists and is gitignored — add `VITE_PROXY_URL` there

### Claude's Discretion
- Exact Cloudflare Worker code structure and error handling patterns
- GitHub Actions workflow configuration for Worker deployment
- KV namespace vs in-memory rate limiting implementation
- Exact HTTP status codes and response formats for error cases

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.env` file exists and is already gitignored — can add `VITE_PROXY_URL` directly
- `vite.config.js` already uses `dotenv` package — env vars will be picked up automatically
- `.github/workflows/deploy.yml` exists — can add Worker deploy step or create parallel workflow

### Established Patterns
- Path aliases defined in `vite.config.js` (`@`, `@components`, etc.) — new `VITE_PROXY_URL` follows existing env var conventions
- `custom-context` alias already in vite config — context/provider patterns established in codebase

### Integration Points
- `.env` file — add `VITE_PROXY_URL` pointing to Worker
- `.gitignore` — already ignores `.env`; add `.dev.vars` for Worker local dev
- `package.json` — may need `wrangler` as devDependency for local dev convenience
- `.github/workflows/` — add Worker deploy action

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard Cloudflare Workers patterns. Research ARCHITECTURE.md contains a complete Worker code example to use as reference.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-infrastructure*
*Context gathered: 2026-02-28*