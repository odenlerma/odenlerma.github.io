import { useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

/**
 * Inline (non-floating) chat interface for the "Ask My AI" section.
 * Shares conversation state with the floating widget via ChatProvider.
 * Dispatches welcome message immediately on mount (not gated on isOpen).
 */
const InlineChat = () => {
  const { state, dispatch } = useChat();
  const hasWelcomed = useRef(false);

  // Dispatch welcome message on first render if no messages exist
  useEffect(() => {
    if (!hasWelcomed.current && state.messages.length === 0) {
      hasWelcomed.current = true;
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: 'welcome',
          content:
            "Hi! I'm Audy, Audruey's AI assistant. Ask me anything about her experience, skills, or projects.",
          isLimit: false,
        },
      });
    }
  }, [state.messages.length, dispatch]);

  return (
    <div className="inline-chat">
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default InlineChat;
