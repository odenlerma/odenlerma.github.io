import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import './style.scss';
import { FadeInView, StaggerContainer, StaggerItem } from '@components/common/AnimatedText';
import audrueyNameImg from '@assets/images/audruey.png';
import desktopImg from '@assets/images/desktop.png';
import avatarImg from '@assets/images/icon.png';
import loveImg from '@assets/images/love.png';

const roles = [
  { id: 1, text: 'Mobile App Developer' },
  { id: 2, text: 'Front-end Engineer' },
  { id: 3, text: 'UX Designer' },
  { id: 4, text: 'AI Context Engineer' }
];

function IntroLayout() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms for decorative elements
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  return (
    <div className="intro-layout" ref={containerRef}>
      {/* Decorative floating elements with parallax */}
      <motion.img
        src={desktopImg}
        alt=""
        className="floating-element balloon"
        style={{ y: y1, rotate: rotate1 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
      />
      <motion.img
        src={loveImg}
        alt=""
        className="floating-element love"
        style={{ y: y4 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.1, duration: 0.6, type: "spring" }}
      />

      <Container fluid className="intro-container">
        <Row className="intro-row align-items-center justify-content-center">
          {/* Left side - Text content */}
          <Col lg={6} md={12} className="intro-content">
            <div className="intro-text-wrapper">

              {/* Role titles */}
              <StaggerContainer
                className="roles-container"
                delay={1.2}
                staggerDelay={0.15}
              >
                {roles.map((role, index) => (
                  <StaggerItem key={role.id} className="role-item">
                    <span className="role-number">0{index + 1}</span>
                    <span className="role-text">{role.text}</span>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Brief intro */}
              <FadeInView delay={1.8} className="intro-brief">
                <p>
                  7+ years crafting digital experiences that users love.
                  Based in Cavite, Philippines.
                </p>
              </FadeInView>

              {/* CTA Buttons */}
              <FadeInView delay={2} className="intro-cta">
                <motion.a
                  href="#works"
                  className="btn btn-primary me-3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View My Work
                </motion.a>
                <motion.a
                  href="#about"
                  className="btn btn-outline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  About Me
                </motion.a>
              </FadeInView>
            </div>
          </Col>

          {/* Right side - Profile Image */}
          <Col lg={5} md={12} className="intro-visual">
            <motion.div
              className="profile-wrapper"
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{
                delay: 0.6,
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
            >
              {/* Greeting */}
              <FadeInView delay={0.2} className="greeting">
                <span className="greeting-text font-mono">Hello, I am</span>
              </FadeInView>
              <div className="profile-image-container">
                
                {/* Name - Character icon */}
                <motion.div
                  className="name-wrapper"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
                >
                  <img src={audrueyNameImg} alt="Audruey" className="hero-icon" />
                </motion.div>

                 <motion.img
                  src={avatarImg}
                  alt=""
                  className="floating-element avatar"
                  style={{ y: y3 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.9, duration: 0.6, type: "spring" }}
                />
              </div>

              {/* Status badge
              <motion.div
                className="status-badge"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, type: "spring" }}
              >
                <span className="status-dot"></span>
                <span className="status-text">Available for work</span>
              </motion.div> */}
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default IntroLayout;
