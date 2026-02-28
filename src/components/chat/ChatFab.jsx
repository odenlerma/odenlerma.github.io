import { motion } from 'framer-motion';
import { useChat } from '@/context/ChatContext';

/**
 * Floating action button for opening/closing the chat widget.
 * Gradient background from $primary to $secondary, circular, bottom-right.
 */
const ChatFab = () => {
  const { state, dispatch } = useChat();

  return (
    <motion.button
      className="chat-fab"
      onClick={() => dispatch({ type: 'TOGGLE_OPEN' })}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={state.isOpen ? 'Close chat' : 'Open chat'}
    >
      <i className={`bi ${state.isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'}`} />
    </motion.button>
  );
};

export default ChatFab;
