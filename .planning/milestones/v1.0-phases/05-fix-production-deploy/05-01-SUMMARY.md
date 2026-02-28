---
phase: 05-fix-production-deploy
plan: 01
subsystem: infra
tags: [github-actions, vite, env-vars, deployment]

# Dependency graph
requires:
  - phase: 01-infrastructure
    provides: "Cloudflare Worker deployed at portfolio-chat-proxy.*.workers.dev"
  - phase: 03-chat-widget
    provides: "useChatApi.js reads import.meta.env.VITE_PROXY_URL"
provides:
  - "deploy.yml injects VITE_PROXY_URL from GitHub Actions secrets during build"
  - "Pre-build validation fails CI if VITE_PROXY_URL secret is missing"
  - "USER-SETUP.md documents VITE_PROXY_URL secret requirement"
affects: [06-phase3-verification-cleanup]

# Tech tracking
tech-stack:
  added: []
  patterns: ["GitHub Actions env injection for Vite builds"]

key-files:
  created: []
  modified:
    - ".github/workflows/deploy.yml"
    - ".planning/phases/01-infrastructure/01-USER-SETUP.md"

key-decisions:
  - "Build-time validation with exit 1 rather than allowing silent empty URL"
  - "Use GitHub Actions step-level env (not job-level) to limit secret scope"
  - "Document in existing USER-SETUP.md rather than creating a new file"

patterns-established:
  - "GitHub Actions secret injection: env on step, not job level"
  - "Pre-build validation for required secrets: bash -z check with ::error annotation"

requirements-completed: [INFRA-01, INFRA-04, CHAT-04, CHAT-05, CHAT-06, CHAT-08, COST-02]

# Metrics
duration: 3min
completed: 2026-02-28
---

# Phase 5: Fix Production Deploy Summary

**deploy.yml injects VITE_PROXY_URL from GitHub Actions secrets with pre-build validation, unblocking all chat features in production**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-28
- **Completed:** 2026-02-28
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- deploy.yml build step now receives VITE_PROXY_URL from GitHub Actions secrets, overriding the .env localhost value
- Pre-build validation step fails CI with clear error message if VITE_PROXY_URL secret is not configured
- USER-SETUP.md updated with VITE_PROXY_URL in both the environment variables table and dashboard configuration checklist
- Verified: building with VITE_PROXY_URL env var set produces a bundle with 0 instances of localhost:8787

## Task Commits

Each task was committed atomically:

1. **Task 1: Add env var validation and injection to deploy.yml** - `08137c8` (feat)
2. **Task 2: Document VITE_PROXY_URL secret setup in USER-SETUP.md** - `990db07` (docs)

## Files Created/Modified
- `.github/workflows/deploy.yml` - Added validation step + env injection for VITE_PROXY_URL
- `.planning/phases/01-infrastructure/01-USER-SETUP.md` - Added VITE_PROXY_URL to env vars table and dashboard config

## Decisions Made
- Used step-level `env:` (not job-level) to limit secret exposure to only the steps that need it
- Added `::error::` GitHub Actions annotation for clear error reporting in the Actions UI
- Chose to fail the build (exit 1) rather than allow a silent empty URL, preventing broken deployments
- Updated the existing USER-SETUP.md rather than creating a Phase 5-specific setup doc, keeping all user setup instructions in one place

## Deviations from Plan
None - plan executed exactly as written

## Issues Encountered
- Pre-existing ESLint errors (88 errors, 4 warnings) from prop-types, unescaped entities, unused variables — not caused by this phase. Build still succeeds since these are only lint-time issues.

## User Setup Required

**External services require manual configuration.** See [01-USER-SETUP.md](../01-infrastructure/01-USER-SETUP.md) for:
- VITE_PROXY_URL must be added as a GitHub repository secret
- Value is the Cloudflare Worker URL (e.g. `https://portfolio-chat-proxy.<subdomain>.workers.dev`)

## Next Phase Readiness
- All chat requirements are now reachable in production once the user adds the VITE_PROXY_URL secret
- Phase 6 (Verification & Cleanup) can proceed to formally verify Phase 3 requirements

---
*Phase: 05-fix-production-deploy*
*Completed: 2026-02-28*
