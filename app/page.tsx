"use client"
import { useRouter } from "next/navigation";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useCallback, useEffect, useState } from "react";
import { FaInstagram, FaTiktok, FaLinkedin } from 'react-icons/fa';
import React from "react";

const boxes = [
  {
    subtitle: "IBM Launch",
    image: "bg-test.jpg",
    text: "Join us for the IBM Launch event, where groundbreaking innovations in AI, cloud computing, and quantum technology will be unveiled. Network with industry leaders and explore the future of tech.",
  },
  {
    subtitle: "Toronto Tech Expo",
    image: "bg-test.jpg",
    text: "Discover the latest trends in software, hardware, and digital innovation at the Toronto Tech Expo. This event will feature product demos, keynote speakers, and opportunities to connect with top companies.",
  },
  {
    subtitle: "FAANG Day",
    image: "bg-test.jpg",
    text: "Learn about career opportunities and cutting-edge technologies at FAANG Day, where representatives from Facebook, Amazon, Apple, Netflix, and Google will share insights on working at the world's leading tech giants.",
  },
  {
    subtitle: "WCS Dinner",
    image: "bg-test.jpg",
    text: "Celebrate the accomplishments of the Western Cyber Society at our annual dinner. Enjoy an evening of networking, guest speakers, and a discussion of upcoming initiatives in cybersecurity and tech.",
  },
];

const socials = [
  {
    platform: 'Instagram',
    name: 'westerncybersociety',
    handle: '@westerncybersociety',
    bio: 'Western Cyber Society (WCS)\nScience, Technology & Engineering\nLeading the future generation of AI, Cyber Security, and Web3.',
    profileUrl: 'https://www.instagram.com/westerncybersociety/',
    profileImage: 'wcsSocialLogo.png',
    color: 'bg-gradient-to-br from-pink-500 to-orange-500',
    Icon: FaInstagram
  },
  {
    platform: 'TikTok',
    name: 'westerncybersociety',
    handle: '@westerncybersociety',
    bio: 'Western Cyber Society\nShaping the future by leading advancements in Artificial Intelligence (AI), Cybersecurity, and Web3.',
    profileUrl: 'https://www.tiktok.com/@westerncybersociety',
    profileImage: 'wcsSocialLogo.png',
    color: 'bg-gradient-to-br from-slate-900 to-neutral-700',
    Icon: FaTiktok
  },
  {
    platform: 'LinkedIn',
    name: 'Western Cyber Society',
    handle: '@westerncybersociety',
    bio: 'Empowering the next generation of leaders in Artificial Intelligence (AI), Cyber Security, and Web3. #LaunchTheFuture',
    profileUrl: 'https://www.linkedin.com/company/western-cyber-society?originalSubdomain=ca',
    profileImage: 'wcsSocialLogo.png',
    color: 'bg-gradient-to-br from-sky-900 to-blue-400',
    Icon: FaLinkedin
  },
];

const formatBio = (bio: string) => {
  // Split bio by newline characters and map each line to a <span>
  return bio.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      <span className="text-sm text-white">{line}</span>
      <br />
    </React.Fragment>
  ));
};

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  const getToken = useCallback(async () => {
    try {
      const response = await fetch('/api/getToken', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      if (result) {
        setToken(result);
        console.log('Token fetched:', result); // Log the result directly
      } else {
        console.log('Token not found.');
      }
    } catch (error) {
      console.error('Failed to fetch token:', error);
    }
  }, []); // Remove token from dependencies to avoid unnecessary re-runs
  
  useEffect(() => {
    getToken();
  }, [getToken]); // Include getToken in the dependencies to ensure it's used correctly  

  return (
    <div>
      <Navbar />
      
      <div>
        <div className="flex justify-center">
          <video controls={false} autoPlay loop muted preload="none">
            <source src="placeHolderVid.mp4" type="video/mp4" />
            <track
              src="/path/to/captions.vtt"
              kind="subtitles"
              srcLang="en"
              label="English"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="flex justify-center space-x-4 px-5 py-20" style={ { backgroundColor: '#dad8c9' } }>
        {boxes.map((box, index) => (
          <div
  key={index}
  className="relative w-72 h-96 bg-gradient-to-r from-slate-900 to-darkBlue overflow-hidden transition-transform duration-500 transform group hover:scale-105 shadow-[0_4px_10px_5px_rgba(0,0,0,0.75)]"
>

          <img
            src={box.image}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover blur-none translate-x-0 translate-y-0 transition-all duration-700 group-hover:translate-x-72 group-hover:translate-y-96 group-hover:scale-150 group-hover:blur-xl"
          />

          <h3 className="absolute p-3 top-0 left-0 right-0 text-white text-lg font-semibold p-2 text-left z-10">
            {box.subtitle}
          </h3>
          <div className="absolute inset-0 flex items-center justify-center text-left text-white opacity-0 translate-x-32 transition-all delay-150 duration-300 group-hover:opacity-100 group-hover:translate-x-0 z-20">
            <div className="p-5">
              <p>
                {box.text}
              </p>
            </div>
          </div>
        </div>
      ))}
        </div>

        <div className="bg-white">
        <h2 className="text-4xl font-bold text-black pt-10 text-center">Be a Part of Our Community</h2>
        <h2 className="text-black text-sm mb-8 text-center">lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum</h2>
    <div className="flex justify-center px-5 space-x-4">
      {socials.map((social, index) => (
        <div key={index} className={`relative w-1/3 h-60 overflow-hidden group ${social.color} social-hover shadow-[0_4px_10px_5px_rgba(0,0,0,0.75)] shadow-gray-500 rounded`}>
  <a
    href={social.profileUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="absolute inset-0 flex flex-col p-5"
  >
    <div className="flex items-center">
      <img
        src={social.profileImage}
        alt={`${social.platform} logo`}
        className="w-16 h-16 rounded-full border-2 border-white"
      />
      <div className="ml-4 text-white flex flex-col">
        <h3 className="text-xl font-bold">{social.name}</h3>
        <p className="text-lg">{social.handle}</p>
      </div>
    </div>
    <p className="text-sm text-white mt-4">{formatBio(social.bio)}</p>
    <div className="absolute bottom-4 right-4 text-white text-3xl">
      <social.Icon />
    </div>

    <span className="absolute bottom-[-30px] left-4 text-white text-lg font-semibold transition-all duration-700 ease-in-out group-hover:bottom-4">
      Visit <i className="fa-solid fa-arrow-right"></i>
    </span>
  </a>
</div>

      ))}
    </div>
  </div>
  
      {!token && (
        <div className="flex flex-col items-center justify-center text-black mt-16">
        <h1 className="text-center text-2xl font-bold">Join Us?</h1>
        <p className="w-2/4 text-center">We are a dynamic team of innovators driven by a passion for excellence. 
          We deeply value skill, imagination, and the pursuit of elegant solutions</p>
        <button className="mt-3 tracking-wider bg-violet-800 text-white text-xl py-2 px-4 rounded-lg shadow-md hover:bg-violet-900 hover:scale-105 transition duration-300 ease-in-out"
        onClick={() => router.push("/sign-up")}>
          Register
        </button>
        <p className="mt-3 mb-10">Already have an account? <a href="/sign-in" className="text-blue-500"><u>Sign In</u></a></p>
      </div>
      )}
      <Footer />
    </div>
  );
}


