# Phase 3: Chat Widget - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a fully functioning chat widget embedded in the live portfolio at odenlerma.github.io. The widget connects to the existing Cloudflare Worker proxy (Phase 1) using the validated system prompt (Phase 2) to answer recruiter questions about Audruey's background in real time with streaming responses. Chat history persistence, analytics, and accessibility enhancements are out of scope (v2).

</domain>

<decisions>
## Implementation Decisions

### Widget Look & Feel
- Floating card panel anchored bottom-right, not a drawer or bottom sheet
- Dark mode panel background using $dark (#303036) with light text — visually distinct from the cream portfolio
- Open/close animation: scale + fade up from the FAB with spring ease ($transition-spring / framer-motion)
- FAB button: gradient from $primary (coral) to $secondary (blue), circular, with chat bubble icon

### Welcome Experience
- Warm & professional tone for the bot's first message — recruiter-appropriate, not overly casual
- Example: "Hi! I'm Audruey's AI assistant. Ask me anything about her experience, skills, or projects."
- 3-4 role-focused starter questions that recruiters actually ask (e.g., "What's Audruey's experience?", "What tech does she work with?", "Tell me about her projects", "Why should I hire Audruey?")
- Starter questions displayed as pill chips (rounded, tappable, $radius-full style) below the welcome message — disappear after first user message
- Bot identity: "Audruey's AI" name + small avatar icon shown in the chat header

### Conversation Flow
- User messages: right-aligned with $primary (coral) background
- Bot messages: left-aligned with slightly lighter dark background (lighter than the panel)
- Typing indicator: animated bouncing dots in a bot bubble while waiting for stream to start
- Session limit (15-20 messages): warm redirect message with contact CTA — "Thanks for chatting! You've reached the session limit. Feel free to reach out to Audruey directly — [contact info]."
- Error states: inline bot message bubble with "Oops, something went wrong. [Retry]" — clickable retry button, keeps user in the conversation flow

### Mobile Behavior
- Near-full screen overlay on mobile (375px) — small gap at top showing portfolio beneath, close button clearly visible
- FAB positioned above the bottom-nav bar to avoid overlap — both remain accessible
- Panel auto-resizes when mobile keyboard opens — input stays visible, messages scroll up
- Close button only to dismiss (no swipe-to-close) — avoids accidental dismissal

### Claude's Discretion
- Exact panel dimensions (width, max-height) on desktop
- Chat header close button icon/style
- Message timestamp display (if any)
- Scroll-to-bottom behavior on new messages
- Input field placeholder text
- Exact session message count within 15-20 range
- Loading skeleton or shimmer details
- Bot avatar icon design

</decisions>

<specifics>
## Specific Ideas

- Dark panel creates a "chat app within the portfolio" feel — the widget should feel like its own distinct space, not blending into the page
- Gradient FAB draws attention as something interactive and special on the page
- Session limit message should function as a soft CTA to convert the recruiter from chatting to reaching out directly
- Starter questions should map to the most common recruiter discovery questions

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/custom.scss` glassmorphism mixin: could be used for panel borders/accents, though panel background is dark
- `src/custom.scss` gradient-text mixin: can apply to bot name or header text
- `src/custom.scss` hover-lift mixin: applies to FAB hover state
- `$transition-spring` (500ms cubic-bezier(0.34, 1.56, 0.64, 1)): use for open/close animation
- `$radius-lg` (20px) for panel corners, `$radius-full` (9999px) for FAB and pill chips
- `framer-motion` already in use across 9 files — animate panel open/close, message entry
- `src/data/chatPrompt.js`: system prompt ready from Phase 2

### Established Patterns
- Component barrel exports via `src/components/index.jsx` — chat widget components should be added here
- SCSS with Bootstrap 5 grid — Container, Row, Col for layout
- framer-motion for all animations (staggered entry, parallax, transitions)
- DM Sans for body text, Syne for display, JetBrains Mono for code/tech

### Integration Points
- `src/App.jsx`: chat widget rendered as sibling to `<HomePage />` (always present, overlays content)
- `src/components/index.jsx`: barrel export for new chat components
- `src/components/bottom-nav/`: FAB must be positioned above this on mobile
- Worker endpoint: existing Cloudflare Worker deployed in Phase 1 (workers/chat-proxy/)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-chat-widget*
*Context gathered: 2026-02-28*
