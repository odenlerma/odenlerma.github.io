import { useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import StarterQuestions from './StarterQuestions';

/**
 * Scrollable message container with auto-scroll to bottom.
 * Shows typing indicator during streaming, starter questions when empty.
 */
const MessageList = () => {
  const { state, dispatch, sendMessage } = useChat();
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when messages change or during streaming
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isStreaming]);

  // Determine if typing indicator should show:
  // Show when streaming AND the last bot message has empty content (tokens haven't arrived yet)
  const showTyping = (() => {
    if (!state.isStreaming) return false;
    const lastMsg = state.messages[state.messages.length - 1];
    if (!lastMsg) return true;
    // Show indicator if last message is a user message (bot message not started yet)
    // or if last message is a bot message with empty content (waiting for first token)
    return lastMsg.role === 'user' || (lastMsg.role === 'assistant' && lastMsg.content === '');
  })();

  // Retry handler: resend the last user message
  const handleRetry = () => {
    // Find the last user message
    const lastUserMsg = [...state.messages]
      .reverse()
      .find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    // Clear error state
    dispatch({ type: 'SET_ERROR', payload: null });

    // Rebuild API messages up to and including the last user message
    const apiMessages = state.messages.filter(
      (m) => m.role === 'user' || m.role === 'assistant'
    );
    sendMessage(apiMessages);
  };

  return (
    <div className="chat-message-list">
      {state.messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          onRetry={msg.isError ? handleRetry : undefined}
        />
      ))}
      {showTyping && <TypingIndicator />}
      <StarterQuestions />
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
