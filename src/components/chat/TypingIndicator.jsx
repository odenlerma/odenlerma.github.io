import { motion } from 'framer-motion';

/**
 * Animated bouncing dots shown while waiting for bot response stream.
 */
const TypingIndicator = () => {
  return (
    <div className="chat-typing-indicator">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="dot"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
};

export default TypingIndicator;
