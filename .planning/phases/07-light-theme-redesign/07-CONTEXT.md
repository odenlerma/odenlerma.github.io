# Phase 7: Light Theme Redesign - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Restyle all existing chat components (`ChatWindow`, `ChatHeader`, `ChatInput`, `ChatFab`, `MessageList`, `MessageBubble`, `StarterQuestions`, `TypingIndicator`) with the portfolio's cream/coral/blue palette. Remove every dark-mode SCSS rule from `src/components/chat/style.scss`. The chat widget should visually integrate with the portfolio's light design system. No new features, no layout changes, no new components — purely a visual reskin.

</domain>

<decisions>
## Implementation Decisions

### Chat Panel Style
- Frosted glassmorphism panel — use the existing `glassmorphism` mixin from `custom.scss`
- Heavy frosting: ~85% opaque cream tint (`rgba(255,245,227, 0.85)`) with `backdrop-filter: blur(20px)` — aligns with existing `$glass-bg` and `$glass-blur` variables
- Glass border using `$glass-border: rgba(255,255,255, 0.3)` — soft, defined edge
- Soft box-shadow adapted for light theme (currently `rgba(0,0,0,0.3)` — should be lighter)

### Header Treatment
- Header background: slightly more opaque cream than the message area — creates subtle depth/layering
- Gradient accent: thin coral-to-blue gradient line (2-3px) along the bottom of the header as a separator
- Avatar: keep the existing coral-to-blue gradient fill circle with white icon — it becomes a color pop on the light header
- "Audy" name: use `gradient-text` mixin (coral-to-blue) — typographic accent
- Close button: dark text (`$dark`) with hover highlight on light background

### Bot Message Bubbles
- Subtle glass tint: `rgba(255,255,255, 0.6)` with `backdrop-filter: blur(10px)` and `border: 1px solid rgba(255,255,255, 0.4)` — white glass layered on the cream glass panel
- Error bubbles: same glass treatment + coral-tinted border (`rgba($primary, 0.3)`) with coral retry button
- Rate-limit bubbles: same glass treatment + blue-tinted border (`rgba($secondary, 0.3)`)

### User Message Bubbles
- Keep exactly as-is: solid coral (#FC5130) background, white text, bottom-right radius 4px
- No changes needed — coral on cream reads well

### Input Area
- Glass input area — continues the frosted panel treatment
- Text input field: slightly more opaque white/cream with subtle border
- Send button: keep existing coral-to-blue gradient (already correct)
- Focus ring: use `$secondary` (blue) for input focus state
- Placeholder text: muted dark tone

### Starter Question Chips
- Blue-tinted pills: `rgba($secondary, 0.08)` background, `$secondary` text, `rgba($secondary, 0.2)` border
- Hover: darken to `rgba($secondary, 0.15)` background

### Typing Indicator
- Same glass bubble treatment as bot messages
- Dots use gradient colors (coral-to-blue) as they bounce — adds personality

### Scrollbar
- Thin 6px custom scrollbar: `rgba($dark, 0.15)` thumb on transparent track
- Inverted from current white-on-dark approach

### Claude's Discretion
- Mobile panel treatment: frosted glass vs. solid cream for performance (user said "you decide")
- Bot message text color: optimize for readability on glass bubbles
- Exact opacity values and blur radii — calibrate for visual balance
- Box-shadow intensity on light theme
- Disabled state styling for input and send button

</decisions>

<specifics>
## Specific Ideas

- Bot bubbles should feel like Apple's notification bubbles on a blurred background — white glass layered on frosted glass
- The gradient bottom border on the header creates an elegant separator without overpowering the glass panel
- Gradient "Audy" text paired with the gradient avatar creates two accent points that bookend the header info section
- Typing indicator dots cycling through gradient colors adds personality during the wait state

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `glassmorphism` mixin (`custom.scss:95`): accepts `$blur` and `$bg` params — use directly for panel and bubble treatments
- `gradient-text` mixin (`custom.scss:103`): coral-to-blue gradient text — use for "Audy" header name
- `gradient-border` mixin (`custom.scss:111`): available but NOT used for this phase (decided on accent line instead)
- Glass variables: `$glass-blur: 20px`, `$glass-bg: rgba(255,245,227, 0.8)`, `$glass-border: rgba(255,255,255, 0.3)`
- Design tokens: `$primary: #FC5130`, `$secondary: #4C66FF`, `$light: #FFF5E3`, `$dark: #303036`

### Established Patterns
- All chat styles live in one file: `src/components/chat/style.scss` — single file to modify
- SCSS imports `custom.scss` for access to all variables and mixins
- BEM-style class naming: `.chat-bubble--user`, `.chat-header__info`, etc.
- Responsive breakpoint at 768px for mobile chat (full-screen takeover)

### Integration Points
- `style.scss` is the only file that needs SCSS changes — no component JSX changes required
- All color values reference SCSS variables (`$dark`, `$light`, `$primary`, `$secondary`) — systematic replacement
- Dark references to remove: `$dark` backgrounds, `lighten($dark, N%)` variants, `rgba(255,255,255, ...)` light-on-dark borders/text

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-light-theme-redesign*
*Context gathered: 2026-02-28*
