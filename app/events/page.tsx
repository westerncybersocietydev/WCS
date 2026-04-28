"use client";
import Navbar from "../components/LandingNavbar";
import Footer from "../components/footer";
import PageHero from "../components/PageHero";
import Carousel from "../components/eventCarousel";
import Image from "next/image";
import { motion } from "framer-motion";
import { images } from "../dataFiles/eventPage/images";

// How to add/edit an event:
// - Upload event image to public/events
// - Log into MongoDB
// - Open collections and go to Events table.
// - On there, add/edit events.
// - For the image, put in the file path to the image (check other events as reference).

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Events() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <PageHero
        eyebrow="Western Cyber Society"
        title="Events"
        description="We host a variety of events aimed at bringing together tech enthusiasts, industry professionals, and students for networking and knowledge exchange. From workshops to guest lectures, our events provide valuable opportunities for learning and collaboration."
        backgroundImage="/gallery/gallery5.jpeg"
      />

      {/* ── All Events ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
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

      {/* ── Time Capsule ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#f9f9fb] border-t border-black/[0.04]">
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
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: (index % 3) * 0.07, ease: "easeOut" },
                  },
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
        </div>
      </section>

      <Footer />
    </main>
  );
}
