# Phase 3: Chat Widget - Research

**Researched:** 2026-02-28
**Domain:** React chat UI with SSE streaming, framer-motion animation, SCSS styling
**Confidence:** HIGH

## Summary

Phase 3 builds a floating chat widget that connects to the existing Cloudflare Worker proxy (Phase 1) using the system prompt from Phase 2. The core technical challenges are: (1) consuming SSE streams from the DeepSeek-compatible API and rendering tokens incrementally, (2) managing chat state with useReducer for messages, loading, errors, and session limits, and (3) building a responsive animated panel with framer-motion that integrates cleanly into the existing portfolio.

The project already has framer-motion (v12.27+), react-bootstrap, Bootstrap 5, and SCSS — no new dependencies are needed. The Worker returns standard OpenAI-compatible SSE (`text/event-stream` with `data: {...}` lines), which can be consumed with the native `fetch` + `ReadableStream` API. No EventSource polyfill or third-party SSE library is required since we control the request (POST with body) and the browser Fetch API handles streaming natively.

**Primary recommendation:** Use native `fetch` with `ReadableStream.getReader()` to consume SSE, `useReducer` for chat state, framer-motion `AnimatePresence` for panel open/close, and component-scoped SCSS modules matching the existing project patterns.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
#### Widget Look & Feel
- Floating card panel anchored bottom-right, not a drawer or bottom sheet
- Dark mode panel background using $dark (#303036) with light text — visually distinct from the cream portfolio
- Open/close animation: scale + fade up from the FAB with spring ease ($transition-spring / framer-motion)
- FAB button: gradient from $primary (coral) to $secondary (blue), circular, with chat bubble icon

#### Welcome Experience
- Warm & professional tone for the bot's first message — recruiter-appropriate, not overly casual
- Example: "Hi! I'm Audruey's AI assistant. Ask me anything about her experience, skills, or projects."
- 3-4 role-focused starter questions that recruiters actually ask (e.g., "What's Audruey's experience?", "What tech does she work with?", "Tell me about her projects", "Why should I hire Audruey?")
- Starter questions displayed as pill chips (rounded, tappable, $radius-full style) below the welcome message — disappear after first user message
- Bot identity: "Audruey's AI" name + small avatar icon shown in the chat header

#### Conversation Flow
- User messages: right-aligned with $primary (coral) background
- Bot messages: left-aligned with slightly lighter dark background (lighter than the panel)
- Typing indicator: animated bouncing dots in a bot bubble while waiting for stream to start
- Session limit (15-20 messages): warm redirect message with contact CTA — "Thanks for chatting! You've reached the session limit. Feel free to reach out to Audruey directly — [contact info]."
- Error states: inline bot message bubble with "Oops, something went wrong. [Retry]" — clickable retry button, keeps user in the conversation flow

#### Mobile Behavior
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

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CHAT-01 | Floating chat widget anchored to bottom-right of viewport with open/close toggle | FAB component + framer-motion AnimatePresence for panel toggle |
| CHAT-02 | Welcome message displayed on first open with bot introduction and purpose | Initial message in reducer state, rendered as first bot bubble |
| CHAT-03 | 3-4 suggested starter questions shown in empty state (clickable, disappear after first message) | STARTER_QUESTIONS from chatPrompt.js, conditional render based on messages.length |
| CHAT-04 | Typing/thinking indicator displayed while waiting for API response | Bouncing dots animation in bot bubble, shown during `isStreaming` state |
| CHAT-05 | Streaming text response — tokens rendered as they arrive from the API | Native fetch + ReadableStream + TextDecoder SSE parsing |
| CHAT-06 | Scrollable message history within the current session | CSS overflow-y: auto on message list with auto-scroll to bottom |
| CHAT-07 | Input field with send button and Enter key submit support | Controlled input with onKeyDown Enter handler and submit button |
| CHAT-08 | Error message displayed on network/API failure with friendly retry prompt | Error state in reducer, inline error bubble with retry action |
| CHAT-09 | Mobile responsive layout — chat window adapts to mobile viewport without covering critical content | Media queries for mobile overlay, dynamic viewport units (dvh), keyboard handling |
| CHAT-10 | Widget styled to match portfolio design system (colors, fonts, glassmorphism) | $dark background, DM Sans font, $primary/$secondary accents, existing SCSS variables |
| COST-01 | Per-session message cap (15-20 messages) enforced client-side with graceful limit message | Message counter in reducer, cap at 18 user messages, limit message component |
| COST-02 | DeepSeek `deepseek-chat` (V3) model used — not the expensive reasoning model (R1) | Worker already enforces `model: 'deepseek-chat'` server-side (Phase 1) |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | ^18.2.0 | Component framework | Already installed, useReducer for state |
| framer-motion | ^12.27.0 | Panel animations, message entry | Already installed, used across 9+ files |
| bootstrap | ^5.3.3 | Grid layout via react-bootstrap | Already installed, Container/Row/Col |
| sass | ^1.75.0 | Component styling | Already installed, custom.scss design system |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| bootstrap-icons | ^1.11.3 | Chat bubble icon for FAB, close icon, send icon | Already installed, used in bottom-nav |
| react-bootstrap | ^2.10.2 | Layout components | Already installed, optional for chat layout |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native fetch SSE | EventSource | EventSource only supports GET — Worker expects POST with messages body; fetch + ReadableStream is required |
| Native fetch SSE | sse.js library | Unnecessary dependency; native approach is ~30 lines and well-supported |
| useReducer | useState | useState works for simple cases but chat state has 5+ interdependent fields — useReducer is cleaner |
| useReducer | zustand/jotai | Over-engineered for a single widget with no cross-component state sharing needs |

**Installation:**
```bash
# No new packages needed — all dependencies already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── chat/                    # New: chat widget components
│   │   ├── index.jsx            # Barrel export: CHAT_WIDGET
│   │   ├── ChatFab.jsx          # Floating action button
│   │   ├── ChatWindow.jsx       # Main chat panel container
│   │   ├── ChatHeader.jsx       # Panel header with title + close
│   │   ├── MessageList.jsx      # Scrollable message container
│   │   ├── MessageBubble.jsx    # Individual message (user/bot/error)
│   │   ├── TypingIndicator.jsx  # Bouncing dots animation
│   │   ├── StarterQuestions.jsx  # Pill chip starter questions
│   │   ├── ChatInput.jsx        # Text input + send button
│   │   └── style.scss           # All chat widget styles
│   └── index.jsx                # Updated: add chat export
├── hooks/
│   └── useChatApi.js            # New: SSE streaming + API logic
├── context/
│   └── ChatContext.jsx          # New: useReducer state + provider
├── data/
│   └── chatPrompt.js            # Existing: system prompt + starters
└── App.jsx                      # Updated: render ChatWidget
```

### Pattern 1: SSE Stream Consumption with Native Fetch
**What:** Parse OpenAI-compatible SSE responses using fetch + ReadableStream
**When to use:** When the API endpoint requires POST (not GET), making EventSource unusable
**Example:**
```javascript
// The Worker returns text/event-stream with lines like:
// data: {"id":"...","choices":[{"delta":{"content":"Hello"},...}]}
// data: [DONE]

async function streamChat(messages, onToken, onDone, onError, signal) {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
    signal, // AbortController signal for cancellation
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Keep incomplete line in buffer

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;

      const data = trimmed.slice(6);
      if (data === '[DONE]') {
        onDone();
        return;
      }

      try {
        const parsed = JSON.parse(data);
        const token = parsed.choices?.[0]?.delta?.content;
        if (token) onToken(token);
      } catch {
        // Skip malformed JSON lines
      }
    }
  }

  onDone();
}
```

### Pattern 2: Chat State with useReducer
**What:** Centralized state management for messages, streaming status, errors, and session limits
**When to use:** When multiple state fields change in response to the same event

```javascript
const initialState = {
  messages: [],      // { id, role, content, isError, isLimit }
  isStreaming: false,
  error: null,
  messageCount: 0,   // User messages sent (for session cap)
  isOpen: false,
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_OPEN':
      return { ...state, isOpen: !state.isOpen };
    case 'ADD_USER_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        messageCount: state.messageCount + 1,
        isStreaming: true,
        error: null,
      };
    case 'START_BOT_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, { id: action.id, role: 'assistant', content: '' }],
      };
    case 'APPEND_TOKEN':
      return {
        ...state,
        messages: state.messages.map(m =>
          m.id === action.id ? { ...m, content: m.content + action.token } : m
        ),
      };
    case 'STREAM_COMPLETE':
      return { ...state, isStreaming: false };
    case 'SET_ERROR':
      return { ...state, isStreaming: false, error: action.payload };
    case 'SESSION_LIMIT':
      return {
        ...state,
        messages: [...state.messages, { id: action.id, role: 'system', content: action.message, isLimit: true }],
        isStreaming: false,
      };
    default:
      return state;
  }
}
```

### Pattern 3: framer-motion AnimatePresence for Panel
**What:** Animate panel mount/unmount with spring physics
**When to use:** Conditional rendering with enter/exit animations

```jsx
import { AnimatePresence, motion } from 'framer-motion';

// Panel animation variants
const panelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transformOrigin: 'bottom right',
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { duration: 0.2 },
  },
};

// Usage
<AnimatePresence>
  {isOpen && (
    <motion.div
      variants={panelVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="chat-window"
    >
      {/* Chat content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Pattern 4: Message Entry Animation with Stagger
**What:** New messages animate in with a subtle slide-up and fade
**When to use:** Each new message bubble enters the list

```jsx
const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

// Each MessageBubble wraps in motion.div with these variants
```

### Anti-Patterns to Avoid
- **Storing streaming state in parent component:** Keep all chat state in the reducer/context — don't split state across components
- **Using innerHTML for streamed content:** The bot returns plain text (enforced by the system prompt) — use textContent/React children, never dangerouslySetInnerHTML
- **Full conversation in API payload without system message:** Always prepend SYSTEM_MESSAGE from chatPrompt.js as the first message in the API payload
- **Polling instead of streaming:** The Worker returns SSE — use streaming, not polling
- **Managing AbortController outside the hook:** Keep the AbortController lifecycle inside `useChatApi` to avoid memory leaks

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SSE parsing | Custom event stream parser | Simple line-by-line `data:` prefix check | OpenAI SSE format is simple — `data: {json}\n\n` with `data: [DONE]` terminator; a full SSE parser adds complexity for no benefit |
| Scroll management | Custom scroll position tracker | `scrollIntoView({ behavior: 'smooth' })` on a sentinel div | Native browser API handles all edge cases |
| Unique message IDs | UUID library | `crypto.randomUUID()` or `Date.now() + Math.random()` | Built-in browser API, no dependency needed |
| Panel animation | Custom CSS transitions | framer-motion AnimatePresence | Already installed, handles mount/unmount animation cleanly |
| Typing indicator dots | CSS-only bounce | framer-motion stagger | Already using framer-motion everywhere — consistent animation engine |

**Key insight:** This phase requires zero new npm dependencies. Every needed capability is either native to the browser (fetch streaming, crypto.randomUUID, scrollIntoView) or already installed (framer-motion, bootstrap-icons, sass).

## Common Pitfalls

### Pitfall 1: TextDecoder Buffer Boundary
**What goes wrong:** SSE data chunks can split mid-JSON — a single `reader.read()` call may contain partial lines
**Why it happens:** Network chunking doesn't respect SSE event boundaries
**How to avoid:** Accumulate in a buffer string, split on `\n`, keep the last incomplete segment for the next iteration
**Warning signs:** Intermittent JSON parse errors, missing tokens

### Pitfall 2: State Update During Unmount
**What goes wrong:** Stream continues after component unmounts, causing "Can't perform a React state update on an unmounted component"
**Why it happens:** User closes the chat panel while a stream is active
**How to avoid:** Use AbortController — abort the fetch when component unmounts or panel closes. Clean up in `useEffect` return.
**Warning signs:** Console warnings about state updates on unmounted components

### Pitfall 3: Mobile Keyboard Pushes Layout
**What goes wrong:** On iOS Safari, the virtual keyboard pushes the fixed-position chat window off screen
**Why it happens:** iOS Safari uses visual viewport resizing instead of layout viewport resizing
**How to avoid:** Use `dvh` (dynamic viewport height) units for mobile panel height, and `visualViewport.resize` event listener to adjust input position. Test with `position: fixed` + bottom offset.
**Warning signs:** Input field hidden behind keyboard, panel extends beyond viewport

### Pitfall 4: Missing System Message in API Calls
**What goes wrong:** Bot responses become generic/unhelpful because the system prompt isn't included
**Why it happens:** Only user/assistant messages are sent, forgetting to prepend the system message
**How to avoid:** Always construct API payload as `[SYSTEM_MESSAGE, ...conversationMessages]` — system message is NOT stored in the reducer state, it's prepended at call time
**Warning signs:** Bot gives generic AI responses instead of Audruey-specific answers

### Pitfall 5: Infinite Re-renders from Streaming Updates
**What goes wrong:** Each token appended triggers a full re-render cascade
**Why it happens:** Reducer dispatch per token (could be 100+ per response) causes rapid re-renders
**How to avoid:** Batch token updates using a ref for the streaming buffer, then flush to state on intervals (e.g., requestAnimationFrame) or use `React.memo` on MessageBubble to prevent sibling re-renders
**Warning signs:** Laggy typing indicator, frozen UI during stream, dropped frames

### Pitfall 6: Session Limit Race Condition
**What goes wrong:** User submits message at limit boundary, request fires before limit check completes
**Why it happens:** Checking count and dispatching are separate operations
**How to avoid:** Check message count in the send handler BEFORE dispatching ADD_USER_MESSAGE. Count check is synchronous from reducer state — no race possible if checked first.
**Warning signs:** Getting 1 extra message beyond the cap

### Pitfall 7: Worker URL Hardcoded for Wrong Environment
**What goes wrong:** Chat works in dev but fails in production (or vice versa)
**Why it happens:** Worker URL differs between environments (localhost:8787 vs *.workers.dev)
**How to avoid:** Use `import.meta.env.VITE_PROXY_URL` — already configured in .env for dev. For production, set via GitHub Actions environment variable or .env.production file.
**Warning signs:** CORS errors in production, connection refused in dev

## Code Examples

### SSE Stream Consumer Hook
```javascript
// src/hooks/useChatApi.js
import { useCallback, useRef } from 'react';
import { SYSTEM_MESSAGE } from '@/data/chatPrompt';

const PROXY_URL = import.meta.env.VITE_PROXY_URL;

export function useChatApi(dispatch) {
  const abortRef = useRef(null);

  const sendMessage = useCallback(async (messages) => {
    // Abort any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const botMessageId = crypto.randomUUID();
    dispatch({ type: 'START_BOT_MESSAGE', id: botMessageId });

    try {
      const response = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            SYSTEM_MESSAGE,
            ...messages.map(m => ({ role: m.role, content: m.content })),
          ],
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') break;

          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content;
            if (token) {
              dispatch({ type: 'APPEND_TOKEN', id: botMessageId, token });
            }
          } catch { /* skip malformed */ }
        }
      }

      dispatch({ type: 'STREAM_COMPLETE' });
    } catch (err) {
      if (err.name !== 'AbortError') {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Something went wrong. Please try again.',
        });
      }
    }
  }, [dispatch]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { sendMessage, abort };
}
```

### Chat Context Provider
```javascript
// src/context/ChatContext.jsx
import { createContext, useContext, useReducer } from 'react';
import { chatReducer, initialState } from './chatReducer';
import { useChatApi } from '@hooks/useChatApi';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { sendMessage, abort } = useChatApi(dispatch);

  return (
    <ChatContext.Provider value={{ state, dispatch, sendMessage, abort }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}
```

### FAB with Gradient Background
```scss
// In style.scss
.chat-fab {
  position: fixed;
  bottom: 100px; // Above bottom-nav
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: $radius-full;
  background: linear-gradient(135deg, $primary, $secondary);
  border: none;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba($primary, 0.4);
  z-index: 1050;
  @include hover-lift(-4px);

  @media (max-width: 768px) {
    bottom: 80px; // Adjusted for mobile bottom-nav height
    right: 16px;
    width: 48px;
    height: 48px;
  }
}
```

### Dark Panel Styling
```scss
.chat-window {
  position: fixed;
  bottom: 170px;
  right: 24px;
  width: 380px;
  max-height: 520px;
  background: $dark;
  border-radius: $radius-lg;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  z-index: 1050;

  @media (max-width: 768px) {
    position: fixed;
    top: 20px;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-height: none;
    height: calc(100dvh - 20px);
    border-radius: $radius-lg $radius-lg 0 0;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| EventSource for SSE | fetch + ReadableStream | Widely adopted 2020+ | POST requests with body now fully supported for streaming |
| componentDidMount cleanup | useEffect cleanup + AbortController | React 16.8+ hooks | Clean cancellation of in-flight requests |
| Fixed vh units on mobile | dvh (dynamic viewport height) | 2023 browser support | Keyboard-aware viewport sizing on iOS Safari |
| Manual scroll management | scrollIntoView + scroll-behavior CSS | Evergreen browsers | Native smooth scrolling with no JS overhead |

**Deprecated/outdated:**
- EventSource: Cannot do POST requests — unusable for chat APIs that require a message body
- `100vh` on mobile: Does not account for iOS Safari toolbar/keyboard — use `100dvh` instead

## Open Questions

1. **Worker deployed URL**
   - What we know: The worker name is `portfolio-chat-proxy` and will deploy to `*.workers.dev`
   - What's unclear: The exact subdomain URL after deployment
   - Recommendation: Use `import.meta.env.VITE_PROXY_URL` throughout. Set `VITE_PROXY_URL=https://portfolio-chat-proxy.<account>.workers.dev` in `.env.production` or GitHub Actions secrets. The STATE.md blocker notes this: "Worker URL (*.workers.dev subdomain) is unknown until Phase 1 deploys."

2. **Token batching threshold**
   - What we know: Individual APPEND_TOKEN dispatches per token can cause performance issues
   - What's unclear: Whether framer-motion's animation overhead makes batching critical
   - Recommendation: Start without batching (simplest). If performance degrades during testing, add requestAnimationFrame batching. React 18's automatic batching helps — multiple dispatches in a microtask batch into one render.

## Sources

### Primary (HIGH confidence)
- Project codebase analysis: package.json, App.jsx, components/index.jsx, custom.scss, data/chatPrompt.js, workers/chat-proxy/src/index.js, vite.config.js, .env
- OpenAI SSE streaming format: industry-standard `data: {json}\n\n` protocol used by DeepSeek API (OpenAI-compatible)

### Secondary (MEDIUM confidence)
- framer-motion AnimatePresence: documented pattern for conditional mount/unmount animation, verified in project's existing usage across 9+ files
- CSS `dvh` units: supported in all evergreen browsers since 2023 for mobile viewport handling

### Tertiary (LOW confidence)
- None — all research based on project codebase analysis and established web standards

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all dependencies already installed, patterns verified in codebase
- Architecture: HIGH - standard React patterns (useReducer, Context, custom hooks), consistent with existing project structure
- Pitfalls: HIGH - well-known issues with SSE buffer boundaries, mobile viewport, streaming re-renders

**Research date:** 2026-02-28
**Valid until:** 2026-03-28 (30 days — stable technologies, no fast-moving dependencies)
