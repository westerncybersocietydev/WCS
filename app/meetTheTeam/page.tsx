"use client";
import React, { useState } from 'react';
import TeamCard from '../components/teamCard';
import Navbar from '../components/navbar';
import Modal from '../components/memberModal';
import Footer from '../components/footer';

type TeamMember = {
  image: string;
  name: string;
  title: string;
  program: string;
  year: string;
  description: string;
  email?: string;
  linkedin?: string;
};

const teamData: TeamMember[] = [
  {
    image: '/defaultPfp.png',
    name: 'John Doe',
    title: 'President',
    program: 'Compsci',
    year: 'Senior',
    description: 'Leading the team with vision and dedication.',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  {
    image: '/defaultPfp.png',
    name: 'John Doe',
    title: 'President',
    program: 'Compsci',
    year: 'Senior',
    description: 'Leading the team with vision and dedication.',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  {
    image: '/defaultPfp.png',
    name: 'Jane Smith',
    title: 'VIP',
    program: 'Compsci',
    year: 'Junior',
    description: 'Our go-to person for high-level insights and guidance.',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/janesmith',
  },
  {
    image: '/defaultPfp.png',
    name: 'Alice Johnson',
    title: 'SIP Director',
    program: 'Compsci',
    year: 'Sophomore',
    description: 'Overseeing SIP projects with expertise and enthusiasm.',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/alicejohnson',
  },
  {
    image: '/defaultPfp.png',
    name: 'John Doe',
    title: 'President',
    program: 'Compsci',
    year: 'Senior',
    description: 'Leading the team with vision and dedication.',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  {
    image: '/defaultPfp.png',
    name: 'John Doe',
    title: 'President',
    program: 'Compsci',
    year: 'Senior',
    description: 'Leading the team with vision and dedication.',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  {
    image: '/defaultPfp.png',
    name: 'Jane Smith',
    title: 'VIP',
    program: 'Compsci',
    year: 'Junior',
    description: 'Our go-to person for high-level insights and guidance.',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/janesmith',
  },
  {
    image: '/defaultPfp.png',
    name: 'Alice Johnson',
    title: 'SIP Director',
    program: 'Compsci',
    year: 'Sophomore',
    description: 'Overseeing SIP projects with expertise and enthusiasm.',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/alicejohnson',
  },
  {
    image: '/defaultPfp.png',
    name: 'John Doe',
    title: 'President',
    program: 'Compsci',
    year: 'Senior',
    description: 'Leading the team with vision and dedication.',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  {
    image: '/defaultPfp.png',
    name: 'John Doe',
    title: 'President',
    program: 'Compsci',
    year: 'Senior',
    description: 'Leading the team with vision and dedication.',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  {
    image: '/defaultPfp.png',
    name: 'Jane Smith',
    title: 'VIP',
    program: 'Compsci',
    year: 'Junior',
    description: 'Our go-to person for high-level insights and guidance.',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/janesmith',
  },
  {
    image: '/defaultPfp.png',
    name: 'Alice Johnson',
    title: 'SIP Director',
    program: 'Compsci',
    year: 'Sophomore',
    description: 'Overseeing SIP projects with expertise and enthusiasm.',
    email: 'test@gmail.com',
    linkedin: 'https://linkedin.com/in/alicejohnson',
  },
];

const Section: React.FC<{ members: TeamMember[]; onCardClick: (member: TeamMember) => void; }> = ({ members, onCardClick }) => (
  <section className="mb-8">
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {members.map((member, index) => (
          <TeamCard
            key={index}
            image={member.image}
            name={member.name}
            title={member.title}
            year={member.year}
            description={member.description}
            email={member.email || ''}
            linkedin={member.linkedin || ''}
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
            <h1 className='text-4xl'><strong>Meet The Team</strong></h1>
            <h2 className='mt-3 mb-10'>WCS is proud to present our incredible 2024-2025 student team.</h2>
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
