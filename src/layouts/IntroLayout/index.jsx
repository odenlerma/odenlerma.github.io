import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import './style.scss';
import intrologo from '@assets/svg/audrueyintro.svg';
import { Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';

function IntroLayout () {
    // useEffect(() => {
    //     const onScroll = () => {
    //         console.log(window.scrollY)
    //     }
    //     document.body.style.overflow = "hidden";

    //     window.addEventListener("scroll", onScroll);
    //     return () => {
    //         document.body.style.overflow = "scroll"
    //         window.removeEventListener("scroll", onScroll);
    //     };
    // }, []);

    // useEffect(() => {
    //     document.body.style.overflow = 'hidden';
    // }, [])

    // const [isScrollEnabled, setIsScrollEnabled] = useState(false);

    // const toggleScroll = () => {
    //     setIsScrollEnabled(!isScrollEnabled);
    //     document.body.style.overflow = isScrollEnabled ? 'hidden' : 'auto';
    // };

    return(
        <Container className="intro-layout d-flex justify-content-center align-items-center" fluid>
            <Col lg={4}>
                <Image className="intro-logo mb-4" src={intrologo} />
                <h3 className="text-center fade-in-top">A Mobile Application Developer</h3>
                <h3 className="text-center fade-in-top">A Front-end Website Developer</h3>
                <h3 className="text-center fade-in-top">An Aspiring UX Designer</h3>
                <div className="d-flex flex-column align-items-center justify-content-center fade-in-top mt-5">
                    <span className="text-primary bounce">Keep Scrolling</span>
                    <i className="bi bi-chevron-double-down align-self-center bounce text-primary fs-3" />
                </div> 
                {/* <div className="d-flex flex-column align-items-center justify-content-center fade-in-top mt-5">
                    <Button onClick={toggleScroll} variant="primary" className="bounce">
                        <h3 className="text-light">Read More</h3>
                    </Button>
                </div> */}
            </Col>
        </Container>
    )
}

export default IntroLayout;
