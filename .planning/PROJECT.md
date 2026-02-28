# Portfolio AI Chatbot

## What This Is

An interactive AI chatbot embedded in Audruey Gana's personal portfolio website (odenlerma.github.io) that answers visitor questions about her professional background, skills, and experience. Powered by DeepSeek LLM via the OpenAI SDK, the chatbot acts as a knowledgeable assistant that promotes Audruey for hiring while strictly limiting responses to information available on the website and her resume.

## Core Value

Visitors can instantly get accurate, personalized answers about Audruey's qualifications and experience — turning passive portfolio browsing into an engaging conversation that promotes her for hiring.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Interactive AI chatbot widget embedded in the portfolio site
- [ ] Uses DeepSeek as the LLM backend via OpenAI SDK
- [ ] Chatbot answers questions only based on website content and resume information
- [ ] Chatbot refuses to answer questions outside the scope of Audruey Gana's information
- [ ] Chatbot promotes Audruey's skills and experience for hiring in a professional tone
- [ ] No hallucination — chatbot does not fabricate information beyond what's in the source data
- [ ] Resume/CV data (professional experience, skills, education, achievements) is available as context
- [ ] Website content (projects, about section, tech stack) is available as context
- [ ] Conversational UI that fits the portfolio's existing design system

### Out of Scope

- General-purpose AI assistant — chatbot is strictly scoped to Audruey's professional information
- Backend server hosting — will use serverless/edge function approach to keep deployment simple on GitHub Pages
- Fine-tuning or training custom models — uses DeepSeek via API with prompt engineering
- Multi-language support — English only for v1
- Chat history persistence across sessions — ephemeral conversations for v1

## Context

**Existing portfolio:** React 18 + Vite SPA deployed to GitHub Pages via GitHub Actions. Uses SCSS with Bootstrap 5, framer-motion for animations, and a component-based architecture with barrel exports. Design tokens include colors ($primary: #FC5130, $secondary: #4C66FF, $light: #FFF5E3, $dark: #303036), fonts (Syne, DM Sans, JetBrains Mono), and custom SCSS mixins (glassmorphism, gradient-text, etc.).

**Resume data source:** Audruey L. Gana — Mobile Developer with 7+ years experience. Currently at LegalMatch Philippines Inc. (2024-Present) as Mobile (React Native) and Web Developer. Previously at Ole Software Philippines Inc. (2018-2024). BS in Information Technology from Cavite State University. Skills: React Native, UI/UX Design, JavaScript, REST API, Web Development (React.js, HTML, CSS, SCSS), AI-Assisted Development, AI Integration. Key achievements: product delivery, module optimization, UI/UX quality, QA testing, AI context engineering.

**Tech choice:** DeepSeek LLM accessed via OpenAI SDK — cost-effective API with OpenAI-compatible interface. Requires an API proxy or serverless function since GitHub Pages is static-only (no server-side code).

**API key security:** The DeepSeek API key cannot be exposed in client-side code. Needs a serverless function (e.g., Cloudflare Workers, Vercel Edge Functions, or Netlify Functions) to proxy API calls securely.

## Constraints

- **Deployment**: GitHub Pages (static hosting) — requires serverless proxy for API calls
- **Tech Stack**: Must integrate with existing React 18 + Vite + SCSS architecture
- **LLM Provider**: DeepSeek via OpenAI SDK (user requirement)
- **Scope Boundary**: Chatbot must ONLY respond using provided context (resume + website data) — no general knowledge
- **Design**: Must match existing portfolio design system (colors, fonts, glassmorphism style)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| DeepSeek via OpenAI SDK | User-specified, cost-effective with OpenAI-compatible API | — Pending |
| Serverless API proxy | GitHub Pages can't run server-side code; need secure API key handling | — Pending |
| Context-restricted responses | Prevent hallucination by constraining LLM to provided resume/website data only | — Pending |

---
*Last updated: 2026-02-28 after initialization*