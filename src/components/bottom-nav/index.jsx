import { motion } from 'framer-motion';
import './style.scss';
import resume from '@assets/Audruey Gana - CV.pdf';

const navItems = [
  { id: 'intro', label: 'Home', href: '#intro', icon: 'bi-house-heart-fill', color: '#FF6B9D' },
  { id: 'works', label: 'Works', href: '#works', icon: 'bi-grid-3x3-gap-fill', color: '#9B6BFF' },
  { id: 'about', label: 'About', href: '#about', icon: 'bi-person-heart', color: '#6BCFFF' },
  { id: 'resume', label: 'Resume', href: resume, external: true, icon: 'bi-file-earmark-arrow-down-fill', color: '#FFB86B' }
];

// eslint-disable-next-line react/prop-types
export const BOTTOM_NAV = ({ activeSection = 'intro' }) => {
  return (
    <motion.nav
      className="bottom-nav"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', damping: 20, stiffness: 200 }}
    >
      <div className="bottom-nav-pill">
        {navItems.map((item) => {
          const isActive = !item.external && activeSection === item.id;

          return (
            <motion.a
              key={item.id}
              href={item.href}
              target={item.external ? '_blank' : '_self'}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{ '--item-color': item.color }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="nav-item-icon"
                animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <i className={`bi ${item.icon}`}></i>
              </motion.div>
              <span className="nav-item-label">{item.label}</span>
              {isActive && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeIndicator"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
            </motion.a>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BOTTOM_NAV;
