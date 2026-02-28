# Feature Research

**Domain:** AI portfolio chatbot (context-scoped assistant embedded in personal portfolio)
**Researched:** 2026-02-28
**Confidence:** MEDIUM — based on analysis of real portfolio chatbot implementations, NN/g UX research, and chatbot UI pattern documentation. No single authoritative standard exists for this niche; findings triangulated from multiple sources.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete or broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Floating chat widget (bottom-right) | Industry-standard placement; users scan left-to-right and end at bottom-right. Any other position causes disorientation. | LOW | Fixed position, open/close toggle. Bottom-right is non-negotiable per every chatbot UX study found. |
| Open / close / minimize toggle | Users must control when the chat takes up screen real estate. Chatbot covering portfolio content kills conversions. | LOW | Default state: closed. Opens on click. CSS transition or framer-motion for smooth expand. |
| Welcome message + bot introduction | NN/g research: "never drop users into an empty chat — the void kills engagement faster than any bug." Users need to know what the bot can do. | LOW | First message auto-displayed. Should name the bot, state its purpose, invite a question. |
| Suggested starter questions (conversation starters) | Users don't know what to ask. NN/g (2025): conversation starters are a primary feature discoverability mechanism. Without them, users stare at the input box. | LOW | 3-4 clickable prompts shown in empty state (e.g., "What's your tech stack?", "Tell me about your experience"). Disappear after first message sent. |
| Typing / thinking indicator | Users need feedback that the bot is processing. Without it, users assume it's broken and close the chat. Industry universal expectation. | LOW | Animated dots or "Thinking..." text while waiting for API response. |
| Streaming text response | Streaming has become the expected UX standard (ChatGPT set this norm). Full-response-wait feels slow and broken by comparison. Perceived speed matters. | MEDIUM | Requires streaming API call support. DeepSeek via OpenAI SDK supports streaming. Render tokens as they arrive. |
| Error message on failure | Users get a blank response or frozen state without this. Generic "Something went wrong, try again" is sufficient — detailed errors are anti-pattern (leak server info). | LOW | Catch fetch/network errors, replace loading state with friendly error. |
| Input field with send button + Enter key | Universal chat interface convention. Missing Enter key support frustrates keyboard users immediately. | LOW | Standard `<form>` with keyboard submit. |
| Scrollable message history (within session) | Users scroll up to re-read responses. Without scroll, long conversations become unusable. | LOW | flex-col container, message area flex-1 overflow-y-auto, auto-scroll to bottom on new message. |
| Scope-limited responses (no hallucination) | This chatbot's entire value proposition. If it makes up facts about Audruey, it actively harms her hiring prospects. Users asking factual questions expect accurate answers. | HIGH | System prompt + context injection enforces scope. Bot must decline out-of-scope questions gracefully (not rudely). |
| Mobile responsive layout | Most portfolio visits happen on mobile (recruiters viewing on phone). A desktop-only widget is a failure mode. | MEDIUM | Chat window adapts size for mobile viewport. Widget doesn't cover critical content. |

---

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Persona / tone alignment with portfolio brand | Generic chatbot tone undercuts the portfolio's personality. A bot that sounds like Audruey (professional, warm, mobile dev expertise) reinforces brand coherence and is memorable. | LOW | Achieved entirely through system prompt. No engineering overhead — just copywriting investment. High ROI. |
| Context-aware follow-up (multi-turn conversation) | Single-turn Q&A feels like a search engine. Genuine back-and-forth (e.g., "Tell me more about your React Native work" after an initial answer) is what makes the interaction feel like talking to a person, not a FAQ page. | MEDIUM | Requires passing conversation history in API call. OpenAI SDK message array format. Must cap history length to avoid token bloat. |
| Graceful out-of-scope deflection | Most scoped chatbots either answer everything (hallucination) or give a rude "I can't help with that." A warm redirect ("I'm focused on Audruey's experience — want to know about her React Native work?") is rare and memorable. | LOW | System prompt instruction. No engineering cost beyond prompt design. |
| Resume download CTA inside chat | Recruiters asking "Do you have a resume?" can get a direct download link in-chat. Converts a conversation into a tangible hiring action. Unique to portfolio context. | LOW | Chatbot response includes a link to PDF download (uses existing file-saver pattern from the portfolio). |
| Keyboard-first accessibility (focus management) | Most chatbot widgets trap focus poorly or ignore keyboard nav entirely. WCAG compliance is rare in portfolio chatbots and differentiates for accessibility-conscious hiring managers. | MEDIUM | Focus moves to input when widget opens. Esc key closes. Tab navigation through suggested questions. |
| Proactive bubble teaser text | A brief text near the chat bubble ("Ask me anything about Audruey") draws attention without being intrusive. Drives engagement from visitors who wouldn't otherwise click the bot. | LOW | Auto-disappears after ~5 seconds. Can be dismissed. Framer Motion fade-in/out. |

---

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Chat history persistence across sessions (localStorage/DB) | "Returning visitors pick up where they left off" sounds nice | For a portfolio chatbot, returning visitors are rare. Persistence adds engineering complexity (storage strategy, schema, cleanup), security considerations (PII in localStorage), and provides almost zero user value. PROJECT.md already ruled this out for v1. | Ephemeral session-only history. Simple in-memory state. |
| Voice input / speech recognition | Voice is a 2026 chatbot trend, sounds futuristic | Recruiters are typically in offices or public spaces. Voice input in a portfolio context is embarrassing to use, has poor browser support for streaming transcription, and adds significant complexity. Benefit is near-zero. | Text input only. |
| Multi-language support | "International reach" | Audruey's resume is English-only. The portfolio is English-only. Translating LLM responses doesn't translate the underlying context (resume, projects). Produces inconsistent, partly-translated experiences. | English only. Scoped correctly from the start. |
| "Contact me" form inside chat | "Convert conversations to leads" | The portfolio already has contact information. Duplicating a contact form inside the chat widget adds form handling, validation, and email routing complexity for no additional conversion benefit. | Link to existing contact section/email from within chat response. |
| General-purpose AI assistant mode | "Make it more useful" | Defeats the entire purpose. A bot that can answer "write me a poem" or "explain quantum physics" provides no hiring value, increases API costs, and makes the scope guardrails harder to maintain. Conflicts with PROJECT.md core requirement. | Stay strictly scoped. The constraint IS the feature — it prevents hallucination and keeps every answer on-brand. |
| Chat analytics / user tracking | "Understand what visitors ask" | Adds backend infrastructure, privacy compliance obligations (GDPR/privacy policy), and data storage beyond GitHub Pages' static scope. A personal portfolio doesn't need analytics infrastructure. | If curiosity strikes later: Cloudflare Workers logs or simple server-side logging. Not for v1. |
| Regenerate / edit previous messages | "ChatGPT does it" | Adds significant UI state complexity (branching conversation history). For a context-scoped bot answering factual questions, users don't need to regenerate — they just ask again. | Users rephrase and ask again naturally. |
| File/image upload | "Show the bot your resume for comparison" | Completely out of scope for this use case. Adds multimodal API requirements, file handling complexity, and security surface area. | Bot already knows Audruey's resume from system context. No uploads needed. |

---

## Feature Dependencies

```
[Floating chat widget]
    └──requires──> [Open/close toggle]
                       └──requires──> [Welcome message + starters]
                                          └──enhances──> [Suggested starter questions]

[Streaming text response]
    └──requires──> [Serverless API proxy] (external dependency — not UI feature)
    └──requires──> [Typing indicator] (starters feel broken without feedback during stream)

[Scope-limited responses]
    └──requires──> [System prompt with resume context] (content dependency, not UI)
    └──enhances──> [Graceful out-of-scope deflection]

[Multi-turn conversation]
    └──requires──> [Session message history state]
    └──enhances──> [Streaming text response] (each turn benefits from streaming)

[Resume download CTA]
    └──requires──> [Multi-turn conversation] (bot must know when to offer it)

[Error message on failure]
    └──requires──> [Streaming text response] OR [Full response fetch] (wraps either)

[Mobile responsive layout]
    └──requires──> [Floating chat widget] (the widget IS the mobile concern)

[Proactive bubble teaser]
    └──enhances──> [Floating chat widget] (draws attention to the closed widget)
    └──conflicts──> [User already has widget open] (should not show if chat is open)
```

### Dependency Notes

- **Streaming requires serverless proxy:** The DeepSeek API key cannot be in client-side code. Streaming must be proxied through a serverless function (Cloudflare Worker, Vercel Edge, etc.) that forwards SSE/streaming to the client. This is a pre-requisite for the entire chatbot, not just streaming.
- **Suggested starters require welcome message:** Starters displayed before a welcome message look like orphaned buttons. The welcome message gives them context.
- **Multi-turn requires history cap:** Passing unlimited history to the LLM is an anti-pattern (token cost, context window overflow). Cap at 8-10 exchanges or ~4000 tokens of history, then summarize or truncate oldest messages.
- **Graceful deflection requires system prompt engineering:** This is not a UI feature — it's achieved entirely through prompt design. Treat as a content/prompt task, not an engineering task.

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept and provide hiring value.

- [ ] Floating chat widget (bottom-right, open/close) — without this, there is no chatbot
- [ ] Welcome message with 3-4 suggested starter questions — without this, no one knows what to ask
- [ ] Typing indicator — without this, the bot appears broken during API latency
- [ ] Streaming text response — industry-standard expectation; full-response-wait feels broken in 2026
- [ ] Scope-limited responses with resume + website context — core value proposition; without this it's just a general chatbot
- [ ] Graceful out-of-scope deflection — without this, users get rude rejections or hallucinated answers
- [ ] Error handling (network/API failures) — without this, silent failures destroy trust
- [ ] Mobile responsive layout — portfolio is heavily visited on mobile
- [ ] Persona / tone alignment — low cost, high brand impact; included in system prompt design

### Add After Validation (v1.x)

Features to add once core chatbot is working and deployed.

- [ ] Resume download CTA — add once base conversation works; requires knowing when context is right to offer it
- [ ] Proactive bubble teaser text — add after UX is stable; low effort enhancement to drive engagement
- [ ] Keyboard-first accessibility improvements — add after core is shipped; systematic WCAG audit pass

### Future Consideration (v2+)

Features to defer until portfolio chatbot is proven useful.

- [ ] Multi-turn conversation with history cap — currently ephemeral is acceptable; add if users complain about context loss
- [ ] Persistent session history (within-tab only) — low value for portfolio context; defer indefinitely
- [ ] Analytics / logging — only if you want data on what recruiters ask; requires backend addition

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Floating widget (open/close) | HIGH | LOW | P1 |
| Welcome message + starters | HIGH | LOW | P1 |
| Typing indicator | HIGH | LOW | P1 |
| Scope-limited responses | HIGH | MEDIUM | P1 |
| Streaming text response | HIGH | MEDIUM | P1 |
| Error handling | HIGH | LOW | P1 |
| Mobile responsive layout | HIGH | MEDIUM | P1 |
| Graceful out-of-scope deflection | HIGH | LOW | P1 |
| Persona / tone (system prompt) | MEDIUM | LOW | P1 |
| Resume download CTA | MEDIUM | LOW | P2 |
| Proactive bubble teaser | MEDIUM | LOW | P2 |
| Keyboard accessibility | MEDIUM | MEDIUM | P2 |
| Multi-turn conversation history | MEDIUM | MEDIUM | P2 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Competitor Feature Analysis

The "competitors" here are other personal developer/designer portfolio chatbots found in the wild (smart-portfolio on GitHub, Ask Bruno project, DEV.to portfolio chatbot guide):

| Feature | smart-portfolio (GitHub) | DEV.to guide impl | Our Approach |
|---------|--------------------------|-------------------|--------------|
| Floating widget | Yes, chat bubble | Yes, chat bubble | Yes — bottom-right, framer-motion animated |
| Session persistence | Yes (Supabase) | Yes (localStorage) | No — ephemeral only for v1 (complexity not worth it) |
| Suggested starters | Not documented | Not documented | Yes — explicit conversation starters in empty state |
| Streaming | Not documented | Not documented | Yes — streaming via SSE through serverless proxy |
| Scope restriction | Not documented | Not documented | Yes — system prompt + context injection, hard boundary |
| Persona / tone | Not documented | Not documented | Yes — system prompt defines Audruey's voice |
| Resume CTA | Not documented | Not documented | Yes — in-chat resume link as v1.x feature |
| Out-of-scope deflection | Not documented | Not documented | Yes — warm redirect, not rude rejection |

**Key differentiation from existing examples:** Existing portfolio chatbot implementations focus on UI mechanics (the widget, animations, persistence). This implementation differentiates on content quality — strict scope control, persona-aligned tone, and graceful deflection make it more trustworthy and brand-coherent than generic chat implementations.

---

## Sources

- [Develop a Free Chatbot for Your Portfolio Website — DEV Community](https://dev.to/melvinprince/develop-a-free-chatbot-for-your-portfolio-website-a-step-by-step-guide-with-code-examples-2np6) — Real implementation reference (MEDIUM confidence)
- [Prompt Controls in GenAI Chatbots — Nielsen Norman Group](https://www.nngroup.com/articles/prompt-controls-genai/) — Conversation starters UX research (HIGH confidence)
- [UX for AI Chatbots: Complete Guide 2026 — Parallel HQ](https://www.parallelhq.com/blog/ux-ai-chatbots) — UX expectations (MEDIUM confidence)
- [The 20 best looking chatbot UIs in 2026 — Jotform](https://www.jotform.com/ai/agents/best-chatbot-ui/) — UI pattern reference (MEDIUM confidence)
- [Chat UX Best Practices — GetStream.io](https://getstream.io/blog/chat-ux/) — Onboarding / empty state patterns (MEDIUM confidence)
- [Chatbot UX Design: Complete Guide 2025 — Parallel HQ](https://www.parallelhq.com/blog/chatbot-ux-design) — Floating widget placement (MEDIUM confidence)
- [How to power AI chatbots with real-time streaming — KeyValue](https://www.keyvalue.systems/blog/powering-ai-chatbots-with-real-time-streaming-a-developers-guide/) — Streaming UX rationale (MEDIUM confidence)
- [AI SDK UI: Chatbot — Vercel AI SDK](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot) — Chat state management patterns (HIGH confidence)
- [smart-portfolio — GitHub](https://github.com/medevs/smart-portfolio) — Real portfolio chatbot reference (MEDIUM confidence)

---

*Feature research for: AI portfolio chatbot on React/Vite personal portfolio site*
*Researched: 2026-02-28*
