"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');

  const handleLogout = useCallback(() => {
    // Delete the authentication cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict';
    router.push('/sign-in')
  }, []);
  

  const getName = useCallback(async () => {
    try {
      const response = await fetch('/api/getToken', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const result = await response.json();
      if (result?.firstName) {
        setFirstName(result.firstName);
      } else {
        console.log('Name not found.');
      }
    } catch (error) {
      console.error('Failed to fetch token:', error);
    }
  }, []);

  useEffect(() => {
    getName();
  }, [getName]);

  return (
    <div>
      <div className="container mx-auto  my-4 flex justify-between items-center mt-5">
        {/* Logo */}
        <div className="relative inline-block flex items-center mb-4 md:mb-0 transition-transform duration-300 hover:scale-110 group">
          <Link href="/" className="flex items-center">
            <Image
              src="/wcsLogo.png"
              layout="fixed"
              width={100}
              height={50}
              alt="Website Logo"
              className="transition-transform duration-300 hover:scale-110"
            />
            <span className="ml-2 text-black text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: 'Logirent' }}>
              | western cyber society
            </span>
          </Link>
        </div>

        {/* Other Buttons */}
        <div className="flex items-center space-x-6">
          <div className="relative inline-block group hover:text-xl transition-all duration-200">
            <button
              className="relative text-gray-600 hover:text-blue-600 focus:outline-none before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-blue-600 before:transition-all before:duration-500 hover:before:w-full"
              aria-label="About Us"
            >
              ABOUT US
            </button>
            <div className="absolute left-0 w-48 bg-zinc-200 shadow-lg z-20 hidden group-hover:block">
              <Link href="/overview">
                <h2 className="block text-lg px-4 py-2 text-gray-700 hover:bg-blue-100">Overview</h2>
              </Link>
              <Link href="/projects">
                <h2 className="block text-lg px-4 py-2 text-gray-700 hover:bg-blue-100">SIP Projects</h2>
              </Link>
              <Link href="/events">
                <h2 className="block text-lg px-4 py-2 text-gray-700 hover:bg-blue-100">Events</h2>
              </Link>
              <Link href="/meetTheTeam">
                <h2 className="block text-lg px-4 py-2 text-gray-700 hover:bg-blue-100">Meet the Team</h2>
              </Link>
            </div>
          </div>
          <a
            href="/sponsorships"
            className="relative text-gray-600 hover:text-blue-600 hover:text-xl transition-all duration-200 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-blue-600 before:transition-all before:duration-500 hover:before:w-full"
            aria-label="Sponsorships"
          >
            SPONSORSHIPS
          </a>
          <a
            href="/ibm"
            className="relative text-gray-600 hover:text-blue-600 hover:text-xl transition-all duration-200 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-blue-600 before:transition-all before:duration-500 hover:before:w-full"
            aria-label="IBM"
          >
            IBM
          </a>
          {firstName ? (
            <div className="relative inline-block group hover:text-xl transition-all duration-200">
              <button
                className="relative text-gray-600 hover:text-blue-600 text-lg focus:outline-none before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-blue-600 before:transition-all before:duration-500 hover:before:w-full"
                aria-label={`Hi ${firstName}`}
              >
                <i className="fa-solid fa-user"></i>
              </button>
              <div className="absolute right-0 w-36 bg-zinc-200 shadow-lg z-20 hidden group-hover:block">
                <Link href="/edit-profile">
                  <h2 className="block text-lg px-4 py-2 text-gray-700 hover:bg-blue-100">Edit Profile</h2>
                </Link>
                <Link href="/my-events">
                  <h2 className="block text-lg px-4 py-2 text-gray-700 hover:bg-blue-100">My Events</h2>
                </Link>
                <button onClick={handleLogout} className="block text-lg w-full py-2 px-4 text-left text-gray-700 hover:bg-blue-100">
                Sign Out
              </button>
              </div>
            </div>
          ) : (
          <button
            className="relative text-gray-700 border border-gray-700 hover:scale-105 hover:bg-blue-100 px-4 py-1 transition-all duration-500 ease-in-out shadow-sm hover:shadow-lg"
            aria-label="Sign In"
            onClick={() => router.push('sign-up')}
          >
            REGISTER
          </button>
          )}
       </div>
      </div>
    </div>
  );
}