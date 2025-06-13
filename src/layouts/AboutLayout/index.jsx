import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Image from 'react-bootstrap/Image';

import './style.scss';
import audruey from '@assets/svg/audy.svg'
import aboutheader from '@assets/images/aboutheader.png';
import desktop from '@assets/images/desktop.png';
import { Button, Container } from 'react-bootstrap';
import resume from '@assets/Audruey.pdf';

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
                        <TECHSTACK_COMPONENT list={['React Native', 'Javascript', 'Android', 'iOS', 'React.js', 'Vite', 'Git', 'Figma', 'Redux', 'REST API', 'HTML', 'CSS', 'SASS', 'Tailwind', 'AI Automation', 'AI Integration']} />
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
                        <p>I'm from Cavite, Philippines, where I live with my family. I earned my Bachelor’s degree in Information Technology from Cavite State University. Right after graduating, I got my dream job and have been coding ever since.</p>
                        <p>I’ve spent over seven years building mobile apps. But I didn’t stop there—I’ve also been exploring web development, AI, and UX design. I’m driven by curiosity and a love for learning. Programming can be stressful, but there’s nothing like the feeling of creating something that works.
                        </p>
                        <p>In every project, I focus on user experience. I believe a good digital product keeps users coming back. With how much influence social media has now, it’s important to create positive, useful, and engaging tools that leave a good impression.
                        </p>
                        <p>I see learning as a lifelong process. Tech keeps changing, and I enjoy keeping up with it. There’s always something new to explore or figure out, and I like understanding how things work under the hood.
                        </p>
                        <p>If you want to know more about what I do or think we can work on something together, feel free to reach out. Let’s build something great.
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
