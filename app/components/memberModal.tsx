"use client";
import React, { useRef } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  member: {
    image: string;
    name: string;
    title: string;
    program: string;
    year: string;
    description: string;
    email?: string;
    linkedin?: string;
    twitter?: string;
  };
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, member }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg w-1/2 flex"
        onClick={(e) => e.stopPropagation()} // Prevent click events on the modal content from bubbling up to the overlay
      >
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900">X</button>
        <div className="flex-shrink-0 w-1/3">
          <img src={member.image} alt={member.name} className="w-full h-auto rounded-full" />
        </div>
        <div className="flex-1 ml-4 a">
        <div className="flex items-center h-full ml-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">{member.name}</h2>
          <p>{member.title}</p>
          <p>{member.program} - {member.year}</p>
          <p className="mb-4">{member.description}</p>
          <div className='flex gap-3 text-2xl'>
            {member.email && <p className="mb-2"><i className="fa-solid fa-envelope cursor-pointer"></i></p>}
            {member.linkedin && <p className="mb-2"><i className="fa-brands fa-linkedin cursor-pointer"></i></p>}
          </div>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
