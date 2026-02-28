import { useState } from 'react';
import { useChat, SESSION_LIMIT } from '@/context/ChatContext';

/**
 * Text input with send button. Supports Enter key submit.
 * Enforces session message limit before sending.
 */
const ChatInput = () => {
  const [value, setValue] = useState('');
  const { state, dispatch, sendMessage } = useChat();

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || state.isStreaming) return;

    // Check session limit before sending
    if (state.messageCount >= SESSION_LIMIT) {
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: crypto.randomUUID(),
          content:
            "Thanks for chatting! You've reached the session limit. Feel free to reach out to Audruey directly at audrueygana.uiux@gmail.com!",
          isLimit: true,
        },
      });
      setValue('');
      return;
    }

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };
    dispatch({ type: 'ADD_USER_MESSAGE', payload: userMsg });

    // Build API messages: only user and assistant roles + new message
    const apiMessages = [
      ...state.messages.filter(
        (m) => m.role === 'user' || m.role === 'assistant'
      ),
      userMsg,
    ];
    sendMessage(apiMessages);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-container">
      <textarea
        className="chat-input"
        rows={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about Audruey..."
        disabled={state.isStreaming}
      />
      <button
        className="chat-send-btn"
        onClick={handleSubmit}
        disabled={state.isStreaming || !value.trim()}
        aria-label="Send message"
      >
        <i className="bi bi-send-fill" />
      </button>
    </div>
  );
};

export default ChatInput;
