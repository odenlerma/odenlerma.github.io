import { motion } from 'framer-motion';
import './ProjectCard.scss';

/**
 * ProjectCard - Reusable project card with hover effects
 *
 * @param {object} project - Project data
 * @param {string} size - Card size: 'large', 'medium', 'small'
 * @param {number} index - Card index for stagger animation
 */
const ProjectCard = ({
  project,
  size = 'medium',
  index = 0
}) => {
  const {
    title,
    subtitle,
    year,
    techStack = [],
    image,
    url
  } = project;

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  const CardWrapper = url ? motion.a : motion.div;
  const wrapperProps = url
    ? { href: url, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <CardWrapper
      className={`project-card project-card--${size}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8 }}
      {...wrapperProps}
    >
      {/* Image container */}
      {image && (
        <div className="project-card__image-wrapper">
          <motion.img
            src={image}
            alt={title}
            className="project-card__image"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          <div className="project-card__image-overlay" />
        </div>
      )}

      {/* Content */}
      <div className="project-card__content">
        {/* Year badge */}
        <span className="project-card__year">{year}</span>

        {/* Title */}
        <h4 className="project-card__title">{title}</h4>

        {/* Subtitle */}
        <p className="project-card__subtitle">{subtitle}</p>

        {/* Tech stack */}
        {techStack.length > 0 && (
          <div className="project-card__tech">
            {techStack.slice(0, size === 'small' ? 3 : 5).map((tech, idx) => (
              <span key={idx} className="tech-tag">
                {tech}
              </span>
            ))}
            {techStack.length > (size === 'small' ? 3 : 5) && (
              <span className="tech-tag tech-tag--more">
                +{techStack.length - (size === 'small' ? 3 : 5)}
              </span>
            )}
          </div>
        )}

        {/* Link indicator */}
        {url && (
          <div className="project-card__link">
            <span>View Project</span>
            <i className="bi bi-arrow-up-right"></i>
          </div>
        )}
      </div>
    </CardWrapper>
  );
};

/**
 * ProjectCardSkeleton - Loading skeleton for project cards
 */
export const ProjectCardSkeleton = ({ size = 'medium' }) => {
  return (
    <div className={`project-card project-card--${size} project-card--skeleton`}>
      <div className="project-card__image-wrapper skeleton-shimmer" />
      <div className="project-card__content">
        <div className="skeleton-line skeleton-line--sm" />
        <div className="skeleton-line skeleton-line--lg" />
        <div className="skeleton-line skeleton-line--md" />
        <div className="skeleton-tags">
          <div className="skeleton-tag" />
          <div className="skeleton-tag" />
          <div className="skeleton-tag" />
        </div>
      </div>
    </div>
  );
};

/**
 * YearMarker - Year divider for project timeline
 */
export const YearMarker = ({ year, isActive = false }) => {
  return (
    <motion.div
      className={`year-marker ${isActive ? 'year-marker--active' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <span className="year-marker__text">{year}</span>
      <div className="year-marker__line" />
    </motion.div>
  );
};

export default ProjectCard;
