"use client";
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { motion } from "framer-motion"

type TeamMember = {
  image: string;
  name: string;
  title: string;
  program: string;
  year: string;
  email?: string;
  linkedin?: string;
};

type TeamCardProps = {
  member: TeamMember;
};

const teamData: TeamMember[] = [
  {
    image: '/team/alppppp.jpeg',
    name: 'Alp Unsal',
    title: 'Co-President',
    program: 'CS & Ivey HBA',
    year: '3rd Year',
    email: 'aunsal3@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/alpunsal/',
  },
  {
    image: '/team/taylorr.jpeg',
    name: 'Taylor McCloskey',
    title: 'Co-President',
    program: 'MIT',
    year: '4th year',
    email: 'tmcclos2@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/taylor-mccloskey-77950918a/',
  },
  {
    image: '/team/erin.jpeg',
    name: 'Erin Hu',
    title: 'Co-VP Operations',
    program: 'Urban Development',
    year: '4th year',
    email: 'ehu24@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/huerin/',
  },
  {
    image: '/team/aiden.jpeg',
    name: 'Aiden Shin',
    title: 'Co-VP Operations',
    program: 'Economics',
    year: '3rd year',
    email: 'ashin25@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/aidenshin/',
  },
  {
    image: '/team/joann2.png',
    name: 'Joann R.',
    title: 'VP Operational Strategy & Execution',
    program: 'CS & MIT',
    year: '3rd year',
    email: 'jranjit@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/joannmr/',
  },
  {
    image: '/team/mia.jpeg',
    name: 'Mia Mcdonalds',
    title: 'VP Internal Affairs & Director of AI',
    program: 'Engineering',
    year: '3rd year',
    email: 'mmacd367@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/mia-s-macdonald/',
  },
  {
    image: '/team/megan.jpeg',
    name: 'Megan Kingston',
    title: 'VP Brand Strategy',
    program: 'MIT',
    year: '3rd year',
    email: 'mkingst9@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/megan-kingston-/',
  },
  {
    image: '/team/adam.jpeg',
    name: 'Adam Seaton',
    title: 'VP Student Innovation Projects',
    program: 'Computer Science',
    year: '3rd year',
    email: 'aseaton3@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/adam-seaton-855440262/',
  },
  {
    image: '/team/isabel.jpeg',
    name: 'Isabel Ke',
    title: 'VP Finance',
    program: 'Computer Science',
    year: '2nd year',
    email: 'ike@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/isabel-ke/',
  },
  {
    image: '/team/sabina.jpeg',
    name: 'Sabina Radhi',
    title: 'VP Communications',
    program: 'Computer Science',
    year: '3rd year',
    email: 'sradhi@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/sabina-radhi-28b590293/',
  },
  {
    image: '/team/vaanya.jpeg',
    name: 'Vaanya Puri',
    title: 'VP Artificial Intelligence',
    program: 'Computer Science',
    year: '3rd year',
    email: 'vpuri22@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/vaanyap/',
  },

  {
    image: '/team/maya.jpeg',
    name: 'Maya Umicevic',
    title: 'VP IBM',
    program: 'BMOS (Finance)',
    year: 'HBA',
    email: 'mumicevi@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/maya-umicevic-3117aa233/',
  },
  {
    image: '/team/justin.jpeg',
    name: 'Justin Dhillon',
    title: 'VP IBM',
    program: 'Computer Science',
    year: '2nd year',
    email: 'jdhill94@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/justinsinghdhillon/',
  },
  {
    image: '/team/fahmid.jpeg',
    name: 'Fahmid Abdullah',
    title: 'VP Digital Transformation & Technology',
    program: 'Computer Science',
    year: '4th year',
    email: 'fabdull9@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/fahmid-abdullah/',
  },
  {
    image: '/team/henry.jpeg',
    name: 'Henry Wang',
    title: 'Director of AI',
    program: 'Software Engineering',
    year: '3rd year',
    email: 'hwan577@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/henry-wang-131b162aa/',
  },
  {
    image: '/team/richard.jpeg',
    name: 'Richard Augustine',
    title: 'Director of AI',
    program: 'Mechatronics',
    year: '3rd year',
    email: 'raugust3@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/richard-augustine/',
  },
  {
    image: '/team/ethan.jpeg',
    name: 'Ethan Carvalho',
    title: 'Director of AI',
    program: 'Computer Science & Economics',
    year: '3rd year',
    email: 'ecarval4@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/ethan-carvalho/',
  },
  {
    image: '/team/nathan.jpeg',
    name: 'Nathan Wan',
    title: 'Director of AI',
    program: 'Engineering',
    year: '2nd year',
    email: 'nwan23@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/nathan-wan-82355b258/',
  },
  {
    image: '/team/rishabh.jpeg',
    name: 'Rishabh Jain',
    title: 'Director of Cybersecurity',
    program: 'Computer Science',
    year: 'Graduate',
    email: 'rjain57@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/1rishabhjain/',
  },
];

const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
    initial={{ y: 100, opacity: 0 }} // Start from right (x: 100) and invisible
    whileInView={{ y: 0, opacity: 1 }} // Slide to its original position (x: 0) and become visible
    transition={{ type: "tween", duration: 0.5 }} // You can adjust the transition properties
    viewport={{ margin: "-50px", once: true }}
      className="relative cursor-pointer overflow-hidden rounded-sm h-[45rem] md:h-[30rem] 2xl:h-[40rem] w-full transition-transform duration-300 ease-in-out hover:scale-110 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-11/12 h-5/6 object-cover shadow-xl transition-all duration-500"
      />
      <div className="absolute z-40 w-4/5 md:w-3/4 bottom-10 right-2 p-4 bg-gradient-to-r from-zinc-100 to-zinc-100 text-black rounded-sm shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)] transition-all duration-200 ease-in-out h-20 group-hover:h-28">
        <div className="font-semibold text-md md:text-xl">{member.name}</div>
        <div className="text-xs md:text-sm">{member.title}</div>
        
        {isHovered && (
          <div className="mt-2 flex justify-between items-center">
  <p className="text-xs">{member.program}</p>
  <div className="flex text-black text-xl space-x-2">
    <button
      onClick={() => {
        window.open(`mailto:${member.email}`);
      }}
      className="transition-all duration-300 ease-in-out hover:scale-110 hover:text-gray-800"
    >
      <i className="fa-solid fa-envelope"></i>
    </button>
    <button
      onClick={() => window.open(member.linkedin || '', '_blank')}
      className="transition-all duration-300 ease-in-out hover:scale-110 hover:text-gray-800"
    >
      <i className="fa-brands fa-linkedin"></i>
    </button>
  </div>
</div>

        )}
      </div>
    </motion.div>
  );
};

const Section: React.FC<{ members: TeamMember[]; }> = ({ members }) => (
  <section className="mb-8">
    <div className="flex justify-center">
      <div className="w-full mx-5 md:mx-20 grid grid-cols-1 md:grid-cols-3 gap-5">
        {members.map((member, index) => (
          <TeamCard
            key={index}
            member={member}
          />
        ))}
      </div>
    </div>
  </section>
);

export default function MeetTheTeam() {

  return (
    <div>
      <Navbar />

      {/* Full-width background image with text */}
      <section
          className="mt-40 md:mt-16 relative w-full h-[55vw] md:h-[30vw] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/projectBg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
              <h1 className="text-xl md:text-5xl md:text-6xl font-bold mb-6 leading-tight">Behind WCS</h1>
              <p className="text-sm md:text-lg md:text-xl leading-relaxed">
              Get to know the diverse group of talented individuals behind our organization, each bringing unique skills and perspectives. Together, we are committed to driving innovation and creating a supportive environment for all members.
              </p>
            </div>
          </div>
        </section>

      <div className="bg-gray-100 min-h-screen">
        <div className="p-4 text-black">
          <div className='text-center mt-14'>
            <motion.h1
              initial={ { opacity: 0, } }
              whileInView={ { opacity: 1 } }
              viewport={ { margin: '-100px', once: true } } 
            className='text-4xl text-center font-bold text-gray-800'><strong>The People Behind WCS</strong></motion.h1>
            <motion.h2 className='mt-3 mb-14'>WCS is proud to present our incredible 2024-2025 student team.</motion.h2>
          </div>
          <Section members={teamData} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
