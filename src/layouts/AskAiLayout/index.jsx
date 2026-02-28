import { motion } from 'framer-motion';
import { Container, Row, Col } from 'react-bootstrap';
import InlineChat from '@components/chat/InlineChat';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

/**
 * "Ask My AI" section layout — headline, description, and embedded inline chat.
 * Uses framer-motion staggered fade-up entrance when scrolled into view.
 */
const AskAiLayout = () => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
  >
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} className="text-center">
          <motion.h2 className="ask-ai__headline" variants={itemVariants}>
            I trained an AI on my entire career. Try it.
          </motion.h2>
          <motion.p className="ask-ai__description" variants={itemVariants}>
            Go ahead — ask about my projects, tech stack, experience, or
            anything else. Audy knows it all.
          </motion.p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8}>
          <motion.div variants={itemVariants}>
            <InlineChat />
          </motion.div>
        </Col>
      </Row>
    </Container>
  </motion.div>
);

export default AskAiLayout;
