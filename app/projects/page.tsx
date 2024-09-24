"use client"
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Switch } from '@nextui-org/react';
import { motion } from "framer-motion"

const projects = [
{
    title: "AI Music Composer",
    category: "Artificial Intelligence",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Hard",
    projectImg: "/projects/aimusic2.jpg",
    description: "An AI composing system that uses algorithms to generate unique melodies, harmonies, and rhythms, often tailored to specific genres or emotions.",
    director: {
        name: "Richard Augustine and Henry Hongbo Wang"
    }
},
{
    title: "AI Health Monitor",
    category: "Artificial Intelligence",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Intermediate",
    projectImg: "/projects/aihealthmonitor2.jpg",
    description: "An AI-powered health monitor using Arduino and AI to collect real-time biometric data through sensors, analyzed with machine learning models.",
    director: {
        name: "Mia Sara Macdonald-Walden"
    }
},
{
    title: "Fixer",
    category: "Artificial Intelligence",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Intermediate",
    projectImg: "/projects/fixer2.jpg",
    description: "An AI-driven platform that automates house searches and optimizes design using AR to build the future of real estate.",
    director: {
        name: "Ethan Tyler Carvalho"
    }
},
{
    title: "AI Medical Imaging Diagnostics",
    category: "Artificial Intelligence",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Intermediate",
    projectImg: "/projects/aimedical2.jpg",
    description: "A medical imaging diagnostics project using AI to quickly and accurately detect anomalies in X-rays, MRIs, and CT scans.",
    director: {
        name: "Nathan Wan"
    }
},
{
    title: "SecureFrame",
    category: "Cybersecurity",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Expert",
    projectImg: "/projects/secureframe2.jpg",
    description: "AI-powered video encryption that uses machine learning to dynamically secure video content and protect against unauthorized access and cyber threats.",
    director: {
        name: "Rishabh Jain"
    }
},
  {
    title: "BankFrame",
    category: "Mainframe",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Intermediate",
    projectImg: "/projects/bankframe2.jpg",
    description: "A banking system replica, modeled after CIBC, showcasing how the mainframe securely manages financial data.",
    director: {
        name: "Justin Dhillon"
    }
},
{
    title: "RiskGuard",
    category: "Mainframe",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Hard",
    projectImg: "/projects/riskguard2.jpg",
    description: "A fraud detection service leveraging machine learning on the mainframe to identify and prevent credit card fraud.",
    director: {
        name: "Justin Dhillon"
    }
},
{
    title: "E-Commerce Simulation",
    category: "Mainframe",
    status: "Active",
    year: "2024-2025",
    peopleCount: "5",
    difficulty: "Intermediate",
    projectImg: "/projects/ecommerce3.jpg",
    description: "An app similar to Amazon where the mainframe ensures fast, secure, and scalable transactions.",
    director: {
        name: "Justin Dhillon"
    }
},



  {
      title: "MicroGuard",
      category: "Cybersecurity",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/microg.jpg",
      description: "A cybersecurity project with tools for password brute-force, WiFi password grabbing, and data encryption. It aims to enhance user security by providing comprehensive solutions for common vulnerabilities.",
      director: {
          name: "Adam Seaton"
      }
  },
  {
      title: "Software Cryptography Implementation",
      category: "Cybersecurity",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/scyptintero.jpg",
      description: "Learn and implement modern cryptographic systems used in industry through runnable software. This project provides hands-on experience with the algorithms and protocols that secure digital communications.",
      director: {
          name: "Hunter Korble"
      }
  },
  {
      title: "Pneumonia Detection Model",
      category: "Artificial Intelligence",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/pnDetect.jpg",
      description: "Create a pneumonia detection model to help medical professionals diagnose scans more efficiently. The model leverages AI to analyze medical images, improving diagnostic accuracy and speed.",
      director: {
          name: "Alp Unsal"
      }
  },
  {
      title: "Web App VIP (Vulnerability Identification Platform)",
      category: "Cybersecurity",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/vipWebApp.jpg",
      description: "A solution for users to analyze web apps for vulnerabilities using OWASP ZAP. This platform empowers developers to identify and address security issues proactively.",
      director: {
          name: "Dileep Dhami"
      }
  },
  {
      title: "NetProbe X",
      category: "Cybersecurity",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/netprobe.jpg",
      description: "Explore network analysis with a GUI using Wireshark and Python for data visualization. This project offers an intuitive interface for monitoring network traffic and identifying anomalies.",
      director: {
          name: "Zaki Hasan Ali"
      }
  },
  {
      title: "Spotify Playlist Generator",
      category: "Artificial Intelligence",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/spotify.jpg",
      description: "Create playlists that transition seamlessly using ML by scraping and analyzing data from the Spotify API. The tool enhances the listening experience by curating personalized music recommendations.",
      director: {
          name: "Ethan Carvalho"
      }
  },
  {
      title: "ASL to English Translator",
      category: "Artificial Intelligence",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/asl.jpg",
      description: "Utilize computer vision to bridge communication between the hearing-impaired and non-ASL speakers. This innovative solution fosters inclusivity and enhances interaction in diverse settings.",
      director: {
          name: "Geoff Easton"
      }
  },
  {
      title: "AWS Cloud Fusion",
      category: "Web3",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/awscf.jpg",
      description: "Merge web hosting and serverless applications on AWS while building a static website and messaging app. This project demonstrates the power of cloud technologies in creating scalable applications.",
      director: {
          name: "Ganesh Krishna Menon"
      }
  },
  {
      title: "Twitter Stock Trading AI",
      category: "Artificial Intelligence",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/TWTRADINGSTOCK.jpg",
      description: "Analyze tweet sentiment using Transformers and correlate with real-time stock prices. This project explores the intersection of social media and financial markets, providing insights for traders.",
      director: {
          name: "Bashshar Atif"
      }
  },
  {
      title: "NeoArtSphere",
      category: "Web3",
      status: "Archived",
      year: "2023-2024",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/projects/old/neoart.jpg",
      description: "A platform for artists in underprivileged areas to showcase and sell their art as NFTs. This initiative aims to empower creators by providing them with access to global markets and audiences.",
      director: {
          name: "Bashshar Atif"
      }
  }
];

// Define prop types for components
interface Project {
  title: string;
  category: string;
  status: string;
  year: string;
  description: string;
  peopleCount: string;
  difficulty: string;
  projectImg: string;
  director: {
    name: string;
  };
}

interface ProjectCardProps {
  title: string;
  description: string;
  director: string;
  peopleCount: string;
  difficulty: string;
  imageUrl: string;
  status: string;
  year: string;
}

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ title, director, description, peopleCount, difficulty, imageUrl, status, year }) => (
  <div className="relative font-sans antialiased w-full h-[70vw] md:h-[60vw] lg:h-[50vw] 2xl:h-[40vw] cursor-pointer transition-transform transform hover:scale-105 group flex flex-col overflow-hidden rounded-lg">
    
    {/* Top: Image */}
    <div className="h-2/4 w-full">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
    </div>
    
    {/* Bottom: Text content */}
    <div className="p-5 h-2/4 text-white flex-grow flex flex-col relative">
      {/* Title and Director */}
      <div>
        <h2 className="text-lg md:text-2xl font-extrabold">{title}</h2>
        <p className="text-xs ml-1 text-gray-200">{director}</p>
      </div>

      {/* Project description */}
      <p className="text-xs md:text-sm xl:text-xl 2xl:text-2xl my-2 flex-grow">
        {description}
      </p>
      {/* People count and difficulty at the bottom */}
      <div className="flex space-x-5 text-md font-bold w-full">
        <p><i className="fa-solid fa-user-group"></i> {peopleCount}</p>
        <p><i className="fa-solid fa-bars-progress"></i> {difficulty}</p>
        {(status === "Archived") && <p className="ml-auto"><i className="fa-solid fa-box-archive"></i> {year}</p>}
      </div>
    </div>
  </div>
));



ProjectCard.displayName = 'ProjectCard';


export default function Projects() {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showArchived, setShowArchived] = React.useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };


  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesStatus = showArchived || project.status === 'Active'; // Adjusted to account for `showArchived`
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Group projects by category
  const groupedProjects = filteredProjects.reduce((acc: Record<string, Project[]>, project: Project) => {
    if (!acc[project.category]) {
      acc[project.category] = [];
    }
    acc[project.category].push(project);
    return acc;
  }, {});

  return (
    <div>
      <Navbar />
      <main className="mt-40 md:mt-16 min-h-screen flex flex-col bg-gray-100">
      <section
          className="relative w-full h-[55vw] md:h-[30vw] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/projectBg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
              <h1 className="text-xl md:text-5xl md:text-6xl font-bold mb-6 leading-tight">Student Innovation Projects</h1>
              <p className="text-sm md:text-lg md:text-xl leading-relaxed">
              Our Student Initiative Projects (SIP) showcase creative solutions developed by our members, tackling real-world challenges through teamwork and technical skills. Each project represents our commitment to learning, growth, and making a positive impact in our community.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
        <motion.div 
        initial={{ y: 100, opacity: 0 }} // Start from right (x: 100) and invisible
        whileInView={{ y: 0, opacity: 1 }} // Slide to its original position (x: 0) and become visible
        transition={{ type: "tween", duration: 0.5 }} // You can adjust the transition properties
        viewport={{ margin: "-50px", once: true }}
        className="flex flex-col md:flex-row justify-between mx-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold mx-auto md:mx-2 text-gray-800">Student Innovation Projects</h1>
        </div>
        <div className="mt-5 md:mt-0 flex justify-center items-center gap-4 md:gap-0 flex-col md:flex-row md:space-x-4">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Project name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border w-full md:w-[30vw] border-gray-500 text-black rounded-full text-sm shadow-sm h-full p-2 pr-10 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
          />
          <i className="fa-solid fa-magnifying-glass absolute right-4 text-gray-400"></i>
        </div>

          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-500 rounded-full h-full p-2 w-[16vw] shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:shadow-md hover:border-blue-400 hover:bg-white text-gray-700"
          >
            <option value="All">All</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Mainframe">Mainframe</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Web3">Web3</option>
          </select>
          <label className="flex text-sm items-center text-black space-x-2 cursor-pointer">
      <Switch
        isSelected={showArchived}
        onValueChange={setShowArchived}
      >
      </Switch>
      Show Archived
    </label>
        </div>
      </motion.div>

      <div className="border-t border-gray-500 my-8 mx-auto w-3/4 opacity-50"></div>

          {filteredProjects.length > 0 ? (
            Object.keys(groupedProjects).map((category) => (
              <section key={category} className="mb-12 mx-5 mt-5">
                <motion.h2 
              initial={ { opacity: 0, } }
              whileInView={ { opacity: 1 } }
              viewport={ { margin: '-100px', once: true } } 
                className="text-2xl text-center font-semibold text-gray-800 mb-6">{category}</motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedProjects[category].map((project, index) => (
                    <motion.div
                    initial={{ y: 100, opacity: 0 }} // Start from right (x: 100) and invisible
                    whileInView={{ y: 0, opacity: 1 }} // Slide to its original position (x: 0) and become visible
                    transition={{ type: "tween", duration: 0.5 }} // You can adjust the transition properties
                    viewport={{ margin: "-50px", once: true }}
                      key={index}
                      className="white bg-gradient-to-r from-violet-500 to-purple-500 shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
                    >
                      <ProjectCard
                        title={project.title}
                        description={project.description}
                        director={project.director.name}
                        peopleCount={project.peopleCount}
                        difficulty={project.difficulty}
                        imageUrl={project.projectImg}
                        status={project.status}
                        year={project.year}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="text-center text-gray-500 mb-10">No projects match your criteria.</p>
          )}
        </section>
      </main>

      <motion.div 
      initial={{ y: 100, opacity: 0 }} // Start from right (x: 100) and invisible
      whileInView={{ y: 0, opacity: 1 }} // Slide to its original position (x: 0) and become visible
      transition={{ type: "tween", duration: 0.5 }} // You can adjust the transition properties
      viewport={{ margin: "-50px", once: true }}
          className='mt-10 flex flex-col md:flex-row bg-violet-600 w-full'>
      {/* Left half: Text */}
      <div 
      className='w-full md:w-1/2 flex flex-col py-5 text-black justify-center items-center md:items-start'
      style={{ backgroundImage: "url('/landing2.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <h1 className='ml-10 text-5xl font-extrabold mt-5'>Intrigued?</h1>
      <p className='ml-10 text-lg mt-5'>
        If you&apos;re interested in any of our projects, please apply using the link below. 
        For any inquiries, feel free to reach out to us via our 
        <a href="/contact" className="text-blue-500 hover:underline"> Contact Us</a> page.
      </p>
      <button
        onClick={() => window.open("https://forms.gle/dwpx4Y5u2T3tAupK9", "_blank")}
        className="ml-10 w-3/5 md:w-1/4 mt-5 tracking-widest rounded-full font-semibold
            border-2 font-bold bg-gradient-to-r from-violet-500 to-purple-500 text-white 
            hover:scale-105 hover:bg-gradient-to-r hover:from-violet-800 hover:to-purple-800 
            px-5 py-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
      >
        Apply Now
      </button>
    </div>

  {/* Right half: Image */}
  <div className='w-full md:w-1/2'>
    <img src="/projectInterested.jpeg" alt="Project Image" className='w-full h-[35vw] md:h-[26vw] object-cover'/>
  </div>
</motion.div>
      <Footer />
    </div>
  );
};
