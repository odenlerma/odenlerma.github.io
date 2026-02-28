# Phase 8: Chatbot Visibility & Prominence - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Elevate the chatbot from a hidden floating widget to the portfolio's centerpiece. Add a dedicated "Ask My AI" scroll section with a fully functional embedded chat, and make the FAB larger and more attention-drawing. No new chat features — this is purely about visibility and prominence.

</domain>

<decisions>
## Implementation Decisions

### Section Placement & Flow
- Section goes after About: Intro → Works → About → Ask My AI → Footer
- Add to bottom nav as 4th tracked section (uses existing `useInView` pattern)
- Content-sized section (not full viewport height) — matches Works and About sections
- FAB remains visible at all scroll positions, even when the Ask My AI section is in the viewport

### Embedded Chat Experience
- Fully functional inline chat embedded in the section — visitors can type and get AI responses without opening the floating widget
- Shares the same ChatProvider context so conversation persists between section chat and floating widget
- Same starter question pills as the floating widget for consistent experience
- No auto-open of floating widget when scrolling away from the section — user taps FAB if they want to continue elsewhere

### FAB Animation & Size
- Subtle pulse glow animation using the coral-to-blue gradient shadow — eye-catching but not distracting
- Glow animation stops after the user has interacted with the chat once (opened it at least once)
- No glow when chat is open (X icon state) — only animates when chat is closed
- Icon only, no text label on the FAB

### Section Visual Design
- Centered single-column layout — headline and description centered at top, embedded chat centered below
- Playful & bold headline tone (e.g., "I trained an AI on my entire career. Try it." style)
- Minimal decoration — gradient text on headline (coral-to-blue), no heavy backgrounds or illustrations
- Staggered fade-up entrance animation via framer-motion: headline first, then description, then chat container (~0.15s stagger delay)

### Claude's Discretion
- FAB size (larger than current 56px/48px — pick something prominent but not obnoxious)
- Embedded chat height within the section (roughly matching floating widget's 520px or whatever looks balanced)
- Exact headline and description copy (playful & bold tone locked in)
- Spacing and typography details within the section

</decisions>

<specifics>
## Specific Ideas

- Headline should be personality-forward and attention-grabbing — "I trained an AI on my entire career. Try it." energy
- The embedded chat is the visual centerpiece of the section — headline and description set it up, chat delivers
- Both entry points (section chat + FAB floating widget) share conversation state seamlessly via ChatProvider

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ChatFab.jsx`: Existing FAB component with framer-motion hover/tap. Needs size increase + glow animation
- `ChatWindow.jsx`: Existing floating panel with AnimatePresence. Chat logic (header, message list, input) can be extracted for inline reuse
- `ChatProvider` / `ChatContext`: Manages isOpen, messages, dispatch — both FAB and inline chat will share this
- `MessageList`, `ChatHeader`, `ChatInput`: Sub-components of ChatWindow — potentially reusable in the inline section chat
- `style.scss`: Complete chat styling (glassmorphism bubbles, starters, input) — extend for inline variant
- SCSS mixins available: `glassmorphism`, `gradient-text`, `gradient-border`, `hover-lift`, `section-padding`, `noise-overlay`, `fluid-type`

### Established Patterns
- Sections use `<section>` with `section-snap` class, tracked via `useInView` from react-intersection-observer
- Each section wraps a Layout component (IntroLayout, WorksLayout, AboutLayout) — new section follows this pattern
- Components barrel-exported from `src/components/index.jsx` — new layout imported there
- framer-motion used for all animations (parallax, stagger, panel transitions)
- Bottom nav reads `getActiveSection()` from HomePage — needs new "ask-ai" case

### Integration Points
- `HomePage/index.jsx`: Add new `<section>` after About with `useInView` ref
- `App.jsx`: ChatProvider wrapping may need to move higher to share between CHAT_WIDGET and inline section
- `src/components/index.jsx`: Export new section layout component
- Bottom nav component: Add 4th section tracking
- `style.scss` (chat): Add inline chat variant styles + FAB glow animation

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-chatbot-visibility-prominence*
*Context gathered: 2026-02-28*
