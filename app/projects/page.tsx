"use client";
import React, { useState } from "react";
import Navbar from "../components/LandingNavbar";
import Footer from "../components/footer";
import PageHero from "../components/PageHero";
import { Switch } from "@nextui-org/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Project,
  ProjectCardProps,
  projects,
} from "../dataFiles/projectPage/projects";

const ProjectCard: React.FC<ProjectCardProps> = React.memo(
  ({ title, director, description, peopleCount, difficulty, imageUrl, status, year }) => (
    <div className="group relative bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        {status === "Archived" && (
          <span className="absolute top-3 right-3 z-10 text-[11px] font-semibold bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full">
            Archived
          </span>
        )}
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h2
          className="text-[15px] font-semibold text-[#1a1a2e] mb-1"
          style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
        >
          {title}
        </h2>
        <p
          className="text-[12px] text-black/40 mb-3"
          style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
        >
          {director}
        </p>
        <p
          className="text-[13px] text-black/55 leading-[1.7] flex-1 mb-4"
          style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
        >
          {description}
        </p>
        <div className="flex items-center gap-4 text-[12px] text-black/40 border-t border-black/[0.04] pt-3">
          <span
            className="flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
            </svg>
            {peopleCount}
          </span>
          <span
            className="flex items-center gap-1.5"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {difficulty}
          </span>
          {status === "Archived" && year && (
            <span
              className="ml-auto"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              {year}
            </span>
          )}
        </div>
      </div>
    </div>
  )
);

ProjectCard.displayName = "ProjectCard";

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showArchived, setShowArchived] = React.useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || project.category === selectedCategory;
    const matchesStatus = showArchived || project.status === "Active";
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const groupedProjects = filteredProjects.reduce(
    (acc: Record<string, Project[]>, project: Project) => {
      if (!acc[project.category]) acc[project.category] = [];
      acc[project.category].push(project);
      return acc;
    },
    {}
  );

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <PageHero
        eyebrow="Student Initiatives"
        title="SIP Projects"
        description="Our Student Initiative Projects showcase creative solutions developed by members, tackling real-world challenges through teamwork and technical skills."
        backgroundImage="/gallery/gallery14.jpeg"
      />

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between bg-[#f9f9fb] border border-black/[0.06] rounded-2xl p-4"
        >
          <h2
            className="text-[15px] font-semibold text-[#1a1a2e]"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            Student Innovation Projects
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full sm:w-56 text-[13px] text-black/70 bg-white border border-black/10 rounded-full px-4 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-[#4a4a6a]/20 transition-all placeholder:text-black/30"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              />
              <svg className="absolute right-3 top-2.5 w-4 h-4 text-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category */}
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="text-[13px] text-black/70 bg-white border border-black/10 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4a4a6a]/20 transition-all"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              <option value="All">All Categories</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Mainframe">Mainframe</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Web3">Web3</option>
            </select>

            {/* Archived toggle */}
            <label className="flex items-center gap-2 text-[13px] text-black/55 cursor-pointer whitespace-nowrap"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
              <Switch isSelected={showArchived} onValueChange={setShowArchived} />
              Show Archived
            </label>
          </div>
        </motion.div>
      </section>

      {/* Project Grid */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
        {filteredProjects.length > 0 ? (
          Object.keys(groupedProjects).map((category) => (
            <div key={category} className="mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-[18px] font-semibold text-[#1a1a2e] mb-6 pb-3 border-b border-black/[0.06]"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              >
                {category}
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {groupedProjects[category].map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                  >
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      director={project.director.name}
                      peopleCount={project.peopleCount}
                      difficulty={project.difficulty}
                      imageUrl={project.projectImg}
                      status={project.status}
                      year={project.year}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p
            className="text-center text-black/40 py-20 text-[15px]"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            No projects match your criteria.
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="bg-[#f9f9fb] border-t border-black/[0.04] py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <p
            className="text-[11px] font-semibold tracking-[0.2em] uppercase text-black/35 mb-3"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            Get Involved
          </p>
          <h2
            className="text-[28px] md:text-[36px] font-semibold tracking-tight text-[#1a1a2e] mb-4"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            Intrigued?
          </h2>
          <p
            className="text-[15px] text-black/50 leading-[1.8] mb-8"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            Interested in joining one of our projects? Apply using the link below, or reach out via our{" "}
            <Link href="/contact" className="text-[#4a4a6a] hover:underline">
              Contact Us
            </Link>{" "}
            page.
          </p>
          <button
            onClick={() => window.open("https://forms.gle/dwpx4Y5u2T3tAupK9", "_blank")}
            className="bg-gradient-to-br from-[#1a1a2e] via-[#4a4a6a] to-[#1a1a2e] text-white text-sm font-medium px-8 py-3.5 rounded-full hover:scale-105 transition-transform shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)]"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            Apply Now
          </button>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
