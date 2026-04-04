"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Navbar from "../components/LandingNavbar";
import PageHero from "../components/PageHero";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const benefits = [
  {
    title: "Emerging Talent Access",
    description:
      "Engage directly with skilled, motivated students from universities across Ontario in fields like cybersecurity, AI, Web3, and more.",
  },
  {
    title: "Strategic Brand Visibility",
    description:
      "Showcase your organization across CTS and WCS campaigns, digital outreach, and event signage within a growing regional tech ecosystem.",
  },
  {
    title: "Shared Innovation Vision",
    description:
      "Align your brand with a mission focused on innovation, education, and workforce development in Canada's technology sector.",
  },
  {
    title: "Proven Community Impact",
    description:
      "Partner with a student organization that consistently delivers technical workshops, competitions, and impactful community events.",
  },
];

const sponsorshipTiers = [
  {
    name: "Community Partner",
    price: "Regular Admission",
    headerColor: "from-[#7c3aed] to-[#a855f7]",
    accent: "text-[#7c3aed]",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    dotColor: "from-[#7c3aed] to-[#a855f7]",
    benefits: [
      "Attend the summit and experience the Canadian Tech Summit firsthand",
      "Network with emerging tech talent and industry professionals",
    ],
  },
  {
    name: "Silver Partner",
    price: "$1,500",
    headerColor: "from-[#8a9bb5] to-[#b0c4d8]",
    accent: "text-[#8a9bb5]",
    icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
    dotColor: "from-[#8a9bb5] to-[#b0c4d8]",
    benefits: [
      "Recognition on the event website and select digital promotions",
      "Post-event access to student resume database",
      "Acknowledgment during ceremonies",
    ],
  },
  {
    name: "Gold Partner",
    price: "$3,000",
    headerColor: "from-[#d97706] to-[#f59e0b]",
    accent: "text-[#d97706]",
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    dotColor: "from-[#d97706] to-[#f59e0b]",
    benefits: [
      "All Silver Partner benefits",
      "Dedicated booth to showcase your organization and engage directly with students",
      "Exclusive coffee chat session with top participants",
      "Opportunity for a panel or judging role, highlighting your expertise",
    ],
  },
  {
    name: "Platinum Partner",
    price: "$5,000",
    headerColor: "from-[#1a1a2e] to-[#2d2d4e]",
    accent: "text-[#1a1a2e]",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    dotColor: "from-[#1a1a2e] to-[#2d2d4e]",
    benefits: [
      "All Gold Partner benefits",
      "Priority brand placement across the venue and all digital channels",
      "Opportunity to name an award, project track, or event category",
      "Keynote speaking opportunity to spotlight your organization's vision",
      '"Presented by" distinction for premier visibility',
    ],
  },
];

const sponsorLogos = [
  { src: "/past-end/amazon.png" },
  { src: "/past-end/bell.png" },
  { src: "/past-end/cohere2.png" },
  { src: "/past-end/ibm.png" },
  { src: "/past-end/internetComputer.png" },
  { src: "/past-end/ivey.png" },
  { src: "/past-end/meta.png" },
  { src: "/past-end/square.png" },
  { src: "/past-end/tdBank.png" },
  { src: "/past-end/westernEngineering.png" },
  { src: "/past-end/westingHouse.png" },
];

const pastEvents = [
  { image: "/events/TTE4.png", title: "Toronto Tech Expo" },
  { image: "/events/VIPD.png", title: "VIP Dinner" },
  { image: "/events/aiworkshop2.png", title: "AI Workshop" },
  { image: "/events/cyberworkshop2.png", title: "Cyber Workshop" },
  { image: "/events/ibmworkshop2.png", title: "IBM Workshop" },
  { image: "/events/FD.png", title: "Founders Day" },
];

const tableRows = [
  { label: "Event access", community: true, silver: true, gold: true, platinum: true },
  { label: "Social media recognition", community: false, silver: true, gold: true, platinum: true },
  { label: "Ceremony recognition", community: false, silver: true, gold: true, platinum: true },
  { label: "Access to student portfolios", community: false, silver: true, gold: true, platinum: true },
  { label: "Dedicated booth", community: false, silver: false, gold: true, platinum: true },
  { label: "Coffee chat session", community: false, silver: false, gold: true, platinum: true },
  { label: "Panel/judge position", community: false, silver: false, gold: true, platinum: true },
  { label: "Priority brand placement", community: false, silver: false, gold: false, platinum: true },
  { label: "Named award/category", community: false, silver: false, gold: false, platinum: true },
  { label: "Keynote presentation", community: false, silver: false, gold: false, platinum: true },
  { label: '"Presented by" distinction', community: false, silver: false, gold: false, platinum: true },
];

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Sponsorships() {
  const router = useRouter();
  const [currentEventIndex, setCurrentEventIndex] = useState(pastEvents.length);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const touchStartX = React.useRef(0);

  const extendedEvents = [...pastEvents, ...pastEvents, ...pastEvents];

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth >= 1024) setItemsToShow(3);
      else if (window.innerWidth >= 768) setItemsToShow(2);
      else setItemsToShow(1);
    };
    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  const goToNextEvent = () => {
    setIsTransitioning(true);
    setCurrentEventIndex((prev) => prev + 1);
  };

  const goToPrevEvent = () => {
    setIsTransitioning(true);
    setCurrentEventIndex((prev) => prev - 1);
  };

  const goToEvent = (i: number) => {
    setIsTransitioning(true);
    setCurrentEventIndex(pastEvents.length + i);
  };

  const handleTransitionEnd = () => {
    if (currentEventIndex >= pastEvents.length * 2) {
      setIsTransitioning(false);
      setCurrentEventIndex(pastEvents.length);
    } else if (currentEventIndex < pastEvents.length) {
      setIsTransitioning(false);
      setCurrentEventIndex(pastEvents.length * 2 - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      if (delta > 0) goToNextEvent();
      else goToPrevEvent();
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <Navbar />

      <PageHero
        eyebrow="Sponsorship Program"
        title="Become a CTS Sponsor"
        description="The Canadian Tech Summit is Western Cyber Society's flagship event. Sponsors gain access to emerging tech talent, premium brand visibility, and opportunities to shape Canada's technology ecosystem."
        backgroundImage="/gallery/gallery4.jpeg"
      >
        <button
          onClick={() => router.push("/contact?sponsor=true")}
          className="bg-white text-[#1a1a2e] text-sm font-semibold px-8 py-3.5 rounded-full hover:scale-105 transition-transform shadow-sm"
          style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
        >
          Get in Touch
        </button>
      </PageHero>

      {/* Testimonial */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={fadeUp}
        className="max-w-3xl mx-auto px-6 pt-8 mb-8 text-center"
      >
        <div className="bg-[#f9f9fb] border border-black/[0.05] rounded-2xl px-8 py-8">
          <p
            className="text-[15px] text-black/55 leading-[1.8] italic mb-4"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            &quot;Toronto Tech Expo was an absolute game changer for us. The energy, innovation, and talent on display were inspiring, and the passion to excel in the tech industry was truly something to look forward to. Incredible, fantastic, and amazing. The best of the best!&quot;
          </p>
          <p
            className="text-[13px] text-black/35 font-medium"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            — Lance Goldbloom, Lead of Marketing at IBM
          </p>
        </div>
      </motion.div>

      {/* About CTS */}
      <section className="pt-6 pb-16 px-6 md:px-16 max-w-5xl mx-auto">
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
            Our Flagship Event
          </p>
          <h2
            className="text-[24px] md:text-[36px] font-semibold tracking-tight text-[#1a1a2e] mb-4"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            About the Canadian Tech Summit
          </h2>
          <p
            className="text-[15px] text-black/50 leading-[1.8] max-w-3xl"
            style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
          >
            The Canadian Tech Summit (CTS), organized by Western Cyber Society, is a premier platform connecting students, industry professionals, and emerging technology talent. Originally the Toronto Tech Expo, CTS has been reimagined in London, Ontario to foster inclusivity, hands-on learning, and direct engagement between sponsors and the next generation of innovators.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-30px" }}
              variants={{ hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: (index % 2) * 0.08 } } }}
              className="bg-[#f9f9fb] border border-black/[0.05] rounded-2xl p-6 hover:shadow-sm transition-shadow duration-300"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#4a4a6a] mb-4 flex items-center justify-center">
                <span className="text-white text-[11px] font-bold">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3
                className="text-[15px] font-semibold text-[#1a1a2e] mb-2"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              >
                {benefit.title}
              </h3>
              <p
                className="text-[13px] text-black/50 leading-[1.7]"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              >
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-16 px-6 md:px-16 bg-[#f9f9fb] border-t border-black/[0.04]">
        <div className="max-w-5xl mx-auto">
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
              Partner With Us
            </p>
            <h2
              className="text-[24px] md:text-[36px] font-semibold tracking-tight text-[#1a1a2e] mb-4"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              Sponsorship Packages
            </h2>
            <p
              className="text-[15px] text-black/50 leading-[1.8] max-w-3xl"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              Choose the level that best matches your goals. Each package offers a clear way to support CTS while engaging with Canada&apos;s next wave of tech leaders.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {sponsorshipTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={{ hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: (index % 2) * 0.08 } } }}
                className="bg-white rounded-2xl border border-black/[0.06] shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className={`bg-gradient-to-r ${tier.headerColor} p-5 flex items-center justify-between`}>
                  <div>
                    <h3
                      className="text-[18px] font-semibold text-white"
                      style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                    >
                      {tier.name}
                    </h3>
                    <p
                      className="text-white/70 text-[13px] mt-0.5"
                      style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                    >
                      {tier.price}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={tier.icon} />
                    </svg>
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <ul className="space-y-2.5">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className={`${tier.accent} font-bold mt-0.5 shrink-0`}>✓</span>
                        <span
                          className="text-[13px] text-black/60 leading-[1.6]"
                          style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                        >
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Benefits Table */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
          >
            <h3
              className="text-[18px] font-semibold text-[#1a1a2e] mb-5"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              Benefits at a Glance
            </h3>
            <div className="overflow-x-auto bg-white rounded-2xl border border-black/[0.06] shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[0.06]">
                    <th className="px-6 py-4 text-left text-[12px] font-semibold text-black/40 uppercase tracking-wider" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>Benefit</th>
                    <th className="px-5 py-4 text-center" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7]" />
                        <span className="text-[11px] font-semibold text-black/50 uppercase tracking-wider">Community</span>
                      </div>
                    </th>
                    <th className="px-5 py-4 text-center" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#8a9bb5] to-[#b0c4d8]" />
                        <span className="text-[11px] font-semibold text-black/50 uppercase tracking-wider">Silver</span>
                      </div>
                    </th>
                    <th className="px-5 py-4 text-center" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#d97706] to-[#f59e0b]" />
                        <span className="text-[11px] font-semibold text-black/50 uppercase tracking-wider">Gold</span>
                      </div>
                    </th>
                    <th className="px-5 py-4 text-center" style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}>
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e]" />
                        <span className="text-[11px] font-semibold text-black/50 uppercase tracking-wider">Platinum</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.04]">
                  {tableRows.map((row, index) => (
                    <tr key={index} className="hover:bg-black/[0.015] transition-colors">
                      <td
                        className="px-6 py-3.5 text-[13px] text-black/65 font-medium"
                        style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                      >
                        {row.label}
                      </td>
                      {(["community", "silver", "gold", "platinum"] as const).map((tierKey) => (
                        <td key={tierKey} className="px-5 py-3.5 text-center">
                          {row[tierKey] ? (
                            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                          ) : (
                            <span className="text-black/15 text-[13px]">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* CTA — Let's Work Together */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="mt-10 relative rounded-2xl overflow-hidden"
          >
            {/* Blurred background image */}
            <div className="absolute inset-0">
              <Image
                src="/gallery/gallery1.jpeg"
                alt=""
                fill
                className="object-cover scale-110 blur-sm"
              />
              <div className="absolute inset-0 bg-[#1a1a2e]/80" />
            </div>
            <div className="relative z-10 p-12 md:p-16 text-center">
              <h3
                className="text-[24px] md:text-[32px] font-semibold text-white mb-4"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              >
                Let&apos;s Work Together
              </h3>
              <p
                className="text-[14px] text-white/55 leading-[1.8] mb-8 max-w-lg mx-auto"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              >
                Join us in fostering tomorrow&apos;s tech talent. Connect with the Canadian Tech Summit to explore sponsorships, partnerships, or custom engagement opportunities.
              </p>
              <button
                onClick={() => router.push("/contact?sponsor=true")}
                className="bg-white text-[#1a1a2e] text-sm font-semibold px-8 py-3.5 rounded-full hover:scale-105 transition-transform shadow-lg"
                style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
              >
                Sponsor Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Past Events Carousel */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
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
              Our Legacy
            </p>
            <h2
              className="text-[24px] md:text-[36px] font-semibold tracking-tight text-[#1a1a2e]"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              Past Events
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="relative"
          >
            <div
              className="overflow-hidden rounded-2xl"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex"
                style={{
                  transform: `translateX(-${currentEventIndex * (100 / itemsToShow)}%)`,
                  transition: isTransitioning ? "transform 350ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {extendedEvents.map((event, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 px-2"
                    style={{ width: `${100 / itemsToShow}%` }}
                  >
                    <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-md group cursor-pointer">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-5 left-5">
                        <h3
                          className="text-[15px] font-semibold text-white drop-shadow-md"
                          style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
                        >
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={goToPrevEvent}
                className="w-10 h-10 rounded-full bg-[#1a1a2e] text-white shadow-sm flex items-center justify-center hover:bg-[#2a2a4e] active:scale-95 transition-all duration-150"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex gap-1.5">
                {pastEvents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToEvent(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${(currentEventIndex % pastEvents.length) === i
                      ? "w-6 bg-[#1a1a2e]"
                      : "w-1.5 bg-black/15 hover:bg-black/30"
                      }`}
                  />
                ))}
              </div>
              <button
                onClick={goToNextEvent}
                className="w-10 h-10 rounded-full bg-[#1a1a2e] text-white shadow-sm flex items-center justify-center hover:bg-[#2a2a4e] active:scale-95 transition-all duration-150"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Past Sponsors */}
      <section className="py-16 px-6 md:px-16 bg-[#f9f9fb] border-t border-black/[0.04]">
        <div className="max-w-5xl mx-auto">
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
              Who&apos;s Been With Us
            </p>
            <h2
              className="text-[24px] md:text-[36px] font-semibold tracking-tight text-[#1a1a2e] mb-3"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              Past Endorsements
            </h2>
            <p
              className="text-[15px] text-black/50 leading-[1.8] max-w-2xl"
              style={{ fontFamily: "var(--font-geist-sans), 'Geist', sans-serif" }}
            >
              These organizations have previously endorsed and supported events led by Western Cyber Society and the Canadian Tech Summit. Their past involvement helped shape our journey and build the foundation for today’s flagship summit.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={fadeUp}
            className="flex flex-wrap justify-center items-center gap-4"
          >
            {sponsorLogos.map((logo, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl border border-black/[0.06] shadow-sm w-44 h-28 flex items-center justify-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <Image
                  src={logo.src}
                  alt={`Sponsor ${index + 1}`}
                  fill
                  className="object-contain p-4"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
