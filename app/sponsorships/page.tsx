"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Image from "next/image";
import { motion } from "framer-motion";

const benefits = [
  {
    title: "Enhanced Brand Visibility",
    description:
      "Sponsoring Western Cyber Society provides unparalleled exposure to a highly engaged audience of tech-savvy students and professionals, allowing you to reach potential customers and talent.",
    color: "from-violet-600 to-purple-600",
  },
  {
    title: "Access to Emerging Talent",
    description:
      "By partnering with us, you gain direct access to a pool of talented students eager to learn and contribute, allowing you to identify potential hires early.",
    color: "from-purple-600 to-pink-500",
  },
  {
    title: "Networking Opportunities",
    description:
      "Engage with other sponsors, industry experts, and academic leaders at our events, fostering valuable connections that can lead to collaborations and partnerships.",
    color: "from-violet-600 to-purple-600",
  },
  {
    title: "Support for Innovation",
    description:
      "Your sponsorship directly funds cutting-edge projects and initiatives, positioning your brand as a champion of innovation and technological advancement.",
    color: "from-purple-600 to-pink-500",
  },
];

const goldBenefits = [
  "Prominent logo placement on event materials, website, and promotional campaigns",
  "Recognition during event announcements and on social media platforms",
  "Two complimentary event tickets for your team",
  "Opportunity to include promotional materials in attendee welcome packets",
  "Access to a dedicated sponsorship liaison to help maximize your presence at the event",
];

const platinumBenefits = [
  "Exclusive logo placement as a Platinum Sponsor on all event materials, website, and digital promotions",
  "Recognition as a key supporter during opening and closing remarks, along with highlighted social media posts",
  "Four complimentary event tickets, allowing your team to network and connect with attendees",
  "Opportunity to host a breakout session or workshop to showcase your expertise",
];

const pastEvents = [
  { image: "/events/TTE4.png", title: "Toronto Tech Expo" },
  { image: "/events/VIPD.png", title: "VIP Dinner" },
  { image: "/events/aiWorkshop.png", title: "AI Workshop" },
  { image: "/events/cyberWorkshop2.png", title: "Cyber Workshop" },
  { image: "/events/ibmWorkshop.png", title: "IBM Workshop" },
  { image: "/events/FD.png", title: "Founders Day" },
];

export default function Sponsorships() {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) {
        setItemsToShow(3);
      } else if (window.innerWidth >= 768) {
        setItemsToShow(2);
      } else {
        setItemsToShow(1);
      }
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  const goToNextEvent = () => {
    setCurrentEventIndex((prev) =>
      prev + 1 >= pastEvents.length - itemsToShow + 1 ? 0 : prev + 1
    );
  };

  const goToPrevEvent = () => {
    setCurrentEventIndex((prev) =>
      prev - 1 < 0 ? pastEvents.length - itemsToShow : prev - 1
    );
  };

  return (
    <>
      <main>
        <div>
          <Navbar />

          {/* Hero Section */}
          <section
            className="mt-40 md:mt-16 relative w-full h-[70vw] md:h-[35vw] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/sponsorBg.jpg')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-violet-900/60 flex items-center">
              <div className="text-white px-6 md:px-16 py-12 max-w-2xl">
                <p className="text-violet-300 text-sm md:text-base font-semibold mb-2 tracking-wider">
                  SPONSORSHIP PROGRAM
                </p>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  Become a Western Cyber Society Sponsor
                </h1>
                <p className="text-sm md:text-lg leading-relaxed text-gray-200 mb-6">
                  Join us in shaping the next generation of tech leaders at Western
                  Cyber Society. Your sponsorship will directly support innovation,
                  education, and hands-on experience for tomorrow&apos;s digital
                  pioneers.
                </p>
                <button
                  onClick={() => window.open("mailto:westerncybersociety@gmail.com", "_blank")}
                  className="tracking-widest rounded-full font-semibold text-white border-2 border-white bg-transparent hover:bg-white hover:text-purple-900 px-8 py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </section>

          {/* Testimonial Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-50px", once: true }}
            className="bg-gray-100 py-8 px-6 md:px-16"
          >
            <div className="max-w-6xl mx-auto">
              <p className="text-gray-700 text-sm md:text-base italic text-center">
                &quot;Toronto Tech Expo was an absolute game changer for us. The energy, innovation, and talent on display were inspiring, and Western Cyber
                Society&apos;s passion to excel in the tech industry was truly something to
                look forward to. Incredible, fantastic, and amazing. The best of the best!&quot;
              </p>
              <p className="text-gray-500 text-sm text-center mt-4">
                — Lance Goldbloom, Lead of Marketing at IBM
              </p>
            </div>
          </motion.div>

          {/* Shape the Future Section */}
          <section className="py-16 px-6 md:px-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-100px", once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
                Shape the Future with Western Cyber Society
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Join us in shaping the next generation of tech leaders at Western Cyber Society. Your sponsorship will
                directly support innovation, education, and hands-on experience for tomorrow&apos;s digital pioneers.
              </p>
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ type: "tween", duration: 0.5 }}
              viewport={{ margin: "-50px", once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
            >
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${benefit.color} text-white shadow-lg hover:scale-105 transition-transform duration-300`}
                >
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-sm text-gray-100">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </section>

          {/* Sponsorship Tiers */}
          <section className="py-16 px-6 md:px-16 bg-gray-50">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-100px", once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
                Sponsorship Tiers
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Join us in shaping the next generation of tech leaders at Western Cyber Society. Your sponsorship will
                directly support innovation, education, and hands-on experience for tomorrow&apos;s digital pioneers.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ type: "tween", duration: 0.5 }}
              viewport={{ margin: "-50px", once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {/* Gold Partner */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-4">
                  <h3 className="text-2xl font-bold text-white text-center">Gold Partner</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {goldBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-500 mr-2 mt-1">•</span>
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Platinum Partner */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-4">
                  <h3 className="text-2xl font-bold text-white text-center">Platinum Partner</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {platinumBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-violet-500 mr-2 mt-1">•</span>
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* CTA Box */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ type: "tween", duration: 0.5 }}
              viewport={{ margin: "-50px", once: true }}
              className="mt-12 max-w-3xl mx-auto"
            >
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-8 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-1/3 h-full opacity-20">
                  <Image
                    src="/gallery/gallery1.jpeg"
                    alt="Sponsorship"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-3">
                    Interested? Become a Western Cyber Society Sponsor
                  </h3>
                  <p className="text-sm text-gray-200 mb-6 max-w-lg">
                    Join us in shaping the next generation of tech leaders at Western Cyber Society. Your sponsorship will directly support innovation, education, and hands-on experience for tomorrow&apos;s digital pioneers.
                  </p>
                  <button
                    onClick={() => window.open("mailto:westerncybersociety@gmail.com", "_blank")}
                    className="tracking-widest rounded-full font-semibold text-purple-600 bg-white hover:bg-gray-100 px-8 py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Past Events Carousel */}
          <section className="py-16 px-6 md:px-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-100px", once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
                Our Past Events
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Join us in shaping the next generation of tech leaders at Western Cyber Society. Your sponsorship will
                directly support innovation, education, and hands-on experience for tomorrow&apos;s digital pioneers.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ type: "tween", duration: 0.5 }}
              viewport={{ margin: "-50px", once: true }}
              className="relative max-w-6xl mx-auto"
            >
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentEventIndex * (100 / itemsToShow)}%)`,
                  }}
                >
                  {pastEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 px-2"
                      style={{ width: `${100 / itemsToShow}%` }}
                    >
                      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg group">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-lg font-bold">{event.title}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevEvent}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-violet-600 hover:bg-violet-700 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors duration-300"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                onClick={goToNextEvent}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-violet-600 hover:bg-violet-700 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-colors duration-300"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </motion.div>
          </section>

          {/* Former Sponsors */}
          <section className="py-16 px-6 md:px-16 bg-gray-50">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-100px", once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
                Recognizing Our Former Sponsors
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Join us in shaping the next generation of tech leaders at Western Cyber Society. Your sponsorship will
                directly support innovation, education, and hands-on experience for tomorrow&apos;s digital pioneers.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ type: "tween", duration: 0.5 }}
              viewport={{ margin: "-50px", once: true }}
              className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto"
            >
              {/* Placeholder sponsor logos - using text for now */}
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-6 w-40 h-24 flex items-center justify-center hover:shadow-lg transition-shadow duration-300"
                >
                  <span className="text-gray-400 font-bold text-lg">Sponsor</span>
                </div>
              ))}
            </motion.div>
          </section>

          <Footer />
        </div>
      </main>
    </>
  );
}
