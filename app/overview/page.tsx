"use client";
import React from "react";
import Navbar from "../components/LandingNavbar";
import Footer from "../components/footer";
import PageHero from "../components/PageHero";
import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Overview() {
  const sections = [
    {
      label: "Our Mission",
      text: "At the Western Cyber Society, our mission is to cultivate the next generation of tech leaders by equipping them with the knowledge and skills needed to solve real-world challenges and drive the future of technology forward.",
      image: "/about/mission.jpeg",
      imageAlt: "Our Mission",
      flip: false,
    },
    {
      label: "Our Vision",
      text: "We envision a vibrant and inclusive community of innovators and tech enthusiasts dedicated to advancing the fields of cybersecurity, AI, and mainframe technology — fostering an environment where creativity and collaboration thrive.",
      image: "/about/vision.jpeg",
      imageAlt: "Our Vision",
      flip: true,
    },
    {
      label: "Our Focus",
      text: "Our focus is on hands-on learning, industry partnerships, and events like the Toronto Tech Expo, empowering students to explore cutting-edge technologies, showcase their talents, and connect with leaders in the tech industry.",
      image: "/about/focus.jpeg",
      imageAlt: "Our Focus",
      flip: false,
    },
  ];

  const focusAreas = [
    {
      label: "AI",
      image: "/about/ai.jpg",
      alt: "Artificial Intelligence",
      desc: "Explore innovative AI projects that harness machine learning to create intelligent solutions across domains.",
    },
    {
      label: "Cybersecurity",
      image: "/about/cs.jpg",
      alt: "Cybersecurity",
      desc: "Protecting digital assets and ensuring safe online experiences through cutting-edge techniques.",
    },
    {
      label: "Web3",
      image: "/about/web3.jpg",
      alt: "Web3",
      desc: "Promoting decentralized applications and empowering users with control over their data.",
    },
    {
      label: "Mainframe",
      image: "/about/mainframe.png",
      alt: "Mainframe",
      desc: "Leveraging robust computing power for large-scale data processing and enterprise solutions.",
    },
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <PageHero
        eyebrow="Western Cyber Society"
        title="About Us"
        description="We are a passionate team dedicated to fostering innovation and collaboration in the tech community — empowering individuals through knowledge sharing and hands-on experiences."
        backgroundImage="/gallery/gallery1.jpeg"
      />

      {/* Mission / Vision / Focus sections */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-8 pb-24 space-y-20">
        {sections.map(({ label, text, image, imageAlt, flip }, i) => (
          <motion.div
            key={label}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className={`flex flex-col ${flip ? "md:flex-row-reverse" : "md:flex-row"
              } gap-10 items-center`}
          >
            {/* Image */}
            <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm">
              <Image src={image} alt={imageAlt} fill className="object-cover" />
            </div>

            {/* Text */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-2 md:px-4">
              <p
                className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/35 mb-3"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              >
                {`0${i + 1}`}
              </p>
              <h2
                className="text-[28px] md:text-[38px] font-semibold tracking-tight text-[#1a1a2e] mb-4 leading-tight"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              >
                {label}
              </h2>
              <div className="w-8 h-px bg-black/15 mb-5" />
              <p
                className="text-[15px] md:text-[16px] text-black/55 leading-[1.8]"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              >
                {text}
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Focus Areas */}
      <section className="bg-[#f9f9fb] border-t border-black/[0.04] py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <p
              className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/35 mb-3"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              What We Do
            </p>
            <h2
              className="text-[28px] md:text-[40px] font-semibold tracking-tight text-[#1a1a2e]"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              Our Focus Areas
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {focusAreas.map(({ label, image, alt, desc }, i) => (
              <motion.div
                key={label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: i * 0.08 },
                  },
                }}
                className="bg-white rounded-2xl border border-black/[0.06] shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative w-14 h-14 rounded-full overflow-hidden mb-5 border border-black/[0.06]">
                  <Image src={image} alt={alt} fill className="object-cover" />
                </div>
                <h3
                  className="text-[15px] font-semibold text-[#1a1a2e] mb-3"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  {label}
                </h3>
                <p
                  className="text-[13px] text-black/50 leading-[1.7]"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
