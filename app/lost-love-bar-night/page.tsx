"use client";
import React from "react";
import Navbar from "../components/LandingNavbar";
import Footer from "../components/footer";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function LostLoveBarNight() {
  const router = useRouter();
  const { user, profileData } = useUser();

  const handleGetWristband = async () => {
    if (!user?.userId) {
      router.push(
        `/sign-in?redirect=${encodeURIComponent("/lost-love-bar-night/ticket")}`
      );
      return;
    }

    // Both VIP and Basic members go to payment page (VIP pays $5, Basic pays $8)
    router.push("/lost-love-bar-night/ticket");
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
              style={{ backgroundImage: "url('/background.jpg')" }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center px-6 py-12 max-w-3xl mx-auto">
                  <h1 className="text-xl md:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Lost Love Bar Night
                  </h1>
                  <p className="text-sm md:text-lg md:text-xl leading-relaxed">
                    Join us at Lost Love Social House for an unforgettable bar night! Purchase wristbands and skip the line.
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
                    About Lost Love Bar Night
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    Come join us at our bar night at Lost Love Social House! Purchase our wristbands and skip the line - straight inside. Pickup location at Weldon (date TBA). This event is 19+.
                  </p>

                  {/* Event Image */}
                  {/*<div className="relative w-full h-[50vw] md:h-[40vw] lg:h-[30vw] rounded-lg overflow-hidden my-8">
                    <Image
                      src="/lostlovewcs.jpeg"
                      alt="Lost Love Bar Night Event"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>*/}

                  {/* Event Details */}
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      Event Details
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <i className="fa-solid fa-calendar text-violet-600 mr-3 mt-1"></i>
                        <span><strong>Date:</strong> Saturday, January 24, 2026</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-clock text-violet-600 mr-3 mt-1"></i>
                        <span><strong>Time:</strong> 10:00 PM</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-location-dot text-violet-600 mr-3 mt-1"></i>
                        <span><strong>Location:</strong> Lost Love Social House - 153 Carling St</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-user-check text-violet-600 mr-3 mt-1"></i>
                        <span><strong>Age:</strong> 19+</span>
                      </li>
                    </ul>
                  </div>

                  {/* What to Expect */}
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                      What You Get
                    </h3>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-violet-600 mr-3 mt-1"></i>
                        <span>🔥 $8 Lost Love Entry (Non-Members) / $5 for VIP Members</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-violet-600 mr-3 mt-1"></i>
                        <span>🚫⏳ Skip the line - straight inside</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fa-solid fa-check-circle text-violet-600 mr-3 mt-1"></i>
                        <span>📍 Pickup at Weldon (date TBA)</span>
                      </li>
                    </ul>
                  </div>

                  {/* Get Wristband Button */}
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleGetWristband}
                      className="bg-violet-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-violet-700 transition-colors shadow-lg"
                    >
                      <i className="fa-solid fa-ticket mr-2"></i>
                      Get Your Wristband
                    </button>
                    {profileData?.plan === "VIP" && (
                      <p className="mt-3 text-green-600 font-semibold">
                        <i className="fa-solid fa-gift mr-2"></i>
                        VIP members: $5 CAD per wristband
                      </p>
                    )}
                    {profileData?.plan === "Basic" && (
                      <p className="mt-3 text-gray-600">
                        Non-members: $8 CAD per wristband
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
