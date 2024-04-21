import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

import './style.scss';
import audruey from '@assets/svg/audy.svg'
import aboutheader from '@assets/images/aboutheader.png';
import desktop from '@assets/images/desktop.png';
import { Button, Container } from 'react-bootstrap';
import resume from '@assets/audruey-resume-2024.pdf';

const showmd = 'd-block d-lg-none d-md-block d-sm-block d-xsm-block';

function AboutLayout () {

    const openResume = () => {
        window.open(resume,"_blank");
    }

    return(
        <Container className="about-layout d-flex justify-content-center align-items-center flex-column mt-5" fluid>
            <Row lg={10} className="mb-2">
                <Image src={aboutheader} className="img-fluid" />
            </Row>
            <Container>
                <Row lg={2} className="d-flex align-items-center justify-content-center">
                    <Col lg={3} className="mb-5 d-flex align-items-center flex-column">
                        <Image src={audruey} className="audruey-img mb-3" />
                        <TECHSTACK_COMPONENT list={['React Native', 'Javascript', 'Android', 'iOS', 'React.js', 'Vite', 'Git', 'Figma', 'Redux', 'REST API', 'HTML', 'CSS', 'SASS']} />
                        <div className="about-me-card p-4 flex-row mt-4">
                            <span className="mb-0 text-center">Connect with me: </span>
                            <div className="d-inline-flex flex-row">
                                <CONTACTME_COMPONENT
                                    link="mailto:audrueygana.uiux@gmail.com"
                                    icon="envelope-at-fill"
                                />
                                <CONTACTME_COMPONENT
                                    link="https://www.linkedin.com/in/audruey-gana-205a73303/"
                                    icon="linkedin"
                                />
                                <CONTACTME_COMPONENT
                                    link="https://github.com/odenlerma"
                                    icon="github"
                                />
                                <CONTACTME_COMPONENT
                                    link="https://m.me/audruey/"
                                    icon="messenger"
                                />
                            </div>
                            
                        </div>
                        <Button onClick={openResume} variant="secondary" className={`${showmd} w-100 mt-3`}>
                            <span className="text-light mb-0">View Resume</span>
                        </Button>
                    </Col>
                    <Col lg={6} className="about-me-card p-4">
                        <h4>Hello there! I am <b className="text-primary">Audruey Gana</b>.</h4>
                        <p>I am based in Cavite, Philippines, where I live with my family. I hold a Bachelor of Science in Information Technology from Cavite State University and have been passionately coding as a programmer ever since, landing my dream job right after graduation.
                        </p>
                        <p>For over six years, I have been immersed in the world of mobile app development, and I have not stopped there. I am also exploring the realms of web development, artificial intelligence, and UX design. My career is driven by a deep-seated curiosity and a zest for adventure; I am always on the hunt for the next skill to master. Programming holds a special place in my heart—though it brings its fair share of stress, the joy and satisfaction of bringing new creations to life are incomparable.
                        </p>
                        <p>In every project, whether developing an app or a website, my priority is the user experience. I believe that the success of a digital product is measured by its ability to retain users and compel them to return. In this era, where social media significantly impacts our society, it is crucial to engage users positively to foster excellent experiences and avoid negative feedback.
                        </p>
                        <p>I believe that learning is a lifelong journey, filled with endless opportunities to discover. The world of technology is vast and constantly evolving, and I am always eager to dive in and see what is new. Every day offers a chance to uncover something intriguing, and I am all about digging deep and understanding the mechanics behind each innovation.
                        </p>
                        <p>Curious to know more about my journey or discuss potential collaborations? Do not hesitate to reach out. Let us connect and make something amazing together!
                        </p>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}


// eslint-disable-next-line react/prop-types
function CONTACTME_COMPONENT({ link, icon }) {
    return(
        <a href={link} target="_blank">
            <i className={`custom-icon bi bi-${icon} fs-3 me-2`}></i>
        </a>
    )
}

// eslint-disable-next-line react/prop-types
function TECHSTACK_COMPONENT ({ list = [] }) {
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

export default AboutLayout;
