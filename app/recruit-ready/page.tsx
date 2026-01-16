"use client";
import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function RecruitReady() {
  const router = useRouter();
  const { user, profileData } = useUser();

  const handleGetTicket = async () => {
    if (!user?.userId) {
      router.push(
        `/sign-in?redirect=${encodeURIComponent("/recruit-ready/ticket")}`
      );
      return;
    }

    // Check if profileData is loaded and shows VIP
    if (profileData?.plan === "VIP") {
      router.push("/recruit-ready/rsvp");
      return;
    }

    // If profileData is not loaded yet, check VIP status via API
    if (profileData === null && user?.userId) {
      try {
        const response = await fetch("/api/check-vip");
        if (response.ok) {
          const data = await response.json();
          if (data.isVIP) {
            router.push("/recruit-ready/rsvp");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking VIP status:", error);
      }
    }

    // Default: Basic members go to payment page
    router.push("/recruit-ready/ticket");
  };

  return (
    <>
      <main>
        <div>
          <Navbar />
          <div className="text-black">
            {/* Hero Section */}
            <section
              className="mt-20 md:mt-16 relative w-full h-[70vw] sm:h-[55vw] md:h-[30vw] bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/projectBg.jpg')" }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
                  <h1 className="text-xl md:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Recruit Ready
                  </h1>
                  <p className="text-sm md:text-lg md:text-xl leading-relaxed">
                    Get ready for recruitment season with our comprehensive
                    workshop series designed to prepare you for interviews and
                    networking.
                  </p>
                </div>
              </div>
            </section>

            {/* Content Section */}
            <div className="mx-10 mb-10 mt-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "-100px", once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    About Recruit Ready
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Recruit Ready is your ultimate preparation guide for the
                    upcoming recruitment season. We bring you industry experts
                    and successful students to share their secrets on landing
                    your dream job.
                  </p>

                  {/* Event Image - Placeholder using projectBg or similar for now */}
                  <div className="relative w-full h-[50vw] md:h-[40vw] lg:h-[30vw] rounded-lg overflow-hidden my-8">
                    <Image
                      src="/projectBg.jpg"
                      alt="Recruit Ready Event"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Additional Content */}
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      What to Expect
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-violet-600 mr-3 mt-1"></i>
                        <span>Resume and Cover Letter workshops</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-violet-600 mr-3 mt-1"></i>
                        <span>Interview Tips with feedback</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-violet-600 mr-3 mt-1"></i>
                        <span>Professional Headshots</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-violet-600 mr-3 mt-1"></i>
                        <span>Networking and Coffee Chat Tips</span>
                      </li>
                    </ul>
                  </div>

                  {/* Get Ticket Button */}
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleGetTicket}
                      className="bg-violet-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-violet-700 transition-colors shadow-lg"
                    >
                      <i className="fa-solid fa-ticket mr-2"></i>
                      Get Your Ticket
                    </button>
                    {profileData?.plan === "VIP" && (
                      <p className="mt-3 text-green-600 font-semibold">
                        <i className="fa-solid fa-gift mr-2"></i>
                        VIP members get free tickets!
                      </p>
                    )}
                    {profileData?.plan === "Basic" && (
                      <p className="mt-3 text-gray-600">
                        Non-members: $2 CAD per ticket
                      </p>
                    )}
                    {!profileData && user?.userId && (
                      <p className="mt-3 text-gray-600">
                        Pricing based on membership level
                      </p>
                    )}
                  </div>
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
