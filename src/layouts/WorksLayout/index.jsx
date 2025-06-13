import { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';
import { Chrono } from "react-chrono";

import './style.scss';
import { Container } from 'react-bootstrap';
import momentapp from '@assets/project-ss/moment-app.png';
import etaren from '@assets/project-ss/etaren.png';
import codereviewer from '@assets/project-ss/codereviewer.png';
import techassess from '@assets/project-ss/techassess.png';
import inventoryapp from '@assets/project-ss/inventory-app-1.jpg';
import workimg from '@assets/images/worksheader.png';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Mousewheel, Pagination } from 'swiper/modules';

const work_list = [
    {
        title: '2018',
        cardTitle: 'Hired!',
        cardSubtitle:"Landed first job as Mobile App Developer using React Native",
    },
    {
        title: '2018',
        cardTitle: 'Project #1',
        cardSubtitle:"I have been part of a team working on a project focused on social and self-improvement. Users can track activities, complete daily tasks, categorize tasks, view analytics, add reminders, and view a map showing where tasks have been completed.",
        timelineContent: <TIMELINE_COMPONENT list={['React Native', 'iOS', 'Android', 'REST API', 'Google Maps', 'Calendar', 'Push Notification']} />,
    },
    {
        title: '2018',
        cardTitle: 'Project #2',
        cardSubtitle:"I have been part of a team working on a project for a multilevel marketing company. App is composed of reports, KYC, payments, network tree and profile settings",
        timelineContent: <TIMELINE_COMPONENT list={['React Native', 'iOS', 'Android', 'REST API', 'Push Notification']} />,
    },
    {
        title: '2019',
        cardTitle: 'Project #3',
        cardSubtitle:"I have been part of another project for a multilevel marketing company. App is composed of reports, payments, KYC, network tree and profile settings",
        timelineContent: <TIMELINE_COMPONENT list={['React Native', 'iOS', 'Android', 'REST API', 'Push Notification']} />,
    },
    {
        title: '2019',
        cardTitle: 'Personal Project: MomentApp',
        url: 'https://github.com/odenlerma/MomentApp',
        cardSubtitle:"A universal clock app that displays the time and date by timezone, and also converts between timezones.",
        timelineContent: <TIMELINE_COMPONENT list={['React Native', 'iOS', 'Android', 'moment.js', 'moment-timezone', 'Github']} />,
        media: {
            name: "MomentApp",
            source: {
              url: momentapp
            },
            type: "IMAGE"
        }
    },
    {
        title: '2020',
        cardTitle: 'Project #4',
        cardSubtitle:"I have been part of a trivia game project where users predict the outcomes of sports matches, events, etc. Users are rewarded based on their correct answers.",
        timelineContent: <TIMELINE_COMPONENT list={['React Native', 'iOS', 'Android', 'REST API', 'Websocket', 'Push Notification']} />,
    },
    {
        title: '2021',
        cardTitle: 'Project #5',
        cardSubtitle:"I have been part of a streaming video platform project that combines elements of Medium, YouTube, and Twitch. Users can stream videos, go live, or read articles within the app.",
        timelineContent: <TIMELINE_COMPONENT list={['React Native', 'iOS', 'Android', 'REST API', 'SocketIO', 'Google Sign-in', 'Facebook Sign-in', 'Redux', 'Codepush', 'Video-Stream', 'Camera', 'Push Notification']} />,
    },
    {
        title: '2021',
        cardTitle: 'Project #6',
        cardSubtitle:"I have been part of another project for a multilevel marketing company and build apps per country and adapt its language. App is composed of reports, payments, KYC, network tree and profile settings",
        timelineContent: <TIMELINE_COMPONENT list={['React Native', 'iOS', 'Android', 'REST API', 'Redux', 'Codepush', 'Whitelabel', 'Multi-Language']} />,
    },
    {
        title: '2022',
        cardTitle: 'Project #7',
        cardSubtitle:"I have been part of e-commerce project. Android App was made for delivery riders to track parcels and delivery",
        timelineContent: <TIMELINE_COMPONENT list={['React Native', 'Android', 'REST API', 'Redux', 'Codepush', 'QRcode/Barcode Scan']} />,
    },
    {
        title: '2022-2024',
        cardTitle: 'Project #8',
        cardSubtitle:"I have been part of e-wallet project. Users do monetary transactions such as deposit, withdraw, send and receive funds.",
        timelineContent: <TIMELINE_COMPONENT list={['React Native', 'Android', 'REST API', 'Redux', 'Codepush', 'QRcode', 'Google Sign-in', 'Facebook Sign-in', 'Twitter Sign-in', 'Apple Sign-in', 'Push Notifications', 'Whitelabel']} />,
    },
    {
        title: '2023',
        cardTitle: 'Personal Project: InventoryApp',
        cardSubtitle:"Created an app for our small online business to keep track of inventory. It also have a feature that automatically put shop logo and other watermarks",
        timelineContent: <TIMELINE_COMPONENT list={['React Native',  'Android', 'Camera', 'Watermark', 'Redux', 'REST API']} />,
        media: {
            name: "InventoryApp",
            source: {
              url: inventoryapp
            },
            type: "IMAGE"
        }
    },
    {
        title: '2024',
        cardTitle: 'Personal Project: Etaren: AI Image Generator (Ongoing)',
        cardSubtitle:"Planned, designed, created a website for AI image generation called Project Etaren. It is planned to have AI tools like Text to Image, Transform, ControlNet, InPainting and Faceswap. Website is planned to have free and premium version using credit system.",
        timelineContent: <TIMELINE_COMPONENT list={['React', 'Vite', 'Figma', 'AI', 'Redux', 'REST API', 'SASS', 'CSS', 'Bootstrap', 'React-bootstrap']} />,
        url: 'https://etaren.xyz/',
        media: {
            name: "Etaren",
            source: {
              url: etaren
            },
            type: "IMAGE"
        }
    },
    {
        title: '2024',
        cardTitle: 'TODO App',
        cardSubtitle: "Design and create a todo app using react native framework",
        timelineContent: <TIMELINE_COMPONENT list={['React Native', 'MMKV', 'redux-saga', 'redux-toolkit', 'javascript']} />,
        url: 'https://github.com/odenlerma/todo-app',
    },
    {
        title: '2024-Current',
        cardTitle: 'LegalMatch App for Attorneys',
        cardSubtitle: "Handles Maintenance of a old infrastructure of react native app, depreciated module fixing, adding features",
        timelineContent: <TIMELINE_COMPONENT list={['React Native', 'Styled-components', 'Redux-Saga', 'Ramda', 'Redux', 'REST API']} />,
        url: 'https://play.google.com/store/apps/details?id=com.legalmatchattorney&hl=en'
    },
    {
        title: '2025',
        cardTitle: 'Automated Code Reviewer for Developers of LegalMatch',
        cardSubtitle: "This was our entry for our company AI Agent Hackathon that won honorable mention for our Engineering Department that aims to automate code review of pull requests for faster transistion of tickets",
        timelineContent: <TIMELINE_COMPONENT list={['n8n', 'OpenAI API', 'Jira API', 'Bitbucket API', 'AI Agent']} />,
        media: {
            name: "Automated Code Reviewer",
            source: {
              url: codereviewer
            },
            type: "IMAGE"
        }
    },
    {
        title: '2025',
        cardTitle: 'Automated Technical Assessment for Developers',
        cardSubtitle: "This aims to automate creation of confluence document for both developer and QA assessment based on Jira Ticket information",
        timelineContent: <TIMELINE_COMPONENT list={['n8n', 'OpenAI API', 'Jira API', 'Confluence API']} />,
        media: {
            name: "Automated Technical Assessment for Developers",
            source: {
              url: techassess
            },
            type: "IMAGE"
        }
    },
]

// eslint-disable-next-line react/prop-types
function TIMELINE_COMPONENT ({ list = [] }) {
    return(
        <div className="timeline-container">
            {list.map((item) => (
                <div key={item} className="px-2 py-1 bg-primary me-2 mb-1 text-light">
                    {item}
                </div>
            ))}
        </div>
    )
}


function WorksLayout () {
    // const [activeIndex, setActiveIndex] = useState(0);

    // useEffect(() => {
    //     const onScroll = () => {
    //         // Calculate the active index based on scroll position
    //         // This is a placeholder: you need a real calculation here
    //         const newIndex = Math.floor(window.scrollY / 300);
    //         console.log(newIndex, activeIndex)
    //         if (newIndex !== activeIndex) {
    //             setActiveIndex(newIndex);
    //         }
    //     };

    //     window.addEventListener("scroll", onScroll);
    //     return () => window.removeEventListener("scroll", onScroll);
    // }, [activeIndex]);

    return(
        <Container className="works-layout d-flex align-items-center mt-5 flex-column" fluid>
            <Row lg={10}>
                <Image src={workimg} className="img-fluid" />
            </Row>
            <Col lg={8} >
                <Chrono
                    scrollable
                    lineWidth={2}
                    mediaSettings={{ align: 'right', fit: 'contain' }}
                    //activeItemIndex={activeIndex}
                    cardHeight={250}
                    fontSizes={{ 
                        title: '2.074rem',
                        cardSubtitle: '0.85rem',
                        cardText: '1.44rem',
                        cardTitle: '1.44rem'
                    }}
                    classNames={{
                        card: 'works-card',
                    }}
                    theme={{
                        primary: '#4C66FF',
                        secondary: '#FC5130',
                        titleColorActive: "#FFF5E3",
                        toolbarBgColor: "#FFF5E3",
                        toolbarBtnBgColor: "#FFF5E3",
                        toolbarTextColor: "#FC5130"
                    }}
                    items={work_list}
                    mode="VERTICAL_ALTERNATING" 
                    //mode="HORIZONTAL"
                    buttonTexts={{
                        changeDensity: '',
                        changeLayout: '',
                        jumpTo: 'See Works',
                    }}
                    //focusActiveItemOnLoad
                    disableToolbar
                />
            </Col>
        </Container>
    )
}

// function WorksLayout () {
//     // const [activeIndex, setActiveIndex] = useState(5);

//     // useEffect(() => {
//     //     const onScroll = () => {
//     //         // Calculate the active index based on scroll position
//     //         // This is a placeholder: you need a real calculation here
//     //         const newIndex = Math.floor(window.scrollY / 300);
//     //         console.log(newIndex)
//     //         if (newIndex !== activeIndex) {
//     //             console.log(newIndex, 'change here')
//     //             setActiveIndex(newIndex);
//     //         }
//     //     };

//     //     window.addEventListener("scroll", onScroll);
//     //     return () => window.removeEventListener("scroll", onScroll);
//     // }, [activeIndex]);

//     return(
//         <Container className="works-layout d-flex align-items-center pt-5 flex-column" fluid>
//             <Row lg={10}>
//                 <Image src={workimg} className="img-fluid" />
//             </Row>
//             <Col lg={8} >
//                 <Swiper
//                     slidesPerView={3}
//                     spaceBetween={30}
//                     pagination={{
//                     clickable: true,
//                     }}
//                     modules={[Pagination]}
//                     className="swiper-container"
//                 >
//                     <SwiperSlide className='swiper-slider-container'>
                    
//                     </SwiperSlide>
//                 </Swiper>
//             </Col>
//         </Container>
//     )
// }



export default WorksLayout;
