"use client";
import React, { useState, useEffect } from "react";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const benefits = [
  {
    title: "Emerging Talent Access",
    description:
      "Engage directly with skilled, motivated students from universities across Ontario in fields like cybersecurity, AI, Web3, and more.",
    color: "from-violet-600 to-purple-600",
  },
  {
    title: "Strategic Brand Visibility",
    description:
      "Showcase your organization across CTS and WCS campaigns, digital outreach, and event signage within a growing regional tech ecosystem.",
    color: "from-purple-600 to-pink-500",
  },
  {
    title: "Shared Innovation Vision",
    description:
      "Align your brand with a mission focused on innovation, education, and workforce development in Canada’s technology sector.",
    color: "from-violet-600 to-purple-600",
  },
  {
    title: "Proven Community Impact",
    description:
      "Partner with a student organization that consistently delivers technical workshops, competitions, and impactful community events.",
    color: "from-purple-600 to-pink-500",
  },
];

const sponsorshipTiers = [
  {
    name: "Community Partner",
    price: "Regular Admission",
    headerColor: "from-sky-500 to-blue-500",
    benefits: [
      "Attend the summit and experience the Canadian Tech Summit firsthand",
      "Network with emerging tech talent and industry professionals",
    ],
  },
  {
    name: "Silver Partner",
    price: "$1,500",
    headerColor: "from-gray-500 to-slate-600",
    benefits: [
      "Recognition on the event website and select digital promotions",
      "Post-event access to student resume database",
      "Acknowledgment during ceremonies",
    ],
  },
  {
    name: "Gold Partner",
    price: "$3,500",
    headerColor: "from-yellow-500 to-amber-500",
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
    headerColor: "from-violet-600 to-purple-600",
    benefits: [
      "All Gold Partner benefits",
      "Priority brand placement across the venue and all digital channels",
      "Opportunity to name an award, project track, or event category",
      "Keynote speaking opportunity to spotlight your organization’s vision",
      '“Presented by” distinction for premier visibility',
    ],
  },
];

const sponsorLogos = [
  { src: "/sponsor-logos/Google.webp", scale: 1 },
  { src: "/sponsor-logos/bell.png", scale: 1 },
  { src: "/sponsor-logos/cohere.png", scale: 1 },
  { src: "/sponsor-logos/IBM.png", scale: 1 },
  { src: "/sponsor-logos/amazon.png", scale: 0.75 }, 
  { src: "/sponsor-logos/Meta.png", scale: 1.4 },   
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
  const router = useRouter();
  
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

          <section className="mt-32 md:mt-20 w-full bg-[#3B0B8F] py-20 px-6 md:px-16 relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

              <div className="relative z-10">
                <p className="text-purple-200 text-sm md:text-base tracking-widest mb-3">
                  SPONSORSHIP PROGRAM
                </p>

                <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4">
                  Become a Canadian Tech Summit Sponsor
                </h1>

                <p className="text-purple-100 text-sm md:text-lg leading-relaxed mb-6">
                  The Canadian Tech Summit (CTS) is Western Cyber Society’s flagship event.
                  Sponsors gain access to emerging tech talent, premium brand visibility,
                  and opportunities to support innovation in Canada’s technology ecosystem.
                </p>

                <button
                  onClick={() => router.push("/contact?sponsor=true")}
                  className="relative z-20 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-xl transition pointer-events-auto"
                >
                  Contact Us
                </button>
              </div>

              {/* RIGHT IMAGES */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative h-40 md:h-48 rounded-xl overflow-hidden pointer-events-none">
                  <Image src="/gallery/gallery3.jpeg" alt="CTS" fill className="object-cover" />
                </div>
                <div className="relative h-40 md:h-48 rounded-xl overflow-hidden pointer-events-none">
                  <Image src="/gallery/gallery4.jpeg" alt="CTS" fill className="object-contain" />
                </div>
                <div className="relative col-span-2 h-40 md:h-48 rounded-xl overflow-hidden pointer-events-none">
                  <Image src="/gallery/gallery28.jpeg" alt="CTS" fill className="object-cover object-contain" />
                </div>
              </div>
            </div>
          </section>

          {/* Testimonial Banner */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ margin: "-50px", once: true }}
            className="bg-gray-200 py-8 px-6 md:px-16"
          >
            <div className="max-w-6xl mx-auto">
              <p className="text-gray-700 text-sm md:text-base italic text-center">
                &quot;Toronto Tech Expo was an absolute game changer for us. The
                energy, innovation, and talent on display were inspiring, and
                the passion to excel in the tech industry was truly something to
                look forward to. Incredible, fantastic, and amazing. The best of
                the best!&quot;
              </p>
              <p className="text-gray-500 text-sm text-center mt-4">
                — Lance Goldbloom, Lead of Marketing at IBM
              </p>
            </div>
          </motion.div>

          {/* About CTS / Why Sponsor */}
          <section className="py-16 px-6 md:px-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-100px", once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
                About the Canadian Tech Summit
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                The Canadian Tech Summit (CTS), organized by Western Cyber
                Society, is a premier platform connecting students, industry
                professionals, and emerging technology talent. Originally the
                Toronto Tech Expo, CTS has been reimagined in London, Ontario to
                foster inclusivity, hands-on learning, and direct engagement
                between sponsors and the next generation of innovators.
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
                  className={`relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br ${benefit.color} text-white shadow-lg hover:scale-105 transition-transform duration-300 text-center`}
                >
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 flex flex-col items-center">
                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-sm text-gray-100">
                      {benefit.description}
                    </p>
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
                Sponsorship Packages
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Choose the level that best matches your goals. From community
                partners to our exclusive Platinum tier, each package offers a
                clear way to support CTS while engaging with Canada&apos;s next
                wave of tech leaders.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ type: "tween", duration: 0.5 }}
              viewport={{ margin: "-50px", once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            >
              {sponsorshipTiers.map((tier, index) => (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                >
                  <div
                    className={`bg-gradient-to-r ${tier.headerColor} p-4 flex flex-col items-center justify-center`}
                  >
                    <h3 className="text-2xl font-bold text-white text-center">
                      {tier.name}
                    </h3>
                    <p className="text-white/90 text-base mt-1">{tier.price}</p>
                  </div>
                  <div className="p-6 flex-grow">
                    <ul className="space-y-3">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-violet-500 mr-2">•</span>
                          <span className="text-gray-700 text-base">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Sponsorship Benefits Table */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ type: "tween", duration: 0.5 }}
              viewport={{ margin: "-50px", once: true }}
              className="mt-12 max-w-5xl mx-auto"
            >
              <h3 className="text-2xl font-bold text-center mb-6">
                Sponsorship Benefits at a Glance
              </h3>
              <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">
                        Benefit
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        Community
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        Silver
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        Gold
                      </th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">
                        Platinum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      {
                        label: "Event access",
                        community: true,
                        silver: true,
                        gold: true,
                        platinum: true,
                      },
                      {
                        label: "Social media recognition",
                        community: false,
                        silver: true,
                        gold: true,
                        platinum: true,
                      },
                      {
                        label: "Ceremony recognition",
                        community: false,
                        silver: true,
                        gold: true,
                        platinum: true,
                      },
                      {
                        label: "Access to student portfolios",
                        community: false,
                        silver: true,
                        gold: true,
                        platinum: true,
                      },
                      {
                        label: "Dedicated booth",
                        community: false,
                        silver: false,
                        gold: true,
                        platinum: true,
                      },
                      {
                        label: "Coffee chat session",
                        community: false,
                        silver: false,
                        gold: true,
                        platinum: true,
                      },
                      {
                        label: "Panel/judge position",
                        community: false,
                        silver: false,
                        gold: true,
                        platinum: true,
                      },
                      {
                        label: "Priority brand placement",
                        community: false,
                        silver: false,
                        gold: false,
                        platinum: true,
                      },
                      {
                        label: "Named award/category",
                        community: false,
                        silver: false,
                        gold: false,
                        platinum: true,
                      },
                      {
                        label: "Keynote presentation",
                        community: false,
                        silver: false,
                        gold: false,
                        platinum: true,
                      },
                      {
                        label: "“Presented by” distinction",
                        community: false,
                        silver: false,
                        gold: false,
                        platinum: true,
                      },
                    ].map((row, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-gray-700">
                          {row.label}
                        </td>
                        {["community", "silver", "gold", "platinum"].map(
                          (tierKey) => (
                            <td
                              key={tierKey}
                              className="px-4 py-3 text-center"
                            >
                              {(row as any)[tierKey] ? "✔️" : "—"}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* CTA Box */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ type: "tween", duration: 0.5 }}
              viewport={{ margin: "-50px", once: true }}
              className="mt-12 max-w-4xl mx-auto"
            >
                <div className="bg-[#3B0B8F] rounded-xl p-8 text-white relative overflow-hidden w-full text-center">
                <div className="absolute inset-0 opacity-10">
                  <Image
                  src="/gallery/gallery1.jpeg"
                  alt="Canadian Tech Summit"
                  fill
                  className="object-cover"
                  />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <h3 className="text-2xl font-bold mb-3">
                  Interested in Sponsoring the Canadian Tech Summit?
                  </h3>
                  <p className="text-sm text-gray-200 mb-6 max-w-lg mx-auto">
                  Join us in fostering tomorrow&apos;s tech talent. 
                  Explore sponsorships, partnerships, or custom engagement
                  opportunities that inspire innovation and empower 
                  the next generation of technology leaders.
                  </p>
                  <button
                    onClick={() => router.push("/contact?sponsor=true")}
                    className="tracking-widest rounded-full font-semibold text-purple-600 bg-white hover:bg-gray-100 px-8 py-3 transition-all duration-300 ease-in-out shadow-sm hover:shadow-lg"
                  >
                    Sponsor Now
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
                Our Legacy & Past Events
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                A look at workshops, expos, networking dinners, and technical competitions led by WCS.
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
                    transform: `translateX(-${currentEventIndex * (100 / itemsToShow)
                      }%)`,
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
                Recognizing Our Sponsors & Partners
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                We&apos;re grateful to the organizations and individuals who
                have supported Western Cyber Society and the Canadian Tech
                Summit journey—from early expos to today&apos;s flagship summit.
                Your partnership helps us build an inclusive, forward-looking
                tech community.
              </p>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ type: "tween", duration: 0.5 }}
              viewport={{ margin: "-50px", once: true }}
              className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto"
            >

              {sponsorLogos.map((logo, index) => (
                <div
                  key={index}
                  className="relative bg-white rounded-lg shadow-md w-40 h-24 flex items-center justify-center hover:shadow-lg transition-shadow duration-300"
                >
                  <Image
                    src={logo.src}
                    alt={`Sponsor ${index + 1}`}
                    fill
                    className="object-contain p-2"
                    style={{ transform: `scale(${logo.scale})` }}
                  />
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
