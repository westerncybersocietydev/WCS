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
  image: string;
  name: string;
  title: string;
  year: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  onClick: () => void;
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
    image: 'profileImg.jpg',
    name: 'John Doe',
    title: 'President',
    program: 'Compsci',
    year: 'Senior',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  {
    image: 'profileImg.jpg',
    name: 'John Doe',
    title: 'President',
    program: 'Compsci',
    year: 'Senior',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  {
    image: 'profileImg.jpg',
    name: 'Jane Smith',
    title: 'VIP',
    program: 'Compsci',
    year: 'Junior',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/janesmith',
  },
  {
    image: 'profileImg.jpg',
    name: 'Alice Johnson',
    title: 'SIP Director',
    program: 'Compsci',
    year: 'Sophomore',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/alicejohnson',
  },
  {
    image: 'profileImg.jpg',
    name: 'John Doe',
    title: 'President',
    program: 'Compsci',
    year: 'Senior',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  {
    image: 'profileImg.jpg',
    name: 'John Doe',
    title: 'President',
    program: 'Compsci',
    year: 'Senior',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  {
    image: 'profileImg.jpg',
    name: 'Jane Smith',
    title: 'VIP',
    program: 'Compsci',
    year: 'Junior',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/janesmith',
  },
  {
    image: 'profileImg.jpg',
    name: 'Alice Johnson',
    title: 'SIP Director',
    program: 'Compsci',
    year: 'Sophomore',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/alicejohnson',
  },
  {
    image: 'profileImg.jpg',
    name: 'John Doe',
    title: 'President',
    program: 'Compsci',
    year: 'Senior',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  {
    image: 'profileImg.jpg',
    name: 'John Doe',
    title: 'President',
    program: 'Compsci',
    year: 'Senior',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  {
    image: 'profileImg.jpg',
    name: 'Jane Smith',
    title: 'VIP',
    program: 'Compsci',
    year: 'Junior',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/janesmith',
  },
  {
    image: 'profileImg.jpg',
    name: 'Alice Johnson',
    title: 'SIP Director',
    program: 'Compsci',
    year: 'Sophomore',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/alicejohnson',
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
          
        <h1 className="text-2xl text-black font-bold text-center">{member.name}</h1>
        <h2 className="text-lg  text-gray-800 font-semibold text-center">{member.title}</h2>
        <p className="text-md text-gray-500 font-semibold text-center mb-4">{member.year} - {member.program}</p>
          
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

const TeamCard: React.FC<TeamCardProps> = ({ image, name, title, onClick }) => (
  <div
    className="relative cursor-pointer overflow-hidden rounded-sm h-[24rem] w-full transition-all duration-300 ease-in-out hover:scale-110"
    onClick={onClick}
  >
    <img
      src={image}
      alt={name}
      className="w-11/12 h-5/6 object-cover shadow-xl"
    />
    <div className="absolute z-40 w-3/4 bottom-10 right-0 p-4 bg-gradient-to-r from-violet-200 to-pink-200 text-black rounded-sm shadow-xl">
      <div className="font-semibold text-xl">{name}</div>
      <div className="text-sm">{title}</div>
    </div>
  </div>
);

const Section: React.FC<{ members: TeamMember[]; onCardClick: (member: TeamMember) => void; }> = ({ members, onCardClick }) => (
  <section className="mb-8">
    <div className="flex justify-center">
      <div className="w-full mx-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {members.map((member, index) => (
          <TeamCard
            key={index}
            image={member.image}
            name={member.name}
            title={member.title}
            year={member.year}
            onClick={() => onCardClick(member)}
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
      <div
        className='relative w-full h-screen bg-cover bg-center'
        style={{ backgroundImage: "url('/overviewBg.jpg')" }}
      >
      <div className='absolute inset-0 bg-black bg-opacity-50 flex text-left items-center'>
        <div className='text-white px-4 ml-8'>
          <h1 className='text-4xl font-bold'>Meet the Minds Behind WCS</h1>
          <p className='mt-6 max-w-xl'>
            At Western Cyber Society (WCS), our team is shaping the future of technology, driving innovation in Artificial Intelligence (AI), Cybersecurity, and Web3. We are a community of passionate students dedicated to mastering the skills that are transforming industries like FinTech, Engineering, Medicine, and Law. Through collaborative projects, workshops, and competitions, our team empowers students to lead the next wave of technological advancement.
          </p>
        </div>
      </div>
      </div>
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
