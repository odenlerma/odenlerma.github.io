import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useChat } from '@/context/ChatContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const panelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 20,
    transformOrigin: 'bottom right',
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 20,
    transition: { duration: 0.2 },
  },
};

/**
 * Main chat panel container with AnimatePresence for open/close animation.
 * Dispatches welcome message on first open.
 */
const ChatWindow = () => {
  const { state, dispatch } = useChat();
  const hasWelcomed = useRef(false);

  // Dispatch welcome message on first open
  useEffect(() => {
    if (state.isOpen && !hasWelcomed.current && state.messages.length === 0) {
      hasWelcomed.current = true;
      dispatch({
        type: 'ADD_SYSTEM_MESSAGE',
        payload: {
          id: 'welcome',
          content:
            "Hi! I'm Audy, I was created by Audruey to help you learn about her experience, skills, and projects. What would you like to know?",
          isLimit: false,
        },
      });
    }
  }, [state.isOpen, state.messages.length, dispatch]);

  return (
    <AnimatePresence>
      {state.isOpen && (
        <motion.div
          className="chat-window"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <ChatHeader />
          <MessageList />
          <ChatInput />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatWindow;
