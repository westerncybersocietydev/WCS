"use client"
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Switch } from '@nextui-org/react';
import { motion } from "framer-motion"
import Image from 'next/image';
import { Project, ProjectCardProps, projects } from '../dataFiles/projectPage/projects';

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ title, director, description, peopleCount, difficulty, imageUrl, status, year }) => (
  <div className="relative font-sans antialiased w-full h-[70vw] md:h-[60vw] lg:h-[50vw] 2xl:h-[40vw] cursor-pointer transition-transform transform hover:scale-105 group flex flex-col overflow-hidden rounded-lg">
    
    {/* Top: Image */}
    <div className="relative h-2/4 w-full">
      {status === "Archived" && (
        <p className='absolute top-5 right-5 bg-gradient-to-r from-pink-500 to-rose-500 shadow-md rounded-full px-3 py-1 font-semibold text-xs text-white z-10'>
          Archived
        </p>
      )}
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={imageUrl} // This can remain as a dynamic URL
          alt={title} // This can remain as a dynamic title
          layout="fill" // Makes the image fill the container
          objectFit="cover" // Ensures the image covers the container
        />
      </div>
    </div>
    
    {/* Bottom: Text content */}
    <div className="p-5 h-2/4 text-white flex-grow flex flex-col relative">
      {/* Title and Director */}
      <div>
        <h2 className="text-lg md:text-2xl font-extrabold">{title}</h2>
        <p className="text-xs ml-1 text-gray-200">{director}</p>
      </div>

      {/* Project description */}
      <p className="text-xs md:text-sm xl:text-md 2xl:text-xl my-2 flex-grow">
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
    <>
      <main>
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
    <div className="relative w-full h-[35vw] md:h-[26vw] overflow-hidden">
      <Image
        src="/projectInterested.jpeg" // Ensure this path is correct
        alt="Project Image"
        layout="fill" // Makes the image fill the container
        objectFit="cover" // Ensures the image covers the container
      />
    </div>
  </div>
</motion.div>
      <Footer />
    </div>
    </main>
    </>
  );
};
