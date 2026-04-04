"use client";
import React, { useState } from "react";
import Navbar from "../components/LandingNavbar";
import Footer from "../components/footer";
import PageHero from "../components/PageHero";
import { motion } from "framer-motion";
import Image from "next/image";
import { TeamMember, teamData } from "../dataFiles/teamPage/members";

type TeamCardProps = {
  member: TeamMember;
  index: number;
};

const TeamCard: React.FC<TeamCardProps> = ({ member, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      viewport={{ once: true, margin: "-40px" }}
      className="relative group bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Photo */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={index < 6}
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info strip */}
      <div className="p-4">
        <h3
          className="text-[15px] font-semibold text-[#1a1a2e]"
          style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
        >
          {member.name}
        </h3>
        <p
          className="text-[13px] text-black/45 mt-0.5"
          style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
        >
          {member.title}
        </p>

        {/* Hover extras */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isHovered ? "max-h-20 mt-3 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <p
              className="text-[12px] text-black/40"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              {member.program}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.open(`mailto:${member.email}`)}
                className="text-black/40 hover:text-[#1a1a2e] transition-colors"
                aria-label="Email"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={() => window.open(member.linkedin || "", "_blank")}
                className="text-black/40 hover:text-[#1a1a2e] transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function MeetTheTeam() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <PageHero
        eyebrow="The People Behind WCS"
        title="Meet the Team"
        description="Get to know the diverse group of talented individuals behind our organization, each bringing unique skills and perspectives to drive innovation."
        backgroundImage="/gallery/gallery3.jpeg"
      />

      {/* Team Grid */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-8 pb-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamData.map((member, index) => (
            <TeamCard key={index} member={member} index={index} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
