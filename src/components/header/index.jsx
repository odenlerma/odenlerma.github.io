import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from 'react-bootstrap/Container';

import './style.scss';
import resume from '@assets/Audruey Gana - CV.pdf';
import logoImg from '@assets/images/icon.png';
import { useScrollProgress } from '@hooks/useScrollProgress';

const navItems = [
  { id: 1, label: 'Works', href: '#works', icon: 'bi-grid-3x3-gap-fill' },
  { id: 2, label: 'About', href: '#about', icon: 'bi-person-heart' },
  { id: 3, label: 'Resume', href: resume, external: true, icon: 'bi-file-earmark-arrow-down-fill' }
];

// eslint-disable-next-line react/prop-types
export const CUSTOM_HEADER = ({ refs = [] }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollProgress, isScrolled, scrollDirection } = useScrollProgress();
  const [isVisible, setIsVisible] = useState(true);

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    if (scrollDirection === 'down' && isScrolled) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, [scrollDirection, isScrolled]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="scroll-progress-bar"
        style={{ scaleX: scrollProgress }}
      />

      {/* Main header */}
      <motion.header
        className={`main-header ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Container fluid className="header-inner">
          {/* Logo/Name */}
          <motion.a
            href="#intro"
            className="header-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src={logoImg} alt="Audruey" className="logo-image" />
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={item.href}
                target={item.external ? '_blank' : '_self'}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={`nav-link ${refs[index + 1] ? 'active' : ''}`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className={`nav-icon bi ${item.icon}`}></i>
                <span className="nav-label">{item.label}</span>
              </motion.a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <span className="menu-line"></span>
            <span className="menu-line"></span>
            <span className="menu-line"></span>
          </motion.button>
        </Container>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.nav
              className="mobile-nav"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="mobile-nav-header">
                <span className="mobile-nav-title">Menu</span>
                <motion.button
                  className="close-btn"
                  onClick={toggleMobileMenu}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close menu"
                >
                  <i className="bi bi-x-lg"></i>
                </motion.button>
              </div>

              <div className="mobile-nav-links">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    target={item.external ? '_blank' : '_self'}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="mobile-nav-link"
                    onClick={() => !item.external && toggleMobileMenu()}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="mobile-nav-icon">
                      <i className={`bi ${item.icon}`}></i>
                    </span>
                    <span className="mobile-nav-label">{item.label}</span>
                    <i className="bi bi-arrow-right"></i>
                  </motion.a>
                ))}
              </div>

              <div className="mobile-nav-footer">
                <p className="mobile-nav-cta">Let&apos;s work together</p>
                <a href="mailto:audrueygana.uiux@gmail.com" className="mobile-nav-email">
                  audrueygana.uiux@gmail.com
                </a>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CUSTOM_HEADER;
