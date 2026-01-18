import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './MasonryCard.scss';

/**
 * Determines card size based on project content richness
 */
const getCardSize = (project) => {
  const { featured, image, techStack = [] } = project;

  if (featured && image) return 'featured';
  if (image && techStack.length >= 5) return 'large';
  if (image) return 'medium';
  if (techStack.length > 0) return 'small';
  return 'compact';
};

/**
 * MasonryCard - Pinterest-style card with rich animations
 *
 * @param {object} project - Project data
 * @param {number} index - Card index for stagger animation
 */
const MasonryCard = ({ project, index = 0 }) => {
  const prefersReducedMotion = useReducedMotion();

  const {
    title,
    subtitle,
    year,
    techStack = [],
    image,
    url,
    featured
  } = project;

  const size = useMemo(() => getCardSize(project), [project]);

  // Animation variants with spring physics
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 60,
      scale: prefersReducedMotion ? 1 : 0.95,
      rotateX: prefersReducedMotion ? 0 : 10
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: prefersReducedMotion ? 0 : index * 0.06,
        mass: 0.8
      }
    }
  };

  // Hover animation (subtle 3D effect)
  const hoverAnimation = prefersReducedMotion
    ? {}
    : {
        y: -12,
        scale: 1.02,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20
        }
      };

  // Image parallax/zoom animation
  const imageVariants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.08,
      transition: {
        duration: 0.5,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  const CardWrapper = url ? motion.a : motion.div;
  const wrapperProps = url
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  const cardClasses = [
    'masonry-card',
    `masonry-card--${size}`,
    featured && 'masonry-card--featured'
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <CardWrapper
      className={cardClasses}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      whileHover={hoverAnimation}
      {...wrapperProps}
    >
      {/* Image container with parallax */}
      {image && (
        <motion.div
          className="masonry-card__image-wrapper"
          initial="rest"
          whileHover="hover"
        >
          <motion.img
            src={image}
            alt={title}
            className="masonry-card__image"
            variants={imageVariants}
            loading="lazy"
          />
          <div className="masonry-card__image-overlay" />
        </motion.div>
      )}

      {/* Content */}
      <div className="masonry-card__content">
        {/* Header with year */}
        <div className="masonry-card__header">
          <span className="masonry-card__year">{year}</span>
        </div>

        {/* Title */}
        <h4 className="masonry-card__title">{title}</h4>

        {/* Subtitle */}
        <p className="masonry-card__subtitle">{subtitle}</p>

        {/* Tech stack with staggered animation on hover */}
        {techStack.length > 0 && (
          <div className="masonry-card__tech">
            {techStack.map((tech, idx) => (
              <span
                key={idx}
                className="masonry-card__tech-tag"
                style={{
                  transitionDelay: `${idx * 0.02}s`
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Link indicator */}
        {url && (
          <div className="masonry-card__link">
            <span>View Project</span>
            <i className="bi bi-arrow-up-right"></i>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

/**
 * Sort projects for optimal masonry flow
 * 1. Featured projects first
 * 2. Then by year (descending)
 * 3. Then by having an image
 */
export const sortProjectsForMasonry = (projects) => {
  return [...projects].sort((a, b) => {
    // Featured first
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;

    // Then by year (newest first)
    const yearA = parseInt(a.year.split('-')[0]);
    const yearB = parseInt(b.year.split('-')[0]);
    if (yearA !== yearB) return yearB - yearA;

    // Then by having an image
    if (a.image && !b.image) return -1;
    if (!a.image && b.image) return 1;

    return 0;
  });
};

export default MasonryCard;
