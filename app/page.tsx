"use client"
import { useRouter } from "next/navigation";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { useCallback, useEffect, useState } from "react";
import { FaInstagram, FaTiktok, FaLinkedin } from 'react-icons/fa';
import React from "react";
import { useUser } from "./context/UserContext";
import { motion } from "framer-motion"

interface FAQItem {
  question: string;
  answer: string;
}

const boxes = [
  {
    image: "IBMN.png",
    text: "An evening of innovation and technology exploration hosted by IBM, showcasing their latest advancements and opportunities.",
  },
  {
    image: "VIPD.png",
    text: "An exclusive networking event bringing together top industry leaders for insightful discussions over a gourmet meal.",
  },
  {
    image: "FD.png",
    text: "A day dedicated to learning from and connecting with industry professionals from Facebook, Amazon, Apple, Netflix, and Google.",
  },
  {
    image: "TTE4.png",
    text: "A dynamic tech showcase featuring cutting-edge innovations and startups from across Toronto's vibrant tech ecosystem.",
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
    question: "Do I need to have a club membership to attend events?",
    answer: "While most events are open to all attendees, membership offers discounts on event registrations and access to exclusive events held throughout the year."
  },
  {
    question: "What kinds of resources does WCS provide for students?",
    answer: "WCS equips students with in-demand skills in AI, Cyber Security, Mainframe, and Web3 through workshops and competitions, while facilitating networking events."
  },
  {
    question: "When do SIP project applications open? How do I apply?",
    answer: "We are excited to announce that project applications are now open! If you're interested in applying, please visit the SIP Projects page located under the About Us section."
  },
  {
    question: "How can I stay updated on WCS events and announcements?",
    answer: "To stay updated with WCS, create an account on our website to receive email notifications about upcoming events, and be sure to follow us to follow us on our social media for the latest updates!"
  },
  {
    question: "Is prior experience with the required technology necessary to apply for projects?",
    answer: "No, you don't need prior experience. If selected, you’ll receive the time and resources to learn. What we value most is your enthusiasm and willingness to engage with the work."
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
  
  const { user } = useUser();

  const fullText = "Welcome to Western Cyber Society";
  const animatedPart = fullText.slice(-5);  // The last 10 characters
  const staticPart = fullText.slice(0, -5); // The first part (static)

  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState<number>(300 - Math.random() * 100);
  const period: number = 3000;

  useEffect(() => {
      const ticker = setInterval(() => {
          tick();
      }, delta);

      return () => { clearInterval(ticker); };
  }, [text]);

  const tick = () => {
      const updatedText = isDeleting ? animatedPart.substring(0, text.length - 1) : animatedPart.substring(0, text.length + 1);

      setText(updatedText);

      if (isDeleting) {
          setDelta(prevDelta => prevDelta / 2);
      }

      if (!isDeleting && updatedText === animatedPart) {
          setIsDeleting(true);
          setDelta(period);
      } else if (isDeleting && updatedText === '') {
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
          setDelta(500);
      }
  };
  
  const getProfileData = useCallback(async () => {
    if (!user?.userId) {
      console.log("Error getting user id.")
      return;
    }
  }, [user?.userId]);
  
  useEffect(() => {
    getProfileData();
  }, [getProfileData]); // Include getToken in the dependencies to ensure it's used correctly  

  return (
    <div>
      <Navbar />
      
      <div className="relative">

      <div className="flex flex-col items-center justify-center  mb-10">
        <h1 className="mt-16 pt-16 text-black text-center tracking-widest font-bold max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl text-2xl md:text-5xl lg:text-6xl xl:text-8xl">
        {staticPart}<span className="wrap">{text}</span>
        </h1>
        <h1 className="mt-3 text-sm md:text-md max-w-2xl md:max-w-xl lg:max-w-xl xl:max-w-4xl text-gray-700 text-center tracking-wide text-sm">
          Recognized as the leading tech club at Western University, we prioritize maximizing value and delivering exceptional returns on investment for our members.
        </h1>
        {!user && (
        <>
          <button className="mt-6 tracking-widest rounded-full font-semibold text-white
            border-2 font-bold bg-gradient-to-r from-violet-500 to-purple-500 hover:scale-105 hover:bg-gradient-to-r hover:from-violet-800 hover:to-purple-800
            px-14 py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
            onClick={() => router.push("/sign-up")}>
            Register
          </button>
          <p className="mt-1 text-gray-700 text-center tracking-wide text-sm">
            Already have an account? <a href="/sign-in" className="text-blue-500 hover:underline">Sign In</a>
          </p>
        </>
      )}
      </div>
        
      <motion.div
      initial={ { y:50, opacity: 0, } }
      whileInView={ { y: 0, opacity: 1 } }
      transition={{ type: "tween", duration: 0.5 }}
      viewport={ { margin: '-100px', once: true } }
      className="flex justify-center">
      <video controls={false} autoPlay loop muted preload="none" className="w-full h-[40vw] object-cover">
        <source src="wcs2.mp4" type="video/mp4" />
        <track
          src="/path/to/captions.vtt"
          kind="subtitles"
          srcLang="en"
          label="English"
        />
        Your browser does not support the video tag.
      </video>
      </motion.div>

    </div>

    <div
  className="relative bg-cover bg-center"
  style={{ backgroundImage: 'url("/landing2.png")' }}
>
  <motion.h2
      initial={ { opacity: 0, } }
      whileInView={ { opacity: 1 } }
      viewport={ { margin: '-100px', once: true } }  
  className="text-2xl md:text-4xl 2xl:text-5xl font-bold text-black pt-10 text-center">
    Join us at our featured events for 2025
  </motion.h2>
  <motion.h2
      initial={ { opacity: 0, } }
      whileInView={ { opacity: 1 } }
      viewport={ { margin: '-100px', once: true } }   
 className="text-black text-sm xl:text-lg 2xl:text-xl text-center">
   Participate in our distinguished events, designed to foster innovation, facilitate collaboration, and connect you with industry leaders
  </motion.h2>
  <div className="flex flex-wrap gap-4 justify-center items-center md:space-x-2 px-5 py-10">
  {boxes.map((box, index) => (
  <motion.div
  initial={{ y: 100, opacity: 0 }} // Start from right (x: 100) and invisible
  whileInView={{ y: 0, opacity: 1 }} // Slide to its original position (x: 0) and become visible
  transition={{ type: "tween", duration: 0.5 }} // You can adjust the transition properties
  viewport={{ margin: "-50px" }}
    key={index}
    className="relative bg-black cursor-pointer w-48 h-64 md:w-1/5 md:h-[30vw] overflow-hidden transition-transform duration-500 transform group hover:scale-105 shadow-[0_4px_10px_5px_rgba(0,0,0,0.75)]"
  >
    <div className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:blur-lg group-hover:opacity-90" style={{ backgroundImage: `url(${box.image})` }} />
    <img
      src={box.image}
      alt={`Image ${index + 1}`}
      className="w-full h-full object-cover transition-all duration-700 group-hover:translate-x-full group-hover:translate-y-full group-hover:blur-xl group-hover:scale-150"
    />
    <div className="absolute text-xs md:text-base lg:text-md xl:text-xl inset-0 flex items-center justify-center text-left text-white opacity-0 translate-x-32 transition-all delay-150 duration-300 group-hover:opacity-100 group-hover:translate-x-0 z-20">
      <div className="p-5">
        <p>{box.text}</p>
      </div>
    </div>
    <span className="absolute bottom-[-30px] right-4 text-white text-xs font-semibold transition-all duration-700 ease-in-out group-hover:bottom-4">
      View Details <i className="fa-solid fa-arrow-right"></i>
    </span>
  </motion.div>
))}


  </div>
</div>
        
        <div className="mb-10">
        <motion.h2
      initial={ { opacity: 0, } }
      whileInView={ { opacity: 1 } }
      viewport={ { margin: '-100px', once: true } }    
        className="text-2xl md:text-4xl 2xl:text-5xl font-bold text-black pt-10 text-center">Be a Part of Our Community</motion.h2>
        <motion.h2 
      initial={ { opacity: 0, } }
      whileInView={ { opacity: 1 } }
      viewport={ { margin: '-100px', once: true } }   
        className="text-black text-sm xl:text-lg 2xl:text-xl mb-8 text-center">Be part of a vibrant community dedicated to innovation, creativity, and the shared goal of making a lasting impact.</motion.h2>
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 px-5 md:space-x-4">
      {socials.map((social, index) => (
        <motion.div
        initial={{ y: 100, opacity: 0 }} // Start from right (x: 100) and invisible
        whileInView={{ y: 0, opacity: 1 }} // Slide to its original position (x: 0) and become visible
        transition={{ type: "tween", duration: 0.5 }} // You can adjust the transition properties
        viewport={{ margin: "-50px" }}
        key={index} className={`relative w-5/6 md:w-1/3 h-60 overflow-hidden group ${social.color} social-hover shadow-[0_4px_10px_5px_rgba(0,0,0,0.75)] shadow-gray-500 rounded`}>
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
        <h3 className="text-base md:text-xl font-bold">{social.name}</h3>
        <p className="text-small md:">{social.handle}</p>
      </div>
    </div>
    <p className="text-xs md:text-sm text-white mt-4">{formatBio(social.bio)}</p>
    <div className="absolute bottom-4 right-4 text-white text-3xl">
      <social.Icon />
    </div>

    <span className="absolute bottom-[-30px] left-4 text-white text-xs md:text-lg font-semibold transition-all duration-700 ease-in-out group-hover:bottom-4">
      Visit <i className="fa-solid fa-arrow-right"></i>
    </span>
  </a>
</motion.div>

      ))}
    </div>
  </div>
  
  <div className="pb-10 w-full flex flex-col justify-center items-center min-h-[32vw] mx-auto bg-cover bg-center" style={{ backgroundImage: 'url(/landing2.png)' }}>
  <motion.h1
      initial={ { opacity: 0, } }
      whileInView={ { opacity: 1 } }
      viewport={ { margin: '-100px', once: true } }    
  className="text-2xl md:text-4xl 2xl:text-5xl font-bold text-black pt-10 text-center mb-5">Frequently Asked Questions</motion.h1>
  <motion.div 
        initial={{ y: 100, opacity: 0 }} // Start from right (x: 100) and invisible
        whileInView={{ y: 0, opacity: 1 }} // Slide to its original position (x: 0) and become visible
        transition={{ type: "tween", duration: 0.5 }} // You can adjust the transition properties
        viewport={{ margin: "-50px" }}
  className="flex flex-wrap justify-center items-center w-full">
    {faqs.map((faq, index) => (
      <div key={index} className="flex flex-col transition-all duration-500 hover:scale-105 cursor-pointer justify-center items-center w-1/2 md:w-1/4 md:min-h-[18vw] p-5 m-3 border-b-2 border-gray-300 bg-white rounded-lg shadow-[0_1px_2px_1px_rgba(0,0,0,0.75)]">
        <h2 className="text-lg md:text-xl 2xl:text-2xl font-extrabold text-black text-center mb-2">{faq.question}</h2>
        <p className="text-sm 2xl:text-lg text-gray-600 text-center">{faq.answer}</p>
      </div>
    ))}
  </motion.div>
</div>

      <Footer />
    </div>
  );
}


