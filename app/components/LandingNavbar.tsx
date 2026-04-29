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
  { name: "Home", link: "/" },
  { name: "Projects", link: "/projects" },
  { name: "Events", link: "/events" },
  { name: "Sponsorships", link: "/sponsorships" },
  {
    name: "About Us",
    dropdown: [
      { name: "Overview", link: "/overview" },
      { name: "Meet the Team", link: "/meet-the-team" },
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
  const [scrolled, setScrolled] = useState(false);
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

  // Scroll effect — tightens pill opacity/shadow as user scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <>
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-[100] pt-5 px-4 md:px-8 w-full pointer-events-none"
    >
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-full border max-w-6xl mx-auto pointer-events-auto transition-all duration-300 ${scrolled
            ? "bg-white/90 backdrop-blur-2xl shadow-md border-black/10"
            : "bg-white/60 backdrop-blur-2xl shadow-sm border-black/5"
          }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center pl-2">
          <Image
            src="/branding/wcsLogo.png"
            alt="Western Cyber Society Logo"
            width={160}
            height={160}
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
              href="/sign-in"
              className="bg-gradient-to-r from-[#6B21A8] via-[#A21CAF] to-[#C026D3] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 shadow-sm"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button — animated into X when open */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 transition-colors relative z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="relative w-4 h-4 flex items-center justify-center">
            <span
              className={`absolute block h-0.5 bg-[#1a1a2e] rounded-full transition-all duration-300 ${
                mobileMenuOpen ? "w-4 rotate-45" : "w-4 top-0"
              }`}
              style={{ top: mobileMenuOpen ? "50%" : "25%", transform: mobileMenuOpen ? "translateY(-50%) rotate(45deg)" : "" }}
            />
            <span
              className={`absolute block h-0.5 bg-[#1a1a2e] rounded-full transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0 w-0" : "w-4 opacity-100"
              }`}
              style={{ top: "50%", transform: "translateY(-50%)" }}
            />
            <span
              className={`absolute block h-0.5 bg-[#1a1a2e] rounded-full transition-all duration-300 ${
                mobileMenuOpen ? "w-4 -rotate-45" : "w-4 bottom-0"
              }`}
              style={{ bottom: mobileMenuOpen ? "50%" : "25%", transform: mobileMenuOpen ? "translateY(50%) rotate(-45deg)" : "" }}
            />
          </span>
        </button>
      </div>
    </motion.nav>

      {/* Full-screen mobile menu — slides down from top */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[105] md:hidden flex flex-col bg-[#fdfcfd] pointer-events-auto"
          >
            {/* Top bar — matches nav pill height */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <button onClick={() => handleMobileNavClick("/")} className="block hover:opacity-70 transition-opacity">
                <Image
                  src="/branding/wcsLogo.png"
                  alt="WCS"
                  width={120}
                  height={48}
                  className="h-8 w-auto"
                />
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 flex items-center justify-center text-black/50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User info */}
            {user && profileData && (
              <div className="mx-6 mb-4 px-4 py-3 rounded-2xl bg-black/[0.03] flex items-center gap-3 border border-black/[0.04]">
                <div className="relative w-9 h-9 overflow-hidden rounded-full flex-shrink-0">
                  <Image src={profileData?.avatar || Avatar[0]} alt="Profile" fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-[#1a1a2e] text-sm font-semibold truncate" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                    {profileData?.firstName} {profileData?.lastName}
                  </p>
                  <p className="text-black/40 text-xs truncate" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                    {profileData?.uwoEmail}
                  </p>
                </div>
              </div>
            )}

            {/* Staggered nav links */}
            <motion.nav
              className="flex-1 overflow-y-auto px-6 pt-2"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
            >
              <motion.button
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                onClick={() => handleMobileNavClick("/")}
                className="w-full flex items-center justify-between py-3.5 text-left text-[#1a1a2e] font-semibold text-[22px] tracking-tight border-b border-black/[0.05] hover:opacity-60 transition-opacity"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              >
                Home
              </motion.button>

              {/* About Us group */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                className="mb-1"
              >
                <button
                  onClick={() => setMobileAboutUsExpanded(!mobileAboutUsExpanded)}
                  className="w-full flex justify-between items-center py-3.5 text-left text-[#1a1a2e] font-semibold text-[22px] tracking-tight border-b border-black/[0.05] hover:opacity-60 transition-opacity"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  About Us
                  <svg
                    className={`w-4 h-4 text-black/25 transition-transform duration-300 ${mobileAboutUsExpanded ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${mobileAboutUsExpanded ? "max-h-60" : "max-h-0"}`}>
                  <div className="py-2 pl-2 space-y-1">
                    {[
                      { name: "Overview", link: "/overview" },
                      { name: "Meet the Team", link: "/meet-the-team" },
                      { name: "Community", link: "#community" },
                      { name: "FAQ", link: "#faq" },
                    ].map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleMobileNavClick(item.link)}
                        className="block w-full text-left py-2 px-2 text-[16px] text-black/50 hover:text-black/70 transition-colors"
                        style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {[
                { name: "Projects", link: "/projects" },
                { name: "Events", link: "/events" },
                { name: "Sponsorships", link: "/sponsorships" },
                ...(user ? [
                  { name: "Profile", link: "/profile" },
                  { name: "My Events", link: "/myevents" },
                ] : []),
              ].map((item) => (
                <motion.button
                  key={item.name}
                  variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
                  onClick={() => handleMobileNavClick(item.link)}
                  className="w-full flex items-center justify-between py-3.5 text-left text-[#1a1a2e] font-semibold text-[22px] tracking-tight border-b border-black/[0.05] hover:opacity-60 transition-opacity"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  {item.name}
                </motion.button>
              ))}
            </motion.nav>

            {/* Bottom actions */}
            <div className="px-6 pb-10 pt-5 space-y-2.5">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-sm font-medium rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 py-3 transition-all"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleMobileNavClick("/sign-in")}
                    className="w-full text-[15px] font-semibold rounded-2xl py-3.5 text-white transition-all"
                    style={{
                      background: "linear-gradient(135deg, #6B21A8, #A21CAF, #C026D3)",
                      fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                      boxShadow: "0 4px 20px rgba(162, 28, 175, 0.25)",
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleMobileNavClick("/sign-up")}
                    className="w-full text-[15px] font-medium rounded-2xl py-3.5 text-black/60 border border-black/10 hover:bg-black/[0.03] transition-all"
                    style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNavbar;
