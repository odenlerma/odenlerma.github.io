/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from 'react';
import { useChatApi } from '@hooks/useChatApi';

/**
 * Session message limit — number of user messages allowed per session.
 * Within the 15-20 range specified in requirements (COST-01).
 */
export const SESSION_LIMIT = 18;

// ─── Initial State ──────────────────────────────────────────────────
const initialState = {
  messages: [],       // Array of { id, role, content, isError, isLimit }
  isStreaming: false,  // Whether a response is currently streaming
  error: null,         // Current error message string or null
  messageCount: 0,     // Number of user messages sent (for session cap)
  isOpen: false,       // Whether the chat panel is open
  hasInteracted: false, // true after first message sent — stops FAB glow
};

// ─── Reducer ────────────────────────────────────────────────────────
export function chatReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_OPEN':
      return { ...state, isOpen: !state.isOpen };

    case 'SET_OPEN':
      return { ...state, isOpen: action.payload };

    case 'ADD_USER_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        messageCount: state.messageCount + 1,
        isStreaming: true,
        error: null,
        hasInteracted: true,
      };

    case 'START_BOT_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          { id: action.id, role: 'assistant', content: '' },
        ],
      };

    case 'APPEND_TOKEN':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.id
            ? { ...m, content: m.content + action.token }
            : m
        ),
      };

    case 'STREAM_COMPLETE':
      return { ...state, isStreaming: false };

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

    case 'CLEAR_ERROR_MESSAGE':
      return {
        ...state,
        error: null,
        messages: state.messages.filter((m) => !m.isError),
      };

    case 'ADD_SYSTEM_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: action.payload.id,
            role: 'assistant',
            content: action.payload.content,
            isLimit: action.payload.isLimit || false,
          },
        ],
      };

    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────
const ChatContext = createContext(null);

// ─── Provider ───────────────────────────────────────────────────────
// eslint-disable-next-line react/prop-types
export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { sendMessage, abort } = useChatApi(dispatch);

  return (
    <ChatContext.Provider value={{ state, dispatch, sendMessage, abort }}>
      {children}
    </ChatContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
