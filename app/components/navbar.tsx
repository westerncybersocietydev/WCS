"use client"
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState, useRef } from 'react';
import { useUser } from '../context/UserContext'; // Adjust the path as needed

export default function Navbar() {
  const router = useRouter();
  const { user, fetchUser } = useUser();
  const [aboutUsExpanded, setAboutUsExpanded] = useState(false);
  const aboutUsRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = useCallback(() => {
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict';
    fetchUser(); // Fetch user after logout to update state
    router.push('/sign-in');
  }, [fetchUser, router]);

  const handleMouseEnter = () => setAboutUsExpanded(true);
  const handleMouseLeave = () => {
    if (aboutUsRef.current && !aboutUsRef.current.contains(document.activeElement)) {
      setAboutUsExpanded(false);
    }
  };

  return (
    <div className='py-5' style={{ backgroundColor: aboutUsExpanded ? 'black' : '' }}>
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo */}
        <div className="relative inline-block flex items-center transition-transform duration-300 hover:scale-110 group">
          <Link href="/" className="flex items-center">
            <Image
              src="/wcsLogo.png"
              layout="fixed"
              width={100}
              height={50}
              alt="Website Logo"
              className="transition-transform duration-300"
            />
            <span className="ml-2 text-black text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: 'Logirent' }}>
              | western cyber society
            </span>
          </Link>
        </div>

        {/* Other Buttons */}
        <div className="flex items-center space-x-6 relative">
          <div
            className="relative inline-block group hover:text-xl transition-all duration-200"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className="relative focus:outline-none before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-white before:transition-all before:duration-500 hover:before:w-full"
              aria-label="About Us" style={{ color: aboutUsExpanded ? '#ededed' : 'black' }}
            >
              <strong>ABOUT US</strong>
            </button>
          </div>
          <a
            href="/sponsorships"
            className="relative text-gray-600 hover:text-blue-600 hover:text-xl transition-all duration-200 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-black before:transition-all before:duration-500 hover:before:w-full"
            aria-label="Sponsorships" style={{ color: aboutUsExpanded ? 'white' : 'black' }}
          >
            <strong>SPONSORSHIPS</strong>
          </a>
          <a
            href="/ibm"
            className="relative text-gray-600 hover:text-blue-600 hover:text-2xl transition-all duration-200 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-black before:transition-all before:duration-500 hover:before:w-full"
            aria-label="IBM" style={{ color: aboutUsExpanded ? 'white' : 'black' }}
          >
            <strong>IBM</strong>
          </a>
          {user ? (
            <div className="relative inline-block group hover:text-xl transition-all duration-200">
              <button
                className="relative text-black hover:text-blue-600 text-lg focus:outline-none before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-blue-600 before:transition-all before:duration-500 hover:before:w-full"
                style={{ color: aboutUsExpanded ? '#ededed' : 'black' }}
              >
                <i className="fa-solid fa-user"></i>
              </button>
              <div className="absolute right-0 w-36 bg-zinc-200 shadow-lg z-20 hidden group-hover:block transition-opacity duration-500 fadeIn">
                <Link href="/profile">
                  <h2 className="block text-lg px-4 py-2 text-gray-700 hover:bg-blue-100 transition-transform duration-500 fadeInUpTwo">Edit Profile</h2>
                </Link>
                <Link href="/my-events">
                  <h2 className="block text-lg px-4 py-2 text-gray-700 hover:bg-blue-100 transition-transform duration-500 fadeInUpTwo">My Events</h2>
                </Link>
                <button onClick={handleLogout} className="block text-lg w-full py-2 px-4 text-left text-gray-700 hover:bg-blue-100 transition-transform duration-500 fadeInUpTwo">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <button
              className="relative z-40 text-black border hover:scale-105 hover:bg-black hover:text-white px-4 py-1 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
              aria-label="Sign In"
              onClick={() => router.push('/sign-up')} style={{ color: aboutUsExpanded ? '#ededed' : '', borderColor: aboutUsExpanded ? '#ededed' : 'black' }}
            >
              REGISTER
            </button>
          )}
        </div>
      </div>

      {/* Full-width white box */}
      {aboutUsExpanded && (
        <div
          ref={aboutUsRef}
          className={`absolute top-13 left-0 w-full shadow-lg z-30 ${aboutUsExpanded ? 'fadeInUp' : ''}`}
          style={{ backgroundColor: '#ededed' }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Black bar at the top */}
          <div className="h-3 w-full bg-black"></div>
          <div className="container flex flex-col">

            {/* About Us content */}
            <div className={`ml-20 transition-transform duration-500 ${aboutUsExpanded ? 'fadeInUp' : ''}`}>
              <p className="text-gray-800 mb-2 mt-5"><strong>ABOUT US</strong></p>
              <p className='text-gray-700 text-sm mb-5'>
                We’re dedicated to delivering innovative solutions and driving growth through strategic thinking and expert execution.
              </p>
            </div>

            <div className="flex flex-wrap gap-10 ml-20 mb-3">
              {[{ title: 'Overview', description: 'Explore how we drive innovation and success through strategic insights and cutting-edge solutions.', link: '/overview' },
                { title: 'SIP Projects', description: 'Discover our impactful SIP projects that showcase our expertise in transforming ideas into results.', link: '/projects' },
                { title: 'Events', description: 'Join us at our events to network with industry leaders and gain valuable insights on emerging trends.', link: '/events' },
                { title: 'Meet the Team', description: 'Get to know the talented individuals behind our success, bringing expertise and passion to every project.', link: '/meetTheTeam' }
              ].map(({ title, description, link }, index) => (
                <div key={index} className="flex-1 min-w-[200px] mb-5">
                  <div className={`transition-transform duration-500 ${aboutUsExpanded ? 'fadeInUp' : ''}`}>
                    <h2 className="text-sm text-gray-700 mb-2"><strong>{title}</strong></h2>
                    <p className='text-gray-700 text-xs mb-8'>{description}</p>
                    <button
                      className="relative text-xs z-40 text-gray-950 border border-gray-700 hover:scale-105 hover:bg-black hover:text-white px-5 py-2 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                      aria-label="Learn More"
                      onClick={() => router.push(link)}
                    >
                      LEARN MORE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
