"use client"
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { useRouter } from 'next/navigation';
import { Switch } from '@nextui-org/react';

const projects = [
  {
      title: "MicroGuard",
      category: "Cybersecurity",
      status: "Inactive",
      description: "A cutting-edge cybersecurity project harnessing microcontrollers to create a formidable trio of tools. Unleash a password brute-force powerhouse, seize control with a WiFi password grabber, and encrypt data with a microcontroller-based ransomware tool. MicroGuard, your ultimate trio of hacking tools.",
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
      status: "Inactive",
      description: "In this project, members will learn how modern cryptographic systems function, with a special emphasis on models used in industry. Participants will put their knowledge to practice by implementing these systems on runnable software.",
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
      status: "Inactive",
      description: "Many industries have seen exponential improvements due to the growth in the AI industry such as the medical industry. With this growth, thousands of scans that would have to have been done in one by one can be instantly diagnosed. By creating the pneumonia detection model, you will help medical professionals be much more efficient in their diagnosis helping save the lives of many.",
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
      status: "Inactive",
      description: "Web App VIP will introduce a holistic and cost-friendly solution for users to analyze their small web applications to identify potential vulnerabilities. Leveraging OWASP ZAP, an open-source code analysis tool, web app vulnerabilities such as cross-site scripting (XSS), SQL injections, and buffer overflows will be investigated and presented to the user. Web App VIP is a fantastic opportunity for students to gain hands-on experience with vulnerability assessments and penetration testing, both critical areas of cybersecurity.",
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
      status: "Inactive",
      description: "Introducing 'NetProbe X', a cutting-edge project aimed at providing a captivating journey into the world of network analysis through a user-friendly Graphical User Interface (GUI). By the power harnessed from Wireshark and Python, this tool promises to simplify network data, offering a seamless experience for capturing, analyzing, and visualizing network information.",
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
      status: "Inactive",
      description: "The goal is to create a playlist that seamlessly transitions from one song to the next, where each next song is decided using ML. The project will involve scraping data from the Spotify API and on preprocessing, data will be trained on different models and the best one will be implemented. The project can grow and can take several routes through developments needed after implementation.",
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
      status: "Inactive",
      description: "Communication is uniquely difficult for the hearing-impaired. Our ASL-to-English translator utilizes computer vision to open a channel of communication between the hearing-impaired and non-ASL speakers, as well as assist those interested in learning this rich language.",
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
      status: "Inactive",
      description: "A thrilling project merging web hosting, serverless applications, and database management using AWS. Dive into the world of clouds without prior knowledge, and learn to build a static website, create a messaging app, and manage databases in just weeks! Don't miss this opportunity to discover the power of AWS with us—your gateway to the incredible realm of the cloud awaits!",
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
      status: "Inactive",
      description: "This project uses Transformers to analyse the sentiment of tweets relating to financial instruments and then we will be correlating them with real time stock prices to see how much sentiment influences stock prices.",
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
      status: "Inactive",
      description: "A user-friendly application that enables artists from specific underprivileged geographical areas to profit from their art by providing them with a platform to showcase their art as an NFT. With their art minted as an NFT, they would be able to sell it globally to art enthusiasts who are interested in truly unique perspectives and giving back.",
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
  onClick: () => void;
}

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
  isInterested: () => void;
}



const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ title, description, onClick }) => (
  <div onClick={onClick} className="relative font-sans antialiased w-full h-full cursor-pointer transition-transform transform hover:scale-105 group flex flex-col justify-between overflow-hidden">
    <div className='p-7'>
      <h2 className="text-md font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-600">{description.length > 200 ? description.substring(0, 200) + '...' : description}</p>
    </div>
    <div className="absolute bottom-0 right-3 p-4 font-semibold transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out">
      <span className='text-sm text-gray-400 font-semibold'>Read more <i className="fa-solid fa-arrow-right"></i></span>
    </div>
  </div>
));

ProjectCard.displayName = 'ProjectCard';


const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose, isInterested }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity z-50">
    <div className="relative bg-white px-5 py-3 rounded-sm w-3/5 h-3/4 shadow-lg">
    <button onClick={onClose} className="absolute bg-white px-2 top-2 right-2 text-gray-700 transition-transform duration-300 hover:scale-110 focus:outline-none">
      <i className="fa-solid fa-x text-xs"></i>
    </button>
      <h1 className="text-2xl font-bold text-black text-center">{project.title}</h1>
      <h2 className="text-md font-bold text-gray-800 text-center">{project.category}</h2>
      <div className="flex mx-3 flex-row h-3/4 overflow-hidden">
        {/* Left Side */}
        <div className="w-3/5">
          <h2 className='text-gray-800 underline mt-6 mb-3 font-semibold'>Description</h2>
          <p className='text-gray-600 w-11/12'>{project.description}</p>
          <button
              className="relative mt-6 w-3/4 text-black border border-black hover:scale-110 hover:bg-black hover:text-white px-4 py-1 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
              aria-label="Sign In"
              onClick={isInterested}>
              Interested? Get in Touch!
            </button>
        </div>

        {/* Divider */}
        <div className="w-px h-4/6 mt-12 bg-black lg:block hidden"></div>

        {/* Right Side: Content */}
        <div className="w-2/5 p-5 flex flex-col items-center">
          
          <img src={project.director.picture} alt="Profile" className="w-36 h-36 rounded-full object-cover mb-2" />
          
          <h1 className="text-lg text-gray-800 font-bold">{project.director.name}</h1>
          <h2 className="text-sm text-gray-500 font-semibold mb-2">{project.director.year}</h2>
          
          <div className="flex text-black text-2xl space-x-5">
            <button className='transition-all duration-300 ease-in-out hover:scale-110 hover:text-gray-800'><i className="fa-solid fa-envelope"></i></button>
            <button className='transition-all duration-300 ease-in-out hover:scale-110 hover:text-gray-800'><i className="fa-brands fa-linkedin"></i></button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

ProjectDetails.displayName = 'ProjectDetails';

export default function Projects() {

  
  const router = useRouter();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showArchived, setShowArchived] = React.useState(false);

  const handleCardClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleClose = () => {
    setSelectedProject(null);
  };

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
      <main className="min-h-screen flex flex-col bg-gray-100">
        <section
          className="relative w-full h-[30vw] bg-cover bg-center bg-no-repeat"
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

        <section className="mt-10 px-6">
        <div className="flex justify-between">
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
      <div className="border-t border-gray-300 my-8 mx-auto w-3/4 opacity-50">
</div>

          {filteredProjects.length > 0 ? (
            Object.keys(groupedProjects).map((category) => (
              <section key={category} className="mb-12">
                <h2 className="text-2xl text-center font-semibold text-gray-800 mb-6">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedProjects[category].map((project, index) => (
                    <div
                      key={index}
                      className="bg-white shadow-md rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
                    >
                      <ProjectCard
                        title={project.title}
                        description={project.description}
                        onClick={() => handleCardClick(project)}
                      />
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="text-center text-gray-500 mb-10">No projects match your criteria.</p>
          )}
          {selectedProject && (
            <ProjectDetails project={selectedProject} onClose={handleClose} isInterested={() => router.push('/contact')} />
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};
