import { useState, useEffect, useCallback } from 'react';

/**
 * useScrollProgress - Hook to track scroll progress
 *
 * @returns {object} - { scrollY, scrollProgress, isScrolled, scrollDirection }
 */
export const useScrollProgress = () => {
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = documentHeight - windowHeight;

    // Calculate scroll progress (0-1)
    const progress = maxScroll > 0 ? currentScrollY / maxScroll : 0;

    // Determine scroll direction
    const direction = currentScrollY > lastScrollY ? 'down' : 'up';

    setScrollY(currentScrollY);
    setScrollProgress(Math.min(Math.max(progress, 0), 1));
    setIsScrolled(currentScrollY > 50);
    setScrollDirection(direction);
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    // Initial call
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return { scrollY, scrollProgress, isScrolled, scrollDirection };
};

/**
 * useScrollToSection - Hook to handle smooth scrolling to sections
 */
export const useScrollToSection = () => {
  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return { scrollToSection, scrollToTop };
};

/**
 * useParallax - Hook for parallax scroll effects
 *
 * @param {number} speed - Parallax speed multiplier (default: 0.5)
 * @returns {number} - Y offset value for transform
 */
export const useParallax = (speed = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return offset;
};

/**
 * useElementInView - Track if an element is in viewport
 *
 * @param {React.RefObject} ref - Reference to the element
 * @param {object} options - Intersection observer options
 * @returns {boolean} - Whether element is in view
 */
export const useElementInView = (ref, options = {}) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options
    });

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isInView;
};

export default useScrollProgress;
