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
      projectImg: "/overview.jpg",
      description: "A cutting-edge cybersecurity project harnessing microcontrollers to create a formidable trio of tools. Unleash a password brute-force powerhouse, seize control with a WiFi password grabber.",
      director: {
          name: "Adam Seaton",
          year: "4th year",
          email: "adam.seaton@example.com",
          linkedin: "https://linkedin.com/in/adamseaton",
          picture: "https://example.com/adam-seaton.jpg"
      }
  },
  {
      title: "Software Cryptography Implementation",
      category: "Cybersecurity",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/overview.jpg",
      description: "A cutting-edge cybersecurity project harnessing microcontrollers to create a formidable trio of tools. Unleash a password brute-force powerhouse, seize control with a WiFi password grabber.",
      director: {
          name: "Hunter Korble",
          year: "4th year",
          email: "hunter.korble@example.com",
          linkedin: "https://linkedin.com/in/hunterkorble",
          picture: "https://example.com/hunter-korble.jpg"
      }
  },
  {
      title: "Pneumonia Detection Model",
      category: "AI",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/overview.jpg",
      description: "A cutting-edge cybersecurity project harnessing microcontrollers to create a formidable trio of tools. Unleash a password brute-force powerhouse, seize control with a WiFi password grabber.",
      director: {
          name: "Alp Unsal",
          year: "4th year",
          email: "alp.unsal@example.com",
          linkedin: "https://linkedin.com/in/alpunzal",
          picture: "https://example.com/alp-unsal.jpg"
      }
  },
  {
      title: "Web App VIP (Vulnerability Identification Platform)",
      category: "Cybersecurity",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/overview.jpg",
      description: "A cutting-edge cybersecurity project harnessing microcontrollers to create a formidable trio of tools. Unleash a password brute-force powerhouse, seize control with a WiFi password grabber.",
      director: {
          name: "Dileep Dhami",
          year: "4th year",
          email: "dileep.dhami@example.com",
          linkedin: "https://linkedin.com/in/dileepdhami",
          picture: "https://example.com/dileep-dhami.jpg"
      }
  },
  {
      title: "NetProbe X",
      category: "Cybersecurity",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/overview.jpg",
      description: "A cutting-edge cybersecurity project harnessing microcontrollers to create a formidable trio of tools. Unleash a password brute-force powerhouse, seize control with a WiFi password grabber.",
      director: {
          name: "Zaki Hasan Ali",
          year: "4th year",
          email: "zaki.hasan.ali@example.com",
          linkedin: "https://linkedin.com/in/zaki-hasan-ali",
          picture: "https://example.com/zaki-hasan-ali.jpg"
      }
  },
  {
      title: "Spotify Playlist Generator",
      category: "AI",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/overview.jpg",
      description: "A cutting-edge cybersecurity project harnessing microcontrollers to create a formidable trio of tools. Unleash a password brute-force powerhouse, seize control with a WiFi password grabber.",
      director: {
          name: "Ethan Carvalho",
          year: "4th year",
          email: "ethan.carvalho@example.com",
          linkedin: "https://linkedin.com/in/ethancarvalho",
          picture: "https://example.com/ethan-carvalho.jpg"
      }
  },
  {
      title: "ASL to English Translator",
      category: "AI",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/overview.jpg",
      description: "A cutting-edge cybersecurity project harnessing microcontrollers to create a formidable trio of tools. Unleash a password brute-force powerhouse, seize control with a WiFi password grabber.",
      director: {
          name: "Geoff Easton",
          year: "4th year",
          email: "geoff.easton@example.com",
          linkedin: "https://linkedin.com/in/geoffeaston",
          picture: "profileImg.jpg"
      }
  },
  {
      title: "AWS Cloud Fusion",
      category: "Web3",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/overview.jpg",
      description: "A cutting-edge cybersecurity project harnessing microcontrollers to create a formidable trio of tools. Unleash a password brute-force powerhouse, seize control with a WiFi password grabber.",
      director: {
          name: "Siddhant Saraf",
          year: "4th year",
          email: "siddhant.saraf@example.com",
          linkedin: "https://linkedin.com/in/siddhantsaraf",
          picture: "https://example.com/siddhant-saraf.jpg"
      }
  },
  {
      title: "Twitter Stock Trading AI",
      category: "AI",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/overview.jpg",
      description: "A cutting-edge cybersecurity project harnessing microcontrollers to create a formidable trio of tools. Unleash a password brute-force powerhouse, seize control with a WiFi password grabber.",
      director: {
          name: "Bashshar Atif",
          year: "4th year",
          email: "bashshar.atif@example.com",
          linkedin: "https://linkedin.com/in/bashsharatif",
          picture: "https://example.com/bashshar-atif.jpg"
      }
  },
  {
      title: "NeoArtSphere",
      category: "Web3",
      status: "Active",
      peopleCount: "5",
      difficulty: "Intermediate",
      projectImg: "/overview.jpg",
      description: "A cutting-edge cybersecurity project harnessing microcontrollers to create a formidable trio of tools. Unleash a password brute-force powerhouse, seize control with a WiFi password grabber.",
      director: {
          name: "Ganesh Krishna Menon",
          year: "4th year",
          email: "ganesh.krishna.menon@example.com",
          linkedin: "https://linkedin.com/in/ganeshkrishna",
          picture: "https://example.com/ganesh-krishna-menon.jpg"
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
    year: string;
    email: string;
    linkedin: string;
    picture: string;
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
          className="relative w-full h-[50vw] md:h-[30vw] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/projectBg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Student Innovation Projects</h1>
              <p className="text-lg md:text-xl leading-relaxed">
                SIPs have been meticulously crafted with industry professionals to equip coordinators with essential skills. Dive into hands-on experience with high-demand software and skills through WCS Projects.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
        <div className="flex flex-col md:flex-row justify-between mx-5">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">Student Innovation Projects</h1>
        </div>
        <div className="flex space-x-5">
        <div className="relative flex items-center">
  <input
    type="text"
    placeholder="Project name..."
    value={searchTerm}
    onChange={handleSearchChange}
    className="border w-[30vw] border-gray-500 text-black rounded-full text-sm shadow-sm h-full p-2 pr-10 hover:shadow-lg hover:border-blue-400 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
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
    <button className="ml-10 w-1/3 md:w-1/4 mt-5 tracking-widest rounded-full font-semibold
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
