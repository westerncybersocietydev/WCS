"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState, useRef, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { getProfile } from "../lib/actions/user.action";
import Avatar from "../dataFiles/avatars";

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
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [aboutUsExpanded, setAboutUsExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutUsExpanded, setMobileAboutUsExpanded] = useState(false);
  const aboutUsRef = useRef<HTMLDivElement | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getProfileData = useCallback(async () => {
    if (!user?.userId) {
      console.log("Error getting user id.");
      return;
    }

    try {
      const profile = await getProfile(user.userId);
      setProfileData(profile);
    } catch (error) {
      console.log("Couldn't retrieve profile data. Please try again.");
    }
  }, [user?.userId]);

  useEffect(() => {
    if (user) getProfileData();
  }, [user, getProfileData]);

  const handleLogout = useCallback(() => {
    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict";
    fetchUser();
    setMobileMenuOpen(false);
    router.push("/sign-in");
  }, [fetchUser, router]);

  // Toggle dropdown visibility (desktop)
  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    setAboutUsExpanded(true);
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setAboutUsExpanded(false);
    }, 300);
  };

  // Close mobile menu when route changes
  const handleMobileNavClick = (path: string) => {
    setMobileMenuOpen(false);
    router.push(path);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex">
      <div
        className="fixed top-0 left-0 w-full py-3 z-50 transition-colors duration-300"
        style={{ backgroundColor: "#fdf7ff" }}
      >
        <div className="container mx-auto px-4 md:px-5 flex justify-between items-center">
          {/* Logo */}
          <div className="relative inline-block flex items-center transition-transform duration-300 hover:scale-110 group">
            <Link href="/" className="flex items-center">
              <Image
                src="/wcsLogo.png"
                width={80}
                height={40}
                alt="Website Logo"
                className="transition-transform duration-300 md:w-[100px]"
              />
              <span
                className="ml-2 text-xl hidden lg:block text-black transition-opacity duration-300"
                style={{ fontFamily: "Logirent" }}
              >
                | western cyber society
              </span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 relative z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-black transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
            />
            <span
              className={`block w-6 h-0.5 bg-black mt-1.5 transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""
                }`}
            />
            <span
              className={`block w-6 h-0.5 bg-black mt-1.5 transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-row items-center text-center justify-center space-x-4 lg:space-x-6 relative">
            <div
              className="relative inline-block group hover:text-xl transition-all duration-200"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="relative w-full text-sm lg:text-lg text-black focus:outline-none before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-violet-500 before:transition-all before:duration-500 hover:before:w-full"
                aria-label="About Us"
              >
                <strong>
                  ABOUT US{" "}
                  <i
                    className={`fa-solid fa-chevron-down transition-transform duration-300 ${aboutUsExpanded ? "rotate-180" : ""
                      }`}
                  ></i>
                </strong>
              </button>
            </div>
            <a
              href="/sponsorships"
              className="relative text-black text-sm lg:text-lg hover:text-violet-600 hover:text-xl transition-all duration-200 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-violet-500 before:transition-all before:duration-500 hover:before:w-full"
              aria-label="Sponsorships"
            >
              <strong>SPONSORSHIPS</strong>
            </a>
            <a
              href="/ibm"
              className="relative text-black text-sm lg:text-lg hover:text-violet-600 hover:text-2xl transition-all duration-200 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-violet-500 before:transition-all before:duration-500 hover:before:w-full"
              aria-label="IBM"
            >
              <strong>IBM</strong>
            </a>
            <a
              href="/ibm-night"
              className="relative text-black text-sm lg:text-lg hover:text-violet-600 hover:text-xl transition-all duration-200 before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-violet-500 before:transition-all before:duration-500 hover:before:w-full"
              aria-label="IBM Night Tickets"
            >
              <strong>IBM NIGHT</strong>
            </a>
            {user ? (
              <div className="relative inline-block group hover:text-xl transition-all duration-200">
                <button className="relative text-black hover:text-violet-600 text-lg hover:scale-110 transition-all duration-500">
                  <div
                    className="relative w-9 h-9 mt-1 overflow-hidden rounded-full"
                    style={{ flexShrink: 0 }}
                  >
                    <Image
                      src={profileData?.avatar || Avatar[0]}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
                <div
                  className="absolute right-0 w-64 shadow-lg border border-violet-500 rounded-lg z-20 hidden group-hover:block transition-opacity duration-500 fadeIn"
                  style={{ backgroundColor: "#fdf7ff" }}
                >
                  <div className="flex items-center justify-center space-x-3 p-2 mt-2">
                    <div
                      className="relative w-16 h-16 overflow-hidden rounded-full"
                      style={{ flexShrink: 0 }}
                    >
                      <Image
                        src={profileData?.avatar as string}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h2 className="text-sm font-bold text-gray-600 truncate max-w-[20ch]">
                        {profileData?.firstName} {profileData?.lastName}
                      </h2>
                      <h2 className="ml-1 text-gray-400 text-xs">
                        {profileData?.uwoEmail}
                      </h2>
                    </div>
                  </div>

                  {profileData?.plan === "Basic" && (
                    <Link href="/membership">
                      <p className="flex justify-end mx-8 text-xs font-bold text-violet-500 cursor-pointer hover:underline">
                        Become a VIP
                      </p>
                    </Link>
                  )}
                  <div className="mt-2 border-t border-violet-500"></div>
                  <div className="text-sm">
                    <Link href="/profile">
                      <p className="block border-b border-violet-200 px-6 py-2 text-left text-gray-700 hover:bg-violet-200">
                        Profile
                      </p>
                    </Link>
                    <Link href="/myevents">
                      <p className="block border-b border-violet-200 px-6 py-2 text-left text-gray-700 hover:bg-violet-200">
                        My Events
                      </p>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-6 py-2 text-left text-gray-700 hover:bg-violet-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                className="tracking-widest rounded-full font-semibold border-2 font-bold bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:scale-105 hover:bg-gradient-to-r hover:from-violet-800 hover:to-purple-800 px-4 lg:px-10 text-sm lg:text-lg py-2 lg:py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                onClick={() => router.push("/sign-up")}
              >
                Register
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white z-50 md:hidden transform transition-transform duration-300 ease-in-out shadow-xl ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          style={{ backgroundColor: "#fdf7ff" }}
        >
          <div className="flex flex-col h-full pt-16 pb-6 px-6 overflow-y-auto">
            {/* User Info (if logged in) */}
            {user && profileData && (
              <div className="flex items-center space-x-3 pb-4 border-b border-violet-200 mb-4">
                <div className="relative w-12 h-12 overflow-hidden rounded-full flex-shrink-0">
                  <Image
                    src={profileData?.avatar || Avatar[0]}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="font-bold text-gray-800 truncate">
                    {profileData?.firstName} {profileData?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{profileData?.uwoEmail}</p>
                  {profileData?.plan === "Basic" && (
                    <button
                      onClick={() => handleMobileNavClick("/membership")}
                      className="text-xs font-bold text-violet-500 text-left hover:underline mt-1"
                    >
                      Become a VIP
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-1">
              {/* About Us Accordion */}
              <div>
                <button
                  onClick={() => setMobileAboutUsExpanded(!mobileAboutUsExpanded)}
                  className="w-full flex justify-between items-center py-3 text-left text-gray-800 font-semibold border-b border-gray-200"
                >
                  ABOUT US
                  <i
                    className={`fa-solid fa-chevron-down transition-transform duration-300 ${mobileAboutUsExpanded ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${mobileAboutUsExpanded ? "max-h-60" : "max-h-0"
                    }`}
                >
                  <div className="py-2 pl-4 space-y-2">
                    <button
                      onClick={() => handleMobileNavClick("/overview")}
                      className="block w-full text-left py-2 text-gray-600 hover:text-violet-600"
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => handleMobileNavClick("/projects")}
                      className="block w-full text-left py-2 text-gray-600 hover:text-violet-600"
                    >
                      SIP Projects
                    </button>
                    <button
                      onClick={() => handleMobileNavClick("/events")}
                      className="block w-full text-left py-2 text-gray-600 hover:text-violet-600"
                    >
                      Events
                    </button>
                    <button
                      onClick={() => handleMobileNavClick("/meet-the-team")}
                      className="block w-full text-left py-2 text-gray-600 hover:text-violet-600"
                    >
                      Meet the Team
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleMobileNavClick("/sponsorships")}
                className="py-3 text-left text-gray-800 font-semibold border-b border-gray-200 hover:text-violet-600"
              >
                SPONSORSHIPS
              </button>
              <button
                onClick={() => handleMobileNavClick("/ibm")}
                className="py-3 text-left text-gray-800 font-semibold border-b border-gray-200 hover:text-violet-600"
              >
                IBM
              </button>
              <button
                onClick={() => handleMobileNavClick("/ibm-night")}
                className="py-3 text-left text-gray-800 font-semibold border-b border-gray-200 hover:text-violet-600"
              >
                IBM NIGHT
              </button>

              {user && (
                <>
                  <button
                    onClick={() => handleMobileNavClick("/profile")}
                    className="py-3 text-left text-gray-800 font-semibold border-b border-gray-200 hover:text-violet-600"
                  >
                    PROFILE
                  </button>
                  <button
                    onClick={() => handleMobileNavClick("/myevents")}
                    className="py-3 text-left text-gray-800 font-semibold border-b border-gray-200 hover:text-violet-600"
                  >
                    MY EVENTS
                  </button>
                </>
              )}
            </nav>

            {/* Bottom Actions */}
            <div className="mt-auto pt-6">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full tracking-widest rounded-full font-semibold border-2 border-red-400 text-red-500 hover:bg-red-50 py-3 transition-all duration-300"
                >
                  Sign Out
                </button>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => handleMobileNavClick("/sign-up")}
                    className="w-full tracking-widest rounded-full font-semibold bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-800 hover:to-purple-800 py-3 transition-all duration-300"
                  >
                    Register
                  </button>
                  <button
                    onClick={() => handleMobileNavClick("/sign-in")}
                    className="w-full tracking-widest rounded-full font-semibold border-2 border-violet-500 text-violet-500 hover:bg-violet-50 py-3 transition-all duration-300"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Full-width dropdown box (Desktop only) */}
        {aboutUsExpanded && (
          <div
            ref={aboutUsRef}
            className="absolute left-0 w-full shadow-lg z-30 slideDown overflow-hidden hidden md:block"
            style={{
              backgroundColor: "#fdf7ff",
              top: "100%",
              borderTop: "3px solid #8b5cf6",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="w-full flex flex-col p-0 m-0">
              {/* About Us content */}
              <div className="mx-5">
                <p className="text-gray-800 text-2xl mb-2 mt-5">
                  <strong>ABOUT US</strong>
                </p>
                <p className="text-gray-700 text-md ml-2 mb-5">
                  We're dedicated to delivering innovative solutions and driving
                  growth through strategic thinking and expert execution.
                </p>
              </div>

              <div className="flex flex-wrap gap-5 mx-5 mb-3 justify-center">
                {[
                  {
                    title: "Overview",
                    description:
                      "Explore how we drive innovation and success through strategic insights and cutting-edge solutions.",
                    link: "/overview",
                  },
                  {
                    title: "SIP Projects",
                    description:
                      "Discover our impactful SIP projects that showcase our expertise in transforming ideas into results.",
                    link: "/projects",
                  },
                  {
                    title: "Events",
                    description:
                      "Join us at our events to network with industry leaders and gain valuable insights on emerging trends.",
                    link: "/events",
                  },
                  {
                    title: "Meet the Team",
                    description:
                      "Get to know the talented individuals behind our success, bringing expertise and passion to every project.",
                    link: "/meet-the-team",
                  },
                ].map(({ title, description, link }, index) => (
                  <div
                    key={index}
                    className="flex-1 mb-5 flex flex-col justify-between"
                  >
                    <div>
                      <h2 className="text-lg text-gray-700 mb-2">
                        <strong>{title}</strong>
                      </h2>
                      <p className="text-gray-700 text-xs md:text-sm mb-8">
                        {description}
                      </p>
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
    </div>
  );
}
