# Phase 5: Fix Production Deployment Pipeline - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Inject VITE_PROXY_URL into the GitHub Actions deploy workflow so production builds use the real Cloudflare Worker URL instead of localhost:8787. The chatbot must function on the live site after this fix. No new features — purely fixing the env var injection gap identified in the milestone audit.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
- **Build safety:** Whether to fail the build if VITE_PROXY_URL is missing, or allow it to proceed
- **Documentation:** Where and how to document the required GitHub secret setup
- **Env file strategy:** Whether to use purely GH Actions secrets or also add a .env.production file

</decisions>

<specifics>
## Specific Ideas

No specific requirements — the milestone audit already prescribes the fix pattern:
```yaml
- run: npm run build
  env:
    VITE_PROXY_URL: ${{ secrets.VITE_PROXY_URL }}
```

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None needed — this is a deploy config change

### Established Patterns
- `useChatApi.js:4` reads `import.meta.env.VITE_PROXY_URL` — Vite bakes env vars at build time
- `.env` has `VITE_PROXY_URL=http://localhost:8787` for local dev — this is the value leaking into production builds
- `vite.config.js` uses `dotenv.config()` to load .env file

### Integration Points
- `.github/workflows/deploy.yml:29` — the `npm run build` step needs env injection
- GitHub repository settings — VITE_PROXY_URL must be added as a repository secret
- The Worker URL format is `https://portfolio-chat-proxy.<subdomain>.workers.dev`

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-fix-production-deploy*
*Context gathered: 2026-02-28*
