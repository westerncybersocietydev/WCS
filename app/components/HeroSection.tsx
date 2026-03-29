"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useUser } from "../context/UserContext";

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const { user } = useUser();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Fade + lift the foreground content as the user scrolls out of the hero
  const contentOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.25], [0, -60]);

  // Parallax effect for the background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100vh] w-full overflow-hidden flex flex-col items-center justify-center bg-transparent"
    >
      {/* Background Video */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none origin-top"
        style={{ y: backgroundY }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[120%] object-cover"
          style={{ objectPosition: "center top" }}
          src="/hero2.mp4"
        />
      </motion.div>

      {/* Foreground UI Components */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center text-balance pt-20"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="w-full flex flex-col items-center"
        >
          {/* Main Heading */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
            className="flex flex-col items-center justify-center mb-6"
          >
            <h1
              className="font-medium tracking-[0.2em] uppercase text-black/40 text-[13px] md:text-[15px] lg:text-[16px] mb-2"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              }}
            >
              Welcome to
            </h1>

            {/* WCS Gradient Title */}
            <h2
              className="relative text-[38px] md:text-[66px] lg:text-[76px] leading-[1.05] tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-[#1a1a2e] via-[#4a4a6a] to-[#1a1a2e] animate-text-shine z-10"
              style={{
                fontFamily: "'Logirent', sans-serif",
                filter:
                  "drop-shadow(0 4px 12px rgba(0,0,0,0.15)) drop-shadow(0 1px 3px rgba(0,0,0,0.1))",
                WebkitTextStroke: "0.3px rgba(255,255,255,0.1)",
              }}
            >
              Western Cyber Society
            </h2>
          </motion.div>

          {/* Dynamic Scroll Text Replacement */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
            className="relative w-full max-w-[650px] h-[100px] md:h-[90px] mb-8 lg:mb-12 flex items-center justify-center"
          >
            <AnimatePresence mode="wait">
              {activeIndex === 0 ? (
                <motion.p
                  key="text1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: -20,
                    transition: { duration: 0.15, ease: "easeIn" },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute text-[15px] md:text-[18px] text-black/60 leading-[1.6] md:leading-[1.7] font-medium tracking-[-0.01em] w-full max-w-[580px] mx-auto"
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--font-geist-sans), 'Geist', sans-serif",
                    }}
                  >
                    Recognized as the leading tech club at Western University, we
                    prioritize maximizing value and delivering exceptional
                    returns on investment for our members.
                  </span>
                </motion.p>
              ) : (
                <motion.p
                  key="text2"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    y: -20,
                    transition: { duration: 0.15, ease: "easeIn" },
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute text-[26px] md:text-[36px] text-transparent bg-clip-text bg-gradient-to-br from-black via-black/40 to-black animate-text-shine leading-tight font-semibold tracking-[-0.03em] w-full"
                >
                  <span
                    style={{
                      fontFamily:
                        "var(--font-geist-sans), 'Geist', sans-serif",
                    }}
                  >
                    Launch the future with us
                  </span>
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20"
          >
            {!user && (
              <Link
                href="/sign-up"
                className="bg-gradient-to-br from-[#1a1a2e] via-[#4a4a6a] to-[#1a1a2e] text-white font-medium text-[15px] px-8 py-3.5 rounded-full shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)] hover:scale-[1.02] transition-transform"
                style={{
                  fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                }}
              >
                Register Now
              </Link>
            )}
            <a
              href="#events"
              className="bg-white/80 backdrop-blur-md text-[#373a46] font-medium text-[15px] px-8 py-3.5 rounded-full border border-black/10 hover:bg-black/5 transition-colors shadow-sm"
              style={{
                fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
              }}
            >
              Learn More
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
