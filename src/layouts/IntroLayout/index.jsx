import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import './style.scss';
import intrologo from '@assets/svg/audrueyintro.svg';
import { Container } from 'react-bootstrap';
import { useEffect, useState, useRef } from 'react';

import { useInView } from 'react-intersection-observer';

const list = [
    {
        id: 1,
        text: 'A Mobile Application Developer',
    },
    {
        id: 2,
        text: 'A Front-end Website Developer',
    },
    {
        id: 3,
        text: 'An Aspiring UX Designer',
    }
];

function IntroLayout () {
    


    return(
            <Container className="intro-layout d-flex justify-content-center align-items-center" fluid>
                <Col lg={4} >
                    <Image className="intro-logo mb-4" src={intrologo} />
                    {list.map((item) => {
                        return(
                            <DESCRIPTION_COMPONENT ref={item.ref} key={item.id+''} item={item} />
                        )
                    })}
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

// eslint-disable-next-line react/prop-types
const DESCRIPTION_COMPONENT = ({ item = '' }) => {
    return(
        <h3 className={`text-center fade-in-top`}>{item?.text || ''}</h3>
    )
}

export default IntroLayout;
