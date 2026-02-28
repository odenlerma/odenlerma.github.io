# Phase 1: Infrastructure - Research

**Researched:** 2026-02-28
**Domain:** Cloudflare Workers serverless proxy, DeepSeek API integration, CORS, rate limiting, SSE streaming
**Confidence:** HIGH

## Summary

Phase 1 deploys a Cloudflare Worker that proxies browser requests to the DeepSeek chat completion API. The Worker holds the API key as an encrypted secret (never exposed to the client), enforces CORS to allow only `odenlerma.github.io`, rate-limits by IP, and streams the DeepSeek response back to the browser via Server-Sent Events.

The standard approach uses Wrangler CLI for project scaffolding, `wrangler secret put` for encrypted key storage, and the official `cloudflare/wrangler-action@v3` GitHub Action for CI/CD deployment. DeepSeek is fully OpenAI-SDK-compatible, so the Worker can use raw `fetch()` to `https://api.deepseek.com/v1/chat/completions` with `stream: true` and pipe the SSE response directly to the client.

**Primary recommendation:** Use Cloudflare Workers with raw `fetch()` (no OpenAI SDK needed in Worker — it adds unnecessary bundle size). Implement CORS origin checking manually (simple string comparison), use the Workers Rate Limiting binding for burst protection plus an in-memory Map for hourly IP tracking, and pipe DeepSeek's SSE stream directly through using `TransformStream`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Cloudflare Workers (free tier, 100k requests/day)
- Default *.workers.dev subdomain — no custom domain needed
- Worker name: `portfolio-chat-proxy`
- Worker code lives in same repo: `workers/chat-proxy/` directory
- Deployed via GitHub Actions auto-deploy on push to main
- Separate wrangler.toml in `workers/chat-proxy/` directory
- 30 requests per hour per IP
- Friendly JSON rate limit message for chat UI
- Per-session message cap: 20 messages (client-side Phase 3, Worker also validates)
- `wrangler dev` for local testing with real DeepSeek calls
- API key in `.dev.vars` (gitignored) for local dev
- `VITE_PROXY_URL` env var for frontend to find Worker URL
- `.env` already exists and is gitignored — add `VITE_PROXY_URL` there

### Claude's Discretion
- Exact Cloudflare Worker code structure and error handling patterns
- GitHub Actions workflow configuration for Worker deployment
- KV namespace vs in-memory rate limiting implementation
- Exact HTTP status codes and response formats for error cases

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | Serverless API proxy (Cloudflare Worker) deployed with DeepSeek API key stored as encrypted secret | Wrangler scaffold + `wrangler secret put DEEPSEEK_API_KEY` + GitHub Actions deploy |
| INFRA-02 | CORS restricted to odenlerma.github.io origin only — reject all other origins | Manual Origin header check + CORS response headers on allowed requests |
| INFRA-03 | Per-IP rate limiting enforced in the Worker (30 requests/hour) | Workers Rate Limiting binding (burst) + in-memory Map (hourly) — see Architecture Patterns |
| INFRA-04 | Worker streams DeepSeek API response back to browser via SSE | `fetch()` to DeepSeek with `stream: true` → pipe `ReadableStream` to client with `text/event-stream` headers |
</phase_requirements>

## Standard Stack

### Core
| Library/Tool | Version | Purpose | Why Standard |
|-------------|---------|---------|--------------|
| Wrangler CLI | 4.x (latest) | Cloudflare Worker dev/deploy tool | Official CF tooling, required for secrets, local dev, deployment |
| Cloudflare Workers runtime | — | Serverless execution environment | User-specified; free tier 100k req/day |
| cloudflare/wrangler-action | v3 | GitHub Actions deploy | Official CF action, handles auth + deploy |

### Supporting
| Library/Tool | Version | Purpose | When to Use |
|-------------|---------|---------|-------------|
| Workers Rate Limiting binding | GA (2025-09) | Native per-key rate limiting | Burst protection (5 req/10s per IP) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Raw `fetch()` to DeepSeek | `openai` npm package | SDK adds ~200KB to Worker bundle; raw fetch is simpler for a single endpoint proxy |
| In-memory Map for hourly tracking | KV namespace | KV is eventually consistent — bad for rate limiting; in-memory resets on cold start but acceptable for portfolio traffic |
| Hono framework | Raw Worker handler | Hono adds routing/middleware overhead; this Worker has ONE endpoint, raw handler is cleaner |

**Installation:**
```bash
npm create cloudflare@latest workers/chat-proxy -- --type=hello-world
# OR manual scaffold (preferred for monorepo):
mkdir -p workers/chat-proxy && cd workers/chat-proxy
npm init -y
npm install --save-dev wrangler
```

## Architecture Patterns

### Recommended Project Structure
```
workers/chat-proxy/
├── src/
│   └── index.js          # Worker entry point (fetch handler)
├── wrangler.toml          # Worker config (name, compatibility_date, rate limit bindings)
├── .dev.vars              # Local secrets (DEEPSEEK_API_KEY) — gitignored
├── package.json           # wrangler devDependency
└── package-lock.json
```

### Pattern 1: CORS Origin Validation
**What:** Check the `Origin` header against an allowlist and reject non-matching requests with 403.
**When to use:** Every incoming request before any processing.
**Example:**
```javascript
// Source: Cloudflare Workers docs - CORS header proxy example
const ALLOWED_ORIGINS = [
  'https://odenlerma.github.io',
  'http://localhost:5173',  // Vite dev server (local only, strip in prod or use env)
];

function handleCors(request) {
  const origin = request.headers.get('Origin');
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }
  return null; // Origin is allowed, continue processing
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// Handle OPTIONS preflight
if (request.method === 'OPTIONS') {
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}
```

### Pattern 2: Two-Tier Rate Limiting (Burst + Hourly)
**What:** Combine the Workers Rate Limiting binding (burst) with an in-memory Map (hourly window).
**When to use:** The binding only supports 10s or 60s periods. For 30 req/hour, we need supplemental tracking.
**Why two tiers:**
- **Burst limiter** (binding): Prevents rapid-fire abuse (e.g., 5 requests per 10 seconds). Runs at the edge with zero network latency. Per-location enforcement.
- **Hourly limiter** (in-memory Map): Tracks total requests per IP within a rolling hour. Resets on Worker cold start, which is acceptable for a portfolio site with low traffic.

**Example:**
```javascript
// In-memory hourly tracking
const ipHourlyMap = new Map();

function checkHourlyLimit(ip, limit = 30) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  let record = ipHourlyMap.get(ip);

  if (!record || now - record.windowStart > windowMs) {
    record = { windowStart: now, count: 0 };
    ipHourlyMap.set(ip, record);
  }

  record.count++;
  if (record.count > limit) {
    return false; // Rate limited
  }
  return true;
}

// Periodic cleanup (prevent memory leak)
function cleanupStaleEntries() {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  for (const [ip, record] of ipHourlyMap) {
    if (now - record.windowStart > windowMs) {
      ipHourlyMap.delete(ip);
    }
  }
}
```

**wrangler.toml rate limit config:**
```toml
[[ratelimits]]
name = "RATE_LIMITER"
namespace_id = "1001"

[ratelimits.simple]
limit = 5
period = 10
```

### Pattern 3: SSE Stream Passthrough
**What:** Forward DeepSeek's streaming response directly to the browser without buffering.
**When to use:** For the main chat completion endpoint.
**Example:**
```javascript
// Source: Cloudflare Workers Streams API + DeepSeek API docs
async function streamDeepSeekResponse(request, env, origin) {
  const body = await request.json();

  const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: body.messages,
      stream: true,
    }),
  });

  if (!deepseekResponse.ok) {
    return new Response(
      JSON.stringify({ error: 'DeepSeek API error', status: deepseekResponse.status }),
      { status: 502, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } }
    );
  }

  // Pipe the SSE stream directly through
  return new Response(deepseekResponse.body, {
    status: 200,
    headers: {
      ...corsHeaders(origin),
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

### Pattern 4: Worker Entry Point Structure
**What:** Clean fetch handler with middleware-style flow: CORS check → rate limit → proxy.
**Example:**
```javascript
export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin');

    // 1. CORS check
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    // 2. Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // 3. Only POST allowed
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders(origin) });
    }

    // 4. Rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP');
    const { success } = await env.RATE_LIMITER.limit({ key: clientIP });
    if (!success || !checkHourlyLimit(clientIP)) {
      return new Response(
        JSON.stringify({
          error: "You've asked a lot of questions! Please wait a bit before asking more.",
        }),
        { status: 429, headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' } }
      );
    }

    // 5. Proxy to DeepSeek
    return streamDeepSeekResponse(request, env, origin);
  },
};
```

### Anti-Patterns to Avoid
- **Storing API key in wrangler.toml `[vars]`:** These are plaintext. Use `wrangler secret put` for encrypted secrets.
- **Using `*` for CORS origin:** Defeats the purpose of CORS lockdown. Always validate against an explicit allowlist.
- **Buffering the full DeepSeek response before sending:** Destroys the streaming UX. Pipe the ReadableStream directly.
- **Using KV for rate limiting:** KV is eventually consistent and cannot reliably coordinate concurrent requests for rate limiting.
- **Installing the OpenAI SDK in the Worker:** Unnecessary bundle bloat. Raw `fetch()` to `https://api.deepseek.com/v1/chat/completions` is simpler and lighter.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Burst rate limiting | Custom counter logic | Workers Rate Limiting binding | Edge-native, zero network latency, per-location enforcement |
| IP address extraction | Parsing X-Forwarded-For | `CF-Connecting-IP` header | Cloudflare sets this reliably; XFF is spoofable |
| Secret management | Custom encryption | `wrangler secret put` | Industry-standard encrypted-at-rest, automatic injection via `env` |
| CI/CD deployment | Custom shell scripts | `cloudflare/wrangler-action@v3` | Official, handles auth, supports workingDirectory for monorepo |

**Key insight:** Cloudflare provides edge-native primitives for rate limiting, secrets, and deployment. Using these is simpler and more secure than rolling custom solutions.

## Common Pitfalls

### Pitfall 1: Rate Limit Binding Period Constraint
**What goes wrong:** Trying to set `period = 3600` for 30 req/hour. The binding only allows 10 or 60 seconds.
**Why it happens:** Cloudflare designed the binding for burst/short-window protection, not long-window tracking.
**How to avoid:** Use two-tier approach: binding for burst protection (5 req/10s) + in-memory Map for hourly tracking.
**Warning signs:** Wrangler deploy fails with invalid period error; tests show rate limiting not working as expected.

### Pitfall 2: CORS Preflight Not Handled
**What goes wrong:** Browser sends OPTIONS preflight before POST; Worker returns 403 or 405 because it doesn't handle OPTIONS.
**Why it happens:** Browsers automatically send preflight for POST requests with `Content-Type: application/json`.
**How to avoid:** Explicitly handle OPTIONS method with 204 response and full CORS headers before any other processing.
**Warning signs:** Browser console shows "CORS preflight" errors; POST requests never reach the Worker.

### Pitfall 3: SSE Content-Encoding Header in Local Dev
**What goes wrong:** Streaming doesn't work with `wrangler dev` locally.
**Why it happens:** Wrangler dev server may add `Content-Encoding` headers that break SSE streaming.
**How to avoid:** Set `Content-Encoding: identity` explicitly in streaming responses during local dev.
**Warning signs:** Responses arrive all at once instead of streaming; browser EventSource doesn't fire events.

### Pitfall 4: `wrangler secret put` Creates New Deployment
**What goes wrong:** Running `wrangler secret put` in CI deploys a new Worker version unexpectedly.
**Why it happens:** By design, `wrangler secret put` creates and deploys immediately.
**How to avoid:** Set secrets once manually via CLI (not in CI). CI only runs `wrangler deploy` — secrets persist across deployments.
**Warning signs:** Duplicate deployments; secrets being overwritten.

### Pitfall 5: Worker Cold Start Resets In-Memory State
**What goes wrong:** Hourly rate limit map resets when Worker isolate is evicted after inactivity.
**Why it happens:** Workers are ephemeral — in-memory state does not persist across cold starts.
**How to avoid:** Accept this tradeoff for a portfolio site. Low traffic means cold starts will happen, but also means rate limiting is less critical. The burst limiter (binding) persists regardless.
**Warning signs:** Previously rate-limited IPs can make requests again after ~5 minutes of inactivity.

### Pitfall 6: Missing `CF-Connecting-IP` in Local Dev
**What goes wrong:** `request.headers.get('CF-Connecting-IP')` returns `null` in local dev.
**Why it happens:** `wrangler dev` uses a local server that doesn't inject CF headers by default.
**How to avoid:** Fallback to `127.0.0.1` when `CF-Connecting-IP` is missing (only happens locally).
**Warning signs:** Rate limiter crashes or always returns the same key.

## Code Examples

### Complete wrangler.toml Configuration
```toml
# workers/chat-proxy/wrangler.toml
name = "portfolio-chat-proxy"
main = "src/index.js"
compatibility_date = "2024-12-01"

[[ratelimits]]
name = "RATE_LIMITER"
namespace_id = "1001"

[ratelimits.simple]
limit = 5
period = 10
```

### GitHub Actions Workflow for Worker Deployment
```yaml
# .github/workflows/deploy-worker.yml
name: Deploy Worker

on:
  push:
    branches: [main]
    paths:
      - 'workers/chat-proxy/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: workers/chat-proxy
```

### .dev.vars for Local Development
```
# workers/chat-proxy/.dev.vars
DEEPSEEK_API_KEY=sk-your-deepseek-key-here
```

### .env Addition for Frontend
```
# Root .env (already gitignored)
VITE_PROXY_URL=http://localhost:8787
```

### DeepSeek API Request Format
```javascript
// Source: https://api-docs.deepseek.com/api/create-chat-completion
// POST https://api.deepseek.com/v1/chat/completions
{
  "model": "deepseek-chat",       // V3 — not deepseek-reasoner (R1)
  "messages": [
    { "role": "system", "content": "..." },
    { "role": "user", "content": "..." }
  ],
  "stream": true,
  "temperature": 0.7,
  "max_tokens": 1024
}

// Streaming response format (SSE):
// data: {"id":"...","choices":[{"delta":{"content":"Hello"},"index":0}]}
// data: {"id":"...","choices":[{"delta":{"content":" world"},"index":0}]}
// data: [DONE]
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `wrangler publish` | `wrangler deploy` | 2023 (Wrangler v3) | `publish` is deprecated alias |
| KV for rate limiting | Workers Rate Limiting binding (GA) | Sept 2025 | Native binding is faster and consistent; KV is eventually consistent |
| Service worker syntax (`addEventListener`) | ES module syntax (`export default`) | 2022 (Wrangler v2+) | ES modules are the standard; service worker syntax still works but deprecated |
| `wrangler-action@v2` | `wrangler-action@v3` | 2024 | v3 supports latest Wrangler features |

**Deprecated/outdated:**
- `wrangler publish` → Use `wrangler deploy`
- Service worker syntax → Use ES module `export default { fetch() {} }`
- Pages (cloudflare/pages) → Deprecated April 2025; everything is Workers now

## Open Questions

1. **Cloudflare Account Setup**
   - What we know: User needs a Cloudflare account and API token for GitHub Actions
   - What's unclear: Whether user already has a Cloudflare account
   - Recommendation: Include account creation + API token generation instructions in plan. User will handle manually.

2. **DeepSeek API Reliability**
   - What we know: STATE.md notes "DeepSeek API docs returned 403 during research"
   - What's unclear: Whether the actual API endpoint is accessible (docs site ≠ API)
   - Recommendation: First task should include a manual `curl` test to verify API connectivity before writing code.

3. **Worker URL After Deployment**
   - What we know: URL will be `portfolio-chat-proxy.{account-subdomain}.workers.dev`
   - What's unclear: The exact account subdomain until deployment
   - Recommendation: After first deploy, capture URL and update `.env` with `VITE_PROXY_URL` for Phase 3.

## Sources

### Primary (HIGH confidence)
- [Cloudflare Workers Rate Limiting API docs](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/) — binding config, period constraints, key selection
- [Cloudflare Workers Secrets docs](https://developers.cloudflare.com/workers/configuration/secrets/) — wrangler secret put, .dev.vars, env access
- [Cloudflare Workers CORS example](https://developers.cloudflare.com/workers/examples/cors-header-proxy/) — preflight handling, header patterns
- [DeepSeek API docs](https://api-docs.deepseek.com/) — base URL, model names, OpenAI SDK compatibility, streaming format
- [cloudflare/wrangler-action GitHub](https://github.com/cloudflare/wrangler-action) — v3 usage, workingDirectory for monorepo

### Secondary (MEDIUM confidence)
- [Cloudflare Workers Streams API docs](https://developers.cloudflare.com/workers/runtime-apis/streams/) — TransformStream, ReadableStream passthrough
- [DeepSeek Chat Completion API](https://api-docs.deepseek.com/api/create-chat-completion) — streaming SSE format, model parameters

### Tertiary (LOW confidence)
- Community reports on `wrangler dev` SSE streaming issues — Content-Encoding workaround may or may not still be needed

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — official Cloudflare docs + official DeepSeek docs
- Architecture: HIGH — patterns derived from official examples and documented APIs
- Pitfalls: MEDIUM — some based on community reports that may be outdated (SSE local dev issue)

**Research date:** 2026-02-28
**Valid until:** 2026-03-30 (30 days — stable domain, slow-moving APIs)
