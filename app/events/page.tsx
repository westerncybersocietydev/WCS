"use client";
import Navbar from "../components/LandingNavbar";
import Footer from "../components/footer";
import PageHero from "../components/PageHero";
import Carousel from "../components/eventCarousel";
import Image from "next/image";
import { motion } from "framer-motion";
import { images } from "../dataFiles/eventPage/images";
import { useRouter } from "next/navigation";

// How to add/edit an event:
// - Upload event image to public/events
// - Log into MongoDB
// - Open collections and go to Events table.
// - On there, add/edit events.
// - For the image, put in the file path to the image (check other events as reference).


const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const featuredEvents = [
  {
    title: "Recruit Ready",
    subtitle: "Get Your Tickets Now!",
    route: "/recruit-ready",
    bg: "/events/recruitready.png",
  },
  {
    title: "Lost Love Bar Night",
    subtitle: "Get Your Wristbands Now!",
    route: "/lost-love-bar-night",
    bg: "/projectBg.jpg",
  },
];

export default function Events() {
  const router = useRouter();

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <PageHero
        eyebrow="Western Cyber Society"
        title="Events"
        description="We host a variety of events aimed at bringing together tech enthusiasts, industry professionals, and students for networking and knowledge exchange. From workshops to guest lectures, our events provide valuable opportunities for learning and collaboration."
        backgroundImage="/gallery/gallery5.jpeg"
      />

      {/* Featured Events */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-8 pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="mb-10"
        >
          <p
            className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/35 mb-2"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            Happening Now
          </p>
          <h2
            className="text-[24px] md:text-[32px] font-semibold tracking-tight text-[#1a1a2e]"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            Featured Events
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredEvents.map(({ title, subtitle, route, bg }, i) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } },
              }}
              onClick={() => router.push(route)}
              className="group relative aspect-[16/9] rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm cursor-pointer hover:shadow-md transition-all duration-300"
            >
              <Image src={bg} alt={title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/70 via-[#1a1a2e]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p
                  className="text-white/60 text-[12px] font-medium mb-1 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  {subtitle}
                </p>
                <h3
                  className="text-white text-[20px] md:text-[24px] font-semibold"
                  style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                >
                  {title}
                </h3>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Event Carousel */}
      <section className="bg-[#f9f9fb] border-t border-black/[0.04] py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="mb-10"
          >
            <p
              className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/35 mb-2"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              Upcoming
            </p>
            <h2
              className="text-[24px] md:text-[32px] font-semibold tracking-tight text-[#1a1a2e]"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              All Events
            </h2>
          </motion.div>
          <Carousel />
        </div>
      </section>

      {/* Time Capsule */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="mb-10"
        >
          <p
            className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/35 mb-2"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            Memories
          </p>
          <h2
            className="text-[24px] md:text-[32px] font-semibold tracking-tight text-[#1a1a2e]"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            WCS Time Capsule
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: (index % 3) * 0.07 } },
              }}
              className="relative aspect-square rounded-2xl overflow-hidden border border-black/[0.06] shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <Image
                src={src}
                alt={`WCS memory ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
