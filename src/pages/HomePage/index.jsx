import React, { useCallback, useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { useInView } from 'react-intersection-observer';

import './style.scss';
import IntroLayout from '@layouts/IntroLayout';
import * as COMPONENTS from '@components';
import WorksLayout from '@layouts/WorksLayout';
import AboutLayout from '@layouts/AboutLayout';

const observerOptions = {
    threshold: 0,
};

function HomePage () {
    const { ref: introRef, inView: isVisibleIntro} = useInView(observerOptions);
    const { ref: worksRef, inView: isVisibleWorks} = useInView(observerOptions);
    const { ref: aboutRef, inView: isVisibleAbout} = useInView(observerOptions);

    return(
        <div className="main-container">
            {!isVisibleIntro ? <COMPONENTS.CUSTOM_HEADER refs={[isVisibleIntro, isVisibleWorks, isVisibleAbout]} /> : <div /> }
            <section ref={introRef} className="section-snap full-height" id="intro"><IntroLayout /></section>
            <section ref={worksRef} className="section-snap" id="works"><WorksLayout /></section>
            <section ref={aboutRef} className="section-snap" id="about"><AboutLayout /></section>
        </div>
    )
}

export default HomePage;
