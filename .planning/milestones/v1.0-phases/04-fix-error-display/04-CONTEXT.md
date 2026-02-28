# Phase 4: Fix Error Display & Retry Flow - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire error state to UI so network/API failures show a visible error message with a working retry button — closing the only unsatisfied requirement (CHAT-08). The gap: `useChatApi` dispatches `SET_ERROR` which sets `state.error`, but no UI component consumes it. `MessageBubble` has `isError` styling and retry button code, but no message with `isError: true` is ever created.

</domain>

<decisions>
## Implementation Decisions

### Error Presentation
- Error displays as an **inline chat bubble** using the existing `MessageBubble` component with `isError: true`
- When `SET_ERROR` fires, the empty bot message from `START_BOT_MESSAGE` is **replaced/converted** into an error bubble (no orphaned empty bubbles)
- Error bubble gets a **subtle accent border** (`1px solid rgba($primary, 0.3)`) — mirrors the `--limit` bubble pattern using `$secondary`
- **Text + retry button only** — no warning icon. The accent border and retry button are sufficient visual signals

### Retry Behavior
- Clicking retry **transforms the error bubble back** into a normal bot message (clears `isError`, resets content to empty), then streaming starts — feels like a seamless redo
- **Unlimited retries** — every failure shows the same error bubble with retry. Same code path, no retry counting
- Input is **disabled during retry** via existing `isStreaming` behavior — no special handling needed
- No double-click issue: error bubble is immediately replaced when retry is clicked (retry button disappears with `isError: false`)

### Claude's Discretion
- Error message wording (currently "Oops, something went wrong. Please try again." — can adjust)
- Whether to differentiate network errors vs server errors in the message text
- When `state.error` string clears (on retry, on new message send, etc.)
- Any necessary cleanup of the `handleRetry` function in MessageList to work with the replace-on-retry approach

</decisions>

<specifics>
## Specific Ideas

No specific requirements — the user wants a clean, minimal approach that reuses existing code (MessageBubble's isError variant, retry button, handleRetry in MessageList). The pattern should mirror how `--limit` bubbles already work.

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `MessageBubble.jsx`: Already has `isError` prop, `chat-bubble--error` class, and conditional retry button rendering — all unused currently
- `MessageList.jsx`: Has `handleRetry` function that finds last user message, clears error, rebuilds API messages, and calls `sendMessage` — unreachable but functional
- `style.scss`: Has `.chat-bubble--error` class (needs accent border added) and `.chat-bubble__retry` styling (fully styled, ready to use)

### Established Patterns
- `--limit` bubble uses `border: 1px solid rgba($secondary, 0.3)` for visual differentiation — error bubble should mirror with `$primary`
- State flows through `useReducer` in `ChatContext` — all state changes go through dispatch actions
- `ADD_USER_MESSAGE` already clears `state.error` to `null`

### Integration Points
- `SET_ERROR` reducer case needs to also modify the last bot message in `state.messages` (add `isError: true`, set content to error text)
- `handleRetry` in `MessageList` needs to reset the error message back to a normal bot message before calling `sendMessage`
- No new components needed — all wiring happens in `ChatContext.jsx` reducer and `MessageList.jsx` retry handler

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-fix-error-display*
*Context gathered: 2026-02-28*
