"use client";
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { motion } from "framer-motion";
import Image from 'next/image';
import { TeamMember, teamData } from '../dataFiles/teamPage/members';

type TeamCardProps = {
  member: TeamMember;
};

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
      <div className="relative w-11/12 h-5/6">
        <Image
          src={member.image}
          alt={member.name}
          layout="fill" // Use fill layout to cover the div
          className="object-cover shadow-xl transition-all duration-500"
          priority // Optional: Use priority if this is a key image
        />
      </div>
      <div className="absolute z-40 w-4/5 md:w-11/12 bottom-10 right-2 p-4 bg-gradient-to-r from-zinc-100 to-zinc-100 text-black rounded-sm shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)] transition-all duration-200 ease-in-out h-20 group-hover:h-28">
        <div className="font-semibold text-md md:text-xl lg:text-2xl">{member.name}</div>
        <div className="text-xs md:text-sm lg:text-md">{member.title}</div>
        
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
    <>
      <main>
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
    </main>
    </>
  );
}
