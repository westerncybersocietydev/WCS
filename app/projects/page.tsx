"use client"
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Switch } from '@nextui-org/react';

const projects = [
  {
      title: "MicroGuard",
      category: "Cybersecurity",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/microg.jpg",
      description: "A cybersecurity project with tools for password brute-force, WiFi password grabbing, and data encryption.",
      director: {
          name: "Adam Seaton"
      }
  },
  {
      title: "Software Cryptography Implementation",
      category: "Cybersecurity",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/scyptintero.jpg",
      description: "Learn and implement modern cryptographic systems used in industry through runnable software.",
      director: {
          name: "Hunter Korble"
      }
  },
  {
      title: "Pneumonia Detection Model",
      category: "AI",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/pnDetect.jpg",
      description: "Create a pneumonia detection model to help medical professionals diagnose scans more efficiently.",
      director: {
          name: "Alp Unsal"
      }
  },
  {
      title: "Web App VIP (Vulnerability Identification Platform)",
      category: "Cybersecurity",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/vipWebApp.jpg",
      description: "A solution for users to analyze web apps for vulnerabilities using OWASP ZAP.",
      director: {
          name: "Dileep Dhami"
      }
  },
  {
      title: "NetProbe X",
      category: "Cybersecurity",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/netprobe.jpg",
      description: "Explore network analysis with a GUI using Wireshark and Python for data visualization.",
      director: {
          name: "Zaki Hasan Ali"
      }
  },
  {
      title: "Spotify Playlist Generator",
      category: "AI",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/spotify.jpg",
      description: "Create playlists that transition seamlessly using ML by scraping and analyzing data from the Spotify API.",
      director: {
          name: "Ethan Carvalho"
      }
  },
  {
      title: "ASL to English Translator",
      category: "AI",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/asl.jpg",
      description: "Utilize computer vision to bridge communication between the hearing-impaired and non-ASL speakers.",
      director: {
          name: "Geoff Easton"
      }
  },
  {
      title: "AWS Cloud Fusion",
      category: "Web3",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/awscf.jpg",
      description: "Merge web hosting and serverless applications on AWS while building a static website and messaging app.",
      director: {
          name: "Ganesh Krishna Menon"
      }
  },
  {
      title: "Twitter Stock Trading AI",
      category: "AI",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/TWTRADINGSTOCK.jpg",
      description: "Analyze tweet sentiment using Transformers and correlate with real-time stock prices.",
      director: {
          name: "Bashshar Atif"
      }
  },
  {
      title: "NeoArtSphere",
      category: "Web3",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/neoart.jpg",
      description: "A platform for artists in underprivileged areas to showcase and sell their art as NFTs.",
      director: {
          name: "Ganesh Krishna Menon"
      }
  }
];

// Define prop types for components
interface Project {
  title: string;
  category: string;
  status: string;
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
}

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ title, director, description, peopleCount, difficulty, imageUrl }) => (
  <div className="relative font-sans antialiased w-full h-full cursor-pointer transition-transform transform hover:scale-105 group flex flex-col overflow-hidden rounded-lg">
    
    {/* Top: Image */}
    <div className="h-2/4 w-full">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
    </div>
    
    {/* Bottom: Text content */}
    <div className="p-5 h-full text-white flex-grow flex flex-col relative">
      {/* Title and Director */}
      <div>
        <h2 className="text-2xl font-extrabold">{title}</h2>
        <p className="text-xs ml-1 text-gray-200">{director}</p>
      </div>

      {/* Project description */}
      <p className="text-sm my-2 flex-grow">
        {description}
      </p>
      {/* People count and difficulty at the bottom */}
      <div className="flex space-x-5 text-md font-bold">
        <p><i className="fa-solid fa-user-group"></i> {peopleCount}</p>
        <p><i className="fa-solid fa-bars-progress"></i> {difficulty}</p>
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
      <main className="mt-32 md:mt-16 min-h-screen flex flex-col bg-gray-100">
      <section
          className="mt-40 md:mt-16 relative w-full h-[55vw] md:h-[30vw] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/projectBg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
              <h1 className="text-xl md:text-5xl md:text-6xl font-bold mb-6 leading-tight">Student Innovation Projects</h1>
              <p className="text-sm md:text-lg md:text-xl leading-relaxed">
                SIPs have been meticulously crafted with industry professionals to equip coordinators with essential skills. Dive into hands-on experience with high-demand software and skills through WCS Projects.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
        <div className="flex flex-col md:flex-row justify-between mx-5">
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
            className="border border-gray-500 rounded-full h-full p-2 w-[14vw] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out hover:shadow-md hover:border-blue-400 hover:bg-white text-gray-700"
          >
            <option value="All">All</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Mainframe">Mainframe</option>
            <option value="AI">AI</option>
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
      </div>

      <div className="border-t border-gray-500 my-8 mx-auto w-3/4 opacity-50"></div>

          {filteredProjects.length > 0 ? (
            Object.keys(groupedProjects).map((category) => (
              <section key={category} className="mb-12 mx-5 mt-5">
                <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedProjects[category].map((project, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-b from-violet-500 to-purple-500 shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
                    >
                      <ProjectCard
                        title={project.title}
                        description={project.description}
                        director={project.director.name}
                        peopleCount={project.peopleCount}
                        difficulty={project.difficulty}
                        imageUrl={project.projectImg}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="text-center text-gray-500 mb-10">No projects match your criteria.</p>
          )}
        </section>
      </main>

      <div className='mt-10 flex flex-col md:flex-row bg-violet-400 w-full'>
  {/* Left half: Text */}
  <div className='w-full md:w-1/2 flex flex-col py-5 text-white justify-center'>
  <h1 className='ml-10 text-5xl font-extrabold mt-5'>Intrigued?</h1>
    <p className='ml-10 text-lg mt-5'>
      If you&apos;re interested in any of our projects, please apply using the link below. 
      For any inquiries, feel free to reach out to us via our 
      <a href="/contact" className="text-blue-600 hover:underline"> Contact Us</a> page.
    </p>
    <button className="ml-10 w-2/4 md:w-1/4 mt-5 tracking-widest rounded-full font-semibold
        border-2 font-bold bg-gradient-to-r from-violet-500 to-purple-500 text-white 
        hover:scale-105 hover:bg-gradient-to-r hover:from-violet-800 hover:to-purple-800 
        px-5 py-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg">
      Apply Now
    </button>
  </div>

  {/* Right half: Image */}
  <div className='w-full md:w-1/2'>
    <img src="/projectInterested.jpeg" alt="Project Image" className='w-full h-[35vw] md:h-[26vw] object-cover'/>
  </div>
</div>
      <Footer />
    </div>
  );
};
