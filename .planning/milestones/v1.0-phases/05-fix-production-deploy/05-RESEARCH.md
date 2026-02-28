# Phase 5: Fix Production Deployment Pipeline - Research

**Researched:** 2026-02-28
**Domain:** GitHub Actions + Vite env var injection
**Confidence:** HIGH

## Summary

The production deployment gap is straightforward: `.github/workflows/deploy.yml` runs `npm run build` without injecting `VITE_PROXY_URL`, so Vite falls back to the `.env` file which contains `http://localhost:8787`. The fix is a 2-line YAML change plus documenting the required GitHub repository secret.

Vite bakes `import.meta.env.VITE_*` variables at build time from environment variables. When a system environment variable is set, it takes precedence over `.env` file values. GitHub Actions `env:` on a step injects variables into the shell environment, which Vite's build process picks up automatically.

**Primary recommendation:** Add `env: VITE_PROXY_URL: ${{ secrets.VITE_PROXY_URL }}` to the `npm run build` step in deploy.yml. Add a build-time validation step that fails if the variable is empty/missing. Document the setup in a `USER-SETUP.md` file.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
No locked decisions — phase scope is prescribed by the milestone audit.

### Claude's Discretion
- **Build safety:** Whether to fail the build if VITE_PROXY_URL is missing, or allow it to proceed
- **Documentation:** Where and how to document the required GitHub secret setup
- **Env file strategy:** Whether to use purely GH Actions secrets or also add a .env.production file

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | Serverless API proxy deployed with encrypted secret | Already satisfied (Phase 1). This fix ensures the frontend reaches the deployed proxy. |
| INFRA-04 | Worker streams DeepSeek response via SSE | Already satisfied (Phase 1). Unblocked in production by this fix. |
| CHAT-04 | Typing indicator during API response | Already built (Phase 3). Unreachable in prod until VITE_PROXY_URL fixed. |
| CHAT-05 | Streaming text response tokens | Already built (Phase 3). Unreachable in prod until VITE_PROXY_URL fixed. |
| CHAT-06 | Scrollable message history | Already built (Phase 3). Unreachable in prod until VITE_PROXY_URL fixed. |
| CHAT-08 | Error message on network/API failure | Already satisfied (Phase 4). Unreachable in prod until VITE_PROXY_URL fixed. |
| COST-02 | DeepSeek deepseek-chat model used | Already configured (Phase 1). Unreachable in prod until VITE_PROXY_URL fixed. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| GitHub Actions | v4 actions | CI/CD workflow | Already in use; deploy.yml exists |
| Vite | 5.x | Build tool with env var baking | Already in use; reads VITE_* from env |

### Supporting
No additional libraries needed. This is a config-only change.

## Architecture Patterns

### Pattern 1: GitHub Actions Environment Variable Injection
**What:** Pass secrets as environment variables to build steps
**When to use:** Any time a build needs runtime values from repository secrets
**Example:**
```yaml
# Source: GitHub Actions official docs
- run: npm run build
  env:
    VITE_PROXY_URL: ${{ secrets.VITE_PROXY_URL }}
```

### Pattern 2: Vite Env Var Precedence
**What:** Vite loads env vars in this order (later wins): `.env` < `.env.local` < `.env.[mode]` < `.env.[mode].local` < system environment variables
**When to use:** Understanding why system env vars override .env file
**Key insight:** When GitHub Actions sets `VITE_PROXY_URL` in the environment, Vite's `loadEnv()` picks it up and bakes it into `import.meta.env.VITE_PROXY_URL` at build time. The `.env` file's `localhost:8787` is overridden.

### Pattern 3: Build-Time Validation
**What:** A pre-build check that fails the CI if required env vars are missing
**When to use:** To prevent silent deployment of broken builds
**Example:**
```yaml
- name: Validate required env vars
  run: |
    if [ -z "$VITE_PROXY_URL" ]; then
      echo "Error: VITE_PROXY_URL secret is not set"
      exit 1
    fi
  env:
    VITE_PROXY_URL: ${{ secrets.VITE_PROXY_URL }}
```

### Anti-Patterns to Avoid
- **Hardcoding the Worker URL in deploy.yml:** Would leak the URL and make it non-configurable
- **Using .env.production committed to repo:** The Worker URL is not secret, but committing it couples the repo to a specific deployment
- **Removing .env file:** Still needed for local development with `npm run dev`

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Env injection | Custom build scripts | GitHub Actions `env:` on step | Native, standard, zero dependencies |
| Build validation | Complex validation logic | Simple bash `[ -z ]` check | One line, clear error message |

## Common Pitfalls

### Pitfall 1: Setting env at job level instead of step level
**What goes wrong:** Setting `env:` at the job level exposes the secret to ALL steps, including upload-pages-artifact
**Why it happens:** Developers sometimes add env vars at the broadest scope for convenience
**How to avoid:** Set `env:` only on the `npm run build` step (and the validation step)
**Warning signs:** Secret appears in step logs for unrelated steps

### Pitfall 2: Forgetting to add the GitHub secret
**What goes wrong:** Build succeeds but VITE_PROXY_URL is empty string, chat silently fails
**Why it happens:** deploy.yml change is committed but no one adds the secret in repo settings
**How to avoid:** (1) Build-time validation that exits non-zero if empty, (2) Clear setup documentation
**Warning signs:** Chat widget opens but messages get network errors

### Pitfall 3: dotenv.config() in vite.config.js loading .env over system env
**What goes wrong:** `dotenv.config()` in vite.config.js might override system env vars
**Why it happens:** The current vite.config.js calls `dotenv.config()` explicitly, which loads .env into process.env
**How to avoid:** Vite natively handles .env loading — the explicit `dotenv.config()` in vite.config.js is redundant for VITE_* vars. However, since system env vars are set BEFORE dotenv runs, and dotenv does NOT override existing env vars by default, the system env var (from GH Actions) wins. Confidence: HIGH — this is documented dotenv behavior.
**Warning signs:** Production bundle still contains localhost:8787 despite secret being set

## Code Examples

### Current deploy.yml (broken)
```yaml
- run: npm ci
- run: npm run build  # No env injection → uses .env localhost:8787
```

### Fixed deploy.yml
```yaml
- run: npm ci

- name: Validate required env vars
  run: |
    if [ -z "$VITE_PROXY_URL" ]; then
      echo "::error::VITE_PROXY_URL secret is not set. Add it in Settings > Secrets > Actions."
      exit 1
    fi
  env:
    VITE_PROXY_URL: ${{ secrets.VITE_PROXY_URL }}

- run: npm run build
  env:
    VITE_PROXY_URL: ${{ secrets.VITE_PROXY_URL }}
```

### Current useChatApi.js consumption
```javascript
// src/hooks/useChatApi.js:4
const PROXY_URL = import.meta.env.VITE_PROXY_URL;
// This gets baked at build time by Vite
```

## Open Questions

1. **Exact Worker URL**
   - What we know: Worker name is `portfolio-chat-proxy` (from wrangler.toml). URL format is `https://portfolio-chat-proxy.<subdomain>.workers.dev`
   - What's unclear: The exact Cloudflare account subdomain
   - Recommendation: User must obtain the URL from their Cloudflare dashboard and set it as the GitHub secret value. Document this in setup instructions.

## Sources

### Primary (HIGH confidence)
- Codebase inspection: `.github/workflows/deploy.yml`, `.env`, `vite.config.js`, `src/hooks/useChatApi.js`
- GitHub Actions docs: Environment variables and secrets injection via `env:` key
- Vite docs: Env var loading precedence (system env > .env files)
- dotenv docs: Does not override existing environment variables by default

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using existing tools (GH Actions, Vite), no new deps
- Architecture: HIGH - Standard env injection pattern, well-documented
- Pitfalls: HIGH - Known patterns from codebase inspection

**Research date:** 2026-02-28
**Valid until:** 2026-06-28 (stable, nothing is changing)
