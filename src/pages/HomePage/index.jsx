import { useInView } from 'react-intersection-observer';

import './style.scss';
import IntroLayout from '@layouts/IntroLayout';
import * as COMPONENTS from '@components';
import WorksLayout from '@layouts/WorksLayout';
import AboutLayout from '@layouts/AboutLayout';

const observerOptions = {
  threshold: 0.5,
};

function HomePage() {
  const { ref: introRef, inView: isVisibleIntro } = useInView(observerOptions);
  const { ref: worksRef, inView: isVisibleWorks } = useInView(observerOptions);
  const { ref: aboutRef, inView: isVisibleAbout } = useInView(observerOptions);

  // Determine active section for bottom nav
  const getActiveSection = () => {
    if (isVisibleAbout) return 'about';
    if (isVisibleWorks) return 'works';
    return 'intro';
  };

  return (
    <div className="main-container">
      <section ref={introRef} className="section-snap full-height" id="intro">
        <IntroLayout />
      </section>

      <section ref={worksRef} className="section-snap" id="works">
        <WorksLayout />
      </section>

      <section ref={aboutRef} className="section-snap" id="about">
        <AboutLayout />
      </section>

      <COMPONENTS.CUSTOM_FOOTER />
    </div>
  );
}

export default HomePage;
