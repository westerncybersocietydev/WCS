"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

const NAV_LINKS = [
  { name: "Projects", link: "/projects" },
  { name: "Events", link: "/events" },
  { name: "Sponsorships", link: "/sponsorships" },
  {
    name: "About Us",
    dropdown: [
      { name: "Overview", link: "/overview" },
      { name: "Meet the Team", link: "/meet-the-team" },
      { name: "Community", link: "#community" },
      { name: "FAQ", link: "#faq" },
    ],
  },
];

const LandingNavbar = () => {
  const router = useRouter();
  const { user, fetchUser } = useUser();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutUsExpanded, setMobileAboutUsExpanded] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Fetch profile data
  const getProfileData = useCallback(async () => {
    if (!user?.userId) return;
    try {
      const profile = await getProfile(user.userId);
      setProfileData(profile);
    } catch (error) {
      console.log("Couldn't retrieve profile data.");
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

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  const handleMobileNavClick = (path: string) => {
    setMobileMenuOpen(false);
    if (path.startsWith("#")) {
      const el = document.querySelector(path);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(path);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-[100] pt-6 px-6 md:px-8 w-full pointer-events-none"
    >
      <div className="flex items-center justify-between px-3 py-2 bg-white/50 backdrop-blur-2xl rounded-full border border-black/5 shadow-sm max-w-6xl mx-auto pointer-events-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center pl-2">
          <img
            src="/wcsLogo.png"
            alt="Western Cyber Society Logo"
            className="h-8 md:h-10 w-auto drop-shadow-sm"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 relative">
          {NAV_LINKS.map((item) => (
            <div
              key={item.name}
              className="relative"
              onMouseEnter={() => setHoveredNav(item.name)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              {item.dropdown ? (
                <button
                  className={`text-black/80 text-sm font-medium px-4 py-2 rounded-full transition-all hover:bg-black/5 ${hoveredNav === item.name ? "bg-black/5" : ""
                    }`}
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  {item.name}
                </button>
              ) : (
                <Link
                  href={item.link!}
                  className="block text-black/80 text-sm font-medium px-4 py-2 rounded-full transition-all hover:bg-black/5"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  {item.name}
                </Link>
              )}

              {item.dropdown && (
                <AnimatePresence>
                  {hoveredNav === item.name && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                        filter: "blur(4px)",
                        scale: 0.95,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: 5,
                        filter: "blur(4px)",
                        scale: 0.95,
                        transition: { duration: 0.15 },
                      }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-0 mt-2 min-w-[180px] bg-white/95 backdrop-blur-xl border border-black/5 shadow-xl rounded-2xl p-2 z-[200]"
                    >
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.link}
                          className="block px-4 py-2.5 text-sm font-medium text-black/80 hover:text-black hover:bg-black/5 rounded-xl transition-all w-full text-left"
                          style={{
                            fontFamily:
                              "var(--font-geist-sans), 'Geist', sans-serif",
                          }}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Auth Area */}
        <div className="hidden md:flex items-center">
          {user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="relative w-9 h-9 overflow-hidden rounded-full ring-2 ring-transparent hover:ring-black/10 transition-all"
              >
                <Image
                  src={profileData?.avatar || Avatar[0]}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                      filter: "blur(4px)",
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 5,
                      filter: "blur(4px)",
                      scale: 0.95,
                      transition: { duration: 0.15 },
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full mt-3 w-64 bg-white/95 backdrop-blur-xl border border-black/5 shadow-xl rounded-2xl overflow-hidden z-[200]"
                  >
                    {/* Profile Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-black/[0.04]">
                      <div className="relative w-12 h-12 overflow-hidden rounded-full flex-shrink-0">
                        <Image
                          src={profileData?.avatar || Avatar[0]}
                          alt="Profile"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3
                          className="text-sm font-semibold text-black truncate"
                          style={{
                            fontFamily:
                              "var(--font-geist-sans), 'Geist', sans-serif",
                          }}
                        >
                          {profileData?.firstName} {profileData?.lastName}
                        </h3>
                        <p
                          className="text-xs text-black/50 truncate"
                          style={{
                            fontFamily:
                              "var(--font-geist-sans), 'Geist', sans-serif",
                          }}
                        >
                          {profileData?.uwoEmail}
                        </p>
                      </div>
                    </div>

                    {/* VIP Upsell */}
                    {profileData?.plan === "Basic" && (
                      <Link
                        href="/membership"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#1a1a2e] to-[#4a4a6a] text-right hover:opacity-70 transition-opacity"
                        style={{
                          fontFamily:
                            "var(--font-geist-sans), 'Geist', sans-serif",
                        }}
                      >
                        Become a VIP →
                      </Link>
                    )}

                    {/* Menu Items */}
                    <div className="py-1">
                      {[
                        { label: "Profile", href: "/profile" },
                        { label: "My Events", href: "/myevents" },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setProfileOpen(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-black/80 hover:text-black hover:bg-black/5 transition-all"
                          style={{
                            fontFamily:
                              "var(--font-geist-sans), 'Geist', sans-serif",
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          handleLogout();
                        }}
                        className="block w-full px-4 py-2.5 text-sm font-medium text-red-500/80 hover:text-red-600 hover:bg-red-50/50 transition-all text-left"
                        style={{
                          fontFamily:
                            "var(--font-geist-sans), 'Geist', sans-serif",
                        }}
                      >
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/sign-up"
              className="bg-gradient-to-br from-[#1a1a2e] via-[#4a4a6a] to-[#1a1a2e] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-transform hover:scale-105 shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)]"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 relative z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-black/80 transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-1" : ""
              }`}
          />
          <span
            className={`block w-5 h-0.5 bg-black/80 mt-1 transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""
              }`}
          />
          <span
            className={`block w-5 h-0.5 bg-black/80 mt-1 transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 pointer-events-auto ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white/95 backdrop-blur-2xl z-50 md:hidden transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xl pointer-events-auto ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full pt-16 pb-6 px-6 overflow-y-auto">
          {/* User Info (if logged in) */}
          {user && profileData && (
            <div className="flex items-center space-x-3 pb-4 border-b border-black/[0.04] mb-4">
              <div className="relative w-12 h-12 overflow-hidden rounded-full flex-shrink-0">
                <Image
                  src={profileData?.avatar || Avatar[0]}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <p
                  className="font-semibold text-black truncate text-sm"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                  }}
                >
                  {profileData?.firstName} {profileData?.lastName}
                </p>
                <p
                  className="text-xs text-black/50 truncate"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                  }}
                >
                  {profileData?.uwoEmail}
                </p>
                {profileData?.plan === "Basic" && (
                  <button
                    onClick={() => handleMobileNavClick("/membership")}
                    className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#1a1a2e] to-[#4a4a6a] text-left mt-1"
                  >
                    Become a VIP →
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
                className="w-full flex justify-between items-center py-3 text-left text-black/80 font-medium text-sm border-b border-black/[0.04]"
                style={{
                  fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                }}
              >
                About Us
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${mobileAboutUsExpanded ? "rotate-180" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${mobileAboutUsExpanded ? "max-h-60" : "max-h-0"
                  }`}
              >
                <div className="py-2 pl-4 space-y-1">
                  {[
                    { name: "Overview", link: "/overview" },
                    { name: "Meet the Team", link: "/meet-the-team" },
                    { name: "Community", link: "#community" },
                    { name: "FAQ", link: "#faq" },
                  ].map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleMobileNavClick(item.link)}
                      className="block w-full text-left py-2 text-sm text-black/60 hover:text-black transition-colors"
                      style={{
                        fontFamily:
                          "var(--font-geist-sans), 'Geist', sans-serif",
                      }}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {[
              { name: "Projects", link: "/projects" },
              { name: "Events", link: "/events" },
              { name: "Sponsorships", link: "/sponsorships" },
              { name: "IBM", link: "/ibm" },
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => handleMobileNavClick(item.link)}
                className="py-3 text-left text-black/80 font-medium text-sm border-b border-black/[0.04] hover:text-black transition-colors"
                style={{
                  fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                }}
              >
                {item.name}
              </button>
            ))}

            {user && (
              <>
                <button
                  onClick={() => handleMobileNavClick("/profile")}
                  className="py-3 text-left text-black/80 font-medium text-sm border-b border-black/[0.04] hover:text-black transition-colors"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                  }}
                >
                  Profile
                </button>
                <button
                  onClick={() => handleMobileNavClick("/myevents")}
                  className="py-3 text-left text-black/80 font-medium text-sm border-b border-black/[0.04] hover:text-black transition-colors"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                  }}
                >
                  My Events
                </button>
              </>
            )}
          </nav>

          {/* Bottom Actions */}
          <div className="mt-auto pt-6">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full text-sm font-medium rounded-full border border-red-200 text-red-500 hover:bg-red-50/50 py-3 transition-all"
                style={{
                  fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                }}
              >
                Sign Out
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => handleMobileNavClick("/sign-up")}
                  className="w-full text-sm font-medium rounded-full bg-gradient-to-br from-[#1a1a2e] via-[#4a4a6a] to-[#1a1a2e] text-white py-3 transition-transform hover:scale-[1.02] shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)]"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                  }}
                >
                  Register
                </button>
                <button
                  onClick={() => handleMobileNavClick("/sign-in")}
                  className="w-full text-sm font-medium rounded-full border border-black/10 text-black/80 hover:bg-black/5 py-3 transition-all"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                  }}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default LandingNavbar;
