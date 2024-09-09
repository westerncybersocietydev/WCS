"use client";
import React from 'react';

type TeamCardProps = {
  image: string;
  name: string;
  title: string;
  year: string;
  description: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  onClick: () => void;
};

const TeamCard: React.FC<TeamCardProps> = ({ image, name, title, year, onClick }) => (
  <div onClick={onClick} className="cursor-pointer p-4 mt-2 rounded-lg hover:shadow-xl transition-shadow duration-300">
    <img src={image} alt={name} className="w-24 h-24 rounded-full mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-center mb-2">{name}</h3>
    <p className="text-center text-gray-600">{title} - {year}</p>
  </div>
);

export default TeamCard;
