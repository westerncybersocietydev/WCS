"use client";
import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Overview() {
  return (
    <>
      <main>
        <div>
          <Navbar />

          <section
            className="mt-20 md:mt-16 relative w-full h-[70vw] sm:h-[55vw] md:h-[30vw] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/projectBg.jpg')" }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
                <h1 className="text-xl md:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                  About Us
                </h1>
                <p className="text-sm md:text-lg md:text-xl leading-relaxed">
                  We are a passionate team dedicated to fostering innovation and
                  collaboration in the tech community. Our mission is to empower
                  individuals through knowledge sharing and hands-on experiences
                  in cutting-edge technology.
                </p>
              </div>
            </div>
          </section>

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: "tween", duration: 0.5 }}
            viewport={{ margin: "-50px", once: true }}
            className="flex flex-col w-full h-full"
          >
            <div className="flex flex-col md:flex-row gap-4 m-8 md:space-x-10">
              <div className="relative bg-black rounded-xl md:w-1/2 h-[90vw] md:h-[56vw] shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)] overflow-hidden">
                <Image
                  src="/mission.jpeg"
                  alt="Our Mission"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col mx-auto text-center md:text-left justify-center bg-violet-950 rounded-xl p-10 md:w-1/2 shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]">
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-white">
                  Our
                </h2>
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-white">
                  Mission
                </h2>
                <p className="mt-6 text-md md:text-2xl font-semibold text-white">
                  At the Western Cyber Society, our mission is to cultivate the
                  next generation of tech leaders by equipping them with the
                  knowledge and skills needed to solve real-world challenges and
                  drive the future of technology forward.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: "tween", duration: 0.5 }}
            viewport={{ margin: "-50px", once: true }}
            className="flex flex-col w-full h-full"
          >
            <div className="flex flex-col md:flex-row gap-4 m-8 md:space-x-10">
              <div className="flex flex-col mx-auto text-center md:text-left bg-violet-950 justify-center rounded-xl p-16 md:w-1/2 shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]">
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-white">
                  Our
                </h2>
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-white">
                  Vision
                </h2>
                <p className="mt-6 text-md md:text-2xl font-semibold text-white">
                  We envision a vibrant and inclusive community of innovators
                  and tech enthusiasts who are dedicated to advancing the fields
                  of cybersecurity, AI, and mainframe technology. Our goal is to
                  inspire and empower individuals from diverse backgrounds to
                  become leaders in technology, fostering an environment where
                  creativity and collaboration thrive.
                </p>
              </div>

              <div className="relative bg-black rounded-xl md:w-1/2 h-[90vw] md:h-[56vw] shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]">
                <Image
                  src="/vision.jpeg"
                  alt="Our Vision"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ type: "tween", duration: 0.5 }}
            viewport={{ margin: "-50px", once: true }}
            className="flex flex-col w-full h-full"
          >
            <div className="flex flex-col md:flex-row gap-4 m-8 md:space-x-10">
              <div className="relative bg-black rounded-xl md:w-1/2 h-[90vw] md:h-[56vw] shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]">
                <Image
                  src="/focus.jpeg"
                  alt="Our Focus"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex flex-col mx-auto text-center md:text-left justify-center bg-violet-950 rounded-xl p-16 md:w-1/2 shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)]">
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-white">
                  Our
                </h2>
                <h2 className="text-4xl md:text-6xl lg:text-8xl font-extrabold text-white">
                  Focus
                </h2>
                <p className="mt-6 text-md md:text-2xl font-semibold text-white">
                  Our focus is on hands-on learning, industry partnerships, and
                  events like the Toronto Tech Expo, empowering students to
                  explore cutting-edge technologies, showcase their talents, and
                  connect with leaders in the tech industry.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex w-full h-full">
            <div className="flex flex-col items-center bg-violet-950 rounded-xl shadow-[0_2px_5px_2px_rgba(0,0,0,0.75)] mx-8 my-8">
              <motion.h1
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: "-100px", once: true }}
                className="text-5xl font-extrabold text-center text-white mt-10 mb-4"
              >
                Our Focus Areas
              </motion.h1>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ type: "tween", duration: 0.5 }}
                viewport={{ margin: "-50px", once: true }}
                className="flex flex-col md:flex-row gap-2 md:gap-0 md:space-x-1 w-full text-center"
              >
                <div className="flex flex-col items-center rounded-xl p-5 w-full">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <Image
                      src="/ai.jpg"
                      alt="Artificial Intelligence"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <h2 className="mt-6 text-2xl font-extrabold text-white">
                    AI
                  </h2>
                  <p className="mt-3 text-md text-white">
                    Explore our innovative AI projects that harness machine
                    learning algorithms to create intelligent solutions,
                    enhancing decision-making and efficiency across various
                    domains.
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-xl p-5 w-full ">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <Image
                      src="/cs.jpg"
                      alt="Cybersecurity"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <h2 className="mt-6 text-2xl font-extrabold text-white">
                    Cybersecurity
                  </h2>
                  <p className="mt-3 text-md text-white">
                    Dive into our cybersecurity initiatives focused on
                    protecting digital assets and ensuring safe online
                    experiences through cutting-edge techniques and proactive
                    threat management.
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-xl p-5 w-full ">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <Image
                      src="/web3.jpg"
                      alt="WEB3"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <h2 className="mt-6 text-2xl font-extrabold text-white">
                    Web3
                  </h2>
                  <p className="mt-3 text-md text-white">
                    Discover our Web3 projects that aim to revolutionize the
                    internet by promoting decentralized applications and
                    empowering users with greater control over their data and
                    online interactions.
                  </p>
                </div>

                <div className="flex flex-col items-center rounded-xl p-5 w-full ">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden">
                    <Image
                      src="/mainframe.png"
                      alt="Mainframe"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <h2 className="mt-6 text-2xl font-extrabold text-white">
                    Mainframe
                  </h2>
                  <p className="mt-3 text-md text-white">
                    Learn about our mainframe projects that leverage robust
                    computing power to support large-scale data processing and
                    enterprise solutions, ensuring reliability and security in
                    critical business operations.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          <Footer />
        </div>
      </main>
    </>
  );
}
