"use client"
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

// Define types for the project data
interface Director {
  name: string;
  program: string;
  year: string;
  email: string;
  picture: string;
}

interface Project {
  title: string;
  description: string;
  director: Director;
  detailedDescription: string;
}

interface ProjectCategory {
  [key: string]: Project[];
}

// Sample data
const projects: ProjectCategory = {
  Cybersecurity: [
    {
      title: 'MicroGuard',
      description: 'A cutting-edge cybersecurity project harnessing microcontrollers to create a formidable trio of tools: a password brute-force powerhouse, a WiFi password grabber, and a microcontroller-based ransomware tool.',
      director: {
        name: 'Adam Seaton',
        program: 'Cybersecurity',
        year: '2024',
        email: 'adam.seaton@example.com',
        picture: 'https://via.placeholder.com/150'
      },
      detailedDescription: 'MicroGuard is designed to enhance cybersecurity capabilities with three innovative tools. The password brute-force powerhouse efficiently cracks passwords, the WiFi password grabber enables secure network access, and the ransomware tool encrypts data to ensure secure information handling. This project aims to provide a comprehensive suite of tools for cybersecurity professionals.'
    },
    {
      title: 'Web App VIP (Vulnerability Identification Platform)',
      description: 'A holistic and cost-effective solution for analyzing small web applications to identify potential vulnerabilities.',
      director: {
        name: 'Dileep Dhami',
        program: 'Cybersecurity',
        year: '2024',
        email: 'dileep.dhami@example.com',
        picture: 'https://via.placeholder.com/150'
      },
      detailedDescription: 'Web App VIP leverages OWASP ZAP, an open-source code analysis tool, to investigate web application vulnerabilities such as cross-site scripting (XSS), SQL injections, and buffer overflows. This project provides students with practical experience in vulnerability assessments and penetration testing, crucial skills in cybersecurity.'
    },
    {
      title: 'NetProbe X',
      description: 'A network analysis tool offering a user-friendly GUI for capturing, analyzing, and visualizing network data.',
      director: {
        name: 'Zaki Hasan Ali',
        program: 'Network Security',
        year: '2024',
        email: 'zaki.hasan.ali@example.com',
        picture: 'https://via.placeholder.com/150'
      },
      detailedDescription: 'NetProbe X simplifies network data analysis with a powerful GUI, utilizing Wireshark and Python. This tool captures and visualizes network information, making it accessible for users to understand network security and performance. The project aims to provide an intuitive experience for network analysis enthusiasts.'
    },
    {
      title: 'Twitter Stock Trading AI',
      description: 'Analyzing tweet sentiment about financial instruments and correlating it with real-time stock prices to assess the impact of sentiment on stock prices.',
      director: {
        name: 'Siddhant Saraf',
        program: 'Artificial Intelligence',
        year: '2024',
        email: 'siddhant.saraf@example.com',
        picture: 'https://via.placeholder.com/150'
      },
      detailedDescription: 'This project uses Transformer models to analyze the sentiment of tweets related to financial instruments. By correlating sentiment with real-time stock prices, we aim to understand how public sentiment influences market movements. The project explores the intersection of social media and financial analysis.'
    }
  ],
  AI: [
    {
      title: 'Pneumonia Detection Model',
      description: 'Developing an AI model to instantly diagnose pneumonia from medical scans, enhancing efficiency in medical diagnoses.',
      director: {
        name: 'Alp Unsal',
        program: 'Artificial Intelligence',
        year: '2024',
        email: 'alp.unsal@example.com',
        picture: 'https://via.placeholder.com/150'
      },
      detailedDescription: 'The Pneumonia Detection Model leverages AI to improve diagnostic accuracy for pneumonia from medical scans. This project aims to assist medical professionals by providing instant, reliable diagnoses, thereby saving lives and increasing the efficiency of medical workflows.'
    },
    {
      title: 'Software Cryptography Implementation',
      description: 'Learning and implementing modern cryptographic systems through practical software applications.',
      director: {
        name: 'Hunter Korble',
        program: 'Cryptography',
        year: '2024',
        email: 'hunter.korble@example.com',
        picture: 'https://via.placeholder.com/150'
      },
      detailedDescription: 'This project focuses on understanding and applying modern cryptographic systems used in industry. Participants will implement cryptographic models in runnable software, gaining hands-on experience with encryption, decryption, and secure communication techniques.'
    },
    {
      title: 'ASL to English Translator',
      description: 'Utilizing computer vision to translate American Sign Language (ASL) to English, facilitating communication for the hearing-impaired.',
      director: {
        name: 'Geoff Easton',
        program: 'Computer Vision',
        year: '2024',
        email: 'geoff.easton@example.com',
        picture: 'https://via.placeholder.com/150'
      },
      detailedDescription: 'The ASL to English Translator project employs computer vision technology to bridge communication gaps between the hearing-impaired and those who do not know ASL. The tool aims to facilitate understanding and learning of ASL, improving communication and accessibility.'
    },
    {
      title: 'NeoArtSphere',
      description: 'A platform for artists from underprivileged areas to showcase and sell their art as NFTs globally.',
      director: {
        name: 'Bashshar Atif',
        program: 'Digital Art and NFT',
        year: '2024',
        email: 'bashshar.atif@example.com',
        picture: 'https://via.placeholder.com/150'
      },
      detailedDescription: 'NeoArtSphere is designed to support artists from underrepresented regions by providing a platform to mint and sell their art as NFTs. This project enables artists to reach a global audience and gain recognition while offering art enthusiasts unique and meaningful perspectives.'
    },
    {
      title: 'AWS Cloud Fusion',
      description: 'An engaging project exploring web hosting, serverless applications, and database management using AWS.',
      director: {
        name: 'Ganesh Krishna Menon',
        program: 'Cloud Computing',
        year: '2024',
        email: 'ganesh.krishna.menon@example.com',
        picture: 'https://via.placeholder.com/150'
      },
      detailedDescription: 'AWS Cloud Fusion provides a comprehensive introduction to cloud technologies. Participants will learn to build static websites, create messaging apps, and manage databases using AWS services. This project offers a hands-on opportunity to explore cloud computing and develop practical skills.'
    }
  ]
};

// Define prop types for components
interface ProjectCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
}

// ProjectCard component
const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, onClick }) => (
  <div className=" p-4 m-2 cursor-pointer" onClick={onClick}>
    <h2 className="text-xl font-bold">{title}</h2>
    <p>{description}</p>
  </div>
);

// ProjectDetails component
const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => (
  <div className="fixed inset-0 bg-white p-8 shadow-lg z-50">
    <button className="absolute top-4 right-4" onClick={onClose}>Close</button>
    <img src={project.director.picture} alt={project.director.name} className="w-24 h-24 rounded-full mb-4" />
    <h1 className="text-2xl font-bold">{project.director.name}</h1>
    <p>{project.director.program}, {project.director.year}</p>
    <p>Email: <a href={`mailto:${project.director.email}`} className="text-blue-500">{project.director.email}</a></p>
    <h2 className="text-xl font-bold mt-4">Project Details</h2>
    <p>{project.detailedDescription}</p>
    <a href="/contact" className="text-blue-500 mt-4 inline-block">Interested? Get in Touch!</a>
  </div>
);

// Projects component
export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleClose = () => {
    setSelectedProject(null);
  };

  return (
    <div>
    <Navbar />
    <div className="min-h-screen flex flex-col">
    <div
      className="relative w-screen h-[30vw] bg-cover bg-center"
      style={{ backgroundImage: "url('/projectBg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-white text-center px-6 py-12 max-w-4xl mx-auto">
          <h1 className="text-6xl font-extrabold leading-tight mb-6">Student Innovation Projects</h1>
          <p className="text-lg leading-relaxed">
            SIPs have been carefully designed by our team alongside industry professionals and executives, to provide coordinators with the most relevant and valuable skill set. WCS Projects are an incredible opportunity to gain hands-on experience in high-demand software and skills.
          </p>
        </div>
      </div>
    </div>

    <div className="p-6 bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-8 mt-10 text-center">SIP Projects | 2024 - 2025</h1>
      {Object.keys(projects).map((category) => (
        <div key={category} className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects[category as keyof ProjectCategory].map((project, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  onClick={() => handleCardClick(project)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      {selectedProject && (
        <ProjectDetails project={selectedProject} onClose={handleClose} />
      )}
    </div>
    </div>
    <Footer />
    </div>
  );
};