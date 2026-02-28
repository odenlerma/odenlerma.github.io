# Phase 1: User Setup Required

**Generated:** 2026-02-28
**Phase:** 01-infrastructure
**Status:** Complete

Complete these items for the Worker deployment to function. Claude automated the project scaffold, secrets template, and gitignore — these items require human access to external dashboards.

## Environment Variables

| Status | Variable | Source | Add to |
|--------|----------|--------|--------|
| [ ] | `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard -> My Profile -> API Tokens -> Create Token -> Edit Cloudflare Workers template | GitHub repo secret (Settings -> Secrets -> Actions) |
| [ ] | `DEEPSEEK_API_KEY` | Already in .dev.vars for local dev; needs `wrangler secret put` for production | Cloudflare Worker encrypted secret |
| [ ] | `VITE_PROXY_URL` | Cloudflare Dashboard -> Workers & Pages -> portfolio-chat-proxy -> copy the URL (e.g. `https://portfolio-chat-proxy.xxx.workers.dev`) | GitHub repo secret (Settings -> Secrets -> Actions) |

## Account Setup

- [ ] **Create Cloudflare account** (if needed)
  - URL: https://dash.cloudflare.com/sign-up
  - Skip if: Already have Cloudflare account

## Dashboard Configuration

- [ ] **Create Cloudflare API Token for GitHub Actions**
  - Location: Cloudflare Dashboard -> My Profile -> API Tokens
  - Click "Create Token" -> Use "Edit Cloudflare Workers" template
  - Copy the token

- [ ] **Add CLOUDFLARE_API_TOKEN to GitHub repo secrets**
  - Location: GitHub repo -> Settings -> Secrets and variables -> Actions -> New repository secret
  - Name: `CLOUDFLARE_API_TOKEN`
  - Value: Token from previous step

- [ ] **Set Worker production secret**
  - From `workers/chat-proxy/` directory, run:
    ```bash
    npx wrangler secret put DEEPSEEK_API_KEY
    ```
  - Paste your DeepSeek API key when prompted
  - Wrangler will authenticate via browser if needed

- [ ] **Add VITE_PROXY_URL to GitHub repo secrets**
  - Location: GitHub repo -> Settings -> Secrets and variables -> Actions -> New repository secret
  - Name: `VITE_PROXY_URL`
  - Value: Your Worker URL from Cloudflare Dashboard -> Workers & Pages -> portfolio-chat-proxy
  - Format: `https://portfolio-chat-proxy.<your-subdomain>.workers.dev`
  - **Why:** The deploy workflow injects this during `npm run build`. Without it, the build will fail with a validation error.

## Local Development

Already configured:
- `.dev.vars` has DeepSeek API key for `wrangler dev`
- Run `cd workers/chat-proxy && npm run dev` to start local Worker

## Verification

After completing setup:

```bash
# Verify DeepSeek API access
curl -s https://api.deepseek.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(grep DEEPSEEK_API_KEY workers/chat-proxy/.dev.vars | cut -d= -f2)" \
  -d '{"model":"deepseek-chat","messages":[{"role":"user","content":"Say hello in one word"}],"max_tokens":10}' | head -c 200

# Test local Worker
cd workers/chat-proxy && npm run dev
# In another terminal:
curl http://localhost:8787
# Expected: "portfolio-chat-proxy is running"
```

---

**Once all items complete:** Mark status as "Complete" at top of file.
