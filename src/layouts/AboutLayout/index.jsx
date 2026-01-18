import { motion } from 'framer-motion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './style.scss';
import AnimatedText, { FadeInView, StaggerContainer, StaggerItem } from '@components/common/AnimatedText';
import profileImg from '@assets/svg/audy.svg';
import resume from '@assets/Audruey.pdf';

// Tech stack data with categories
const techStack = [
  { name: 'React Native', category: 'core' },
  { name: 'React.js', category: 'core' },
  { name: 'JavaScript', category: 'core' },
  { name: 'Redux', category: 'state' },
  { name: 'REST API', category: 'backend' },
  { name: 'Git', category: 'tools' },
  { name: 'Figma', category: 'design' },
  { name: 'SASS/CSS', category: 'styling' },
  { name: 'Tailwind', category: 'styling' },
  { name: 'Vite', category: 'tools' },
  { name: 'n8n', category: 'automation' },
  { name: 'AI Integration', category: 'automation' },
  { name: 'AI-Assisted Developement', category: 'automation' },
  { name: 'Android', category: 'platform' },
  { name: 'iOS', category: 'platform' },
  { name: 'HTML', category: 'core' }
];

// Quick facts
const quickFacts = [
  { icon: 'geo-alt-fill', label: 'Location', value: 'Cavite, Philippines' },
  { icon: 'briefcase-fill', label: 'Experience', value: '7+ Years' },
  { icon: 'mortarboard-fill', label: 'Education', value: 'BS Information Technology' },
  { icon: 'translate', label: 'Languages', value: 'English, Filipino' }
];

// Contact links
const contactLinks = [
  { icon: 'envelope-at-fill', label: 'Email', href: 'mailto:audrueygana.uiux@gmail.com', value: 'audrueygana.uiux@gmail.com' },
  { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/audruey-gana-205a73303/', value: 'linkedin.com/in/audruey-gana' },
  { icon: 'github', label: 'GitHub', href: 'https://github.com/odenlerma', value: 'github.com/odenlerma' },
  { icon: 'messenger', label: 'Messenger', href: 'https://m.me/audruey/', value: 'm.me/audruey' }
];

function AboutLayout() {
  const openResume = () => {
    window.open(resume, "_blank");
  };

  return (
    <div className="about-layout">
      <Container className="about-container">
        {/* Section Header */}
        <div className="about-header">
          <FadeInView delay={0.1}>
            <span className="section-label font-mono">About Me</span>
          </FadeInView>
          <AnimatedText
            text="The Person Behind the Code"
            as="h2"
            className="section-title"
            delay={0.2}
            staggerDelay={0.03}
          />
        </div>

        {/* Main Content - Magazine Layout */}
        <Row className="about-content">
          {/* Left Column - Profile & Quick Info */}
          <Col lg={4} md={12} className="about-sidebar">
            {/* Profile Image */}
            <motion.div
              className="profile-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="profile-image-wrapper">
                <img src={profileImg} alt="Audruey Gana" className="profile-image" />
              </div>
              <div className="profile-name">
                <h3>Audruey Gana</h3>
                <span className="profile-title font-mono">Software Developer</span>
              </div>
            </motion.div>

            {/* Quick Facts */}
            <motion.div
              className="quick-facts"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="card-title">Quick Facts</h4>
              {quickFacts.map((fact, index) => (
                <div key={index} className="fact-item">
                  <i className={`bi bi-${fact.icon}`}></i>
                  <div className="fact-content">
                    <span className="fact-label">{fact.label}</span>
                    <span className="fact-value">{fact.value}</span>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Resume Button */}
            <motion.button
              className="resume-btn"
              onClick={openResume}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <i className="bi bi-file-earmark-pdf"></i>
              <span>Download Resume</span>
              <i className="bi bi-arrow-down-circle"></i>
            </motion.button>
          </Col>

          {/* Right Column - Bio & Details */}
          <Col lg={8} md={12} className="about-main">
            {/* Pull Quote */}
            <FadeInView delay={0.2} className="pull-quote">
              <blockquote>
                "I believe a good digital product keeps users coming back. There's nothing like the feeling of creating something that works."
              </blockquote>
            </FadeInView>

            {/* Bio */}
            <div className="bio-section">
              <FadeInView delay={0.3}>
                <p className="bio-text">
                  Hello there! I'm <strong className="text-primary">Audruey Gana</strong>, a software developer from Cavite, Philippines. I earned my Bachelor's degree in Information Technology from Cavite State University. Right after graduating, I got my dream job and have been coding ever since.
                </p>
              </FadeInView>

              <FadeInView delay={0.4}>
                <p className="bio-text">
                  I've spent over seven years building mobile apps. But I didn't stop there—I've also been exploring web development, AI automation, and UX design. I'm driven by curiosity and a love for learning. Programming can be challenging, but the satisfaction of creating something useful makes it all worthwhile.
                </p>
              </FadeInView>

              <FadeInView delay={0.5}>
                <p className="bio-text">
                  In every project, I focus on user experience. With how much influence digital products have now, it's important to create positive, useful, and engaging tools that leave a good impression. I see learning as a lifelong process—tech keeps changing, and I enjoy keeping up with it.
                </p>
              </FadeInView>
            </div>

            {/* Tech Stack */}
            <div className="tech-section">
              <FadeInView delay={0.4}>
                <h4 className="card-title">Tech Stack</h4>
              </FadeInView>
              <StaggerContainer className="tech-grid" delay={0.5} staggerDelay={0.05}>
                {techStack.map((tech, index) => (
                  <StaggerItem key={index}>
                    <motion.span
                      className={`tech-chip tech-chip--${tech.category}`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {tech.name}
                    </motion.span>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>

            {/* Contact Section */}
            <div className="contact-section">
              <FadeInView delay={0.5}>
                <h4 className="card-title">Let's Connect</h4>
              </FadeInView>
              <div className="contact-grid">
                {contactLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <i className={`bi bi-${link.icon}`}></i>
                    <div className="contact-info">
                      <span className="contact-label">{link.label}</span>
                      <span className="contact-value">{link.value}</span>
                    </div>
                    <i className="bi bi-arrow-up-right link-arrow"></i>
                  </motion.a>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AboutLayout;
