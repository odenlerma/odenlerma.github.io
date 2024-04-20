import React, { useCallback, useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';


import './style.scss';
import logo from '@assets/images/icon.png';
import audruey from '@assets/images/audruey.png';

// eslint-disable-next-line react/prop-types
const showlg = 'd-none d-md-block';
const showmd = 'd-block d-lg-none d-md-block d-sm-block d-xsm-block';

// eslint-disable-next-line react/prop-types
export const CUSTOM_HEADER = ({ refs = [] }) => {
    const [scrolled, setScrolled] = useState(false);

    // useEffect(() => {
    //     const observerOptions = {
    //       root: null,
    //       rootMargin: '0px',
    //       threshold: 1,
    //     };
    
    //     const observer = new IntersectionObserver(entries => {
    //       entries.forEach(entry => {
    //           console.log(entry.target.id, 'id')
    //           if(entry.isIntersecting){
    //               if (entry.target.id === 'intro'){
    //                 setActiveId('intro')
    //               }else if (entry.target.id === 'works'){
    //                 setActiveId('works')
    //               } else if (entry.target.id === 'about'){
    //                 setActiveId('about')
    //               }
    //             }
    //         })
    //     }, observerOptions)
        
    //     refs?.forEach(section => {
    //         section.current && observer.observe(section.current)
    //     })
    //   }, [])

    // useEffect(() => {
    //     const handleScroll = () => {
    //         const sections = document.querySelectorAll('section');
    //         let currentSection = '';

    //         sections.forEach(section => {
    //             const sectionTop = section.getBoundingClientRect().top;
    //             if (sectionTop <= 50) {
    //                 currentSection = section.id;
    //             }

    //             if(section.id == 'works' && currentSection != "Intro"){
    //                 const sectionBottom = section.getBoundingClientRect().bottom;
    //                 if (sectionBottom >= 1) {
    //                     currentSection = section.id;
    //                     setActiveId(currentSection);
    //                     return;
    //                 }
    //             }
    //         });

    //         if(currentSection !== ''){
    //             setActiveId(currentSection);
    //         }
    //     };

    //     window.addEventListener('scroll', handleScroll);
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    return(
        <>
            <Container className={`header-container py-3 px-5 d-flex justify-content-between align-items-center scrolled fade-in-top ${showlg}`} fluid>
                <Row lg={2} className="w-100 d-flex align-items-center justify-content-center">
                    <Col>
                        {/* <div className="header-logo-wrapper">
                            <div className="header-logo-base"><Image src={logo} className="logoimg"/></div>
                            <div className="header-logo-hover"><Image src={audruey} className="logoimg"/></div>
                        </div> */}
                    </Col>
                    <div className={showlg}>
                        <Row lg={6} md={6} sm={6} className={`d-flex align-items-center justify-content-end`}>
                            <NAVIGATION_COMPONENT
                                link="#works"
                                label="Works"
                                active={refs[1]}
                            />
                            <NAVIGATION_COMPONENT
                                link="#about"
                                label="About"
                                active={refs[2]}
                            />
                            <NAVIGATION_COMPONENT
                                link="#resume"
                                label="Resume"
                                //active={refs[2]}
                            />
                        </Row>
                    </div>
                </Row>
            </Container>
            <div className={`${showmd}`}>

            </div>
        </>
    )
}


// eslint-disable-next-line react/prop-types
function NAVIGATION_COMPONENT({link, label = '', active}) {
    
    return(
        <a href={link} className={`nav-item ${active === true ? 'active-nav' : ''} ms-4 fs-2 py-1`}>
            {label}
        </a>
    )
}