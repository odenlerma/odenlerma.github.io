# Phase 4: Fix Error Display & Retry Flow - Research

**Researched:** 2026-02-28
**Domain:** React state wiring — connecting existing reducer state to existing UI components
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Error Presentation**
- Error displays as an inline chat bubble using the existing `MessageBubble` component with `isError: true`
- When `SET_ERROR` fires, the empty bot message from `START_BOT_MESSAGE` is replaced/converted into an error bubble (no orphaned empty bubbles)
- Error bubble gets a subtle accent border (`1px solid rgba($primary, 0.3)`) — mirrors the `--limit` bubble pattern using `$secondary`
- Text + retry button only — no warning icon. The accent border and retry button are sufficient visual signals

**Retry Behavior**
- Clicking retry transforms the error bubble back into a normal bot message (clears `isError`, resets content to empty), then streaming starts — feels like a seamless redo
- Unlimited retries — every failure shows the same error bubble with retry. Same code path, no retry counting
- Input is disabled during retry via existing `isStreaming` behavior — no special handling needed
- No double-click issue: error bubble is immediately replaced when retry is clicked (retry button disappears with `isError: false`)

### Claude's Discretion
- Error message wording (currently "Oops, something went wrong. Please try again." — can adjust)
- Whether to differentiate network errors vs server errors in the message text
- When `state.error` string clears (on retry, on new message send, etc.)
- Any necessary cleanup of the `handleRetry` function in MessageList to work with the replace-on-retry approach

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CHAT-08 | Error message displayed on network/API failure with friendly retry prompt | The full wiring path is known: `SET_ERROR` in `useChatApi.js` → `chatReducer` in `ChatContext.jsx` → last bot message updated in-place → `MessageBubble` renders with `isError: true` → `handleRetry` in `MessageList.jsx` transforms bubble back and calls `sendMessage` |
</phase_requirements>

---

## Summary

Phase 4 is a **pure state-wiring task** — no new libraries, no new components, no new SCSS classes needed. All the building blocks are already built and tested in isolation. The gap is that `SET_ERROR` stores error text in `state.error` but no code path bridges that string into a `messages` array entry. As a result, `MessageBubble`'s `isError` branch and `handleRetry` in `MessageList` are fully dead code despite being completely implemented.

The implementation requires exactly three coordinated changes across three files. First, the `SET_ERROR` reducer case in `ChatContext.jsx` must mutate the last bot message in `state.messages` — setting `isError: true` and replacing its empty `content` with the error string. Second, `handleRetry` in `MessageList.jsx` needs to reverse that mutation before calling `sendMessage` — resetting the last bot message to `isError: false` with empty content, which seamlessly restores the streaming state. Third, `.chat-bubble--error` in `style.scss` needs one line added: `border: 1px solid rgba($primary, 0.3)` to visually differentiate the error bubble from a normal bot bubble, mirroring the `--limit` variant pattern.

The approach works because `useChatApi` always dispatches `START_BOT_MESSAGE` first (creating an empty bot message with a known ID) before awaiting the fetch. When the fetch throws, the bot message already exists in `state.messages`. `SET_ERROR` can therefore find and mutate it by ID rather than appending a new message. This eliminates the orphaned empty bubble problem and keeps the message array clean.

**Primary recommendation:** Modify `SET_ERROR` to update the last bot message in place; modify `handleRetry` to reverse that update before retrying; add one `border` line to `.chat-bubble--error`.

---

## Standard Stack

### Core (no new installs required)

| File | Current Role | Phase 4 Change |
|------|-------------|----------------|
| `src/context/ChatContext.jsx` | `chatReducer` — `SET_ERROR` sets `state.error` only | Update `SET_ERROR` to also mutate last bot message |
| `src/components/chat/MessageList.jsx` | Has `handleRetry` — unreachable dead code | Fix `handleRetry` to use transform-not-clear approach |
| `src/components/chat/style.scss` | `.chat-bubble--error` — no border | Add `border: 1px solid rgba($primary, 0.3)` |

No new npm packages. No new components. No config changes.

### Already Complete (no changes needed)

| File | Why No Changes Needed |
|------|-----------------------|
| `src/hooks/useChatApi.js` | Already dispatches `SET_ERROR` with correct message string on all non-abort errors |
| `src/components/chat/MessageBubble.jsx` | Already renders `isError` class and retry button conditionally — fully functional |
| `src/components/chat/ChatInput.jsx` | Already disables input via `state.isStreaming` — retry re-uses same mechanism |

---

## Architecture Patterns

### The Core Pattern: In-Place Message Mutation via Reducer

The existing reducer already uses this pattern for `APPEND_TOKEN`:

```jsx
// Source: src/context/ChatContext.jsx — existing APPEND_TOKEN case
case 'APPEND_TOKEN':
  return {
    ...state,
    messages: state.messages.map((m) =>
      m.id === action.id
        ? { ...m, content: m.content + action.token }
        : m
    ),
  };
```

`SET_ERROR` must use the same map-by-id pattern to mutate the last bot message. The `botMessageId` is known to `useChatApi` at the time of the error — it was assigned when `START_BOT_MESSAGE` was dispatched. The `SET_ERROR` action must carry this ID as a payload field.

**Current `SET_ERROR` dispatch in `useChatApi.js` (line 85-88):**
```jsx
dispatch({
  type: 'SET_ERROR',
  payload: 'Oops, something went wrong. Please try again.',
});
```

**Required change:** Add the `botMessageId` to the action so the reducer knows which message to update:
```jsx
dispatch({
  type: 'SET_ERROR',
  payload: {
    id: botMessageId,
    message: 'Oops, something went wrong. Please try again.',
  },
});
```

**Updated `SET_ERROR` reducer case:**
```jsx
case 'SET_ERROR':
  return {
    ...state,
    isStreaming: false,
    error: action.payload.message,
    messages: state.messages.map((m) =>
      m.id === action.payload.id
        ? { ...m, isError: true, content: action.payload.message }
        : m
    ),
  };
```

This keeps `state.error` populated (for any future consumer) while simultaneously materializing the error into the message thread.

### The Retry Pattern: Transform-Back Before Resend

The locked decision is that retry transforms the error bubble back into a normal empty bot message before streaming starts. This avoids flicker and avoids a double bubble. The `handleRetry` in `MessageList.jsx` needs to know the ID of the error bubble to reverse-mutate it.

**Current `handleRetry` (lines 32-47 of `MessageList.jsx`) — problems:**
1. Dispatches `SET_ERROR` with `null` — this clears `state.error` but does NOT update the message (the error bubble stays visible)
2. Calls `sendMessage(apiMessages)` — which will dispatch `START_BOT_MESSAGE` creating a NEW empty bot message, resulting in a double bubble

**Fix: new `CLEAR_ERROR_MESSAGE` reducer action** (or reuse `START_BOT_MESSAGE` with the error bubble's ID to reset it in-place). Two viable approaches:

**Option A — New `RESET_BOT_MESSAGE` action (recommended for clarity):**
```jsx
// Reducer case
case 'RESET_BOT_MESSAGE':
  return {
    ...state,
    isStreaming: true,
    error: null,
    messages: state.messages.map((m) =>
      m.id === action.id
        ? { ...m, isError: false, content: '' }
        : m
    ),
  };
```

```jsx
// In handleRetry — needs to know the error message's ID
const handleRetry = () => {
  const errorMsg = state.messages.find((m) => m.isError);
  if (!errorMsg) return;

  const lastUserMsg = [...state.messages].reverse().find((m) => m.role === 'user');
  if (!lastUserMsg) return;

  // Transform error bubble back to empty bot message and set isStreaming
  dispatch({ type: 'RESET_BOT_MESSAGE', id: errorMsg.id });

  // Rebuild API messages (exclude error bubble content)
  const apiMessages = state.messages
    .filter((m) => m.role === 'user' || (m.role === 'assistant' && !m.isError))
    .concat({ role: 'user', content: lastUserMsg.content });

  sendMessage(apiMessages, errorMsg.id); // pass id so useChatApi reuses it
};
```

**Option B — Pass error bubble ID to `sendMessage` and skip `START_BOT_MESSAGE`:** More invasive — requires changing `useChatApi`'s `sendMessage` signature. Avoid.

**Recommendation: Option A.** Add `RESET_BOT_MESSAGE` reducer case. In `handleRetry`, find the error bubble by `isError`, dispatch `RESET_BOT_MESSAGE` with its ID, then call the existing `sendMessage`. However, `sendMessage` always dispatches `START_BOT_MESSAGE` creating a new ID — this still causes a double bubble unless `useChatApi` is also updated.

**Revised simplest approach (least invasive):**

Keep `sendMessage` signature unchanged. Instead, `handleRetry` dispatches a new action that:
1. Removes the error bubble from the message array
2. Clears `state.error`
3. Sets `isStreaming: true`

Then `sendMessage` runs as normal, dispatching `START_BOT_MESSAGE` which appends a fresh empty bot message. The sequence is clean: error bubble disappears → new empty bot message appears → streaming starts.

```jsx
// Reducer case: CLEAR_ERROR_MESSAGE
case 'CLEAR_ERROR_MESSAGE':
  return {
    ...state,
    isStreaming: false, // sendMessage will set true when it dispatches
    error: null,
    messages: state.messages.filter((m) => !m.isError),
  };
```

```jsx
// handleRetry in MessageList.jsx
const handleRetry = () => {
  const lastUserMsg = [...state.messages].reverse().find((m) => m.role === 'user');
  if (!lastUserMsg) return;

  // Remove the error bubble and clear state.error
  dispatch({ type: 'CLEAR_ERROR_MESSAGE' });

  // Rebuild API messages up to and including last user message
  const apiMessages = state.messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && !m.isError);
  sendMessage(apiMessages);
};
```

This is the cleanest approach because `sendMessage` creates a fresh bot message ID each time, which is needed for the streaming `APPEND_TOKEN` dispatch to work correctly (it matches tokens by ID).

**Choosing between "transform in place" vs "remove + re-add":**

The locked decision says "transforms the error bubble back into a normal bot message." However, the planner should be aware of the implementation tradeoff:

- **Transform in place**: Requires passing the error bubble's ID into `sendMessage` so `START_BOT_MESSAGE` is skipped or replaced — changes `useChatApi.js` signature
- **Remove + re-add**: Simpler, no changes to `useChatApi.js`, but there is a brief visual moment where the error bubble disappears before the new empty bot bubble appears (then streaming fills it)

From a user perspective both look the same — the retry button disappears immediately. The planner should pick whichever approach minimizes file changes.

### SCSS Pattern: Mirroring `--limit`

The `--limit` variant in `style.scss` (line 170):
```scss
&--limit {
  align-self: flex-start;
  background: lighten($dark, 8%);
  color: rgba($light, 0.9);
  border: 1px solid rgba($secondary, 0.3);
  border-bottom-left-radius: 4px;
}
```

The `--error` variant (lines 159-164) currently has no border. Add:
```scss
&--error {
  align-self: flex-start;
  background: lighten($dark, 8%);
  color: rgba($light, 0.9);
  border: 1px solid rgba($primary, 0.3);   // ADD THIS LINE
  border-bottom-left-radius: 4px;
}
```

`$primary` is `#FC5130` (orange-red) — semantically appropriate for error state, mirrors `$secondary` blue used for the limit state.

### Anti-Patterns to Avoid

- **Do NOT add a separate error UI element outside `MessageBubble`:** The locked decision specifies inline error bubble only. A toast, banner, or `state.error` read in another component would create dead code duplication.
- **Do NOT check `state.error` in `MessageList` to conditionally render an error bubble:** The error lives in `state.messages` (as an `isError` message), not as a separate render branch. The message loop already renders all messages.
- **Do NOT add a `CLEAR_ERROR` + new message approach that uses `ADD_SYSTEM_MESSAGE`:** That adds a non-dismissible system message class. Error bubbles must be clearable (replaced by streaming) and retryable.
- **Do NOT retain orphaned empty bot messages when error fires:** `SET_ERROR` fires after `START_BOT_MESSAGE` already added an empty bot message. The reducer must update that message, not append a new one.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Abort in-flight fetch on retry | Custom fetch cancellation | `AbortController` already in `useChatApi.js` (`abortRef.current?.abort()`) | `sendMessage` already calls this at the start — retry gets it for free |
| Disabling input during retry | New `isRetrying` state flag | Existing `isStreaming: true` set by `ADD_USER_MESSAGE` / by sendMessage flow | `ChatInput` already disables on `state.isStreaming` |
| Styling the retry button | New button component | Existing `.chat-bubble__retry` class in `style.scss` — fully styled | Hover, border, padding all done |
| Retry button visibility | Manual show/hide logic | `{isError && onRetry && <button>}` in `MessageBubble.jsx` (line 28) | Already conditional — passes `onRetry` only for error messages |

---

## Common Pitfalls

### Pitfall 1: Orphaned Empty Bot Message on Error

**What goes wrong:** If `SET_ERROR` only sets `state.error` without also modifying the bot message that `START_BOT_MESSAGE` already added, the user sees an empty bot bubble AND the error bubble as two separate items.

**Why it happens:** `useChatApi.js` always dispatches `START_BOT_MESSAGE` before the `fetch` call. If the fetch fails immediately (no network), the empty `{ id, role: 'assistant', content: '' }` message sits in `state.messages` with no content.

**How to avoid:** `SET_ERROR` must update the existing bot message (by ID) rather than append. Pass `botMessageId` in the action payload.

**Warning signs:** Test by disconnecting network. If two bot-side bubbles appear on failure, orphan is happening.

### Pitfall 2: Double Bot Bubble on Retry

**What goes wrong:** `handleRetry` calls `sendMessage`, which dispatches `START_BOT_MESSAGE` creating a new empty bot message. If the error bubble is still in `state.messages`, the user sees: error bubble (stays) + new empty bubble + streaming into new bubble.

**Why it happens:** `sendMessage` unconditionally dispatches `START_BOT_MESSAGE` with a fresh UUID.

**How to avoid:** Before calling `sendMessage`, dispatch an action that removes the error bubble from `state.messages`. The simplest: `CLEAR_ERROR_MESSAGE` that filters out `m.isError` messages.

**Warning signs:** After clicking retry, two assistant-side bubbles appear.

### Pitfall 3: `apiMessages` in `handleRetry` Includes Error Content

**What goes wrong:** The error message has `role: 'assistant'` — if `apiMessages` is rebuilt by filtering `m.role === 'assistant'`, it includes the error bubble's content ("Oops, something went wrong…") as a real assistant turn in the conversation history.

**Why it happens:** Error message has `role: 'assistant'` (it's a bot-side bubble). Generic role filter catches it.

**How to avoid:** Filter by `!m.isError` in addition to role when building `apiMessages` for the API call:
```jsx
const apiMessages = state.messages.filter(
  (m) => (m.role === 'user' || m.role === 'assistant') && !m.isError
);
```

**Warning signs:** API context contains "Oops, something went wrong" as an assistant message — visible in network tab.

### Pitfall 4: `state.error` Not Cleared After Successful Retry

**What goes wrong:** `state.error` remains set to the error string after a successful retry. Future dispatches that read `state.error` see stale data.

**Why it happens:** `STREAM_COMPLETE` does not clear `state.error`. Only `ADD_USER_MESSAGE` clears it.

**How to avoid:** Ensure the retry path clears `state.error`. Options: (a) `CLEAR_ERROR_MESSAGE` action clears it, or (b) `STREAM_COMPLETE` always clears it. Either works — pick one and be consistent.

### Pitfall 5: ESLint `max-warnings 0` Will Reject Unused Variables

**What goes wrong:** If `state.error` is left as a returned property from `chatReducer` that nothing in the UI reads, ESLint may flag it — or if `handleRetry` has stale closure issues or unreachable code, lint will block the build (`npm run build` → `npm run lint` is strict).

**Why it happens:** Project's `npm run lint` runs with `--max-warnings 0`. Any warning is a build failure.

**How to avoid:** After changes, run `npm run lint` before considering the task done.

---

## Code Examples

Verified patterns from existing codebase:

### Complete Updated `SET_ERROR` Reducer Case
```jsx
// File: src/context/ChatContext.jsx
// Pattern: map-by-id (same as APPEND_TOKEN)
case 'SET_ERROR':
  return {
    ...state,
    isStreaming: false,
    error: action.payload.message,
    messages: state.messages.map((m) =>
      m.id === action.payload.id
        ? { ...m, isError: true, content: action.payload.message }
        : m
    ),
  };
```

### Updated `SET_ERROR` Dispatch in `useChatApi.js`
```jsx
// File: src/hooks/useChatApi.js — in the catch block (line 83-89)
// botMessageId is already in scope (line 22)
} catch (err) {
  if (err.name !== 'AbortError') {
    dispatch({
      type: 'SET_ERROR',
      payload: {
        id: botMessageId,
        message: 'Oops, something went wrong. Please try again.',
      },
    });
  }
}
```

### New `CLEAR_ERROR_MESSAGE` Reducer Case
```jsx
// File: src/context/ChatContext.jsx — add after SET_ERROR case
case 'CLEAR_ERROR_MESSAGE':
  return {
    ...state,
    error: null,
    messages: state.messages.filter((m) => !m.isError),
  };
```

### Updated `handleRetry` in `MessageList.jsx`
```jsx
// File: src/components/chat/MessageList.jsx
const handleRetry = () => {
  const lastUserMsg = [...state.messages]
    .reverse()
    .find((m) => m.role === 'user');
  if (!lastUserMsg) return;

  // Remove error bubble and clear state.error
  dispatch({ type: 'CLEAR_ERROR_MESSAGE' });

  // Rebuild API messages — exclude isError messages
  const apiMessages = state.messages.filter(
    (m) => (m.role === 'user' || m.role === 'assistant') && !m.isError
  );
  sendMessage(apiMessages);
};
```

### SCSS Change for `.chat-bubble--error`
```scss
// File: src/components/chat/style.scss — line 159
&--error {
  align-self: flex-start;
  background: lighten($dark, 8%);
  color: rgba($light, 0.9);
  border: 1px solid rgba($primary, 0.3); // ADD — mirrors --limit pattern
  border-bottom-left-radius: 4px;
}
```

---

## State of the Art

| What Was Missing | What Exists | What Phase 4 Adds |
|-----------------|-------------|-------------------|
| `state.error` consumer | `state.error` set by `SET_ERROR` but never read by UI | `SET_ERROR` now also writes into `state.messages` so the message loop renders it |
| Error bubble creation | `MessageBubble` has full `isError` implementation | `chatReducer` populates a message with `isError: true` |
| Retry execution | `handleRetry` exists but dispatches `SET_ERROR: null` (wrong approach) | `handleRetry` dispatches `CLEAR_ERROR_MESSAGE` then calls `sendMessage` cleanly |
| Error bubble styling | `.chat-bubble--error` class exists, no border | One `border` line added |

---

## Open Questions

1. **Error message wording (Claude's Discretion)**
   - What we know: Current string is "Oops, something went wrong. Please try again."
   - What's unclear: Whether to differentiate network timeout vs HTTP 4xx/5xx
   - Recommendation: Keep single generic string. `useChatApi.js` already has `err.name !== 'AbortError'` guard — network and server errors reach the same `catch`. Differentiating would require inspecting `err.message` (which contains "HTTP 429", "HTTP 500", etc.) — adds complexity for minimal UX gain. Single friendly message is appropriate.

2. **When does `state.error` clear? (Claude's Discretion)**
   - What we know: `ADD_USER_MESSAGE` already sets `error: null`. `CLEAR_ERROR_MESSAGE` (new action) also clears it.
   - What's unclear: Whether `STREAM_COMPLETE` should also clear it (belt-and-suspenders)
   - Recommendation: `CLEAR_ERROR_MESSAGE` is sufficient. `STREAM_COMPLETE` does not need to change — success path never sets `state.error`, so clearing it there is redundant noise.

3. **`handleRetry` `apiMessages` construction edge case**
   - What we know: Must exclude `isError` messages from the API context
   - What's unclear: What if there are multiple past error messages (user retried, failed again, retried again)?
   - Recommendation: Filter all `isError` messages from API context every time. The filter `!m.isError` handles any count of past errors automatically.

---

## Sources

### Primary (HIGH confidence — direct codebase inspection)
- `src/context/ChatContext.jsx` — complete `chatReducer`, `initialState`, `ChatProvider`
- `src/hooks/useChatApi.js` — complete `sendMessage` and error dispatch flow
- `src/components/chat/MessageBubble.jsx` — `isError` branch, retry button rendering
- `src/components/chat/MessageList.jsx` — existing `handleRetry` implementation
- `src/components/chat/style.scss` — `.chat-bubble--error`, `.chat-bubble--limit`, `.chat-bubble__retry` styles
- `src/components/chat/ChatInput.jsx` — `state.isStreaming` disable behavior
- `.planning/phases/04-fix-error-display/04-CONTEXT.md` — locked decisions

### Secondary (MEDIUM confidence)
- `.planning/REQUIREMENTS.md` — CHAT-08 requirement text and traceability

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; all existing code inspected directly
- Architecture patterns: HIGH — patterns derived directly from existing reducer and component code
- Pitfalls: HIGH — identified by tracing the exact dispatch sequence in `useChatApi.js` → `chatReducer` → `MessageBubble`

**Research date:** 2026-02-28
**Valid until:** No expiry — purely internal code analysis, not dependent on external library versions
