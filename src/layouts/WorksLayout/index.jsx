import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Container from 'react-bootstrap/Container';

import './style.scss';
import MasonryCard, { sortProjectsForMasonry } from '@components/common/MasonryCard';
import AnimatedText, { FadeInView } from '@components/common/AnimatedText';

// Project screenshots
import momentapp from '@assets/project-ss/moment-app.png';
import etaren from '@assets/project-ss/etaren.png';
import codereviewer from '@assets/project-ss/codereviewer.png';
import techassess from '@assets/project-ss/techassess.png';
import inventoryapp from '@assets/project-ss/inventory-app-1.jpg';

// Project data
const projects = [
  {
    id: 17,
    title: 'Automated Technical Assessment',
    subtitle: 'Automates confluence document creation for developer and QA assessment based on Jira Ticket information',
    year: '2025',
    techStack: ['n8n', 'OpenAI API', 'Jira API', 'Confluence API'],
    image: techassess,
    featured: true
  },
  {
    id: 16,
    title: 'Automated Code Reviewer',
    subtitle: 'AI-powered code review automation that won honorable mention at company hackathon. Streamlines PR reviews for faster ticket transitions.',
    year: '2025',
    techStack: ['n8n', 'OpenAI API', 'Jira API', 'Bitbucket API', 'AI Agent'],
    image: codereviewer,
    featured: true
  },
  {
    id: 15,
    title: 'LegalMatch App for Attorneys',
    subtitle: 'Maintenance and feature development for React Native app with legacy infrastructure and depreciated module fixing.',
    year: '2024-Current',
    techStack: ['React Native', 'Styled-components', 'Redux-Saga', 'Ramda', 'Redux', 'REST API'],
    url: 'https://play.google.com/store/apps/details?id=com.legalmatchattorney&hl=en'
  },
  {
    id: 14,
    title: 'TODO App',
    subtitle: 'A todo application built with React Native framework featuring modern state management.',
    year: '2024',
    techStack: ['React Native', 'MMKV', 'redux-saga', 'redux-toolkit', 'javascript'],
    url: 'https://github.com/odenlerma/todo-app'
  },
  {
    id: 13,
    title: 'Etaren: AI Image Generator',
    subtitle: 'Planned, designed, and built an AI image generation website with Text to Image, ControlNet, InPainting and more.',
    year: '2024',
    techStack: ['React', 'Vite', 'Figma', 'AI', 'Redux', 'REST API', 'SASS', 'Bootstrap'],
    image: etaren,
    url: 'https://etaren.xyz/',
    featured: true
  },
  {
    id: 12,
    title: 'InventoryApp',
    subtitle: 'Personal project for small business inventory tracking with automatic watermarking feature.',
    year: '2023',
    techStack: ['React Native', 'Android', 'Camera', 'Watermark', 'Redux', 'REST API'],
    image: inventoryapp
  },
  {
    id: 11,
    title: 'E-Wallet Platform',
    subtitle: 'Mobile e-wallet for monetary transactions including deposit, withdraw, send and receive funds with multiple sign-in options.',
    year: '2022-2024',
    techStack: ['React Native', 'Android', 'REST API', 'Redux', 'Codepush', 'QRcode', 'Social Sign-ins', 'Push Notifications', 'Whitelabel']
  },
  {
    id: 10,
    title: 'E-commerce Delivery App',
    subtitle: 'Android app for delivery riders to track parcels and manage deliveries with QR/Barcode scanning.',
    year: '2022',
    techStack: ['React Native', 'Android', 'REST API', 'Redux', 'Codepush', 'QRcode/Barcode']
  },
  {
    id: 9,
    title: 'MLM Multi-Country Platform',
    subtitle: 'Whitelabel MLM app built for multiple countries with language adaptation, reports, payments, KYC, and network tree.',
    year: '2021',
    techStack: ['React Native', 'iOS', 'Android', 'REST API', 'Redux', 'Codepush', 'Whitelabel', 'Multi-Language']
  },
  {
    id: 8,
    title: 'Video Streaming Platform',
    subtitle: 'A streaming platform combining Medium, YouTube, and Twitch features. Users can stream, go live, or read articles.',
    year: '2021',
    techStack: ['React Native', 'iOS', 'Android', 'REST API', 'SocketIO', 'Social Sign-ins', 'Redux', 'Video-Stream', 'Camera']
  },
  {
    id: 7,
    title: 'Trivia Gaming App',
    subtitle: 'A trivia game where users predict sports match outcomes and events, rewarded for correct predictions.',
    year: '2020',
    techStack: ['React Native', 'iOS', 'Android', 'REST API', 'Websocket', 'Push Notification']
  },
  {
    id: 6,
    title: 'MomentApp',
    subtitle: 'Universal clock app displaying time and date by timezone with conversion features.',
    year: '2019',
    techStack: ['React Native', 'iOS', 'Android', 'moment.js', 'moment-timezone', 'Github'],
    image: momentapp,
    url: 'https://github.com/odenlerma/MomentApp'
  },
  {
    id: 5,
    title: 'MLM Project #3',
    subtitle: 'Another multilevel marketing platform with reports, payments, KYC, network tree and profile settings.',
    year: '2019',
    techStack: ['React Native', 'iOS', 'Android', 'REST API', 'Push Notification']
  },
  {
    id: 4,
    title: 'MLM Project #2',
    subtitle: 'Multilevel marketing company app featuring reports, KYC, payments, network tree and profile settings.',
    year: '2018',
    techStack: ['React Native', 'iOS', 'Android', 'REST API', 'Push Notification']
  },
  {
    id: 3,
    title: 'Self-Improvement App',
    subtitle: 'Social and self-improvement platform with activity tracking, daily tasks, categories, analytics, reminders, and maps.',
    year: '2018',
    techStack: ['React Native', 'iOS', 'Android', 'REST API', 'Google Maps', 'Calendar', 'Push Notification']
  },
  {
    id: 2,
    title: 'Kanji App',
    subtitle: 'A hobby project quiz app for JLPT exam preparation, helping users learn and practice Japanese kanji characters.',
    year: '2024',
    techStack: ['React Native', 'AsyncStorage', 'iOS', 'Android']
  }
];

function WorksLayout() {
  // Sort projects for optimal masonry flow
  const sortedProjects = useMemo(() => sortProjectsForMasonry(projects), []);

  return (
    <div className="works-layout">
      <Container className="works-container">
        {/* Section Header */}
        <div className="works-header">
          <FadeInView delay={0.1}>
            <span className="section-label font-mono">Selected Works</span>
          </FadeInView>
          <AnimatedText
            text="Projects & Experience"
            as="h2"
            className="section-title"
            delay={0.2}
            staggerDelay={0.03}
          />
          <FadeInView delay={0.4}>
            <p className="section-subtitle">
              A collection of projects spanning mobile apps, web platforms, and AI automation.
              7+ years of building digital experiences.
            </p>
          </FadeInView>
        </div>

        {/* Masonry Grid */}
        <div className="masonry-section">
          <FadeInView delay={0.2}>
            <h3 className="subsection-title">All Projects</h3>
          </FadeInView>

          <div className="masonry-grid">
            {sortedProjects.map((project, index) => (
              <MasonryCard
                key={project.id}
                project={project}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <motion.div
          className="stats-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="stat-item">
            <span className="stat-number">7+</span>
            <span className="stat-label">Years Experience</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">15+</span>
            <span className="stat-label">Projects Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">3</span>
            <span className="stat-label">Platforms</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1</span>
            <span className="stat-label">Hackathon Win</span>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

export default WorksLayout;
