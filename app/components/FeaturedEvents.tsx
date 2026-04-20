"use client";
import { useRef } from "react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const EVENT_DATA = [
  {
    title: "IBM Night",
    description:
      "Connect with IBM professionals and explore exclusive opportunities.",
    image: "/events/IBMN.png",
    link: "/events?event=IBMNight",
  },
  {
    title: "VIP Dinner",
    description:
      "An exclusive invite-only dinner for our top members and sponsors.",
    image: "/events/VIPD.png",
    link: "/events?event=VIPDinner",
  },
  {
    title: "FAANG Day",
    description:
      "Networking day featuring engineers and recruiters from top tech companies.",
    image: "/events/FD.png",
    link: "/events?event=FAANGDay",
  },
  {
    title: "Toronto Tech Expo",
    description:
      "Join us on a trip to the biggest technology conference in Toronto.",
    image: "/events/TTE.png",
    link: "/events?event=TorontoTechExpo",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    filter: "blur(8px)",
    transition: { duration: 0.5, ease: "easeOut" },
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const FeaturedEvents = () => {
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
    <section id="events" ref={sectionRef} className="py-16 relative z-10">
      {/* Background Image Wrapper */}
      <div
        className="absolute top-[-200px] left-0 right-0 bottom-[-100px] z-0 pointer-events-none overflow-hidden"
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
          src="/landing/newlanding1.jpeg"
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
            Join us at our featured events for 2025
          </h2>
          <p
            className="text-[18px] text-[#373a46] opacity-80 max-w-[600px] mx-auto leading-relaxed"
            style={{
              fontFamily: "var(--font-geist-sans), 'Geist', sans-serif",
            }}
          >
            Participate in our distinguished events, designed to foster
            innovation, facilitate collaboration, and connect you with industry
            leaders.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px", amount: 0.2 }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {EVENT_DATA.map((event, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative group rounded-3xl overflow-hidden cursor-pointer h-[26rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.2)] bg-black transition-all duration-500"
            >
              {/* Background Image */}
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.05]"
              />

              {/* Hover Darkening & Blur Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 backdrop-blur-md transition-all duration-500 pointer-events-none z-10" />

              {/* Centered Content Overlay (Hidden by Default) */}
              <div className="absolute inset-0 flex flex-col justify-center items-center p-6 md:p-8 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] text-center z-20 pointer-events-none group-hover:pointer-events-auto">
                
                <h3 
                  className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-4 drop-shadow-sm"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  {event.title}
                </h3>
                
                <p
                  className="text-[15px] md:text-[16px] text-white/90 leading-relaxed font-medium max-w-[90%] drop-shadow-sm"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  {event.description}
                </p>

                <div className="absolute bottom-8 md:bottom-10">
                  <Link
                    href={event.link}
                    className="inline-flex items-center text-white text-[13px] font-bold uppercase tracking-widest transition-all hover:text-violet-300 hover:gap-4 gap-2 border-b-2 border-transparent hover:border-violet-300 pb-1"
                    style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                  >
                    View Details <span className="text-[16px] leading-none mb-[2px]">→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
