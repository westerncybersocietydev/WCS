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
        <div className='flex flex-col w-full h-full'>
            <div className='flex mx-8 my-8 space-x-10'>
            <div className='bg-black rounded-xl w-1/2 h-[48vw] shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]'>
              <img src='/overview.jpg' alt='Our Mission' className='object-cover w-full h-full rounded-xl' />
            </div>
              <div className='bg-violet-950 rounded-xl p-16 text-left w-1/2 shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]'>
                <h2 className="text-8xl font-extrabold text-white">Our Mission</h2>
                <p className="mt-6 text-xl font-semibold text-white">
                  To create innovative solutions that empower communities, enhance connectivity, and foster sustainable growth. 
                  By leveraging cutting-edge technologies, we aim to drive positive change that benefits individuals and societies alike.
                </p>
              </div>
            </div>
        </div>

        <div className='flex flex-col w-full h-full'>
            <div className='flex mx-8 my-8 space-x-10'>
            <div className='bg-violet-950 rounded-xl p-16 text-left w-1/2 shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]'>
                <h2 className="text-8xl font-extrabold text-white">Our Vision</h2>
                <p className="mt-6 text-xl font-semibold text-white">
                To be a global leader in transformative technology, creating a future where seamless connectivity and sustainable innovation improve lives across the world. 
                We envision a world where technology works harmoniously with nature.</p>
              </div>
            <div className='bg-black rounded-xl w-1/2 h-[48vw] shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]'>
              <img src='/overview.jpg' alt='Our Mission' className='object-cover w-full h-full rounded-xl' />
            </div>
            </div>
        </div>

        <div className='flex flex-col w-full h-full'>
            <div className='flex mx-8 my-8 space-x-10'>
            <div className='bg-black rounded-xl w-1/2 h-[48vw] shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]'>
              <img src='/overview.jpg' alt='Our Mission' className='object-cover w-full h-full rounded-xl' />
            </div>
              <div className='bg-violet-950 rounded-xl p-16 text-left w-1/2 shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]'>
                <h2 className="text-8xl font-extrabold text-white">Our Focus</h2>
                <p className="mt-6 text-xl font-semibold text-white">
                Western Cyber Society is dedicated to cultivating the next generation of tech leaders by focusing on excellence in key sectors such as cybersecurity, artificial intelligence, and data science. 
                We provide students with hands-on experience, and mentorship.</p>
              </div>
            </div>
        </div>

        <div className='flex w-full h-full'>
          
    <div className='flex flex-col items-center bg-violet-950 rounded-xl shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)] mx-8 my-8'>
    <h1 className="text-5xl font-extrabold text-center text-white mt-10 mb-4">
            Our Focus Areas
        </h1>
        <div className='flex space-x-2 w-full text-center'>
            <div className='flex flex-col items-center rounded-xl p-8 w-full'>
                <img src='/overview.jpg' alt='Our Mission' className='object-cover w-36 h-36 rounded-full' />
                <h2 className="mt-6 text-xl font-extrabold text-white">AI</h2>
                <p className="mt-3 text-xs text-white">
                    Western Cyber Society is dedicated to cultivating the next generation of tech leaders by focusing on excellence in key sectors such as cybersecurity, artificial intelligence, and data science. 
                </p>
            </div>
            <div className='flex items-end mb-8'>
            <div className='border-l-2 rounded border-white h-1/3'></div>
            </div>

            <div className='flex flex-col items-center rounded-xl p-8 w-full '>
                <img src='/overview.jpg' alt='Our Mission' className='object-cover w-36 h-36 rounded-full' />
                <h2 className="mt-6 text-xl font-extrabold text-white">Cybersecurity</h2>
                <p className="mt-3 text-xs text-white">
                    Western Cyber Society is dedicated to cultivating the next generation of tech leaders by focusing on excellence in key sectors such as cybersecurity, artificial intelligence, and data science. 
                </p>
            </div>
            <div className='flex items-end mb-8'>
            <div className='border-l-2 rounded border-white h-1/3'></div>
            </div>

            <div className='flex flex-col items-center rounded-xl p-8 w-full '>
                <img src='/overview.jpg' alt='Our Mission' className='object-cover w-36 h-36 rounded-full' />
                <h2 className="mt-6 text-xl font-extrabold text-white">Web3</h2>
                <p className="mt-3 text-xs text-white">
                    Western Cyber Society is dedicated to cultivating the next generation of tech leaders by focusing on excellence in key sectors such as cybersecurity, artificial intelligence, and data science. 
                </p>
            </div>
            <div className='flex items-end mb-8'>
            <div className='border-l-2 rounded border-white h-1/3'></div>
            </div>

            <div className='flex flex-col items-center rounded-xl p-8 w-full '>
                <img src='/overview.jpg' alt='Our Mission' className='object-cover w-36 h-36 rounded-full' />
                <h2 className="mt-6 text-xl font-extrabold text-white">Mainframe</h2>
                <p className="mt-3 text-xs text-white">
                    Western Cyber Society is dedicated to cultivating the next generation of tech leaders by focusing on excellence in key sectors such as cybersecurity, artificial intelligence, and data science. 
                </p>
            </div>

        </div>
    </div>
</div>
      
      <Footer />
    </div>
  )
}
