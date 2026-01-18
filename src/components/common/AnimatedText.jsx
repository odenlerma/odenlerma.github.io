import { motion } from 'framer-motion';

/**
 * AnimatedText - Text reveal component with character-by-character animation
 *
 * @param {string} text - The text to animate
 * @param {string} className - Additional CSS classes
 * @param {string} as - HTML element to render (h1, h2, p, span, etc.)
 * @param {number} delay - Initial delay before animation starts
 * @param {number} staggerDelay - Delay between each character
 * @param {string} animation - Animation type: 'reveal', 'fade', 'slide', 'blur'
 * @param {boolean} once - Only animate once when in view
 */
const AnimatedText = ({
  text = '',
  className = '',
  as = 'span',
  delay = 0,
  staggerDelay = 0.03,
  animation = 'reveal',
  once = true,
  style = {}
}) => {
  // Split text into words for better wrapping
  const words = text.split(' ');

  // Animation variants based on type
  const getVariants = () => {
    switch (animation) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
      case 'slide':
        return {
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0 }
        };
      case 'blur':
        return {
          hidden: { opacity: 0, filter: 'blur(10px)' },
          visible: { opacity: 1, filter: 'blur(0px)' }
        };
      case 'reveal':
      default:
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        };
    }
  };

  const charVariants = getVariants();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay
      }
    }
  };

  const MotionComponent = motion[as] || motion.span;

  return (
    <MotionComponent
      className={className}
      style={{ display: 'inline-block', ...style }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              style={{ display: 'inline-block' }}
              variants={charVariants}
              transition={{
                duration: 0.4,
                ease: [0.2, 0.65, 0.3, 0.9]
              }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && (
            <span style={{ display: 'inline-block' }}>&nbsp;</span>
          )}
        </span>
      ))}
    </MotionComponent>
  );
};

/**
 * AnimatedLines - Animate text line by line
 */
export const AnimatedLines = ({
  lines = [],
  className = '',
  lineClassName = '',
  as = 'div',
  delay = 0,
  staggerDelay = 0.15,
  animation = 'reveal',
  once = true
}) => {
  const getVariants = () => {
    switch (animation) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        };
      case 'slide':
        return {
          hidden: { opacity: 0, x: -40 },
          visible: { opacity: 1, x: 0 }
        };
      case 'blur':
        return {
          hidden: { opacity: 0, filter: 'blur(10px)' },
          visible: { opacity: 1, filter: 'blur(0px)' }
        };
      case 'reveal':
      default:
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 }
        };
    }
  };

  const lineVariants = getVariants();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay
      }
    }
  };

  const MotionContainer = motion[as] || motion.div;

  return (
    <MotionContainer
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
    >
      {lines.map((line, index) => (
        <motion.div
          key={index}
          className={lineClassName}
          variants={lineVariants}
          transition={{
            duration: 0.6,
            ease: [0.2, 0.65, 0.3, 0.9]
          }}
        >
          {line}
        </motion.div>
      ))}
    </MotionContainer>
  );
};

/**
 * FadeInView - Simple fade in when element comes into view
 */
export const FadeInView = ({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  direction = 'up', // 'up', 'down', 'left', 'right', 'none'
  distance = 40,
  once = true,
  style = {}
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return {};
    }
  };

  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, ...getInitialPosition() }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.2, 0.65, 0.3, 0.9]
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * ScaleInView - Scale in animation when element comes into view
 */
export const ScaleInView = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  once = true,
  style = {}
}) => {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.2, 0.65, 0.3, 0.9]
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerContainer - Container for staggered children animations
 */
export const StaggerContainer = ({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.1,
  once = true,
  style = {}
}) => {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerItem - Item to be used inside StaggerContainer
 */
export const StaggerItem = ({
  children,
  className = '',
  direction = 'up',
  distance = 30,
  style = {}
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance };
      case 'down': return { y: -distance };
      case 'left': return { x: distance };
      case 'right': return { x: -distance };
      default: return {};
    }
  };

  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, ...getInitialPosition() },
        visible: { opacity: 1, x: 0, y: 0 }
      }}
      transition={{
        duration: 0.5,
        ease: [0.2, 0.65, 0.3, 0.9]
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedText;
