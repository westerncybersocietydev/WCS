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
    image: "/IBMN.png",
    link: "/events?event=IBMNight",
  },
  {
    title: "VIP Dinner",
    description:
      "An exclusive invite-only dinner for our top members and sponsors.",
    image: "/VIPD.png",
    link: "/events?event=VIPDinner",
  },
  {
    title: "FAANG Day",
    description:
      "Networking day featuring engineers and recruiters from top tech companies.",
    image: "/FD.png",
    link: "/events?event=FAANGDay",
  },
  {
    title: "Toronto Tech Expo",
    description:
      "Join us on a trip to the biggest technology conference in Toronto.",
    image: "/TTE.png",
    link: "/events?event=TorontoTechExpo",
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
          src="/newlanding1.jpeg"
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
              {/* Background Image that blurs on hover */}
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.08] group-hover:blur-md"
              />

              {/* Darkening overlay for text readability */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

              {/* Content Overlay (Revealed on hover) */}
              <div className="absolute inset-0 flex flex-col justify-center items-center p-8 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] text-center text-white z-20">
                <p
                  className="text-[16px] md:text-[18px] opacity-95 leading-relaxed font-medium drop-shadow-lg"
                  style={{
                    fontFamily:
                      "var(--font-geist-sans), 'Geist', sans-serif",
                  }}
                >
                  {event.description}
                </p>

                <div className="absolute bottom-8">
                  <Link
                    href={event.link}
                    className="inline-flex items-center text-white text-sm font-semibold transition-all group-hover:gap-3 gap-2 tracking-wide"
                    style={{
                      fontFamily:
                        "var(--font-geist-sans), 'Geist', sans-serif",
                    }}
                  >
                    View Details{" "}
                    <span className="transform transition-transform text-[16px]">
                      →
                    </span>
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
