"use client"
import { useRouter } from "next/navigation";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useCallback, useEffect, useState } from "react";
import { FaInstagram, FaTiktok, FaLinkedin } from 'react-icons/fa';
import React from "react";

interface FAQItem {
  question: string;
  answer: string;
}

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

const faqs: FAQItem[] = [
  {
    question: "What is Fashun AI?",
    answer: "Fashun AI is a fashion recommender system that helps users find the perfect outfits based on their preferences and trends."
  },
  {
    question: "How does CookieGram work?",
    answer: "CookieGram is a food social media web app where users can share and explore recipes, as well as connect with other food enthusiasts."
  },
  {
    question: "What technologies do you use?",
    answer: "We primarily use React, Next.js, and Tailwind CSS for front-end development, along with Node.js and Express for backend APIs."
  },
  {
    question: "How can I contribute to the project?",
    answer: "You can contribute by joining our GitHub repository and submitting pull requests or issues."
  }
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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
        if (token) {
          console.log("logged in.")
        }
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
      
      <div className="relative">

      <div className="flex flex-col items-center justify-center">
        <h1 className="pt-16 text-black text-center tracking-widest font-bold max-w-lg text-5xl">
          Unlock the Power of WCS With Mango Bloom
        </h1>
        <h1 className="mt-3 text-gray-700 text-center tracking-wide text-sm">
          The #1 tech club in Western with just 1 year of history.
        </h1>
        <button className="mt-6 tracking-wide rounded-full font-semibold text-white
                  border-2 font-bold bg-gradient-to-r from-violet-500 to-purple-500 hover:scale-105 hover:bg-gradient-to-r hover:from-violet-800 hover:to-purple-800
                  px-10 py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
        onClick={() => router.push("/sign-up")}>
          Register
        </button>
        <p className="mt-1 text-gray-700 text-center tracking-wide text-sm mb-10">Already have an account? <a href="/sign-in" className="text-blue-500"><u>Sign In</u></a></p>
      </div>

      <div className="flex justify-center">
      <video controls={false} autoPlay loop muted preload="none" className="w-full h-[30vw] object-cover">
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

    <div
  className="relative bg-cover bg-center"
  style={{ backgroundImage: 'url("/landing2.png")' }}
>
  <h2 className="text-4xl font-bold text-black pt-10 text-center">
    Join us at our featured events for 2025
  </h2>
  <h2 className="text-black text-sm text-center">
    lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
  </h2>
  <div className="flex justify-center space-x-4 px-5 py-10">
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
            <p>{box.text}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
        
        <div className="mb-10">
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
  
  <div className="w-full flex flex-col items-center h-[32vw] mx-auto bg-cover bg-center" style={{ backgroundImage: 'url(/landing3.png)' }}>
  <h1 className="text-4xl font-bold text-black pt-10 text-center mb-5">Frequently Asked Questions</h1>
  <div className="flex flex-col items-center w-5/6 bg-white rounded-lg shadow-[0_1px_4px_1px_rgba(0,0,0,0.75)]">
    {faqs.map((faq, index) => (
      <div key={index} className="w-full border-b-2 border-gray-300 rounded-lg">
        <button
          onClick={() => toggleAnswer(index)}
          className="w-full text-md flex justify-between items-center text-black font-bold text-left py-2 px-4 rounded-t-md transition-all duration-500"
        >
          {faq.question}
          <span className="ml-2">
            <i className="fa-solid fa-angle-down"></i>
          </span>
        </button>
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${activeIndex === index ? 'max-h-screen' : 'max-h-0'}`}
        >
          <p className="ml-3 text-sm p-4 text-gray-600">{faq.answer}</p>
        </div>
      </div>
    ))}
  </div>
</div>

      <Footer />
    </div>
  );
}


