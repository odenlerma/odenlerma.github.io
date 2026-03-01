import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '@/context/ChatContext';

/**
 * Floating action button for opening/closing the chat widget.
 * Gradient background, 68px desktop / 56px mobile.
 * Pulse glow animation draws attention until user interacts.
 * CTA label appears beside the FAB before first interaction.
 */
const ChatFab = () => {
  const { state, dispatch } = useChat();

  // Glow + label only when chat is closed AND user hasn't interacted yet
  const showGlow = !state.isOpen && !state.hasInteracted;

  const toggle = () => dispatch({ type: 'TOGGLE_OPEN' });

  return (
    <div className="chat-fab-wrapper">
      <AnimatePresence>
        {showGlow && (
          <motion.span
            className="chat-fab-label"
            onClick={toggle}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            Ask AI about Audruey
          </motion.span>
        )}
      </AnimatePresence>

      <div style={{ position: 'relative' }}>
        <AnimatePresence>
          {showGlow && (
            <motion.div
              className="chat-fab-orbit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="chat-fab-orbit__dot chat-fab-orbit__dot--coral" />
              <span className="chat-fab-orbit__dot chat-fab-orbit__dot--blue" />
              <span className="chat-fab-orbit__dot chat-fab-orbit__dot--green" />
              <span className="chat-fab-orbit__dot chat-fab-orbit__dot--purple" />
              <span className="chat-fab-orbit__dot chat-fab-orbit__dot--coral" />
              <span className="chat-fab-orbit__dot chat-fab-orbit__dot--blue" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className={`chat-fab${showGlow ? ' chat-fab--glow' : ''}`}
          onClick={toggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={state.isOpen ? 'Close chat' : 'Open chat'}
        >
          <i className={`bi ${state.isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'}`} />
        </motion.button>
      </div>
    </div>
  );
};

export default ChatFab;
