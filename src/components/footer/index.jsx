import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Container from 'react-bootstrap/Container';

import './style.scss';
import AnimatedText, { FadeInView } from '@components/common/AnimatedText';

// Social links
const socialLinks = [
  { icon: 'envelope-at-fill', href: 'mailto:audrueygana.uiux@gmail.com', label: 'Email' },
  { icon: 'linkedin', href: 'https://www.linkedin.com/in/audruey-gana-205a73303/', label: 'LinkedIn' },
  { icon: 'github', href: 'https://github.com/odenlerma', label: 'GitHub' },
  { icon: 'messenger', href: 'https://m.me/audruey/', label: 'Messenger' }
];

// eslint-disable-next-line react/prop-types
export const CUSTOM_FOOTER = () => {
  const [manilaTime, setManilaTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setManilaTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="custom-footer">
      <Container className="footer-container">
        {/* CTA Section */}
        <div className="footer-cta">
          <FadeInView delay={0.1}>
            <span className="cta-label font-mono">Ready to collaborate?</span>
          </FadeInView>
          <AnimatedText
            text="Let's Create Something"
            as="h2"
            className="cta-title"
            delay={0.2}
            staggerDelay={0.02}
          />
          <AnimatedText
            text="Unforgettable"
            as="h2"
            className="cta-title cta-title--accent"
            delay={0.5}
            staggerDelay={0.02}
          />
          <FadeInView delay={0.7}>
            <p className="cta-subtitle">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>
          </FadeInView>
          <FadeInView delay={0.8}>
            <motion.a
              href="mailto:audrueygana.uiux@gmail.com"
              className="cta-button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Start a Conversation</span>
              <i className="bi bi-arrow-right"></i>
            </motion.a>
          </FadeInView>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-info">
            {/* Logo/Name */}
            <div className="footer-brand">
              <span className="brand-text">Audruey Gana</span>
              <span className="brand-title font-mono">Software Developer</span>
            </div>

            {/* Manila Time */}
            <div className="footer-time">
              <span className="time-label font-mono">Manila Time</span>
              <span className="time-value">{manilaTime}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="footer-social">
            {socialLinks.map((link, index) => (
              <motion.a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={link.label}
              >
                <i className={`bi bi-${link.icon}`}></i>
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <div className="footer-copyright">
            <p>
              Designed & Built by <span className="text-primary">Audruey Gana</span>
            </p>
            <p className="copyright-year font-mono">&copy; {currentYear}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default CUSTOM_FOOTER;
