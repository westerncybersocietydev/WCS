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

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  member: {
    image: string;
    name: string;
    title: string;
    program: string;
    year: string;
    email?: string;
    linkedin?: string;
    twitter?: string;
  };
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
    title: 'VP Operation Strategy & Exec',
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
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, member }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 transition-opacity z-50">
      <div className="relative bg-white px-5 py-3 rounded-sm w-2/6 h-5/6 shadow-lg flex flex-col items-center justify-center">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 bg-transparent text-gray-700 transition-transform duration-300 hover:scale-110 focus:outline-none"
        >
          <i className="fa-solid fa-x text-xs"></i>
        </button>
          
        <img src={member.image} alt="Profile" className="w-56 h-56 rounded-full object-cover mb-4 shadow-xl" />
          
        <h1 className="text-2xl text-black font-extrabold text-center">{member.name}</h1>
        <h2 className="text-lg  text-gray-800 font-semibold text-center">{member.title}</h2>
        <p className="text-md text-gray-600 font-semibold text-center mb-4">{member.year} - {member.program}</p>
          
        <div className="flex text-black text-3xl space-x-5">
          <button className="transition-all duration-300 ease-in-out hover:scale-110 hover:text-gray-800">
            <i className="fa-solid fa-envelope"></i>
          </button>
          <button className="transition-all duration-300 ease-in-out hover:scale-110 hover:text-gray-800">
            <i className="fa-brands fa-linkedin"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

const TeamCard: React.FC<TeamCardProps> = ({ member }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative cursor-pointer overflow-hidden rounded-sm h-[24rem] w-full transition-transform duration-300 ease-in-out hover:scale-110 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-11/12 h-5/6 object-cover shadow-xl transition-all duration-500"
      />
      <div className="absolute z-40 w-3/4 bottom-10 right-2 p-4 bg-gradient-to-r from-zinc-100 to-zinc-100 text-black rounded-sm shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)] transition-all duration-200 ease-in-out h-20 group-hover:h-28">
        <div className="font-semibold text-xl">{member.name}</div>
        <div className="text-sm">{member.title}</div>
        
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

const Section: React.FC<{ members: TeamMember[]; onCardClick: (member: TeamMember) => void; }> = ({ members, onCardClick }) => (
  <section className="mb-8">
    <div className="flex justify-center">
      <div className="w-full mx-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
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
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  const handleCardClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  return (
    <div>
      <Navbar />

      {/* Full-width background image with text */}
      <section
          className="mt-16 relative w-full h-[30vw] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/projectBg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Meet The Team</h1>
              <p className="text-lg md:text-xl leading-relaxed">
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
          <Section members={teamData} onCardClick={handleCardClick} />
          {selectedMember && (
            <Modal
              isOpen={!!selectedMember}
              onClose={handleCloseModal}
              member={selectedMember}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
