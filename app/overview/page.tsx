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
          className="mt-40 md:mt-16 relative w-full h-[55vw] md:h-[30vw] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/projectBg.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
              <h1 className="text-xl md:text-5xl md:text-6xl font-bold mb-6 leading-tight">About Us</h1>
              <p className="text-sm md:text-lg md:text-xl leading-relaxed">
                We are a passionate team dedicated to fostering innovation and collaboration in the tech community. Our mission is to empower individuals through knowledge sharing and hands-on experiences in cutting-edge technology.
              </p>
            </div>
          </div>
        </section>

      {/* Mission, Vision, Focus Statements */}
        <div className='flex flex-col w-full h-full'>
            <div className='flex flex-col md:flex-row gap-4 m-8 md:space-x-10'>

            <div className='bg-black rounded-xl md:w-1/2 h-[90vw] md:h-[56vw] shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]'>
              <img src='/mission.jpeg' alt='Our Mission' className='object-cover w-full h-full rounded-xl'/>
            </div>

              <div className='flex flex-col mx-auto text-center md:text-left justify-center bg-violet-950 rounded-xl p-10 md:w-1/2 shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]'>
                <h2 className="text-4xl md:text-7xl lg:text-9xl font-extrabold text-white">Our</h2>
                <h2 className="text-4xl md:text-7xl lg:text-9xl font-extrabold text-white">Mission</h2>
                <p className="mt-6 text-md md:text-2xl font-semibold text-white">
                  To create innovative solutions that empower communities, enhance connectivity, and foster sustainable growth. 
                  By leveraging cutting-edge technologies, we aim to drive positive change that benefits individuals and societies alike.
                </p>
              </div>

            </div>
        </div>

        <div className='flex flex-col w-full h-full'>
            <div className='flex flex-col md:flex-row gap-4 m-8 md:space-x-10'>

              <div className='flex flex-col mx-auto text-center md:text-left bg-violet-950 justify-center rounded-xl p-16 md:w-1/2 shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]'>
                <h2 className="text-4xl md:text-7xl lg:text-9xl font-extrabold text-white">Our</h2>
                <h2 className="text-4xl md:text-7xl lg:text-9xl font-extrabold text-white">Vision</h2>
                <p className="mt-6 text-md md:text-2xl font-semibold text-white">
                To be a global leader in transformative technology, creating a future where seamless connectivity and sustainable innovation improve lives across the world. 
                We envision a world where technology works harmoniously with nature.</p>
              </div>

              <div className='bg-black rounded-xl md:w-1/2 h-[90vw] md:h-[56vw] shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]'>
              <img src='/vision.jpeg' alt='Our Mission' className='object-cover w-full h-full rounded-xl' />
            </div>
            
            </div>
        </div>

        <div className='flex flex-col w-full h-full'>
            <div className='flex flex-col md:flex-row gap-4 m-8 md:space-x-10'>
            <div className='bg-black rounded-xl md:w-1/2 h-[90vw] md:h-[56vw] shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]'>
              <img src='/focus.jpeg' alt='Our Mission' className='object-cover w-full h-full rounded-xl' />
            </div>
              <div className='flex flex-col mx-auto text-center md:text-left justify-center bg-violet-950 rounded-xl p-16 md:w-1/2 shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]'>
                <h2 className="text-4xl md:text-7xl lg:text-9xl font-extrabold text-white">Our</h2>
                <h2 className="text-4xl md:text-7xl lg:text-9xl font-extrabold text-white">Focus</h2>
                <p className="mt-6 text-md md:text-2xl font-semibold text-white">
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
        <div className='flex flex-col md:flex-row gap-2 md:gap-0 md:space-x-1 w-full text-center'>
            <div className='flex flex-col items-center rounded-xl p-5 w-full'>
                <img src='/ai.jpg' alt='Our Mission' className='object-cover w-32 h-32 rounded-full' />
                <h2 className="mt-6 text-2xl font-extrabold text-white">AI</h2>
                <p className="mt-3 text-md text-white">
                Explore our innovative AI projects that harness machine learning algorithms to create intelligent solutions, enhancing decision-making and efficiency across various domains. 
                </p>
            </div>

            <div className='flex flex-col items-center rounded-xl p-5 w-full '>
                <img src='/cs.jpg' alt='Our Mission' className='object-cover w-32 h-32 rounded-full' />
                <h2 className="mt-6 text-2xl font-extrabold text-white">Cybersecurity</h2>
                <p className="mt-3 text-md text-white">
                Dive into our cybersecurity initiatives focused on protecting digital assets and ensuring safe online experiences through cutting-edge techniques and proactive threat management.
                </p>
            </div>

            <div className='flex flex-col items-center rounded-xl p-5 w-full '>
                <img src='/web3.jpg' alt='Our Mission' className='object-cover w-32 h-32 rounded-full' />
                <h2 className="mt-6 text-2xl font-extrabold text-white">Web3</h2>
                <p className="mt-3 text-md text-white">
                Discover our Web3 projects that aim to revolutionize the internet by promoting decentralized applications and empowering users with greater control over their data and online interactions.
                </p>
            </div>

            <div className='flex flex-col items-center rounded-xl p-5 w-full '>
                <img src='/mainframe.png' alt='Our Mission' className='object-cover w-32 h-32 rounded-full' />
                <h2 className="mt-6 text-2xl font-extrabold text-white">Mainframe</h2>
                <p className="mt-3 text-md text-white">
                Learn about our mainframe projects that leverage robust computing power to support large-scale data processing and enterprise solutions, ensuring reliability and security in critical business operations.
                </p>
            </div>

        </div>
    </div>
</div>
      
      <Footer />
    </div>
  )
}
