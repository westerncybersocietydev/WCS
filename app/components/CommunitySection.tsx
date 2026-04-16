"use client";
import { useRef } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

const SOCIALS_DATA = [
  {
    name: "Instagram",
    handle: "westerncybersociety",
    bio: "Western Cyber Society (WCS)\nScience, Technology & Engineering\nLeading the future generation of AI, Cyber Security, and Web3.",
    link: "https://instagram.com/westerncybersociety",
    icon: InstagramIcon,
    hoverStyle:
      "hover:border-[#E1306C] hover:shadow-[0_8px_40px_rgba(225,48,108,0.25)]",
    iconHover: "group-hover:text-[#E1306C]",
  },
  {
    name: "TikTok",
    handle: "westerncybersociety",
    bio: "Western Cyber Society\nShaping the future by leading advancements in Artificial Intelligence (AI), Cybersecurity, and Web3.",
    link: "https://tiktok.com/@westerncybersociety",
    icon: TikTokIcon,
    hoverStyle:
      "hover:border-black/50 hover:shadow-[0_8px_40px_rgba(0,0,0,0.12)]",
    iconHover: "group-hover:text-black",
  },
  {
    name: "LinkedIn",
    handle: "Western Cyber Society",
    bio: "Empowering the next generation of leaders in Artificial Intelligence (AI), Cyber Security, and Web3. #LaunchTheFuture",
    link: "https://linkedin.com/company/western-cyber-society",
    icon: LinkedinIcon,
    hoverStyle:
      "hover:border-[#0A66C2] hover:shadow-[0_8px_40px_rgba(10,102,194,0.25)]",
    iconHover: "group-hover:text-[#0A66C2]",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const CommunitySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const { scrollYProgress: textProgress } = useScroll({
    target: textRef,
    offset: ["start 85%", "start 45%"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const textOpacity = useTransform(textProgress, [0, 1], [0, 1]);
  const textY = useTransform(textProgress, [0, 1], [40, 0]);
  const textFilter = useTransform(textProgress, [0, 1], ["blur(8px)", "blur(0px)"]);

  return (
    <section id="community" ref={sectionRef} className="py-32 relative z-10">
      {/* Background Image Wrapper */}
      <div
        className="absolute top-0 left-0 right-0 bottom-[-100px] z-0 pointer-events-none overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0px, black 200px, black calc(100% - 100px), transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0px, black 200px, black calc(100% - 100px), transparent 100%)",
        }}
      >
        <motion.img
          style={{ y: backgroundY }}
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          src="/newlanding2.jpeg"
          className="w-full h-[130%] absolute -top-[15%] object-cover opacity-100"
          alt="Abstract background"
        />
        <div className="absolute inset-0 bg-white/60" />
      </div>

      <div className="container px-6 md:px-12 mx-auto relative z-10">
        <motion.div
          ref={textRef}
          style={{
            opacity: textOpacity,
            y: textY,
            filter: textFilter,
          }}
          className="text-center mb-20"
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-medium bg-clip-text text-transparent bg-gradient-to-br from-[#1a1a2e] via-[#4a4a6a] to-[#1a1a2e] mb-6 tracking-[-0.04em]"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            }}
          >
            Be a Part of Our Community
          </h2>
          <p
            className="text-[18px] text-[#373a46] opacity-80 max-w-[600px] mx-auto leading-relaxed"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            }}
          >
            Join a vibrant ecosystem dedicated to innovation, creativity, and
            the shared goal of making a lasting impact in the tech world.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px", amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
        >
          {SOCIALS_DATA.map((social, index) => (
            <motion.a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              className={`block relative group overflow-hidden rounded-[2rem] p-8 border border-black/10 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 ${social.hoverStyle}`}
            >
              <div className="relative z-10 flex flex-col h-full">
                {/* Header (PFP + Handle) */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-2.5 shadow-sm border border-black/5 shrink-0">
                    <Image
                      src="/wcsLogo.png"
                      alt="WCS"
                      width={112}
                      height={112}
                      className="w-full h-full object-contain drop-shadow-sm"
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold text-black tracking-tight leading-tight"
                      style={{
                        fontFamily:
                          "var(--font-geist-sans), 'Geist', sans-serif",
                      }}
                    >
                      {social.handle}
                    </h3>
                    <p
                      className="text-[14px] text-black/50 font-medium tracking-wide mt-0.5"
                      style={{
                        fontFamily:
                          "var(--font-geist-sans), 'Geist', sans-serif",
                      }}
                    >
                      @{social.handle.toLowerCase().replace(/ /g, "")}
                    </p>
                  </div>
                </div>

                {/* Bio text */}
                <p
                  className="text-[15px] text-[#373a46] opacity-80 leading-relaxed whitespace-pre-line flex-1"
                  style={{
                    fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
                  }}
                >
                  {social.bio}
                </p>

                {/* Footer (Visit + Icon) */}
                <div className="mt-8 flex items-end justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold text-black group-hover:translate-x-2 transition-transform duration-500">
                    Visit Profile{" "}
                    <span className="text-[16px] leading-none mb-[1px]">→</span>
                  </div>

                  {/* Platform Icon */}
                  <div
                    className={`text-black/20 ${social.iconHover} transition-colors duration-500 group-hover:scale-110 origin-bottom-right`}
                  >
                    <social.icon className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
