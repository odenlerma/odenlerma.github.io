import { motion } from 'framer-motion';
import { useChat } from '@/context/ChatContext';

/**
 * Floating action button for opening/closing the chat widget.
 * Gradient background, 68px desktop / 56px mobile.
 * Pulse glow animation draws attention until user interacts.
 */
const ChatFab = () => {
  const { state, dispatch } = useChat();

  // Glow only when chat is closed AND user hasn't interacted yet
  const showGlow = !state.isOpen && !state.hasInteracted;

  return (
    <motion.button
      className={`chat-fab${showGlow ? ' chat-fab--glow' : ''}`}
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
