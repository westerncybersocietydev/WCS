"use client";
import React from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';

export default function Sponsorships() {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <img src='/construction1.png' className='w-[20vw]' />
        <h1 className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent text-4xl font-bold">Coming Soon...</h1>
      </div>
      <Footer />
    </div>
  );
}