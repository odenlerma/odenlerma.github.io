import { motion } from 'framer-motion';

/* eslint-disable react/prop-types */
/**
 * Individual chat message bubble.
 * Styling varies by role (user/assistant) and state (error/limit).
 */
const MessageBubble = ({ message, onRetry }) => {
  const { role, content, isError, isLimit } = message;

  const bubbleClass = [
    'chat-bubble',
    role === 'user' ? 'chat-bubble--user' : 'chat-bubble--bot',
    isError ? 'chat-bubble--error' : '',
    isLimit ? 'chat-bubble--limit' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <motion.div
      className={bubbleClass}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {content}
      {isError && onRetry && (
        <button className="chat-bubble__retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </motion.div>
  );
};

export default MessageBubble;
