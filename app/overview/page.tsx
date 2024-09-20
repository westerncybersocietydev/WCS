"use client"
import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function Overview() {
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
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">About Us</h1>
              <p className="text-lg md:text-xl leading-relaxed">
                SIPs have been meticulously crafted with industry professionals to equip coordinators with essential skills. Dive into hands-on experience with high-demand software and skills through WCS Projects.
              </p>
            </div>
          </div>
        </section>

      {/* Mission, Vision, Focus Statements */}
      <div className="py-16 mx-16 from-gray-100 to-gray-200">
        <h2 className="mb-6 text-2xl font-extrabold text-gray-700 text-center">Who We Are</h2>

        <div className="px-6 grid gap-24">
          {/* Mission Section */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <h2 className="text-5xl font-extrabold text-gray-600">Our Mission</h2>
            <p className="mt-6 text-gray-500">
              To create innovative solutions that empower communities, enhance connectivity, and foster sustainable growth. 
              By leveraging cutting-edge technologies, we aim to drive positive change that benefits individuals and societies alike.
            </p>
          </div>

          {/* Vision Section */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <p className="mt-6 text-gray-500">
              To be a global leader in transformative technology, creating a future where seamless connectivity and sustainable innovation improve lives across the world. 
              We envision a world where technology works harmoniously with nature and human progress, creating solutions that are not only groundbreaking but also environmentally responsible. 
            </p>
            <h2 className="text-5xl font-extrabold text-gray-600 text-right">Our Vision</h2>
          </div>

          {/* Focus Section */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <h2 className="text-5xl font-extrabold text-gray-600">Our Focus</h2>
            <p className="mt-6 text-gray-500">
              Western Cyber Society is dedicated to cultivating the next generation of tech leaders by focusing on excellence in key sectors such as cybersecurity, artificial intelligence, and data science. 
              We provide students with hands-on experience, mentorship, and cutting-edge resources to help them thrive in the rapidly evolving world of technology.
            </p>
          </div>
        </div>

      </div>

      <div>
        <h2 className="mt-10 mb-6 text-2xl font-extrabold text-gray-700 text-center">Focus Areas</h2>

        <div className="mb-10 flex flex-wrap w-4/6 mx-auto">
        <div className="w-1/2 p-5">
          <div className="h-[30vw] w-[28vw] flex flex-col group transition-all duration-300 ease-in-out cursor-pointer">
            {/* Top 3/4 section with purple background */}
            <div
              className="rounded-t-xl h-2/3 flex justify-center items-center transition-all duration-300 ease-in-out"
              style={{
                backgroundImage: 'url(/landing1.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Image centered in the top section */}
              <h1 className="text-7xl text-gray-800 font-extrabold">AI</h1>
            </div>

            {/* Bottom 1/4 section with heading and text */}
            <div className="bg-white rounded-b-xl text-center p-4 flex flex-col justify-center transition-all duration-400 ease-in-out h-1/3 group-hover:h-4/6">
              <h2 className="text-lg text-gray-700 font-bold">What is it?</h2>
              
              {/* Conditional rendering based on hover state */}
              <p className="text-xs mx-6 text-gray-500 transition-opacity duration-300 ease-in-out group-hover:hidden">
                Artificial Intelligence simulates human intelligence processes through machines, 
                enabling tasks such as learning, reasoning, and self-correction.
              </p>
              
              <p className="text-xs mx-2 text-gray-500 transition-opacity duration-300 ease-in-out hidden group-hover:block">
                Artificial Intelligence refers to the simulation of human intelligence processes by machines, 
                especially computer systems. This includes learning (the acquisition of information and rules 
                for using it), reasoning (using rules to reach approximate or definite conclusions), and self-correction.
              </p>
            </div>
          </div>
        </div>

        <div className="w-1/2 p-5">
          <div className="h-[30vw] w-[28vw] flex flex-col group transition-all duration-300 ease-in-out cursor-pointer">
            {/* Top 3/4 section with purple background */}
            <div
              className="rounded-t-xl h-2/3 flex justify-center items-center transition-all duration-300 ease-in-out"
              style={{
                backgroundImage: 'url(/landing1.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Image centered in the top section */}
              <div className='flex flex-col text-center text-5xl'>
              <h1 className="text-gray-800 font-extrabold">CYBER</h1>
              <h1 className="text-gray-800 font-extrabold">SECURITY</h1>
              </div>
            </div>

            {/* Bottom 1/4 section with heading and text */}
            <div className="bg-white rounded-b-xl text-center p-4 flex flex-col justify-center transition-all duration-400 ease-in-out h-1/3 group-hover:h-4/6">
              <h2 className="text-lg text-gray-700 font-bold">What is it?</h2>
              
              {/* Conditional rendering based on hover state */}
              <p className="text-xs mx-6 text-gray-500 transition-opacity duration-300 ease-in-out group-hover:hidden">
              Cybersecurity protects systems, networks, and programs from digital attacks, ensuring the integrity and confidentiality of sensitive information.
              </p>
              
              <p className="text-xs mx-2 text-gray-500 transition-opacity duration-300 ease-in-out hidden group-hover:block">
              Cybersecurity involves the practice of protecting systems, networks, and programs from digital attacks, theft, and damage. It encompasses a wide range
               of technologies, processes, and practices designed to safeguard sensitive data and ensure the integrity, confidentiality, and availability of information.
              </p>
            </div>
          </div>
        </div>

        <div className="w-1/2 p-5">
          <div className="h-[30vw] w-[28vw] flex flex-col group transition-all duration-300 ease-in-out cursor-pointer">
            {/* Top 3/4 section with purple background */}
            <div
              className="rounded-t-xl h-2/3 flex justify-center items-center transition-all duration-300 ease-in-out"
              style={{
                backgroundImage: 'url(/landing1.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Image centered in the top section */}
              <h1 className="text-7xl text-gray-800 font-extrabold">WEB3</h1>
            </div>

            {/* Bottom 1/4 section with heading and text */}
            <div className="bg-white rounded-b-xl text-center p-4 flex flex-col justify-center transition-all duration-400 ease-in-out h-1/3 group-hover:h-4/6">
              <h2 className="text-lg text-gray-700 font-bold">What is it?</h2>
              
              {/* Conditional rendering based on hover state */}
              <p className="text-xs mx-6 text-gray-500 transition-opacity duration-300 ease-in-out group-hover:hidden">
                Web3 represents the next generation of the internet, emphasizing decentralized applications built on blockchain technology
              </p>
              
              <p className="text-xs mx-2 text-gray-500 transition-opacity duration-300 ease-in-out hidden group-hover:block">
                Web3 refers to the next generation of the internet, characterized by decentralized applications (dApps) built on blockchain technology. 
                It aims to create a more user-centric web by enabling individuals to own their data, interact directly with services without intermediaries, and participate in decentralized finance (DeFi) and governance models.
              </p>
            </div>
          </div>
        </div>


        <div className="w-1/2 p-5">
          <div className="h-[30vw] w-[28vw] flex flex-col group transition-all duration-300 ease-in-out cursor-pointer">
            {/* Top 3/4 section with purple background */}
            <div
              className="rounded-t-xl h-2/3 flex justify-center items-center transition-all duration-300 ease-in-out"
              style={{
                backgroundImage: 'url(/landing1.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Image centered in the top section */}
              <div className='flex flex-col text-center text-6xl'>
                <h1 className="text-gray-800 font-extrabold">MAIN</h1>
                <h1 className="text-gray-800 font-extrabold">FRAME</h1>
              </div>
            </div>

            {/* Bottom 1/4 section with heading and text */}
            <div className="bg-white rounded-b-xl text-center p-4 flex flex-col justify-center transition-all duration-400 ease-in-out h-1/3 group-hover:h-4/6">
              <h2 className="text-lg text-gray-700 font-bold">What is it?</h2>
              
              {/* Conditional rendering based on hover state */}
              <p className="text-xs mx-6 text-gray-500 transition-opacity duration-300 ease-in-out group-hover:hidden">
                Mainframes are powerful computers designed for critical applications and large-scale transaction processing, primarily used by large organizations.
              </p>
              
              <p className="text-xs mx-2 text-gray-500 transition-opacity duration-300 ease-in-out hidden group-hover:block">
                Mainframes are powerful computers primarily used by large organizations for critical applications, bulk data processing, and large-scale transaction 
                processing. Known for their high reliability, scalability, and security, mainframes support thousands of users simultaneously and are integral to various industries.</p>
            </div>

          
        </div>
        </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
