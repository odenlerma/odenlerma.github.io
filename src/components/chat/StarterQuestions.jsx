import { motion, AnimatePresence } from 'framer-motion';
import { STARTER_QUESTIONS } from '@/data/chatPrompt';
import { useChat } from '@/context/ChatContext';

/**
 * Clickable pill chips for starter questions.
 * Disappear after the first user message.
 */
const StarterQuestions = () => {
  const { state, dispatch, sendMessage } = useChat();

  const handleClick = (question) => {
    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question,
    };
    dispatch({ type: 'ADD_USER_MESSAGE', payload: userMsg });

    // Build API messages: only user and assistant roles from current state + new message
    const apiMessages = [
      ...state.messages.filter(
        (m) => m.role === 'user' || m.role === 'assistant'
      ),
      userMsg,
    ];
    sendMessage(apiMessages);
  };

  return (
    <AnimatePresence>
      {state.messageCount === 0 && (
        <motion.div
          className="chat-starters"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
        >
          {STARTER_QUESTIONS.map((question) => (
            <motion.button
              key={question}
              className="chat-starter"
              onClick={() => handleClick(question)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {question}
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StarterQuestions;
