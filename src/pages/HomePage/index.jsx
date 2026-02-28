import { useInView } from 'react-intersection-observer';

import './style.scss';
import IntroLayout from '@layouts/IntroLayout';
import * as COMPONENTS from '@components';
import WorksLayout from '@layouts/WorksLayout';
import AboutLayout from '@layouts/AboutLayout';
import AskAiLayout from '@layouts/AskAiLayout';

const observerOptions = {
  threshold: 0.5,
};

function HomePage() {
  const { ref: introRef } = useInView(observerOptions);
  const { ref: worksRef, inView: isVisibleWorks } = useInView(observerOptions);
  const { ref: aboutRef, inView: isVisibleAbout } = useInView(observerOptions);
  const { ref: askAiRef, inView: isVisibleAskAi } = useInView(observerOptions);

  // Determine active section for bottom nav
  // eslint-disable-next-line no-unused-vars
  const getActiveSection = () => {
    if (isVisibleAskAi) return 'ask-ai';
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

      <section ref={askAiRef} className="section-snap ask-ai-section" id="ask-ai">
        <AskAiLayout />
      </section>

      <COMPONENTS.CUSTOM_FOOTER />
    </div>
  );
}

export default HomePage;
