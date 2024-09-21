"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext'; // Adjust the path as 
import Avatar from '../dataFiles/avatars';
import { getProfile, updatePlan } from '../lib/actions/user.action';
import BecomeVIP from './becomeVIP';
import toast from 'react-hot-toast';

interface ProfileData {
  firstName: string;
  lastName: string;
  uwoEmail: string;
  preferredEmail: string;
  currentYear: string;
  program: string;
  plan: string;
  description: string;
  avatar: string;
}

export default function Navbar() {
  const router = useRouter();
  const { user, fetchUser } = useUser();
  const [avatar, setAvatar] = useState(Avatar[0])
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aboutUsExpanded, setAboutUsExpanded] = useState(false);
  const aboutUsRef = useRef<HTMLDivElement | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getProfileData = useCallback(async () => {
    if (!user?.userId) {
      console.log("Error getting user id.")
      return;
    }

    try {
      const profile = await getProfile(user.userId);
      setProfileData(profile);

      switch (profileData?.avatar) {
        case "1":
          setAvatar(Avatar[0]);
        case "2":
          setAvatar(Avatar[1]);
        case "3":
          setAvatar(Avatar[3]);
        default:
          setAvatar(Avatar[0]);
      }

    } catch (error) {
      console.log("Couldn't retrieve profile data. Please try again.");
    }
  }, [user?.userId]);

  useEffect(() => {
    getProfileData();
  }, [getProfileData]);

  const onClose = () => {
    setIsModalOpen(false);
  };

  const handleLogout = useCallback(() => {
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict';
    fetchUser(); // Fetch user after logout to update state
    router.push('/sign-in');
  }, [fetchUser, router]);

  // Toggle dropdown visibility
  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    setAboutUsExpanded(true);
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setAboutUsExpanded(false);
    }, 300); // Adjust delay as needed
  };

  const handlePlanSubmit = async () => {
    if (!user?.userId) return;
  
    try {
      await updatePlan(user.userId, "VIP");
      await getProfileData();
      onClose();
      toast.success("Congratulations! You are now a VIP!")
    } catch (error) {
      toast.error("Failed to update the plan. Please try again.");
    }
  };

  return (
    <div className='flex'>
    <div
      className="fixed top-0 left-0 w-full py-3 z-50"
      style={{ backgroundColor: aboutUsExpanded ? 'black' : '#fdf7ff' }}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-normal md:justify-between items-center">

        {/* Logo */}
        <div className="relative inline-block flex justify-between items-center transition-transform duration-300 hover:scale-110 group">
          <Link href="/" className="flex items-center justify">
            <Image
              src="/wcsLogo.png"
              layout="fixed"
              width={100}
              height={50}
              alt="Website Logo"
              className="transition-transform duration-300"
            />
            <span
              className={`ml-2 text-xl hidden md:block transition-opacity duration-300 ${aboutUsExpanded ? 'text-white' : 'text-black'}`}
              style={{ fontFamily: 'Logirent' }}
            >
              | western cyber society
            </span>
          </Link>
        </div>

        {/* Other Buttons */}
        <div className="flex flex-row items-center text-center justify-center space-x-6 relative">
          <div
            className="relative inline-block group hover:text-xl transition-all duration-200"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="relative w-full text-xs md:text-lg focus:outline-none before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-500 hover:before:w-full"
              aria-label="About Us"
              style={{ color: aboutUsExpanded ? '#ededed' : 'black' }}
            >
              <strong>ABOUT US <i className="fa-solid fa-angle-down"></i></strong>
            </button>
          </div>
          <a
            href="/sponsorships"
            className="relative text-gray-600 text-xs md:text-lg hover:text-blue-600 hover:text-xl transition-all duration-200 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-black before:transition-all before:duration-500 hover:before:w-full"
            aria-label="Sponsorships"
            style={{ color: aboutUsExpanded ? 'white' : 'black' }}
          >
            <strong>SPONSORSHIPS</strong>
          </a>
          <a
            href="/ibm"
            className="relative text-gray-600 text-xs md:text-lg hover:text-blue-600 hover:text-2xl transition-all duration-200 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-black before:transition-all before:duration-500 hover:before:w-full"
            aria-label="IBM"
            style={{ color: aboutUsExpanded ? 'white' : 'black' }}
          >
            <strong>IBM</strong>
          </a>
          {user ? (
            <div className="relative inline-block group hover:text-xl transition-all duration-200">
              <button
                className="relative text-black hover:text-blue-600 text-lg hover:scale-110 transition-all duration-500"
                style={{ color: aboutUsExpanded ? '#ededed' : 'black' }}
              >
                <img 
                  src={avatar}
                  alt="Profile" 
                  className="w-9 h-9 rounded-full mt-1 object-cover"
                  style={{ flexShrink: 0 }}
                />
              </button>
              <div className="absolute right-0 w-64 shadow-lg border border-violet-500 rounded-lg z-20 hidden group-hover:block transition-opacity duration-500 fadeIn"
              style={{ backgroundColor: '#fdf7ff' }}>
              <div className="flex items-center justify-center space-x-3 p-2 mt-2">
                <img 
                  src={avatar}
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover"
                  style={{ flexShrink: 0 }} // Prevents the image from shrinking
                />
                <div className="flex flex-col justify-center">
                  <h2 className="text-sm font-bold text-gray-600 truncate max-w-[20ch]">{profileData?.firstName} {profileData?.lastName}</h2>
                  <h2 className="ml-1 text-gray-400 text-xs">{profileData?.uwoEmail}</h2>
                </div>
                
              </div>
              
              { profileData?.plan === "Basic" && (
                <p onClick={() => setIsModalOpen(true)} className="flex justify-end mx-8 text-xs font-bold text-violet-500 cursor-pointer hover:underline">Become a VIP</p>
              ) }
              <div className="mt-2 border-t border-violet-500"></div>
              <div className='text-sm'>
                <Link href="/profile">
                  <p className="block border-b border-violet-200 px-6 py-2 text-left text-gray-700 hover:bg-violet-200">Profile</p>
                </Link>
                <Link href="/myevents">
                  <p className="block border-b border-violet-200 px-6 py-2 text-left text-gray-700 hover:bg-violet-200">My Events</p>
                </Link>
                <button onClick={handleLogout} className="block w-full px-6 py-2 text-left text-gray-700 hover:bg-violet-200">
                  Sign Out
                </button>
              </div>
            </div>
            </div>
          ) : (
          <button className={`tracking-widest rounded-full font-semibold
            border-2 font-bold ${aboutUsExpanded ? 'bg-white text-black' : 'bg-gradient-to-r from-violet-500 to-purple-500 text-white'}
            hover:scale-105 
            ${aboutUsExpanded ? '' : 'hover:bg-gradient-to-r hover:from-violet-800 hover:to-purple-800'} 
            px-2 md:px-10 text-xs md:text-lg py-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg`}
            onClick={() => router.push("/sign-up")}>
            Register
          </button>
          )}
        </div>

        
      </div>

      {/* Full-width white box */}
      {aboutUsExpanded && (
        <div
          ref={aboutUsRef}
          className={`absolute top-13 left-0 w-full shadow-lg z-30 transition-transform duration-500 ${aboutUsExpanded ? 'fadeInUp' : 'fadeOut'}`}
          style={{ backgroundColor: '#ededed' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Black bar at the top */}
          <div className="h-3 w-full bg-black"></div>
          <div className="w-full flex flex-col p-0 m-0">

            {/* About Us content */}
            <div className={`transition-transform mx-5 duration-500 ${aboutUsExpanded ? 'fadeInUp' : 'fadeOut'}`}>
              <p className="text-gray-800 text-2xl mb-2 mt-5"><strong>ABOUT US</strong></p>
              <p className='text-gray-700 text-md ml-2 mb-5'>
                We’re dedicated to delivering innovative solutions and driving growth through strategic thinking and expert execution.
              </p>
            </div>

            <div className="flex flex-wrap gap-5 mx-5 mb-3 justify-center">
            {[
  { title: 'About Us', description: 'Explore how we drive innovation and success through strategic insights and cutting-edge solutions.', link: '/overview' },
  { title: 'SIP Projects', description: 'Discover our impactful SIP projects that showcase our expertise in transforming ideas into results.', link: '/projects' },
  { title: 'Events', description: 'Join us at our events to network with industry leaders and gain valuable insights on emerging trends.', link: '/events' },
  { title: 'Meet the Team', description: 'Get to know the talented individuals behind our success, bringing expertise and passion to every project.', link: '/meetTheTeam' }
].map(({ title, description, link }, index) => (
  <div key={index} className="flex-1 mb-5 flex flex-col justify-between">
    <div className={`transition-transform duration-500 ${aboutUsExpanded ? 'fadeInUp' : 'fadeOut'}`}>
      <h2 className="text-lg text-gray-700 mb-2"><strong>{title}</strong></h2>
      <p className='text-gray-700 text-xs md:text-sm mb-8'>{description}</p>
    </div>
    <button
      className="relative rounded-full text-xs text-white z-40 bg-gradient-to-r from-violet-500 to-purple-500 hover:scale-105 hover:bg-gradient-to-r hover:from-violet-800 hover:to-purple-800 px-5 py-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
      aria-label="Learn More"
      onClick={() => router.push(link)}
    >
      LEARN MORE
    </button>
  </div>
))}

            </div>
          </div>
        </div>
      )}
    </div>
    <BecomeVIP isOpen={isModalOpen} onClose={onClose} onComplete={handlePlanSubmit} />
    </div>
  );
}
