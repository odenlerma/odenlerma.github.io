# Architecture Research

**Domain:** AI Chatbot Widget on React 18 + Vite Static Portfolio Site
**Researched:** 2026-02-28
**Confidence:** MEDIUM-HIGH (component patterns HIGH; serverless proxy selection MEDIUM)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     BROWSER (GitHub Pages SPA)                       │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    Existing Portfolio App                        │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐   │ │
│  │  │ Intro    │  │ Works    │  │ About    │  │ ChatWidget    │   │ │
│  │  │ Layout   │  │ Layout   │  │ Layout   │  │ (new)         │   │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └───────┬───────┘   │ │
│  │                                                     │            │ │
│  │  ┌──────────────────────────────────────────────────▼──────────┐ │ │
│  │  │                    ChatContext (Provider)                    │ │ │
│  │  │   messages[], isOpen, isStreaming, error → dispatch         │ │ │
│  │  └──────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │  fetch (POST /chat)
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   Cloudflare Worker (API Proxy)                       │
│                                                                       │
│  Origin check → inject DeepSeek API key → forward to DeepSeek API   │
│  CORS headers → stream or buffer response → return to browser        │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │  OpenAI-compatible API call
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DeepSeek API (LLM Backend)                         │
│                                                                       │
│   POST https://api.deepseek.com/chat/completions                     │
│   model: deepseek-chat | stream: true                                │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `ChatWidget` | Shell component; owns open/close toggle; renders FAB + ChatWindow | `useState(isOpen)`, conditional render |
| `ChatFAB` | Floating action button; toggles widget open/closed | Framer-motion animated button, fixed bottom-right |
| `ChatWindow` | Chat UI container: header + message list + input | Stacks three children, handles focus trap |
| `ChatHeader` | Bot name + status indicator ("Online" / "Thinking") | Receives `isStreaming` prop |
| `MessageList` | Scrollable message history; auto-scrolls on new messages | `useRef` on scroll container + `useEffect` on messages length |
| `MessageBubble` | Renders a single message (user or assistant) with role-based styling | Conditionally styled by `role` prop |
| `ChatInput` | Textarea + send button; submits user turn | Controlled input, disabled when `isStreaming` |
| `ChatContext` | Global state for messages + UI state; exposes dispatch | `useReducer` + `useContext` |
| `useChatApi` | Custom hook encapsulating fetch + streaming logic | Handles POST to proxy, parses SSE chunks |
| `chatPrompt.js` | Prompt engineering module; builds system prompt with resume data | Exported string/function — not a component |
| `Cloudflare Worker` | Serverless proxy; injects API key, enforces CORS, forwards to DeepSeek | Separate repo or `workers/` folder |

---

## Recommended Project Structure

```
src/
├── components/
│   └── ChatWidget/           # self-contained chatbot widget
│       ├── index.jsx          # barrel re-export (matches existing pattern)
│       ├── ChatWidget.jsx     # shell: toggle state + renders FAB + ChatWindow
│       ├── ChatFAB.jsx        # floating action button
│       ├── ChatWindow.jsx     # container: header + messages + input
│       ├── ChatHeader.jsx     # header with status indicator
│       ├── MessageList.jsx    # scrollable message list
│       ├── MessageBubble.jsx  # single message rendering
│       ├── ChatInput.jsx      # text input + send
│       └── ChatWidget.scss    # scoped styles matching design system
│
├── context/
│   └── ChatContext.jsx        # useReducer + Context provider + custom hook
│
├── hooks/
│   └── useChatApi.js          # streaming fetch logic, separated from UI
│
└── data/
    └── chatPrompt.js          # system prompt with embedded resume/context data

workers/                      # sibling directory OR separate CF Workers project
└── chat-proxy/
    ├── index.js               # Cloudflare Worker handler
    └── wrangler.toml          # Cloudflare Workers config
```

### Structure Rationale

- **`ChatWidget/` as a self-contained folder:** Matches the existing barrel-export component pattern in the codebase. Everything inside is the widget; nothing bleeds out.
- **`context/ChatContext.jsx`:** Separates state from UI. `useReducer` handles the action-based message append/stream update pattern cleanly. Avoids prop-drilling through 4+ levels.
- **`hooks/useChatApi.js`:** Isolates async + streaming logic. The component calls `sendMessage(text)` and the hook handles the fetch, SSE parsing, and dispatch — testable in isolation.
- **`data/chatPrompt.js`:** Makes prompt engineering visible and editable without touching component code. Resume data is co-located here as a JS string/object.
- **`workers/`:** Separate deployment unit. Has its own `wrangler.toml`. Keeps API key, CORS policy, and rate limiting logic out of the React build entirely.

---

## Architectural Patterns

### Pattern 1: Serverless Proxy for API Key Security

**What:** A Cloudflare Worker sits between the browser and the DeepSeek API. The browser never touches the DeepSeek API key directly. The key lives in the Worker's environment secrets.

**When to use:** Mandatory for any static site (GitHub Pages, Netlify, S3) that calls a paid LLM API. There is no server-side runtime on GitHub Pages.

**Trade-offs:** Adds one network hop and a separate deploy step. The benefit is absolute: the API key cannot be scraped from client bundle. Cloudflare Workers free tier (100k req/day) is sufficient for a personal portfolio.

**Example:**
```javascript
// workers/chat-proxy/index.js
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const allowed = env.ALLOWED_ORIGIN; // e.g. "https://odenlerma.github.io"

    // Reject requests from unknown origins
    if (origin !== allowed) {
      return new Response("Forbidden", { status: 403 });
    }

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": allowed,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const body = await request.json();

    // Forward to DeepSeek with injected API key
    const upstream = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    // Return response with CORS headers
    const response = new Response(upstream.body, upstream);
    response.headers.set("Access-Control-Allow-Origin", allowed);
    return response;
  },
};
```

### Pattern 2: Context + Reducer for Chat State

**What:** A single `ChatContext` holds all chat state — message history, open/closed status, streaming status, error state. Components read from context and dispatch actions. This avoids threading state props through `ChatWidget → ChatWindow → MessageList`.

**When to use:** When the same state (e.g., `isStreaming`) needs to reach multiple components at different nesting levels without prop-drilling.

**Trade-offs:** Slight overhead compared to prop-drilling in a small widget. For this project, the widget has 4 nesting levels where `isStreaming` matters to 3 of them simultaneously — context is justified.

**Example:**
```javascript
// src/context/ChatContext.jsx
const initialState = {
  messages: [],        // { id, role: 'user'|'assistant', content }
  isStreaming: false,
  error: null,
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'APPEND_CHUNK':
      // Update the last assistant message with streamed content
      return {
        ...state,
        messages: state.messages.map((m, i) =>
          i === state.messages.length - 1
            ? { ...m, content: m.content + action.payload }
            : m
        ),
      };
    case 'SET_STREAMING':
      return { ...state, isStreaming: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isStreaming: false };
    default:
      return state;
  }
}
```

### Pattern 3: System Prompt as Static Context Injection

**What:** The entire resume and portfolio data is embedded in the system prompt as a structured text block, sent with every API call. This is a "context stuffing" approach (not RAG). The system prompt instructs the model to answer ONLY from the provided data.

**When to use:** When the knowledge base is small enough to fit in a single context window (a resume + portfolio content is well under 4K tokens — far below DeepSeek's 64K context limit). RAG would be overkill here.

**Trade-offs:** Every API call carries the full system prompt payload. This adds ~$0.0001 per call at DeepSeek pricing — negligible for a portfolio site. Avoids the complexity of a vector database entirely.

**Example:**
```javascript
// src/data/chatPrompt.js
export const SYSTEM_PROMPT = `
You are an AI assistant representing Audruey Gana, a Mobile Developer with 7+ years of experience.
Your ONLY job is to answer questions about Audruey's professional background using the information below.
If asked about anything outside this information, say "I can only answer questions about Audruey's background."
Do not fabricate, extrapolate, or guess information not present below.

=== RESUME DATA ===
Name: Audruey L. Gana
Title: Mobile Developer (React Native) & Web Developer
Experience: 7+ years

Current Role: Mobile & Web Developer at LegalMatch Philippines Inc. (2024–Present)
Previous Role: Mobile & Web Developer at Ole Software Philippines Inc. (2018–2024)
Education: BS Information Technology, Cavite State University

Core Skills: React Native, React.js, JavaScript, UI/UX Design, REST APIs,
SCSS, HTML/CSS, AI-Assisted Development, AI Context Engineering

Key Achievements:
- Product delivery across mobile and web platforms
- Module optimization for performance
- UI/UX quality improvements
- QA testing contributions
- AI context engineering for productivity

=== PORTFOLIO PROJECTS ===
[Projects from portfolio site go here]
`.trim();
```

---

## Data Flow

### Request Flow (Message Submission)

```
User types message + presses Send
    ↓
ChatInput.jsx → calls sendMessage(text) from useChatApi hook
    ↓
useChatApi dispatches ADD_MESSAGE { role: 'user', content: text }
    ↓
MessageList re-renders with user message (optimistic UI)
    ↓
useChatApi dispatches SET_STREAMING true
    ↓
useChatApi POSTs to Cloudflare Worker:
  { model, messages: [...history, userMsg], stream: true, system: SYSTEM_PROMPT }
    ↓
Cloudflare Worker validates origin, injects API key, forwards to DeepSeek
    ↓
DeepSeek streams back SSE chunks (text/event-stream)
    ↓
useChatApi reads ReadableStream, dispatches ADD_MESSAGE { role: 'assistant', content: '' }
  then dispatches APPEND_CHUNK for each arriving token
    ↓
MessageList re-renders incrementally (streaming effect)
    ↓
Stream ends → useChatApi dispatches SET_STREAMING false
    ↓
ChatHeader updates from "Thinking..." back to "Online"
```

### State Management

```
ChatContext (useReducer)
    ↓ (provides via Context.Provider)
ChatWidget → ChatWindow → ChatHeader   (reads isStreaming)
                        → MessageList  (reads messages)
                        → ChatInput    (reads isStreaming, writes via useChatApi)
```

### Key Data Flows

1. **Widget open/close:** Local `useState` in `ChatWidget.jsx` — does not need to be in context because only `ChatFAB` and `ChatWindow` care, and they are direct children.
2. **Message stream:** `useChatApi` reads the Worker's `ReadableStream` line by line (SSE format), parses `data: {...}` chunks, extracts `delta.content`, dispatches `APPEND_CHUNK` per token.
3. **System prompt:** Built once at module load in `chatPrompt.js`, imported by `useChatApi`, prepended to every API call as the first `system` message. Never sent from the browser to context or stored in React state.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 0–100 visitors/month | Current architecture is fine. Cloudflare free tier covers it. |
| 100–10k visitors/month | Add rate limiting in Worker (by IP, max 10 req/min). Monitor DeepSeek spend. |
| 10k+ visitors/month | Add Cloudflare AI Gateway for caching repeated questions. Consider response caching for common queries. |

### Scaling Priorities

1. **First bottleneck:** DeepSeek API cost, not infrastructure. The Worker scales automatically. Monitor token spend — a verbose system prompt multiplied by volume is the main cost driver.
2. **Second bottleneck:** Rate limiting abuse. A portfolio site is public; add basic IP rate limiting in the Worker before launch.

---

## Anti-Patterns

### Anti-Pattern 1: Exposing API Key in Client Bundle

**What people do:** Store the DeepSeek API key in a `.env` file and reference it as `import.meta.env.VITE_DEEPSEEK_KEY` in the frontend code.

**Why it's wrong:** Vite bakes env vars prefixed with `VITE_` into the client bundle at build time. Anyone who inspects the JavaScript source or network requests can read the key. It will be found and abused.

**Do this instead:** Never reference the API key in any file under `src/`. The key lives exclusively in the Cloudflare Worker's environment secrets (`wrangler secret put DEEPSEEK_API_KEY`). The client only calls the Worker URL, which has no key in it.

### Anti-Pattern 2: Storing Full Conversation in localStorage

**What people do:** Persist `messages[]` to `localStorage` so history survives page refreshes.

**Why it's wrong:** Conversation logs may contain sensitive questions a visitor typed. For a portfolio site, ephemeral conversations reduce privacy liability and complexity. The PROJECT.md explicitly marks chat history persistence as out of scope.

**Do this instead:** Keep messages in React state only. They evaporate on page close. If persistence is added later, treat it as a feature with explicit opt-in.

### Anti-Pattern 3: Putting Resume Data in Environment Variables

**What people do:** Store the system prompt or resume content in a `VITE_SYSTEM_PROMPT` env var to make it "configurable."

**Why it's wrong:** VITE_ vars are client-public. The system prompt will be in the bundle regardless. Worse, it creates a false sense of security. The resume data is not a secret — it is intentionally public portfolio information.

**Do this instead:** Store the system prompt as a plain JavaScript constant in `src/data/chatPrompt.js`. It is public content and should be version-controlled, readable, and easily editable.

### Anti-Pattern 4: Monolithic Chat Component

**What people do:** Build a single `<ChatBot>` component that renders UI, manages state, calls the API, and handles streaming all in one file.

**Why it's wrong:** Impossible to test, hard to style, causes cascading re-renders on every streamed token (the entire component re-renders), and cannot reuse sub-parts.

**Do this instead:** Separate concerns as described in the project structure above. `MessageList` only re-renders when `messages` changes. `ChatHeader` only re-renders when `isStreaming` changes. `ChatInput` is stateless about the conversation.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Cloudflare Workers | Browser `fetch` POST to Worker URL | Worker URL stored in `import.meta.env.VITE_PROXY_URL` (the proxy URL is public, not secret) |
| DeepSeek API | Worker-side `fetch` to `https://api.deepseek.com/chat/completions` | OpenAI-compatible endpoint; model `deepseek-chat` |
| GitHub Pages | Static hosting — no change needed | Existing deploy pipeline unchanged |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `ChatWidget` ↔ rest of portfolio | Isolated — no shared state | Widget renders as a sibling in `App.jsx`; does not read scroll or section state |
| `useChatApi` ↔ `ChatContext` | Dispatch-only | Hook dispatches actions; does not read state directly — reads state via params passed in |
| `chatPrompt.js` ↔ `useChatApi` | ES module import | Static string — no reactivity needed |
| Portfolio component barrel ↔ `ChatWidget` | `src/components/index.jsx` re-export | `ChatWidget` is added to the barrel; imported as `<COMPONENTS.CHAT_WIDGET />` to match existing pattern |

---

## Build Order Implications

Building in this order respects dependencies:

1. **Cloudflare Worker (proxy)** — Must exist before any browser code can call DeepSeek. No CORS = nothing works. Build and deploy this first.
2. **`chatPrompt.js` (data layer)** — Pure data, no dependencies. Write the system prompt and resume data early so the prompt can be tuned during development.
3. **`ChatContext` + `useChatApi` (logic layer)** — Build state management and API hook before UI. Can be tested by calling directly from browser console.
4. **`ChatWidget` shell + `ChatFAB` (widget scaffold)** — Wire up open/close toggle. Proves the floating widget renders correctly against the existing portfolio layout.
5. **`ChatWindow` + `ChatHeader` + `MessageList` + `MessageBubble` (UI layer)** — Build out the conversation UI with mock data first, then connect to real state.
6. **`ChatInput` + streaming integration** — Last piece. Connect the input to `useChatApi`, wire up the streaming dispatch, verify the typing effect.
7. **Styling pass** — Apply glassmorphism, design tokens ($primary, $dark, fonts), ensure responsive behavior.

---

## Sources

- [Patterns.dev — AI UI Patterns](https://www.patterns.dev/react/ai-ui-patterns/) (MEDIUM confidence — cited by search, not directly fetched)
- [How to Build React AI Chatbot Interfaces (2026 Guide) — Grapes Tech Solutions](https://www.grapestechsolutions.com/blog/build-react-ai-chatbot-interface/) (MEDIUM confidence — fetched, specific component breakdown)
- [Cloudflare AI Gateway Worker Tutorial — Cloudflare Docs](https://developers.cloudflare.com/ai-gateway/tutorials/deploy-aig-worker/) (HIGH confidence — official docs, fetched)
- [CORS Header Proxy Example — Cloudflare Workers Docs](https://developers.cloudflare.com/workers/examples/cors-header-proxy/) (HIGH confidence — official docs, fetched)
- [DeepSeek API Docs](https://api-docs.deepseek.com/) (HIGH confidence — official; access blocked but OpenAI-compat confirmed via multiple sources)
- [Scaling Up with Reducer and Context — React Docs](https://react.dev/learn/scaling-up-with-reducer-and-context) (HIGH confidence — official React docs)
- [SSE Streaming LLM Responses — Upstash Blog](https://upstash.com/blog/sse-streaming-llm-responses) (MEDIUM confidence — reputable source, standard SSE pattern)
- [From Widget to Core Feature: Chatbot Architecture 2026 — DEV Community](https://dev.to/aarya_sharma/from-widget-to-core-feature-how-developers-should-architect-chatbots-for-website-in-2026-5no) (LOW confidence — access failed, referenced via search summary)
- [GitHub: dvasyliev/react-ai-chatbot (DeepSeek + React example)](https://github.com/dvasyliev/react-ai-chatbot) (MEDIUM confidence — real implementation example)
- [Cloudflare Workers vs Vercel Edge Functions 2025 comparison](https://www.digitalapplied.com/blog/serverless-functions-vercel-cloudflare-guide) (MEDIUM confidence — secondary source, consistent with multiple others)

---

*Architecture research for: AI Chatbot Widget on React 18 + Vite Portfolio (GitHub Pages)*
*Researched: 2026-02-28*
