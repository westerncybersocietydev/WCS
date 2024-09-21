"use client";
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

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
    image: 'alppppp.jpeg',
    name: 'Alp Unsal',
    title: 'Co-President',
    program: 'CS & Ivey HBA',
    year: '3rd Year',
    email: 'aunsal3@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/alpunsal/',
  },
  {
    image: 'taylorr.jpeg',
    name: 'Taylor McCloskey',
    title: 'Co-President',
    program: 'MIT',
    year: '4th year',
    email: 'tmcclos2@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/taylor-mccloskey-77950918a/',
  },
  {
    image: 'erin.jpeg',
    name: 'Erin Hu',
    title: 'Co-VP Operations',
    program: 'Urban Development',
    year: '4th year',
    email: 'ehu24@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/huerin/',
  },
  {
    image: 'aiden.jpeg',
    name: 'Aiden Shin',
    title: 'Co-VP Operations',
    program: 'Economics',
    year: '3rd year',
    email: 'ashin25@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/aidenshin/',
  },
  {
    image: 'joann.jpeg',
    name: 'Joann R.',
    title: 'VP Operation Strategy & Execution',
    program: 'CS & MIT',
    year: '3rd year',
    email: 'jranjit@uwo.ca',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  {
    image: 'mia.jpeg',
    name: 'Mia Mcdonalds',
    title: 'VP Internal Affairs',
    program: 'Engineering',
    year: '3rd year',
    email: 'mmacd367@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/mia-s-macdonald/',
  },
  {
    image: 'megan.jpeg',
    name: 'Megan Kingston',
    title: 'VP Brand Strategy',
    program: 'MIT',
    year: '3rd year',
    email: 'mkingst9@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/megan-kingston-/',
  },
  {
    image: 'adam.jpeg',
    name: 'Adam Seaton',
    title: 'VP Student Innovation Projects',
    program: 'Computer Science',
    year: '3rd year',
    email: 'aseaton3@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/adam-seaton-855440262/',
  },
  {
    image: 'isabel.jpeg',
    name: 'Isabel Ke',
    title: 'VP Finance',
    program: 'Computer Science',
    year: '2nd year',
    email: 'ike@uwo.ca',
    linkedin: 'https://www.linkedin.com/in/isabel-ke/',
  },
];

const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-sm h-[35rem] md:h-[24rem] w-full transition-transform duration-300 ease-in-out hover:scale-110 group"
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
    </div>
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
                SIPs have been meticulously crafted with industry professionals to equip coordinators with essential skills. Dive into hands-on experience with high-demand software and skills through WCS Projects.
              </p>
            </div>
          </div>
        </section>

      <div className="bg-gray-100 min-h-screen">
        <div className="p-4 text-black">
          <div className='text-center mt-14'>
            <h1 className='text-4xl text-center font-bold text-gray-800'><strong>Meet The Team</strong></h1>
            <h2 className='mt-3 mb-14'>WCS is proud to present our incredible 2024-2025 student team.</h2>
          </div>
          <Section members={teamData} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
