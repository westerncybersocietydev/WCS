"use client";
import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function IBMNight() {
  const router = useRouter();
  const { user, profileData } = useUser();

  const handleGetTicket = async () => {
    if (!user?.userId) {
      router.push(`/sign-in?redirect=${encodeURIComponent("/ibm-night/ticket")}`);
      return;
    }

    // Check if profileData is loaded and shows VIP
    if (profileData?.plan === "VIP") {
      router.push("/ibm-night/rsvp");
      return;
    }

    // If profileData is not loaded yet, check VIP status via API
    if (profileData === null && user?.userId) {
      try {
        const response = await fetch("/api/check-vip");
        if (response.ok) {
          const data = await response.json();
          if (data.isVIP) {
            router.push("/ibm-night/rsvp");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking VIP status:", error);
      }
    }

    // Default: Basic members go to payment page
    router.push("/ibm-night/ticket");
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
              style={{ backgroundImage: "url('/IBMN.png')" }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
                  <h1 className="text-xl md:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    IBM Night
                  </h1>
                  <p className="text-sm md:text-lg md:text-xl leading-relaxed">
                    An evening of innovation and technology exploration hosted by
                    IBM, showcasing their latest advancements and opportunities.
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
                    About IBM Night
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Join us for an exclusive evening with IBM, where you&apos;ll
                    have the opportunity to explore cutting-edge technology,
                    network with industry professionals, and discover exciting
                    career opportunities.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    This event brings together students, tech enthusiasts, and
                    IBM representatives for an engaging experience filled with
                    innovation, insights, and inspiration.
                  </p>

                  {/* Event Image */}
                  <div className="relative w-full h-[50vw] md:h-[40vw] lg:h-[30vw] rounded-lg overflow-hidden my-8">
                    <Image
                      src="/IBMN.png"
                      alt="IBM Night Event"
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
                        <span>
                          Interactive presentations on IBM&apos;s latest
                          technologies and innovations
                        </span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-violet-600 mr-3 mt-1"></i>
                        <span>
                          Networking opportunities with IBM professionals and
                          fellow students
                        </span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-violet-600 mr-3 mt-1"></i>
                        <span>
                          Career insights and information about internships and
                          full-time positions
                        </span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-violet-600 mr-3 mt-1"></i>
                        <span>
                          Hands-on demonstrations and technology showcases
                        </span>
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

